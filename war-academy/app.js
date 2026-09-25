(() => {
  'use strict';
  const languages = Object.keys(WAR_I18N);
  const requested = new URLSearchParams(location.search).get('lang');
  let lang = languages.includes(requested) ? requested : (languages.includes(localStorage.getItem('saifksLanguage')) ? localStorage.getItem('saifksLanguage') : 'ar');
  let tree = 'basic', filter = 'all', page = 1, data;
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
  const duration = seconds => {
    const days = Math.floor(seconds / 86400), hours = Math.floor(seconds % 86400 / 3600), minutes = Math.ceil(seconds % 3600 / 60);
    return [days && `${format(days)}${tr('day')}`, hours && `${format(hours)}${tr('hour')}`, minutes && `${format(minutes)}${tr('minute')}`].filter(Boolean).join(' ') || `< 1${tr('minute')}`;
  };
  const setLanguage = next => {
    lang = next;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = `${tr('title')} | SaifKS`;
    $('language').value = lang;
    document.querySelectorAll('[data-t]').forEach(el => {
      const value = tr(el.dataset.t);
      if (el.classList.contains('primaryLink')) el.innerHTML = `${esc(tr('explore').replace(/\s*↗/g,''))} <span aria-hidden="true">↗</span>`;
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
    const groups = tree === 'basic' ? ['all','infantry','cavalry','archer'] : ['all','special','economy','capacity','combat'];
    $('filters').innerHTML = groups.map(x => `<button type="button" data-filter="${x}" class="${filter===x?'isActive':''}" aria-pressed="${filter===x}">${esc(tr(x))}</button>`).join('');
    $('dataHint').textContent = tr(tree === 'basic' ? 'basicHint' : 'advancedHint');
    document.querySelectorAll('[data-tree]').forEach(el => {const active = el.dataset.tree === tree;el.classList.toggle('isActive',active);el.setAttribute('aria-pressed',String(active));});
  };
  const render = () => {
    if (!data) return;
    renderFilters();
    const q = $('search').value.trim().toLocaleLowerCase();
    const items = data[tree].filter(item => (filter === 'all' || (tree === 'basic' ? item.category : item.group) === filter) && (!q || [names(item,tree),effect(item),item.name,item.effect].some(x => x.toLocaleLowerCase().includes(q))));
    $('resultCount').textContent = `${format(items.length)} ${tr('results')}`;
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
    const keys = advanced ? resourceKeys : ['dust','bread','wood','stone','iron','gold','seconds'];
    return `<div class="summaryGrid">${keys.filter(k => total[k] !== undefined && total[k] !== null && total[k] !== '—').map(k=>`<div><small>${esc(k==='seconds' ? tr('duration') : resourceName(k))}</small><strong class="dir-ltr">${k==='seconds' ? esc(duration(total[k])) : esc(cost(total[k]))}</strong></div>`).join('')}</div>`;
  };
  const showDetail = item => {
    $('detailTitle').textContent = names(item,tree);
    $('detailType').textContent = `${tr(tree)} / ${tr(tree==='basic' ? item.category : item.group)} · ${format(item.maxLevel)} ${tr('levels')}`;
    $('detailEffect').textContent = effect(item);
    if (tree === 'advanced') {
      $('detailBody').innerHTML = `<p class="detailNote">${esc(tr('advancedNote'))}</p><h3 class="subHeading">${esc(tr('totalCost'))}</h3>${summaries(item.total,true)}<p class="detailFooter">${esc(tr('approx'))}</p>`;
    } else {
      const selects = `<div class="levelControls"><label>${esc(tr('fromLevel'))}<select id="fromLevel">${Array.from({length:item.maxLevel+1},(_,i)=>`<option value="${i}">${format(i)}</option>`).join('')}</select></label><label>${esc(tr('toLevel'))}<select id="toLevel">${Array.from({length:item.maxLevel},(_,i)=>`<option value="${i+1}" ${i+1===item.maxLevel?'selected':''}>${format(i+1)}</option>`).join('')}</select></label></div>`;
      const lines = item.levels.map(level=>`<div class="levelLine"><b>${esc(tr('level'))} ${format(level.level)}</b><span>${['dust','bread','wood','stone','iron','gold'].map(k=>`${esc(resourceName(k))}: <span class="dir-ltr">${format(level[k])}</span>`).join(' · ')} · ${esc(tr('duration'))}: <span class="dir-ltr">${esc(duration(level.seconds))}</span></span></div>`).join('');
      $('detailBody').innerHTML = `<p class="detailNote">${esc(tr('basicNote'))}</p>${selects}<h3 class="subHeading">${esc(tr('selectedCost'))}</h3><div id="selectionSummary"></div><h3 class="subHeading">${esc(tr('perLevel'))}</h3><div class="levelList">${lines}</div>`;
      const update = () => {
        const from = Number($('fromLevel').value), to = Number($('toLevel').value);
        if(to<=from){$('toLevel').value=String(Math.min(item.maxLevel,from+1));if(Number($('toLevel').value)<=from){$('fromLevel').value=String(to-1);}}
        const a=Number($('fromLevel').value),b=Number($('toLevel').value);
        const total={}; for(const lvl of item.levels.filter(x=>x.level>a&&x.level<=b)) for(const key of [...resourceKeys,'seconds']) total[key]=(total[key]||0)+(lvl[key]||0);
        $('selectionSummary').innerHTML=summaries(total,false);
      };
      $('fromLevel').addEventListener('change',update);$('toLevel').addEventListener('change',update);update();
    }
    $('detail').showModal();
  };
  document.querySelectorAll('[data-tree]').forEach(el => el.addEventListener('click',()=>{tree=el.dataset.tree;filter='all';page=1;$('search').value='';render();}));
  $('filters').addEventListener('click',e=>{const button=e.target.closest('[data-filter]');if(!button)return;filter=button.dataset.filter;page=1;render();});
  $('results').addEventListener('click',e=>{const button=e.target.closest('[data-item]');if(!button)return;const item=data[tree].find(x=>x.id===button.dataset.item);if(item)showDetail(item);});
  $('showMore').addEventListener('click',()=>{page++;render();});
  $('search').addEventListener('input',()=>{page=1;render();});
  $('language').addEventListener('change',e=>setLanguage(e.target.value));
  document.querySelectorAll('[data-path]').forEach(el=>el.addEventListener('click',()=>{tree='basic';filter=el.dataset.path;page=1;$('search').value='';render();$('catalogue').scrollIntoView({behavior:'smooth',block:'start'});}));
  $('closeDetail').addEventListener('click',()=>$('detail').close());
  $('detail').addEventListener('click',e=>{if(e.target===$('detail'))$('detail').close();});
  fetch('data.json').then(response=>{if(!response.ok)throw new Error(response.status);return response.json()}).then(json=>{data=json;setLanguage(lang)}).catch(()=>{$('results').innerHTML='<div class="empty">Unable to load research data.</div>'});
})();
