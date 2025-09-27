# Automation Agent Handbook

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

## Asset & Timeline Wiring
- Register each SVG once in `src/assets/assetUrls.js`; scenes must import assets through this registry.
- Keep scenes (`src/scenes/*`) and compositions (`src/compositions/DaisyBell.jsx`) driven by the timeline (`src/timelines/daisy-bell.js` + `src/utils/timeline.js`); avoid hard-coded frame counts elsewhere.
- Embed `<metadata>` blocks in SVGs (title/author/version) and align colours with `docs/static-asset-brief.md`.
- Use `<symbol>` and inline keyframes for reusable motion fragments needed downstream.

## Task Reporting & QA
- Update `TODO.md` after each automation pass with progress, blockers, and next actions.
- Run `npm run lint`, execute SVGO compression for new/updated SVGs, and complete the checklist in `docs/performance-checklist.md` before export.
- Log QA outcomes in `TODO.md` and cross-link any relevant docs or assets.
- For non-200 API responses or flaky downloads, retry with exponential backoff and capture notes for follow-up.
