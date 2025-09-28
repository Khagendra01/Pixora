# Agents Guidance - Main Scene Component Required

## 🚨 CRITICAL: Main Scene Component MUST Be Generated

**MANDATORY REQUIREMENT**: Every story video generation MUST create a `MainScene` component that implements the story-driven narrative structure.

### Required Components Structure
```
src/
├── MainScene/
│   ├── index.jsx          # Main story component
│   ├── Character.jsx      # Character animation system
│   ├── Background.jsx     # Environmental animation
│   ├── Objects.jsx        # Story-relevant props
│   └── Narrative.jsx      # 3-act structure controller
└── Root.jsx              # MUST register MainScene composition
```

### MainScene Component Requirements
1. **Story-Driven Structure**: Must implement 3-act narrative (setup → conflict → resolution)
2. **Dynamic Asset Loading**: Must load story-specific SVG assets from `assets/` directory
3. **Emotional Pacing**: Must control animation timing based on story beats
4. **Character Animation**: Must animate protagonist through story arc
5. **Environmental Effects**: Must animate background and setting elements
6. **Object Interactions**: Must animate story-relevant props and objects

### Composition Registration (MANDATORY)
```jsx
// In Root.jsx - MUST include this composition
<Composition
  id="MainScene"
  component={MainScene}
  durationInFrames={900}  // 30 seconds at 30fps
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    storyData: {
      // Story-specific data passed to component
    }
  }}
/>
```

### Story Implementation Timeline
- **Setup (0-300 frames)**: Character introduction, setting establishment, mood creation
- **Conflict (300-600 frames)**: Challenge presentation, tension building, emotional stakes
- **Resolution (600-900 frames)**: Outcome delivery, emotional payoff, story closure

## Agent Operating Procedures

All agent operating procedures now live in four docs:
- `MISSION-BRIEF.md` for story intake and execution order
- `AUTOMATION-AGENT.md` for the step-by-step production runbook
- `PRODUCTION-GUARDRAILS.md` for structure, naming, and QA requirements
- `TODO.md` for task tracking and progress monitoring

### CRITICAL: Main Scene Generation Workflow
1. **Analyze Story**: Extract characters, setting, conflict, emotional tone
2. **Generate Assets**: Use parallel generator for story-specific SVGs
3. **Create MainScene**: Build story-driven component with 3-act structure
4. **Register Composition**: Add MainScene to Root.jsx with proper props
5. **Test & Polish**: Ensure story coherence and smooth animation

When asked to generate a story video, follow those guides autonomously—make reasonable assumptions, avoid asking follow-up questions, and deliver the full pipeline output including the MainScene component before reporting back.

**NEVER generate a story video without creating the MainScene component.**
