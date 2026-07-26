/* SaifKS Phase 13 — current/target controls, validation, and uncluttered mobile panel */
(()=>{
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const CURRENT_KEY='saifks-research-current-levels-v12';
  const TARGET_KEY='saifks-research-target-levels-v13';
  let selectedId='';
  const isAR=()=>document.documentElement.lang==='ar';
  const read=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}};
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const tree=()=>window.DB?.trees?.find(t=>t.id===window.activeTree)||window.DB?.trees?.[0];
  const tech=id=>tree()?.techs?.find(t=>String(t.id)===String(id));
  const parents=()=>$('#groups')?._v127Parents||new Map();
  const planned=id=>(window.plan||[]).find(p=>String(p.id)===String(id));
  const current=id=>{const t=tech(id);return t?Math.max(0,Math.min(+t.maxLevel||0,+read(CURRENT_KEY)[id]||0)):0};
  const target=id=>{const t=tech(id);if(!t)return 0;const c=current(id),saved=read(TARGET_KEY)[id],p=planned(id);const raw=saved??p?.target??c;return Math.max(c,Math.min(+t.maxLevel||0,+raw||0))};
  const saveCurrent=(id,val)=>{const o=read(CURRENT_KEY);o[id]=val;write(CURRENT_KEY,o)};
  const saveTarget=(id,val)=>{const o=read(TARGET_KEY);o[id]=val;write(TARGET_KEY,o)};
  function options(max,selected,min=0){let html='';for(let i=min;i<=max;i++)html+=`<option value="${i}"${i===selected?' selected':''}>${i}</option>`;return html}
  function ensurePanel(){
    const detail=$('#v125Detail'); if(!detail)return;
    detail.querySelector('.p12-editor')?.remove();
    let panel=$('.p13-level-panel',detail);
    if(!panel){
      panel=document.createElement('div');
      panel.className='p13-level-panel';
      panel.innerHTML=`
        <label><span>${isAR()?'الحالي':'Current'}</span><select data-p13-current></select></label>
        <span class="p13-arrow">≤</span>
        <label><span>${isAR()?'المستهدف':'Target'}</span><select data-p13-target></select></label>`;
      const open=$('#v125DetailOpen',detail);
      detail.insertBefore(panel,open);
    }
    return panel;
  }
  function syncPanel(){
    const panel=ensurePanel(),t=tech(selectedId); if(!panel)return;
    panel.hidden=!t; if(!t)return;
    const c=current(t.id),tg=target(t.id),max=+t.maxLevel||0;
    const cs=$('[data-p13-current]',panel),ts=$('[data-p13-target]',panel);
    cs.innerHTML=options(tg,c,0);
    ts.innerHTML=options(max,tg,c);
    const level=$('#v125DetailLevel');
    if(level)level.textContent=`${isAR()?'الحالي':'Current'} ${c}  ≤  ${isAR()?'المستهدف':'Target'} ${tg}`;
  }
  function prereqsDone(id,lvs){return (parents().get(id)||[]).every(p=>{const t=tech(p.id);return t&&(+lvs[p.id]||0)>=(+t.maxLevel||0)})}
  function enforceAllLevels(){
    const currents=read(CURRENT_KEY), targets=read(TARGET_KEY); let changed=false;
    (tree()?.techs||[]).forEach(t=>{
      const id=String(t.id),max=+t.maxLevel||0;
      let c=Math.max(0,Math.min(max,+currents[id]||0));
      const savedTarget=targets[id];
      const planTarget=planned(id)?.target;
      let tg=Math.max(0,Math.min(max,+(savedTarget??planTarget??c)||0));
      // Existing invalid data is repaired by lowering Current, never by raising Target.
      if(c>tg){c=tg;currents[id]=c;changed=true}
      if(savedTarget!=null&&+savedTarget!==tg){targets[id]=tg;changed=true}
    });
    if(changed){write(CURRENT_KEY,currents);write(TARGET_KEY,targets)}
  }
  function refresh(){
    enforceAllLevels();
    const canvas=$('#v125Canvas'); if(!canvas)return;
    const lvs=read(CURRENT_KEY);
    $$('.v125-node',canvas).forEach(n=>{
      const t=tech(n.dataset.tech); if(!t)return;
      const c=Math.min(+t.maxLevel||0,+lvs[t.id]||0),tg=target(t.id),ready=prereqsDone(t.id,lvs);
      n.classList.remove('completed','available','locked','planned','p13-inprogress','p13-targeted');
      if(c>=t.maxLevel)n.classList.add('completed');
      else if(c>0)n.classList.add('available','p13-inprogress');
      else if(ready)n.classList.add('available');
      else n.classList.add('locked');
      if(tg>c)n.classList.add('p13-targeted');
      const badge=$('.v125-level',n); if(badge)badge.textContent=c>=t.maxLevel?'MAX':(tg>c?`${c}→${tg}`:`${c}/${t.maxLevel}`);
      const core=$('.v125-node-core',n); if(core)core.style.setProperty('--p13-progress',`${t.maxLevel?Math.round(c/t.maxLevel*360):0}deg`);
    });
    syncPanel();
  }
  function setCurrent(id,value){
    const t=tech(id);if(!t)return;
    const tg=target(id);
    // Hard rule: Current can never exceed Target.
    const c=Math.max(0,Math.min(tg,+t.maxLevel||0,+value||0));
    saveCurrent(id,c);refresh();
    document.dispatchEvent(new CustomEvent('saifks:research-level-change',{detail:{id,current:c,target:tg}}));
  }
  function setTarget(id,value){
    const t=tech(id);if(!t)return;
    const c=current(id),tg=Math.max(c,Math.min(+t.maxLevel||0,+value||0));
    saveTarget(id,tg);refresh();
    document.dispatchEvent(new CustomEvent('saifks:research-target-change',{detail:{id,current:c,target:tg}}));
  }
  document.addEventListener('click',e=>{
    const node=e.target.closest?.('.v125-node');
    if(node){selectedId=node.dataset.tech;requestAnimationFrame(syncPanel)}
  });
  document.addEventListener('change',e=>{
    if(e.target.matches?.('[data-p13-current]')&&selectedId)setCurrent(selectedId,e.target.value);
    if(e.target.matches?.('[data-p13-target]')&&selectedId)setTarget(selectedId,e.target.value);
  });
  document.addEventListener('saifks:research-level-change',()=>requestAnimationFrame(refresh));
  const groups=$('#groups');if(groups)new MutationObserver(()=>requestAnimationFrame(refresh)).observe(groups,{childList:true,subtree:true});
  requestAnimationFrame(refresh);
})();
