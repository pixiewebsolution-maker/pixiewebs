# Graph Report - PIXIE WEBSITE  (2026-11-10)

## Corpus Check
- 61 files · ~41,713 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 23 file(s) not represented in the graph (top: .css 18, .example 1, (none) 1)

## Summary
- 370 nodes · 724 edges · 19 communities (13 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a252bef5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- WorksPage.tsx
- package.json
- compilerOptions
- react
- originals/README.md
- particle-sphere.tsx
- Faq.tsx
- AGENTS.md
- CLAUDE.md
- react
- Services.tsx
- ScrollStroke.tsx
- layout.tsx
- WhyChooseUs.tsx
- postcss.config.mjs
- react
- globe.tsx
- README.md

## God Nodes (most connected - your core abstractions)
1. `react` - 28 edges
2. `Footer()` - 18 edges
3. `Logo()` - 17 edges
4. `next` - 17 edges
5. `SideNav()` - 16 edges
6. `compilerOptions` - 16 edges
7. `__OriginkitBase_Globe()` - 15 edges
8. `haptic()` - 14 edges
9. `motion` - 14 edges
10. `Home()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `SERVICES` --calls--> `haptic()`  [EXTRACTED]
  components/Services.tsx → lib/haptics.ts
- `About()` --calls--> `AboutPage()`  [EXTRACTED]
  app/about/page.tsx → components/about/AboutPage.tsx
- `Home()` --calls--> `Faq()`  [EXTRACTED]
  app/page.tsx → components/Faq.tsx
- `Home()` --calls--> `Footer()`  [EXTRACTED]
  app/page.tsx → components/Footer.tsx
- `Home()` --calls--> `Hero19()`  [EXTRACTED]
  app/page.tsx → components/originkit/hero-19.tsx

## Import Cycles
- None detected.

## Communities (19 total, 6 thin omitted)

### Community 0 - "WorksPage.tsx"
Cohesion: 0.10
Nodes (35): Arrow(), clamp(), DELAY, Geo, lerp(), measure(), NICHE_ORDER, NICHES (+27 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (52): dependencies, clsx@^2.1.1, d3-geo@^3.1.2, lenis@^1.3.27, motion@^14.9.1, next@^16.4.3, postcss@^8.5.32, react@^19.3.1 (+44 more)

### Community 2 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 4 - "react"
Cohesion: 0.09
Nodes (23): Home(), Arrow(), EASE, FinalCta(), Line(), HeroStack(), ScrollSteps(), Arrow() (+15 more)

### Community 6 - "particle-sphere.tsx"
Cohesion: 0.15
Nodes (20): Hero19(), MaskGroup(), MaskGroupProps, Orb(), ParticleSphere, COMPONENT_DEFAULTS, CURSOR_PHYSICS, extractDefaultValue() (+12 more)

### Community 7 - "Faq.tsx"
Cohesion: 0.21
Nodes (11): Arrow(), CATEGORIES, ContactCard(), EASE, Faq(), FAQ_LD, listMotion, pad() (+3 more)

### Community 10 - "react"
Cohesion: 0.12
Nodes (20): AboutPage(), Arrow(), EASE, GLOBE_WORDS, Heading(), Line(), MARQUEE, STEPS (+12 more)

### Community 11 - "Services.tsx"
Cohesion: 0.27
Nodes (7): Arrow(), ICONS, pad(), Play(), Service, SERVICES, Services()

### Community 12 - "ScrollStroke.tsx"
Cohesion: 0.26
Nodes (12): build(), f(), Geo, KNOT_NUMS, knotPath(), loop(), mid(), Pt (+4 more)

### Community 13 - "layout.tsx"
Cohesion: 0.17
Nodes (10): metadata, montserrat, RootLayout(), viewport, SmoothScroll(), StructuredData(), SITE_DESCRIPTION, SITE_NAME (+2 more)

### Community 14 - "WhyChooseUs.tsx"
Cohesion: 0.29
Nodes (8): clamp(), pad(), pt(), Reason, REASONS, sector(), smoothstep(), WhyChooseUs()

### Community 17 - "react"
Cohesion: 0.07
Nodes (47): About(), metadata, Contact(), metadata, Arrow(), metadata, NotFound(), metadata (+39 more)

### Community 20 - "globe.tsx"
Cohesion: 0.17
Nodes (20): DotsConfig, Globe(), GlobeProps, latLngToPosition(), mapDensityUiToSpacing(), mapDetailToStepSize(), mapDotSizeUiToMultiplier(), mapDragSpeedUiToSensitivity() (+12 more)

## Knowledge Gaps
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `WorksPage.tsx`, `package.json`, `react`, `particle-sphere.tsx`, `Faq.tsx`, `Services.tsx`, `ScrollStroke.tsx`, `layout.tsx`, `WhyChooseUs.tsx`, `react`, `globe.tsx`?**
  _High betweenness centrality (0.362) - this node is a cross-community bridge._
- **Should `WorksPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09615384615384616 - nodes in this community are weakly interconnected._
- **Why does `next` connect `react` to `package.json`, `react`, `particle-sphere.tsx`, `Services.tsx`, `layout.tsx`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05224963715529753 - nodes in this community are weakly interconnected._
- **Why does `motion` connect `react` to `WorksPage.tsx`, `package.json`, `react`, `Faq.tsx`, `ScrollStroke.tsx`, `react`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.08907563025210084 - nodes in this community are weakly interconnected._