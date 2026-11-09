# Graph Report - PIXIE WEBSITE  (2026-11-09)

## Corpus Check
- 59 files · ~40,442 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 23 file(s) not represented in the graph (top: .css 18, .example 1, (none) 1)

## Summary
- 363 nodes · 708 edges · 18 communities (12 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `457fa3a5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ScrollStroke.tsx
- package.json
- compilerOptions
- react
- originals/README.md
- particle-sphere.tsx
- Faq.tsx
- AGENTS.md
- CLAUDE.md
- react
- ContactPage.tsx
- WorksPage.tsx
- WhyChooseUs.tsx
- postcss.config.mjs
- react
- globe.tsx
- README.md

## God Nodes (most connected - your core abstractions)
1. `react` - 26 edges
2. `Footer()` - 18 edges
3. `Logo()` - 17 edges
4. `next` - 17 edges
5. `SideNav()` - 16 edges
6. `compilerOptions` - 16 edges
7. `__OriginkitBase_Globe()` - 15 edges
8. `haptic()` - 14 edges
9. `motion` - 14 edges
10. `Home()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `SERVICES` --calls--> `haptic()`  [EXTRACTED]
  components/Services.tsx → lib/haptics.ts
- `About()` --calls--> `AboutPage()`  [EXTRACTED]
  app/about/page.tsx → components/about/AboutPage.tsx
- `Contact()` --calls--> `ContactPage()`  [EXTRACTED]
  app/contact/page.tsx → components/contact/ContactPage.tsx
- `Home()` --calls--> `Faq()`  [EXTRACTED]
  app/page.tsx → components/Faq.tsx
- `Home()` --calls--> `Footer()`  [EXTRACTED]
  app/page.tsx → components/Footer.tsx

## Import Cycles
- None detected.

## Communities (18 total, 6 thin omitted)

### Community 0 - "ScrollStroke.tsx"
Cohesion: 0.25
Nodes (12): build(), f(), Geo, KNOT_NUMS, knotPath(), loop(), mid(), Pt (+4 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (50): dependencies, clsx@^2.1.1, d3-geo@^3.1.2, motion@^14.9.1, next@^16.4.3, postcss@^8.5.32, react@^19.3.1, react-dom@^19.3.1 (+42 more)

### Community 2 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 4 - "react"
Cohesion: 0.07
Nodes (29): Home(), Arrow(), EASE, FinalCta(), Line(), HeroStack(), Arrow(), ICONS (+21 more)

### Community 6 - "particle-sphere.tsx"
Cohesion: 0.15
Nodes (20): Hero19(), MaskGroup(), MaskGroupProps, Orb(), ParticleSphere, COMPONENT_DEFAULTS, CURSOR_PHYSICS, extractDefaultValue() (+12 more)

### Community 7 - "Faq.tsx"
Cohesion: 0.21
Nodes (11): Arrow(), CATEGORIES, ContactCard(), EASE, Faq(), FAQ_LD, listMotion, pad() (+3 more)

### Community 10 - "react"
Cohesion: 0.15
Nodes (17): AboutPage(), Arrow(), EASE, GLOBE_WORDS, Heading(), Line(), MARQUEE, STEPS (+9 more)

### Community 11 - "ContactPage.tsx"
Cohesion: 0.21
Nodes (12): Arrow(), ContactGlobe, ContactPage(), EASE, Field(), Globe, GLOBE_PROPS, Line() (+4 more)

### Community 12 - "WorksPage.tsx"
Cohesion: 0.10
Nodes (34): Arrow(), clamp(), DELAY, Geo, lerp(), measure(), NICHES, OurWork() (+26 more)

### Community 14 - "WhyChooseUs.tsx"
Cohesion: 0.29
Nodes (8): clamp(), pad(), pt(), Reason, REASONS, sector(), smoothstep(), WhyChooseUs()

### Community 17 - "react"
Cohesion: 0.06
Nodes (47): About(), metadata, Contact(), metadata, metadata, montserrat, RootLayout(), viewport (+39 more)

### Community 20 - "globe.tsx"
Cohesion: 0.17
Nodes (20): DotsConfig, Globe(), GlobeProps, latLngToPosition(), mapDensityUiToSpacing(), mapDetailToStepSize(), mapDotSizeUiToMultiplier(), mapDragSpeedUiToSensitivity() (+12 more)

## Knowledge Gaps
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ScrollStroke.tsx`, `package.json`, `react`, `particle-sphere.tsx`, `Faq.tsx`, `ContactPage.tsx`, `WorksPage.tsx`, `WhyChooseUs.tsx`, `react`, `globe.tsx`?**
  _High betweenness centrality (0.343) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05411764705882353 - nodes in this community are weakly interconnected._
- **Why does `next` connect `react` to `package.json`, `ContactPage.tsx`, `react`, `particle-sphere.tsx`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `motion` connect `react` to `ScrollStroke.tsx`, `package.json`, `react`, `Faq.tsx`, `ContactPage.tsx`, `WorksPage.tsx`, `react`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07087486157253599 - nodes in this community are weakly interconnected._
- **Should `WorksPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09986504723346828 - nodes in this community are weakly interconnected._