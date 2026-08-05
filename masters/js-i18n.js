const cache=new Map();
export async function loadLanguage(code){
  if(cache.has(code)) return cache.get(code);
  const response=await fetch(`languages-${code}.json`,{cache:'no-store'});
  if(!response.ok) throw new Error(`Language load failed: ${code}`);
  const dictionary=await response.json();
  cache.set(code,dictionary);
  return dictionary;
}
export function translate(dictionary,key){
  return dictionary[key]??key;
}
export function applyDocumentDirection(code){
  document.documentElement.lang=code;
  document.documentElement.dir=code==='ar'?'rtl':'ltr';
}
