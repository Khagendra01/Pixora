# Simple Production Rules

## Basic Directory Structure
```
assets/
├── character.svg
├── background.svg
└── object.svg (if needed)
```

## Simple Naming
- `character.svg` - Main character
- `background.svg` - Scene background
- `object.svg` - Any objects needed

## Basic Coordinate System
- **Canvas**: 1920x1080 (standard HD)
- **Center**: 960x540
- **Left**: 0-960
- **Right**: 960-1920

## Simple Sizing
- **Characters**: 100x100px (medium size)
- **Backgrounds**: 1920x1080px (full screen)
- **Objects**: 50x50px (small props)

## Basic Animation Rules
- **Move**: Use `transform: translateX()` for smooth movement
- **Fade**: Use `opacity` for fade effects
- **Scale**: Use `transform: scale()` for size changes
- **Rotate**: Use `transform: rotate()` for rotation

## Simple Quality Check
- [ ] Animation works
- [ ] File size < 50KB
- [ ] No broken links
- [ ] Basic timing looks right

## Performance (Minimal)
- Keep animations simple
- Use CSS transforms
- Avoid complex effects
- Test on basic devices

That's it! Keep it simple and focused.
