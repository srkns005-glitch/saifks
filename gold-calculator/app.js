const buildingNames=["town","embassy","barracks","stable","range","command","infirmary","academy"];

const buildingLabels={
  town:"Town Center",
  embassy:"Embassy",
  barracks:"Barracks",
  stable:"Stable",
  range:"Range",
  command:"Command Center",
  infirmary:"Infirmary",
  academy:"War Academy"
};

const levels=window.LEVEL_ORDER;
const box=document.getElementById("buildings");

buildingNames.forEach(name=>{
  const availableLevels=levels.filter(level=>BUILDING_DATA[name][level]);
  const block=document.createElement("div");
  block.className="building";

  block.innerHTML=`
    <label class="building-title">
      <input type="checkbox" id="${name}">
      ${buildingLabels[name]}
    </label>
    <div class="building-grid">
      <div>
        <label for="${name}Current">Current Level</label>
        <select id="${name}Current" disabled>
          <option value="">—</option>
        </select>
      </div>
      <div>
        <label for="${name}Target">Target Level</label>
        <select id="${name}Target" disabled>
          <option value="">—</option>
        </select>
      </div>
    </div>`;

  box.appendChild(block);

  const current=document.getElementById(`${name}Current`);
  const target=document.getElementById(`${name}Target`);
  const check=document.getElementById(name);

  availableLevels.forEach(level=>{
    current.add(new Option(level,level));
    target.add(new Option(level,level));
  });

  function refreshTargetOptions(){
    const currentIndex=availableLevels.indexOf(current.value);

    Array.from(target.options).forEach((option,index)=>{
      if(index===0){
        option.disabled=false;
        return;
      }
      option.disabled=currentIndex>=0 && (index-1)<=currentIndex;
    });

    if(
      target.value &&
      availableLevels.indexOf(target.value)<=currentIndex
    ){
      target.value="";
    }
  }

  check.addEventListener("change",()=>{
    block.classList.toggle("active",check.checked);
    current.disabled=!check.checked;
    target.disabled=!check.checked;

    if(!check.checked){
      current.value="";
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

const numberValue=id=>Math.max(0,Number(document.getElementById(id).value)||0);
const formatNumber=value=>Math.round(value).toLocaleString("en-US");

const formatTime=seconds=>{
  seconds=Math.max(0,Math.round(seconds));
  const days=Math.floor(seconds/86400);
  seconds%=86400;
  const hours=Math.floor(seconds/3600);
  seconds%=3600;
  const minutes=Math.floor(seconds/60);
  return `${days}d ${hours}h ${minutes}m`;
};

function setResult(id,value,isTime=false){
  document.getElementById(id).textContent=
    isTime ? formatTime(value) : formatNumber(value);
}

function setBalance(id,value){
  const element=document.getElementById(id);
  element.textContent=formatNumber(value);
  element.classList.remove("good","bad");

  if(value>0) element.classList.add("good");
  if(value<0) element.classList.add("bad");
}

function calculate(){
  const totals={
    food:0,
    wood:0,
    stone:0,
    iron:0,
    trueGold:0,
    temperedGold:0,
    time:0,
    power:0
  };

  buildingNames.forEach(name=>{
    if(!document.getElementById(name).checked) return;

    const current=document.getElementById(`${name}Current`).value;
    const target=document.getElementById(`${name}Target`).value;
    if(!current || !target) return;

    const available=levels.filter(level=>BUILDING_DATA[name][level]);
    const start=available.indexOf(current);
    const end=available.indexOf(target);
    if(start<0 || end<=start) return;

    for(let index=start+1;index<=end;index++){
      const row=BUILDING_DATA[name][available[index]];
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

  // Construction-speed bonuses increase speed, so base time is divided
  // by 1 + total speed. Saul and Double Time are separate reductions.
  let reducedTime=totals.time/(1+constructionSpeed/100);
  reducedTime*=1-saulReduction/100;

  if(document.getElementById("doubleTime").checked){
    reducedTime*=0.8;
  }

  const remainingTime=Math.max(
    0,
    reducedTime-numberValue("speedups")*86400
  );

  const ownedTempered=numberValue("temperedGold");
  const ownedTrue=numberValue("trueGold");

  setResult("requiredTemperedGold",totals.temperedGold);
  setResult("availableTemperedGold",ownedTempered);
  setBalance(
    "remainingTemperedGold",
    ownedTempered-totals.temperedGold
  );

  setResult("requiredTrueGold",totals.trueGold);

  // Saul does not reduce either type of gold.
  setResult("adjustedTrueGold",totals.trueGold);
  setResult("availableTrueGold",ownedTrue);
  setBalance(
    "remainingTrueGold",
    ownedTrue-totals.trueGold
  );
  setBalance(
    "adjustedRemainingTrueGold",
    ownedTrue-totals.trueGold
  );

  setResult("originalTime",totals.time,true);
  setResult("reducedTime",reducedTime,true);
  setResult("remainingTime",remainingTime,true);

  ["food","wood","stone","iron"].forEach(resource=>{
    setResult(resource,totals[resource]);
    setResult(
      `${resource}AfterSaul`,
      totals[resource]*(1-saulReduction/100)
    );
  });

  setResult("powerGain",totals.power);
}

document.querySelectorAll("input,select").forEach(element=>{
  element.addEventListener("input",calculate);
  element.addEventListener("change",calculate);
});

document.getElementById("resetCalculator").addEventListener("click",()=>{
  document.querySelectorAll('input[type="number"]').forEach(element=>{
    element.value=0;
  });

  document.querySelectorAll('input[type="checkbox"]').forEach(element=>{
    element.checked=false;
  });

  document.querySelectorAll(".building").forEach(element=>{
    element.classList.remove("active");
  });

  document.querySelectorAll("select").forEach(element=>{
    element.value="";

    if(
      element.id.endsWith("Current") ||
      element.id.endsWith("Target")
    ){
      element.disabled=true;
    }

    Array.from(element.options).forEach(option=>{
      option.disabled=false;
    });
  });

  calculate();
});

document.getElementById("copySummary").addEventListener("click",async()=>{
  const selectedBuildings=[];

  buildingNames.forEach(name=>{
    if(!document.getElementById(name).checked) return;

    const current=document.getElementById(`${name}Current`).value;
    const target=document.getElementById(`${name}Target`).value;

    if(current && target){
      selectedBuildings.push(
        `${buildingLabels[name]}: ${current} → ${target}`
      );
    }
  });

  const summary=`True Gold Calculator

Buildings
${selectedBuildings.length ? selectedBuildings.join("\n") : "None selected"}

Tempered True Gold Required: ${document.getElementById("requiredTemperedGold").textContent}
Tempered True Gold Remaining: ${document.getElementById("remainingTemperedGold").textContent}

True Gold Required: ${document.getElementById("requiredTrueGold").textContent}
True Gold Remaining: ${document.getElementById("remainingTrueGold").textContent}

Original Time: ${document.getElementById("originalTime").textContent}
Time After Bonuses: ${document.getElementById("reducedTime").textContent}
Remaining Time: ${document.getElementById("remainingTime").textContent}

Resources
Food: ${document.getElementById("food").textContent}
Wood: ${document.getElementById("wood").textContent}
Stone: ${document.getElementById("stone").textContent}
Iron: ${document.getElementById("iron").textContent}

Resources After Saul
Food: ${document.getElementById("foodAfterSaul").textContent}
Wood: ${document.getElementById("woodAfterSaul").textContent}
Stone: ${document.getElementById("stoneAfterSaul").textContent}
Iron: ${document.getElementById("ironAfterSaul").textContent}

Power Gain: ${document.getElementById("powerGain").textContent}

Powered by SaifKS.com`;

  try{
    await navigator.clipboard.writeText(summary);
    const button=document.getElementById("copySummary");
    const originalText=button.textContent;
    button.textContent="Copied";
    setTimeout(()=>button.textContent=originalText,1200);
  }catch{
    alert(summary);
  }
});

calculate();
