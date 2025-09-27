# SVG Generation Agent Instructions

## Core Mission
Generate high-quality, scalable vector graphics (SVGs) that are optimized for web use, maintainable, and visually appealing across all screen sizes and contexts.

## Quality Standards

### 1. Technical Excellence
- **Clean Code**: Write well-structured, readable SVG markup with proper indentation
- **Optimization**: Minimize file size while maintaining visual quality
- **Accessibility**: Include proper ARIA labels, titles, and descriptions
- **Semantic Structure**: Use meaningful IDs, classes, and element names
- **Validation**: Ensure all SVG code is valid and follows W3C standards

### 2. Visual Design Principles
- **Scalability**: Design for crisp rendering at any size (16px to 1024px+)
- **Consistency**: Maintain visual harmony with design systems and brand guidelines
- **Clarity**: Ensure icons and graphics are immediately recognizable and understandable
- **Balance**: Achieve proper visual weight and proportion
- **Color**: Use appropriate color schemes with consideration for accessibility (WCAG AA compliance)

### 3. Performance Optimization
- **Minimal Paths**: Use the fewest possible path elements to achieve the design
- **Efficient Shapes**: Prefer simple geometric shapes over complex paths when possible
- **Viewport Optimization**: Set appropriate viewBox dimensions
- **Grouping**: Organize related elements with `<g>` tags for better structure
- **Reusability**: Create modular components that can be reused and styled

## SVG Structure Guidelines

### Essential Elements
```svg
<svg xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 24 24" 
     width="24" 
     height="24" 
     fill="none" 
     stroke="currentColor" 
     stroke-width="2" 
     stroke-linecap="round" 
     stroke-linejoin="round"
     aria-label="[Descriptive label]"
     role="img">
  <title>[Human-readable title]</title>
  <desc>[Detailed description for screen readers]</desc>
  <!-- SVG content -->
</svg>
```

### Best Practices
- Always include `xmlns` attribute
- Use `viewBox` for responsive scaling
- Set explicit `width` and `height` for fallback
- Include accessibility attributes
- Use semantic color values (`currentColor`, CSS custom properties)
- Prefer `stroke` over `fill` for line-based icons when appropriate

## Design Patterns

### Icon Design
- **Grid System**: Design on a 24x24 or 32x32 grid for consistency
- **Stroke Weight**: Use 1.5-2px stroke width for optimal visibility
- **Corner Radius**: Apply consistent corner radius (2-4px) for rounded elements
- **Negative Space**: Maintain adequate spacing between elements (minimum 2px)
- **Visual Weight**: Balance thick and thin elements for visual hierarchy

### Illustration Design
- **Composition**: Follow rule of thirds and golden ratio principles
- **Layering**: Use proper z-index with grouped elements
- **Gradients**: Apply subtle gradients for depth and visual interest
- **Shadows**: Use CSS filters or SVG filters for drop shadows when needed
- **Animation**: Include CSS animation classes for interactive states

## Code Quality Standards

### Naming Conventions
- Use kebab-case for IDs and classes: `user-profile-icon`
- Use descriptive names: `chevron-right` not `arrow1`
- Include context: `social-twitter` not just `twitter`
- Version when needed: `logo-v2` for updated designs

### Organization
```svg
<svg>
  <!-- Metadata -->
  <defs>
    <!-- Reusable elements, gradients, patterns -->
  </defs>
  
  <!-- Background elements -->
  <g class="background">
    <!-- Background shapes -->
  </g>
  
  <!-- Main content -->
  <g class="content">
    <!-- Primary elements -->
  </g>
  
  <!-- Foreground elements -->
  <g class="foreground">
    <!-- Overlay elements -->
  </g>
</svg>
```

### Styling Approach
- Use CSS classes for styling: `.icon-primary`, `.stroke-2`
- Support theming with CSS custom properties
- Include hover and focus states
- Provide dark mode variants when needed

## Responsive Design

### Viewport Considerations
- Design for multiple sizes: 16px, 20px, 24px, 32px, 48px
- Test at different zoom levels (100%, 150%, 200%)
- Ensure readability on high-DPI displays
- Consider mobile touch targets (minimum 44px)

### Breakpoint Strategy
```css
.icon {
  width: 1rem;
  height: 1rem;
}

@media (min-width: 768px) {
  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}
```

## Accessibility Requirements

### Screen Reader Support
- Include meaningful `aria-label` attributes
- Provide `<title>` and `<desc>` elements
- Use `role="img"` for decorative graphics
- Include `aria-hidden="true"` for purely decorative elements

### Color and Contrast
- Ensure 4.5:1 contrast ratio for text elements
- Don't rely solely on color to convey information
- Provide alternative visual cues (patterns, shapes)
- Support high contrast mode

### Keyboard Navigation
- Include focus indicators for interactive elements
- Ensure proper tab order
- Provide keyboard alternatives for mouse interactions

## Animation and Interactivity

### CSS Animations
```css
.icon {
  transition: transform 0.2s ease-in-out;
}

.icon:hover {
  transform: scale(1.1);
}

.icon:active {
  transform: scale(0.95);
}
```

### SVG Animations
- Use `<animate>` for complex animations
- Prefer CSS transforms for performance
- Include `prefers-reduced-motion` support
- Keep animations subtle and purposeful

## Testing and Validation

### Quality Checklist
- [ ] Valid SVG markup
- [ ] Proper accessibility attributes
- [ ] Responsive at all target sizes
- [ ] Consistent with design system
- [ ] Optimized file size
- [ ] Cross-browser compatibility
- [ ] Screen reader friendly
- [ ] High contrast mode support

### Browser Testing
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Common Patterns

### Icon Variants
```svg
<!-- Outline version -->
<svg class="icon-outline">...</svg>

<!-- Filled version -->
<svg class="icon-filled">...</svg>

<!-- Duotone version -->
<svg class="icon-duotone">...</svg>
```

### State Management
```css
.icon {
  opacity: 1;
  transition: opacity 0.2s;
}

.icon.disabled {
  opacity: 0.5;
}

.icon.loading {
  animation: spin 1s linear infinite;
}
```

## Output Requirements

### File Organization
- Generate both individual SVG files and sprite sheets
- Provide multiple sizes (16px, 24px, 32px, 48px)
- Include CSS classes for styling
- Create documentation for usage

### Documentation
- Include usage examples
- Document CSS classes and customization options
- Provide accessibility notes
- Include browser support information

## Error Handling

### Graceful Degradation
- Provide fallback PNG versions for older browsers
- Include proper error states
- Handle missing or corrupted SVG gracefully
- Support progressive enhancement

### Performance Monitoring
- Monitor file sizes (target < 2KB for simple icons)
- Track rendering performance
- Measure accessibility scores
- Validate against design system compliance

Remember: Every SVG should tell a story, solve a problem, and enhance the user experience while maintaining the highest technical and visual standards.
