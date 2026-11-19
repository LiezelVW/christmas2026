# Scene 2 asset provenance

Created using the built-in image generation tool, not an AI video tool. These are original raster assets for a design-review benchmark; not supplied DBFL project photography, vector masters or actual North Pole engineering evidence.

## Architectural plate — north-pole-workshop-v2.png

Use case: stylized-concept
Asset type: cinematic architectural environment plate for a layered Remotion Christmas animation, landscape 16:9, high resolution.
Primary request: A premium, highly detailed snowy North Pole airport beside Santa's Christmas workshop. Sophisticated architectural visualisation with handcrafted miniature realism, matching the warm, intricate snowy Christmas workshop mood of the user's reference, not a flat cartoon or geometric prototype.
Scene: polar blue-hour night, atmospheric evergreen forest and distant mountains. On the RIGHT half: a beautifully built substantial timber-and-stone Christmas workshop, real pitched roof with deep snow, exposed wooden roof trusses, richly detailed warm amber windows revealing workshop benches and wrapped gifts inside, subtle evergreen garlands and warm Christmas lights. In front, a large properly proportioned paved airport apron and a long runway travelling diagonally from lower centre towards upper left distance, believable runway lights and white markings, ploughed snow banks, visible drainage trench beside the near edge of the apron with inset grates and a small outfall basin. Wet blue reflections on part of the apron. On the LEFT third: darker blue forest/atmosphere with low detail for code-rendered title text, still continuous environment.
Composition: wide establishing camera from elevated three-quarter view, realistic architecture perspective, workshop at x=70%, y=48%, ground extends to bottom edge, strong layered depth, readable runway/apron, generous safe margins. Make it cinematic and believable, a Christmas campaign art plate.
Lighting: rich warm workshop windows contrasting with soft cool moonlight, subtle volumetric haze, detailed snow and timber materials. Restrained DBFL orange accents in lighting.
Constraints: NO text, letters, labels, logos, engineering arrows, captions, people, faces, sleigh, reindeer, falling snow or UI. Those will be separate animation layers. No basic cubes, no low-poly look, no garish colours, no stock clip aesthetics. This is one original architectural art plate, not a collage.

## Transparent foreground — foreground-evergreen-v2.png

Use case: stylized-concept. Asset type: transparent foreground layer for the snowy architectural Christmas environment just generated. Create ONLY a delicate, highly detailed cluster of snow-laden evergreen boughs framing the lower LEFT corner, with a few needles and icy twigs extending upward along left edge. Cool deep blue moonlit pine needles, soft sculptural snow, realistic miniature architectural visualisation quality. Branches concentrated in lower 20% and far left 15%; most of the canvas must be genuinely transparent. Wide landscape composition. No ground, background, sky, buildings, frame, text, people, baubles or lights. Match the cool blue moonlight from the workshop plate. This is an isolated foreground cutout for parallax animation.

## v3 runway refinement — built-in image generation, edit mode

Source: `north-pole-workshop-v2.png`. Outputs: `runway-flooded-v3.png`, then `runway-dry-v3.png`. Remotion composites only the runway region; the original workshop, snow, sky and lighting remain the background plate.

Flood prompt:

Edit this exact architectural plate, preserve the entire workshop, sky, forests, snow, camera perspective, lighting and composition. Change ONLY the paved runway in the lower-left/centre foreground: add a clearly visible substantial standing-water flood covering a large stretch of runway roughly from 28% to 52% of image width and 62% to 86% image height. Realistic reflective dark blue water with silver-blue surface highlights, ripples and irregular wet edges, visibly submerging some white runway markings. It must read immediately as water pooled on the runway, not snow or a decorative blue patch. Strengthen realistic white runway edge stripes, threshold piano-key stripes, dashed centreline and a runway designation 24 in correct perspective towards the left foreground. Keep the drainage trench and culvert on the right completely unchanged. No arrows, labels, UI or additional text other than runway number. Same exact image crop and dimensions. Preserve everything outside the runway flood/markings.

Dry prompt:

Edit this exact image. Remove ONLY the pooled standing floodwater from the runway in the lower-left foreground, revealing dry dark textured asphalt underneath. KEEP ALL runway white edge lines, centreline dashes, threshold piano-key stripes and runway designation 24 in exactly their current positions and perspective. Preserve every other pixel as closely as possible: workshop architecture, lights, snow banks, trees, stars, camera, crop, dimensions, drainage trench and outfall. This is the resolved/drained endpoint for an animation that crossfades flooded runway to clear runway. The runway must look visibly dry and usable, not icy and not reflective like water. No added text, UI or objects. Do not change the framing or white runway markings.
