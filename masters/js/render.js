export function renderMasterList(container,masters,activeId){
  container.innerHTML=masters.map(master=>`
    <button class="master-button" type="button" data-master-id="${master.id}" aria-selected="${master.id===activeId}">
      ${master.name}
    </button>
  `).join('');
}
export function renderMasterHero(master){
  document.querySelector('[data-master-name]').textContent=master.name;
  const image=document.querySelector('[data-master-image]');
  image.src=master.portrait;
  image.alt=master.name;
}
export function renderTranslations(dictionary){
  document.querySelectorAll('[data-i18n]').forEach(element=>{
    const key=element.dataset.i18n;
    element.textContent=dictionary[key]??key;
  });
}
