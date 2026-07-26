/* SaifKS Phase 11 — stage scroll-spy, continuation controls and interaction polish */
(()=>{
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const root=()=>$('#v125Tree'), canvas=()=>$('#v125Canvas');
  let io=null,currentTier='',selectedId='';
  const isAR=()=>document.documentElement.lang==='ar';
  const saved=()=>{try{return JSON.parse(localStorage.getItem('saifks-research-current-levels-v12')||'{}')}catch{return{}}};
  const techs=()=>window.DB?.trees?.find(t=>t.id===window.activeTree)?.techs||window.DB?.trees?.[0]?.techs||[];
  const tech=id=>techs().find(t=>String(t.id)===String(id));

  function addStatusDots(){
    $$('.v125-node',canvas()).forEach(n=>{
      if(!$('.p11-status-dot',n)) n.insertAdjacentHTML('afterbegin','<span class="p11-status-dot" aria-hidden="true"></span>');
    });
  }
  function addLegend(){
    const tree=root(); if(!tree||$('.p11-legend',tree))return;
    tree.insertAdjacentHTML('beforeend',`<div class="p11-legend" aria-label="Research status"><span><i class="done"></i>${isAR()?'مكتمل':'Complete'}</span><span><i class="ready"></i>${isAR()?'متاح':'Available'}</span><span><i class="plan"></i>${isAR()?'ضمن الخطة':'Planned'}</span><span><i class="lock"></i>${isAR()?'مقفل':'Locked'}</span></div>`);
  }
  function ensureTools(){
    const tree=root(),nav=$('.v129-tier-nav',tree); if(!tree||!nav)return;
    let tools=$('.p11-tools',tree);
    if(!tools){
      tools=document.createElement('div'); tools.className='p11-tools';
      tools.innerHTML=`<div class="p11-stage-label"><i></i><span id="p11StageText">${isAR()?'المرحلة I':'Stage I'}</span></div><div class="p11-actions"><button class="p11-tool" id="p11Continue">${isAR()?'أول بحث غير مكتمل':'First incomplete'}</button><button class="p11-tool" id="p11ClearPath">${isAR()?'إظهار الكل':'Show all'}</button></div>`;
      nav.after(tools);
    }
  }
  function setCurrentTier(tier){
    if(!tier||tier===currentTier)return; currentTier=tier;
    const tree=root();
    $$('.v129-tier-nav button',tree).forEach(b=>b.classList.toggle('active',b.dataset.jumpTier===tier));
    $$('.v127-stage',tree).forEach(s=>s.classList.toggle('is-current',s.dataset.tier===tier));
    const txt=$('#p11StageText',tree); if(txt)txt.textContent=(isAR()?'المرحلة ':'Stage ')+tier;
    const active=$(`.v129-tier-nav button[data-jump-tier="${tier}"]`,tree); active?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
  }
  function observeStages(){
    io?.disconnect(); const stages=$$('.v127-stage[data-kind="tier-start"]',canvas()); if(!stages.length)return;
    io=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>Math.abs(a.boundingClientRect.top-190)-Math.abs(b.boundingClientRect.top-190));
      if(visible[0])setCurrentTier(visible[0].target.dataset.tier);
    },{root:null,rootMargin:'-175px 0px -60% 0px',threshold:[0,.1,.5]});
    stages.forEach(s=>io.observe(s));
  }
  function firstIncomplete(){
    const levels=saved();
    return $$('.v125-node',canvas()).find(n=>{const t=tech(n.dataset.tech);return t&&Number(levels[t.id]||0)<Number(t.maxLevel||0)});
  }
  function clearPath(){
    selectedId='';
    $('#v129Clear')?.click();
    $$('.v125-node',canvas()).forEach(n=>n.classList.remove('selected','path-parent','path-child','dimmed'));
    $$('.p10-edge',canvas()).forEach(p=>p.classList.remove('is-muted','is-upstream','is-downstream'));
  }
  function enhanceDetail(id){
    const detail=$('#v125Detail'); if(!detail)return;
    selectedId=id;
    if(!$('.p11-close',detail)) detail.insertAdjacentHTML('beforeend',`<button type="button" class="p11-close" aria-label="${isAR()?'إغلاق':'Close'}">×</button>`);
    const copy=$('.v125-detail-copy',detail),t=tech(id); if(!copy||!t)return;
    let meta=$('.p11-meta',copy); if(!meta){meta=document.createElement('small');meta.className='p11-meta';copy.append(meta)}
    const pm=$('#groups')?._v127Parents||new Map(),parents=pm.get(id)||[];let children=0;pm.forEach(arr=>{if((arr||[]).some(p=>String(p.id)===String(id)))children++});
    meta.innerHTML=`<em>${isAR()?'السابق':'Before'} ${parents.length}</em><em>${isAR()?'التالي':'After'} ${children}</em>`;
  }
  function mount(){
    if(!root()||!canvas())return;
    ensureTools();addStatusDots();addLegend();observeStages();
    if(!currentTier)setCurrentTier($('.v127-stage[data-kind="tier-start"]',canvas())?.dataset.tier||'I');
  }
  document.addEventListener('click',e=>{
    const n=e.target.closest?.('.v125-node'); if(n)setTimeout(()=>enhanceDetail(n.dataset.tech),0);
    if(e.target.closest?.('#p11Continue')) firstIncomplete()?.scrollIntoView({behavior:'smooth',block:'center'});
    if(e.target.closest?.('#p11ClearPath')) clearPath();
    if(e.target.closest?.('.p11-close')) clearPath();
  });
  const groups=$('#groups'); if(groups)new MutationObserver(()=>requestAnimationFrame(mount)).observe(groups,{childList:true,subtree:true});
  addEventListener('resize',()=>requestAnimationFrame(observeStages),{passive:true});
  requestAnimationFrame(mount);
})();
