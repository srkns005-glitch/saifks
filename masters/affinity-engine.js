import { success, failure } from './engine-result.js';
import { AFFINITY_RULES, validateAffinityRange } from './affinity-rules.js';

function rowAtLevel(master, level) {
  if (level === 0) return null;
  return master.affinity.levels[level - 1] ?? null;
}

function effectAtLevel(master, level) {
  if (level === 0) return 0;
  return Number(rowAtLevel(master, level)?.effect?.value ?? 0);
}

function requiredRows(master, currentLevel, targetLevel) {
  if (targetLevel <= currentLevel) return [];
  return master.affinity.levels.slice(currentLevel, targetLevel);
}

function sumCosts(rows) {
  return rows.reduce((totals, row) => {
    totals.affinityPoints += Number(row?.cost?.affinityPoints ?? 0);
    totals.masterEmblems += Number(row?.cost?.masterEmblems ?? 0);
    return totals;
  }, { affinityPoints: 0, masterEmblems: 0 });
}

export function calculateAffinityCost(master, currentLevel, targetLevel) {
  const validation = validateAffinityRange(master, currentLevel, targetLevel);
  if (validation.errors.length) return failure(validation.errors);

  const costs = sumCosts(requiredRows(master, validation.current, validation.target));
  return success({
    currentLevel: validation.current,
    targetLevel: validation.target,
    levelsToUpgrade: validation.target - validation.current,
    affinityPoints: costs.affinityPoints,
    masterEmblems: costs.masterEmblems
  });
}

export function calculateAffinityBonus(master, currentLevel, targetLevel) {
  const validation = validateAffinityRange(master, currentLevel, targetLevel);
  if (validation.errors.length) return failure(validation.errors);

  const current = effectAtLevel(master, validation.current);
  const target = effectAtLevel(master, validation.target);
  return success({
    stat: AFFINITY_RULES.effectStat,
    unit: AFFINITY_RULES.effectUnit,
    current,
    target,
    gain: Number((target - current).toFixed(6))
  });
}

export function calculateAffinityMaterials(master, currentLevel, targetLevel) {
  const cost = calculateAffinityCost(master, currentLevel, targetLevel);
  if (!cost.success) return cost;
  return success({
    affinity_points: cost.data.affinityPoints,
    master_emblems: cost.data.masterEmblems
  });
}

export function calculateAffinity(master, currentLevel, targetLevel) {
  const cost = calculateAffinityCost(master, currentLevel, targetLevel);
  if (!cost.success) return cost;

  const bonus = calculateAffinityBonus(master, currentLevel, targetLevel);
  if (!bonus.success) return bonus;

  return success({
    masterId: master.id,
    currentLevel: cost.data.currentLevel,
    targetLevel: cost.data.targetLevel,
    levelsToUpgrade: cost.data.levelsToUpgrade,
    required: {
      affinityPoints: cost.data.affinityPoints,
      masterEmblems: cost.data.masterEmblems
    },
    effect: bonus.data
  });
}
