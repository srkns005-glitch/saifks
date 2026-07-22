const translations = {
  en: {
    eyebrow:"KINGSHOT BATTLE ANALYZER",
    heroText:"Upload your battle report screenshots and receive a clear breakdown of your heroes, troops, stats, weaknesses, and the strongest formation for your next fight.",
    badge1:"Hero Analysis", badge2:"Troop Ratio", badge3:"Stat Comparison", badge4:"Smart Recommendations",
    processTitle:"Analysis Process", processSub:"Four simple steps",
    step1:"Upload Reports", step1Sub:"Add all battle screenshots",
    step2:"Verify Data", step2Sub:"Confirm extracted values",
    step3:"Battle Analysis", step3Sub:"Compare heroes, troops and stats",
    step4:"Recommendations", step4Sub:"Receive the strongest setup",
    privacy:"Your screenshots stay on this device in this design prototype.",
    newAnalysis:"NEW ANALYSIS", uploadTitle:"Upload Battle Reports",
    uploadSub:"Add clear, complete screenshots for the most accurate analysis.",
    reports:" reports", dropTitle:"Drop screenshots here", dropSub:"or tap to browse your device",
    requiredTitle:"Recommended report pages", requiredTag:"For highest accuracy",
    req1:"Battle overview", req2:"Troop details", req3:"Battle statistics", req4:"Heroes and skills",
    clear:"Clear", analyze:"Analyze Battle",
    previewLabel:"INTERFACE PREVIEW", resultsTitle:"Battle IQ Results", confidence:"Confidence",
    battleScore:"BATTLE SCORE", strongPerformance:"Strong Performance",
    scoreText:"Your formation performed well, but the frontline needs more durability.",
    mainDiagnosis:"MAIN DIAGNOSIS", diagnosisTitle:"Infantry health was the key weakness",
    diagnosisText:"Your infantry lost the frontline too early, exposing marksmen before they could deliver full damage.",
    impact:"Impact", high:"High", recommendedFormation:"RECOMMENDED FORMATION", bestChoice:"BEST CHOICE",
    upgradePriority:"UPGRADE PRIORITY", priority1:"Infantry Health", priority1Sub:"Highest battle impact",
    priority2:"Infantry Defense", priority2Sub:"Improve frontline survival",
    priority3:"Hero Skill Levels", priority3Sub:"Increase formation efficiency",
    prototypeWarning:"This is a visual prototype. The current version does not yet read or analyze report data with AI.",
    uploadToast:"Screenshots added successfully", clearToast:"All screenshots cleared",
    demoToast:"Demo results displayed"
  },
  ar: {
    eyebrow:"محلل معارك KINGSHOT",
    heroText:"ارفع صور تقرير المعركة واحصل على تحليل واضح للأبطال والجنود والإحصائيات ونقاط الضعف وأقوى تشكيلة لمعركتك القادمة.",
    badge1:"تحليل الأبطال", badge2:"نسبة الجنود", badge3:"مقارنة الإحصائيات", badge4:"توصيات ذكية",
    processTitle:"مراحل التحليل", processSub:"أربع خطوات بسيطة",
    step1:"رفع التقارير", step1Sub:"أضف جميع صور المعركة",
    step2:"تأكيد البيانات", step2Sub:"راجع القيم المستخرجة",
    step3:"تحليل المعركة", step3Sub:"مقارنة الأبطال والجنود والإحصائيات",
    step4:"التوصيات", step4Sub:"استلم أقوى تشكيلة مقترحة",
    privacy:"تبقى صورك على جهازك في هذه النسخة التصميمية.",
    newAnalysis:"تحليل جديد", uploadTitle:"ارفع تقارير المعركة",
    uploadSub:"أضف صورًا واضحة وكاملة للحصول على أعلى دقة ممكنة.",
    reports:" تقارير", dropTitle:"اسحب الصور وأفلتها هنا", dropSub:"أو اضغط لاختيارها من جهازك",
    requiredTitle:"صفحات التقرير الموصى بها", requiredTag:"لأعلى دقة",
    req1:"ملخص المعركة", req2:"تفاصيل الجنود", req3:"إحصائيات المعركة", req4:"الأبطال والمهارات",
    clear:"مسح", analyze:"تحليل المعركة",
    previewLabel:"معاينة الواجهة", resultsTitle:"نتائج Battle IQ", confidence:"نسبة الثقة",
    battleScore:"تقييم المعركة", strongPerformance:"أداء قوي",
    scoreText:"أدت تشكيلتك بشكل جيد، لكن خطك الأمامي يحتاج إلى صمود أكبر.",
    mainDiagnosis:"التشخيص الرئيسي", diagnosisTitle:"صحة المشاة كانت نقطة الضعف الأساسية",
    diagnosisText:"انهار خط المشاة مبكرًا، مما كشف الرماة قبل أن يقدموا كامل ضررهم.",
    impact:"التأثير", high:"مرتفع", recommendedFormation:"التشكيلة المقترحة", bestChoice:"الخيار الأفضل",
    upgradePriority:"أولوية التطوير", priority1:"صحة المشاة", priority1Sub:"أعلى تأثير في المعركة",
    priority2:"دفاع المشاة", priority2Sub:"تحسين صمود الخط الأمامي",
    priority3:"مستويات مهارات الأبطال", priority3Sub:"رفع كفاءة التشكيلة",
    prototypeWarning:"هذه نسخة تصميمية للواجهة. الإصدار الحالي لا يقرأ أو يحلل بيانات التقارير بالذكاء الاصطناعي حتى الآن.",
    uploadToast:"تمت إضافة الصور بنجاح", clearToast:"تم مسح جميع الصور",
    demoToast:"تم عرض نتائج تجريبية"
  }
};

let language = localStorage.getItem("saifks_language") === "ar" ? "ar" : "en";
let files = [];

const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const previewGrid = document.getElementById("previewGrid");
const reportCount = document.getElementById("reportCount");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const langBtn = document.getElementById("langBtn");
const resultsSection = document.getElementById("resultsSection");
const toast = document.getElementById("toast");

function applyLanguage(){
  const t = translations[language];
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  langBtn.textContent = language === "ar" ? "EN" : "AR";
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.dataset.i18n;
    if(t[key]) el.textContent = t[key];
  });
  localStorage.setItem("saifks_language", language);
}
applyLanguage();

langBtn.addEventListener("click", ()=>{
  language = language === "en" ? "ar" : "en";
  applyLanguage();
});
document.getElementById("homeBtn").addEventListener("click", ()=> location.href = "../index.html");

dropZone.addEventListener("click", ()=> fileInput.click());
fileInput.addEventListener("change", e => addFiles([...e.target.files]));

["dragenter","dragover"].forEach(type => dropZone.addEventListener(type, e=>{
  e.preventDefault(); dropZone.classList.add("dragging");
}));
["dragleave","drop"].forEach(type => dropZone.addEventListener(type, e=>{
  e.preventDefault(); dropZone.classList.remove("dragging");
}));
dropZone.addEventListener("drop", e => addFiles([...e.dataTransfer.files].filter(f=>f.type.startsWith("image/"))));

function addFiles(newFiles){
  const room = Math.max(0, 12 - files.length);
  files.push(...newFiles.slice(0, room));
  renderPreviews();
  showToast(translations[language].uploadToast);
}

function renderPreviews(){
  previewGrid.innerHTML = "";
  files.forEach((file,index)=>{
    const item = document.createElement("div");
    item.className = "preview-item";
    const img = document.createElement("img");
    img.alt = file.name;
    img.src = URL.createObjectURL(file);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";
    remove.addEventListener("click", ()=>{
      files.splice(index,1);
      renderPreviews();
    });
    const name = document.createElement("span");
    name.textContent = file.name;
    item.append(img,remove,name);
    previewGrid.appendChild(item);
  });
  reportCount.textContent = files.length;
  analyzeBtn.disabled = files.length === 0;
  clearBtn.disabled = files.length === 0;
}

clearBtn.addEventListener("click", ()=>{
  files = [];
  fileInput.value = "";
  renderPreviews();
  resultsSection.hidden = true;
  showToast(translations[language].clearToast);
});

analyzeBtn.addEventListener("click", ()=>{
  analyzeBtn.disabled = true;
  const original = analyzeBtn.innerHTML;
  analyzeBtn.innerHTML = `<span class="loading">◌</span><span>${language==="ar"?"جارٍ التحليل...":"Analyzing..."}</span>`;
  setTimeout(()=>{
    analyzeBtn.innerHTML = original;
    analyzeBtn.disabled = false;
    resultsSection.hidden = false;
    resultsSection.scrollIntoView({behavior:"smooth",block:"start"});
    showToast(translations[language].demoToast);
  },900);
});

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(()=>toast.classList.remove("show"),2200);
}
