SaifKS Hero Center
Build: hero-center-20260930-1

Current scope:
- 37 heroes: 25 Mythic, 8 Epic, and 4 Rare
- Mythic generations 1–8
- Class filters and global hero search
- Full hero details: overview, sources, stats, Conquest, Expedition, and Exclusive Gear
- Nine interface languages with persistent language selection
- Responsive layout for desktop, iPad, and mobile

Data and assets:
- The inline `heroes` collection in index.html is the single authoritative hero-data source.
- Translation dictionaries remain split into the translation JavaScript files.
- Build-version query strings are applied to page scripts and dynamic images to prevent stale cached files.
- Class icons use lightweight SVG assets.
- Large Generation 8 portraits use optimized WebP assets.

Deployment:
- Upload or replace the complete hero-center folder.
- Keep index.html and its versioned assets from the same build together.
