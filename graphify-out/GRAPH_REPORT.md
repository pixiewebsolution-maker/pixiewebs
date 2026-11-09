# Graph Report - PIXIE WEBSITE  (2026-11-09)

## Corpus Check
- 60 files · ~41,310 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 24 file(s) not represented in the graph (top: .css 19, .example 1, (none) 1)

## Summary
- 373 nodes · 729 edges · 19 communities (13 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bfec9c07`
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
- next
- WorksPage.tsx
- TrustedBy.tsx
- WhyChooseUs.tsx
- postcss.config.mjs
- react
- globe.tsx
- README.md

## God Nodes (most connected - your core abstractions)
1. `react` - 27 edges
2. `Footer()` - 18 edges
3. `Logo()` - 17 edges
4. `next` - 17 edges
5. `SideNav()` - 16 edges
6. `haptic()` - 16 edges
7. `compilerOptions` - 16 edges
8. `__OriginkitBase_Globe()` - 15 edges
9. `motion` - 14 edges
10. `Home()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `SERVICES` --calls--> `haptic()`  [EXTRACTED]
  components/Services.tsx → lib/haptics.ts
- `About()` --calls--> `AboutPage()`  [EXTRACTED]
  app/about/page.tsx → components/about/AboutPage.tsx
- `Home()` --calls--> `Faq()`  [EXTRACTED]
  app/page.tsx → components/Faq.tsx
- `Home()` --calls--> `Footer()`  [EXTRACTED]
  app/page.tsx → components/Footer.tsx
- `Home()` --calls--> `SideNav()`  [EXTRACTED]
  app/page.tsx → components/SideNav.tsx

## Import Cycles
- None detected.

## Communities (19 total, 6 thin omitted)

### Community 0 - "ScrollStroke.tsx"
Cohesion: 0.25
Nodes (12): build(), f(), Geo, KNOT_NUMS, knotPath(), loop(), mid(), Pt (+4 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (51): TextRoll(), cn(), dependencies, clsx@^2.1.1, d3-geo@^3.1.2, next@^16.4.3, postcss@^8.5.32, react@^19.3.1 (+43 more)

### Community 2 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 4 - "react"
Cohesion: 0.08
Nodes (30): Home(), Arrow(), EASE, FinalCta(), Line(), HeroStack(), Hero19(), MaskGroup() (+22 more)

### Community 6 - "particle-sphere.tsx"
Cohesion: 0.27
Nodes (13): COMPONENT_DEFAULTS, CURSOR_PHYSICS, extractDefaultValue(), mapCursorStrengthUiToMultiplier(), mapLinear(), mapParticleSizeUiToInternal(), mapScaleUiToMultiplier(), mapSpeedUiToInternal() (+5 more)

### Community 7 - "Faq.tsx"
Cohesion: 0.21
Nodes (11): Arrow(), CATEGORIES, ContactCard(), EASE, Faq(), FAQ_LD, listMotion, pad() (+3 more)

### Community 10 - "react"
Cohesion: 0.15
Nodes (16): AboutPage(), Arrow(), EASE, GLOBE_WORDS, Heading(), Line(), MARQUEE, STEPS (+8 more)

### Community 11 - "next"
Cohesion: 0.21
Nodes (9): metadata, montserrat, RootLayout(), viewport, StructuredData(), SITE_DESCRIPTION, SITE_NAME, SITE_TITLE (+1 more)

### Community 12 - "WorksPage.tsx"
Cohesion: 0.08
Nodes (41): Arrow(), clamp(), DELAY, Geo, lerp(), measure(), NICHES, OurWorkDesktop() (+33 more)

### Community 13 - "TrustedBy.tsx"
Cohesion: 0.21
Nodes (8): Entry, LOGOS, Pos, queuesFor(), size(), SIZED, startPos(), TrustedBy()

### Community 14 - "WhyChooseUs.tsx"
Cohesion: 0.29
Nodes (8): clamp(), pad(), pt(), Reason, REASONS, sector(), smoothstep(), WhyChooseUs()

### Community 17 - "react"
Cohesion: 0.07
Nodes (49): About(), metadata, Contact(), metadata, Arrow(), metadata, NotFound(), metadata (+41 more)

### Community 20 - "globe.tsx"
Cohesion: 0.17
Nodes (20): DotsConfig, Globe(), GlobeProps, latLngToPosition(), mapDensityUiToSpacing(), mapDetailToStepSize(), mapDotSizeUiToMultiplier(), mapDragSpeedUiToSensitivity() (+12 more)

## Knowledge Gaps
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ScrollStroke.tsx`, `package.json`, `particle-sphere.tsx`, `Faq.tsx`, `react`, `WorksPage.tsx`, `TrustedBy.tsx`, `WhyChooseUs.tsx`, `react`, `globe.tsx`?**
  _High betweenness centrality (0.360) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05241090146750524 - nodes in this community are weakly interconnected._
- **Why does `next` connect `react` to `package.json`, `next`, `react`, `TrustedBy.tsx`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `motion` connect `react` to `ScrollStroke.tsx`, `package.json`, `react`, `Faq.tsx`, `WorksPage.tsx`, `react`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.080338266384778 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.1471861471861472 - nodes in this community are weakly interconnected._