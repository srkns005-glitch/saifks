(()=>{'use strict';
  const D=window.TROOP_DATA,I=window.TROOP_I18N,$=id=>document.getElementById(id),KEY='saifksTroopCenterV1',LANG='saifksLanguage';
  const TYPES=['infantry','cavalry','archer'],RES=['bread','wood','stone','iron'],DAYS=[1,2,3,4,5];
  const defaults=()=>({operations:[],inventory:{bread:'',wood:'',stone:'',iron:''},speed:{days:0,hours:0,minutes:0,usedDays:0,usedHours:0,usedMinutes:0},bonus:0,points:[...D.kvk],speedRate:30,finishDay:4,useDay:1,draft:{type:'infantry',mode:'train',quantity:1000,from:1,to:10}});
  let saved={};try{saved=JSON.parse(localStorage.getItem(KEY))||{};}catch(_){/* Storage is optional. */}
  const state={...defaults(),...saved,inventory:{...defaults().inventory,...saved.inventory},speed:{...defaults().speed,...saved.speed},draft:{...defaults().draft,...saved.draft}};
  if(!Array.isArray(state.operations))state.operations=[];
  if(!Array.isArray(state.points)||state.points.length!==11)state.points=[...D.kvk];
  const params=new URLSearchParams(location.search);
  let lang=params.get('lang');
  if(!I[lang]){try{lang=localStorage.getItem(LANG)||localStorage.getItem('saifRallyLang')||'ar';}catch(_){lang='ar';}}
  if(!I[lang])lang='ar';
  const t=k=>I[lang][k],fmt=n=>new Intl.NumberFormat(lang).format(Math.round(n||0));
  const numeric=(n,max=1e12)=>Math.min(max,Math.max(0,Number(n)||0));
  const parseStock=v=>{const match=String(v??'').trim().replace(/,/g,'').match(/^(\d+(?:\.\d+)?)\s*([kKmMbB])?$/);if(!match)return 0;return numeric(Number(match[1])*({k:1e3,m:1e6,b:1e9}[match[2]?.toLowerCase()]||1));};
  const time=s=>{if(s===null)return t('noTime');const seconds=Math.ceil(Math.max(0,s));const days=Math.floor(seconds/86400),hours=Math.floor(seconds%86400/3600),minutes=Math.floor(seconds%3600/60),secs=seconds%60;return [days&&`${fmt(days)}d`,hours&&`${fmt(hours)}h`,minutes&&`${fmt(minutes)}m`,secs&&`${fmt(secs)}s`].filter(Boolean).join(' ')||'0m';};
  const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nInt=v=>Number.isSafeInteger(Number(v))&&Number(v)>0&&Number(v)<=1e9;
  const label=(op)=>`${t(op.mode)} · ${t(op.type)} · ${op.mode==='promote'?`T${op.from} → `:''}T${op.to} · ${fmt(op.quantity)}`;
  function calc(op){
    const destination=D[op.type][op.to-1],origin=op.mode==='promote'?D[op.type][op.from-1]:[0,0,0,0];
    const resources=RES.map((_,i)=>Math.max(0,destination[i]-origin[i])*op.quantity);
    const base=D.seconds[op.to-1],from=op.mode==='promote'?D.seconds[op.from-1]:0;
    const raw=base===null||from===null?null:Math.max(0,base-from)*op.quantity;
    const seconds=raw===null?null:Math.ceil(raw/(1+numeric(op.bonus,10000)/100));
    const pts=Math.max(0,numeric(state.points[op.to-1],1e8)-(op.mode==='promote'?numeric(state.points[op.from-1],1e8):0))*op.quantity;
    return {resources,seconds,points:pts};
  }
  function totals(){const resources=[0,0,0,0];let seconds=0,unknown=false,points=0;
    for(const op of state.operations){const result=calc(op);result.resources.forEach((n,i)=>resources[i]+=n);if(result.seconds===null)unknown=true;else seconds+=result.seconds;points+=result.points;}
    return {resources,seconds,unknown,points};
  }
  function availableSeconds(prefix=''){const s=state.speed;return (numeric(s[prefix?'usedDays':'days'],99999)*86400+numeric(s[prefix?'usedHours':'hours'],99999)*3600+numeric(s[prefix?'usedMinutes':'minutes'],99999)*60);}
  const dayOpt=selected=>DAYS.map(day=>`<option value="${day}" ${day===selected?'selected':''}>${esc(t('day'))} ${fmt(day)}</option>`).join('');
  function applyLang(){document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.title=`${t('title')} | SaifKS`;document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));$('language').value=lang;$('homeLink').href=$('homeButton').href='../index.html?lang='+encodeURIComponent(lang);try{localStorage.setItem(LANG,lang);localStorage.setItem('saifRallyLang',lang);}catch(_){}const u=new URL(location.href);u.searchParams.set('lang',lang);history.replaceState(null,'',u.pathname+u.search+u.hash);render();}
  function renderPicker(){
    $('typePicker').innerHTML=TYPES.map((type,i)=>`<button type="button" data-type="${type}" class="${state.draft.type===type?'active':''}" aria-pressed="${state.draft.type===type}"><span class="type-glyph" aria-hidden="true">${['♜','♞','⌁'][i]}</span><span>${esc(t(type))}</span></button>`).join('');
    $('modePicker').innerHTML=['train','promote'].map(mode=>`<button type="button" data-mode="${mode}" class="${state.draft.mode===mode?'active':''}" aria-pressed="${state.draft.mode===mode}">${esc(t(mode))}</button>`).join('');
    $('fromField').hidden=state.draft.mode==='train';
    $('fromTier').innerHTML=D.tiers.slice(0,10).map(tier=>`<option value="${tier}" ${state.draft.from===tier?'selected':''}>T${tier}</option>`).join('');
    $('toTier').innerHTML=D.tiers.filter(tier=>state.draft.mode==='train'||tier>=state.draft.from).map(tier=>`<option value="${tier}" ${state.draft.to===tier?'selected':''}>T${tier}</option>`).join('');
    $('quantity').value=state.draft.quantity;$('speedBonus').value=state.bonus;
  }
  function renderPreview(){const op={...state.draft,bonus:state.bonus};if(!nInt(op.quantity)){$('preview').textContent=t('invalidQuantity');$('addOperation').disabled=true;return;}
    $('addOperation').disabled=false;const c=calc(op);$('preview').innerHTML=`<span class="preview-label">${esc(t('preview'))}</span><strong>${esc(label(op))}</strong><span class="preview-meta">${esc(t('totalTime'))}: <b dir="ltr">${esc(time(c.seconds))}</b> <span>·</span> ${esc(t('troopPoints'))}: <b>${fmt(c.points)}</b></span>${c.seconds===null?`<small class="notice">${esc(t('uncertainTime'))}</small>`:''}`;
  }
  function renderOperations(){const list=$('operationList');$('operationCount').textContent=fmt(state.operations.length);
    if(!state.operations.length){list.innerHTML=`<div class="empty">${esc(t('emptyPlan'))}</div>`;return;}
    list.innerHTML=state.operations.map((op,i)=>{const c=calc(op);return `<article class="operation"><div class="operation-index">${String(i+1).padStart(2,'0')}</div><div class="operation-main"><strong>${esc(label(op))}</strong><small>${esc(t('totalTime'))}: <b dir="ltr">${esc(time(c.seconds))}</b> · ${esc(t('troopPoints'))}: <b>${fmt(c.points)}</b></small></div><button type="button" data-remove="${i}" aria-label="${esc(t('remove'))} ${esc(label(op))}">${esc(t('remove'))} ×</button></article>`;}).join('');
  }
  function renderInventory(){
    $('resourceInputs').innerHTML=RES.map((res,i)=>`<label class="field resource-field"><span><i class="resource-icon icon-${res}">${['◉','▥','⬡','◆'][i]}</i>${esc(t(res))}</span><input data-resource="${res}" type="text" inputmode="decimal" autocomplete="off" value="${esc(state.inventory[res])}" placeholder="0 / 1.5M"></label>`).join('');
    ['Days','Hours','Minutes'].forEach(k=>{ $(`speed${k}`).value=state.speed[k.toLowerCase()];$(`used${k}`).value=state.speed[`used${k}`]; });
  }
  function renderPoints(){ $('pointInputs').innerHTML=state.points.map((p,i)=>`<label class="field"><span>T${i+1}</span><input data-point="${i}" type="number" min="0" step="1" inputmode="numeric" value="${esc(p)}"></label>`).join('');$('speedPointRate').value=state.speedRate; }
  function renderSummary(){const total=totals(),owned=availableSeconds(),used=availableSeconds('used'),applied=Math.min(owned,used),left=total.unknown?null:Math.max(0,total.seconds-applied);
    $('summaryBody').innerHTML=`<div class="overview"><div class="overview-cell"><span>${esc(t('operation'))}</span><strong>${fmt(state.operations.length)}</strong></div><div class="overview-cell"><span>${esc(t('totalTime'))}</span><strong dir="ltr">${esc(time(total.unknown?null:total.seconds))}</strong></div><div class="overview-cell"><span>${esc(t('speedCovered'))}</span><strong dir="ltr">${esc(time(applied))}</strong></div><div class="overview-cell"><span>${esc(t('timeMissing'))}</span><strong dir="ltr">${esc(time(left))}</strong></div></div>${total.unknown?`<p class="notice">${esc(t('uncertainTime'))}</p>`:''}${state.operations.some(op=>op.to===11)?`<p class="notice">${esc(t('t11Note'))}</p>`:''}<h3 class="minor-title">${esc(t('resourcesTitle'))}</h3><div class="resource-results">${RES.map((res,i)=>{const have=parseStock(state.inventory[res]),need=total.resources[i],short=Math.max(0,need-have);return `<div class="resource-result ${short?'deficit':''}"><div class="result-name">${esc(t(res))}</div><div class="result-value"><span>${esc(t('needed'))}</span><strong>${fmt(need)}</strong></div><div class="result-value"><span>${esc(t('owned'))}</span><strong>${fmt(have)}</strong></div><div class="result-value"><span>${esc(t(short?'short':'enough'))}</span><strong>${short?fmt(short):'✓'}</strong></div></div>`;}).join('')}</div>${used>owned?`<p class="notice">${esc(t('speedUsed'))}: ${esc(time(used))} · ${esc(t('speedOwned'))}: ${esc(time(owned))}</p>`:''}`;
    $('finishDay').innerHTML=dayOpt(state.finishDay);$('useDay').innerHTML=dayOpt(state.useDay);
    const troop=state.finishDay===4?total.points:0;
    const speed=[1,2,5].includes(state.useDay)?Math.floor(applied/60)*numeric(state.speedRate,1e8):0;
    $('kvkResults').innerHTML=`<div class="kvk-result"><span>${esc(t('troopPoints'))}</span><strong>${fmt(troop)}</strong><small>${esc(t('day'))} ${fmt(state.finishDay)} ${state.finishDay===4?'':`· ${esc(t('noPoints'))}`}</small></div><div class="kvk-result"><span>${esc(t('speedPoints'))}</span><strong>${fmt(speed)}</strong><small>${esc(t('day'))} ${fmt(state.useDay)} ${[1,2,5].includes(state.useDay)?'':`· ${esc(t('noPoints'))}`}</small></div><div class="kvk-result highlighted"><span>${esc(t('totalPoints'))}</span><strong>${fmt(troop+speed)}</strong><small>${esc(t('dailyTotal'))}</small></div>`;
  }
  function render(){renderPicker();renderPreview();renderOperations();renderInventory();renderPoints();renderSummary();}
  function feedback(k){$('feedback').textContent=t(k);setTimeout(()=>{if($('feedback').textContent===t(k))$('feedback').textContent='';},3500);}
  function summaryText(){const total=totals(),owned=availableSeconds(),applied=Math.min(owned,availableSeconds('used'));
    const troop=state.finishDay===4?total.points:0,speed=[1,2,5].includes(state.useDay)?Math.floor(applied/60)*numeric(state.speedRate,1e8):0;
    return [t('title'),'',t('plan')+` (${state.operations.length})`,...state.operations.map(op=>`• ${label(op)} · ${t('totalTime')}: ${time(calc(op).seconds)} · ${t('troopPoints')}: ${fmt(calc(op).points)}`),'',t('resourcesTitle'),...RES.map((res,i)=>`${t(res)}: ${t('needed')} ${fmt(total.resources[i])} · ${t('owned')} ${fmt(parseStock(state.inventory[res]))} · ${t('short')} ${fmt(Math.max(0,total.resources[i]-parseStock(state.inventory[res])))}`),'',`${t('totalTime')}: ${time(total.unknown?null:total.seconds)}`,`${t('speedOwned')}: ${time(owned)}`,`${t('speedUsed')}: ${time(applied)}`,`${t('timeMissing')}: ${time(total.unknown?null:Math.max(0,total.seconds-applied))}`,total.unknown?t('uncertainTime'):'','',t('kvkTitle'),`${t('troopPoints')} (${t('day')} ${state.finishDay}): ${fmt(troop)}`,`${t('speedPoints')} (${t('day')} ${state.useDay}): ${fmt(speed)}`,`${t('totalPoints')}: ${fmt(troop+speed)}`,t('kvkNote')].filter(line=>line!==null).join('\n');
  }
  $('language').addEventListener('change',e=>{lang=e.target.value;applyLang();});
  $('typePicker').addEventListener('click',e=>{const b=e.target.closest('[data-type]');if(!b)return;state.draft.type=b.dataset.type;persist();renderPicker();renderPreview();});
  $('modePicker').addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(!b)return;state.draft.mode=b.dataset.mode;if(state.draft.mode==='promote'&&state.draft.to<state.draft.from)state.draft.to=state.draft.from;persist();renderPicker();renderPreview();});
  $('fromTier').addEventListener('change',e=>{state.draft.from=Number(e.target.value);state.draft.to=Math.max(state.draft.from,state.draft.to);persist();renderPicker();renderPreview();});
  $('toTier').addEventListener('change',e=>{state.draft.to=Number(e.target.value);persist();renderPreview();});
  $('quantity').addEventListener('input',e=>{state.draft.quantity=e.target.value;persist();renderPreview();});
  $('speedBonus').addEventListener('input',e=>{state.bonus=numeric(e.target.value,10000);persist();renderPreview();});
  $('addOperation').addEventListener('click',()=>{if(!nInt(state.draft.quantity)){feedback('invalidQuantity');return;}state.operations.push({...state.draft,quantity:Number(state.draft.quantity),bonus:state.bonus});persist();renderOperations();renderSummary();feedback('saved');});
  $('operationList').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(!b)return;state.operations.splice(Number(b.dataset.remove),1);persist();renderOperations();renderSummary();});
  $('resourceInputs').addEventListener('input',e=>{const key=e.target.dataset.resource;if(!RES.includes(key))return;state.inventory[key]=e.target.value;persist();renderSummary();});
  ['speedDays','speedHours','speedMinutes','usedDays','usedHours','usedMinutes'].forEach(id=>$(id).addEventListener('input',e=>{const key=id.startsWith('used')?id:id.replace('speed','').toLowerCase();state.speed[key]=numeric(e.target.value,99999);persist();renderSummary();}));
  $('finishDay').addEventListener('change',e=>{state.finishDay=Number(e.target.value);persist();renderSummary();});
  $('useDay').addEventListener('change',e=>{state.useDay=Number(e.target.value);persist();renderSummary();});
  $('pointInputs').addEventListener('input',e=>{const i=Number(e.target.dataset.point);if(!Number.isInteger(i)||i<0||i>=11)return;state.points[i]=numeric(e.target.value,1e8);persist();renderPreview();renderOperations();renderSummary();});
  $('speedPointRate').addEventListener('input',e=>{state.speedRate=numeric(e.target.value,1e8);persist();renderSummary();});
  $('restorePoints').addEventListener('click',()=>{state.points=[...D.kvk];state.speedRate=30;persist();renderPoints();renderPreview();renderOperations();renderSummary();});
  $('copySummary').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summaryText());feedback('copied');}catch(_){feedback('copyFailed');}});
  $('clearPlan').addEventListener('click',()=>{state.operations=[];persist();renderOperations();renderSummary();feedback('planClear');});
  $('resetAll').addEventListener('click',()=>{if(!confirm(t('resetConfirm')))return;Object.assign(state,defaults());persist();render();feedback('allClear');});
  window.addEventListener('storage',e=>{if(e.key===KEY){let fresh;try{fresh=JSON.parse(e.newValue);}catch(_){return;}if(fresh&&Array.isArray(fresh.operations)){Object.assign(state,defaults(),fresh);render();}}});
  applyLang();
})();
