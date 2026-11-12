(() => {
  'use strict';
  const translations = window.homeTranslations;
  const allLabels = {ar:'الكل',en:'All',tr:'Tümü',es:'Todo',de:'Alle',fr:'Tous',ko:'전체',ja:'すべて',zh:'全部'};
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
      {name:'heroGearTitle',description:'heroGearDesc',action:'openHeroGear',icon:'shield',path:'hero-gear-center/index.html?v=hero-gear-v31-whole-number-inputs-20260930'},
      {name:'mastersTitle',description:'mastersDesc',action:'openMasters',icon:'star',path:'masters/'}
    ]}
  ];
  const appLabels = {
    en:{home:'Home',open:'Open separately'}, ar:{home:'الرئيسية',open:'فتح في صفحة مستقلة'},
    tr:{home:'Ana sayfa',open:'Ayrı aç'}, es:{home:'Inicio',open:'Abrir por separado'},
    de:{home:'Startseite',open:'Separat öffnen'}, fr:{home:'Accueil',open:'Ouvrir séparément'},
    ko:{home:'홈',open:'별도로 열기'}, ja:{home:'ホーム',open:'別に開く'},
    zh:{home:'首页',open:'单独打开'}
  };
  const tools = new Map(groups.flatMap(group => group.tools.map(tool => [tool.icon, tool])));
  const views = document.querySelectorAll('[data-app-view]');
  const frame = document.getElementById('workspaceFrame');
  const workspaceTitle = document.getElementById('workspaceTitle');
  const directLink = document.getElementById('workspaceDirectLink');
  let loadedTool = null;
  const supported = Object.keys(translations);
  const params = new URLSearchParams(location.search);
  const requested = params.get('lang');
  function savedLanguage(){try{return localStorage.getItem('saifRallyLang') || localStorage.getItem('saifksLanguage') || localStorage.getItem('language');}catch{return null;}}
  let lang = supported.includes(requested) ? requested : (supported.includes(savedLanguage()) ? savedLanguage() : 'en');
  function localLink(path){
    const separator = path.includes('?') ? '&' : '?';
    return path + separator + 'lang=' + encodeURIComponent(lang);
  }
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
        card.dataset.toolLink = tool.icon;
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
      group.hidden = !allowed;
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
    document.querySelector('[data-extra="filterAll"]').textContent = allLabels[lang];
    document.getElementById('languageSelect').value = lang;
    document.getElementById('languageSelect').setAttribute('aria-label', text.languageLabel);
    document.title = 'SaifKS | ' + text.toolsTitle;
    document.querySelectorAll('[data-app-text]').forEach(element => {
      element.textContent = appLabels[lang][element.dataset.appText];
    });
    renderTools();
    renderToolNav();
    try{localStorage.setItem('saifRallyLang',lang);localStorage.setItem('saifksLanguage',lang);localStorage.setItem('language',lang);}catch{}
  }
  function renderToolNav(){
    const host = document.getElementById('appToolNav');
    host.replaceChildren();
    for(const group of groups){
      const section = document.createElement('div');
      const heading = document.createElement('p');
      heading.textContent = translations[lang][group.title];
      section.append(heading);
      for(const tool of group.tools){
        const link = document.createElement('a');
        link.href = localLink(tool.path);
        link.dataset.toolLink = tool.icon;
        link.innerHTML = svg(tool.icon);
        link.append(translations[lang][tool.name]);
        section.append(link);
      }
      host.append(section);
    }
  }

  function getRoute(){
    const url = new URL(location.href);
    const tool = url.searchParams.get('tool');
    if(tools.has(tool)) return {view:'workspace', tool};
    const view = url.hash.slice(1);
    return {view:['tools','channel'].includes(view) ? view : 'home'};
  }

  function showRoute({reloadTool = false, focus = false} = {}){
    const {view, tool} = getRoute();
    document.body.dataset.view = view;
    views.forEach(element => { element.hidden = element.dataset.appView !== view; });
    document.querySelectorAll('.app-nav-main [data-view-link], .app-tool-nav [data-tool-link]').forEach(link => {
      const active = link.dataset.viewLink === view || link.dataset.toolLink === tool && Boolean(tool);
      if(active) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    if(tool){
      const definition = tools.get(tool);
      const title = translations[lang][definition.name];
      workspaceTitle.textContent = title;
      frame.title = title;
      directLink.href = localLink(definition.path);
      if(tool !== loadedTool || reloadTool){
        const url = new URL(directLink.href);
        if(loadedTool) frame.contentWindow.location.replace(url);
        else frame.src = url;
        loadedTool = tool;
      }
      document.title = 'SaifKS | ' + title;
      if(focus) workspaceTitle.focus({preventScroll:true});
    }else{
      document.title = 'SaifKS | ' + translations[lang].toolsTitle;
      if(focus) document.getElementById('app-content').focus({preventScroll:true});
    }
    if(focus) scrollTo(0,0);
  }

  function navigate(view, tool, replace = false){
    const url = new URL(location.href);
    if(tool) url.searchParams.set('tool',tool);
    else url.searchParams.delete('tool');
    url.hash = view === 'tools' || view === 'channel' ? view : '';
    if(url.href !== location.href) history[replace ? 'replaceState' : 'pushState'](null,'',url);
    showRoute({focus:true});
  }

  document.addEventListener('click',event => {
    if(event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    const link = event.target.closest('a[data-view-link], a[data-tool-link], a[data-page]');
    if(!link) return;
    const tool = link.dataset.toolLink || [...tools].find(([, value]) => value.path === link.dataset.page)?.[0];
    if(tool || link.dataset.viewLink){
      event.preventDefault();
      navigate(tool ? 'workspace' : link.dataset.viewLink,tool);
    }
  });

  frame.addEventListener('load',() => {
    if(getRoute().view !== 'workspace') return;
    try{
      const url = new URL(frame.contentWindow.location.href);
      const home = new URL('index.html',location.href).pathname;
      if(url.origin === location.origin && [home,home.replace(/index\.html$/,'')].includes(url.pathname)){
        loadedTool = null;
        navigate('home',null,true);
      }
    }catch{
      // The standalone design preview can open tools from the live site.
    }
  });

  function restoreRoute(){
    const next = new URLSearchParams(location.search).get('lang');
    if(supported.includes(next) && next !== lang){
      lang = next;
      apply();
      showRoute({reloadTool:true});
    }else showRoute();
  }

  window.addEventListener('popstate',restoreRoute);
  window.addEventListener('hashchange',restoreRoute);

  document.getElementById('languageSelect').addEventListener('change',event => {
    lang = event.target.value;
    const url = new URL(location.href);
    url.searchParams.set('lang',lang);
    history.replaceState(null,'',url.pathname + url.search + url.hash);
    apply();
    showRoute({reloadTool:true});
  });
  document.querySelectorAll('.filter-pills button').forEach(button => button.addEventListener('click',() => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter-pills button').forEach(item => {
      item.classList.toggle('active',item === button);
      item.setAttribute('aria-pressed',String(item === button));
    });
    filterTools();
  }));
  window.addEventListener('storage',event => {
    if(['saifRallyLang','saifksLanguage','language'].includes(event.key) && supported.includes(event.newValue)){
      lang = event.newValue;
      apply();
      showRoute();
    }
  });
  apply();
  showRoute();
})();
