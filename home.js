(() => {
  'use strict';
  const translations = window.homeTranslations;
  const extras = {
    ar:{statTools:'أداة',statLanguages:'لغات',statReady:'جاهز',tactical:'مجموعة الأدوات التكتيكية',battlePlan:'خطة المعركة',allSystems:'كل الأنظمة جاهزة',search:'البحث في الأدوات',searchPlaceholder:'ابحث عن أداة...',filterAll:'الكل',noResults:'لا توجد أدوات مطابقة لبحثك.',whyLabel:'لماذا SAIFKS',whyTitle:'كل ما تحتاجه لتخطط بثقة.',whyText:'صُممت للاعبين الذين يهتمون بالقرارات الواضحة والحسابات الدقيقة والتنسيق الأسرع للتحالف.',benefitFast:'سرعة من البداية',benefitFastText:'صل إلى الإجابة المناسبة دون خطوات غير ضرورية.',benefitPractical:'مصممة للعب الحقيقي',benefitPracticalText:'أدوات عملية مبنية حول قرارات KINGSHOT اليومية.',benefitGlobal:'تسع لغات',benefitGlobalText:'تجربة موحدة للتحالفات حول العالم.'},
    en:{statTools:'Tools',statLanguages:'Languages',statReady:'Ready',tactical:'Tactical toolkit',battlePlan:'Battle plan',allSystems:'All systems ready',search:'Search tools',searchPlaceholder:'Search tools...',filterAll:'All',noResults:'No tools match your search.',whyLabel:'WHY SAIFKS',whyTitle:'Everything you need to plan with confidence.',whyText:'Built for players who value clear decisions, accurate calculations, and faster alliance coordination.',benefitFast:'Fast by design',benefitFastText:'Get to the right answer without unnecessary steps.',benefitPractical:'Built for real play',benefitPracticalText:'Practical tools shaped around everyday KINGSHOT decisions.',benefitGlobal:'Nine languages',benefitGlobalText:'A consistent experience for alliances around the world.'},
    tr:{statTools:'Araç',statLanguages:'Dil',statReady:'Hazır',tactical:'Taktik araç seti',battlePlan:'Savaş planı',allSystems:'Tüm sistemler hazır',search:'Araçlarda ara',searchPlaceholder:'Araç ara...',filterAll:'Tümü',noResults:'Aramanızla eşleşen araç yok.',whyLabel:'NEDEN SAIFKS',whyTitle:'Güvenle planlamak için ihtiyacınız olan her şey.',whyText:'Net kararlar, doğru hesaplamalar ve hızlı ittifak koordinasyonu için tasarlandı.',benefitFast:'Hız için tasarlandı',benefitFastText:'Gereksiz adımlar olmadan doğru sonuca ulaşın.',benefitPractical:'Gerçek oyun için',benefitPracticalText:'Günlük KINGSHOT kararları için pratik araçlar.',benefitGlobal:'Dokuz dil',benefitGlobalText:'Dünyadaki ittifaklar için tutarlı deneyim.'},
    es:{statTools:'Herramientas',statLanguages:'Idiomas',statReady:'Listo',tactical:'Kit táctico',battlePlan:'Plan de batalla',allSystems:'Todo listo',search:'Buscar herramientas',searchPlaceholder:'Buscar herramienta...',filterAll:'Todo',noResults:'No hay resultados.',whyLabel:'POR QUÉ SAIFKS',whyTitle:'Todo para planificar con confianza.',whyText:'Decisiones claras, cálculos precisos y mejor coordinación.',benefitFast:'Rápido por diseño',benefitFastText:'Llega a la respuesta sin pasos innecesarios.',benefitPractical:'Para el juego real',benefitPracticalText:'Herramientas prácticas para KINGSHOT.',benefitGlobal:'Nueve idiomas',benefitGlobalText:'Una experiencia global y consistente.'},
    de:{statTools:'Tools',statLanguages:'Sprachen',statReady:'Bereit',tactical:'Taktisches Toolkit',battlePlan:'Kampfplan',allSystems:'Alles bereit',search:'Tools suchen',searchPlaceholder:'Tool suchen...',filterAll:'Alle',noResults:'Keine passenden Tools.',whyLabel:'WARUM SAIFKS',whyTitle:'Alles für eine sichere Planung.',whyText:'Klare Entscheidungen, genaue Berechnungen und schnelle Koordination.',benefitFast:'Schnell entwickelt',benefitFastText:'Ohne unnötige Schritte zum Ergebnis.',benefitPractical:'Für echtes Spielen',benefitPracticalText:'Praktische Tools für KINGSHOT.',benefitGlobal:'Neun Sprachen',benefitGlobalText:'Eine einheitliche globale Erfahrung.'},
    fr:{statTools:'Outils',statLanguages:'Langues',statReady:'Prêt',tactical:'Boîte tactique',battlePlan:'Plan de bataille',allSystems:'Tout est prêt',search:'Rechercher',searchPlaceholder:'Rechercher un outil...',filterAll:'Tous',noResults:'Aucun outil trouvé.',whyLabel:'POURQUOI SAIFKS',whyTitle:'Tout pour planifier en confiance.',whyText:'Des décisions claires, des calculs précis et une coordination rapide.',benefitFast:'Rapide par design',benefitFastText:'La bonne réponse sans étapes inutiles.',benefitPractical:'Pour le jeu réel',benefitPracticalText:'Des outils pratiques pour KINGSHOT.',benefitGlobal:'Neuf langues',benefitGlobalText:'Une expérience cohérente partout.'},
    ko:{statTools:'도구',statLanguages:'언어',statReady:'준비',tactical:'전술 도구',battlePlan:'전투 계획',allSystems:'모든 시스템 준비',search:'도구 검색',searchPlaceholder:'도구 검색...',filterAll:'전체',noResults:'검색 결과가 없습니다.',whyLabel:'SAIFKS를 선택하는 이유',whyTitle:'자신 있게 계획하는 데 필요한 모든 것.',whyText:'명확한 결정과 정확한 계산, 빠른 연맹 협력을 위해 만들었습니다.',benefitFast:'빠른 설계',benefitFastText:'불필요한 단계 없이 답을 찾으세요.',benefitPractical:'실전 중심',benefitPracticalText:'KINGSHOT 실전용 도구입니다.',benefitGlobal:'9개 언어',benefitGlobalText:'전 세계 연맹을 위한 경험입니다.'},
    ja:{statTools:'ツール',statLanguages:'言語',statReady:'準備完了',tactical:'戦術ツール',battlePlan:'戦闘計画',allSystems:'準備完了',search:'ツール検索',searchPlaceholder:'ツールを検索...',filterAll:'すべて',noResults:'該当するツールはありません。',whyLabel:'SAIFKSの強み',whyTitle:'自信を持って計画するためのすべて。',whyText:'明確な判断、正確な計算、迅速な同盟連携のために。',benefitFast:'高速設計',benefitFastText:'不要な手順なしで答えに到達。',benefitPractical:'実戦向け',benefitPracticalText:'KINGSHOTの日常に役立つツール。',benefitGlobal:'9言語',benefitGlobalText:'世界中の同盟に一貫した体験。'},
    zh:{statTools:'工具',statLanguages:'语言',statReady:'就绪',tactical:'战术工具箱',battlePlan:'战斗计划',allSystems:'全部就绪',search:'搜索工具',searchPlaceholder:'搜索工具...',filterAll:'全部',noResults:'没有匹配的工具。',whyLabel:'为什么选择 SAIFKS',whyTitle:'自信规划所需的一切。',whyText:'为清晰决策、精准计算和高效联盟协作而设计。',benefitFast:'快速设计',benefitFastText:'无需多余步骤即可获得答案。',benefitPractical:'贴近实战',benefitPracticalText:'围绕 KINGSHOT 日常决策打造。',benefitGlobal:'九种语言',benefitGlobalText:'为全球联盟提供一致体验。'}
  };
  const groups = [
    {title:'groupPlan',description:'groupPlanDesc',tools:[
      {name:'rallyTitle',description:'rallyDesc',action:'launch',icon:'clock',path:'rally.html'},
      {name:'eventsTitle',description:'eventsDesc',action:'openGuide',icon:'calendar',path:'event-center/index.html'}
    ]},
    {title:'groupBuild',description:'groupBuildDesc',tools:[
      {name:'goldTitle',description:'goldDesc',action:'launch',icon:'gold',path:'gold-calculator/index.html'},
      {name:'governorTitle',description:'governorDesc',action:'openGovernor',icon:'crown',path:'governor-center/index.html'},
      {name:'researchTitle',description:'researchDesc',action:'launch',icon:'book',path:'research/index.html'},
      {name:'warTitle',description:'warDesc',action:'openWar',icon:'swords',path:'war-academy/index.html'},
      {name:'petTitle',description:'petDesc',action:'openPet',icon:'paw',path:'pet-center/index.html'}
    ]},
    {title:'groupHeroes',description:'groupHeroesDesc',tools:[
      {name:'heroTitle',description:'heroDesc',action:'openHeroes',icon:'hero',path:'hero-center/index.html'},
      {name:'heroGearTitle',description:'heroGearDesc',action:'openHeroGear',icon:'shield',path:'hero-gear-center/index.html?v=hero-gear-v31-stable-language-20260930'},
      {name:'mastersTitle',description:'mastersDesc',action:'openMasters',icon:'star',path:'masters/index.html'}
    ]}
  ];
  const supported = Object.keys(translations);
  const params = new URLSearchParams(location.search);
  const requested = params.get('lang');
  function savedLanguage(){try{return localStorage.getItem('saifRallyLang') || localStorage.getItem('saifksLanguage') || localStorage.getItem('language');}catch{return null;}}
  let lang = supported.includes(requested) ? requested : (supported.includes(savedLanguage()) ? savedLanguage() : 'en');
  function localLink(path){return path + '?lang=' + encodeURIComponent(lang);}
  function svg(name){return `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`;}
  function renderTools(){
    const text = translations[lang];
    const host = document.getElementById('toolGroups');
    host.replaceChildren();
    groups.forEach((group,groupIndex) => {
      const section = document.createElement('section');
      section.className = 'group';
      section.dataset.group = String(groupIndex);
      const heading = document.createElement('div');
      heading.className = 'group-title';
      const headingCopy = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = text[group.title];
      const description = document.createElement('p');
      description.textContent = text[group.description];
      headingCopy.append(title,description);
      heading.append(headingCopy);
      const cards = document.createElement('div');
      cards.className = 'cards';
      for(const tool of group.tools){
        const card = document.createElement('a');
        card.className = 'tool-card';
        card.href = localLink(tool.path);
        const icon = document.createElement('span');
        icon.className = 'card-icon';
        icon.innerHTML = svg(tool.icon);
        const body = document.createElement('span');
        body.className = 'card-body';
        const name = document.createElement('h4');
        name.textContent = text[tool.name];
        const summary = document.createElement('p');
        summary.textContent = text[tool.description];
        const action = document.createElement('span');
        action.className = 'card-action';
        action.textContent = text[tool.action] + ' ';
        action.insertAdjacentHTML('beforeend',svg('arrow'));
        body.append(name,summary,action);
        card.append(icon,body);
        cards.append(card);
      }
      section.append(heading,cards);
      host.append(section);
    });
    filterTools();
  }
  let activeFilter = 'all';
  function filterTools(){
    document.querySelectorAll('.group').forEach(group => {
      const allowed = activeFilter === 'all' || group.dataset.group === activeFilter;
      let groupVisible = 0;
      group.querySelectorAll('.tool-card').forEach(card => {
        const visible = allowed;
        card.hidden = !visible;
        if(visible){groupVisible++;}
      });
      group.hidden = groupVisible === 0;
    });
  }
  function apply(){
    const text = translations[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(element => {element.textContent = text[element.dataset.i18n];});
    // title contains a single trusted span in the translation catalogue.
    document.querySelectorAll('[data-i18n-html]').forEach(element => {element.innerHTML = text[element.dataset.i18nHtml];});
    document.querySelectorAll('[data-page]').forEach(element => {element.href = localLink(element.dataset.page);});
    const extra = extras[lang] || extras.en;
    document.querySelectorAll('[data-extra]').forEach(element => {element.textContent = extra[element.dataset.extra] || extras.en[element.dataset.extra] || '';});
    document.querySelectorAll('[data-extra-placeholder]').forEach(element => {element.placeholder = extra[element.dataset.extraPlaceholder] || extras.en[element.dataset.extraPlaceholder] || '';});
    document.getElementById('languageSelect').value = lang;
    document.getElementById('languageSelect').setAttribute('aria-label', text.languageLabel);
    document.title = 'SaifKS | ' + text.toolsTitle;
    renderTools();
    try{localStorage.setItem('saifRallyLang',lang);localStorage.setItem('saifksLanguage',lang);localStorage.setItem('language',lang);}catch{}
  }
  document.getElementById('languageSelect').addEventListener('change',event => {
    lang = event.target.value;
    const url = new URL(location.href);
    url.searchParams.set('lang',lang);
    history.replaceState(null,'',url.pathname + url.search + url.hash);
    apply();
  });
  document.querySelectorAll('.filter-pills button').forEach(button => button.addEventListener('click',() => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter-pills button').forEach(item => item.classList.toggle('active',item === button));
    filterTools();
  }));
  const header = document.querySelector('.site-header');
  const updateHeader = () => header.classList.toggle('scrolled',scrollY > 12);
  addEventListener('scroll',updateHeader,{passive:true});
  updateHeader();
  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }else{document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));}
  window.addEventListener('storage',event => {
    if(['saifRallyLang','saifksLanguage','language'].includes(event.key) && supported.includes(event.newValue)){
      lang = event.newValue;
      apply();
    }
  });
  apply();
})();
