# Dynamic SVG Animation Agent Instructions

## Core Mission
Analyze stories and create dynamic SVG animations with proper character movement, scene composition, and coordinate systems for video generation.

## Step 1: Story Analysis & Breakdown

### 1.1 Extract Story Elements
```
TASK: Read the story and identify:
- All characters (main, supporting, background)
- All scenes/locations 
- All objects and props
- All actions/movements needed
- Timeline of events
```

### 1.2 Create Asset Inventory
```
CHARACTERS NEEDED:
- [Character Name]: [Description, role, key actions]
- [Character Name]: [Description, role, key actions]

SCENES NEEDED:
- [Scene Name]: [Description, setting, mood]
- [Scene Name]: [Description, setting, mood]

OBJECTS NEEDED:
- [Object Name]: [Description, usage, movement]
- [Object Name]: [Description, usage, movement]

DYNAMIC ACTIONS:
- [Character] walking: [Start position] → [End position]
- [Character] talking: [Mouth movement, gestures]
- [Object] moving: [Animation type, path]
```

### 1.3 Create TODO.md Tracking System
```
TASK: Create a comprehensive TODO.md file with:
- All identified tasks from story analysis
- Progress tracking with checkboxes
- Priority order for implementation
- Technical requirements and specifications
- File structure and naming conventions
- Coordinate system details
- Scaling system specifications
- Performance targets and quality checklist

FORMAT:
# Dynamic SVG Animation Project TODO
## ✅ COMPLETED TASKS
## 🔄 IN PROGRESS  
## 📋 PENDING TASKS
## 🎯 PRIORITY ORDER
## 📊 PROGRESS TRACKING
## 🔧 TECHNICAL REQUIREMENTS
## 📝 NOTES
```

## Step 2: Folder Structure Creation

### 2.1 Create Asset Directories
```
assets/
├── backgrounds/          # Scene backgrounds
│   ├── indoor/
│   ├── outdoor/
│   └── abstract/
├── characters/           # All characters
│   ├── main/
│   ├── supporting/
│   └── background/
├── objects/              # Props and items
│   ├── furniture/
│   ├── tools/
│   └── decorative/
├── effects/              # Visual effects
│   ├── particles/
│   ├── lighting/
│   └── transitions/
├── animations/           # Animation definitions
│   ├── walking/
│   ├── talking/
│   └── object-movement/
└── scenes/               # Complete scene compositions
    ├── scene-01/
    ├── scene-02/
    └── scene-03/
```

### 2.2 File Naming Convention
```
[category]-[name]-[variant]-[size].svg
Examples:
- character-main-hero-idle-24x24.svg
- background-forest-day-1920x1080.svg
- object-sword-shining-32x32.svg
- animation-walking-cycle-48x48.svg
```

## Step 3: Dynamic Animation Planning

### 3.1 Character Movement Analysis
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

### 3.2 Object Animation Types
```
MOVEMENT TYPES:
- Linear: [Start] → [End] (straight line)
- Curved: [Start] → [Curve] → [End]
- Bouncing: [Start] → [Bounce] → [End]
- Floating: [Up] ↔ [Down] (continuous)
- Rotating: [0°] → [360°] (continuous)
```

## Step 4: Coordinate System Design

### 4.1 Scene Matrix System
```
COORDINATE GRID (1920x1080 base):
- X-axis: 0-1920 (left to right)
- Y-axis: 0-1080 (top to bottom)
- Z-axis: 0-100 (depth layers)

DEPTH LAYERS:
- Background: Z=0-20
- Mid-ground: Z=21-60  
- Foreground: Z=61-80
- UI/Overlay: Z=81-100
```

### 4.2 Character Positioning
```
CHARACTER POSITIONS:
- Far left: X=100-300
- Left: X=300-600
- Center-left: X=600-900
- Center: X=900-1020
- Center-right: X=1020-1320
- Right: X=1320-1620
- Far right: X=1620-1820

HEIGHT LEVELS:
- Ground: Y=800-1080
- Seated: Y=600-800
- Standing: Y=400-600
- Elevated: Y=200-400
- Flying: Y=0-200
```

## Step 5: Scaling System for Depth

### 5.1 Distance-Based Scaling
```
SCALE FACTORS:
- Far background: 0.3-0.5x
- Background: 0.5-0.7x
- Mid-ground: 0.7-0.9x
- Foreground: 1.0x (base size)
- Close-up: 1.2-1.5x
- Extreme close-up: 1.5-2.0x
```

### 5.2 Size Categories
```
CHARACTER SIZES:
- Tiny (far): 24x24px
- Small (background): 48x48px
- Medium (mid-ground): 96x96px
- Large (foreground): 192x192px
- Huge (close-up): 384x384px

OBJECT SIZES:
- Tiny: 16x16px
- Small: 32x32px
- Medium: 64x64px
- Large: 128x128px
- Huge: 256x256px
```

## Step 6: Animation Implementation

### 6.1 Walking Animation Structure
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

### 6.2 Animation Keyframes
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

## Step 7: Scene Composition

### 7.1 Scene Assembly
```
SCENE STRUCTURE:
1. Background layer (static)
2. Mid-ground elements (slight movement)
3. Character layer (main animations)
4. Foreground elements (overlay)
5. Effects layer (particles, lighting)
6. UI layer (text, controls)
```

### 7.2 Camera Movement
```
CAMERA TYPES:
- Static: Fixed position
- Pan: Horizontal movement
- Tilt: Vertical movement
- Zoom: Scale in/out
- Follow: Track character movement
- Dolly: Move forward/backward
```

## Step 8: Performance Optimization

### 8.1 Animation Efficiency
```
OPTIMIZATION RULES:
- Use CSS transforms over position changes
- Group related animations
- Use will-change for animated elements
- Limit simultaneous animations
- Use requestAnimationFrame for smooth motion
```

### 8.2 File Size Management
```
SIZE TARGETS:
- Simple character: <5KB
- Complex character: <15KB
- Background: <20KB
- Full scene: <50KB
- Complete animation: <100KB
```

## Step 9: Quality Checklist

### 9.1 Animation Quality
```
CHECKLIST:
- [ ] Smooth character movement
- [ ] Proper timing and easing
- [ ] Consistent scaling
- [ ] Correct positioning
- [ ] Natural gestures
- [ ] Smooth transitions
- [ ] Performance optimized
- [ ] Cross-browser compatible
```

### 9.2 Story Coherence
```
NARRATIVE CHECK:
- [ ] Characters match story description
- [ ] Scenes reflect story setting
- [ ] Actions match story events
- [ ] Timeline is accurate
- [ ] Visual style is consistent
- [ ] Story flow is logical
```

## Step 10: Output Generation

### 10.1 File Organization
```
OUTPUT STRUCTURE:
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

### 10.2 Documentation
```
REQUIRED DOCS:
- Story breakdown document
- Asset inventory list
- Animation specifications
- Coordinate system guide
- Performance notes
- Usage instructions
```

## Implementation Priority

1. **FIRST**: Analyze story and create asset inventory
2. **SECOND**: Set up folder structure and naming
3. **THIRD**: Design coordinate and scaling systems
4. **FOURTH**: Create static assets (characters, backgrounds)
5. **FIFTH**: Add dynamic animations (walking, talking)
6. **SIXTH**: Compose complete scenes
7. **SEVENTH**: Optimize and test performance
8. **EIGHTH**: Generate final output and documentation

Remember: Focus on natural movement, proper scaling, and smooth animations that bring the story to life!
