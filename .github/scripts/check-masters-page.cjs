const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "../..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const page = read("masters/index.html");
assert.match(read("home.js"), /action:'openMasters'[^\n]*path:'masters\/'/);

const assets = [...page.matchAll(/(?:src|href)="((?:app-|styles-|master-profiles-)[^"?]+|november-masters\.js)"/g)]
  .map(([, file]) => file);
assert.ok(assets.some(file => /^app-\d+\.js$/.test(file)), "Masters page must load a versioned application");
assert.ok(assets.some(file => /^styles-\d+\.css$/.test(file)), "Masters page must load versioned styles");
for (const file of assets) assert.ok(read(`masters/${file}`).length, `Missing Masters asset ${file}`);

const dataFile = assets.find(file => /^master-profiles-\d+\.js$/.test(file));
assert.ok(dataFile);
const data = vm.runInNewContext(`${read(`masters/${dataFile}`)}\nNOVEMBER_MASTER_DATA`);
for (const name of ["olander", "catherine"]) {
  assert.ok(page.includes(`data-expert="${name}"`), `Missing ${name} in the Master selector`);
  assert.ok(fs.statSync(path.join(root, `masters/portraits/${name}.webp`)).size > 0);
  assert.equal(data[name].affinity.length, 100);
  assert.equal(data[name].expertise.length, 11);
  assert.equal(data[name].skills.length, 4);
}
