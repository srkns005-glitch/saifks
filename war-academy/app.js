(() => {
  'use strict';
  const languages = Object.keys(WAR_I18N);
  const requested = new URLSearchParams(location.search).get('lang');
  let lang = languages.includes(requested) ? requested : (languages.includes(localStorage.getItem('saifksLanguage')) ? localStorage.getItem('saifksLanguage') : 'ar');
  let tree = 'basic', filter = 'infantry', basicBranch = 'infantry', viewMode = 'map', summaryScope = 'all', page = 1, data, latestSummary = '';
  let progress = {}, targets = {}, selectedId = null, advancedSelected = {}, inventory = {};
  let showAllResources = true;
  try {progress = JSON.parse(localStorage.getItem('saifWarAcademyProgress') || '{}') || {}} catch {progress = {}};
  try {targets = JSON.parse(localStorage.getItem('saifWarAcademyTargets') || '{}') || {}} catch {targets = {}};
  try {advancedSelected = JSON.parse(localStorage.getItem('saifWarAdvancedSelected') || '{}') || {}} catch {advancedSelected = {}};
  try {inventory = JSON.parse(localStorage.getItem('saifWarInventory') || '{}') || {}} catch {inventory = {}};
  const $ = id => document.getElementById(id);
  const tr = key => WAR_I18N[lang][key] ?? WAR_I18N.en[key] ?? key;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const format = value => new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : lang).format(Number(value) || 0);
  const compact = value => {
    const n=Number(value)||0;
    if(n<1000)return format(n);
    const [unit,suffix]=n>=1e9?[1e9,'B']:n>=1e6?[1e6,'M']:[1e3,'K'];
    const rounded=Math.round(n/unit*10)/10;
    return `${rounded*unit===n?'':'≈'}${new Intl.NumberFormat(lang==='zh'?'zh-CN':lang,{maximumFractionDigits:1}).format(rounded)}${suffix}`;
  };
  const exact = value => `title="${esc(format(value))}" aria-label="${esc(format(value))}"`;
  const resourceKeys = ['dust','ttg','bread','wood','stone','iron','gold'];
  const plannedItems = kind => data[kind].filter(item=>target(item)>current(item));
  const symbols = {infantry:'⌑',cavalry:'♘',archer:'⌁',special:'✧',economy:'◈',capacity:'▤',combat:'✦'};
  const names = (item, kind) => {
    if (lang === 'en') return item.name;
    if (kind === 'basic') return tr('names')['basic:' + item.id] || item.name;
    const parts = /^(.*?)\s+(I|II|III|IV|V|VI)$/.exec(item.name);
    const base = parts ? parts[1] : item.name;
    const translated = tr('names')['advanced:' + base] || base;
    return translated + (parts ? ' ' + format(['I','II','III','IV','V','VI'].indexOf(parts[2]) + 1) : '');
  };
  const effect = item => lang === 'en' ? item.effect : (tr('names')['effect:' + item.effect] || item.effect);
  const resourceName = k => tr(k === 'ttg' ? 'temperedTruegold' : k);
  const current = item => Math.max(0,Math.min(item.maxLevel,Number(progress[item.id]) || 0));
  const target = item => Math.max(current(item),Math.min(item.maxLevel,targets[item.id] === undefined ? (item.group && advancedSelected[item.id] ? item.maxLevel : current(item)) : (Number(targets[item.id])||0)));
  const saveProgress = (item,level) => {progress[item.id]=Math.max(0,Math.min(item.maxLevel,Number(level)||0));localStorage.setItem('saifWarAcademyProgress',JSON.stringify(progress));if(Number(targets[item.id])<current(item)){targets[item.id]=current(item);localStorage.setItem('saifWarAcademyTargets',JSON.stringify(targets))}};
  const saveTarget = (item,level) => {targets[item.id]=Math.max(current(item),Math.min(item.maxLevel,Number(level)||0));localStorage.setItem('saifWarAcademyTargets',JSON.stringify(targets));if(item.group){advancedSelected[item.id]=targets[item.id]>current(item);localStorage.setItem('saifWarAdvancedSelected',JSON.stringify(advancedSelected))}};
  const duration = seconds => {
    const minutes = Math.max(0,Math.ceil(seconds/60));
    const day=Math.floor(minutes/1440),hour=Math.floor(minutes%1440/60),minute=minutes%60;
    return [day&&`${format(day)} ${tr('dayUnit')}`,hour&&`${format(hour)} ${tr('hourUnit')}`,minute&&`${format(minute)} ${tr('minuteUnit')}`].filter(Boolean).join(' ') || `${format(0)} ${tr('minuteUnit')}`;
  };
  const parseAmount = value => {
    if(typeof value==='number')return value;
    const match=/^(\d+(?:\.\d+)?)([KMB])?$/.exec(String(value));
    return match ? Math.round(Number(match[1])*({K:1e3,M:1e6,B:1e9}[match[2]]||1)) : 0;
  };
  const inventoryAmount = value => {
    const digits=String(value??'').replace(/[٠-٩]/g,ch=>String(ch.charCodeAt(0)-1632)).replace(/[۰-۹]/g,ch=>String(ch.charCodeAt(0)-1776)).replace(/[٬,\s]/g,'').replace('٫','.').trim().toUpperCase();
    return Math.max(0,parseAmount(digits));
  };
  const setLanguage = next => {
    lang = next;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = `${tr('title')} | SaifKS`;
    $('language').value = lang;
    document.querySelectorAll('[data-t]').forEach(el => {
      const value = tr(el.dataset.t);
      if (el.id === 'pageTitle') {const split=value.lastIndexOf(' ');el.innerHTML=split>0?`${esc(value.slice(0,split))} <em>${esc(value.slice(split+1))}</em>`:`<em>${esc(value)}</em>`;}
      else el.textContent = value;
    });
    $('search').placeholder = tr('search'); $('search').setAttribute('aria-label',tr('search'));
    $('homeLink').href = '../index.html?lang=' + lang;
    $('homeBtn').href = '../index.html?lang=' + lang;
    localStorage.setItem('saifksLanguage',lang);
    const url = new URL(location.href); url.searchParams.set('lang',lang); history.replaceState(null,'',url);
    renderInventory();
    render();
  };
  const renderFilters = () => {
    const groups = tree === 'basic' ? (viewMode === 'map' ? ['infantry','cavalry','archer'] : ['all','infantry','cavalry','archer']) : ['all','special','economy','capacity','combat'];
    $('filters').innerHTML = groups.map(x => {const count=plannedItems(tree).filter(item=>x==='all'||(tree==='basic'?item.category:item.group)===x).length;return `<button type="button" data-filter="${x}" class="${filter===x?'isActive':''}" aria-pressed="${filter===x}">${esc(tr(x))}${count?` <span class="filterCount" aria-label="${esc(tr('plannedCount'))}">${format(count)}</span>`:''}</button>`}).join('');
    document.querySelectorAll('[data-tree]').forEach(el => {const active = el.dataset.tree === tree;el.classList.toggle('isActive',active);el.setAttribute('aria-pressed',String(active));const count=plannedItems(el.dataset.tree).length;el.innerHTML=`${esc(tr(el.dataset.tree))}${count?` <span class="filterCount" aria-label="${esc(tr('plannedCount'))}">${format(count)}</span>`:''}`;});
  };
  const iconPaths = [
    '<path d="M7 22h34M10 20l4-12h20l4 12M16 8l4 8h8l4-8M20 29h8M24 24v13M14 37h20"/>',
    '<path d="M24 4 39 10v12c0 11-7 18-15 22C16 40 9 33 9 22V10Z"/><path d="m17 23 5 5 10-11"/>',
    '<path d="M11 38 37 9M32 8l7 1-1 7M8 33l7 7M11 29l8 8M10 10l28 28"/>',
    '<path d="M8 39h32M14 35V19l10-10 10 10v16M19 35V24h10v11M12 20h24M17 10h14"/>',
    '<path d="m9 34 25-25 6 6-25 25-6-6ZM29 14l5 5M7 32l9 9"/>',
    '<path d="M24 4 40 11v13c0 10-7 17-16 21C15 41 8 34 8 24V11Z"/><path d="M16 15h16M16 23h16M24 16v17"/>',
    '<path d="M24 4 29 18l15 1-12 9 4 14-12-8-12 8 4-14-12-9 15-1Z"/>',
    '<path d="M24 8c-5-7-17-3-17 7 0 12 17 24 17 24s17-12 17-24c0-10-12-14-17-7Z"/><path d="M24 14v14M17 21h14"/>',
    '<path d="M24 4v40M4 24h40M9 9l30 30M39 9 9 39"/><circle cx="24" cy="24" r="10"/>',
    '<path d="M24 40V9m0 0L14 20M24 9l10 11M8 40h32M12 32h24"/>'
  ];
  const edges = [
    [0,1,'M300 140 V169 H150 V194'],[0,2,'M300 140 V169 H450 V194'],
    [1,3,'M150 306 V338 H300 V359'],[2,3,'M450 306 V338 H300 V359'],
    [3,4,'M300 471 V502 H150 V524'],[3,5,'M300 471 V502 H450 V524'],
    [4,6,'M150 636 V667 H300 V688'],[5,6,'M450 636 V667 H300 V688'],
    [6,7,'M300 800 V831 H96 V852'],[6,8,'M300 800 V852'],[6,9,'M300 800 V831 H504 V852']
  ];
  const positions = [[50,84],[25,250],[75,250],[50,415],[25,580],[75,580],[50,744],[16,908],[50,908],[84,908]];
  const renderMap = () => {
    const items = data.basic.filter(item=>item.category===filter);
    const done = items.filter(item=>current(item)===item.maxLevel).length;
    const lines = edges.map(([a,b,d])=>`<path d="${d}" class="mapEdge ${current(items[a])&&current(items[b])?'isStarted':''} ${current(items[a])===items[a].maxLevel&&current(items[b])===items[b].maxLevel?'isComplete':''}"/>`).join('');
    const nodes = items.map((item,i)=>{
      const [x,y]=positions[i],level=current(item),complete=level===item.maxLevel;
      const icon=`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[i]}</svg>`;
      const options=(kind)=>Array.from({length:item.maxLevel+1},(_,n)=>`<option value="${n}" ${kind==='target'&&n<level?'disabled':''} ${n===(kind==='current'?level:target(item))?'selected':''}>${format(n)}</option>`).join('');
      return `<div class="mapNode ${complete?'isComplete':''} ${target(item)>level?'isPlanned':''} ${i===6?'isUnlock':''} ${selectedId===item.id?'isSelected':''}" style="--x:${x}%;--y:${y}px"><button type="button" class="mapIcon" data-item="${esc(item.id)}" aria-label="${esc(names(item,'basic'))}${complete?' · '+esc(tr('completedStatus')):target(item)>level?' · '+esc(tr('plannedStatus')):''}">${icon}</button><div class="nodeControls"><label><span>${esc(tr('currentShort'))}</span><select data-current="${esc(item.id)}" aria-label="${esc(tr('myLevel'))}: ${esc(names(item,'basic'))}">${options('current')}</select></label><label><span>${esc(tr('targetShort'))}</span><select data-target="${esc(item.id)}" aria-label="${esc(tr('toLevel'))}: ${esc(names(item,'basic'))}">${options('target')}</select></label></div><span class="nodeName">${esc(names(item,'basic'))}</span></div>`;
    }).join('');
    $('map').innerHTML=`<div class="mapTop"><div class="mapTitle"><span class="mapEmblem" aria-hidden="true">${symbols[filter]}</span><span><small>${esc(tr('pathLabel'))} / ${esc(tr(filter))}</small><strong>${esc(tr(filter))}</strong></span></div><div class="mapProgress"><strong class="dir-ltr">${format(done)} / ${format(items.length)}</strong><small>${esc(tr('completedCount'))}</small></div></div><div class="mapCanvas" data-branch="${filter}"><svg class="mapConnections" viewBox="0 0 600 980" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>${nodes}</div><div class="mapFoot"><span class="pulse"></span>${esc(tr('currentTargetLegend'))} · ${esc(tr('savedLocally'))}</div>`;
  };
  const renderSummary = () => {
    if(!data)return;
    const items=summaryScope==='all'?[...data.basic,...data.advanced]:data[tree].filter(item=>filter==='all'||(tree==='basic'?item.category:item.group)===filter);
    const total={bread:0,wood:0,stone:0,iron:0,gold:0,dust:0,ttg:0,seconds:0};
    let planned=0;
    const plannedNames=[];
    for(const item of items){
      const from=current(item),to=target(item);
      if(to<=from)continue;
      planned++;plannedNames.push(`${names(item,item.group?'advanced':'basic')}${item.id.startsWith('truegold-battalion')||item.id.startsWith('truegold-legionaries')?' · '+tr(item.category):''} (${format(from)} → ${format(to)})`);
      for(const level of item.levels)if(level.level>from&&level.level<=to){
        for(const key of resourceKeys)total[key]+=level[key]||0;
        total.seconds+=level.seconds||0;
      }
    }
    const context=summaryScope==='all'?tr('allResearch'):(filter==='all'?tr(tree==='basic'?'allBasic':'allAdvanced'):tr('currentGroup').replace('{group}',tr(filter)));
    $('summaryContext').textContent=`${context} · ${format(planned)} ${tr('selectedResearch')}`;
    document.querySelectorAll('[data-scope]').forEach(el=>{const active=el.dataset.scope===summaryScope;el.classList.toggle('isActive',active);el.setAttribute('aria-pressed',String(active))});
    const keys=['ttg','dust','bread','wood','stone','iron','gold'];
    const usedKeys=keys.filter(key=>total[key]>0);
    const shortageKeys=usedKeys.filter(key=>total[key]>inventoryAmount(inventory[key]));
    const visibleKeys=showAllResources?usedKeys:shortageKeys;
    $('summaryResources').innerHTML=planned?(visibleKeys.length?visibleKeys.map(key=>{const available=inventoryAmount(inventory[key]),missing=Math.max(0,total[key]-available);return `<div class="plannerStat ${missing?'needsMore':''}"><span class="resourceTitle">${esc(resourceName(key))}</span><div class="resourceBreakdown"><div><small>${esc(tr('availableAmount'))}</small><strong class="dir-ltr" ${exact(available)}>${esc(compact(available))}</strong></div><div><small>${esc(tr('requiredAmount'))}</small><strong class="dir-ltr" ${exact(total[key])}>${esc(compact(total[key]))}</strong></div><div class="${missing?'resourceMissing':'resourceCovered'}"><small>${esc(tr('resourceShortage'))}</small><strong class="dir-ltr" ${exact(missing)}>${esc(compact(missing))}</strong></div></div></div>`}).join(''):`<p class="emptyPlan">${esc(tr('allCovered'))}</p>`):`<p class="emptyPlan">${esc(tr('emptyPlan'))}</p>`;
    $('toggleResources').hidden=!planned||!usedKeys.length||shortageKeys.length===usedKeys.length;
    $('toggleResources').textContent=tr(showAllResources?'shortagesOnly':'allResources');
    $('toggleResources').setAttribute('aria-expanded',String(showAllResources));
    const speed=Math.max(0,Math.min(1000,Number($('researchSpeed').value)||0));
    const needed=total.seconds/(1+speed/100);
    const available=(Number($('speedDays').value)||0)*86400+(Number($('speedHours').value)||0)*3600+(Number($('speedMinutes').value)||0)*60;
    $('summaryLead').innerHTML=planned?`<div><span>${esc(tr('missingResourcesCount'))}</span><strong>${format(shortageKeys.length)}</strong></div><div><span>${esc(tr('speedupsShortage'))}</span><strong>${esc(duration(Math.max(0,needed-available)))}</strong></div>`:'';
    $('summaryTimes').innerHTML=planned?`<div class="speedupStat"><span>${esc(tr('speedupsNeeded'))}</span><strong>${esc(duration(needed))}</strong></div>`:'';
    $('summaryNote').textContent=planned?tr('exactNote')+' '+tr('speedupsResourceNote'):'';
    latestSummary=[tr('planTitle'),`${context} · ${format(planned)} ${tr('selectedResearch')}`,...plannedNames, ...(planned?usedKeys.map(key=>`${resourceName(key)} · ${tr('availableAmount')}: ${format(inventoryAmount(inventory[key]))} · ${tr('requiredAmount')}: ${format(total[key])} · ${tr('resourceShortage')}: ${format(Math.max(0,total[key]-inventoryAmount(inventory[key])))}`):[tr('emptyPlan')]), ...(planned?[`${tr('baseTime')}: ${duration(total.seconds)}`,`${tr('speedupsNeeded')}: ${duration(needed)}`,`${tr('availableSpeedups')}: ${duration(available)}`,`${tr('speedupsShortage')}: ${duration(Math.max(0,needed-available))}`]:[])].join('\n');
    $('quickSummary').hidden=!planned;
    $('quickSummary').textContent=tr('openSummary')+' ↗';
  };
  const renderInventory = () => {
    $('inventoryResources').innerHTML=resourceKeys.map(key=>`<label><span>${esc(resourceName(key))}</span><input type="text" inputmode="decimal" autocomplete="off" data-inventory="${key}" value="${esc(inventory[key]||'')}" placeholder="0" aria-label="${esc(resourceName(key))}"></label>`).join('');
  };
  const renderSelected = item => {
    const advanced=tree==='advanced', from=current(item), to=target(item);
    const total={dust:0,ttg:0,bread:0,wood:0,stone:0,iron:0,gold:0,seconds:0};
    for(const level of item.levels)if(level.level>from&&level.level<=to){for(const key of resourceKeys)total[key]+=level[key]||0;total.seconds+=level.seconds||0}
    const keys=advanced?resourceKeys:['dust','bread','wood','stone','iron','gold'];
    const included=to>from;
    $('selectedResult').innerHTML=`<div class="selectedHeading"><div><small>${esc(tr('selectedCostTitle'))}</small><strong>${esc(names(item,tree))}</strong></div><span class="selectedRange">${esc(tr('level'))} ${format(from)} → ${format(to)}</span></div>${included?`<div class="selectedCosts">${keys.filter(key=>total[key]>0).map(key=>`<span><small>${esc(resourceName(key))}</small><b class="dir-ltr" ${exact(total[key])}>${esc(compact(total[key]))}</b></span>`).join('')}<span><small>${esc(tr('baseTime'))}</small><b>${esc(duration(total.seconds))}</b></span></div>`:`<p class="selectedPrompt">${esc(tr(from>=item.maxLevel?'completedStatus':'chooseLevels'))}</p>`}`;
  };
  const syncMapLevels = item => {
    const node=Array.from($('map').querySelectorAll('.mapNode')).find(el=>el.querySelector('.mapIcon')?.dataset.item===item.id);
    if(node){
      const level=current(item),goal=target(item);
      node.querySelector('[data-current]').value=String(level);
      const goalSelect=node.querySelector('[data-target]');goalSelect.value=String(goal);
      for(const option of goalSelect.options)option.disabled=Number(option.value)<level;
      node.classList.toggle('isComplete',level===item.maxLevel);
      node.classList.toggle('isPlanned',goal>level);
      node.querySelector('.mapIcon').setAttribute('aria-label',`${names(item,'basic')}${level===item.maxLevel?' · '+tr('completedStatus'):goal>level?' · '+tr('plannedStatus'):''}`);
      $('map').querySelectorAll('.mapNode').forEach(el=>el.classList.toggle('isSelected',el===node));
      const items=data.basic.filter(x=>x.category===filter);
      const count=items.filter(x=>current(x)===x.maxLevel).length;
      $('map').querySelector('.mapProgress strong').textContent=`${format(count)} / ${format(items.length)}`;
      $('map').querySelectorAll('.mapEdge').forEach((edge,index)=>{
        const [a,b]=edges[index];
        edge.classList.toggle('isStarted',!!(current(items[a])&&current(items[b])));
        edge.classList.toggle('isComplete',current(items[a])===items[a].maxLevel&&current(items[b])===items[b].maxLevel);
      });
    }
    $('results').querySelectorAll('.researchItem').forEach(row=>{
      const select=row.querySelector('[data-current]');if(!select||select.dataset.current!==item.id)return;
      select.value=String(current(item));
      const goal=row.querySelector('[data-target]');goal.value=String(target(item));
      for(const option of goal.options)option.disabled=Number(option.value)<current(item);
      row.classList.toggle('isSelected',true);
      row.classList.toggle('isComplete',current(item)===item.maxLevel);
      row.classList.toggle('isPlanned',target(item)>current(item));
      const badge=row.querySelector('.stateBadge');if(badge)badge.textContent=current(item)===item.maxLevel?tr('completedStatus'):target(item)>current(item)?tr('plannedStatus'):'';
    });
    renderSelected(item);
    renderFilters();
    $('planFilterCount').textContent=`${format(plannedItems(tree).filter(entry=>filter==='all'||(tree==='basic'?entry.category:entry.group)===filter).length)} ${tr('plannedCount')}`;
    renderSummary();
  };
  const render = () => {
    if (!data) return;
    renderFilters();
    const q = $('search').value.trim().toLocaleLowerCase();
    const items = data[tree].filter(item => (filter === 'all' || (tree === 'basic' ? item.category : item.group) === filter) && (!q || [names(item,tree),effect(item),item.name,item.effect].some(x => x.toLocaleLowerCase().includes(q))));
    $('resultCount').textContent = `${format(items.length)} ${tr('results')}`;
    const inSection=plannedItems(tree).filter(item=>filter==='all'||(tree==='basic'?item.category:item.group)===filter).length;
    $('planFilterCount').textContent=`${format(inSection)} ${tr('plannedCount')}`;
    $('clearSearch').hidden=!$('search').value;
    if(!items.some(item=>item.id===selectedId))selectedId=items[0]?.id||null;
    $('selectedResult').hidden=!selectedId;
    if(selectedId)renderSelected(items.find(item=>item.id===selectedId));
    renderSummary();
    const mapVisible=tree==='basic'&&viewMode==='map'&&!q;
    $('map').hidden=!mapVisible;$('results').hidden=mapVisible;
    if(mapVisible){renderMap();$('showMore').hidden=true;return;}
    const visible = items.slice(0,page*24);
    $('results').innerHTML = visible.length ? visible.map(item => {
      const group = tree==='basic' ? item.category : item.group;
      const options=(kind)=>Array.from({length:item.maxLevel+1},(_,n)=>`<option value="${n}" ${kind==='target'&&n<current(item)?'disabled':''} ${n===(kind==='current'?current(item):target(item))?'selected':''}>${format(n)}</option>`).join('');
      return `<div class="researchItem ${selectedId===item.id?'isSelected':''} ${current(item)===item.maxLevel?'isComplete':''} ${target(item)>current(item)?'isPlanned':''}"><button type="button" class="researchPick" data-item="${esc(item.id)}"><span class="itemSymbol" aria-hidden="true">${symbols[group]}</span><span class="itemText"><strong>${esc(names(item,tree))}</strong><small>${esc(effect(item))}</small><small class="stateBadge">${current(item)===item.maxLevel?esc(tr('completedStatus')):target(item)>current(item)?esc(tr('plannedStatus')):''}</small></span></button><div class="listLevelControls"><label><span>${esc(tr('currentShort'))}</span><select data-current="${esc(item.id)}" aria-label="${esc(tr('myLevel'))}: ${esc(names(item,tree))}">${options('current')}</select></label><label><span>${esc(tr('targetShort'))}</span><select data-target="${esc(item.id)}" aria-label="${esc(tr('toLevel'))}: ${esc(names(item,tree))}">${options('target')}</select></label></div></div>`;
    }).join('') : `<div class="empty">${esc(tr('noResults'))}</div>`;
    $('showMore').hidden = visible.length >= items.length;
  };
  document.querySelectorAll('[data-tree]').forEach(el => el.addEventListener('click',()=>{tree=el.dataset.tree;viewMode=tree==='basic'&&!$('search').value.trim()?'map':'list';filter=tree==='basic'&&viewMode==='map'?basicBranch:'all';page=1;render();}));
  $('filters').addEventListener('click',e=>{const button=e.target.closest('[data-filter]');if(!button)return;filter=button.dataset.filter;if(tree==='basic'&&filter!=='all')basicBranch=filter;page=1;render();});
  $('results').addEventListener('click',e=>{const button=e.target.closest('[data-item]');if(!button)return;const item=data[tree].find(x=>x.id===button.dataset.item);if(item){selectedId=item.id;render();}});
  $('map').addEventListener('click',e=>{const button=e.target.closest('[data-item]');if(!button)return;const item=data.basic.find(x=>x.id===button.dataset.item);if(item){selectedId=item.id;render();}});
  $('showMore').addEventListener('click',()=>{page++;render();});
  $('summaryScope').addEventListener('click',e=>{const button=e.target.closest('[data-scope]');if(!button)return;summaryScope=button.dataset.scope;renderSummary()});
  $('toggleResources').addEventListener('click',()=>{showAllResources=!showAllResources;renderSummary()});
  const feedback = key => {$('planFeedback').textContent=tr(key)};
  const persistPlan=()=>{localStorage.setItem('saifWarAcademyTargets',JSON.stringify(targets));localStorage.setItem('saifWarAdvancedSelected',JSON.stringify(advancedSelected))};
  $('clearPlan').addEventListener('click',()=>{
    if(!data)return;
    targets={};advancedSelected={};persistPlan();feedback('planCleared');render();
  });
  $('resetAll').addEventListener('click',()=>{
    if(!data||!window.confirm(tr('confirmResetAll')))return;
    progress={};targets={};advancedSelected={};inventory={};
    localStorage.setItem('saifWarAcademyProgress','{}');persistPlan();
    localStorage.setItem('saifWarInventory','{}');localStorage.setItem('saifWarResearchSpeed','0');
    localStorage.setItem('saifWarAvailableSpeedups','{}');
    $('researchSpeed').value='0';
    for(const id of ['speedDays','speedHours','speedMinutes'])$(id).value='0';
    renderInventory();render();feedback('everythingCleared');
  });
  $('copySummary').addEventListener('click',async()=>{
    try{
      if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(latestSummary);
      else{
        const field=document.createElement('textarea');field.value=latestSummary;field.style.position='fixed';field.style.opacity='0';document.body.appendChild(field);field.select();const copied=document.execCommand('copy');field.remove();if(!copied)throw new Error('copy failed');
      }
      $('copySummary').textContent=tr('copiedSummary');
      setTimeout(()=>$('copySummary').textContent=tr('copySummary'),2200);
    }catch{$('copySummary').textContent=tr('copyFailed')}
  });
  $('researchSpeed').addEventListener('input',()=>{const speed=Math.max(0,Math.min(1000,Number($('researchSpeed').value)||0));if(Number($('researchSpeed').value)>1000||Number($('researchSpeed').value)<0)$('researchSpeed').value=String(speed);localStorage.setItem('saifWarResearchSpeed',String(speed));renderSummary()});
  $('inventoryResources').addEventListener('input',e=>{const input=e.target.closest('[data-inventory]');if(!input)return;inventory[input.dataset.inventory]=input.value;localStorage.setItem('saifWarInventory',JSON.stringify(inventory));renderSummary()});
  $('search').addEventListener('input',()=>{page=1;if(tree==='basic'){viewMode=$('search').value.trim()?'list':'map';filter=viewMode==='map'?basicBranch:'all'}render();});
  $('clearSearch').addEventListener('click',()=>{$('search').value='';page=1;if(tree==='basic'){viewMode='map';filter=basicBranch}render();$('search').focus()});
  $('language').addEventListener('change',e=>setLanguage(e.target.value));
  const changeLevel=e=>{const control=e.target.closest('[data-current],[data-target]');if(!control)return;const item=data[tree].find(x=>x.id===(control.dataset.current||control.dataset.target));if(!item)return;selectedId=item.id;$('planFeedback').textContent='';if(control.dataset.current)saveProgress(item,control.value);else saveTarget(item,control.value);syncMapLevels(item)};
  $('map').addEventListener('change',changeLevel);
  $('results').addEventListener('change',changeLevel);
  for(const id of ['speedDays','speedHours','speedMinutes'])$(id).addEventListener('input',()=>{const values={};for(const field of ['speedDays','speedHours','speedMinutes']){const input=$(field);if(Number(input.value)<0)input.value='0';values[field]=Math.max(0,Number(input.value)||0)}localStorage.setItem('saifWarAvailableSpeedups',JSON.stringify(values));renderSummary()});
  $('researchSpeed').value=String(Math.max(0,Math.min(1000,Number(localStorage.getItem('saifWarResearchSpeed'))||0)));
  try{const saved=JSON.parse(localStorage.getItem('saifWarAvailableSpeedups')||'{}');for(const id of ['speedDays','speedHours','speedMinutes'])$(id).value=String(Math.max(0,Number(saved[id])||0))}catch{}
  fetch('data.json?v=17').then(response=>{if(!response.ok)throw new Error(response.status);return response.json()}).then(json=>{data=json;setLanguage(lang)}).catch(()=>{$('results').innerHTML='<div class="empty">Unable to load research data.</div>'});
})();
