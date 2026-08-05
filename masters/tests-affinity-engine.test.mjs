import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {
  calculateAffinity,
  calculateAffinityBonus,
  calculateAffinityCost,
  calculateAffinityMaterials
} from './js-engine-affinity-engine.js';

const master = JSON.parse(
  await fs.readFile(new URL('data-masters-valora.json', import.meta.url), 'utf8')
);

const directCost = (current, target) => master.affinity.levels
  .slice(current, target)
  .reduce((sum, row) => ({
    affinityPoints: sum.affinityPoints + row.cost.affinityPoints,
    masterEmblems: sum.masterEmblems + row.cost.masterEmblems
  }), { affinityPoints: 0, masterEmblems: 0 });

let result = calculateAffinity(master, 0, 1);
assert.equal(result.success, true);
assert.equal(result.data.required.affinityPoints, master.affinity.levels[0].cost.affinityPoints);

const expected = directCost(20, 60);
result = calculateAffinityCost(master, 20, 60);
assert.equal(result.success, true);
assert.equal(result.data.affinityPoints, expected.affinityPoints);
assert.equal(result.data.masterEmblems, expected.masterEmblems);

result = calculateAffinityBonus(master, 20, 60);
assert.equal(result.success, true);
assert.equal(result.data.current, master.affinity.levels[19].effect.value);
assert.equal(result.data.target, master.affinity.levels[59].effect.value);

result = calculateAffinityMaterials(master, 40, 40);
assert.equal(result.success, true);
assert.deepEqual(result.data, { affinity_points: 0, master_emblems: 0 });

assert.equal(calculateAffinity(master, 60, 20).success, false);
assert.equal(calculateAffinity(master, -1, 10).success, false);
assert.equal(calculateAffinity(master, 0, 101).success, false);

console.log('Affinity engine tests passed.');
