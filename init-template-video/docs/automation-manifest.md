# Automation Manifest

This manifest defines the production pipeline for generating Remotion videos inside the Pixora automation environment. It locks the execution order, clarifies which phases may fan out to sub-agents, and lists the artifacts and readiness checks required before downstream phases may start. All agents invoked from the CLI **must** follow this contract to keep sequential tasks serialized while letting parallel-safe work run concurrently.

## Pipeline Overview
- **Version:** 1.1.0
- **Execution Model:** Single orchestrator process (CLI) that reads this manifest, then spawns phase-specific sub-agents.
- **Dependency Shape:** Directed acyclic graph. Each phase lists the IDs it depends on. The orchestrator may only launch a phase once all dependencies have reported `status = complete`.
- **Concurrency Rules:** `mode: sequential` phases run exactly one agent at a time. `mode: parallel` phases may fan out to multiple agents in the same dependency layer. Parallel agents share read-only access to upstream artifacts and must write outputs to disjoint paths.

## Phase Definitions

| Phase ID | Label | Mode | Depends On | Primary Outputs |
| --- | --- | --- | --- | --- |
| `story-intake` | Story Intelligence & Brief Sync | sequential | — | `docs/story-overview.md`, `docs/asset-inventory.md`, updated `TODO.md`
| `doc-handoff` | Automation State Broadcast | sequential | `story-intake` | `docs/timeline-grid.md`, `docs/automation-changelog.md`
| `asset-build` | Asset Generation Fan-out | parallel | `doc-handoff` | Production-ready SVGs in `assets/`, registry JSON files in `src/assets/registry/`
| `animation-wiring` | Scene & Composition Wiring | parallel | `asset-build` | Scene files in `src/scenes/`, compositions in `src/compositions/`, consolidated asset registry
| `qa-and-tests` | QA, Lint, and Performance Checks | sequential | `animation-wiring` | QA log in `docs/performance-notes.md`, lint reports, TODO updates
| `render-export` | Final Render & Packaging | sequential | `qa-and-tests` | Exported video(s) under `out/`, distribution notes in `docs/delivery-log.md`

### Phase Responsibilities & Agents

#### `story-intake`
- **Purpose:** Gather latest narrative assets, validate against `MISSION-BRIEF.md`, and produce updated story + asset docs.
- **Agent(s):** Single story-analysis agent.
- **Readiness Check:** `docs/story-overview.md` includes current date stamp, character/scene lists, and beat timing summary.

#### `doc-handoff`
- **Purpose:** Normalize automation state before production phases. Convert story beats into actionable grids and refresh `TODO.md`.
- **Agent(s):** Documentation agent.
- **Readiness Check:** `docs/timeline-grid.md` contains frame/fps mapping; `TODO.md` reflects latest status blocks.

#### `asset-build`
- **Purpose:** Generate or refresh assets in parallel while preserving naming guardrails.
- **Agent(s):** Specialized asset agents (characters, backgrounds, effects).
- **Concurrency Constraint:** Each agent must write to a unique subdirectory inside `assets/` and emit a registry JSON file under `src/assets/registry/`.
- **Readiness Check:** Generated assets valid SVGs with metadata; registry diffs recorded in `docs/automation-changelog.md`.

#### `animation-wiring`
- **Purpose:** Wire assets into Remotion scenes/compositions.
- **Agent(s):** Scene-specific agents operating on disjoint files plus a registry consolidator.
- **Readiness Check:** `src/compositions/*` and `src/scenes/*` lint clean; consolidated asset registry `src/assets/assetRegistry.ts` generated.

#### `qa-and-tests`
- **Purpose:** Serialize QA so lint/tests run once and coverage is captured.
- **Agent(s):** QA agent executes `npm run lint`, compression checks, and performance checklist updates.
- **Readiness Check:** QA outcomes logged in `docs/performance-notes.md` plus TODO updates.

#### `render-export`
- **Purpose:** Bundling, rendering, and packaging outputs.
- **Agent(s):** Render agent.
- **Readiness Check:** Bundle cache verified, render output stored under `out/`, delivery log updated.

## Machine-readable Specification

Orchestrators can consume the JSON block below to automate execution. Each agent entry includes the command to run and the artifacts it must produce or touch. Commands are relative to repository root.

<!-- PIPELINE-SPEC-JSON:START -->
```json
{
  "version": "1.1.0",
  "phases": [
    {
      "id": "story-intake",
      "label": "Story Intelligence & Brief Sync",
      "mode": "sequential",
      "dependsOn": [],
      "agents": [
        {
          "id": "story-intake-agent",
          "command": "node automation/orchestrator.js agent story-intake",
          "expectedArtifacts": [
            "docs/story-overview.md",
            "docs/asset-inventory.md",
            "TODO.md"
          ],
          "checks": [
            "docs/story-overview.md contains '## Timeline' section",
            "TODO.md entry added under ✅ COMPLETED TASKS"
          ]
        }
      ]
    },
    {
      "id": "doc-handoff",
      "label": "Automation State Broadcast",
      "mode": "sequential",
      "dependsOn": ["story-intake"],
      "agents": [
        {
          "id": "doc-sync-agent",
          "command": "node automation/orchestrator.js agent doc-handoff",
          "expectedArtifacts": [
            "docs/timeline-grid.md",
            "docs/automation-changelog.md",
            "TODO.md"
          ],
          "checks": [
            "docs/timeline-grid.md lists fps and frame ranges",
            "TODO.md sections align with MISSION-BRIEF template"
          ]
        }
      ]
    },
    {
      "id": "asset-build",
      "label": "Asset Generation Fan-out",
      "mode": "parallel",
      "dependsOn": ["doc-handoff"],
      "agents": [
        {
          "id": "asset-character",
          "command": "node automation/orchestrator.js agent asset-character",
          "expectedArtifacts": [
            "assets/characters/main/character-main-hero-192x192.svg",
            "src/assets/registry/characters.json"
          ],
          "checks": [
            "SVG compressed-friendly and includes <metadata>",
            "Registry entries include role and palette metadata"
          ]
        },
        {
          "id": "asset-background",
          "command": "node automation/orchestrator.js agent asset-background",
          "expectedArtifacts": [
            "assets/backgrounds/abstract/background-abstract-wave-1920x1080.svg",
            "src/assets/registry/backgrounds.json"
          ],
          "checks": [
            "Colour palette matches docs/design brief"
          ]
        },
        {
          "id": "asset-effects",
          "command": "node automation/orchestrator.js agent asset-effects",
          "expectedArtifacts": [
            "assets/effects/particles/effect-particle-sparkle-64x64.svg",
            "src/assets/registry/effects.json"
          ],
          "checks": [
            "Effects tagged with seeded randomness"
          ]
        }
      ]
    },
    {
      "id": "animation-wiring",
      "label": "Scene & Composition Wiring",
      "mode": "parallel",
      "dependsOn": ["asset-build"],
      "agents": [
        {
          "id": "asset-registry-merge",
          "command": "node automation/orchestrator.js agent asset-registry-merge",
          "expectedArtifacts": [
            "src/assets/assetRegistry.js"
          ],
          "checks": [
            "Exports registry with category keys"
          ]
        },
        {
          "id": "scene-main",
          "command": "node automation/orchestrator.js agent scene-main",
          "expectedArtifacts": [
            "src/scenes/scene-main.jsx",
            "src/compositions/main.jsx"
          ],
          "checks": [
            "Imports assets via consolidated registry",
            "Uses canonical timeline utilities"
          ]
        },
        {
          "id": "scene-alt",
          "command": "node automation/orchestrator.js agent scene-alt",
          "expectedArtifacts": [
            "src/scenes/scene-alt.jsx"
          ],
          "checks": [
            "No hard-coded frame counts"
          ]
        }
      ]
    },
    {
      "id": "qa-and-tests",
      "label": "QA, Lint, and Performance Checks",
      "mode": "sequential",
      "dependsOn": ["animation-wiring"],
      "agents": [
        {
          "id": "qa-agent",
          "command": "node automation/orchestrator.js agent qa",
          "expectedArtifacts": [
            "docs/performance-notes.md",
            "TODO.md"
          ],
          "checks": [
            "npm run lint passes",
            "Performance checklist updated"
          ]
        }
      ]
    },
    {
      "id": "render-export",
      "label": "Final Render & Packaging",
      "mode": "sequential",
      "dependsOn": ["qa-and-tests"],
      "agents": [
        {
          "id": "render-agent",
          "command": "node automation/orchestrator.js agent render",
          "expectedArtifacts": [
            "build/index.html",
            "docs/delivery-log.md"
          ],
          "checks": [
            "Bundle output documented with cache location"
          ]
        }
      ]
    }
  ]
}
```
<!-- PIPELINE-SPEC-JSON:END -->

## Orchestrator Expectations
1. Read this manifest at startup.
2. Validate that all `expectedArtifacts` paths from prerequisites exist before launching the next phase.
3. For `mode: parallel`, launch each agent listed under the phase concurrently and wait for all to succeed before emitting the completion event.
4. Update `TODO.md` after each phase with progress notes and blockers.
5. Abort immediately if any readiness check fails, leaving breadcrumbs in `docs/automation-changelog.md` for manual investigation.

Keep this manifest in sync with `MISSION-BRIEF.md`, `AUTOMATION-AGENT.md`, and `PRODUCTION-GUARDRAILS.md`. Any structural change to the pipeline must bump the `version` and be documented in `docs/automation-changelog.md`.

## Chat Prompt Integration
- The frontend handler should call `node automation/processPrompt.js --prompt "<user-message>"` (or pass `--data` JSON) to write the narrative docs and trigger `orchestrator.js run` in one step.
- Each invocation logs the raw payload under `docs/chat-prompts/` and refreshes story docs before the pipeline executes.
