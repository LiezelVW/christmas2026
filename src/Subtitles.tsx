import React from "react";
import { useCurrentFrame } from "remotion";
import { FPS, brand, scenes, subtitles } from "./config";

/** Retained dialogue layer. Toggle subtitles.enabled in config.ts to restore it. */
export const SubtitleLayer = () => {
  const frame = useCurrentFrame();
  if (!subtitles.enabled) return null;
  let start = 0;
  for (let index = 0; index < scenes.length; index++) {
    const scene = scenes[index];
    const length = scene.duration * FPS;
    const local = frame - start;
    start += length;
    if (local < 0 || local >= length) continue;
    if ((index === 2 && local >= 260) || (index === 5 && local >= 130))
      return null;
    const text =
      index === 1 && local >= 265
        ? scene.resolvedCaption
        : index === 3 && local > 165
          ? scene.secondCaption
          : scene.caption;
    if (!text) return null;
    return (
      <div
        data-dialogue-subtitles
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 94,
          zIndex: 100,
          textAlign: "center",
          fontFamily: "Montserrat,Arial,sans-serif",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            display: "inline-block",
            maxWidth: "100%",
            padding: "19px 30px",
            background: "#0B171F",
            color: brand.paper,
            fontSize: 29,
            lineHeight: 1.4,
            borderLeft: `3px solid ${brand.orange}`,
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      </div>
    );
  }
  return null;
};
