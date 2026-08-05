import {
  validateDatabaseManifest,
  validateMaterialDatabase,
  validateMaster,
  throwIfInvalid
} from './js-validator.js';

let database=null;

async function fetchJson(path){
  const response=await fetch(path,{cache:'no-store'});
  if(!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
  return response.json();
}

export async function loadDatabase(){
  if(database) return database;

  const manifest=await fetchJson('data-database.json');
  const materials=await fetchJson(manifest.materialsFile);
  const masters=await Promise.all(
    manifest.masters
      .filter(entry=>entry.enabled!==false)
      .map(async entry=>{
        const master=await fetchJson(entry.file);
        return [entry.id,master];
      })
  );

  const masterMap=Object.fromEntries(masters);
  const report={
    manifest:validateDatabaseManifest(manifest),
    materials:validateMaterialDatabase(materials),
    masters:Object.fromEntries(
      Object.entries(masterMap).map(([id,master])=>[id,validateMaster(master)])
    )
  };
  throwIfInvalid(report);

  database={
    ...manifest,
    materials:materials.materials,
    masters:manifest.masters
      .filter(entry=>entry.enabled!==false)
      .map(entry=>masterMap[entry.id]),
    masterMap,
    validationReport:report
  };
  return database;
}

export function findMaster(database,id){
  return database.masterMap?.[id]
    ?? database.masters.find(master=>master.id===id)
    ?? database.masters[0];
}

export function findMaterial(database,id){
  return database.materials?.[id]??null;
}
