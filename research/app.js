(() => {
  "use strict";

  const LANGUAGES = ["en", "ar", "fr", "es", "de", "tr", "ko", "ja", "zh"];
  const CATEGORIES = ["Development", "Economy", "Battle"];
  const STORAGE_KEY = "saifksResearchV4";
  const LEGACY_STORAGE_KEY = "saifksResearchV3";
  const RESOURCE_KEYS = ["bread", "wood", "stone", "iron", "gold"];
  const translations = window.RESEARCH_I18N || { ui: {}, names: {}, stats: {} };
  const extra = window.RESEARCH_EXTRA_TRANSLATIONS || {};
  const UI = translations.ui || {};
  const NAMES = translations.names || {};
  const STATS = translations.stats || {};
  let language = LANGUAGES.includes(window.__SAIFKS_LANGUAGE__) ? window.__SAIFKS_LANGUAGE__ : "en";
  let database = { technologies: [] };
  let technologyById = new Map();
  let state = loadState();
  let toastTimer;

  const NEW_UI = {
    settingsTitle: { en: "Plan settings", ar: "إعداد الخطة" },
    settingsEyebrow: { en: "PLAN SETTINGS", ar: "إعدادات الخطة" },
    treeEyebrow: { en: "RESEARCH TREE", ar: "شجرة البحوث" },
    summaryEyebrow: { en: "TOTALS", ar: "الإجمالي" },
    selectedEyebrow: { en: "SELECTED", ar: "المختارة" },
    seconds: { en: "sec", ar: "ث" },
    unknownPower: { en: "Some levels have no verified power value", ar: "بعض المستويات لا تملك قيمة قوة موثقة" },
    dataError: { en: "Research data could not be loaded. Refresh the page.", ar: "تعذر تحميل بيانات البحوث. حدّث الصفحة." },
    copied: { en: "Summary copied", ar: "تم نسخ الملخص" },
    cleared: { en: "Plan deleted", ar: "تم حذف الخطة" },
    saved: { en: "Plan saved", ar: "تم حفظ الخطة" },
    resetConfirm: { en: "Reset the complete research plan?", ar: "هل تريد إعادة ضبط خطة البحوث بالكامل؟" },
    deletePlanConfirm: { en: "Delete all selected researches?", ar: "هل تريد حذف جميع البحوث المختارة؟" }
  };
  const SINGULAR_UNITS = {
    ar: { days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" },
    en: { days: "day", hours: "hour", minutes: "minute", seconds: "sec" },
    fr: { days: "jour", hours: "heure", minutes: "minute", seconds: "s" },
    es: { days: "día", hours: "hora", minutes: "minuto", seconds: "s" },
    de: { days: "Tag", hours: "Stunde", minutes: "Minute", seconds: "s" }
  };

  mergeExtraTranslations();

  function mergeExtraTranslations() {
    const nameKeys = Object.keys(NAMES);
    const statKeys = Object.keys(STATS);
    for (const [lang, values] of Object.entries(extra.names || {})) {
      nameKeys.forEach((key, index) => { if (values[index]) NAMES[key][lang] = values[index]; });
    }
    for (const [lang, values] of Object.entries(extra.stats || {})) {
      statKeys.forEach((key, index) => { if (values[index]) STATS[key][lang] = values[index]; });
    }
    const legendKeys = ["notResearched", "researched", "inPlan", "currentLevel", "targetLevel", "saveLevelsOnly"];
    for (const [lang, values] of Object.entries(extra.legend || {})) {
      legendKeys.forEach((key, index) => { (UI[key] ||= {})[lang] = values[index]; });
    }
  }

  function tr(key) {
    return UI[key]?.[language] || NEW_UI[key]?.[language] || UI[key]?.en || NEW_UI[key]?.en || key;
  }

  function loadState() {
    const fallback = { category: "Development", levels: {}, plan: [], bonus: 0, speedupDays: 0, speedupHours: 0, speedupMinutes: 0 };
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      return { ...fallback, ...saved, levels: saved.levels && typeof saved.levels === "object" ? saved.levels : {}, plan: Array.isArray(saved.plan) ? saved.plan : [] };
    } catch (_) {
      try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(LEGACY_STORAGE_KEY); } catch (_) {}
      return fallback;
    }
  }

  function sanitizeState() {
    if (!CATEGORIES.includes(state.category)) state.category = "Development";
    state.bonus = positiveNumber(state.bonus);
    state.speedupDays = wholeNumber(state.speedupDays ?? Math.floor(positiveNumber(state.speedups) / 24));
    state.speedupHours = Math.min(23, wholeNumber(state.speedupHours ?? positiveNumber(state.speedups) % 24));
    state.speedupMinutes = Math.min(59, wholeNumber(state.speedupMinutes));
    const cleanedLevels = {};
    for (const [id, saved] of Object.entries(state.levels || {})) {
      const tech = technologyById.get(id);
      if (!tech || !saved) continue;
      const current = clamp(wholeNumber(saved.current), 0, tech.max_level);
      const target = clamp(wholeNumber(saved.target), current, tech.max_level);
      if (current || target) cleanedLevels[id] = { current, target };
    }
    state.levels = cleanedLevels;
    state.plan = [...new Set(state.plan)].filter(id => {
      const selected = cleanedLevels[id];
      return technologyById.has(id) && selected && selected.target > selected.current;
    });
    saveState();
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function positiveNumber(value) { const number = Number(value); return Number.isFinite(number) ? Math.max(0, number) : 0; }
  function wholeNumber(value) { return Math.floor(positiveNumber(value)); }
  function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, value)); }
  function escapeHTML(value) { return String(value ?? "").replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]); }

  function translatedName(technologyOrName, arabicName) {
    const name = typeof technologyOrName === "object" ? technologyOrName.name : technologyOrName;
    const nameAr = typeof technologyOrName === "object" ? technologyOrName.name_ar : arabicName;
    if (language === "ar" && nameAr) return nameAr;
    const match = String(name || "").match(/^(.*?)(\s+[IVX]+)?$/);
    const base = match?.[1] || name;
    return (NAMES[base]?.[language] || base) + (match?.[2] || "");
  }

  function translatedStat(prefix) { return STATS[prefix]?.[language] || prefix; }
  function effectNumber(value) {
    const match = String(value || "").match(/^\s*([+-]?\d[\d,]*(?:\.\d+)?)\s*([KMB])?/i);
    if (!match) return 0;
    return Number(match[1].replaceAll(",", "")) * ({ K: 1e3, M: 1e6, B: 1e9 }[match[2]?.toUpperCase()] || 1);
  }
  function effectLabel(technology) {
    const summary = String(technology.buff_summary || "");
    const key = Object.keys(STATS).sort((a, b) => b.length - a.length).find(item => summary.startsWith(item));
    if (key) return translatedStat(key);
    const name = String(technology.name || "").replace(/\s+[IVX]+$/, "");
    const nameAr = String(technology.name_ar || "").replace(/\s+[IVX]+$/, "");
    return translatedName(name, nameAr);
  }
  function effectDelta(technology, current, target) {
    const currentRow = technology.levels.find(level => level.level === current);
    const targetRow = technology.levels.find(level => level.level === target);
    const delta = effectNumber(targetRow?.effect) - effectNumber(currentRow?.effect);
    const unit = String(technology.levels[0]?.effect || "").includes("%") ? "%" : "";
    return `${effectLabel(technology)} ${delta > 0 ? "+" : ""}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(delta)}${unit}`;
  }

  function formatNumber(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "—";
    if (Math.abs(number) >= 1e9) return trimDecimal(number / 1e9, 2) + "B";
    if (Math.abs(number) >= 1e6) return trimDecimal(number / 1e6, 2) + "M";
    if (Math.abs(number) >= 1e3) return trimDecimal(number / 1e3, 1) + "K";
    return Math.round(number).toLocaleString("en-US");
  }
  function trimDecimal(number, digits) { return number.toFixed(digits).replace(/\.?0+$/, ""); }
  function durationPart(value, unit) {
    const label = value === 1 ? SINGULAR_UNITS[language]?.[unit] || tr(unit) : tr(unit);
    return `${value} ${label}`;
  }
  function duration(totalSeconds) {
    let seconds = Math.max(0, Math.round(Number(totalSeconds) || 0));
    if (!seconds) return `0 ${tr("minutes")}`;
    const days = Math.floor(seconds / 86400); seconds %= 86400;
    const hours = Math.floor(seconds / 3600); seconds %= 3600;
    const minutes = Math.floor(seconds / 60); seconds %= 60;
    const parts = [];
    if (days) parts.push(durationPart(days, "days"));
    if (hours) parts.push(durationPart(hours, "hours"));
    if (minutes) parts.push(durationPart(minutes, "minutes"));
    if (seconds && !days) parts.push(durationPart(seconds, "seconds"));
    return parts.join(" ");
  }

  function categoryName(category) { return tr(category === "Development" ? "development" : category === "Economy" ? "economy" : "battle"); }
  function config(id) { return state.levels[id] || { current: 0, target: 0 }; }
  function levelOptions(maximum, selected, minimum = 0) {
    let html = "";
    for (let level = minimum; level <= maximum; level += 1) html += `<option value="${level}"${level === selected ? " selected" : ""}>${level}</option>`;
    return html;
  }

  function renderTabs() {
    const tabs = document.getElementById("tabs");
    tabs.innerHTML = CATEGORIES.map(category => `<button class="tab${state.category === category ? " active" : ""}" type="button" data-category="${category}" aria-pressed="${state.category === category}">${escapeHTML(categoryName(category))}</button>`).join("");
  }

  function researchCard(technology) {
    const selected = config(technology.id);
    const target = Math.max(selected.current, selected.target);
    const status = state.plan.includes(technology.id) ? " in-plan" : selected.current === technology.max_level ? " is-max" : selected.current > 0 ? " in-progress" : "";
    const currentControl = `<label><small>${escapeHTML(tr("current"))}</small><select data-level="current" data-id="${escapeHTML(technology.id)}" aria-label="${escapeHTML(tr("current"))}">${levelOptions(technology.max_level, selected.current)}</select></label>`;
    const targetControl = `<label><small>${escapeHTML(tr("target"))}</small><select data-level="target" data-id="${escapeHTML(technology.id)}" aria-label="${escapeHTML(tr("target"))}">${levelOptions(technology.max_level, target, selected.current)}</select></label>`;
    const controls = language === "ar" ? `${targetControl}<span class="arrow">←</span>${currentControl}` : `${currentControl}<span class="arrow">→</span>${targetControl}`;
    return `<article class="research-card${status}" data-card="${escapeHTML(technology.id)}"><div class="research-name">${escapeHTML(translatedName(technology))}</div><div class="levels">${controls}</div><div class="effect">${escapeHTML(effectDelta(technology, selected.current, target))}</div></article>`;
  }

  function renderTree() {
    const items = database.technologies.filter(technology => technology.category === state.category).sort((a, b) => a.tree_order - b.tree_order);
    const rows = new Map();
    for (const technology of items) {
      if (!rows.has(technology.tree_row)) rows.set(technology.tree_row, []);
      rows.get(technology.tree_row).push(technology);
    }
    document.getElementById("treeTitle").textContent = `${tr("tree")} · ${categoryName(state.category)}`;
    document.getElementById("treeMeta").textContent = `${items.length} ${tr("of")} ${items.length} ${tr("research")}`;
    document.getElementById("tree").innerHTML = [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([_, row], index) => {
      let ordered = row.sort((a, b) => a.tree_col - b.tree_col);
      if (language === "ar" && state.category !== "Development" && ordered.length > 1) ordered = [...ordered].reverse();
      return `<section class="tier"><span class="tier-label">${index + 1}</span><div class="nodes row-${ordered.length}">${ordered.map(researchCard).join("")}</div></section>`;
    }).join("");
  }

  function totals() {
    const total = { time: 0, power: 0, unknownPower: 0, resources: Object.fromEntries(RESOURCE_KEYS.map(key => [key, 0])) };
    for (const id of state.plan) {
      const technology = technologyById.get(id);
      if (!technology) continue;
      const selected = config(id);
      for (const level of technology.levels.filter(item => item.level > selected.current && item.level <= selected.target)) {
        total.time += positiveNumber(level.time_seconds);
        if (Number.isFinite(level.power)) total.power += level.power;
        else total.unknownPower += 1;
        for (const key of RESOURCE_KEYS) total.resources[key] += positiveNumber(level.resources?.[key]);
      }
    }
    return total;
  }
  function speedupSeconds() { return state.speedupDays * 86400 + state.speedupHours * 3600 + state.speedupMinutes * 60; }

  function renderSummary() {
    const total = totals();
    const afterBonus = total.time / (1 + state.bonus / 100);
    const used = Math.min(afterBonus, speedupSeconds());
    const remaining = Math.max(0, afterBonus - speedupSeconds());
    const countText = `${state.plan.length} ${tr("planCount")}`;
    document.getElementById("planCount").textContent = countText;
    document.getElementById("selectedCount").textContent = state.plan.length;
    document.getElementById("mobilePlanCount").textContent = state.plan.length;
    document.getElementById("baseTime").textContent = duration(total.time);
    document.getElementById("bonusTime").textContent = duration(afterBonus);
    document.getElementById("usedSpeedups").textContent = duration(used);
    document.getElementById("remainingTime").textContent = duration(remaining);
    document.getElementById("mobileRemaining").textContent = duration(remaining);
    document.getElementById("power").textContent = formatNumber(total.power);
    const warning = document.getElementById("powerWarning");
    warning.hidden = total.unknownPower === 0;
    warning.textContent = total.unknownPower ? `${tr("unknownPower")} (${total.unknownPower})` : "";
    document.getElementById("resources").innerHTML = RESOURCE_KEYS.map(key => `<div class="resource"><span>${escapeHTML(tr(key))}</span><b>${formatNumber(total.resources[key])}</b></div>`).join("");
  }

  function renderPlan() {
    const list = document.getElementById("planList");
    if (!state.plan.length) {
      list.innerHTML = `<div class="empty-plan">${escapeHTML(tr("emptyPlan"))}</div>`;
      return;
    }
    list.innerHTML = state.plan.map(id => {
      const technology = technologyById.get(id);
      const selected = config(id);
      return `<article class="plan-item"><div class="plan-title"><b>${escapeHTML(translatedName(technology))}</b><button class="remove-plan" type="button" data-remove="${escapeHTML(id)}" aria-label="${escapeHTML(tr("clear"))} ${escapeHTML(translatedName(technology))}">×</button></div><div class="plan-details"><span class="level-range">${selected.current} → ${selected.target}</span><span>${escapeHTML(effectDelta(technology, selected.current, selected.target))}</span></div></article>`;
    }).join("");
  }

  function renderAll() { renderTabs(); renderTree(); renderSummary(); renderPlan(); }

  function updateLevel(id, type, rawValue) {
    const technology = technologyById.get(id);
    if (!technology) return;
    const old = config(id);
    let current = old.current;
    let target = old.target;
    if (type === "current") { current = clamp(wholeNumber(rawValue), 0, technology.max_level); target = Math.max(current, target); }
    else target = clamp(wholeNumber(rawValue), current, technology.max_level);
    state.levels[id] = { current, target };
    if (target > current && !state.plan.includes(id)) state.plan.push(id);
    if (target <= current) state.plan = state.plan.filter(item => item !== id);
    if (!current && !target) delete state.levels[id];
    saveState(); renderTree(); renderSummary(); renderPlan(); toast(tr("saved"));
  }

  function applyLanguage() {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.getElementById("languageSelect").value = language;
    const labels = {
      pageTitle: "pageTitle", homeLink: "home", settingsTitle: "settingsTitle", settingsEyebrow: "settingsEyebrow",
      treeEyebrow: "treeEyebrow", summaryEyebrow: "summaryEyebrow", selectedEyebrow: "selectedEyebrow",
      bonusLabel: "bonusLabel", speedupsLabel: "speedupsLabel", daysLabel: "days", hoursLabel: "hours", minutesLabel: "minutes",
      resetAll: "reset", legendNew: "notResearched", legendDone: "researched", legendPlan: "inPlan",
      summaryTitle: "summary", mobileSummaryLabel: "summary", mobileRemainingLabel: "remainingTime",
      baseTimeLabel: "baseTime", bonusTimeLabel: "afterBonus", usedSpeedupsLabel: "usedSpeedups", remainingTimeLabel: "remainingTime",
      powerLabel: "power", selectedTitle: "selected", copyPlan: "copy", clearPlan: "clear"
    };
    for (const [id, key] of Object.entries(labels)) document.getElementById(id).textContent = tr(key);
    document.getElementById("brandHomeLink").setAttribute("aria-label", tr("home"));
    document.title = `SaifKS · ${tr("pageTitle")}`;
    const homeUrl = new URL("../index.html", location.href); homeUrl.searchParams.set("lang", language);
    document.getElementById("homeLink").href = homeUrl.href; document.getElementById("brandHomeLink").href = homeUrl.href;
    try {
      localStorage.setItem("saifksLanguage", language); localStorage.setItem("saifRallyLang", language); localStorage.setItem("language", language);
    } catch (_) {}
    renderAll();
  }

  function copySummary() {
    const total = totals();
    const afterBonus = total.time / (1 + state.bonus / 100);
    const remaining = Math.max(0, afterBonus - speedupSeconds());
    const lines = [tr("summary"), ""];
    for (const id of state.plan) { const tech = technologyById.get(id); const selected = config(id); lines.push(`${translatedName(tech)}: ${selected.current} → ${selected.target} (${effectDelta(tech, selected.current, selected.target)})`); }
    lines.push("", `${tr("bonusLabel")}: ${state.bonus}%`, `${tr("baseTime")}: ${duration(total.time)}`, `${tr("afterBonus")}: ${duration(afterBonus)}`, `${tr("remainingTime")}: ${duration(remaining)}`, `${tr("power")}: ${formatNumber(total.power)}${total.unknownPower ? " + ?" : ""}`);
    for (const key of RESOURCE_KEYS) lines.push(`${tr(key)}: ${formatNumber(total.resources[key])}`);
    const text = lines.join("\n");
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => toast(tr("copied"))).catch(() => fallbackCopy(text));
    else fallbackCopy(text);
  }
  function fallbackCopy(text) { const area = document.createElement("textarea"); area.value = text; area.setAttribute("readonly", ""); area.style.cssText = "position:fixed;opacity:0;pointer-events:none"; document.body.append(area); area.select(); document.execCommand("copy"); area.remove(); toast(tr("copied")); }
  function toast(message) { const element = document.getElementById("toast"); element.textContent = message; element.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => element.classList.remove("show"), 1700); }

  function bindEvents() {
    document.getElementById("tabs").addEventListener("click", event => { const button = event.target.closest("[data-category]"); if (!button) return; state.category = button.dataset.category; saveState(); renderAll(); scrollTo({ top: 0, behavior: "smooth" }); });
    document.getElementById("tree").addEventListener("change", event => { const select = event.target.closest("select[data-level]"); if (select) updateLevel(select.dataset.id, select.dataset.level, select.value); });
    document.getElementById("planList").addEventListener("click", event => { const button = event.target.closest("[data-remove]"); if (!button) return; state.plan = state.plan.filter(id => id !== button.dataset.remove); const saved = state.levels[button.dataset.remove]; if (saved) state.levels[button.dataset.remove] = { current: saved.current, target: saved.current }; saveState(); renderAll(); });
    const numericInputs = {
      researchBonus: value => { state.bonus = positiveNumber(value); },
      speedupDays: value => { state.speedupDays = wholeNumber(value); },
      speedupHours: value => { state.speedupHours = Math.min(23, wholeNumber(value)); },
      speedupMinutes: value => { state.speedupMinutes = Math.min(59, wholeNumber(value)); }
    };
    for (const [id, update] of Object.entries(numericInputs)) document.getElementById(id).addEventListener("input", event => { update(event.target.value); if (id === "speedupHours") event.target.value = state.speedupHours || ""; if (id === "speedupMinutes") event.target.value = state.speedupMinutes || ""; saveState(); renderSummary(); });
    document.getElementById("copyPlan").addEventListener("click", copySummary);
    document.getElementById("clearPlan").addEventListener("click", () => { if (!state.plan.length || confirm(tr("deletePlanConfirm"))) { state.plan = []; for (const id of Object.keys(state.levels)) state.levels[id].target = state.levels[id].current; saveState(); renderAll(); toast(tr("cleared")); } });
    document.getElementById("resetAll").addEventListener("click", () => { if (!confirm(tr("resetConfirm"))) return; state = { category: state.category, levels: {}, plan: [], bonus: 0, speedupDays: 0, speedupHours: 0, speedupMinutes: 0 }; syncInputs(); saveState(); renderAll(); toast(tr("resetDone")); });
    document.getElementById("languageSelect").addEventListener("change", event => { language = LANGUAGES.includes(event.target.value) ? event.target.value : "en"; const url = new URL(location.href); url.searchParams.set("lang", language); history.replaceState(null, "", url); applyLanguage(); });
    window.addEventListener("storage", event => { if (["saifksLanguage", "saifRallyLang", "language"].includes(event.key) && LANGUAGES.includes(event.newValue)) { language = event.newValue; applyLanguage(); } });
  }

  function syncInputs() {
    document.getElementById("researchBonus").value = state.bonus || "";
    document.getElementById("speedupDays").value = state.speedupDays || "";
    document.getElementById("speedupHours").value = state.speedupHours || "";
    document.getElementById("speedupMinutes").value = state.speedupMinutes || "";
  }

  async function start() {
    bindEvents();
    try {
      const response = await fetch("research-database.json?v=2-clean-20260929", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      database = await response.json();
      if (!Array.isArray(database.technologies) || database.technologies.length !== 191) throw new Error("Invalid research dataset");
      technologyById = new Map(database.technologies.map(technology => [technology.id, technology]));
      sanitizeState(); syncInputs(); applyLanguage();
      document.getElementById("loadingState").hidden = true;
      document.getElementById("tree").hidden = false;
    } catch (error) {
      const loading = document.getElementById("loadingState"); loading.classList.add("error"); loading.textContent = tr("dataError");
      console.error("Research data load failed", error);
    } finally {
      document.documentElement.classList.remove("is-loading");
    }
  }

  start();
})();
