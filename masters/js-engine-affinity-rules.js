export const AFFINITY_RULES = Object.freeze({
  minimumLevel: 0,
  affinityResourceKey: 'affinityPoints',
  emblemResourceKey: 'masterEmblems',
  effectStat: 'squad_attack_percent',
  effectUnit: 'percent'
});

export function normalizeLevel(value) {
  const number = Number(value);
  return Number.isInteger(number) ? number : NaN;
}

export function validateAffinityRange(master, currentLevel, targetLevel) {
  const errors = [];
  const current = normalizeLevel(currentLevel);
  const target = normalizeLevel(targetLevel);
  const max = Number(master?.affinity?.maxLevel ?? 0);

  if (!master || typeof master !== 'object') errors.push('Master data is required.');
  if (!Number.isInteger(current)) errors.push('Current affinity level must be an integer.');
  if (!Number.isInteger(target)) errors.push('Target affinity level must be an integer.');
  if (Number.isInteger(current) && current < 0) errors.push('Current affinity level cannot be below 0.');
  if (Number.isInteger(target) && target < 0) errors.push('Target affinity level cannot be below 0.');
  if (Number.isInteger(current) && current > max) errors.push(`Current affinity level cannot exceed ${max}.`);
  if (Number.isInteger(target) && target > max) errors.push(`Target affinity level cannot exceed ${max}.`);
  if (Number.isInteger(current) && Number.isInteger(target) && target < current) {
    errors.push('Target affinity level cannot be lower than the current level.');
  }

  return { current, target, max, errors };
}
