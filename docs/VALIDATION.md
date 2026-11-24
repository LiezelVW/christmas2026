# Validation 23 November 2026

Validated from the project directory with Node 22.22.1 and npm 10.9.4.

- `npm ci --no-audit --no-fund`: passed against the committed lockfile.
- `npm run check`: passed, with no TypeScript diagnostics.
- `npm run verify:project`: passed all ten image checkpoints, including both connected-call states, all engineering scenes, the approved takeoff inside the main composition, the 198-portrait mosaic and closing typography.
- The roster exactly matches commit `8731e7a`: 198 unique names, paths and SHA-256 image hashes. Two perceptual-hash candidates were visually checked and are different photographs. No asset was deleted.
- All twelve director portrait paths resolve, and every connected-call frame uses the complete gallery. The John-only display branch is removed.
- The fixed-background takeoff slot remains Scene 6 frames 150–324. All models, plates, font, logo and takeoff animation source match `d992409`.
- `npm run render`: successfully completed the full H.264 export. FFprobe confirms 1920 × 1080, 25/1 fps, 2250 video frames, 90.000000 seconds and zero audio streams.
- The mosaic screenshot is extracted from the completed MP4 at 82 seconds, not a mockup or standalone composition image: [rendered mosaic](review/mosaic-198-rendered.png).
- Essential engineering labels and status graphics remain; narration paragraphs, dialogue subtitles, music and voiceover are omitted. The final Montserrat tagline retains weights 700 / 500 / 400 with normal spacing.

The MP4 is saved on Desktop as `DBFL Operation Christmas 2026 - Approved 198 Portraits - 23 Nov 2026.mp4`, verified in Finder. The original source snapshot, complete render log and export metadata are retained locally. Earlier drafts and all original photographs remain preserved.

## Follow-up label and parked-team correction

The follow-up export and encoded-frame checks are documented in [labels and sustainability](LABELS-AND-SUSTAINABILITY.md). Final video remains 90 seconds, 2250 frames, 1920 × 1080, 25 fps and silent. The new Desktop file is `DBFL Operation Christmas 2026 - Fixed Labels and Full Sleigh Team.mp4`; the earlier export remains preserved.

## 24 November directors and Yasheel update

The latest full render completed with all twelve directors visible throughout the incoming-call and connected-call states. The 199-person roster equals the original 198 approved portraits plus the supplied Yasheel portrait; all names, paths and image hashes are unique. Subtitles remain disabled. See [24 November validation](UPDATE-2026-11-24.md).
