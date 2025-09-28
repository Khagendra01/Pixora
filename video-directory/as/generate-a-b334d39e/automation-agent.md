# Story-Driven Video Production Agent

## 🚨 CRITICAL INSTRUCTION - READ FIRST 🚨
**MANDATORY: You MUST use the parallel SVG generator for ALL asset creation**

**REQUIRED COMMAND:**
```bash
# Primary method (recommended) - Handles SVG + Audio in parallel
bash tools/force-parallel-assets.sh

# Alternative methods
bash tools/generate-assets-parallel.sh  # SVG only
bash tools/parallel-audio-generator.sh  # Audio only
```

**FORBIDDEN ACTIONS:**
- ❌ Creating individual SVG files with `cat` commands
- ❌ Sequential asset generation
- ❌ Manual SVG file creation
- ❌ Manual audio file downloads
- ❌ Individual curl commands for audio

**ONLY ALLOWED:**
- ✅ Using `bash tools/force-parallel-assets.sh` (SVG + Audio)
- ✅ Using `bash tools/generate-assets-parallel.sh` (SVG only)
- ✅ Using `bash tools/parallel-audio-generator.sh` (Audio only)
- ✅ Using `node tools/parallel-svg-generator.js` (SVG only)

## Core Mission
Transform user story requests into emotionally engaging 30-second animated videos through careful story analysis and custom asset creation.

## Story Analysis Workflow
1. **Parse User Request** - Extract key story elements and emotional intent
2. **Design Narrative Arc** - Plan the 3-act structure with clear emotional beats
3. **Create Story-Specific Assets** - **MUST USE PARALLEL GENERATION** (see below)
4. **Animate with Purpose** - Use movement and effects to enhance the narrative
5. **Polish & Export** - Ensure story coherence and visual quality

## CRITICAL: MANDATORY PARALLEL ASSET GENERATION
**YOU MUST USE THE PARALLEL GENERATOR - NO EXCEPTIONS**

When creating assets, you MUST execute this command:
```bash
bash tools/generate-assets-parallel.sh
```

**DO NOT** create individual SVG files manually. **DO NOT** use individual `cat` commands for each asset. **ALWAYS** use the parallel generator script.

## Story Analysis Framework
### Character Analysis
- **Who**: Identify the protagonist(s) - age, appearance, personality traits
- **Emotional State**: What are they feeling? Confident, scared, determined, joyful?
- **Visual Design**: What clothing, accessories, or features define them?
- **Character Arc**: How do they change through the story?

### Setting Analysis
- **Where**: Specific location that matches the story
- **Mood**: What atmosphere should the setting convey?
- **Visual Style**: Realistic, cartoon, dramatic, whimsical?
- **Details**: What environmental elements support the story?

### Conflict & Resolution
- **Challenge**: What obstacle or problem does the character face?
- **Stakes**: What's at risk? What do they want to achieve?
- **Resolution**: How does it end? What's the emotional payoff?

## Parallel Asset Creation Strategy

### Efficient SVG Generation
Use the parallel SVG generator for faster asset creation:

```bash
# Generate all assets simultaneously
node tools/parallel-svg-generator.js
```

### Character Design (Parallel)
- Design specifically for the story's protagonist
- Include age-appropriate features, clothing, and accessories
- Show emotional state through pose and expression
- Use colors and style that match the story tone
- **Generate in parallel with background and objects**

### Background Design (Parallel)
- Create a setting that matches the story's location
- Establish mood through lighting, colors, and atmosphere
- Include environmental details that support the narrative
- Ensure proper scale and perspective
- **Generate simultaneously with character and objects**

### Object/Prop Design (Parallel)
- Include story-relevant items that support the narrative
- Design for the specific story context, not generic templates
- Consider how objects will be used in the animation
- Match the visual style of characters and background
- **Generate concurrently with other assets**

## Animation Principles
### Purposeful Movement
- Every animation should serve the story
- Character movement should reflect their emotional state
- Environmental effects should enhance the mood
- Transitions should feel natural and meaningful

### Emotional Pacing
- Match animation speed to emotional beats
- Use slow, deliberate movement for emotional moments
- Use quick, dynamic movement for action sequences
- Build tension through timing and rhythm

### Visual Storytelling
- Use composition to guide the viewer's eye
- Apply lighting and color to enhance mood
- Include visual effects that support the narrative
- Ensure every element contributes to the story

## Timeline Structure
- **Setup (0-300 frames)**: Introduce character and setting, establish mood and stakes
- **Conflict (300-600 frames)**: Present the challenge, build tension and emotion
- **Resolution (600-900 frames)**: Show outcome, deliver emotional payoff and closure

## Parallel SVG Generation Workflow

### Step 1: Story Analysis
```bash
# Analyze the user's story request
echo "Analyzing story: [USER_REQUEST]"
```

### Step 2: Dynamic Parallel Asset Generation with Codex
```bash
# Create assets directory
mkdir -p assets

# Method 1: Use the simplified generator script (RECOMMENDED)
bash tools/generate-assets-parallel.sh

# Method 2: Use Node.js simplified generator
node tools/parallel-svg-generator.js

# Method 3: Single powerful codex command (SIMPLIFIED & RECOMMENDED)
# Generate ALL assets with one powerful codex command
codex exec --dangerously-bypass-approvals-and-sandbox --sandbox=workspace-write --json \
  "Generate ALL SVG assets needed for this story in one go. Create background.svg, character.svg, character-2.svg, object.svg, vehicle.svg, and any other assets the story requires. Each file should be a complete, well-designed SVG that fits the story's visual style and narrative. Save each as a separate file in the assets/ directory."
```

### Step 3: Verify Generation
```bash
# Check all assets were created successfully
ls -la assets/
echo "Generated $(ls assets/*.svg | wc -l) SVG files"
```

## Audio Generation
**AUDIO IS NOW HANDLED BY PARALLEL GENERATOR**

Audio files are automatically generated in parallel with SVG assets using:
```bash
bash tools/parallel-audio-generator.sh
```

**DO NOT** manually download audio files. The parallel generator handles all audio retrieval automatically.

### Component Registration
```jsx

<Composition
  id="GeneratedVideo"
  component={GeneratedVideo}
  durationInFrames={900}   ....    // 30 seconds at 30fps

## Quality Check (Minimal)
- [ ] Animation works
- [ ] No broken links
- [ ] Basic timing looks right
- [ ] Asset imports use correct paths (../../assets/)
- [ ] GeneratedVideo composition is properly registered


That's it! Keep it simple and focused on the essentials.
