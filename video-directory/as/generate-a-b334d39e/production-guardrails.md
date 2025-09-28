# Story Quality Production Standards

## Directory Structure
```
assets/
├── character.svg (story-specific protagonist design)
├── background.svg (mood-appropriate setting)
└── object.svg (narrative-supporting props)
```

## Story Quality Standards

### Character Design Requirements
- **Story-Specific**: Character must match the specific story being told
- **Emotional Expression**: Show the character's emotional state through design
- **Age-Appropriate**: Design matches the character's age and role
- **Visual Coherence**: Style and colors support the story's tone
- **Narrative Function**: Every design element serves the story

### Background Design Requirements
- **Location Accuracy**: Setting must match the story's specific location
- **Mood Establishment**: Colors, lighting, and atmosphere support the emotional tone
- **Scale Appropriateness**: Proper perspective and proportions
- **Environmental Details**: Include elements that enhance the narrative
- **Visual Style**: Aesthetic matches the story's genre and tone

### Object/Prop Design Requirements
- **Narrative Relevance**: Every object must support the story
- **Contextual Appropriateness**: Design matches the story's setting and time period
- **Functional Design**: Objects should look like they serve their story purpose
- **Visual Consistency**: Style matches characters and background
- **Story Integration**: Props enhance rather than distract from the narrative

## Technical Specifications
- **Canvas**: 1920x1080 (HD standard)
- **Center Point**: 960x540
- **Character Size**: 120-200px (adjustable based on story needs)
- **Background**: Full 1920x1080px coverage
- **Objects**: 40-100px (proportional to story context)

## Animation Quality Standards
- **Purposeful Movement**: Every animation serves the story
- **Emotional Timing**: Animation speed matches emotional beats
- **Smooth Transitions**: Use easing functions for natural movement
- **Visual Coherence**: All elements move in harmony
- **Narrative Flow**: Animation supports the 3-act structure

## Story Coherence Checklist
- [ ] Character design matches the story's protagonist
- [ ] Setting accurately represents the story's location
- [ ] Objects/props support the narrative
- [ ] Animation timing supports the emotional arc
- [ ] Visual style is consistent throughout
- [ ] Story is clear without explanation
- [ ] Emotional impact is achieved
- [ ] Technical quality is solid

## Performance Standards
- **File Size**: Keep individual SVGs under 10KB
- **Animation Smoothness**: 30fps with proper easing
- **Loading Speed**: Optimize for quick rendering
- **Cross-Platform**: Test on various devices
- **Accessibility**: Ensure visual clarity and contrast

## MANDATORY: Parallel Asset Generation
**CRITICAL: You MUST use parallel generation for ALL assets**

```bash
# REQUIRED: Use this command for asset creation
bash tools/force-parallel-assets.sh
```

**FORBIDDEN:**
- ❌ Individual `cat` commands for SVG creation
- ❌ Sequential asset generation
- ❌ Manual SVG file creation

**ONLY ALLOWED:**
- ✅ `bash tools/force-parallel-assets.sh`
- ✅ `bash tools/generate-assets-parallel.sh`

## Quality Assurance Process
1. **Parallel Generation**: Use `bash tools/force-parallel-assets.sh` for ALL assets
2. **Story Analysis**: Verify all elements match the user's request
3. **Visual Coherence**: Check that all assets work together
4. **Animation Testing**: Ensure smooth, purposeful movement
5. **Narrative Flow**: Confirm the 3-act structure works
6. **Technical Validation**: Test rendering and performance
7. **Final Review**: Ensure story is engaging and clear
