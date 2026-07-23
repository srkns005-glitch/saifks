let HEROES=[];
let lang='ar';
const $=id=>document.getElementById(id);
const AR={
 title:'مقارنة الأبطال',sub:'مقارنة مباشرة مبنية على الإحصائيات ونصوص المهارات الأصلية فقط.',heroA:'البطل الأول',heroB:'البطل الثاني',mode:'نوع التحليل',arena:'الساحة',expedition:'الاستكشاف',compare:'قارن الآن',reset:'إعادة الضبط',loading:'جاري تحميل بيانات الأبطال…',loadError:'تعذر تحميل قاعدة البيانات. تأكد من رفع المجلد كاملاً.',generation:'الجيل',class:'نوع القوات',rarity:'الندرة',attack:'هجوم البطل',defense:'دفاع البطل',health:'صحة البطل',winner:'الأعلى رقمياً',equal:'متساويان',stats:'مقارنة الإحصائيات',interactions:'التفاعلات المؤكدة بين المهارات',noInteractions:'لا يوجد تفاعل مباشر واضح يمكن تأكيده من نصوص المهارات.',skillsA:'مهارات البطل الأول',skillsB:'مهارات البطل الثاني',important:'مهم',notice:'هذه الصفحة لا تعرض نسبة فوز ولا تدّعي أن بطلاً هو المضاد الأفضل. النتيجة الفعلية تتأثر بمستوى البطل والمهارات والسلاح والعتاد ونسبة القوات والبحوث وباقي أبطال التشكيلة.',raw:'النص الرسمي للمهارات',why:'سبب التفاعل',applies:'ينطبق في',conquest:'الساحة',expeditionLabel:'الاستكشاف',gear:'السلاح الشخصي',infantry:'مشاة',cavalry:'فرسان',archer:'رماة',mythic:'أسطوري',epic:'ملحمي',rare:'نادر',heroOverview:'بيانات البطل',language:'English',result:'نتيجة المقارنة',higherNote:'الأعلى هنا يعني الرقم الأساسي فقط، وليس الأفضل في المعركة.',sameHero:'اختر بطلين مختلفين للمقارنة.',mechanics:'ملخص التأثيرات المكتشفة',noMechanics:'لم يتم اكتشاف تأثير واضح آلياً.',sourceNote:'تم استخراج هذه النتائج مباشرة من قاعدة بيانات Hero Center الموجودة في مشروعك.'
};
const EN={
 title:'Hero Comparison',sub:'Direct comparison based only on stored stats and original skill text.',heroA:'First Hero',heroB:'Second Hero',mode:'Analysis Mode',arena:'Arena',expedition:'Expedition',compare:'Compare Now',reset:'Reset',loading:'Loading hero data…',loadError:'Could not load the database. Upload the complete folder.',generation:'Generation',class:'Troop Class',rarity:'Rarity',attack:'Hero Attack',defense:'Hero Defense',health:'Hero Health',winner:'Numerically higher',equal:'Equal',stats:'Stat Comparison',interactions:'Confirmed Skill Interactions',noInteractions:'No direct interaction can be confirmed from the stored skill text.',skillsA:'First Hero Skills',skillsB:'Second Hero Skills',important:'Important',notice:'This page does not show a win rate or claim that one hero is the best counter. Real outcomes depend on hero level, skill level, exclusive gear, equipment, troop ratio, research and the rest of the formation.',raw:'Original skill text',why:'Why this interaction matters',applies:'Applies in',conquest:'Arena',expeditionLabel:'Expedition',gear:'Exclusive Gear',infantry:'Infantry',cavalry:'Cavalry',archer:'Archer',mythic:'Mythic',epic:'Epic',rare:'Rare',heroOverview:'Hero Data',language:'العربية',result:'Comparison Result',higherNote:'Higher means the base number only, not automatically better in battle.',sameHero:'Choose two different heroes.',mechanics:'Detected Effects Summary',noMechanics:'No clear effect was detected automatically.',sourceNote:'These results are extracted directly from the Hero Center database in your project.'
};
const t=k=>(lang==='ar'?AR:EN)[k]||k;
const num=v=>Number(String(v||0).replace(/[^0-9.]/g,''))||0;
const className=v=>({Infantry:t('infantry'),Cavalry:t('cavalry'),Archer:t('archer')})[v]||v;
const rarityName=v=>({Mythic:t('mythic'),Epic:t('epic'),Rare:t('rare')})[v]||v;
function fullText(h,mode){return (mode==='arena'?h.conquest:h.expedition).concat(h.gear||[]).join(' ')}
function detectEffects(h,mode){
 const x=fullText(h,mode).toLowerCase(); const out=[];
 const add=(key,label)=>{if(x.includes(key)&&!out.includes(label))out.push(label)};
 add('reduces enemy healing',lang==='ar'?'تقليل علاج العدو':'Enemy healing reduction');
 add('healing effects',lang==='ar'?'تقليل تأثير العلاج':'Healing effect reduction');
 add('immune to debuff',lang==='ar'?'مناعة ضد التأثيرات السلبية':'Debuff immunity');
 add('immune to control',lang==='ar'?'مناعة ضد التحكم':'Control immunity');
 add('clears all debuff',lang==='ar'?'إزالة التأثيرات السلبية':'Debuff cleanse');
 add('silence',lang==='ar'?'منع استخدام المهارات':'Skill silence');
 add('prevents the target from using skills',lang==='ar'?'منع استخدام المهارات':'Skill prevention');
 add('stun',lang==='ar'?'صعق':'Stun');
 add('immobiliz',lang==='ar'?'تثبيت':'Immobilize');
 add('damage taken by',lang==='ar'?'تقليل الضرر المستلم':'Damage taken reduction');
 add('damage taken down',lang==='ar'?'تقليل الضرر المستلم':'Damage taken reduction');
 add('enemy damage taken',lang==='ar'?'زيادة الضرر المستلم على العدو':'Enemy damage taken increase');
 add('enemy damage down',lang==='ar'?'خفض ضرر العدو':'Enemy damage reduction');
 add('enemy attack',lang==='ar'?'خفض هجوم العدو':'Enemy attack reduction');
 add('enemy lethality',lang==='ar'?'خفض فتك العدو':'Enemy lethality reduction');
 add('increases total squads’ attack',lang==='ar'?'زيادة هجوم جميع القوات':'All-squad attack buff');
 add('total squads’ attack',lang==='ar'?'زيادة هجوم جميع القوات':'All-squad attack buff');
 add('squads’ lethality',lang==='ar'?'زيادة فتك القوات':'Squad lethality buff');
 add('squad’s health',lang==='ar'?'زيادة صحة القوات':'Squad health buff');
 add('all squads a',lang==='ar'?'تأثير على جميع القوات':'All-squad effect');
 add('chance of dodging',lang==='ar'?'تفادي الهجمات':'Dodge');
 add('restores',lang==='ar'?'استعادة الصحة':'Healing');
 add('heal',lang==='ar'?'علاج':'Healing');
 add('shield',lang==='ar'?'درع':'Shield');
 return out;
}
function rawHas(h,mode,terms){const x=fullText(h,mode).toLowerCase(); return terms.some(z=>x.includes(z));}
function interactions(a,b,mode){
 const rows=[]; const add=(actor,target,titleAr,titleEn,whyAr,whyEn)=>rows.push({actor,target,title:lang==='ar'?titleAr:titleEn,why:lang==='ar'?whyAr:whyEn});
 const healA=rawHas(a,mode,['restores','heal','healing']); const healB=rawHas(b,mode,['restores','heal','healing']);
 const antiA=rawHas(a,mode,['reduces enemy healing','healing effects by']); const antiB=rawHas(b,mode,['reduces enemy healing','healing effects by']);
 if(antiA&&healB)add(a,b,'تقليل العلاج ضد العلاج','Anti-heal vs healing','يقلل تأثير مهارات العلاج التي يعتمد عليها الخصم.','Reduces the effectiveness of the opponent’s healing skills.');
 if(antiB&&healA)add(b,a,'تقليل العلاج ضد العلاج','Anti-heal vs healing','يقلل تأثير مهارات العلاج التي يعتمد عليها الخصم.','Reduces the effectiveness of the opponent’s healing skills.');
 const ctrlA=rawHas(a,mode,['stun','immobiliz','silence','control effects']); const ctrlB=rawHas(b,mode,['stun','immobiliz','silence','control effects']);
 const immuneA=rawHas(a,mode,['immune to control','immune to debuff','clears all debuff']); const immuneB=rawHas(b,mode,['immune to control','immune to debuff','clears all debuff']);
 if(immuneA&&ctrlB)add(a,b,'مقاومة التحكم','Control resistance','يمتلك إزالة أو مناعة قد تبطل جزءاً من تحكم الخصم.','Has cleanse or immunity that may negate part of the opponent’s control.');
 if(immuneB&&ctrlA)add(b,a,'مقاومة التحكم','Control resistance','يمتلك إزالة أو مناعة قد تبطل جزءاً من تحكم الخصم.','Has cleanse or immunity that may negate part of the opponent’s control.');
 const silenceA=rawHas(a,mode,['silence','prevents the target from using skills']); const silenceB=rawHas(b,mode,['silence','prevents the target from using skills']);
 if(silenceA)add(a,b,'تعطيل المهارات','Skill disruption','يستطيع منع الخصم من استخدام المهارات لفترة محددة حسب نص المهارة.','Can stop the opponent from using skills for the stated duration.');
 if(silenceB)add(b,a,'تعطيل المهارات','Skill disruption','يستطيع منع الخصم من استخدام المهارات لفترة محددة حسب نص المهارة.','Can stop the opponent from using skills for the stated duration.');
 const dmgA=rawHas(a,mode,['damage up','damage dealt by','dealing attack']); const dmgB=rawHas(b,mode,['damage up','damage dealt by','dealing attack']);
 const redA=rawHas(a,mode,['reduces damage taken','damage taken down','damage dealt by 20% for all enemy']); const redB=rawHas(b,mode,['reduces damage taken','damage taken down','damage dealt by 20% for all enemy']);
 if(redA&&dmgB)add(a,b,'تقليل الضرر ضد مصدر ضرر','Damage reduction vs damage dealer','يمتلك تقليل ضرر قد يخفف من مهارات الضرر لدى الخصم.','Has damage reduction that may mitigate the opponent’s damage skills.');
 if(redB&&dmgA)add(b,a,'تقليل الضرر ضد مصدر ضرر','Damage reduction vs damage dealer','يمتلك تقليل ضرر قد يخفف من مهارات الضرر لدى الخصم.','Has damage reduction that may mitigate the opponent’s damage skills.');
 return rows;
}
function optionText(h){return `${lang==='ar'?'ج':'G'}${h.generation} · ${h.name} · ${className(h.class)}`}
function fill(){
 const a=$('hero').value,b=$('compareHero').value;
 for(const id of ['hero','compareHero']){$(id).innerHTML=''; HEROES.slice().sort((x,y)=>x.generation-y.generation||x.name.localeCompare(y.name)).forEach(h=>{const o=document.createElement('option');o.value=h.id;o.textContent=optionText(h);$(id).appendChild(o)})}
 if(a)$('hero').value=a; if(b)$('compareHero').value=b; else if(HEROES[1])$('compareHero').value=HEROES[1].id;
}
function heroCard(h){return `<div class="verifyHero"><img src="${h.image}" alt="${h.name}"><div><h3>${h.name}</h3><p>${t('generation')} ${h.generation} · ${className(h.class)} · ${rarityName(h.rarity)}</p></div></div>`}
function statRow(label,av,bv,a,b){const top=av===bv?t('equal'):(av>bv?a.name:b.name);const max=Math.max(av,bv,1);return `<div class="verifiedStat"><div class="vLabel"><b>${label}</b><small>${t('winner')}: ${top}</small></div><div><span>${a.name}: ${av.toLocaleString()}</span><i><em style="width:${av/max*100}%"></em></i></div><div><span>${b.name}: ${bv.toLocaleString()}</span><i><em style="width:${bv/max*100}%"></em></i></div></div>`}
function skillsBlock(h,mode){const arr=mode==='arena'?h.conquest:h.expedition;return `<div class="skillVerified"><h3>${h.name}</h3>${arr.map(x=>`<p>${x}</p>`).join('')}<h4>${t('gear')}</h4>${(h.gear||[]).map(x=>`<p>${x}</p>`).join('')}</div>`}
function render(){
 const a=HEROES.find(x=>x.id===$('hero').value),b=HEROES.find(x=>x.id===$('compareHero').value),mode=$('mode').value;if(!a||!b)return;
 if(a.id===b.id){$('loading').hidden=false;$('loading').textContent=t('sameHero');$('results').hidden=true;return}
 $('loading').hidden=true;$('results').hidden=false;
 $('summaryText').textContent=t('sourceNote');
 $('heroOverview').innerHTML=heroCard(a)+heroCard(b);
 const sa=a.stats||{},sb=b.stats||{};
 $('statsVerified').innerHTML=statRow(t('attack'),num(sa.Attack),num(sb.Attack),a,b)+statRow(t('defense'),num(sa.Defense),num(sb.Defense),a,b)+statRow(t('health'),num(sa.Health),num(sb.Health),a,b)+`<p class="higherNote">${t('higherNote')}</p>`;
 const inter=interactions(a,b,mode);
 $('interactionsVerified').innerHTML=inter.length?inter.map(x=>`<div class="interactionCard"><b>${x.title}</b><p><strong>${x.actor.name}</strong> → ${x.target.name}</p><small>${x.why}</small></div>`).join(''):`<p class="emptyVerified">${t('noInteractions')}</p>`;
 const ea=detectEffects(a,mode),eb=detectEffects(b,mode);
 $('mechanicsVerified').innerHTML=`<div><h3>${a.name}</h3><p>${ea.join('، ')||t('noMechanics')}</p></div><div><h3>${b.name}</h3><p>${eb.join('، ')||t('noMechanics')}</p></div>`;
 $('skillsVerified').innerHTML=skillsBlock(a,mode)+skillsBlock(b,mode);
 window.scrollTo({top:$('results').offsetTop-10,behavior:'smooth'});
}
function Htext(){document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.querySelectorAll('[data-v]').forEach(el=>el.textContent=t(el.dataset.v));$('lang').textContent=t('language');fill();}
fetch('heroes.json').then(r=>r.json()).then(h=>{HEROES=h;fill();$('loading').textContent='';$('loading').hidden=true;Htext();}).catch(()=>{$('loading').textContent=t('loadError')});
$('analyze').onclick=render;$('reset').onclick=()=>location.reload();$('lang').onclick=()=>{lang=lang==='ar'?'en':'ar';Htext();if(!$('results').hidden)render()};
