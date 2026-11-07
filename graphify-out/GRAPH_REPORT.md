# Graph Report - PIXIE WEBSITE  (2026-11-07)

## Corpus Check
- 39 files · ~60,762 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: .css 13, .example 1, (none) 1)

## Summary
- 343 nodes · 609 edges · 21 communities (17 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- BluebellPass.tsx
- package.json
- compilerOptions
- __OriginkitBase_BluebellPass
- react
- buildSkyLayers
- particle-sphere.tsx
- crTab
- AGENTS.md
- CLAUDE.md
- particlesphere.tsx
- ContactPage.tsx
- TrustedBy.tsx
- app/page.tsx
- Services.tsx
- backdrop.tsx
- postcss.config.mjs
- Faq.tsx
- OurWork.tsx
- route.ts
- globe.tsx

## God Nodes (most connected - your core abstractions)
1. `__OriginkitBase_BluebellPass()` - 23 edges
2. `react` - 20 edges
3. `compilerOptions` - 16 edges
4. `buildSkyLayers()` - 13 edges
5. `buildGround()` - 13 edges
6. `__OriginkitBase_Globe()` - 13 edges
7. `Home()` - 11 edges
8. `smooth()` - 9 edges
9. `Logo()` - 9 edges
10. `OurWork()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Contact()` --calls--> `ContactPage()`  [EXTRACTED]
  app/contact/page.tsx → components/contact/ContactPage.tsx
- `Home()` --calls--> `Faq()`  [EXTRACTED]
  app/page.tsx → components/Faq.tsx
- `Home()` --calls--> `OurWork()`  [EXTRACTED]
  app/page.tsx → components/OurWork.tsx
- `Home()` --calls--> `Services()`  [EXTRACTED]
  app/page.tsx → components/Services.tsx
- `Home()` --calls--> `Testimonials()`  [EXTRACTED]
  app/page.tsx → components/Testimonials.tsx

## Import Cycles
- None detected.

## Communities (21 total, 4 thin omitted)

### Community 0 - "BluebellPass.tsx"
Cohesion: 0.04
Nodes (45): Adv, Bloom, BluebellPassAdvanced, BluebellPassPlacement, BluebellPassProps, BluebellPassSway, Box, DEFAULT_ADVANCED (+37 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (44): metadata, montserrat, viewport, dependencies, clsx@^2.1.1, d3-geo@^3.1.2, motion@^14.9.1, next@^16.4.3 (+36 more)

### Community 2 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 3 - "__OriginkitBase_BluebellPass"
Cohesion: 0.27
Nodes (15): BluebellPass(), ctx2d(), flowerSprite(), frameScale(), makeCanvas(), makePalette(), makePose(), mix() (+7 more)

### Community 4 - "react"
Cohesion: 0.13
Nodes (21): EASE, LINKS, Arrow(), EASE, initials(), pad(), placeFor(), QuoteMark() (+13 more)

### Community 5 - "buildSkyLayers"
Cohesion: 0.23
Nodes (14): buildSkyLayers(), clamp(), cr1(), fieldCover(), grad3(), mwFade(), parseColor(), pfbm() (+6 more)

### Community 6 - "particle-sphere.tsx"
Cohesion: 0.19
Nodes (16): MaskGroup(), MaskGroupProps, Orb(), COMPONENT_DEFAULTS, CURSOR_PHYSICS, extractDefaultValue(), mapCursorStrengthUiToMultiplier(), mapLinear() (+8 more)

### Community 7 - "crTab"
Cohesion: 0.36
Nodes (8): buildGround(), crTab(), edgeAt(), inPath(), lerpTab(), pathAt(), rng(), terraceAt()

### Community 10 - "particlesphere.tsx"
Cohesion: 0.27
Nodes (13): COMPONENT_DEFAULTS, CURSOR_PHYSICS, extractDefaultValue(), mapCursorStrengthUiToMultiplier(), mapLinear(), mapParticleSizeUiToInternal(), mapScaleUiToMultiplier(), mapSpeedUiToInternal() (+5 more)

### Community 11 - "ContactPage.tsx"
Cohesion: 0.22
Nodes (11): Arrow(), ContactGlobe, ContactPage(), EASE, Field(), GLOBE_PROPS, Line(), SERVICES (+3 more)

### Community 12 - "TrustedBy.tsx"
Cohesion: 0.32
Nodes (5): LOGOS, queuesFor(), size(), SIZED, TrustedBy()

### Community 13 - "app/page.tsx"
Cohesion: 0.10
Nodes (26): Contact(), metadata, Home(), Arrow(), EASE, FinalCta(), Line(), COLUMNS (+18 more)

### Community 14 - "Services.tsx"
Cohesion: 0.27
Nodes (7): Arrow(), ICONS, pad(), Play(), Service, SERVICES, Services()

### Community 17 - "Faq.tsx"
Cohesion: 0.23
Nodes (10): Arrow(), CATEGORIES, ContactCard(), EASE, Faq(), listMotion, pad(), QA (+2 more)

### Community 18 - "OurWork.tsx"
Cohesion: 0.19
Nodes (14): Arrow(), clamp(), DELAY, Geo, lerp(), measure(), NICHES, OurWork() (+6 more)

### Community 19 - "route.ts"
Cohesion: 0.67
Nodes (3): POST(), SERVICES, text()

### Community 20 - "globe.tsx"
Cohesion: 0.20
Nodes (19): DotsConfig, GlobeProps, latLngToPosition(), mapDensityUiToSpacing(), mapDetailToStepSize(), mapDotSizeUiToMultiplier(), mapDragSpeedUiToSensitivity(), mapLinear() (+11 more)

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `BluebellPass.tsx`, `package.json`, `particle-sphere.tsx`, `particlesphere.tsx`, `ContactPage.tsx`, `TrustedBy.tsx`, `app/page.tsx`, `Services.tsx`, `Faq.tsx`, `OurWork.tsx`, `globe.tsx`?**
  _High betweenness centrality (0.570) - this node is a cross-community bridge._
- **Should `BluebellPass.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Why does `next` connect `package.json` to `TrustedBy.tsx`, `app/page.tsx`, `Services.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0549645390070922 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.12535612535612536 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09851551956815115 - nodes in this community are weakly interconnected._