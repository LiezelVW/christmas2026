# Upload validation — 19 November 2026

Validated in a clean checkout with Node 22.22.1 / npm 10.9.4:

- `npm ci --no-audit --no-fund`: passed against the committed lockfile.
- `npm run check`: passed with no TypeScript diagnostics.
- `npm run dev -- --force-new --no-open`: Studio started and compiled successfully.
- Complete Remotion bundle and eight rendered checkpoints passed: caller image, stable civil caption, structural scene, animated map team, standing Santa/reindeer, approved takeoff inside Christmas2026, staff mosaic and closing frame.
- `npm run render`: complete 2250-frame H.264 export succeeded: 90 seconds, 1920×1080, 25 fps.
- The takeoff component is mounted at Scene 6 frames 150–324, exactly the approved 175-frame sequence, followed by the staff mosaic and closing message. An omitted mounting element detected during the upload audit was restored without changing the approved animation or timing.
- The latest text fixes are present: one fixed civil subtitle layer, no staff-count label, and Engineering Sustainable Futures.
- All 248 prepared portrait paths resolve; all three GLBs contain geometry, with skeletal skins and animation clips verified for Santa and the reindeer.
- No included individual file reaches 100 MB. Git LFS is not required.

Generated MP4s, checkpoint PNGs and render bundles remain local and are excluded from git. No local source files or original assets were deleted.
