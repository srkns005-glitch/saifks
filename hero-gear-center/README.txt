SaifKS Hero Gear & Exclusive Weapon Calculator
Build: hero-gear-v31-stable-language-20260930

Runtime files:
- index.html: stable page, translations and the single embedded gear database.
- hero-gear-v31.js: audited calculations, state migration, accessibility and interaction fixes.
- hero-gear-v31.css: responsive visual refinements.
- hero-gear-v28.js/css: compatibility bridges that forward cached older pages to v31.

Verified behavior:
- Hero Gear Enhancement levels 0-200.
- XP total 0-200: 574,370.
- XP total 101-200: 501,050.
- Level 100 requires no mastery; mastery 10 begins at level 101.
- Exclusive weapon widgets are calculated once in an independent plan.
- Changing any gear or mastery level updates the summary automatically; no add/update action is required.
- Correct XP values are stored directly in the embedded database; no runtime correction is applied.
- Level options are generated from each field's maximum instead of being repeated in the HTML.
- Existing saved plans migrate automatically to the current state format.
- Nine languages, persistent language selection and RTL support.
- A language set in the page URL remains stable and is not changed by another open tab.
- Keyboard-accessible reset dialog and labelled form controls.
- Responsive layout for desktop, iPad and mobile.

Removed:
- Duplicate external database copy.
- Unused legacy images and placeholder HTML files.
- Ineffective GitHub Pages _headers cache file.

Sources checked on 2026-09-30:
- Kingshot Optimizer XP Costs.
- Kingshot Optimizer Forgehammer Costs.
- Kingshot Guide Hero Gear Enhancement.
- Kingshot Data Widget Costs.
