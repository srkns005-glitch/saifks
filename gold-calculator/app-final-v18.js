const buildingNames=["town","embassy","barracks","stable","range","command","infirmary","academy"];

const translations={"en":{"title":"True Gold Calculator","buildings":"Buildings","inventory":"Inventory","bonuses":"Bonuses","results":"Results","temperedGold":"Tempered True Gold","trueGold":"True Gold","speedups":"Total Speedups (Days)","construction":"Construction Speed %","wolf":"Wolf Skill","position":"Position Bonus %","saul":"Saul Skill","king":"King Bonus %","preparation":"Kingdom Preparation %","doubleTime":"Double Time (20%)","required":"Required","available":"Available","remaining":"Remaining","timeSummary":"Time Summary","originalTime":"Original Time","afterBonuses":"After Bonuses","remainingTime":"Remaining Time","resources":"Resources","resourcesAfterSaul":"Resources After Saul","food":"Food","wood":"Wood","stone":"Stone","iron":"Iron","power":"Power","powerGained":"Total Power Gained","copy":"Copy Summary","reset":"Reset","current":"Current Level","target":"Target Level","copied":"Copied","none":"None selected","plannerTitle":"Auto Upgrade Planner","plannerHelp":"Choose your current and target Town Center levels.","plannerCurrent":"Current Town Center","plannerTarget":"Target Town Center","generatePlan":"Generate Plan","clearPlan":"Clear Plan","planReady":"Upgrade plan generated.","invalidPlan":"Choose a target level higher than the current level.","plannerGuideTitle":"How to use","plannerGuide1":"Select your current Town Center level.","plannerGuide2":"Select the level you want to reach.","plannerGuide3":"Press Generate Plan to fill the required buildings automatically.","resetConfirmTitle":"Reset saved data?","resetConfirmText":"Are you sure you want to delete all saved calculator data?","yes":"Yes","cancel":"Cancel","resourcesRequired":"Resources Required","requiredTempered":"Tempered True Gold Required","requiredTrue":"True Gold Required"},"ar":{"title":"حاسبة الذهب","buildings":"المباني","inventory":"المخزون","bonuses":"المكافآت","results":"النتائج","temperedGold":"الذهب الخالص المعدل","trueGold":"الذهب الخالص","speedups":"إجمالي التسريعات (بالأيام)","construction":"مكافأة سرعة البناء %","wolf":"مهارة الذئب","position":"مكافأة المنصب %","saul":"مهارة شاول","king":"مكافأة الملك %","preparation":"مكافأة الحدث التحضيري للمملكة ضد المملكة %","doubleTime":"الوقت المزدوج (20%)","required":"المطلوب","available":"الموجود","remaining":"المتبقي","timeSummary":"ملخص الوقت","originalTime":"الوقت الأصلي","afterBonuses":"الوقت بعد المكافآت","remainingTime":"الوقت المتبقي","resources":"الموارد","resourcesAfterSaul":"الموارد بعد شاول","food":"الطعام","wood":"الخشب","stone":"الحجر","iron":"الحديد","power":"القوة","powerGained":"إجمالي القوة المكتسبة","copy":"نسخ الملخص","reset":"إعادة تعيين","current":"المستوى الحالي","target":"المستوى المستهدف","copied":"تم النسخ","none":"لم يتم اختيار مبانٍ","plannerTitle":"مخطط الترقية التلقائي","plannerHelp":"اختر مستوى مركز المدينة الحالي والمستوى المستهدف.","plannerCurrent":"مستوى مركز المدينة الحالي","plannerTarget":"مستوى مركز المدينة المستهدف","generatePlan":"إنشاء الخطة","clearPlan":"مسح الخطة","planReady":"تم إنشاء خطة الترقية.","invalidPlan":"اختر مستوى مستهدفًا أعلى من المستوى الحالي.","plannerGuideTitle":"طريقة الاستخدام","plannerGuide1":"اختر مستوى مركز المدينة الحالي.","plannerGuide2":"اختر المستوى الذي تريد الوصول إليه.","plannerGuide3":"اضغط إنشاء الخطة ليتم تعبئة المباني المطلوبة تلقائيًا.","resetConfirmTitle":"حذف البيانات المحفوظة؟","resetConfirmText":"هل أنت متأكد من حذف جميع بيانات الحاسبة المحفوظة؟","yes":"نعم","cancel":"إلغاء","resourcesRequired":"الموارد المطلوبة","requiredTempered":"الذهب الخالص المعدل المطلوب","requiredTrue":"الذهب الخالص المطلوب"},"fr":{"title":"Calculateur d’or véritable","buildings":"Bâtiments","inventory":"Inventaire","bonuses":"Bonus","results":"Résultats","temperedGold":"Or véritable trempé","trueGold":"Or véritable","speedups":"Accélérations totales (jours)","construction":"Vitesse de construction %","wolf":"Compétence du loup","position":"Bonus de poste %","saul":"Compétence de Saul","king":"Bonus du roi %","preparation":"Préparation du royaume %","doubleTime":"Temps double (20 %)","required":"Requis","available":"Disponible","remaining":"Restant","timeSummary":"Résumé du temps","originalTime":"Temps initial","afterBonuses":"Après les bonus","remainingTime":"Temps restant","resources":"Ressources","resourcesAfterSaul":"Ressources après Saul","food":"Nourriture","wood":"Bois","stone":"Pierre","iron":"Fer","power":"Puissance","powerGained":"Puissance totale gagnée","copy":"Copier le résumé","reset":"Réinitialiser","current":"Niveau actuel","target":"Niveau cible","copied":"Copié","none":"Aucun bâtiment sélectionné","plannerTitle":"Planificateur d’amélioration automatique","plannerHelp":"Choisissez les niveaux actuel et cible du centre-ville.","plannerCurrent":"Centre-ville actuel","plannerTarget":"Centre-ville cible","generatePlan":"Générer le plan","clearPlan":"Effacer le plan","planReady":"Plan d’amélioration généré.","invalidPlan":"Choisissez un niveau cible supérieur au niveau actuel.","plannerGuideTitle":"Mode d’emploi","plannerGuide1":"Sélectionnez le niveau actuel de votre centre-ville.","plannerGuide2":"Sélectionnez le niveau que vous souhaitez atteindre.","plannerGuide3":"Appuyez sur Générer le plan pour remplir automatiquement les bâtiments requis.","resetConfirmTitle":"Réinitialiser les données enregistrées ?","resetConfirmText":"Voulez-vous vraiment supprimer toutes les données enregistrées du calculateur ?","yes":"Oui","cancel":"Annuler","resourcesRequired":"Ressources requises","requiredTempered":"Or véritable trempé requis","requiredTrue":"Or véritable requis"},"es":{"title":"Calculadora de oro verdadero","buildings":"Edificios","inventory":"Inventario","bonuses":"Bonificaciones","results":"Resultados","temperedGold":"Oro verdadero templado","trueGold":"Oro verdadero","speedups":"Aceleraciones totales (días)","construction":"Velocidad de construcción %","wolf":"Habilidad del lobo","position":"Bonificación de cargo %","saul":"Habilidad de Saul","king":"Bonificación del rey %","preparation":"Preparación del reino %","doubleTime":"Tiempo doble (20 %)","required":"Necesario","available":"Disponible","remaining":"Restante","timeSummary":"Resumen de tiempo","originalTime":"Tiempo original","afterBonuses":"Después de bonificaciones","remainingTime":"Tiempo restante","resources":"Recursos","resourcesAfterSaul":"Recursos después de Saul","food":"Comida","wood":"Madera","stone":"Piedra","iron":"Hierro","power":"Poder","powerGained":"Poder total obtenido","copy":"Copiar resumen","reset":"Restablecer","current":"Nivel actual","target":"Nivel objetivo","copied":"Copiado","none":"Ningún edificio seleccionado","plannerTitle":"Planificador automático de mejoras","plannerHelp":"Elige los niveles actual y objetivo del centro de la ciudad.","plannerCurrent":"Centro de la ciudad actual","plannerTarget":"Centro de la ciudad objetivo","generatePlan":"Generar plan","clearPlan":"Borrar plan","planReady":"Plan de mejora generado.","invalidPlan":"Elige un nivel objetivo superior al nivel actual.","plannerGuideTitle":"Cómo usar","plannerGuide1":"Selecciona el nivel actual del centro de la ciudad.","plannerGuide2":"Selecciona el nivel que deseas alcanzar.","plannerGuide3":"Pulsa Generar plan para completar automáticamente los edificios necesarios.","resetConfirmTitle":"¿Restablecer los datos guardados?","resetConfirmText":"¿Seguro que deseas eliminar todos los datos guardados de la calculadora?","yes":"Sí","cancel":"Cancelar","resourcesRequired":"Recursos necesarios","requiredTempered":"Oro verdadero templado necesario","requiredTrue":"Oro verdadero necesario"},"de":{"title":"Echtgold-Rechner","buildings":"Gebäude","inventory":"Inventar","bonuses":"Boni","results":"Ergebnisse","temperedGold":"Gehärtetes Echtgold","trueGold":"Echtgold","speedups":"Gesamte Beschleunigungen (Tage)","construction":"Baugeschwindigkeit %","wolf":"Wolfsfähigkeit","position":"Positionsbonus %","saul":"Sauls Fähigkeit","king":"Königsbonus %","preparation":"Königreichsvorbereitung %","doubleTime":"Doppelte Zeit (20 %)","required":"Benötigt","available":"Verfügbar","remaining":"Verbleibend","timeSummary":"Zeitübersicht","originalTime":"Ursprüngliche Zeit","afterBonuses":"Nach Boni","remainingTime":"Verbleibende Zeit","resources":"Ressourcen","resourcesAfterSaul":"Ressourcen nach Saul","food":"Nahrung","wood":"Holz","stone":"Stein","iron":"Eisen","power":"Macht","powerGained":"Gesamte gewonnene Macht","copy":"Zusammenfassung kopieren","reset":"Zurücksetzen","current":"Aktuelles Level","target":"Ziellevel","copied":"Kopiert","none":"Keine Gebäude ausgewählt","plannerTitle":"Automatischer Ausbauplaner","plannerHelp":"Wähle das aktuelle und das gewünschte Level des Stadtzentrums.","plannerCurrent":"Aktuelles Stadtzentrum","plannerTarget":"Ziel-Stadtzentrum","generatePlan":"Plan erstellen","clearPlan":"Plan löschen","planReady":"Ausbauplan erstellt.","invalidPlan":"Wähle ein Ziellevel über dem aktuellen Level.","plannerGuideTitle":"So funktioniert es","plannerGuide1":"Wähle das aktuelle Level deines Stadtzentrums.","plannerGuide2":"Wähle das Level, das du erreichen möchtest.","plannerGuide3":"Drücke Plan erstellen, um die benötigten Gebäude automatisch auszufüllen.","resetConfirmTitle":"Gespeicherte Daten zurücksetzen?","resetConfirmText":"Möchtest du wirklich alle gespeicherten Rechnerdaten löschen?","yes":"Ja","cancel":"Abbrechen","resourcesRequired":"Benötigte Ressourcen","requiredTempered":"Benötigtes gehärtetes Echtgold","requiredTrue":"Benötigtes Echtgold"},"tr":{"title":"Gerçek Altın Hesaplayıcı","buildings":"Binalar","inventory":"Envanter","bonuses":"Bonuslar","results":"Sonuçlar","temperedGold":"İşlenmiş Gerçek Altın","trueGold":"Gerçek Altın","speedups":"Toplam Hızlandırma (Gün)","construction":"İnşaat Hızı %","wolf":"Kurt Yeteneği","position":"Görev Bonusu %","saul":"Saul Yeteneği","king":"Kral Bonusu %","preparation":"Krallık Hazırlığı %","doubleTime":"Çift Süre (20%)","required":"Gerekli","available":"Mevcut","remaining":"Kalan","timeSummary":"Süre Özeti","originalTime":"Orijinal Süre","afterBonuses":"Bonuslardan Sonra","remainingTime":"Kalan Süre","resources":"Kaynaklar","resourcesAfterSaul":"Saul Sonrası Kaynaklar","food":"Yiyecek","wood":"Odun","stone":"Taş","iron":"Demir","power":"Güç","powerGained":"Toplam Kazanılan Güç","copy":"Özeti Kopyala","reset":"Sıfırla","current":"Mevcut Seviye","target":"Hedef Seviye","copied":"Kopyalandı","none":"Bina seçilmedi","plannerTitle":"Otomatik Yükseltme Planlayıcı","plannerHelp":"Mevcut ve hedef Şehir Merkezi seviyelerini seçin.","plannerCurrent":"Mevcut Şehir Merkezi","plannerTarget":"Hedef Şehir Merkezi","generatePlan":"Plan Oluştur","clearPlan":"Planı Temizle","planReady":"Yükseltme planı oluşturuldu.","invalidPlan":"Mevcut seviyeden daha yüksek bir hedef seçin.","plannerGuideTitle":"Nasıl kullanılır","plannerGuide1":"Mevcut Şehir Merkezi seviyenizi seçin.","plannerGuide2":"Ulaşmak istediğiniz seviyeyi seçin.","plannerGuide3":"Gerekli binaları otomatik doldurmak için Plan Oluştur'a basın.","resetConfirmTitle":"Kayıtlı veriler sıfırlansın mı?","resetConfirmText":"Tüm kayıtlı hesaplayıcı verilerini silmek istediğinize emin misiniz?","yes":"Evet","cancel":"İptal","resourcesRequired":"Gerekli Kaynaklar","requiredTempered":"Gerekli İşlenmiş Gerçek Altın","requiredTrue":"Gerekli Gerçek Altın"},"ko":{"title":"진금 계산기","buildings":"건물","inventory":"보유량","bonuses":"보너스","results":"결과","temperedGold":"정제 진금","trueGold":"진금","speedups":"총 가속 (일)","construction":"건설 속도 %","wolf":"늑대 스킬","position":"직책 보너스 %","saul":"사울 스킬","king":"왕 보너스 %","preparation":"왕국 준비 보너스 %","doubleTime":"더블 타임 (20%)","required":"필요량","available":"보유량","remaining":"남은 양","timeSummary":"시간 요약","originalTime":"기본 시간","afterBonuses":"보너스 적용 후","remainingTime":"남은 시간","resources":"자원","resourcesAfterSaul":"사울 적용 후 자원","food":"식량","wood":"목재","stone":"석재","iron":"철","power":"전투력","powerGained":"총 획득 전투력","copy":"요약 복사","reset":"초기화","current":"현재 레벨","target":"목표 레벨","copied":"복사됨","none":"선택된 건물 없음","plannerTitle":"자동 업그레이드 플래너","plannerHelp":"현재 및 목표 도시 센터 레벨을 선택하세요.","plannerCurrent":"현재 도시 센터","plannerTarget":"목표 도시 센터","generatePlan":"계획 생성","clearPlan":"계획 지우기","planReady":"업그레이드 계획이 생성되었습니다.","invalidPlan":"현재 레벨보다 높은 목표 레벨을 선택하세요.","plannerGuideTitle":"사용 방법","plannerGuide1":"현재 도시 센터 레벨을 선택하세요.","plannerGuide2":"도달하려는 레벨을 선택하세요.","plannerGuide3":"계획 생성을 눌러 필요한 건물을 자동으로 입력하세요.","resetConfirmTitle":"저장된 데이터를 초기화할까요?","resetConfirmText":"저장된 계산기 데이터를 모두 삭제하시겠습니까?","yes":"예","cancel":"취소","resourcesRequired":"필요 자원","requiredTempered":"필요 정제 진금","requiredTrue":"필요 진금"},"ja":{"title":"真金計算機","buildings":"建物","inventory":"所持量","bonuses":"ボーナス","results":"結果","temperedGold":"鍛錬真金","trueGold":"真金","speedups":"総加速（日）","construction":"建設速度 %","wolf":"ウルフスキル","position":"役職ボーナス %","saul":"サウルスキル","king":"王ボーナス %","preparation":"王国準備ボーナス %","doubleTime":"ダブルタイム (20%)","required":"必要量","available":"所持量","remaining":"残り","timeSummary":"時間概要","originalTime":"元の時間","afterBonuses":"ボーナス適用後","remainingTime":"残り時間","resources":"資源","resourcesAfterSaul":"サウル適用後の資源","food":"食料","wood":"木材","stone":"石材","iron":"鉄","power":"戦力","powerGained":"獲得戦力合計","copy":"概要をコピー","reset":"リセット","current":"現在レベル","target":"目標レベル","copied":"コピーしました","none":"建物が選択されていません","plannerTitle":"自動アップグレードプランナー","plannerHelp":"現在と目標のタウンセンターレベルを選択してください。","plannerCurrent":"現在のタウンセンター","plannerTarget":"目標タウンセンター","generatePlan":"プランを作成","clearPlan":"プランを消去","planReady":"アップグレードプランを作成しました。","invalidPlan":"現在より高い目標レベルを選択してください。","plannerGuideTitle":"使い方","plannerGuide1":"現在のタウンセンターレベルを選択します。","plannerGuide2":"到達したいレベルを選択します。","plannerGuide3":"プランを作成を押すと必要な建物が自動入力されます。","resetConfirmTitle":"保存データをリセットしますか？","resetConfirmText":"保存済みの計算機データをすべて削除しますか？","yes":"はい","cancel":"キャンセル","resourcesRequired":"必要資源","requiredTempered":"必要な鍛錬真金","requiredTrue":"必要な真金"},"zh":{"title":"真金计算器","buildings":"建筑","inventory":"库存","bonuses":"加成","results":"结果","temperedGold":"淬炼真金","trueGold":"真金","speedups":"总加速（天）","construction":"建造速度 %","wolf":"狼技能","position":"职位加成 %","saul":"索尔技能","king":"国王加成 %","preparation":"王国备战加成 %","doubleTime":"双倍时间 (20%)","required":"需要","available":"拥有","remaining":"剩余","timeSummary":"时间汇总","originalTime":"原始时间","afterBonuses":"加成后","remainingTime":"剩余时间","resources":"资源","resourcesAfterSaul":"索尔加成后资源","food":"食物","wood":"木材","stone":"石材","iron":"铁","power":"战力","powerGained":"总获得战力","copy":"复制摘要","reset":"重置","current":"当前等级","target":"目标等级","copied":"已复制","none":"未选择建筑","plannerTitle":"自动升级规划器","plannerHelp":"请选择当前和目标市政厅等级。","plannerCurrent":"当前市政厅","plannerTarget":"目标市政厅","generatePlan":"生成计划","clearPlan":"清除计划","planReady":"升级计划已生成。","invalidPlan":"请选择高于当前等级的目标等级。","plannerGuideTitle":"使用方法","plannerGuide1":"选择当前市政厅等级。","plannerGuide2":"选择你想达到的等级。","plannerGuide3":"点击生成计划，自动填写所需建筑。","resetConfirmTitle":"重置已保存数据？","resetConfirmText":"确定要删除所有已保存的计算器数据吗？","yes":"是","cancel":"取消","resourcesRequired":"所需资源","requiredTempered":"所需淬炼真金","requiredTrue":"所需真金"}};

const buildingLabels={"en":{"town":"Town Center","embassy":"Embassy","barracks":"Barracks","stable":"Stable","range":"Range","command":"Command Center","infirmary":"Infirmary","academy":"War Academy"},"ar":{"town":"مركز المدينة","embassy":"السفارة","barracks":"الثكنات","stable":"الإسطبل","range":"معسكر الرماة","command":"مركز القيادة","infirmary":"المستشفى","academy":"أكاديمية الحرب"},"fr":{"town":"Centre-ville","embassy":"Ambassade","barracks":"Caserne","stable":"Écurie","range":"Camp d’archers","command":"Centre de commandement","infirmary":"Infirmerie","academy":"Académie de guerre"},"es":{"town":"Centro de la ciudad","embassy":"Embajada","barracks":"Cuartel","stable":"Establo","range":"Campo de arqueros","command":"Centro de mando","infirmary":"Enfermería","academy":"Academia de guerra"},"de":{"town":"Stadtzentrum","embassy":"Botschaft","barracks":"Kaserne","stable":"Stall","range":"Bogenschützenlager","command":"Kommandozentrale","infirmary":"Lazarett","academy":"Kriegsakademie"},"tr":{"town":"Şehir Merkezi","embassy":"Elçilik","barracks":"Kışla","stable":"Ahır","range":"Okçu Kampı","command":"Komuta Merkezi","infirmary":"Revir","academy":"Savaş Akademisi"},"ko":{"town":"도시 센터","embassy":"대사관","barracks":"병영","stable":"마구간","range":"궁병 캠프","command":"지휘 센터","infirmary":"의무실","academy":"전쟁 아카데미"},"ja":{"town":"タウンセンター","embassy":"大使館","barracks":"兵舎","stable":"厩舎","range":"弓兵キャンプ","command":"司令センター","infirmary":"診療所","academy":"戦争アカデミー"},"zh":{"town":"市政厅","embassy":"大使馆","barracks":"兵营","stable":"马厩","range":"弓兵营地","command":"指挥中心","infirmary":"医院","academy":"战争学院"}};

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
  localStorage.setItem("saifRallyLang",language);
  document.getElementById("languageSelect").value=language;

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

document.getElementById("languageSelect").addEventListener("change",function(){
  applyLanguage(this.value);
  saveState();
});

const numberValue=id=>Math.max(0,Number(document.getElementById(id).value)||0);
const localeMap={en:"en-US",ar:"ar-AE",fr:"fr-FR",es:"es-ES",de:"de-DE",tr:"tr-TR",ko:"ko-KR",ja:"ja-JP",zh:"zh-CN"};
const formatNumber=value=>Math.round(value).toLocaleString(localeMap[currentLanguage]||"en-US");

const formatTime=seconds=>{
  seconds=Math.max(0,Math.round(seconds));
  const days=Math.floor(seconds/86400);
  seconds%=86400;
  const hours=Math.floor(seconds/3600);
  seconds%=3600;
  const minutes=Math.floor(seconds/60);

  if(currentLanguage==="ar") return `${days}ي ${hours}س ${minutes}د`;
  if(currentLanguage==="fr") return `${days}j ${hours}h ${minutes}min`;
  if(currentLanguage==="es") return `${days}d ${hours}h ${minutes}min`;
  if(currentLanguage==="de") return `${days}T ${hours}Std ${minutes}Min`;
  if(currentLanguage==="tr") return `${days}g ${hours}s ${minutes}dk`;
  if(currentLanguage==="ko") return `${days}일 ${hours}시간 ${minutes}분`;
  if(currentLanguage==="ja") return `${days}日 ${hours}時間 ${minutes}分`;
  if(currentLanguage==="zh") return `${days}天 ${hours}小时 ${minutes}分`;
  return `${days}d ${hours}h ${minutes}m`;
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
    }else if(element.id==="languageSelect"){
      element.value=currentLanguage;
      element.disabled=false;
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
  const zeroTimes=["0d 0h 0m","0ي 0س 0د","0j 0h 0min","0d 0h 0min","0T 0Std 0Min"];
  const add=(label,id)=>{
    const value=document.getElementById(id).textContent.trim();
    if(value!=="0"&&!zeroTimes.includes(value)) lines.push("",label,value);
  };

  lines.push(text.title,"",text.buildings);
  if(selected.length) lines.push(...selected);

  add(text.requiredTempered,"requiredTemperedGold");
  add(text.requiredTrue,"requiredTrueGold");

  let resourceHeaderAdded=false;
  [["food","foodAfterSaul"],["wood","woodAfterSaul"],["stone","stoneAfterSaul"],["iron","ironAfterSaul"]].forEach(([key,id])=>{
    const value=document.getElementById(id).textContent.trim();
    if(value!=="0"){
      if(!resourceHeaderAdded){
        lines.push("",text.resourcesRequired);
        resourceHeaderAdded=true;
      }
      lines.push(`${text[key]}: ${value}`);
    }
  });

  add(text.power,"powerGain");
  add(text.remainingTime,"remainingTime");
  lines.push("","SaifKS.com");
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
if(typeof refreshPlannerTargetOptions==="function") refreshPlannerTargetOptions();
currentLanguage=localStorage.getItem("saifRallyLang")||"en";
applyLanguage(currentLanguage);


window.addEventListener("storage",function(event){
  if(event.key==="saifRallyLang" && event.newValue && translations[event.newValue]){
    applyLanguage(event.newValue);
  }
});
