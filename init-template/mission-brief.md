# Mission Brief

## Mission Refresh
Deliver fully automated, story-driven SVG/Remotion animations while staying agile enough to support any narrative style or production scope. Work in narrative-first order (story ➝ docs ➝ assets ➝ code ➝ QA). Never leave placeholder directories—every path must either contain production-ready assets or generators that are referenced in code.

Our core mission: understand the current story, translate it into purposeful motion design, and keep coordinate systems and assets consistent so scenes can scale from simple vignettes to complex set pieces.

## Pipeline Snapshot
1. **Story Intelligence** – Gather the latest story outline and beat timing artifacts stored under `docs/` (story overview, beat sheet, timing grids, script snippets). Create them if they do not exist yet.
2. **Task Control** – Maintain `TODO.md` after every automation pass; reflect real progress, blockers, and next actions so humans can rejoin the loop at any time.
3. **Design Specs** – Capture palette decisions, rig layers, and coordinate matrices in the relevant briefs inside `docs/` (create fresh briefs when the project scope changes).
4. **Asset Generation** – Populate `assets/` with usable SVGs only. Each asset must include metadata, align to shared palettes, and be wired into the runtime registry (e.g., `src/assets/assetUrls.*`).
5. **Animation Wiring** – Build scenes (`src/scenes/*`) and compositions (`src/compositions/*`) so they import assets through the registry and follow the canonical timeline utilities in `src/timelines/`.
6. **Performance & QA** – Run linting, SVG optimisation, and the QA checklist defined in `docs/`; log outcomes in `TODO.md` with links to the artefacts you touched.

## Story Intake Protocol
### Story Element Checklist
Capture the narrative scope before touching assets. Adjust the depth of detail to match the scene complexity—minimalist scenes may only need a paragraph, while set pieces demand granular action beats.

```
Read the story and identify:
- All characters (main, supporting, background)
- All scenes/locations
- All objects and props
- All actions/movements needed
- Timeline of events
```

### Asset Inventory Blueprint
Document required production pieces as soon as they surface. Omit categories that the story does not need yet, but leave room to expand quickly when new beats arrive:

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
1. **FIRST**: Analyze the available story artefacts and capture the asset inventory.
2. **SECOND**: Confirm the folder structure and naming conventions required for the current project.
3. **THIRD**: Design or update coordinate and scaling systems.
4. **FOURTH**: Create static assets (characters, backgrounds, UI elements) at the fidelity the story calls for.
5. **FIFTH**: Layer in dynamic animation (motion cycles, state changes, camera moves).
6. **SIXTH**: Compose complete scenes and assemble the master composition.
7. **SEVENTH**: Optimise and test performance.
8. **EIGHTH**: Generate final output and documentation bundles.

Tailor pacing guidance to the audio and story beats at hand—action sequences require tight pose changes, while contemplative moments may lean on subtle motion or even still frames.

Refer to `AUTOMATION-AGENT.md` for the hands-on runbook and `PRODUCTION-GUARDRAILS.md` for structural limits, coordinate matrices, and QA thresholds.
