# Teams call version

The new `Christmas2026Teams` composition replaces only the opening ten seconds with a Microsoft Teams style incoming call from Santa, answered by John Hayes. John's supplied staff photograph is `assets/staff-mosaic/staff-125.jpg`. This is a photograph in an animated call interface, not fabricated footage of John speaking. Santa's caller avatar is a CSS crop of the existing approved sleigh artwork; no new asset or licence is required.

`TeamsCallIntro` is the standalone ten-second opening preview. Run `npm run render:teams` to render the full 90-second alternative.

The original `Christmas2026` composition and default `npm run render` remain Draft 1. The original project is also preserved at Git tag `draft-1-approved-2026-11-19`. Work on the alternative is isolated on branch `codex/teams-directors-version`.

Scenes 2–6, the approved runway takeoff, employee mosaic and closing brand message are unchanged. Both versions currently have no voiceover or bottom subtitles.

The supplied Word brief also describes live office filming. Those additional shots are outside this opening change and would require the corresponding footage.

John answers first, followed by the twelve-director gallery using the supplied names and division/position labels in `src/directors.json`. Robert Kelly uses the existing staff entry named Rob Kelly (`staff-207.jpg`). All other names match the staff index exactly.

## Mosaic fly-past

The alternative version uses a large foreground Santa, sleigh and reindeer fly-by to reveal the employee mosaic. A soft horizontal mask follows the trailing sleigh edge, so portraits appear behind the team rather than being visible before the pass. The 4.6-second transition reuses the existing skinned GLBs and frame-based skeletal animation. The team exits before the closing brand card. `MosaicFlypastPreview` is a standalone 240-frame review composition. This is enabled only in `Christmas2026Teams`; the original film and its mosaic remain unchanged.

Real employee footage will be integrated after the planned shoot. Current director tiles are the supplied staff photographs.
