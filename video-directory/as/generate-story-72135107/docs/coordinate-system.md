# Coordinate System – Daisy Bell

## Base Grid
- Resolution: 1920x1080, origin at top-left (0,0).
- Depth axis: 0 (background) to 100 (overlay).

## Depth Bands
| Layer | Z Range | Elements |
|-------|---------|----------|
| Background | 0 – 20 | Workshop walls, park trees, distant buildings |
| Mid-ground | 21 – 60 | Furniture, lantern strings, tandem bicycle frame |
| Foreground | 61 – 80 | Characters, petals, proposal props |
| Overlay | 81 – 100 | Text ribbons, fade bloom, letterbox if needed |

## Positional Zones
| Zone | X Range | Y Range | Usage |
|------|---------|---------|-------|
| Workshop Focus | 520 – 1400 | 320 – 780 | Character staging around tandem |
| Ride Path | 400 – 1520 | 540 – 900 | Bicycle travel arc in park |
| Skyline | 0 – 1920 | 120 – 400 | Trees, hanging lanterns |
| Proposal Spotlight | 760 – 1160 | 380 – 760 | Final proposal close-up |

## Camera Paths
- **Scene 1**: Subtle dolly-in along X=960 with 4% zoom over 150 frames.
- **Scene 2**: Horizontal follow from X=520→1200; apply 12px vertical bob synced to music downbeats.
- **Scene 3**: 180° orbit simulated through parallax shifts and character scale adjustments (1.0→1.1 over 120 frames).

## Scaling Factors
- Harry & Daisy: 1.0 scale at mid-ground (Z~65), enlarge to 1.1 during proposal.
- Tandem bicycle: 0.95 scale to maintain focus on faces.
- Petals: random 0.6–1.0 scale.
- Lanterns: 0.8 base with 0.05 pulsing variance.
