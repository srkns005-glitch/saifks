const buildingNames=["town","embassy","barracks","stable","range","command","infirmary","academy"];

const translations={
  en:{
    title:"True Gold Calculator",
    buildings:"Buildings",
    inventory:"Inventory",
    bonuses:"Bonuses",
    results:"Results",
    temperedGold:"Tempered True Gold",
    trueGold:"True Gold",
    speedups:"Total Speedups (Days)",
    construction:"Construction Speed %",
    wolf:"Wolf Skill",
    position:"Position Bonus %",
    saul:"Saul Skill",
    king:"King Bonus %",
    preparation:"Kingdom Preparation %",
    doubleTime:"Double Time (20%)",
    required:"Required",
    available:"Available",
    remaining:"Remaining",
    timeSummary:"Time Summary",
    originalTime:"Original Time",
    afterBonuses:"After Bonuses",
    remainingTime:"Remaining Time",
    resources:"Resources",
    resourcesAfterSaul:"Resources After Saul",
    food:"Food",
    wood:"Wood",
    stone:"Stone",
    iron:"Iron",
    power:"Power",
    powerGained:"Total Power Gained",
    copy:"Copy Summary",
    reset:"Reset",
    current:"Current Level",
    target:"Target Level",
    copied:"Copied",
    none:"None selected",plannerTitle:"Auto Upgrade Planner",plannerHelp:"Choose your current and target Town Center levels.",plannerCurrent:"Current Town Center",plannerTarget:"Target Town Center",generatePlan:"Generate Plan",clearPlan:"Clear Plan",planReady:"Upgrade plan generated.",invalidPlan:"Choose a target level higher than the current level.",plannerGuideTitle:"How to use",plannerGuide1:"Select your current Town Center level.",plannerGuide2:"Select the level you want to reach.",plannerGuide3:"Press Generate Plan to fill the required buildings automatically.",resetConfirmTitle:"Reset saved data?",resetConfirmText:"Are you sure you want to delete all saved calculator data?",yes:"Yes",cancel:"Cancel"
  },
  ar:{
    title:"حاسبة الذهب",
    buildings:"المباني",
    inventory:"المخزون",
    bonuses:"المكافآت",
    results:"النتائج",
    temperedGold:"الذهب الخالص المعدل",
    trueGold:"الذهب الخالص",
    speedups:"إجمالي التسريعات (بالأيام)",
    construction:"مكافأة سرعة البناء %",
    wolf:"مهارة الذئب",
    position:"مكافأة المنصب %",
    saul:"مهارة شاول",
    king:"مكافأة الملك %",
    preparation:"مكافأة الحدث التحضيري للمملكة ضد المملكة %",
    doubleTime:"الوقت المزدوج (20%)",
    required:"المطلوب",
    available:"الموجود",
    remaining:"المتبقي",
    timeSummary:"ملخص الوقت",
    originalTime:"الوقت الأصلي",
    afterBonuses:"الوقت بعد المكافآت",
    remainingTime:"الوقت المتبقي",
    resources:"الموارد",
    resourcesAfterSaul:"الموارد بعد شاول",
    food:"الطعام",
    wood:"الخشب",
    stone:"الحجر",
    iron:"الحديد",
    power:"القوة",
    powerGained:"إجمالي القوة المكتسبة",
    copy:"نسخ الملخص",
    reset:"إعادة تعيين",
    current:"المستوى الحالي",
    target:"المستوى المستهدف",
    copied:"تم النسخ",
    none:"لم يتم اختيار مبانٍ",plannerTitle:"مخطط الترقية التلقائي",plannerHelp:"اختر مستوى مركز المدينة الحالي والمستوى المستهدف.",plannerCurrent:"مستوى مركز المدينة الحالي",plannerTarget:"مستوى مركز المدينة المستهدف",generatePlan:"إنشاء الخطة",clearPlan:"مسح الخطة",planReady:"تم إنشاء خطة الترقية.",invalidPlan:"اختر مستوى مستهدفًا أعلى من المستوى الحالي.",plannerGuideTitle:"طريقة الاستخدام",plannerGuide1:"اختر مستوى مركز المدينة الحالي.",plannerGuide2:"اختر المستوى الذي تريد الوصول إليه.",plannerGuide3:"اضغط إنشاء الخطة ليتم تعبئة المباني المطلوبة تلقائيًا.",resetConfirmTitle:"حذف البيانات المحفوظة؟",resetConfirmText:"هل أنت متأكد من حذف جميع بيانات الحاسبة المحفوظة؟",yes:"نعم",cancel:"إلغاء"
  }
};

const buildingLabels={
  en:{
    town:"Town Center",
    embassy:"Embassy",
    barracks:"Barracks",
    stable:"Stable",
    range:"Range",
    command:"Command Center",
    infirmary:"Infirmary",
    academy:"War Academy"
  },
  ar:{
    town:"مركز المدينة",
    embassy:"السفارة",
    barracks:"الثكنات",
    stable:"الإسطبل",
    range:"معسكر الرماة",
    command:"مركز القيادة",
    infirmary:"المستشفى",
    academy:"أكاديمية الحرب"
  }
};

let currentLanguage=localStorage.getItem("saifRallyLang")||"en";
const levels=window.LEVEL_ORDER;
const box=document.getElementById("buildings");

function displayLevel(level){
  if(!level) return "—";
  if(level==="Base") return "Base";
  return level.replace(/-(\d+)$/, ".$1");
}


buildingNames.forEach(name=>{
  const availableLevels=levels.filter(level=>{
    if(level==="Base") return Boolean(BUILDING_DATA[name]["30-1"]);
    return Boolean(BUILDING_DATA[name][level]);
  });

  const block=document.createElement("div");
  block.className="building";
  block.dataset.building=name;

  block.innerHTML=`
    <label class="building-title">
      <input type="checkbox" id="${name}">
      <span class="building-name"></span>
    </label>
    <div class="building-grid">
      <div>
        <label for="${name}Current" class="current-label"></label>
        <select id="${name}Current" disabled><option value="Base" selected>Base</option></select>
      </div>
      <div>
        <label for="${name}Target" class="target-label"></label>
        <select id="${name}Target" disabled><option value="">—</option></select>
      </div>
    </div>`;

  box.appendChild(block);

  const current=document.getElementById(`${name}Current`);
  const target=document.getElementById(`${name}Target`);
  const check=document.getElementById(name);

  availableLevels.forEach(level=>{
    if(level==="Base") return;
    current.add(new Option(displayLevel(level),level));
    target.add(new Option(displayLevel(level),level));
  });

  function refreshTargetOptions(){
    const currentIndex=current.value ? availableLevels.indexOf(current.value) : -1;

    Array.from(target.options).forEach(option=>{
      if(!option.value){
        option.disabled=false;
        return;
      }
      option.disabled=availableLevels.indexOf(option.value)<=currentIndex;
    });

    if(target.value && availableLevels.indexOf(target.value)<=currentIndex){
      target.value="";
    }
  }

  check.addEventListener("change",()=>{
    block.classList.toggle("active",check.checked);
    current.disabled=!check.checked;
    target.disabled=!check.checked;

    if(!check.checked){
      current.value="Base";
      target.value="";
    }

    refreshTargetOptions();
    calculate();
  });

  current.addEventListener("change",()=>{
    refreshTargetOptions();
    calculate();
  });

  target.addEventListener("change",calculate);
});

function applyLanguage(language){
  currentLanguage=language;
  const text=translations[language];

  document.documentElement.lang=language;
  document.documentElement.dir=language==="ar"?"rtl":"ltr";
  document.title=`${text.title} | SaifKS`;
  document.getElementById("langToggleText").textContent=language==="en"?"العربية":"English";
  localStorage.setItem("saifRallyLang",language); document.getElementById("langToggle").setAttribute("aria-label", language==="en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية");

  document.querySelectorAll("[data-i18n]").forEach(element=>{
    const key=element.dataset.i18n;
    if(text[key]) element.textContent=text[key];
  });

  document.querySelectorAll(".building").forEach(block=>{
    const name=block.dataset.building;
    block.querySelector(".building-name").textContent=buildingLabels[language][name];
    block.querySelector(".current-label").textContent=text.current;
    block.querySelector(".target-label").textContent=text.target;
  });

  calculate();
}

document.getElementById("langToggle").addEventListener("click",()=>{
  applyLanguage(currentLanguage==="en"?"ar":"en"); saveState();
});

const numberValue=id=>Math.max(0,Number(document.getElementById(id).value)||0);
const formatNumber=value=>Math.round(value).toLocaleString(currentLanguage==="ar"?"ar-AE":"en-US");

const formatTime=seconds=>{
  seconds=Math.max(0,Math.round(seconds));
  const days=Math.floor(seconds/86400);
  seconds%=86400;
  const hours=Math.floor(seconds/3600);
  seconds%=3600;
  const minutes=Math.floor(seconds/60);

  return currentLanguage==="ar"
    ?`${days}ي ${hours}س ${minutes}د`
    :`${days}d ${hours}h ${minutes}m`;
};

function setResult(id,value,isTime=false){
  document.getElementById(id).textContent=isTime?formatTime(value):formatNumber(value);
}

function setBalance(id,value){
  const element=document.getElementById(id);
  element.textContent=formatNumber(value);
  element.classList.remove("good","bad");

  if(value>0) element.classList.add("good");
  if(value<0) element.classList.add("bad");
}



const plannerLevels=levels.filter(level=>level==="Base"||Boolean(BUILDING_DATA.town[level]));

const townRequirements={
  "30-1":{},
  "30-2":{},
  "30-3":{},
  "30-4":{},
  "TG1":{},
  "TG1-1":{embassy:"TG1",stable:"TG1"},
  "TG1-2":{embassy:"TG1",stable:"TG1"},
  "TG1-3":{embassy:"TG1",stable:"TG1"},
  "TG1-4":{embassy:"TG1",stable:"TG1"},
  "TG2":{embassy:"TG1",stable:"TG1"},
  "TG2-1":{embassy:"TG2",barracks:"TG2"},
  "TG2-2":{embassy:"TG2",barracks:"TG2"},
  "TG2-3":{embassy:"TG2",barracks:"TG2"},
  "TG2-4":{embassy:"TG2",barracks:"TG2"},
  "TG3":{embassy:"TG2",barracks:"TG2"},
  "TG3-1":{embassy:"TG3",range:"TG3"},
  "TG3-2":{embassy:"TG3",range:"TG3"},
  "TG3-3":{embassy:"TG3",range:"TG3"},
  "TG3-4":{embassy:"TG3",range:"TG3"},
  "TG4":{embassy:"TG3",range:"TG3"},
  "TG4-1":{embassy:"TG4",stable:"TG4"},
  "TG4-2":{embassy:"TG4",stable:"TG4"},
  "TG4-3":{embassy:"TG4",stable:"TG4"},
  "TG4-4":{embassy:"TG4",stable:"TG4"},
  "TG5":{embassy:"TG4",stable:"TG4"},
  "TG5-1":{embassy:"TG5",barracks:"TG5"},
  "TG5-2":{embassy:"TG5",barracks:"TG5"},
  "TG5-3":{embassy:"TG5",barracks:"TG5"},
  "TG5-4":{embassy:"TG5",barracks:"TG5"},
  "TG6":{embassy:"TG5",barracks:"TG5"},
  "TG6-1":{embassy:"TG6",range:"TG6"},
  "TG6-2":{embassy:"TG6",range:"TG6"},
  "TG6-3":{embassy:"TG6",range:"TG6"},
  "TG6-4":{embassy:"TG6",range:"TG6"},
  "TG7":{embassy:"TG6",range:"TG6"},
  "TG7-1":{embassy:"TG7",stable:"TG7"},
  "TG7-2":{embassy:"TG7",stable:"TG7"},
  "TG7-3":{embassy:"TG7",stable:"TG7"},
  "TG7-4":{embassy:"TG7",stable:"TG7"},
  "TG8":{embassy:"TG7",stable:"TG7"}
};

function levelIndex(level){
  return levels.indexOf(level);
}

function maxLevel(a,b){
  if(!a) return b;
  if(!b) return a;
  return levelIndex(a)>=levelIndex(b)?a:b;
}

function requirementsUpTo(targetLevel){
  const result={};
  const targetIndex=plannerLevels.indexOf(targetLevel);

  for(let index=0;index<=targetIndex;index++){
    const level=plannerLevels[index];
    const requirements=townRequirements[level]||{};

    Object.entries(requirements).forEach(([building,requiredLevel])=>{
      result[building]=maxLevel(result[building],requiredLevel);
    });
  }

  return result;
}

function setBuildingPlan(name,currentLevel,targetLevel){
  const checkbox=document.getElementById(name);
  const current=document.getElementById(`${name}Current`);
  const target=document.getElementById(`${name}Target`);
  const block=checkbox.closest(".building");

  const needsUpgrade=Boolean(targetLevel)&&levelIndex(targetLevel)>levelIndex(currentLevel||"Base");

  checkbox.checked=needsUpgrade;
  block.classList.toggle("active",needsUpgrade);
  current.disabled=!needsUpgrade;
  target.disabled=!needsUpgrade;

  if(needsUpgrade){
    current.value=currentLevel||"Base";
    target.value=targetLevel;
  }else{
    current.value="Base";
    target.value="";
  }
}

function generateUpgradePlan(){
  const currentTown=document.getElementById("plannerCurrent").value;
  const targetTown=document.getElementById("plannerTarget").value;
  const message=document.getElementById("plannerMessage");

  if(plannerLevels.indexOf(targetTown)<=plannerLevels.indexOf(currentTown)){
    message.textContent=translations[currentLanguage].invalidPlan;
    message.classList.add("error");
    return;
  }

  message.classList.remove("error");

  const currentRequirements=requirementsUpTo(currentTown);
  const targetRequirements=requirementsUpTo(targetTown);

  setBuildingPlan("town",currentTown,targetTown);

  ["embassy","barracks","stable","range"].forEach(name=>{
    setBuildingPlan(
      name,
      currentRequirements[name]||"Base",
      targetRequirements[name]||null
    );
  });

  ["command","infirmary","academy"].forEach(name=>{
    setBuildingPlan(name,"Base",null);
  });

  calculate();
  saveState();
  message.textContent=translations[currentLanguage].planReady;
}

function clearUpgradePlan(){
  buildingNames.forEach(name=>setBuildingPlan(name,"Base",null));

  const plannerCurrent=document.getElementById("plannerCurrent");
  const plannerTarget=document.getElementById("plannerTarget");

  plannerCurrent.value="Base";
  plannerTarget.value="";
  plannerCurrent.disabled=false;
  plannerTarget.disabled=false;

  refreshPlannerTargetOptions();
  document.getElementById("plannerMessage").textContent="";
  calculate();
  saveState();
}

function refreshPlannerTargetOptions(){
  const current=document.getElementById("plannerCurrent");
  const target=document.getElementById("plannerTarget");
  if(!current||!target) return;

  const savedTarget=target.value;
  const currentIndex=plannerLevels.indexOf(current.value);

  while(target.options.length){
    target.remove(0);
  }

  target.add(new Option("—",""));

  plannerLevels.forEach((level,index)=>{
    if(level==="Base") return;
    if(currentIndex>=0 && index<=currentIndex) return;
    target.add(new Option(displayLevel(level),level));
  });

  const savedStillAvailable=Array.from(target.options).some(option=>option.value===savedTarget);
  target.value=savedStillAvailable?savedTarget:"";
  target.disabled=false;
}

function setupPlanner(){
  const current=document.getElementById("plannerCurrent");
  const target=document.getElementById("plannerTarget");

  plannerLevels.forEach(level=>{
    current.add(new Option(displayLevel(level),level));
  });

  current.value="Base";
  target.value="";
  current.disabled=false;
  target.disabled=false;
  refreshPlannerTargetOptions();

  current.addEventListener("change",function(){
    refreshPlannerTargetOptions();
    saveState();
  });

  target.addEventListener("change",saveState);
  document.getElementById("generatePlan").addEventListener("click",generateUpgradePlan);
  document.getElementById("clearPlan").addEventListener("click",clearUpgradePlan);
}

const STORAGE_KEY="saifksGoldCalculatorV7";

function collectState(){
  const state={
    language:currentLanguage,
    doubleTime:document.getElementById("doubleTime").checked,
    fields:{},
    buildings:{},planner:{current:document.getElementById("plannerCurrent")?.value||"Base",target:document.getElementById("plannerTarget")?.value||""}
  };

  ["temperedGold","trueGold","speedups","constructionBonus","positionBonus","kingBonus","prepBonus","wolfSkill","saulSkill"]
    .forEach(id=>{
      state.fields[id]=document.getElementById(id).value;
    });

  buildingNames.forEach(name=>{
    state.buildings[name]={
      enabled:document.getElementById(name).checked,
      current:document.getElementById(`${name}Current`).value,
      target:document.getElementById(`${name}Target`).value
    };
  });

  return state;
}

function saveState(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(collectState()));
}

function restoreState(){
  const raw=localStorage.getItem(STORAGE_KEY);
  if(!raw) return;

  try{
    const state=JSON.parse(raw);

    if(state.language){
      currentLanguage=state.language;
    }

    Object.entries(state.fields||{}).forEach(([id,value])=>{
      const element=document.getElementById(id);
      if(element) element.value=value;
    });

    document.getElementById("doubleTime").checked=Boolean(state.doubleTime);
    if(state.planner){
      const plannerCurrent=document.getElementById("plannerCurrent");
      const plannerTarget=document.getElementById("plannerTarget");
      if(plannerCurrent) plannerCurrent.value=state.planner.current||"Base";
      refreshPlannerTargetOptions();
      if(plannerTarget){
        const wantedTarget=state.planner.target||"";
        const exists=Array.from(plannerTarget.options).some(option=>option.value===wantedTarget);
        plannerTarget.value=exists?wantedTarget:"";
      }
    }

    buildingNames.forEach(name=>{
      const saved=(state.buildings&&state.buildings[name]);
      if(!saved) return;

      const checkbox=document.getElementById(name);
      const current=document.getElementById(`${name}Current`);
      const target=document.getElementById(`${name}Target`);
      const block=checkbox.closest(".building");

      checkbox.checked=Boolean(saved.enabled);
      block.classList.toggle("active",checkbox.checked);
      current.disabled=!checkbox.checked;
      target.disabled=!checkbox.checked;

      current.value=saved.current||"Base";
      target.value=saved.target||"";
    });
  }catch(error){
    localStorage.removeItem(STORAGE_KEY);
  }
}

function clearSavedState(){
  localStorage.removeItem(STORAGE_KEY);
}

function calculate(){
  const totals={food:0,wood:0,stone:0,iron:0,trueGold:0,temperedGold:0,time:0,power:0};

  buildingNames.forEach(name=>{
    if(!document.getElementById(name).checked) return;

    const current=document.getElementById(`${name}Current`).value;
    const target=document.getElementById(`${name}Target`).value;
    if(!current||!target) return;

    const available=levels.filter(level=>{
      if(level==="Base") return Boolean(BUILDING_DATA[name]["30-1"]);
      return Boolean(BUILDING_DATA[name][level]);
    });

    const start=available.indexOf(current);
    const end=available.indexOf(target);
    if(start<0||end<=start) return;

    for(let index=start+1;index<=end;index++){
      const level=available[index];
      const row=BUILDING_DATA[name][level];
      if(!row) continue;

      totals.food+=row.food;
      totals.wood+=row.wood;
      totals.stone+=row.stone;
      totals.iron+=row.iron;
      totals.trueGold+=row.trueGold;
      totals.temperedGold+=row.temperedGold;
      totals.time+=row.time;
    }

    totals.power +=
      (BUILDING_DATA[name][target]?.power || 0) -
      (BUILDING_DATA[name][current]?.power || 0);
  });

  const constructionSpeed=
    numberValue("constructionBonus")+
    numberValue("wolfSkill")+
    numberValue("positionBonus")+
    numberValue("kingBonus")+
    numberValue("prepBonus");

  const saulReduction=numberValue("saulSkill");

  let reducedTime=totals.time/(1+constructionSpeed/100);
  reducedTime*=1-saulReduction/100;

  if(document.getElementById("doubleTime").checked){
    reducedTime*=0.8;
  }

  const remainingTime=Math.max(0,reducedTime-numberValue("speedups")*86400);
  const ownedTempered=numberValue("temperedGold");
  const ownedTrue=numberValue("trueGold");

  setResult("requiredTemperedGold",totals.temperedGold);
  setResult("availableTemperedGold",ownedTempered);
  setBalance("remainingTemperedGold",ownedTempered-totals.temperedGold);

  setResult("requiredTrueGold",totals.trueGold);
  setResult("availableTrueGold",ownedTrue);
  setBalance("remainingTrueGold",ownedTrue-totals.trueGold);

  setResult("originalTime",totals.time,true);
  setResult("reducedTime",reducedTime,true);
  setResult("remainingTime",remainingTime,true);

  ["food","wood","stone","iron"].forEach(resource=>{
    setResult(resource,totals[resource]);
    setResult(`${resource}AfterSaul`,totals[resource]*(1-saulReduction/100));
  });

  setResult("powerGain",totals.power);
}

document.querySelectorAll("input,select").forEach(element=>{
  element.addEventListener("input",()=>{
    calculate();
    saveState();
  });
  element.addEventListener("change",()=>{
    calculate();
    saveState();
  });
});

const resetDialog=document.getElementById("resetDialog");

document.getElementById("resetCalculator").addEventListener("click",()=>{
  resetDialog.hidden=false;
});

document.getElementById("cancelReset").addEventListener("click",()=>{
  resetDialog.hidden=true;
});

document.getElementById("confirmReset").addEventListener("click",()=>{
  document.querySelectorAll('input[type="number"]').forEach(element=>element.value="");
  document.querySelectorAll('input[type="checkbox"]').forEach(element=>element.checked=false);
  document.querySelectorAll(".building").forEach(element=>element.classList.remove("active"));

  document.querySelectorAll("select").forEach(element=>{
    if(element.id==="plannerCurrent"){
      element.value="Base";
      element.disabled=false;
    }else if(element.id==="plannerTarget"){
      element.value="";
      element.disabled=false;
    }else if(element.id.endsWith("Current")){
      element.value="Base";
      element.disabled=true;
    }else if(element.id.endsWith("Target")){
      element.value="";
      element.disabled=true;
    }else{
      element.value="0";
    }

    Array.from(element.options).forEach(option=>{
      option.disabled=false;
    });
  });

  refreshPlannerTargetOptions();

  clearSavedState();
  resetDialog.hidden=true;
  calculate();
});

document.getElementById("copySummary").addEventListener("click",async()=>{
  const selected=[];

  buildingNames.forEach(name=>{
    if(!document.getElementById(name).checked) return;

    const current=document.getElementById(`${name}Current`).value;
    const target=document.getElementById(`${name}Target`).value;

    if(current&&target){
      selected.push(`${buildingLabels[currentLanguage][name]}: ${displayLevel(current)} → ${displayLevel(target)}`);
    }
  });

  const text=translations[currentLanguage];
  const lines=[];
const add=(label,id)=>{const v=document.getElementById(id).textContent.trim();if(v!=="0"&&v!=="0d 0h 0m"&&v!=="0ي 0س 0د"){lines.push("",label,v);}};
if(currentLanguage==="ar"){
lines.push("حاسبة الذهب","","المباني");if(selected.length)lines.push(...selected);
add("الذهب الخالص المعدل المطلوب","requiredTemperedGold");
add("الذهب الخالص المطلوب","requiredTrueGold");
let hdr=false;[["الطعام","food"],["الخشب","wood"],["الحجر","stone"],["الحديد","iron"]].forEach(r=>{const v=document.getElementById(r[1]).textContent.trim();if(v!=="0"){if(!hdr){lines.push("","الموارد المطلوبة");hdr=true;}lines.push(r[0]+": "+v);}});
add("القوة","powerGain");add("الوقت المتبقي","remainingTime");
lines.push("","SaifKS.com");
}else{
lines.push("True Gold Calculator","","Buildings");if(selected.length)lines.push(...selected);
add("Tempered True Gold Required","requiredTemperedGold");
add("True Gold Required","requiredTrueGold");
let hdr=false;[["Food","food"],["Wood","wood"],["Stone","stone"],["Iron","iron"]].forEach(r=>{const v=document.getElementById(r[1]).textContent.trim();if(v!=="0"){if(!hdr){lines.push("","Resources");hdr=true;}lines.push(r[0]+": "+v);}});
add("Power","powerGain");add("Remaining Time","remainingTime");
lines.push("","SaifKS.com");
}
const summary=lines.join("\n");
try{
    await navigator.clipboard.writeText(summary);
    const button=document.getElementById("copySummary");
    button.textContent=text.copied;
    setTimeout(()=>button.textContent=text.copy,1200);
  }catch{
    alert(summary);
  }
});

setupPlanner();
restoreState();
refreshPlannerTargetOptions();
applyLanguage(currentLanguage);
