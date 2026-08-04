# SaifKS Masters Rebuild — Phase 1

This package establishes the new professional architecture.

Completed:
- Clean folder structure
- 9-language JSON system
- Unified masters database schema
- Central state object
- Isolated storage, data, translation, rendering, and calculation modules
- Early language bootstrap to avoid refresh flicker
- Organized hero and material assets
- Minimal responsive application shell

Not yet migrated:
- Full affinity database
- Full skills database
- Existing calculations
- Inventory persistence
- Copy summary logic
- Final visual design

The old project is included only under `_legacy_source` inside the build workspace and is not shipped in the final ZIP.


## Phase 2.1 completed — Master Database Engine

- Added `data/database.json` manifest.
- Added `data/materials.json`.
- Added one validated JSON file per master under `data/masters/`.
- Migrated 100 affinity levels and all four skills for each of the six masters.
- Added runtime validation in `js/validator.js`.
- Updated `js/data.js` to assemble and validate the database.
- Added transparent data-quality warnings instead of inventing missing translations.


## Phase 2.2.1 completed — Affinity Engine

Added:
- `js/engine/engine-result.js`
- `js/engine/affinity-rules.js`
- `js/engine/affinity-engine.js`
- `js/engine/engine.js`
- `tests/affinity-engine.test.mjs`
- `tests/affinity-integration.mjs`

The engine is pure and independent from the DOM and localStorage.
