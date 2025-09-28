# Production Guardrails

## Directory Blueprint
```
assets/
├── backgrounds/
│   ├── indoor/
│   ├── outdoor/
│   └── abstract/
├── characters/
│   ├── main/
│   ├── supporting/
│   └── background/
├── objects/
│   ├── furniture/
│   ├── tools/
│   └── decorative/
├── effects/
│   ├── particles/
│   ├── lighting/
│   └── transitions/
├── animations/
│   ├── walking/
│   ├── talking/
│   └── object-movement/
└── scenes/
    ├── scene-01/
    ├── scene-02/
    └── scene-03/
```

Tailor the tree to the production: remove unused buckets, rename categories to match the narrative, and add new folders only when their assets are ready to ship.

## Naming Convention
```
[category]-[name]-[variant]-[size].svg
Examples:
- character-main-hero-idle-24x24.svg
- background-forest-day-1920x1080.svg
- object-sword-shining-32x32.svg
- animation-walking-cycle-48x48.svg
```

Keep names descriptive, version assets with suffixes only when multiple variants ship at once, and prefer hyphen-separated lowercase tokens.

## Asset Registry Expectations
- Maintain a single registry (JSON, TS, or MD) mapping asset IDs to file paths so scenes can import declaratively.
- Capture metadata that aids animation (palette, rig notes, usage hints) alongside each entry.
- Remove placeholders immediately; if a sequence does not need a class of assets, omit it instead of leaving dummies.
- Document any runtime generators and link them back to the assets they produce.

## Coordinate System
```
BASE GRID (example 1920x1080):
- X-axis: 0-1920 (left to right)
- Y-axis: 0-1080 (top to bottom)
- Z-axis: 0-100 (depth layers)
```

Adjust the base grid to match the composition resolution. Declare the system you use in the story docs so asset authors can align their work.

### Depth and Position Bands
```
DEPTH LAYERS (adjust as needed):
- Background: Z = 0-20
- Mid-ground: Z = 21-60
- Foreground: Z = 61-80
- UI / Overlay: Z = 81-100

HORIZONTAL ZONES (example ranges):
- Far left: X = 100-300
- Left: X = 300-600
- Center-left: X = 600-900
- Center: X = 900-1020
- Center-right: X = 1020-1320
- Right: X = 1320-1620
- Far right: X = 1620-1820
```

Update these bands when the staging changes; record them in the docs so blocking decisions remain consistent.

## Scaling Guidelines
```
DISTANCE SCALE FACTORS (tune to project):
- Far background: 0.3-0.5x
- Background: 0.5-0.7x
- Mid-ground: 0.7-0.9x
- Foreground: 1.0x
- Close-up: 1.2-1.5x
- Extreme close-up: 1.5-2.0x
```

```
SIZE CATEGORIES (starting point):
CHARACTERS
- Tiny (far): 24x24px
- Small (background): 48x48px
- Medium (mid-ground): 96x96px
- Large (foreground): 192x192px
- Huge (close-up): 384x384px

OBJECTS
- Tiny: 16x16px
- Small: 32x32px
- Medium: 64x64px
- Large: 128x128px
- Huge: 256x256px
```

Revise the scales whenever the art direction shifts. Note the active scale set inside the asset brief.

## Automation Expectations
- Introduce new directories and assets in the same pass and wire them into scenes or generators immediately.
- Keep asset metadata embedded, follow palette and outline standards, and compress SVGs with SVGO before check-in.
- Drive scenes from timeline data; avoid stray frame counts or unused files.
- Promote SVG assets with SVGR when granular manipulation is required in React.

## Performance Safeguards
- Use CSS transforms instead of positional nudges for smooth, GPU-friendly animation.
- Group related animations and apply `will-change` thoughtfully to limit layout thrash.
- Keep simultaneous animations manageable; schedule bursts via `Sequence` when possible.
- Prefer `requestAnimationFrame` for bespoke motion utilities.
- Hit the size targets before export:
  - Simple character <5KB
  - Complex character <15KB
  - Background <20KB
  - Full scene <50KB
  - Complete animation <100KB

## Quality Guardrails
- Use deterministic randomness (for example `seededRandom`) for repeatable particle effects.
- Stage transitions via Remotion `Sequence` layering and any overlay components the project uses.
- Verify every referenced audio file exists under `public/audio/` before rendering final output.
- Prior to export: run `npm run lint`, execute the performance checklist in `docs/performance-checklist.md`, and record outcomes in `TODO.md`. (SVGO compression is required for production exports but may be skipped during early exploration.)

## Quality Checklists
```
ANIMATION QUALITY
- [ ] Smooth character movement
- [ ] Proper timing and easing
- [ ] Consistent scaling
- [ ] Correct positioning
- [ ] Natural gestures
- [ ] Smooth transitions
- [ ] Performance optimized
- [ ] Cross-browser compatible

STORY COHERENCE
- [ ] Characters match story description
- [ ] Scenes reflect story setting
- [ ] Actions match story events
- [ ] Timeline is accurate
- [ ] Visual style is consistent
- [ ] Story flow is logical
```

## Forward Improvements
- Script timeline generation directly from the active beat sheet once it exists.
- Automate SVGO and render validation in CI.
- Expand character pose libraries (visemes, gestures, expression swaps) as new stories demand.
- Add testing coverage for timeline utilities, easing helpers, and generator math.

Cross-check `MISSION-BRIEF.md` and `AUTOMATION-AGENT.md` before each production pass to stay aligned on narrative intent and implementation steps.