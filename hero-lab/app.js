const heroes = {
  alcar: {
    name: "Alcar", cls: "Infantry", letter: "A",
    description: "Front-line infantry specialist with strong pressure, sustained defense, and enemy vulnerability effects.",
    stats: [92, 94, 76],
    strengths: ["Infantry Damage", "Long Battles", "Castle Defense", "Enemy Debuff"],
    weaknesses: ["Burst Cavalry", "Skill Silence", "Anti-Infantry", "Fast Arena Tempo"],
    counters: [
      ["Edith", "Control Tank", 98], ["Jaeger", "Damage Mitigation", 95],
      ["Shaul", "Sustain Support", 91], ["Sophia", "Burst Pressure", 88], ["Rosa", "Backline Damage", 84]
    ],
    synergy: [["Margot", "Defense Amplifier", 97], ["Jaeger", "Frontline Stability", 94], ["Shaul", "Sustain & Utility", 91]],
    teams: [
      ["Defensive Core", 96, ["Alcar", "Margot", "Jaeger"]],
      ["Balanced Formation", 92, ["Alcar", "Shaul", "Rosa"]],
      ["Pressure Team", 89, ["Alcar", "Sophia", "Rosa"]]
    ],
    reasons: [
      "High-control tanks reduce Alcar's sustained infantry pressure.",
      "Burst damage is most effective before his defensive value compounds.",
      "Silence and disruption reduce the uptime of his strongest effects."
    ]
  },
  margot: {
    name: "Margot", cls: "Cavalry", letter: "M",
    description: "Defensive cavalry hero focused on reducing incoming damage and improving formation stability.",
    stats: [74, 97, 82],
    strengths: ["Damage Reduction", "Formation Defense", "Castle Holding", "Team Stability"],
    weaknesses: ["High Lethality", "Backline Burst", "Defense Ignore", "Extended Debuffs"],
    counters: [
      ["Rosa", "High Lethality", 96], ["Sophia", "Defense Break", 93],
      ["Edith", "Control Pressure", 90], ["Alcar", "Sustained Damage", 87], ["Petra", "Tempo Advantage", 83]
    ],
    synergy: [["Alcar", "Durable Frontline", 97], ["Jaeger", "Layered Defense", 95], ["Shaul", "Recovery Support", 90]],
    teams: [
      ["Castle Wall", 97, ["Margot", "Alcar", "Jaeger"]],
      ["Sustain Team", 93, ["Margot", "Shaul", "Alcar"]],
      ["Counter Formation", 88, ["Margot", "Edith", "Rosa"]]
    ],
    reasons: [
      "Defense-ignore and lethality reduce the value of Margot's mitigation.",
      "Backline pressure prevents her formation from winning slowly.",
      "Layered debuffs make her defensive cycle easier to break."
    ]
  },
  jaeger: {
    name: "Jaeger", cls: "Infantry", letter: "J",
    description: "Defensive specialist who protects the formation through mitigation, control resistance, and reliable frontline value.",
    stats: [69, 98, 87],
    strengths: ["Frontline Defense", "Control Resistance", "Castle Defense", "Damage Mitigation"],
    weaknesses: ["Defense Ignore", "Sustained Debuffs", "Backline Focus", "High Lethality"],
    counters: [
      ["Sophia", "Defense Break", 97], ["Rosa", "Backline Burst", 94],
      ["Petra", "Tempo Control", 90], ["Alcar", "Long Pressure", 86], ["Edith", "Control Layering", 82]
    ],
    synergy: [["Margot", "Layered Defense", 95], ["Alcar", "Frontline Pressure", 94], ["Shaul", "Sustain Support", 92]],
    teams: [
      ["Fortress Team", 96, ["Jaeger", "Margot", "Alcar"]],
      ["Sustain Wall", 92, ["Jaeger", "Shaul", "Margot"]],
      ["Control Defense", 88, ["Jaeger", "Edith", "Rosa"]]
    ],
    reasons: [
      "Defense-break skills reduce Jaeger's largest advantage.",
      "Backline burst bypasses his preferred slow defensive battle.",
      "Long-duration debuffs weaken the consistency of his mitigation."
    ]
  },
  rosa: {
    name: "Rosa", cls: "Archer", letter: "R",
    description: "High-output ranged hero with strong lethality and excellent value against defensive formations.",
    stats: [97, 68, 73],
    strengths: ["Burst Damage", "Lethality", "Backline Pressure", "Arena"],
    weaknesses: ["Frontline Collapse", "Hard Control", "Fast Cavalry", "Low Sustain"],
    counters: [
      ["Margot", "Damage Reduction", 94], ["Jaeger", "Mitigation", 92],
      ["Edith", "Hard Control", 90], ["Alcar", "Frontline Pressure", 86], ["Shaul", "Sustain", 82]
    ],
    synergy: [["Sophia", "Burst Combo", 96], ["Alcar", "Frontline Cover", 91], ["Shaul", "Support Utility", 88]],
    teams: [
      ["Burst Formation", 96, ["Rosa", "Sophia", "Alcar"]],
      ["Protected Carry", 92, ["Rosa", "Jaeger", "Shaul"]],
      ["Arena Pressure", 90, ["Rosa", "Edith", "Sophia"]]
    ],
    reasons: [
      "Mitigation heroes reduce Rosa's opening burst.",
      "Hard control interrupts her strongest damage window.",
      "Fast frontline pressure limits her time to scale damage."
    ]
  },
  sophia: {
    name: "Sophia", cls: "Archer", letter: "S",
    description: "Aggressive damage dealer built around burst pressure and weakening durable enemy formations.",
    stats: [95, 65, 80],
    strengths: ["Defense Break", "Burst", "Anti-Tank", "Arena Pressure"],
    weaknesses: ["Control", "Sustain", "Cavalry Dive", "Fragile Backline"],
    counters: [
      ["Edith", "Control Lock", 96], ["Margot", "Damage Reduction", 92],
      ["Jaeger", "Mitigation", 89], ["Shaul", "Sustain", 86], ["Alcar", "Frontline Pressure", 83]
    ],
    synergy: [["Rosa", "Burst Combo", 96], ["Alcar", "Frontline Cover", 90], ["Edith", "Control Setup", 89]],
    teams: [
      ["Anti-Tank Burst", 95, ["Sophia", "Rosa", "Alcar"]],
      ["Arena Control", 92, ["Sophia", "Edith", "Rosa"]],
      ["Balanced Damage", 88, ["Sophia", "Jaeger", "Shaul"]]
    ],
    reasons: [
      "Control prevents Sophia from completing her burst sequence.",
      "Damage reduction lowers the impact of defense-breaking windows.",
      "Cavalry pressure punishes her fragile backline position."
    ]
  }
};

const translations = {
  en: {
    title: "Hero Counter <span>+</span> Synergy",
    subtitle: "Select an enemy hero and battle mode to reveal counters, synergy partners, strengths, weaknesses, and recommended teams.",
    prototype: "Independent Prototype", enemyHero: "Enemy Hero", battleMode: "Battle Mode",
    analyze: "Analyze Matchup", selectedEnemy: "Selected Enemy", pressure: "Pressure",
    durability: "Durability", control: "Control", matchupRating: "Matchup Rating",
    bestCounters: "Best Counters", counterRanking: "Counter Ranking",
    bestSynergy: "Best Synergy", partnerRanking: "Partner Ranking",
    recommendedTeams: "Recommended Teams", readyFormations: "Ready Formations",
    strengths: "Strengths", weaknesses: "Weaknesses", analysisWhy: "Why This Works",
    readyTitle: "Ready to analyze", readyText: "Choose a hero and battle mode, then press Analyze Matchup.",
    footer: "Prototype build — not connected to the main website",
    excellent: "Excellent Counter Options",
    ratingNote: "This matchup has several reliable counter paths based on control, mitigation, and damage profile."
  },
  ar: {
    title: "مضاد الأبطال <span>+</span> الانسجام",
    subtitle: "اختر بطل الخصم ونوع المعركة لعرض أفضل المضادات، الأبطال المتوافقين، نقاط القوة والضعف، والتشكيلات المقترحة.",
    prototype: "نسخة تجريبية مستقلة", enemyHero: "بطل الخصم", battleMode: "نوع المعركة",
    analyze: "تحليل المواجهة", selectedEnemy: "البطل المختار", pressure: "الضغط",
    durability: "التحمل", control: "التحكم", matchupRating: "تقييم المواجهة",
    bestCounters: "أفضل المضادات", counterRanking: "ترتيب المضادات",
    bestSynergy: "أفضل انسجام", partnerRanking: "ترتيب الشركاء",
    recommendedTeams: "التشكيلات المقترحة", readyFormations: "تشكيلات جاهزة",
    strengths: "نقاط القوة", weaknesses: "نقاط الضعف", analysisWhy: "لماذا تنجح هذه الخطة",
    readyTitle: "جاهز للتحليل", readyText: "اختر البطل ونوع المعركة ثم اضغط تحليل المواجهة.",
    footer: "نسخة تجريبية — غير مرتبطة بالموقع الرئيسي",
    excellent: "خيارات مضادة ممتازة",
    ratingNote: "توجد عدة طرق موثوقة لمواجهة هذا البطل حسب التحكم وتقليل الضرر ونوع الهجوم."
  }
};

const heroSelect = document.getElementById("heroSelect");
const modeSelect = document.getElementById("modeSelect");
const analyzeBtn = document.getElementById("analyzeBtn");
const resetBtn = document.getElementById("resetBtn");
const langBtn = document.getElementById("langBtn");
let lang = "en";

Object.entries(heroes).forEach(([key, hero]) => {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = `${hero.name} — ${hero.cls}`;
  heroSelect.appendChild(option);
});

function avatar(name, cls = "") {
  return `<div class="hero-avatar" title="${cls}">${name[0]}</div>`;
}

function render() {
  const h = heroes[heroSelect.value];
  const modeText = modeSelect.options[modeSelect.selectedIndex].text;
  document.getElementById("emptyState").classList.add("hidden");
  document.getElementById("results").classList.remove("hidden");

  document.getElementById("enemyAvatar").textContent = h.letter;
  document.getElementById("enemyName").textContent = h.name;
  document.getElementById("enemyClass").textContent = h.cls;
  document.getElementById("enemyDescription").textContent = h.description;
  document.getElementById("pressureScore").textContent = h.stats[0];
  document.getElementById("durabilityScore").textContent = h.stats[1];
  document.getElementById("controlScore").textContent = h.stats[2];
  document.getElementById("modeBadge").textContent = modeText;

  const overall = Math.round(h.counters.slice(0,3).reduce((a,c)=>a+c[2],0)/3);
  document.getElementById("overallScore").textContent = overall;
  document.getElementById("scoreRing").style.setProperty("--score", overall);
  document.getElementById("ratingLabel").textContent = translations[lang].excellent;
  document.getElementById("ratingNote").textContent = translations[lang].ratingNote;

  document.getElementById("counterList").innerHTML = h.counters.map((c, i) => `
    <div class="rank-item">
      <div class="rank-number">0${i+1}</div>
      ${avatar(c[0], c[1])}
      <div class="rank-info">
        <strong>${c[0]}</strong><small>${c[1]}</small>
        <div class="progress"><i style="width:${c[2]}%"></i></div>
      </div>
      <div class="rank-score">${c[2]}%</div>
    </div>`).join("");

  document.getElementById("synergyList").innerHTML = h.synergy.map(s => `
    <div class="synergy-item">
      ${avatar(s[0], s[1])}
      <div><strong>${s[0]}</strong><small>${s[1]}</small></div>
      <div class="synergy-score">${s[2]}%</div>
    </div>`).join("");

  document.getElementById("teamList").innerHTML = h.teams.map(t => `
    <div class="team-card">
      <div class="team-card-head"><span>${t[0]}</span><strong>${t[1]}%</strong></div>
      <div class="team-heroes">
        ${t[2].map(name => `<span class="team-hero">${avatar(name)} ${name}</span>`).join("")}
      </div>
    </div>`).join("");

  document.getElementById("strengthList").innerHTML = h.strengths.map(x=>`<span class="tag">${x}</span>`).join("");
  document.getElementById("weaknessList").innerHTML = h.weaknesses.map(x=>`<span class="tag">${x}</span>`).join("");
  document.getElementById("reasonList").innerHTML = h.reasons.map(x=>`<li>${x}</li>`).join("");

  document.getElementById("results").scrollIntoView({behavior:"smooth", block:"start"});
}

function applyLanguage() {
  const dict = translations[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) el.innerHTML = dict[key];
  });
  langBtn.textContent = lang === "en" ? "العربية" : "English";
  if (!document.getElementById("results").classList.contains("hidden")) render();
}

analyzeBtn.addEventListener("click", render);
resetBtn.addEventListener("click", () => {
  heroSelect.selectedIndex = 0;
  modeSelect.selectedIndex = 0;
  document.getElementById("results").classList.add("hidden");
  document.getElementById("emptyState").classList.remove("hidden");
  window.scrollTo({top:0, behavior:"smooth"});
});
langBtn.addEventListener("click", () => {
  lang = lang === "en" ? "ar" : "en";
  applyLanguage();
});
