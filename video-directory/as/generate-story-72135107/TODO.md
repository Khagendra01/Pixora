# Dynamic SVG Animation Project TODO

## ✅ COMPLETED TASKS
- Initial Daisy Bell story intake and documentation scaffolded (`docs/story-overview.md`, `docs/beat-sheet.md`, `docs/design-brief.md`, `docs/asset-inventory.md`, `docs/coordinate-system.md`).

## 🔄 IN PROGRESS
- Asset illustration and animation wiring for Daisy Bell sequence.

## 📋 PENDING TASKS
- Generate SVG assets (characters, backgrounds, props) with embedded metadata.
- Implement Remotion scenes and transitions referencing new asset registry.
- Build seeded particle utility for petals and lantern glow animations.
- Integrate Daisy Bell audio track and verify sync with beat sheet.
- Run `npm run lint` and document QA outcomes.

## 🎯 PRIORITY ORDER
1. Produce SVG assets and register them for consumption.
2. Construct scene components and timeline helpers for three-beat structure.
3. Wire master composition `GeneratedVideo` and integrate audio.
4. Execute QA pass (lint, visual spot-check) and update TODO.

## 📊 PROGRESS TRACKING
- Story documentation: 100%
- Asset production: 0%
- Scene implementation: 0%
- Audio integration: 0%
- QA automation: 0%

## 🔧 TECHNICAL REQUIREMENTS
- Maintain 30fps, 1920x1080 composition with 600-frame duration.
- Ensure seeded random utilities for repeatable particle effects.
- Keep SVG asset sizes under guardrail thresholds (characters <15KB, backgrounds <20KB).

## 📝 NOTES
- Consider layering subtle gear-click audio during workshop scene in future iteration.
- Confirm Google Font `BelleFair` availability or bundle fallback serif if offline build required.
