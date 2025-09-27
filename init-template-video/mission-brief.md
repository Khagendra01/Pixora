# Mission Brief

## Mission Refresh
Ship fully automated, story-driven SVG/Remotion animations. Work in narrative-first order (story ➝ docs ➝ assets ➝ code ➝ QA). Never leave placeholder directories—every path must contain production-ready assets or generators referenced in code.

Our core mission: analyze stories and translate them into dynamic SVG animations with believable character movement, intentional scene composition, and consistent coordinate systems for video generation.

## Pipeline Snapshot
1. **Story Intelligence** – Author the narrative bible (`docs/daisy-bell-story.md`) and beat timing sheet (`docs/animation-timing.md`).
2. **Task Control** – Maintain `TODO.md` after every automation pass; reflect real progress, blockers, and next actions.
3. **Design Specs** – Palette, rig layers, coordinate matrix live in `docs/static-asset-brief.md` and `docs/coordinate-scaling-guide.md`.
4. **Asset Generation** – Populate `assets/` with usable SVGs only. Each asset must have metadata, align to the palette, and be wired via `src/assets/assetUrls.js`.
5. **Animation Wiring** – Scenes (`src/scenes/*`) and composition (`src/compositions/DaisyBell.jsx`) must import assets through the registry and honour `src/timelines/daisy-bell.js` + `src/utils/timeline.js`.
6. **Performance & QA** – Run lint, SVGO compression, and the checklist in `docs/performance-checklist.md`; log results in `TODO.md`.

## Story Intake Protocol
### Story Element Checklist
Capture the full narrative scope before touching assets:

```
Read the story and identify:
- All characters (main, supporting, background)
- All scenes/locations
- All objects and props
- All actions/movements needed
- Timeline of events
```

### Asset Inventory Blueprint
Document required production pieces as soon as they surface:

```
CHARACTERS NEEDED:
- [Character Name]: [Description, role, key actions]
- [Character Name]: [Description, role, key actions]

SCENES NEEDED:
- [Scene Name]: [Description, setting, mood]
- [Scene Name]: [Description, setting, mood]

OBJECTS NEEDED:
- [Object Name]: [Description, usage, movement]
- [Object Name]: [Description, usage, movement]

DYNAMIC ACTIONS:
- [Character] walking: [Start position] → [End position]
- [Character] talking: [Mouth movement, gestures]
- [Object] moving: [Animation type, path]
```

### TODO.md Tracking Blueprint
Create and maintain `TODO.md` using the shared structure so every automation pass has the same source of truth:

```
# Dynamic SVG Animation Project TODO
## ✅ COMPLETED TASKS
## 🔄 IN PROGRESS
## 📋 PENDING TASKS
## 🎯 PRIORITY ORDER
## 📊 PROGRESS TRACKING
## 🔧 TECHNICAL REQUIREMENTS
## 📝 NOTES
```

Record progress, blockers, metrics, and QA outcomes under the relevant headings each time the automation agent runs.

## Execution Ladder
1. **FIRST**: Analyze the story and create the asset inventory.
2. **SECOND**: Set up the folder structure and naming conventions.
3. **THIRD**: Design coordinate and scaling systems.
4. **FOURTH**: Create static assets (characters, backgrounds).
5. **FIFTH**: Add dynamic animations (walking, talking).
6. **SIXTH**: Compose complete scenes.
7. **SEVENTH**: Optimize and test performance.
8. **EIGHTH**: Generate final output and documentation.

Refer to `automation-agent.md` for the hands-on runbook and `production-guardrails.md` for structural limits, coordinate matrices, and QA thresholds.
