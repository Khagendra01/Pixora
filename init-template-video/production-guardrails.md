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

## Naming Convention
```
[category]-[name]-[variant]-[size].svg
Examples:
- character-main-hero-idle-24x24.svg
- background-forest-day-1920x1080.svg
- object-sword-shining-32x32.svg
- animation-walking-cycle-48x48.svg
```

## Current Asset Registry
- **Backgrounds**
  - `assets/backgrounds/indoor/background-mainframe-hall-1920x1080.svg`
  - `assets/backgrounds/outdoor/background-victorian-park-1920x1080.svg`
  - `assets/backgrounds/abstract/background-vector-grid-1920x1080.svg`
- **Characters**
  - `assets/characters/main/character-daisy-neutral-192x192.svg`
  - `assets/characters/supporting/character-hal-neutral-192x192.svg`
  - `assets/characters/background/character-bot-dancer-160x160.svg`
- **Objects & Props**
  - `assets/objects/furniture/object-park-bench-256x128.svg`
  - `assets/objects/tools/object-gear-large-128x128.svg`
  - `assets/objects/decorative/object-daisy-cluster-96x96.svg`
- **Effects**
  - `assets/effects/particles/effect-petal-sprite-sheet-256x64.svg`
  - `assets/effects/lighting/effect-stage-beam-1920x1080.svg`
  - `assets/effects/transitions/effect-circle-wipe-1080x1080.svg`
- **Animation References**
  - `assets/animations/walking/animation-tandem-pedal-cycle.svg`
  - `assets/animations/talking/animation-synth-face-visemes.svg`
  - `assets/animations/object-movement/animation-petal-arc.svg`
- **Scene Layouts**
  - `assets/scenes/scene-01/scene-01-composition-1920x1080.svg`
  - `assets/scenes/scene-02/scene-02-composition-1920x1080.svg`
  - `assets/scenes/scene-03/scene-03-composition-1920x1080.svg`

## Coordinate System
```
BASE GRID (1920x1080):
- X-axis: 0-1920 (left → right)
- Y-axis: 0-1080 (top → bottom)
- Z-axis: 0-100 (depth layers)

DEPTH LAYERS:
- Background: Z = 0-20
- Mid-ground: Z = 21-60
- Foreground: Z = 61-80
- UI/Overlay: Z = 81-100
```

### Character Positioning Bands
```
HORIZONTAL ZONES:
- Far left: X = 100-300
- Left: X = 300-600
- Center-left: X = 600-900
- Center: X = 900-1020
- Center-right: X = 1020-1320
- Right: X = 1320-1620
- Far right: X = 1620-1820

HEIGHT LEVELS:
- Ground: Y = 800-1080
- Seated: Y = 600-800
- Standing: Y = 400-600
- Elevated: Y = 200-400
- Flying: Y = 0-200
```

## Scaling Guidelines
```
DISTANCE SCALE FACTORS:
- Far background: 0.3-0.5×
- Background: 0.5-0.7×
- Mid-ground: 0.7-0.9×
- Foreground: 1.0×
- Close-up: 1.2-1.5×
- Extreme close-up: 1.5-2.0×
```

```
SIZE CATEGORIES:
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

## Automation Expectations
- Introduce new directories and assets in the same pass and wire them into scenes or generators immediately.
- Keep asset metadata embedded, follow palette/outline standards, and compress SVGs with SVGO before check-in.
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
- Use deterministic randomness (e.g., `seededRandom`) for repeatable particle effects.
- Stage transitions via Remotion `Sequence` layering and the circle-wipe overlay.
- Confirm `public/audio/daisy-bell.mp3` exists before rendering final output.
- Prior to export: run `npm run lint`, compress SVGs, execute the performance checklist in `docs/performance-checklist.md`, and record outcomes in `TODO.md`.

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
- Script timeline generation directly from `docs/animation-timing.md`.
- Automate SVGO and render validation in CI.
- Expand character viseme sets and secondary poses (wave, hat-tip, smile).
- Add Vitest coverage for timeline utilities and emitter math.

Cross-check `MISSION-BRIEF.md` and `AUTOMATION-AGENT.md` before each production pass to stay aligned on narrative intent and implementation steps.
