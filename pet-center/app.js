(() => {
  'use strict';
  const KEY = 'saifksPetCenterV1';
  const LANGUAGE_KEY = 'saifksLanguage';
  const TYPES = ['food', 'manual', 'potion', 'medallion', 'commonMark', 'advancedMark'];
  const SYMBOLS = {food:'✦', manual:'▤', potion:'◈', medallion:'✧', commonMark:'◇', advancedMark:'✺'};
  const LANGUAGE_LABELS = {en:'Language',ar:'اللغة',tr:'Dil',ko:'언어',ja:'言語',zh:'语言',es:'Idioma',de:'Sprache',fr:'Langue'};
  const $ = id => document.getElementById(id);
  const safe = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const initialLanguage = new URLSearchParams(location.search).get('lang') || localStorage.getItem(LANGUAGE_KEY) || 'ar';
  let language = Object.prototype.hasOwnProperty.call(PET_I18N, initialLanguage) ? initialLanguage : 'ar';
  let pets = [], activeGeneration = 0, search = '';
  let state = {version:2,pets:{},stock:Object.fromEntries(TYPES.map(type=>[type,'']))};
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && typeof saved === 'object') {
      state.pets = saved.pets && typeof saved.pets === 'object' ? saved.pets : {};
      state.stock = {...state.stock,...(saved.stock || {})};
      // The first version preselected advancement at the exact target level.
      // Clear that old automatic choice once, while retaining levels and inventory.
      if (!Number.isFinite(Number(saved.version)) || Number(saved.version) < 2) {
        for (const progress of Object.values(state.pets)) {
          if (progress && typeof progress === 'object') progress.targetAdvanced=false;
        }
      }
    }
  } catch (_) { /* Corrupt local storage should not block the planner. */ }
  const t = key => PET_I18N[language][key] || PET_I18N.en[key] || key;
  const num = n => new Intl.NumberFormat(language === 'ar' ? 'ar' : language).format(n);
  const name = (pet) => PET_NAMES[language]?.[pets.indexOf(pet)] || pet.name;
  const effect = (pet) => PET_EFFECTS[language]?.[pets.indexOf(pet)] || pet.skill;
  const zero = () => Object.fromEntries(TYPES.map(type=>[type,0]));
  const save = () => { try { localStorage.setItem(KEY,JSON.stringify(state)); } catch (_) {} };
  const clamp = (n,max) => Math.min(max,Math.max(0,Number.isFinite(Number(n)) ? Number(n) : 0));
  function progress(pet) {
    const current = clamp(state.pets[pet.id]?.current ?? 0,pet.maxLevel);
    const target = Math.max(current,clamp(state.pets[pet.id]?.target ?? current,pet.maxLevel));
    const currentAdvanced = current > 0 && current % 10 === 0 && !!state.pets[pet.id]?.currentAdvanced;
    const targetAdvanced = target > 0 && target % 10 === 0 && !!state.pets[pet.id]?.targetAdvanced;
    return {current,target,currentAdvanced,targetAdvanced,commonMark:Math.max(0,Number(state.pets[pet.id]?.commonMark)||0),advancedMark:Math.max(0,Number(state.pets[pet.id]?.advancedMark)||0)};
  }
  function parseStock(value) {
    const raw = String(value ?? '').trim().replace(/[\u0660-\u0669]/g,c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/[\u06f0-\u06f9]/g,c => '۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).replace(/[\s,٬]/g,'').replace(/٫/g,'.');
    const match = raw.match(/^(\d+(?:\.\d+)?)([kKmMbB]?)$/);
    return match ? Math.floor(Number(match[1]) * ({'':1,k:1e3,m:1e6,b:1e9}[match[2].toLowerCase()])) : 0;
  }
  function cost(pet) {
    const p = progress(pet), totals = zero();
    for (let level=p.current+1;level<=p.target;level++) totals.food += Number(pet.food[level] || 0);
    const milestones=[];
    for (const [key,items] of Object.entries(pet.advance)) {
      const step=Number(key);
      if (step < p.current || step > p.target || (step === p.current && p.currentAdvanced)) continue;
      if (step === p.target && !p.targetAdvanced) continue;
      milestones.push(step);
      totals.manual += Number(items[0] || 0);
      totals.potion += Number(items[1] || 0);
      totals.medallion += Number(items[2] || 0);
    }
    totals.commonMark=p.commonMark;
    totals.advancedMark=p.advancedMark;
    return {...totals,milestones,planned:p.target > p.current || milestones.length > 0 || p.commonMark > 0 || p.advancedMark > 0};
  }
  function applyLanguage() {
    document.documentElement.lang=language;
    document.documentElement.dir=language === 'ar' ? 'rtl' : 'ltr';
    document.title=t('title')+' | SaifKS';
    $('language').value=language;
    $('language').setAttribute('aria-label',LANGUAGE_LABELS[language]);
    document.querySelectorAll('[data-t]').forEach(el => el.textContent=t(el.dataset.t));
    document.querySelectorAll('[data-placeholder]').forEach(el => el.placeholder=t(el.dataset.placeholder));
    $('homeLink').href=$('homeButton').href='../index.html?lang='+encodeURIComponent(language);
    localStorage.setItem(LANGUAGE_KEY,language);
    history.replaceState(null,'',location.pathname+'?lang='+encodeURIComponent(language));
  }
  function renderStock() {
    $('stockInputs').innerHTML=TYPES.map(type=>`<div class="stock-field"><span class="stock-symbol" aria-hidden="true">${SYMBOLS[type]}</span><label><span>${safe(t(type))}</span><input data-stock="${type}" type="text" inputmode="decimal" autocomplete="off" aria-label="${safe(t(type))}" value="${safe(state.stock[type] || '')}" placeholder="0"></label></div>`).join('');
  }
  function options(max,selected,minimum) {
    let html='';
    for (let level=minimum;level<=max;level++) html+=`<option value="${level}"${level===selected?' selected':''}>${num(level)}</option>`;
    return html;
  }
  function renderCard(pet) {
    const p=progress(pet), c=cost(pet);
    const checkCurrent=p.current>0 && p.current%10===0;
    const checkTarget=p.target>0 && p.target%10===0 && !(p.target===p.current && p.currentAdvanced);
    const preview=TYPES.filter(type=>c[type]>0).map(type=>`<span class="cost-chip">${safe(t(type))} ${num(c[type])}</span>`).join('');
    const both=[checkCurrent?`<label><input type="checkbox" data-action="currentAdvanced" data-pet="${pet.id}"${p.currentAdvanced?' checked':''}>${safe(t('currentAdvanced'))}</label>`:'',checkTarget?`<label><input type="checkbox" data-action="targetAdvanced" data-pet="${pet.id}"${p.targetAdvanced?' checked':''}>${safe(t('targetAdvanced'))}</label>`:''].join('');
    return `<article class="pet-card ${c.planned?'is-planned':''} ${p.current===pet.maxLevel&&p.currentAdvanced?'is-complete':''}" id="pet-${pet.id}"><div class="card-top"><img class="pet-art" src="assets/${pet.id}.webp" alt="${safe(name(pet))}" loading="lazy"><div class="pet-identity"><small>${safe(t('generation'))} ${num(pet.generation)}</small><h4>${safe(name(pet))}</h4><p>${safe(effect(pet))}</p></div>${p.current===pet.maxLevel&&p.currentAdvanced?`<span class="pet-state">${safe(t('completed'))}</span>`:c.planned?`<span class="pet-state">${safe(t('planned'))}</span>`:''}</div><div class="card-bottom"><div class="level-fields"><label class="level-field"><span>${safe(t('current'))}</span><select data-action="current" data-pet="${pet.id}" aria-label="${safe(name(pet)+' · '+t('current'))}">${options(pet.maxLevel,p.current,0)}</select></label><span class="level-arrow" aria-hidden="true">→</span><label class="level-field"><span>${safe(t('target'))}</span><select data-action="target" data-pet="${pet.id}" aria-label="${safe(name(pet)+' · '+t('target'))}">${options(pet.maxLevel,p.target,p.current)}</select></label></div><div class="milestone-options">${both}</div><details class="refinement" ${p.commonMark||p.advancedMark?'open':''}><summary class="refinement-title">${safe(t('refinementTitle'))}</summary><div class="refinement-fields">${['commonMark','advancedMark'].map(type=>`<label><span>${safe(t(type))}</span><input type="text" inputmode="numeric" data-action="${type}" data-pet="${pet.id}" value="${p[type]||''}" placeholder="0" aria-label="${safe(name(pet)+' · '+t(type))}"></label>`).join('')}</div></details><div class="cost-preview">${preview}</div></div></article>`;
  }
  function renderCatalogue() {
    $('generationTabs').innerHTML=`<button type="button" data-generation="0" class="${activeGeneration===0?'is-active':''}">${safe(t('all'))}</button>`+[1,2,3,4,5,6,7].map(g=>`<button type="button" data-generation="${g}" class="${activeGeneration===g?'is-active':''}">${safe(t('generation'))} ${num(g)}</button>`).join('');
    const match=pets.filter(p=> (!activeGeneration||p.generation===activeGeneration) && (!search|| (name(p)+' '+p.name+' '+effect(p)).toLocaleLowerCase().includes(search)));
    $('catalogueCount').textContent=num(match.length)+' '+t('shown');
    $('petGroups').innerHTML=match.length?[1,2,3,4,5,6,7].map(g=>{
      const group=match.filter(p=>p.generation===g);
      return group.length?`<section class="generation-group" aria-label="${safe(t('generation'))} ${num(g)}"><div class="group-header"><h3>${safe(t('generation'))} ${num(g)}</h3><small>${num(group.length)} ${safe(t('pets'))}</small></div><div class="pet-grid">${group.map(renderCard).join('')}</div></section>`:'';
    }).join(''):`<div class="no-results">${safe(t('noResults'))}</div>`;
  }
  function getPlan() {
    const totals=zero(), selected=[];
    for (const pet of pets) {
      const c=cost(pet);
      if (!c.planned) continue;
      selected.push({pet,c,p:progress(pet)});
      for (const type of TYPES) totals[type]+=c[type];
    }
    return {totals,selected};
  }
  function renderSummary() {
    const {totals,selected}=getPlan();
    $('plannedHeroCount').textContent=num(selected.length);
    $('planContext').textContent=t('plannedPets')+': '+num(selected.length);
    $('emptyPlan').hidden=selected.length>0;
    $('summaryContent').hidden=selected.length===0;
    $('plannedPets').innerHTML=selected.map(({pet,p,c})=>`<div class="planned-pet"><b>${safe(name(pet))}</b><small>${num(p.current)} → ${num(p.target)}${c.milestones.length?' · '+safe(t('advancement'))+' '+c.milestones.map(num).join(', '):''}</small></div>`).join('');
    $('resourceSummary').innerHTML=TYPES.filter(type=>totals[type]>0).map(type=>{
      const available=parseStock(state.stock[type]), remaining=Math.max(0,totals[type]-available);
      return `<div class="resource-row ${remaining?'short':''}"><span class="resource-title">${SYMBOLS[type]} ${safe(t(type))}</span><div class="resource-values"><div><span>${safe(t('required'))}</span><strong>${num(totals[type])}</strong></div><div><span>${safe(t('available'))}</span><strong>${num(available)}</strong></div><div><span>${safe(t('remaining'))}</span><strong>${num(remaining)}</strong></div></div></div>`;
    }).join('');
    $('summaryFoot').textContent=selected.length?t('summaryNote'):'';
  }
  function summaryText() {
    const {totals,selected}=getPlan();
    if (!selected.length) return t('emptyPlan');
    const lines=[t('title')+' | SaifKS',t('plannedPets')+': '+num(selected.length),''];
    for (const {pet,p,c} of selected) {
      lines.push(name(pet)+': '+t('level')+' '+num(p.current)+' → '+num(p.target)+(c.milestones.length?' · '+t('advancement')+' '+c.milestones.map(num).join(', '):''));
      lines.push('  '+TYPES.filter(type=>c[type]>0).map(type=>t(type)+' '+num(c[type])).join(' · '));
    }
    lines.push('',t('resourceBreakdown'));
    for (const type of TYPES.filter(type=>totals[type]>0)) {
      const available=parseStock(state.stock[type]);
      lines.push(t(type)+': '+t('required')+' '+num(totals[type])+' · '+t('available')+' '+num(available)+' · '+t('remaining')+' '+num(Math.max(0,totals[type]-available)));
    }
    return lines.join('\n');
  }
  function flash(message) {
    $('feedback').textContent=message;
    clearTimeout(flash.timer);
    flash.timer=setTimeout(()=>{ $('feedback').textContent=''; },4000);
  }
  function onCardChange(el) {
    const pet=pets.find(p=>p.id===el.dataset.pet);
    if (!pet) return;
    const p=progress(pet);
    if (el.dataset.action==='current') {
      const next=clamp(el.value,pet.maxLevel);
      p.currentAdvanced=next===p.current?p.currentAdvanced:false;
      p.current=next;
      if (p.target<next) { p.target=next;p.targetAdvanced=false; }
      if (p.current===p.target && p.currentAdvanced) p.targetAdvanced=false;
    } else if (el.dataset.action==='target') {
      const next=Math.max(p.current,clamp(el.value,pet.maxLevel));
      if (next!==p.target) p.targetAdvanced=false;
      p.target=next;
    } else if (el.dataset.action==='currentAdvanced') {
      p.currentAdvanced=el.checked;
      if (p.current===p.target&&el.checked) p.targetAdvanced=false;
    } else if (el.dataset.action==='targetAdvanced') p.targetAdvanced=el.checked;
    else if (el.dataset.action==='commonMark'||el.dataset.action==='advancedMark') p[el.dataset.action]=parseStock(el.value);
    state.pets[pet.id]=p;
    save();
    const original=$('pet-'+pet.id);
    original.outerHTML=renderCard(pet);
    renderSummary();
  }
  $('language').addEventListener('change',event=>{ language=event.target.value;applyLanguage();renderStock();renderCatalogue();renderSummary(); });
  $('stockInputs').addEventListener('input',event=>{const type=event.target.dataset.stock;if (!TYPES.includes(type))return;state.stock[type]=event.target.value;save();renderSummary();});
  $('generationTabs').addEventListener('click',event=>{const button=event.target.closest('[data-generation]');if(!button)return;activeGeneration=Number(button.dataset.generation);renderCatalogue();});
  $('search').addEventListener('input',event=>{search=event.target.value.trim().toLocaleLowerCase();renderCatalogue();});
  $('petGroups').addEventListener('change',event=>{if(event.target.dataset.action)onCardChange(event.target);});
  $('petGroups').addEventListener('input',event=>{const type=event.target.dataset.action;if(type!=='commonMark'&&type!=='advancedMark')return;const pet=pets.find(p=>p.id===event.target.dataset.pet);if(!pet)return;state.pets[pet.id]={...progress(pet),[type]:parseStock(event.target.value)};save();renderSummary();});
  $('copySummary').addEventListener('click',async()=>{
    try {
      const value=summaryText();
      if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {const area=document.createElement('textarea');area.value=value;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();if(!document.execCommand('copy'))throw new Error('Copy failed');area.remove();}
      flash(t('copied'));
    } catch (_) {flash(t('copyFailed'));}
  });
  $('clearPlan').addEventListener('click',()=>{for(const pet of pets){const p=progress(pet);state.pets[pet.id]={current:p.current,currentAdvanced:p.currentAdvanced,target:p.current,targetAdvanced:false,commonMark:0,advancedMark:0};}save();renderCatalogue();renderSummary();flash(t('cleared'));});
  $('resetAll').addEventListener('click',()=>{if(!confirm(t('confirmReset')))return;state={version:2,pets:{},stock:Object.fromEntries(TYPES.map(type=>[type,'']))};save();renderStock();renderCatalogue();renderSummary();flash(t('resetDone'));});
  applyLanguage();
  save();
  renderStock();
  fetch('data.json?v=1').then(r=>{if(!r.ok)throw new Error(r.status);return r.json();}).then(data=>{
    if(!Array.isArray(data.pets)||!data.pets.length)throw new Error('Invalid pet data');
    pets=data.pets;
    $('petCount').textContent=num(pets.length);
    renderCatalogue();renderSummary();
  }).catch(()=>{$('petGroups').innerHTML=`<div class="no-results">${safe(t('loadingError'))}</div>`;});
})();