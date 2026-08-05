import fs from 'node:fs/promises';
import { calculateAffinity } from './js-engine-affinity-engine.js';

const ids=['valora','pan','roman','cassia','wilson','guinevere'];
const ranges=[[0,1],[0,100],[20,60],[50,50],[99,100]];
for(const id of ids){
  const master=JSON.parse(await fs.readFile(new URL(`./data-masters-${id}.json`, import.meta.url),'utf8'));
  for(const [current,target] of ranges){
    const result=calculateAffinity(master,current,target);
    if(!result.success) throw new Error(`${id} ${current}-${target}: ${result.errors.join(', ')}`);
  }
}
console.log('Affinity integration tests passed.');
