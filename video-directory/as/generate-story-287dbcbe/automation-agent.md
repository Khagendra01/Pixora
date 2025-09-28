# Simple Automation Script

## Core Mission
Generate basic SVG animations from simple stories. Keep it minimal and focused.

## Simple Workflow
1. **Read Story** - Get the basic story elements
2. **Create Assets** - Make simple SVGs (characters, backgrounds, objects)
3. **Animate** - Add basic movement
4. **Export** - Generate final video

## Story Elements (Minimal)
- **Characters**: Who are they? (1-2 main characters max)
- **Setting**: Where does it happen? (1 simple location)
- **Action**: What happens? (1 main action)

## Asset Creation (Simple)
```
assets/
├── character.svg (simple stick figure or basic shape)
├── background.svg (simple scene)
└── object.svg (if needed)
```

## Basic Animation Types
- **Move**: Simple left-to-right movement
- **Fade**: Fade in/out
- **Scale**: Grow/shrink
- **Rotate**: Basic rotation

## Simple Timeline
- **0-30 frames**: Setup
- **30-60 frames**: Main action
- **60-90 frames**: Conclusion

Audio Retrieval
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


## Output
- Single SVG file with animation
- Basic CSS keyframes
- Simple HTML preview

## Quality Check (Minimal)
- [ ] Animation works
- [ ] File size < 50KB
- [ ] No broken links
- [ ] Basic timing looks right


That's it! Keep it simple and focused on the essentials.
