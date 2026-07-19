
const stateKey = "saifksGovernorCenterStateV1";
const langKey = "saifksLanguage";

const i18n = {
  en:{eyebrow:"Independent SaifKS Database",title:"Governor Center",subtitle:"Plan Governor Gear and Charms, calculate remaining materials, and save your progress locally.",gearStages:"Gear stages",charmLevels:"Charm levels",gearTab:"Governor Gear",charmsTab:"Governor Charms",gearPlanner:"Governor Gear Planner",gearDesc:"Enable the pieces you want to calculate, then select the current and target stages.",charmPlanner:"Governor Charm Planner",charmDesc:"Plan Keenness, Protection, and Vision Charm upgrades.",enableAll:"Enable all",ownedMaterials:"Materials you own",summary:"Summary",copySummary:"Copy summary",reset:"Reset",databaseNote:"All calculations run locally from SaifKS JSON files. No external API or website connection is used.",current:"Current",target:"Target",disabled:"Disabled",pieces:"pieces",remaining:"Remaining",required:"Required",powerGain:"Power gained",statGain:"Stat gained",copied:"Summary copied",invalidTarget:"Target must be higher than current",completed:"Completed"},
  ar:{eyebrow:"قاعدة بيانات SaifKS مستقلة",title:"مركز الحاكم",subtitle:"خطط عتاد الحاكم والتمائم، واحسب المواد المتبقية، واحفظ تقدمك محليًا.",gearStages:"مرحلة للعتاد",charmLevels:"مستوى للتمائم",gearTab:"عتاد الحاكم",charmsTab:"تمائم الحاكم",gearPlanner:"مخطط عتاد الحاكم",gearDesc:"فعّل القطع المطلوبة ثم اختر المستوى الحالي والمستوى الهدف.",charmPlanner:"مخطط تمائم الحاكم",charmDesc:"خطط لتطوير تمائم الحدة والحماية والرؤية.",enableAll:"تفعيل الكل",ownedMaterials:"المواد الموجودة لديك",summary:"الملخص",copySummary:"نسخ الملخص",reset:"إعادة ضبط",databaseNote:"تعمل جميع الحسابات محليًا من ملفات JSON الخاصة بـ SaifKS من دون أي اتصال بموقع أو API خارجي.",current:"الحالي",target:"الهدف",disabled:"غير مفعّل",pieces:"قطع",remaining:"المتبقي",required:"المطلوب",powerGain:"القوة المكتسبة",statGain:"الإحصائيات المكتسبة",copied:"تم نسخ الملخص",invalidTarget:"يجب أن يكون الهدف أعلى من الحالي",completed:"مكتمل"},
  tr:{title:"Vali Merkezi",gearTab:"Vali Ekipmanı",charmsTab:"Vali Tılsımları",summary:"Özet",copySummary:"Özeti kopyala",reset:"Sıfırla",current:"Mevcut",target:"Hedef",remaining:"Kalan",required:"Gerekli",completed:"Tamamlandı"},
  ko:{title:"총독 센터",gearTab:"총독 장비",charmsTab:"총독 부적",summary:"요약",copySummary:"요약 복사",reset:"초기화",current:"현재",target:"목표",remaining:"남음",required:"필요",completed:"완료"},
  ja:{title:"総督センター",gearTab:"総督装備",charmsTab:"総督チャーム",summary:"概要",copySummary:"概要をコピー",reset:"リセット",current:"現在",target:"目標",remaining:"残り",required:"必要",completed:"完了"},
  zh:{title:"执政官中心",gearTab:"执政官装备",charmsTab:"执政官饰品",summary:"汇总",copySummary:"复制汇总",reset:"重置",current:"当前",target:"目标",remaining:"剩余",required:"需要",completed:"已完成"}
};

const defaultState = {
  activeTab:"gear",
  language: localStorage.getItem(langKey) || "en",
  gearOwned:{satin:0,threads:0,vision:0},
  charmOwned:{guides:0,designs:0},
  gear:{}, charms:{}
};
let state = loadState();
let gearDB, charmDB;

const gearIcons = {hood:"♜",necklace:"◈",cloak:"◆",breeches:"▥",ring:"◉",staff:"⚚"};
const charmIcons = {keenness:"✦",protection:"⬢",vision:"◉"};

function loadState(){
  try { return {...defaultState, ...JSON.parse(localStorage.getItem(stateKey)||"{}")}; }
  catch { return structuredClone(defaultState); }
}
function saveState(){ localStorage.setItem(stateKey,JSON.stringify(state)); }
function n(v){ return Number(v||0); }
function fmt(v){ return Math.max(0,Math.round(v)).toLocaleString(); }
function tr(k){ return (i18n[state.language]||i18n.en)[k] ?? i18n.en[k] ?? k; }

async function init(){
  [gearDB,charmDB] = await Promise.all([
    fetch("data/governor_gear.json").then(r=>r.json()),
    fetch("data/governor_charms.json").then(r=>r.json())
  ]);
  setupLanguage();
  setupTabs();
  buildGearCards();
  buildCharmCards();
  bindOwnedInputs();
  renderAll();
}
function setupLanguage(){
  const select=document.getElementById("languageSelect");
  select.value=state.language;
  select.addEventListener("change",()=>{
    state.language=select.value;
    localStorage.setItem(langKey,state.language);
    saveState(); applyLanguage(); renderAll();
  });
  applyLanguage();
}
function applyLanguage(){
  document.documentElement.lang=state.language;
  document.documentElement.dir=state.language==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=tr(el.dataset.i18n));
}
function setupTabs(){
  document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>setTab(btn.dataset.tab)));
  setTab(state.activeTab||"gear");
}
function setTab(tab){
  state.activeTab=tab; saveState();
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  document.getElementById("gearPanel").classList.toggle("active",tab==="gear");
  document.getElementById("charmsPanel").classList.toggle("active",tab==="charms");
}
function gearOptions(selected){
  let html=`<option value="-1">${tr("disabled")}</option>`;
  gearDB.levels.forEach((x,i)=> html+=`<option value="${i}" ${i===selected?"selected":""}>${x.display_name}</option>`);
  return html;
}
function charmOptions(selected, includeZero=true){
  let html=includeZero?`<option value="0">0</option>`:"";
  charmDB.levels.forEach(x=>html+=`<option value="${x.level}" ${x.level===selected?"selected":""}>${x.level}</option>`);
  return html;
}
function buildGearCards(){
  const wrap=document.getElementById("gearCards"); wrap.innerHTML="";
  gearDB.slots.forEach(slot=>{
    if(!state.gear[slot.id]) state.gear[slot.id]={enabled:false,current:-1,target:-1};
    const s=state.gear[slot.id];
    const card=document.createElement("article"); card.className="item-card"; card.dataset.id=slot.id;
    card.innerHTML=`
      <div class="item-top">
        <div class="item-icon" data-image-slot="${slot.id}">${gearIcons[slot.id]||"◆"}</div>
        <div class="item-title"><h3>${slot.name}</h3><p>${slot.troop} · ${slot.stats.join(" & ")}</p></div>
        <label class="switch"><input class="enable" type="checkbox" ${s.enabled?"checked":""}><span class="slider"></span></label>
      </div>
      <div class="stage-grid">
        <label><span>${tr("current")}</span><select class="stage-select current">${gearOptions(s.current)}</select></label>
        <label><span>${tr("target")}</span><select class="stage-select target">${gearOptions(s.target)}</select></label>
      </div>
      <div class="item-result"></div>`;
    wrap.appendChild(card);
    card.querySelector(".enable").addEventListener("change",e=>{s.enabled=e.target.checked;saveState();renderGear();});
    card.querySelector(".current").addEventListener("change",e=>{s.current=+e.target.value;saveState();renderGear();});
    card.querySelector(".target").addEventListener("change",e=>{s.target=+e.target.value;saveState();renderGear();});
  });
}
function buildCharmCards(){
  const wrap=document.getElementById("charmCards");
  wrap.innerHTML="";

  gearDB.slots.forEach(slot=>{
    if(!state.charms[slot.id]) state.charms[slot.id]={};
    charmDB.types.forEach(type=>{
      if(!state.charms[slot.id][type.id]) state.charms[slot.id][type.id]={enabled:false,current:0,target:0};
    });

    const group=document.createElement("section");
    group.className="charm-equipment-card charm-unified-card";
    group.dataset.slot=slot.id;
    group.innerHTML=`
      <div class="charm-equipment-head">
        <div class="item-icon" data-image-slot="${slot.id}">${gearIcons[slot.id]||"◆"}</div>
        <div class="item-title"><h3>${slot.name}</h3><p>${slot.troop} · 3 Charms</p></div>
        <span class="charm-active-count">0 / 3</span>
        <button class="secondary-btn compact toggle-group" type="button" aria-label="Toggle">⌄</button>
      </div>

      <div class="charm-quick-controls compact-controls">
        <label><span>${tr("current")}</span><select class="stage-select group-current">${charmOptions(0)}</select></label>
        <label><span>${tr("target")}</span><select class="stage-select group-target">${charmOptions(0)}</select></label>
        <button class="secondary-btn apply-group" type="button">Apply to 3</button>
      </div>

      <div class="charms-unified-list"></div>`;

    const list=group.querySelector(".charms-unified-list");
    charmDB.types.forEach(type=>{
      const s=state.charms[slot.id][type.id];
      const row=document.createElement("article");
      row.className="charm-row";
      row.dataset.type=type.id;
      row.innerHTML=`
        <label class="charm-enable-box">
          <input class="enable" type="checkbox" ${s.enabled?"checked":""}>
          <span class="checkmark">✓</span>
        </label>
        <div class="item-icon small" data-image-slot="${slot.id}-${type.id}">${charmIcons[type.id]||"✦"}</div>
        <div class="charm-row-name">
          <strong>${type.name}</strong>
          <span>${slot.name}</span>
        </div>
        <label class="charm-level-field"><span>${tr("current")}</span><select class="stage-select current">${charmOptions(s.current)}</select></label>
        <span class="level-arrow">→</span>
        <label class="charm-level-field"><span>${tr("target")}</span><select class="stage-select target">${charmOptions(s.target)}</select></label>
        <div class="item-result charm-row-result"></div>`;
      list.appendChild(row);

      row.querySelector(".enable").addEventListener("change",e=>{
        s.enabled=e.target.checked;
        saveState(); renderCharms();
      });
      row.querySelector(".current").addEventListener("change",e=>{
        s.current=+e.target.value;
        saveState(); renderCharms();
      });
      row.querySelector(".target").addEventListener("change",e=>{
        s.target=+e.target.value;
        saveState(); renderCharms();
      });
    });

    group.querySelector(".toggle-group").addEventListener("click",()=>group.classList.toggle("collapsed"));
    group.querySelector(".apply-group").addEventListener("click",()=>{
      const cur=+group.querySelector(".group-current").value;
      const tar=+group.querySelector(".group-target").value;
      charmDB.types.forEach(type=>Object.assign(state.charms[slot.id][type.id],{enabled:true,current:cur,target:tar}));
      saveState(); buildCharmCards(); renderCharms();
    });
    wrap.appendChild(group);
  });
}
function bindOwnedInputs(){
  const ids=[
    ["ownedSatin","gearOwned","satin"],["ownedThreads","gearOwned","threads"],["ownedVision","gearOwned","vision"],
    ["ownedGuides","charmOwned","guides"],["ownedDesigns","charmOwned","designs"]
  ];
  ids.forEach(([id,group,key])=>{
    const el=document.getElementById(id); el.value=state[group][key]||"";
    el.addEventListener("input",()=>{state[group][key]=n(el.value);saveState();renderAll();});
  });
}
function gearCalc(s){
  if(!s.enabled || s.target<0 || s.target<=s.current) return null;
  const rows=gearDB.levels.slice(s.current+1,s.target+1);
  const req=rows.reduce((a,x)=>({
    satin:a.satin+x.materials.satin,threads:a.threads+x.materials.gilded_threads,vision:a.vision+x.materials.artisans_vision
  }),{satin:0,threads:0,vision:0});
  const cur=s.current>=0?gearDB.levels[s.current]:{power_total:0,stat_total_percent:0};
  const tar=gearDB.levels[s.target];
  return {req,power:tar.power_total-cur.power_total,stat:tar.stat_total_percent-cur.stat_total_percent};
}
function charmCalc(s){
  if(!s.enabled || s.target<=s.current) return null;
  const rows=charmDB.levels.filter(x=>x.level>s.current&&x.level<=s.target);
  const req=rows.reduce((a,x)=>({guides:a.guides+x.materials.charm_guides,designs:a.designs+x.materials.charm_designs}),{guides:0,designs:0});
  const cur=s.current>0?charmDB.levels.find(x=>x.level===s.current):{power_total:0,stat_total_percent:0};
  const tar=charmDB.levels.find(x=>x.level===s.target);
  return {req,power:tar.power_total-cur.power_total,stat:tar.stat_total_percent-cur.stat_total_percent};
}
function metric(label,value){return `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`}
function summaryBox(label,value,complete=false){return `<div class="summary-box ${complete?"complete":""}"><span>${label}</span><strong>${value}</strong></div>`}
function renderGear(){
  let total={satin:0,threads:0,vision:0,power:0,stat:0,count:0};
  document.querySelectorAll("#gearCards .item-card").forEach(card=>{
    const s=state.gear[card.dataset.id],calc=gearCalc(s);
    card.classList.toggle("enabled",s.enabled);
    const box=card.querySelector(".item-result");
    if(!s.enabled){ box.innerHTML=metric(tr("remaining"),"—"); return; }
    if(!calc){ box.innerHTML=metric(tr("invalidTarget"),"—"); return; }
    total.count++; Object.keys(calc.req).forEach(k=>total[k]+=calc.req[k]); total.power+=calc.power; total.stat+=calc.stat;
    box.innerHTML=metric("Satin",fmt(calc.req.satin))+metric("Threads",fmt(calc.req.threads))+metric("Vision",fmt(calc.req.vision))+metric(tr("powerGain"),fmt(calc.power));
  });
  document.getElementById("gearSelectedCount").textContent=`${total.count} ${tr("pieces")}`;
  const rem={
    satin:Math.max(0,total.satin-state.gearOwned.satin),
    threads:Math.max(0,total.threads-state.gearOwned.threads),
    vision:Math.max(0,total.vision-state.gearOwned.vision)
  };
  document.getElementById("gearSummary").innerHTML=
    summaryBox("Satin",`${fmt(rem.satin)} / ${fmt(total.satin)}`,rem.satin===0&&total.satin>0)+
    summaryBox("Gilded Threads",`${fmt(rem.threads)} / ${fmt(total.threads)}`,rem.threads===0&&total.threads>0)+
    summaryBox("Artisan's Vision",`${fmt(rem.vision)} / ${fmt(total.vision)}`,rem.vision===0&&total.vision>0)+
    summaryBox(tr("powerGain"),fmt(total.power))+
    summaryBox(tr("statGain"),`${total.stat.toFixed(2)}%`);
}
function renderCharms(){
  let total={guides:0,designs:0,power:0,stat:0,count:0};
  document.querySelectorAll("#charmCards .charm-row").forEach(card=>{
    const group=card.closest(".charm-equipment-card");
    const s=state.charms[group.dataset.slot][card.dataset.type],calc=charmCalc(s);
    card.classList.toggle("enabled",s.enabled);
    const box=card.querySelector(".item-result");
    if(!s.enabled){ box.innerHTML=metric(tr("remaining"),"—"); return; }
    if(!calc){ box.innerHTML=metric(tr("invalidTarget"),"—"); return; }
    total.count++; total.guides+=calc.req.guides;total.designs+=calc.req.designs;total.power+=calc.power;total.stat+=calc.stat;
    box.innerHTML=metric("Charm Guides",fmt(calc.req.guides))+metric("Charm Designs",fmt(calc.req.designs))+metric(tr("powerGain"),fmt(calc.power))+metric(tr("statGain"),`${calc.stat.toFixed(2)}%`);
  });
  document.querySelectorAll("#charmCards .charm-equipment-card").forEach(group=>{
    const active=charmDB.types.filter(type=>state.charms[group.dataset.slot][type.id].enabled).length;
    const badge=group.querySelector(".charm-active-count");
    if(badge) badge.textContent=`${active} / 3`;
  });
  document.getElementById("charmSelectedCount").textContent=`${total.count} / 18`;
  const rem={guides:Math.max(0,total.guides-state.charmOwned.guides),designs:Math.max(0,total.designs-state.charmOwned.designs)};
  document.getElementById("charmSummary").innerHTML=
    summaryBox("Charm Guides",`${fmt(rem.guides)} / ${fmt(total.guides)}`,rem.guides===0&&total.guides>0)+
    summaryBox("Charm Designs",`${fmt(rem.designs)} / ${fmt(total.designs)}`,rem.designs===0&&total.designs>0)+
    summaryBox(tr("powerGain"),fmt(total.power))+
    summaryBox(tr("statGain"),`${total.stat.toFixed(2)}%`);
}
function renderAll(){applyLanguage();renderGear();renderCharms()}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1700)}
function copyGear(){
  const lines=["SaifKS.com | Governor Gear"];
  let req={satin:0,threads:0,vision:0};
  gearDB.slots.forEach(slot=>{
    const s=state.gear[slot.id],c=gearCalc(s); if(!c)return;
    Object.keys(req).forEach(k=>req[k]+=c.req[k]);
    lines.push(`${slot.name}: ${s.current<0?"None":gearDB.levels[s.current].display_name} → ${gearDB.levels[s.target].display_name}`);
  });
  const rem={satin:Math.max(0,req.satin-state.gearOwned.satin),threads:Math.max(0,req.threads-state.gearOwned.threads),vision:Math.max(0,req.vision-state.gearOwned.vision)};
  if(rem.satin)lines.push(`Satin: ${fmt(rem.satin)}`);
  if(rem.threads)lines.push(`Gilded Threads: ${fmt(rem.threads)}`);
  if(rem.vision)lines.push(`Artisan's Vision: ${fmt(rem.vision)}`);
  if(!rem.satin&&!rem.threads&&!rem.vision)lines.push(tr("completed"));
  navigator.clipboard.writeText(lines.join("\n")).then(()=>toast(tr("copied")));
}
function copyCharms(){
  const lines=["SaifKS.com | Governor Charms"];
  let req={guides:0,designs:0};
  gearDB.slots.forEach(slot=>{
    charmDB.types.forEach(type=>{
      const s=state.charms?.[slot.id]?.[type.id],c=s?charmCalc(s):null; if(!c)return;
      req.guides+=c.req.guides;req.designs+=c.req.designs;
      lines.push(`${slot.name} - ${type.name}: ${s.current} → ${s.target}`);
    });
  });
  const rem={guides:Math.max(0,req.guides-state.charmOwned.guides),designs:Math.max(0,req.designs-state.charmOwned.designs)};
  if(rem.guides)lines.push(`Charm Guides: ${fmt(rem.guides)}`);
  if(rem.designs)lines.push(`Charm Designs: ${fmt(rem.designs)}`);
  if(!rem.guides&&!rem.designs)lines.push(tr("completed"));
  navigator.clipboard.writeText(lines.join("\n")).then(()=>toast(tr("copied")));
}
document.getElementById("enableAllGear").addEventListener("click",()=>{Object.values(state.gear).forEach(s=>s.enabled=true);saveState();buildGearCards();renderGear()});
document.getElementById("enableAllCharms").addEventListener("click",()=>{gearDB.slots.forEach(slot=>charmDB.types.forEach(type=>state.charms[slot.id][type.id].enabled=true));saveState();buildCharmCards();renderCharms()});
document.getElementById("copyGear").addEventListener("click",copyGear);
document.getElementById("copyCharms").addEventListener("click",copyCharms);
document.getElementById("resetGear").addEventListener("click",()=>{state.gear={};state.gearOwned={satin:0,threads:0,vision:0};saveState();location.reload()});
document.getElementById("resetCharms").addEventListener("click",()=>{state.charms={};state.charmOwned={guides:0,designs:0};saveState();location.reload()});
document.getElementById("homeBtn").addEventListener("click",()=>history.length>1?history.back():location.href="../index.html");

init().catch(err=>{
  console.error(err);
  document.body.innerHTML="<main style='padding:30px;color:white'>Failed to load local database files.</main>";
});
