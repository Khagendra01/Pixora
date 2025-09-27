# Production Guardrails

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

## Automation Expectations
- Introduce new directories and assets in the same pass and wire them into scenes or generators immediately.
- Keep asset metadata embedded, follow palette/outline standards, and compress SVGs with SVGO before check-in.
- Drive scenes from timeline data; avoid stray frame counts or unused files.
- Promote SVG assets with SVGR when granular manipulation is required in React.

## Quality Guardrails
- Use deterministic randomness (e.g., `seededRandom`) for repeatable particle effects.
- Stage transitions via Remotion `Sequence` layering and the circle-wipe overlay.
- Confirm `public/audio/daisy-bell.mp3` exists before rendering final output.
- Prior to export: run `npm run lint`, compress SVGs, execute the performance checklist in `docs/performance-checklist.md`, and record outcomes in `TODO.md`.

## Forward Improvements
- Script timeline generation directly from `docs/animation-timing.md`.
- Automate SVGO and render validation in CI.
- Expand character viseme sets and secondary poses (wave, hat-tip, smile).
- Add Vitest coverage for timeline utilities and emitter math.
