(() => {
  'use strict';
  const languages = Object.keys(WAR_I18N);
  const requested = new URLSearchParams(location.search).get('lang');
  let lang = languages.includes(requested) ? requested : (languages.includes(localStorage.getItem('saifksLanguage')) ? localStorage.getItem('saifksLanguage') : 'ar');
  let tree = 'basic', filter = 'infantry', viewMode = 'map', summaryScope = 'current', page = 1, data;
  let progress = {}, targets = {};
  try {progress = JSON.parse(localStorage.getItem('saifWarAcademyProgress') || '{}') || {}} catch {progress = {}};
  try {targets = JSON.parse(localStorage.getItem('saifWarAcademyTargets') || '{}') || {}} catch {targets = {}};
  const $ = id => document.getElementById(id);
  const tr = key => WAR_I18N[lang][key] ?? WAR_I18N.en[key] ?? key;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const format = value => new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : lang).format(Number(value) || 0);
  const cost = value => {
    if (typeof value === 'number') return format(value);
    const short = /^(\d+(?:\.\d+)?)([KMB])$/.exec(String(value));
    if (!short) return String(value);
    const factor = {K:1e3,M:1e6,B:1e9}[short[2]];
    return new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : lang,{notation:'compact',maximumFractionDigits:1}).format(Number(short[1])*factor);
  };
  const resourceKeys = ['dust','ttg','bread','wood','stone','iron','gold'];
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
  const resourceName = k => tr(k === 'ttg' ? 'truegold' : k);
  const current = item => Math.max(0,Math.min(item.maxLevel,Number(progress[item.id]) || 0));
  const target = item => Math.max(current(item),Math.min(item.maxLevel,Number.isFinite(Number(targets[item.id])) ? Number(targets[item.id]) : item.maxLevel));
  const saveProgress = (item,level) => {progress[item.id]=Math.max(0,Math.min(item.maxLevel,Number(level)||0));localStorage.setItem('saifWarAcademyProgress',JSON.stringify(progress));if(Number(targets[item.id])<current(item)){targets[item.id]=current(item);localStorage.setItem('saifWarAcademyTargets',JSON.stringify(targets))}render()};
  const saveTarget = (item,level) => {targets[item.id]=Math.max(current(item),Math.min(item.maxLevel,Number(level)||0));localStorage.setItem('saifWarAcademyTargets',JSON.stringify(targets));render()};
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
  const setLanguage = next => {
    lang = next;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = `${tr('title')} | SaifKS`;
    $('language').value = lang;
    document.querySelectorAll('[data-t]').forEach(el => {
      const value = tr(el.dataset.t);
      if (el.id === 'pageTitle') {const split=value.lastIndexOf(' ');el.innerHTML=split>0?`${esc(value.slice(0,split))} <em>${esc(value.slice(split+1))}</em>`:`<em>${esc(value)}</em>`;}
      else if (el.classList.contains('primaryLink')) el.innerHTML = `${esc(tr('explore').replace(/\s*↗/g,''))} <span aria-hidden="true">↗</span>`;
      else el.textContent = value;
    });
    $('search').placeholder = tr('search'); $('search').setAttribute('aria-label',tr('search'));
    $('closeDetail').setAttribute('aria-label',tr('close'));
    $('homeLink').href = '../index.html?lang=' + lang;
    $('researchLink').href = '../research/index.html?lang=' + lang;
    localStorage.setItem('saifksLanguage',lang);
    const url = new URL(location.href); url.searchParams.set('lang',lang); history.replaceState(null,'',url);
    render();
    if ($('detail').open) $('detail').close();
  };
  const renderFilters = () => {
    const groups = tree === 'basic' ? (viewMode === 'map' ? ['infantry','cavalry','archer'] : ['all','infantry','cavalry','archer']) : ['all','special','economy','capacity','combat'];
    $('filters').innerHTML = groups.map(x => `<button type="button" data-filter="${x}" class="${filter===x?'isActive':''}" aria-pressed="${filter===x}">${esc(tr(x))}</button>`).join('');
    $('dataHint').textContent = tr(tree === 'basic' ? (viewMode === 'map' ? 'mapHint' : 'basicHint') : 'advancedHint');
    document.querySelectorAll('[data-tree]').forEach(el => {const active = el.dataset.tree === tree;el.classList.toggle('isActive',active);el.setAttribute('aria-pressed',String(active));});
    $('viewSwitch').hidden = tree !== 'basic';
    document.querySelectorAll('[data-view]').forEach(el => {const active = el.dataset.view===viewMode;el.classList.toggle('isActive',active);el.setAttribute('aria-pressed',String(active));});
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
      return `<button type="button" class="mapNode ${complete?'isComplete':''} ${i===6?'isUnlock':''}" data-item="${esc(item.id)}" style="--x:${x}%;--y:${y}px" aria-label="${esc(names(item,'basic'))}: ${esc(tr('myLevel'))} ${format(level)}, ${esc(tr('toLevel'))} ${format(target(item))}"><span class="mapIcon">${icon}<span class="nodeProgress dir-ltr">${format(level)} / ${format(target(item))}</span></span><span class="nodeName">${esc(names(item,'basic'))}</span></button>`;
    }).join('');
    $('map').innerHTML=`<div class="mapTop"><div class="mapTitle"><span class="mapEmblem" aria-hidden="true">${symbols[filter]}</span><span><small>${esc(tr('pathLabel'))} / ${esc(tr(filter))}</small><strong>${esc(tr(filter))}</strong></span></div><div class="mapProgress"><strong class="dir-ltr">${format(done)} / ${format(items.length)}</strong><small>${esc(tr('completedCount'))}</small></div></div><div class="mapCanvas" data-branch="${filter}"><svg class="mapConnections" viewBox="0 0 600 980" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>${nodes}</div><div class="mapFoot"><span class="pulse"></span>${esc(tr('currentTargetLegend'))} · ${esc(tr('savedLocally'))}</div>`;
  };
  const renderSummary = () => {
    if(!data)return;
    const basic=tree==='basic';
    const items=data[tree].filter(item=>summaryScope==='all'||filter==='all'||(basic?item.category:item.group)===filter);
    const total={bread:0,wood:0,stone:0,iron:0,gold:0,dust:0,ttg:0,seconds:0};
    let planned=0;
    for(const item of items){
      if(basic){
        const from=current(item),to=target(item);
        if(to>from)planned++;
        for(const level of item.levels)if(level.level>from&&level.level<=to){
          for(const key of ['bread','wood','stone','iron','gold','dust'])total[key]+=level[key]||0;
          total.seconds+=level.seconds||0;
        }
      }else{
        planned++;
        for(const key of resourceKeys)total[key]+=parseAmount(item.total[key]);
        total.seconds+=item.total.timeApproxSeconds||0;
      }
    }
    const context=summaryScope==='all'?tr(basic?'allBasic':'allAdvanced'):(filter==='all'?tr(basic?'allBasic':'allAdvanced'):tr('currentGroup').replace('{group}',tr(filter)));
    $('summaryContext').textContent=`${context} · ${format(planned)} ${tr('selectedResearch')}`;
    document.querySelectorAll('[data-scope]').forEach(el=>{const active=el.dataset.scope===summaryScope;el.classList.toggle('isActive',active);el.setAttribute('aria-pressed',String(active))});
    const keys=basic?['dust','bread','wood','stone','iron','gold']:['ttg','dust','bread','wood','stone','iron','gold'];
    $('summaryResources').innerHTML=keys.map(key=>`<div class="plannerStat"><span>${esc(resourceName(key))}</span><strong class="dir-ltr">${esc(format(total[key]))}</strong></div>`).join('');
    const speed=Math.max(0,Math.min(1000,Number($('researchSpeed').value)||0));
    const needed=total.seconds/(1+speed/100);
    $('summaryTimes').innerHTML=`<div><span>${esc(tr('baseTime'))}</span><strong>${esc(duration(total.seconds))}</strong></div><div class="speedupStat"><span>${esc(tr('speedupsNeeded'))}</span><strong>${esc(duration(needed))}</strong></div>`;
    $('summaryNote').textContent=tr(basic?'basicSummaryNote':'advancedSummaryNote')+' '+tr('estimateNote');
  };
  const render = () => {
    if (!data) return;
    renderFilters();
    const q = $('search').value.trim().toLocaleLowerCase();
    const items = data[tree].filter(item => (filter === 'all' || (tree === 'basic' ? item.category : item.group) === filter) && (!q || [names(item,tree),effect(item),item.name,item.effect].some(x => x.toLocaleLowerCase().includes(q))));
    $('resultCount').textContent = `${format(items.length)} ${tr('results')}`;
    renderSummary();
    const mapVisible=tree==='basic'&&viewMode==='map'&&!q;
    $('map').hidden=!mapVisible;$('results').hidden=mapVisible;
    if(mapVisible){renderMap();$('showMore').hidden=true;return;}
    const visible = items.slice(0,page*24);
    $('results').innerHTML = visible.length ? visible.map(item => {
      const group = tree==='basic' ? item.category : item.group;
      const amount = item.total.dust;
      const marker = amount && amount !== '—' ? esc(cost(amount)) : '—';
      return `<button type="button" class="researchItem" data-item="${esc(item.id)}"><span class="itemSymbol" aria-hidden="true">${symbols[group]}</span><span class="itemText"><strong>${esc(names(item,tree))}</strong><small>${esc(effect(item))}</small></span><span class="itemAside"><strong class="dir-ltr">${marker}</strong><small>${esc(tr('dust'))}</small></span><span class="itemArrow" aria-hidden="true">↗</span></button>`;
    }).join('') : `<div class="empty">${esc(tr('noResults'))}</div>`;
    $('showMore').hidden = visible.length >= items.length;
  };
  const summaries = (total, advanced) => {
    const keys = advanced ? resourceKeys : ['dust','bread','wood','stone','iron','gold'];
    return `<div class="summaryGrid">${keys.filter(k => total[k] !== undefined && total[k] !== null && total[k] !== '—').map(k=>`<div><small>${esc(resourceName(k))}</small><strong class="dir-ltr">${esc(cost(total[k]))}</strong></div>`).join('')}</div>`;
  };
  const showDetail = item => {
    $('detailTitle').textContent = names(item,tree);
    $('detailType').textContent = `${tr(tree)} / ${tr(tree==='basic' ? item.category : item.group)} · ${format(item.maxLevel)} ${tr('levels')}`;
    $('detailEffect').textContent = effect(item);
    if (tree === 'advanced') {
      $('detailBody').innerHTML = `<p class="detailNote">${esc(tr('advancedNote'))}</p><h3 class="subHeading">${esc(tr('totalCost'))}</h3>${summaries(item.total,true)}<p class="detailFooter">${esc(tr('approx'))}</p>`;
    } else {
      const selects = `<div class="levelControls"><label>${esc(tr('myLevel'))}<select id="fromLevel">${Array.from({length:item.maxLevel+1},(_,i)=>`<option value="${i}" ${i===current(item)?'selected':''}>${format(i)}</option>`).join('')}</select></label><label>${esc(tr('toLevel'))}<select id="toLevel">${Array.from({length:item.maxLevel+1},(_,i)=>`<option value="${i}" ${i<current(item)?'disabled':''} ${i===target(item)?'selected':''}>${format(i)}</option>`).join('')}</select></label></div>`;
      const lines = item.levels.map(level=>`<div class="levelLine"><b>${esc(tr('level'))} ${format(level.level)}</b><span>${['dust','bread','wood','stone','iron','gold'].map(k=>`${esc(resourceName(k))}: <span class="dir-ltr">${format(level[k])}</span>`).join(' · ')} · ${esc(tr('baseTime'))}: <span>${esc(duration(level.seconds))}</span></span></div>`).join('');
      $('detailBody').innerHTML = `<p class="detailNote">${esc(tr('basicNote'))}</p>${selects}<h3 class="subHeading">${esc(tr('selectedCost'))}</h3><div id="selectionSummary"></div><h3 class="subHeading">${esc(tr('perLevel'))}</h3><div class="levelList">${lines}</div>`;
      const update = () => {
        const from = Number($('fromLevel').value), to = Number($('toLevel').value);
        for(const option of $('toLevel').options)option.disabled=Number(option.value)<from;
        if(to<from){$('toLevel').value=String(from);saveTarget(item,from)}
        const a=Number($('fromLevel').value),b=Number($('toLevel').value);
        const total={}; for(const lvl of item.levels.filter(x=>x.level>a&&x.level<=b)) for(const key of [...resourceKeys,'seconds']) total[key]=(total[key]||0)+(lvl[key]||0);
        $('selectionSummary').innerHTML=b===a?`<p class="detailNote">${esc(tr('noPlan'))}</p>`:summaries(total,false)+`<div class="detailTime">${esc(tr('baseTime'))}: <strong>${esc(duration(total.seconds))}</strong></div>`;
      };
      $('fromLevel').addEventListener('change',()=>{saveProgress(item,$('fromLevel').value);update()});$('toLevel').addEventListener('change',()=>{saveTarget(item,$('toLevel').value);update()});update();
    }
    $('detail').showModal();
  };
  document.querySelectorAll('[data-tree]').forEach(el => el.addEventListener('click',()=>{tree=el.dataset.tree;filter=tree==='basic'&&viewMode==='map'?'infantry':'all';page=1;$('search').value='';render();}));
  document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',()=>{viewMode=el.dataset.view;if(viewMode==='map'&&filter==='all')filter='infantry';page=1;$('search').value='';render()}));
  $('filters').addEventListener('click',e=>{const button=e.target.closest('[data-filter]');if(!button)return;filter=button.dataset.filter;page=1;render();});
  $('results').addEventListener('click',e=>{const button=e.target.closest('[data-item]');if(!button)return;const item=data[tree].find(x=>x.id===button.dataset.item);if(item)showDetail(item);});
  $('map').addEventListener('click',e=>{const button=e.target.closest('[data-item]');if(!button)return;const item=data.basic.find(x=>x.id===button.dataset.item);if(item)showDetail(item);});
  $('showMore').addEventListener('click',()=>{page++;render();});
  $('summaryScope').addEventListener('click',e=>{const button=e.target.closest('[data-scope]');if(!button)return;summaryScope=button.dataset.scope;renderSummary()});
  $('researchSpeed').addEventListener('input',()=>{const speed=Math.max(0,Math.min(1000,Number($('researchSpeed').value)||0));if(Number($('researchSpeed').value)>1000||Number($('researchSpeed').value)<0)$('researchSpeed').value=String(speed);localStorage.setItem('saifWarResearchSpeed',String(speed));renderSummary()});
  $('search').addEventListener('input',()=>{page=1;if($('search').value.trim()&&tree==='basic')viewMode='list';render();});
  $('language').addEventListener('change',e=>setLanguage(e.target.value));
  $('closeDetail').addEventListener('click',()=>$('detail').close());
  $('detail').addEventListener('click',e=>{if(e.target===$('detail'))$('detail').close();});
  $('researchSpeed').value=String(Math.max(0,Math.min(1000,Number(localStorage.getItem('saifWarResearchSpeed'))||0)));
  fetch('data.json').then(response=>{if(!response.ok)throw new Error(response.status);return response.json()}).then(json=>{data=json;setLanguage(lang)}).catch(()=>{$('results').innerHTML='<div class="empty">Unable to load research data.</div>'});
})();
