# Labels and sustainability correction 23 November 2026

## Stable labels

The remaining live SVG text in the civil, transport and sustainability scenes is replaced by self-contained SVG image assets with Montserrat glyphs converted to vector outlines. Structural callouts use the same single-image approach. Each panel background and its lettering are rendered as one image, so Chromium cannot independently position its text and rectangle.

The eight label assets live in `public/assets/annotations/`. `npm run build:labels` regenerates them from the bundled Montserrat font using the fontkit development dependency. The generator checks panel widths and refuses overflow; no external font or asset service is used. Fontkit is not used at runtime. Engineering leader lines, load/flow animations, scene backgrounds and timing remain in place.

`check-labels-and-parked-team.mjs` verifies that the assets have outlines and no live SVG text, then renders multiple civil, structural and sustainability frames. The civil and structural white-letter masks are identical across the checked settled-camera frames. Checks on frames extracted from the encoded MP4 likewise have identical bounds and 100 percent overlap; see [encoded checks](review/encoded-label-stability.json).

## Sustainability scene

Santa now stands beside the parked burgundy-and-gold sleigh with all four reindeer in two pairs. The existing skinned models and independent idle phases are reused, with harness reins and contact shadows. The parked setup has its own camera; the approved flight and runway takeoff camera/animation are unaffected.

The green dotted ground-route overlay is removed because it crossed the reindeer. The remaining brown connections are the harness reins. A short, outlined label states Reindeer-powered delivery / Wind + solar for the workshop, making the delivery joke separate from the workshop energy concept. No carbon-neutral or zero-emission claim is introduced.

## Export

`npm run check` and the ten project checkpoints passed. The 2250-frame full label/team render completed. After the final ground-line clarification, Scene 5 was rendered again, with a three-frame mission transition segment, and joined to the unchanged surrounding full-render segments at keyframe boundaries. The final MP4 is exactly 90 seconds, 1920 × 1080, 25 fps, 2250 frames, with zero audio tracks, and passes a complete FFmpeg decode.

Desktop filename: `DBFL Operation Christmas 2026 - Fixed Labels and Full Sleigh Team.mp4`. The previous Desktop export is retained. The default local `out/dbfl-christmas-2026.mp4` is refreshed from the validated final MP4. The 198-portrait selection, all-director Teams opening, approved runway takeoff, large Santa mosaic reveal and closing tagline are unchanged.

The [sustainability screenshot](review/sustainability-full-team.png) is extracted from the final MP4 at 56 seconds.
