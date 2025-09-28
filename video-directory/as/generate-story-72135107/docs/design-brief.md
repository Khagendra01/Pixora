# Design Brief – Daisy Bell Palette & Layout

## Palette `daisy-v1`
| Token | Hex | Usage |
|-------|-----|-------|
| brass-gold | #C89B3C | Bicycle frame, lantern bodies |
| fern-green | #2F6F4F | Trees, grass accents |
| buttercream | #F7E7B2 | Daisy dress, highlight tones |
| twilight-lavender | #8F88C0 | Evening sky gradients |
| warm-chestnut | #6B3F2C | Workshop wood, cobblestone depth |
| soft-peach | #F2B6A0 | Skin tones, petals |
| ink-navy | #1E2E4F | Line work, shadows |

## Typography & Lettering
- Scene overlays use hand-painted title cards in `BelleFair` serif (load via Remotion's Google Fonts helper in composition).
- On-screen lyrics appear briefly as floating ribbons; ensure legibility with buttercream text on ink-navy translucent panels.

## Layout & Composition
- Maintain 16:9 safe zones: keep key characters within X=420–1500, Y=250–830 for headroom.
- Workshop scene uses 3-layer parallax: background tool wall (Z=10), mid gear table (Z=35), characters (Z=55).
- Park scene uses ground plane diagonal from bottom-left to center-right for motion energy.
- Finale positions lantern array on Z=25 with alternating heights (Y=220, 260, 300) to create depth rhythm.

## Motion Guidelines
- Pedal loop: 24-frame cycle with ease-in-out on top/bottom of rotation to mimic human cadence.
- Petal drift: spawn 6 particles every 12 frames during chorus; apply slight scale jitter ±5%.
- Lantern flare: loop 48 frames with sine-wave modulation of opacity (0.5↔1).

## Coordinate Bands Reference
See `docs/coordinate-system.md` for numeric bands by layer; ensure animations respect these ranges to avoid z-fighting.
