export const STORAGE_KEYS={
  language:'saifksLanguage',
  master:'saifksMastersActiveExpert',
  state:'saifksMastersStateV2'
};
export function loadValue(key,fallback=null){
  try{const value=localStorage.getItem(key);return value===null?fallback:value}catch{return fallback}
}
export function saveValue(key,value){
  try{localStorage.setItem(key,value);return true}catch{return false}
}
