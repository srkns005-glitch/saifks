(() => {
  'use strict';
  const translations = window.homeTranslations;
  const profiles = window.homeProfiles;
  const groups = [
    {title:'groupPlan',description:'groupPlanDesc',tools:[
      {name:'rallyTitle',description:'rallyDesc',action:'launch',icon:'clock',path:'rally.html'},
      {name:'bearTitle',description:'bearDesc',action:'launch',icon:'bear',path:'bear.html'},
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
      {name:'heroGearTitle',description:'heroGearDesc',action:'openHeroGear',icon:'shield',path:'hero-gear-center/index.html'},
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
    for(const group of groups){
      const section = document.createElement('section');
      section.className = 'group';
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
    }
  }
  function apply(){
    const text = translations[lang];
    const profile = profiles[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(element => {element.textContent = text[element.dataset.i18n];});
    // title contains a single trusted span in the translation catalogue.
    document.querySelectorAll('[data-i18n-html]').forEach(element => {element.innerHTML = text[element.dataset.i18nHtml];});
    document.querySelectorAll('[data-profile]').forEach(element => {element.textContent = profile[element.dataset.profile];});
    document.querySelectorAll('[data-profile-placeholder]').forEach(element => {element.placeholder = profile[element.dataset.profilePlaceholder];});
    document.querySelectorAll('[data-page]').forEach(element => {element.href = localLink(element.dataset.page);});
    document.getElementById('languageSelect').value = lang;
    document.getElementById('languageSelect').setAttribute('aria-label', text.languageLabel);
    document.title = 'SaifKS | ' + text.toolsTitle;
    renderTools();
    try{localStorage.setItem('saifRallyLang',lang);localStorage.setItem('saifksLanguage',lang);localStorage.setItem('language',lang);}catch{}
  }
  const fields = ['commandPlayer','commandAlliance','commandKingdom'];
  try{
    const saved = JSON.parse(localStorage.getItem('saifksCommandProfile') || '{}');
    fields.forEach((id,index) => {document.getElementById(id).value = saved[['player','alliance','kingdom'][index]] || '';});
  }catch{}
  document.getElementById('saveCommandProfile').addEventListener('click',() => {
    const values = Object.fromEntries(fields.map((id,index) => [['player','alliance','kingdom'][index],document.getElementById(id).value.trim()]));
    try{localStorage.setItem('saifksCommandProfile',JSON.stringify(values));document.getElementById('commandStatus').textContent = profiles[lang].saved;}catch{document.getElementById('commandStatus').textContent = '';}
  });
  document.getElementById('languageSelect').addEventListener('change',event => {
    lang = event.target.value;
    const url = new URL(location.href);
    url.searchParams.set('lang',lang);
    history.replaceState(null,'',url.pathname + url.search + url.hash);
    apply();
  });
  window.addEventListener('storage',event => {
    if(['saifRallyLang','saifksLanguage','language'].includes(event.key) && supported.includes(event.newValue)){
      lang = event.newValue;
      apply();
    }
  });
  apply();
})();
