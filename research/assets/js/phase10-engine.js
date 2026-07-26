/* SaifKS Phase 10 — deterministic SVG routing and full-path interaction */
(()=>{
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>window.CSS?.escape?CSS.escape(String(s)):String(s).replace(/["\\]/g,'\\$&');
  let selected=null, raf=0, observer;
  const treeRoot=()=>$('#v125Canvas');
  const parentMap=()=>$('#groups')?._v127Parents||new Map();
  const node=id=>treeRoot()?.querySelector(`[data-tech="${esc(id)}"]`);
  function tech(id){return window.DB?.trees?.flatMap(t=>t.techs||[]).find(t=>String(t.id)===String(id))}
  function childrenMap(){const out=new Map();parentMap().forEach((ps,cid)=>(ps||[]).forEach(p=>{const a=out.get(p.id)||[];a.push(cid);out.set(p.id,a)}));return out}
  function pt(el,root,edge){const a=el.querySelector('.v125-node-core').getBoundingClientRect(),b=root.getBoundingClientRect();return{x:a.left+a.width/2-b.left,y:(edge==='top'?a.top:a.bottom)-b.top}}
  function roundedPath(from,to,root){
    const s=pt(from,root,'bottom'),e=pt(to,root,'top');
    const gap=Math.max(18,e.y-s.y),mid=s.y+gap/2,r=Math.min(12,gap/4,Math.abs(e.x-s.x)/2||12);
    if(Math.abs(e.x-s.x)<2) return `M${s.x.toFixed(1)} ${s.y.toFixed(1)}V${e.y.toFixed(1)}`;
    const dir=e.x>s.x?1:-1;
    return `M${s.x.toFixed(1)} ${s.y.toFixed(1)}V${(mid-r).toFixed(1)}Q${s.x.toFixed(1)} ${mid.toFixed(1)} ${(s.x+dir*r).toFixed(1)} ${mid.toFixed(1)}H${(e.x-dir*r).toFixed(1)}Q${e.x.toFixed(1)} ${mid.toFixed(1)} ${e.x.toFixed(1)} ${(mid+r).toFixed(1)}V${e.y.toFixed(1)}`;
  }
  function draw(){
    const root=treeRoot(),svg=$('#v125Lines'); if(!root||!svg)return;
    const w=root.clientWidth,h=root.scrollHeight,pm=parentMap(); let html='';
    pm.forEach((ps,cid)=>{const c=node(cid);if(!c)return;(ps||[]).forEach(p=>{const par=node(p.id);if(!par)return;const d=roundedPath(par,c,root);html+=`<path class="p10-edge-shadow" d="${d}"/><path class="p10-edge" data-from="${p.id}" data-to="${cid}" d="${d}"/>`})});
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('width',w);svg.setAttribute('height',h);svg.innerHTML=html;
    if(selected) applyPath(selected,false);
  }
  function ancestors(id,set=new Set()){for(const p of parentMap().get(id)||[]){if(!set.has(p.id)){set.add(p.id);ancestors(p.id,set)}}return set}
  function descendants(id,set=new Set(),cm=childrenMap()){for(const c of cm.get(id)||[]){if(!set.has(c)){set.add(c);descendants(c,set,cm)}}return set}
  function clearVisual(){const root=treeRoot();if(!root)return;$$('.v125-node',root).forEach(n=>n.classList.remove('selected','path-parent','path-child','dimmed'));$$('.p10-edge',root).forEach(p=>p.classList.remove('is-muted','is-upstream','is-downstream'))}
  function applyPath(id,scroll=true){
    const root=treeRoot(),focus=node(id);if(!root||!focus)return;selected=id;clearVisual();
    const up=ancestors(id),down=descendants(id),visible=new Set([id,...up,...down]);
    focus.classList.add('selected');up.forEach(x=>node(x)?.classList.add('path-parent'));down.forEach(x=>node(x)?.classList.add('path-child'));
    $$('.v125-node',root).forEach(n=>{if(!visible.has(n.dataset.tech))n.classList.add('dimmed')});
    $$('.p10-edge',root).forEach(p=>{const f=p.dataset.from,t=p.dataset.to;if(up.has(f)&&(up.has(t)||t===id))p.classList.add('is-upstream');else if((f===id||down.has(f))&&down.has(t))p.classList.add('is-downstream');else p.classList.add('is-muted')});
    const detail=$('#v125Detail'),copy=detail?.querySelector('.v125-detail-copy');if(copy){let note=$('.p10-path-note',copy);if(!note){note=document.createElement('small');note.className='p10-path-note';copy.append(note)}const ar=document.documentElement.lang==='ar';note.textContent=ar?`${up.size} متطلب سابق · ${down.size} بحث لاحق`:`${up.size} prerequisite${up.size===1?'':'s'} · ${down.size} unlocked`}
    if(scroll)focus.scrollIntoView({behavior:'smooth',block:'center'});
  }
  function enhanceNodes(){
    const root=treeRoot();if(!root)return;
    $$('.v125-node',root).forEach(n=>{const t=tech(n.dataset.tech);if(!t)return;n.dataset.maxLevel=t.maxLevel||0;n.setAttribute('aria-describedby',`tech-${n.dataset.tech}`);const name=$('.v125-name',n);if(name)name.id=`tech-${n.dataset.tech}`});
  }
  function mount(){
    const root=treeRoot();if(!root)return;enhanceNodes();draw();
    if(!$('.p10-scroll-top')){const b=document.createElement('button');b.className='p10-scroll-top';b.type='button';b.textContent='↑';b.setAttribute('aria-label','Back to top');b.onclick=()=>scrollTo({top:0,behavior:'smooth'});document.body.append(b)}
  }
  function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>requestAnimationFrame(mount))}
  document.addEventListener('click',e=>{const n=e.target.closest?.('.v125-node');if(n)setTimeout(()=>applyPath(n.dataset.tech,false),0);if(e.target.closest?.('#v129Clear')){selected=null;clearVisual()}});
  addEventListener('resize',schedule,{passive:true});addEventListener('orientationchange',schedule,{passive:true});addEventListener('scroll',()=>$('.p10-scroll-top')?.classList.toggle('show',scrollY>650),{passive:true});
  const groups=$('#groups');if(groups){observer=new MutationObserver(schedule);observer.observe(groups,{childList:true,subtree:true})}
  if(document.fonts?.ready)document.fonts.ready.then(schedule);schedule();
})();
