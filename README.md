# DBFL Operation Christmas 2026

The latest approved Remotion film: **90 seconds, 1920 × 1080, 25 fps**. Includes all six scenes, the official DBFL logo, Montserrat typography, 248 prepared staff portraits and the approved animated North Pole runway takeoff.

## Install and run

Tested with Node.js 22 and npm. No external asset downloads, API keys, absolute machine paths or Git LFS installation are needed.

```sh
git clone https://github.com/LiezelVW/christmas2026.git
cd christmas2026
npm ci
npm run dev
```

Remotion Studio opens on port 3100, as printed by the development server. Select **Christmas2026** for the complete film. Individual compositions are **Scene1**, **Scene2Benchmark**, **Scene3Benchmark**, **Scene4**, **Scene5** and **Scene6**.

```sh
npm run check
npm run verify:project
npm run render
```

`verify:project` checks the bundled GLBs and all 248 portrait paths, guards the approved takeoff slot, and renders checkpoints from all six scenes (including the takeoff in `Christmas2026`).

The full render is written under `out/`, which is ignored by git. The Remotion configuration enables ANGLE / WebGL 2 for the rigged 3D scenes. The CLI may download its standard Chromium headless browser on first render. All artwork, models, textures, fonts and decoder files are already included.

## Approved sequence

| Scene | Film time | Content |
| --- | --- | --- |
| 1 | 00:00–00:10 | North Pole call, with workshop caller photo |
| 2 | 00:10–00:23 | Runway drainage: problem → solution → runway clear |
| 3 | 00:23–00:36 | Structural assessment and reinforcement |
| 4 | 00:36–00:49 | Animated 3D Santa and reindeer on the approved M50 route |
| 5 | 00:49–01:02 | Standing Santa beside two idling reindeer, with renewable engineering overlays |
| 6 | 01:02–01:30 | Approval → approved runway takeoff → staff mosaic → DBFL closing message |

The signed-off seven-second takeoff plays at **01:08–01:15**, immediately after the approval stamp. It uses one photographic background and a fixed camera. Reindeer limbs, Santa and reins are animated; this is not the older sliding PNG or five-second flight experiment.

The latest text corrections are included: the runway subtitle is a single fixed, clipped layer, the staff-photo count label is removed, and the closing tagline is **Engineering Sustainable Futures.**

## Source and assets

- `src/`: complete production composition and animation source.
- `public/assets/characters/`: one shared copy of the Santa, reindeer and sleigh GLBs, with embedded textures and licence notices.
- `public/basis/`: local KTX2 texture transcoder JavaScript and WebAssembly.
- `public/assets/scene-2/` through `scene-6/`: approved cinematic plates and engineering artwork.
- `public/assets/staff-mosaic/`: all 248 prepared staff photographs referenced by the film.
- `public/assets/branding/`, `caller/`, `fonts/`: official branding, caller image and Montserrat with its font licence.
- `src/dublin-roads.json` and `public/assets/scene-4/dublin-network.svg`: road geometry used by the transport scene.
- `docs/UPLOAD-INVENTORY.json`: file-size and SHA-256 inventory of the supplied production files.

Models are CC0 assets from [tevy](https://tevy.dev/models/reindeer) and [Grab3D](https://grab3d.com/). Preserve the bundled licence notices. Reindeer use skeletal clips with independent phase offsets. Santa uses seated or standing bone poses with secondary movement. Reins are animated curves; the free assets do not include physical cloth simulation. DBFL branding and staff photography remain their respective owners’ content; no blanket open-source licence is granted to those assets.

## Repository exclusions

Dependencies, generated MP4s, render bundles/caches, operating-system files, temporary files and the old `flight-poc/` and `takeoff-preview/` projects are excluded. Unused raw staff originals (including the PSD) and the raw OpenStreetMap download are also excluded; the prepared portraits, processed geometry and map artwork needed to reproduce the film are included. No local originals were deleted.

All included assets are below GitHub’s 100 MB individual-file limit, so this repository uses ordinary git without LFS. The current audio slots are unpopulated; the review film is silent.
