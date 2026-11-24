# Audio status

The current Christmas2026 composition has no voiceover. Narration is disabled through the empty `assets.audio` list in `src/config.ts`; all optional audio cues remain unset.

The supplied original recording and intermediate synced recording are retained locally, excluded from Git, and are not required to reproduce the current film. Approved scene designs, animations, timing and the runway takeoff are unchanged.

Dialogue subtitles are switched off through `subtitles.enabled: false` in `src/config.ts`. The subtitle renderer is retained in `src/Subtitles.tsx`, and the original caption text remains in the scene definitions. Set the flag to true to restore dialogue captions later. Engineering annotations, status labels, scene titles and the closing brand message remain.
