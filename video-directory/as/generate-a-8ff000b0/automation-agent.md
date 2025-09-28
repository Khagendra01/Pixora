# Simple Automation Script

## Core Mission
Generate basic SVG animations from simple stories. Keep it minimal and focused.

## Simple Workflow
1. **Read Story** - Get the basic story elements
2. **Create Assets** - Make simple SVGs (characters, backgrounds, objects)
3. **Create Composition** - Add to src/Root.jsx for preview
4. **Start Dev Server** - Run `npm run dev` to preview
5. **Animate** - Add basic movement
6. **Export** - Generate final video

## Story Elements (Minimal)
- **Characters**: Who are they? (1-2 main characters max)
- **Setting**: Where does it happen? (1 simple location)
- **Action**: What happens? (1 main action)

## Asset Creation (Simple)
```
public/assets/
├── character.svg (simple stick figure or basic shape)
├── background.svg (simple scene)
└── object.svg (if needed)
```

## Composition Setup
- Create your component in `src/` directory
- Add composition to `src/Root.jsx`:
```jsx
import { YourComponent } from "./YourComponent";

// Add to RemotionRoot:
<Composition
  id="YourStory"
  component={YourComponent}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{}}
/>
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

## Development & Preview
- Run `npm run dev` to start Remotion studio
- Access studio at http://localhost:3001
- Select your composition from sidebar
- Preview and adjust animations
- Use Remotion studio tools for rendering

## Output
- Remotion composition ready for preview
- Assets in public/assets/ directory
- Composition registered in src/Root.jsx
- Studio accessible for rendering

## Quality Check (Minimal)
- [ ] Composition added to src/Root.jsx
- [ ] Assets placed in public/assets/
- [ ] `npm run dev` starts successfully
- [ ] Composition visible in Remotion studio sidebar
- [ ] Animation works in preview
- [ ] File size < 50KB
- [ ] No broken links
- [ ] Basic timing looks right

That's it! Keep it simple and focused on the essentials.
