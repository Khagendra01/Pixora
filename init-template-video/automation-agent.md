# Automation Agent Handbook

## Story & Task Intake
- Review the latest narrative artifacts (`docs/daisy-bell-story.md`, `docs/animation-timing.md`) before starting automation.
- Follow the story intake and TODO blueprint in `MISSION-BRIEF.md` to capture characters, scenes, props, and dynamic actions.
- Keep `TODO.md` authoritative—promote every new task, blocker, and metric update there before moving on to implementation.

## Animation Planning Toolkit
### Character Motion Reference
```
WALKING ANIMATION:
- Leg movement: [Left leg forward] ↔ [Right leg forward]
- Arm swing: [Left arm back] ↔ [Right arm back]
- Body bounce: [Up position] ↔ [Down position]
- Head bob: [Slight up/down movement]

TALKING ANIMATION:
- Mouth shapes: [Closed] → [Open] → [Closed]
- Eye movement: [Blink cycles]
- Head gestures: [Nod, shake, tilt]
- Hand gestures: [Pointing, waving]
```

### Object Motion Library
```
MOVEMENT TYPES:
- Linear: [Start] → [End] (straight line)
- Curved: [Start] → [Curve] → [End]
- Bouncing: [Start] → [Bounce] → [End]
- Floating: [Up] ↔ [Down] (continuous)
- Rotating: [0°] → [360°] (continuous)
```

## Asset & Timeline Wiring
- Register each SVG once in `src/assets/assetUrls.js`; scenes must import assets through this registry.
- Keep scenes (`src/scenes/*`) and compositions (`src/compositions/DaisyBell.jsx`) driven by the timeline (`src/timelines/daisy-bell.js` + `src/utils/timeline.js`); avoid hard-coded frame counts elsewhere.
- Embed `<metadata>` blocks in SVGs (title/author/version) and align colours with `docs/static-asset-brief.md`.
- Use `<symbol>` and inline keyframes for reusable motion fragments needed downstream.

## Implementation Cookbook
### Walking Rig Skeleton
```svg
<svg class="character-walking">
  <g class="body">
    <g class="head">
      <!-- Head with eyes, mouth -->
    </g>
    <g class="torso">
      <!-- Body, arms -->
    </g>
    <g class="legs">
      <g class="left-leg">
        <!-- Left leg with knee, foot -->
      </g>
      <g class="right-leg">
        <!-- Right leg with knee, foot -->
      </g>
    </g>
  </g>
</svg>
```

### Keyframe Baselines
```css
@keyframes walk-cycle {
  0% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(10px) rotate(2deg); }
  50% { transform: translateX(20px) rotate(0deg); }
  75% { transform: translateX(30px) rotate(-2deg); }
  100% { transform: translateX(40px) rotate(0deg); }
}

@keyframes leg-swing {
  0% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
  100% { transform: rotate(-15deg); }
}
```

### Scene Composition Flow
```
1. Background layer (static)
2. Mid-ground elements (slight movement)
3. Character layer (main animations)
4. Foreground elements (overlay)
5. Effects layer (particles, lighting)
6. UI layer (text, controls)
```

### Camera Move Palette
```
- Static: Fixed position
- Pan: Horizontal movement
- Tilt: Vertical movement
- Zoom: Scale in/out
- Follow: Track character movement
- Dolly: Move forward/backward
```

## Output Pipeline
### File Organization Baseline
```
scenes/
├── scene-01-composition.svg
├── scene-02-composition.svg
└── scene-03-composition.svg

animations/
├── character-walking.svg
├── character-talking.svg
└── object-moving.svg

assets/
├── characters/
├── backgrounds/
└── objects/
```

### Documentation Packet
```
REQUIRED DOCS:
- Story breakdown document
- Asset inventory list
- Animation specifications
- Coordinate system guide
- Performance notes
- Usage instructions
```

## Audio Retrieval
- Call `https://myinstants-api.vercel.app/search?q=daisybell` to fetch clip metadata.
- Expected response shape:
  ```json
  {
    "status": "200",
    "author": "abdiputranar",
    "data": [
      {
        "id": "daisybell-1623",
        "title": "daisybell",
        "url": "https://www.myinstants.com/en/instant/daisybell-1623",
        "mp3": "https://www.myinstants.com/media/sounds/daisybell_1IYie7z.mp3"
      }
    ]
  }
  ```
- Read the first `data` entry, grab the `mp3` URL, and download the binary.
- Save the file as `public/audio/daisy-bell.mp3` (create `public/audio/` if it is missing).
- Example command:
  ```bash
  curl -s "https://myinstants-api.vercel.app/search?q=daisybell" \
    | jq -r '.data[0].mp3' \
    | xargs -I {} curl -L "{}" -o public/audio/daisy-bell.mp3
  ```
- Verify the download (`ls -lh public/audio/daisy-bell.mp3`) and ensure the Remotion player references this path before rendering.

## Task Reporting & QA
- Update `TODO.md` after each automation pass with progress, blockers, and next actions using the shared template from `MISSION-BRIEF.md`.
- Run `npm run lint`, execute SVGO compression for new/updated SVGs, and complete the checklist in `docs/performance-checklist.md` before export.
- Log QA outcomes in `TODO.md` and cross-link any relevant docs or assets.
- For non-200 API responses or flaky downloads, retry with exponential backoff and capture notes for follow-up.

Remember: focus on natural movement, proper scaling, and smooth animations that bring the story to life.
