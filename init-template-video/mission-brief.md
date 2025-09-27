# Mission Brief

## Mission Refresh
Ship fully automated, story-driven SVG/Remotion animations. Work in narrative-first order (story ➝ docs ➝ assets ➝ code ➝ QA). Never leave placeholder directories—every path must contain production-ready assets or generators referenced in code.

## Pipeline Snapshot
1. **Story Intelligence** – Author the narrative bible (`docs/daisy-bell-story.md`) and beat timing sheet (`docs/animation-timing.md`).
2. **Task Control** – Maintain `TODO.md` after every automation pass; reflect real progress, blockers, and next actions.
3. **Design Specs** – Palette, rig layers, coordinate matrix live in `docs/static-asset-brief.md` and `docs/coordinate-scaling-guide.md`.
4. **Asset Generation** – Populate `assets/` with usable SVGs only. Each asset must have metadata, align to the palette, and be wired via `src/assets/assetUrls.js`.
5. **Animation Wiring** – Scenes (`src/scenes/*`) and composition (`src/compositions/DaisyBell.jsx`) must import assets through the registry and honour `src/timelines/daisy-bell.js` + `src/utils/timeline.js`.
6. **Performance & QA** – Run lint, SVGO compression, and the checklist in `docs/performance-checklist.md`; log results in `TODO.md`.

Refer to `automation-agent.md` for hands-on runbooks and `production-guardrails.md` for detailed constraints and inventories.
