
const $ = (s) => document.querySelector(s);

let DB;
let tree = "economy";
let lang = localStorage.getItem("saifks-lang") || "ar";

const numberValue = (id) => Math.max(0, Number($(id).value) || 0);

const formatNumber = (value) =>
  new Intl.NumberFormat(lang === "ar" ? "ar-AE" : "en-AE", {
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(Math.round(value));

const formatTime = (seconds) => {
  seconds = Math.max(0, Math.round(seconds));
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (d) parts.push(`${d}${lang === "ar" ? " يوم" : "d"}`);
  if (h) parts.push(`${h}${lang === "ar" ? " ساعة" : "h"}`);
  if (m || parts.length === 0) parts.push(`${m}${lang === "ar" ? " دقيقة" : "m"}`);
  return parts.join(" ");
};

const text = (ar, en) => (lang === "ar" ? ar : en);
const activeTree = () => DB.trees.find((item) => item.id === tree);
const activeTech = () =>
  activeTree()?.techs.find((item) => item.id === $("#tech").value);

function applyLanguage() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-ar]").forEach((element) => {
    element.textContent = element.dataset[lang];
  });

  $("#lang").textContent = lang === "ar" ? "EN" : "عربي";
  localStorage.setItem("saifks-lang", lang);
}

function completedTechs(treeObject) {
  return treeObject.techs.filter(
    (technology) =>
      Array.isArray(technology.levels) &&
      technology.levels.length === technology.maxLevel
  );
}

function renderTabs() {
  const container = $("#tabs");
  container.innerHTML = "";

  DB.trees.forEach((treeObject) => {
    const readyCount = completedTechs(treeObject).length;
    const button = document.createElement("button");
    button.className = `tab${treeObject.id === tree ? " active" : ""}`;
    button.innerHTML = `
      <b>${treeObject.name[lang]}</b>
      <small>${readyCount} ${text("جاهز للحساب", "ready to calculate")}</small>
    `;

    button.addEventListener("click", () => {
      tree = treeObject.id;
      renderTabs();
      renderTechnologies();
    });

    container.appendChild(button);
  });
}

function renderTechnologies() {
  const select = $("#tech");
  const ready = completedTechs(activeTree());

  select.innerHTML = "";

  if (ready.length === 0) {
    select.add(
      new Option(
        text("لا توجد بيانات مستويات مكتملة حالياً", "No complete level data yet"),
        ""
      )
    );
    select.disabled = true;
    $("#meta").textContent = text(
      "بيانات هذه الشجرة موجودة في القاعدة، لكن تكاليف المستويات لم تظهر كاملة في ملف المصدر.",
      "This tree is in the database, but its full per-level costs were not exposed in the source file."
    );
    clearLevelSelectors();
    calculate();
    return;
  }

  select.disabled = false;
  ready.forEach((technology) =>
    select.add(new Option(technology.name, technology.id))
  );

  renderLevels();
}

function clearLevelSelectors() {
  ["#cur", "#target"].forEach((id) => {
    $(id).innerHTML = "";
    $(id).disabled = true;
  });
}

function renderLevels() {
  const technology = activeTech();
  if (!technology) {
    clearLevelSelectors();
    calculate();
    return;
  }

  $("#meta").textContent = `${technology.description} · ${technology.range} · Max ${technology.maxLevel}`;

  const current = $("#cur");
  current.disabled = false;
  current.innerHTML = "";

  for (let level = 0; level < technology.maxLevel; level += 1) {
    current.add(
      new Option(
        level === 0
          ? text("0 — غير مطور", "0 — Not researched")
          : String(level),
        level
      )
    );
  }

  current.value = "0";
  renderTargetLevels();
}

function renderTargetLevels() {
  const technology = activeTech();
  if (!technology) return;

  const currentLevel = numberValue("#cur");
  const target = $("#target");
  const previousTarget = Number(target.value);

  target.disabled = false;
  target.innerHTML = "";

  for (
    let level = currentLevel + 1;
    level <= technology.maxLevel;
    level += 1
  ) {
    target.add(new Option(String(level), level));
  }

  if (
    previousTarget > currentLevel &&
    previousTarget <= technology.maxLevel
  ) {
    target.value = String(previousTarget);
  } else {
    target.value = String(technology.maxLevel);
  }

  calculate();
}

function selectedRows() {
  const technology = activeTech();
  if (!technology) return [];

  const currentLevel = numberValue("#cur");
  const targetLevel = numberValue("#target");

  return technology.levels.filter(
    (row) => row.level > currentLevel && row.level <= targetLevel
  );
}

function calculate() {
  const technology = activeTech();
  const rows = selectedRows();

  const totals = {
    bread: 0,
    wood: 0,
    stone: 0,
    iron: 0,
    gold: 0,
  };

  const owned = {
    bread: numberValue("#bread"),
    wood: numberValue("#wood"),
    stone: numberValue("#stone"),
    iron: numberValue("#iron"),
    gold: numberValue("#gold"),
  };

  let baseSeconds = 0;
  let gainedPower = 0;

  rows.forEach((row) => {
    baseSeconds += row.timeSeconds || 0;
    gainedPower += row.power || 0;

    Object.keys(totals).forEach((resource) => {
      totals[resource] += row.cost?.[resource] || 0;
    });
  });

  const labels = {
    bread: text("الخبز", "Bread"),
    wood: text("الخشب", "Wood"),
    stone: text("الحجر", "Stone"),
    iron: text("الحديد", "Iron"),
    gold: text("الذهب", "Gold"),
  };

  $("#res").innerHTML = Object.keys(totals)
    .map((resource) => {
      const remaining = Math.max(0, totals[resource] - owned[resource]);
      return `
        <div class="result-card">
          <small>${labels[resource]}</small>
          <b>${technology ? formatNumber(totals[resource]) : "—"}</b>
          <em class="${remaining > 0 ? "miss" : ""}">
            ${
              technology
                ? remaining > 0
                  ? `${text("المتبقي", "Missing")}: ${formatNumber(remaining)}`
                  : text("متوفر بالكامل", "Fully covered")
                : "—"
            }
          </em>
        </div>
      `;
    })
    .join("");

  const researchSpeed = numberValue("#speed");
  const actualSeconds = baseSeconds / (1 + researchSpeed / 100);
  const availableSpeedups =
    numberValue("#days") * 86400 +
    numberValue("#hours") * 3600 +
    numberValue("#mins") * 60;

  $("#base").textContent = technology ? formatTime(baseSeconds) : "—";
  $("#actual").textContent = technology ? formatTime(actualSeconds) : "—";
  $("#avail").textContent = formatTime(availableSpeedups);
  $("#remain").textContent = technology
    ? formatTime(Math.max(0, actualSeconds - availableSpeedups))
    : "—";

  $("#notice").style.display = technology ? "none" : "block";
  $("#notice").textContent = text(
    "اختر شجرة تحتوي على بيانات مكتملة للحساب.",
    "Choose a tree with complete calculation data."
  );

  saveState();
}

function saveState() {
  const ids = [
    "speed",
    "days",
    "hours",
    "mins",
    "bread",
    "wood",
    "stone",
    "iron",
    "gold",
  ];

  const state = {
    tree,
    technology: $("#tech").value,
    current: $("#cur").value,
    target: $("#target").value,
  };

  ids.forEach((id) => {
    state[id] = $("#" + id).value;
  });

  localStorage.setItem("research-state-v2", JSON.stringify(state));
}

function restoreState() {
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem("research-state-v2") || "{}");
  } catch {
    state = {};
  }

  tree = DB.trees.some((item) => item.id === state.tree)
    ? state.tree
    : "economy";

  renderTabs();
  renderTechnologies();

  if (
    state.technology &&
    [...$("#tech").options].some(
      (option) => option.value === state.technology
    )
  ) {
    $("#tech").value = state.technology;
    renderLevels();
  }

  [
    "speed",
    "days",
    "hours",
    "mins",
    "bread",
    "wood",
    "stone",
    "iron",
    "gold",
  ].forEach((id) => {
    if (state[id] !== undefined) $("#" + id).value = state[id];
  });

  if (
    state.current !== undefined &&
    [...$("#cur").options].some((option) => option.value === state.current)
  ) {
    $("#cur").value = state.current;
    renderTargetLevels();
  }

  if (
    state.target !== undefined &&
    [...$("#target").options].some((option) => option.value === state.target)
  ) {
    $("#target").value = state.target;
  }

  calculate();
}

fetch("research-data.json")
  .then((response) => {
    if (!response.ok) throw new Error("Failed to load research database.");
    return response.json();
  })
  .then((data) => {
    DB = data;
    applyLanguage();
    restoreState();
  })
  .catch((error) => {
    $("#notice").style.display = "block";
    $("#notice").textContent = error.message;
  });

$("#lang").addEventListener("click", () => {
  lang = lang === "ar" ? "en" : "ar";
  applyLanguage();
  renderTabs();
  renderTechnologies();
});

$("#tech").addEventListener("change", renderLevels);
$("#cur").addEventListener("change", renderTargetLevels);
$("#target").addEventListener("change", calculate);

document
  .querySelectorAll("input")
  .forEach((element) => element.addEventListener("input", calculate));

$("#reset").addEventListener("click", () => {
  localStorage.removeItem("research-state-v2");
  location.reload();
});

$("#copy").addEventListener("click", async () => {
  const technology = activeTech();
  if (!technology) return;

  const summary = [
    "SaifKS Research Planner",
    `${technology.name}: ${$("#cur").value} → ${$("#target").value}`,
    `${text("سرعة البحث", "Research Speed")}: ${numberValue("#speed")}%`,
    `${text("الوقت بعد السرعة", "Time After Speed")}: ${$("#actual").textContent}`,
    `${text("الوقت المتبقي", "Remaining Time")}: ${$("#remain").textContent}`,
  ].join("\n");

  await navigator.clipboard.writeText(summary);
  const original = $("#copy").textContent;
  $("#copy").textContent = text("تم النسخ", "Copied");
  setTimeout(() => {
    $("#copy").textContent = original;
  }, 1000);
});
