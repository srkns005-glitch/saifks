const REQUIRED_LANGUAGES=['en','ar','fr','es','de','tr','ko','ja','zh'];

function assertion(condition,message,errors){
  if(!condition) errors.push(message);
}

function validateSequence(rows,label,errors){
  const seen=new Set();
  rows.forEach((row,index)=>{
    assertion(Number.isInteger(row.level),`${label}: non-integer level`,errors);
    assertion(!seen.has(row.level),`${label}: duplicate level ${row.level}`,errors);
    seen.add(row.level);
    assertion(
      row.level===index+1,
      `${label}: expected level ${index+1}, found ${row.level}`,
      errors
    );
  });
}

export function validateMaterialDatabase(database){
  const errors=[];
  assertion(database?.schemaVersion===1,'materials: unsupported schemaVersion',errors);
  assertion(database?.materials && typeof database.materials==='object','materials: missing materials map',errors);

  for(const [id,material] of Object.entries(database?.materials||{})){
    assertion(material.id===id,`material ${id}: id mismatch`,errors);
    assertion(Boolean(material.icon),`material ${id}: missing icon`,errors);
    assertion(Boolean(material.nameKey),`material ${id}: missing nameKey`,errors);
    assertion(
      Number.isFinite(material?.conversion?.value),
      `material ${id}: invalid conversion value`,
      errors
    );
  }
  return errors;
}

export function validateMaster(master){
  const errors=[];
  assertion(master?.schemaVersion===1,`${master?.id||'master'}: unsupported schemaVersion`,errors);
  assertion(Boolean(master?.id),'master: missing id',errors);
  assertion(Boolean(master?.name),`${master?.id}: missing name`,errors);
  assertion(Boolean(master?.portrait),`${master?.id}: missing portrait`,errors);
  assertion(Array.isArray(master?.affinity?.levels),`${master?.id}: affinity levels missing`,errors);

  validateSequence(master?.affinity?.levels||[],`${master?.id} affinity`,errors);
  assertion(
    master?.affinity?.maxLevel===(master?.affinity?.levels||[]).length,
    `${master?.id}: affinity maxLevel mismatch`,
    errors
  );

  const skillIds=new Set();
  for(const skill of master?.skills||[]){
    assertion(Boolean(skill.id),`${master?.id}: skill missing id`,errors);
    assertion(!skillIds.has(skill.id),`${master?.id}: duplicate skill ${skill.id}`,errors);
    skillIds.add(skill.id);
    validateSequence(skill.levels||[],`${master?.id} skill ${skill.id}`,errors);
    assertion(
      skill.maxLevel===(skill.levels||[]).length,
      `${master?.id} skill ${skill.id}: maxLevel mismatch`,
      errors
    );
  }

  return errors;
}

export function validateDatabaseManifest(manifest){
  const errors=[];
  assertion(manifest?.schemaVersion===1,'database: unsupported schemaVersion',errors);
  assertion(Array.isArray(manifest?.masters),'database: masters list missing',errors);
  assertion(
    JSON.stringify(manifest?.supportedLanguages||[])===JSON.stringify(REQUIRED_LANGUAGES),
    'database: supported language list does not match the required 9 languages',
    errors
  );

  const ids=new Set();
  for(const entry of manifest?.masters||[]){
    assertion(Boolean(entry.id),'database: master entry missing id',errors);
    assertion(!ids.has(entry.id),`database: duplicate master ${entry.id}`,errors);
    ids.add(entry.id);
    assertion(Boolean(entry.file),`database: ${entry.id} missing file`,errors);
  }
  assertion(ids.has(manifest?.defaultMaster),'database: defaultMaster is not registered',errors);
  return errors;
}

export function throwIfInvalid(report){
  const errors=[
    ...report.manifest,
    ...report.materials,
    ...Object.values(report.masters).flat()
  ];
  if(errors.length){
    const error=new Error(`Database validation failed with ${errors.length} error(s)`);
    error.validationErrors=errors;
    throw error;
  }
}
