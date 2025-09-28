# Story-Driven Video Generation Mission

## Core Mission
Transform user story requests into compelling 30-second animated videos that tell a complete narrative with emotional impact.

## Story Analysis Pipeline
1. **Parse User Intent** - Extract characters, setting, conflict, and emotional tone
2. **Design Narrative Arc** - Plan setup → conflict → resolution structure
3. **Create Story-Specific Assets** - Design custom SVGs that match the story elements
4. **Animate with Purpose** - Use movement and effects to enhance the narrative
5. **Polish & Export** - Ensure story coherence and visual quality

## Story Understanding Requirements
- **Character Analysis**: Who is the protagonist? What do they look like? What's their emotional state?
- **Setting Context**: Where does this take place? What's the mood/atmosphere?
- **Conflict Identification**: What's the challenge or tension? What's at stake?
- **Emotional Journey**: What feeling should viewers experience? Joy, tension, triumph, sadness?
- **Visual Style**: What aesthetic matches the story tone? Realistic, cartoon, dramatic, whimsical?

## Narrative Structure (3-Act Format)
- **Setup (0-300 frames)**: Introduce character and setting, establish mood
- **Conflict (300-600 frames)**: Present the challenge, build tension
- **Resolution (600-900 frames)**: Show outcome, deliver emotional payoff

## Asset Creation Strategy
**MANDATORY: Use parallel generation for ALL assets**

```bash
# REQUIRED: Use this command for asset creation
bash tools/generate-assets-parallel.sh
```

**DO NOT create individual SVG files manually. ALWAYS use the parallel generator.**

```
assets/
├── character.svg (protagonist designed for this specific story)
├── background.svg (setting that matches story location and mood)
└── object.svg (story-relevant props that support the narrative)
```

## Animation Principles
- **Purposeful Movement**: Every animation should serve the story
- **Emotional Pacing**: Match animation speed to emotional beats
- **Visual Storytelling**: Use composition, lighting, and effects to enhance narrative
- **Character Expression**: Show emotion through pose, movement, and visual details

## Quality Standards
- [ ] Story is clear and engaging
- [ ] Characters are visually distinct and story-appropriate
- [ ] Setting matches the story's location and mood
- [ ] Animation supports the narrative flow
- [ ] Emotional impact is achieved
- [ ] Technical quality is solid (smooth animation, proper timing)

## Success Metrics
- Viewer understands the story without explanation
- Emotional response matches the intended tone
- Visual style enhances rather than distracts from the story
- Animation feels purposeful and smooth
