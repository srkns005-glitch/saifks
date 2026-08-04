import {state,patchState} from './state.js';
import {STORAGE_KEYS,loadValue,saveValue} from './storage.js';
import {loadLanguage,applyDocumentDirection} from './i18n.js';
import {loadDatabase,findMaster} from './data.js';
import {renderMasterList,renderMasterHero,renderTranslations} from './render.js';

const supported=['en','ar','fr','es','de','tr','ko','ja','zh'];

async function setLanguage(code){
  const safe=supported.includes(code)?code:'en';
  const dictionary=await loadLanguage(safe);
  patchState({language:safe});
  applyDocumentDirection(safe);
  renderTranslations(dictionary);
  document.querySelector('#languageSelect').value=safe;
  saveValue(STORAGE_KEYS.language,safe);
}

function setMaster(db,id){
  const master=findMaster(db,id);
  patchState({masterId:master.id});
  renderMasterHero(master);
  renderMasterList(document.querySelector('#masterList'),db.masters,master.id);
  saveValue(STORAGE_KEYS.master,master.id);
}

async function start(){
  const db=await loadDatabase();
  const language=loadValue(STORAGE_KEYS.language,'en');
  const masterId=loadValue(STORAGE_KEYS.master,db.defaultMaster);

  await setLanguage(language);
  setMaster(db,masterId);

  document.querySelector('#languageSelect').addEventListener('change',event=>{
    setLanguage(event.target.value);
  });

  document.querySelector('#masterList').addEventListener('click',event=>{
    const button=event.target.closest('[data-master-id]');
    if(button) setMaster(db,button.dataset.masterId);
  });

  document.documentElement.dataset.ready='true';
}

start().catch(error=>{
  console.error(error);
  document.querySelector('#appStatus').textContent='Application failed to load.';
});
