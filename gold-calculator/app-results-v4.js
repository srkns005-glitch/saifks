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
    none:"None selected"
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
    none:"لم يتم اختيار مبانٍ"
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
    current.add(new Option(level,level));
    target.add(new Option(level,level));
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
  applyLanguage(currentLanguage==="en"?"ar":"en");
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

    totals.power+=
      BUILDING_DATA[name][target].power-
      BUILDING_DATA[name][current].power;
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
  element.addEventListener("input",calculate);
  element.addEventListener("change",calculate);
});

document.getElementById("resetCalculator").addEventListener("click",()=>{
  document.querySelectorAll('input[type="number"]').forEach(element=>element.value="");
  document.querySelectorAll('input[type="checkbox"]').forEach(element=>element.checked=false);
  document.querySelectorAll(".building").forEach(element=>element.classList.remove("active"));

  document.querySelectorAll("select").forEach(element=>{
    if(element.id.endsWith("Current")){
      element.value="Base";
      element.disabled=true;
    }else if(element.id.endsWith("Target")){
      element.value="";
      element.disabled=true;
    }else{
      element.value="0";
    }
    Array.from(element.options).forEach(option=>option.disabled=false);
  });

  calculate();
});

document.getElementById("copySummary").addEventListener("click",async()=>{
  const selected=[];

  buildingNames.forEach(name=>{
    if(!document.getElementById(name).checked) return;

    const current=document.getElementById(`${name}Current`).value;
    const target=document.getElementById(`${name}Target`).value;

    if(current&&target){
      selected.push(`${buildingLabels[currentLanguage][name]}: ${current} → ${target}`);
    }
  });

  const text=translations[currentLanguage];
  const summary=currentLanguage==="ar"
    ?`حاسبة الذهب

المباني
${selected.length?selected.join("\n"):text.none}

الذهب الخالص المعدل المطلوب: ${document.getElementById("requiredTemperedGold").textContent}
الذهب الخالص المعدل المتبقي: ${document.getElementById("remainingTemperedGold").textContent}

الذهب الخالص المطلوب: ${document.getElementById("requiredTrueGold").textContent}
الذهب الخالص المتبقي: ${document.getElementById("remainingTrueGold").textContent}

الوقت الأصلي: ${document.getElementById("originalTime").textContent}
الوقت بعد المكافآت: ${document.getElementById("reducedTime").textContent}
الوقت المتبقي: ${document.getElementById("remainingTime").textContent}

SaifKS.com`
    :`True Gold Calculator

Buildings
${selected.length?selected.join("\n"):text.none}

Tempered True Gold Required: ${document.getElementById("requiredTemperedGold").textContent}
Tempered True Gold Remaining: ${document.getElementById("remainingTemperedGold").textContent}

True Gold Required: ${document.getElementById("requiredTrueGold").textContent}
True Gold Remaining: ${document.getElementById("remainingTrueGold").textContent}

Original Time: ${document.getElementById("originalTime").textContent}
Time After Bonuses: ${document.getElementById("reducedTime").textContent}
Remaining Time: ${document.getElementById("remainingTime").textContent}

SaifKS.com`;

  try{
    await navigator.clipboard.writeText(summary);
    const button=document.getElementById("copySummary");
    button.textContent=text.copied;
    setTimeout(()=>button.textContent=text.copy,1200);
  }catch{
    alert(summary);
  }
});

applyLanguage(currentLanguage);
