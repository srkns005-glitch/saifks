/* SaifKS Phase 15 — current/target/effect directly on every research node */
(()=>{
  'use strict';
  const CURRENT_KEY='saifks-research-current-levels-v12';
  const TARGET_KEY='saifks-research-target-levels-v13';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const read=key=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}};
  const tree=()=>window.DB?.trees?.find(t=>t.id===window.activeTree)||window.DB?.trees?.[0];
  const tech=id=>tree()?.techs?.find(t=>String(t.id)===String(id));
  const isAR=()=>document.documentElement.lang==='ar';
  const cleanEffect=v=>String(v??'').trim()||'—';
  function current(t){return Math.max(0,Math.min(+t.maxLevel||0,+read(CURRENT_KEY)[t.id]||0))}
  function target(t){
    const c=current(t),saved=read(TARGET_KEY)[t.id],plan=(window.plan||[]).find(p=>String(p.id)===String(t.id));
    return Math.max(c,Math.min(+t.maxLevel||0,+(saved??plan?.target??c)||0));
  }
  function effectAt(t,level){
    if(level<=0)return '0%';
    const row=(t.levels||[]).find(x=>+x.level===+level)||(t.levels||[])[Math.max(0,level-1)];
    return cleanEffect(row?.effect||t.effectRange);
  }
  function labels(t){
    const c=current(t),tg=target(t),max=+t.maxLevel||0;
    const bothMax=c>=max&&tg>=max;
    const levelText=bothMax?'MAX':`${c} → ${tg}`;
    const ce=effectAt(t,c),te=effectAt(t,tg);
    const effectText=c===tg?ce:`${ce} → ${te}`;
    return {c,tg,max,bothMax,levelText,effectText};
  }
  function decorateNode(node){
    const t=tech(node.dataset.tech);if(!t)return;
    const s=labels(t);
    node.classList.toggle('p15-targeted',s.tg>s.c);
    let level=$('.p15-levels',node);if(!level){level=document.createElement('span');level.className='p15-levels';const name=$('.v125-name',node);name?.before(level)}
    let effect=$('.p15-effect',node);if(!effect){effect=document.createElement('span');effect.className='p15-effect';const name=$('.v125-name',node);name?.after(effect)}
    level.textContent=s.levelText;
    effect.textContent=s.effectText;
    node.setAttribute('aria-label',`${t.name}, ${isAR()?'الحالي':'current'} ${s.c}, ${isAR()?'المستهدف':'target'} ${s.tg}, ${isAR()?'التأثير':'effect'} ${s.effectText}`);
  }
  function decorateAll(){
    $$('.v125-node').forEach(decorateNode);
    const detail=$('#v125Detail');
    if(detail&&!$('.p15-detail-effect',detail)){
      const line=document.createElement('small');line.className='p15-detail-effect';line.id='p15DetailEffect';
      $('#v125DetailLevel',detail)?.after(line);
    }
  }
  function updateDetail(id){
    const t=tech(id),line=$('#p15DetailEffect');if(!t||!line)return;
    const s=labels(t);
    line.textContent=`${isAR()?'التأثير':'Effect'}: ${s.effectText}`;
  }
  document.addEventListener('click',e=>{
    const node=e.target.closest?.('.v125-node');
    if(node){decorateNode(node);requestAnimationFrame(()=>updateDetail(node.dataset.tech))}
  });
  document.addEventListener('change',e=>{
    if(e.target.matches?.('[data-p13-current],[data-p13-target]'))requestAnimationFrame(()=>{decorateAll();const n=$('.v125-node.selected');if(n)updateDetail(n.dataset.tech)})
  });
  document.addEventListener('saifks:research-level-change',()=>requestAnimationFrame(decorateAll));
  document.addEventListener('saifks:research-target-change',()=>requestAnimationFrame(decorateAll));
  const groups=$('#groups');if(groups)new MutationObserver(()=>requestAnimationFrame(decorateAll)).observe(groups,{childList:true,subtree:true});
  requestAnimationFrame(decorateAll);
})();
