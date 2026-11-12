const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const directory = path.join(__dirname, "../../governor-center");
const read = name => fs.readFileSync(path.join(directory, name), "utf8");
const page = read("index.html");
const scriptPath = page.match(/<script src="(app-v\d+\.js)"[^>]*><\/script>/)?.[1];
assert.ok(scriptPath, "Governor Center must load a versioned app script");
const app = read(scriptPath);
const metadata = JSON.parse(read("data/metadata.json"));
assert.ok(Number(metadata.schema_version.split(".")[0]) >= 2);

const datasets = new Map(metadata.files.map(file => {
  assert.ok(app.includes(`fetchJson("data/${file}")`), `App must load ${file}`);
  const data = JSON.parse(read(`data/${file}`));
  return [data.dataset, data.levels];
}));

const gear = datasets.get("governor_gear");
assert.ok(gear.length >= 186);
assert.deepEqual(gear.slice(25, 31).map(row => row.step), [0, 1, 2, 3, 4, 0]);
assert.equal(gear[185].display_name, "Red T6 3★");

const charms = datasets.get("governor_charms");
assert.ok(charms.length >= 90);
assert.deepEqual(charms.slice(4, 10).map(row => row.level), [5, 5.1, 5.2, 5.3, 5.4, 6]);
assert.equal(charms[89].level, 22);
