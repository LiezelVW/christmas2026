import React from "react";
import { useCurrentFrame } from "remotion";
import { brand } from "./config";

// Short engineering states only. Narration and dialogue are added in After Effects.
export const EngineeringStatus = ({
  scene,
  top = 390,
}: {
  scene: number;
  top?: number;
}) => {
  const f = useCurrentFrame();
  const approved = scene === 1 ? f >= 265 : scene === 2 ? f >= 260 : f >= 265;
  const states = [
    "DEADLINE · 24 DECEMBER",
    f < 90
      ? "RUNWAY DRAINAGE ISSUE DETECTED"
      : f < 265
        ? "DRAINAGE IN PROGRESS"
        : "RUNWAY CLEAR",
    f < 85
      ? "STRUCTURAL LOAD EXCEEDED"
      : f < 170
        ? "LOAD ASSESSMENT"
        : f < 260
          ? "REINFORCEMENT IN PROGRESS"
          : "STRUCTURAL SOLUTION APPROVED",
    f < 165
      ? "ROUTE ASSESSMENT"
      : f < 265
        ? "SLEIGH FLIGHT CORRIDOR"
        : "ROUTE APPROVED",
    f < 110
      ? "ENVIRONMENTAL REVIEW"
      : f < 265
        ? "RENEWABLE DELIVERY CONCEPT"
        : "SUSTAINABILITY STRATEGY APPROVED",
  ];
  if (scene === 5) return null; // Mission title and existing approval stamp carry this state.
  const color = approved && scene > 0 ? brand.green : brand.orange;
  return (
    <aside
      data-engineering-status={scene + 1}
      style={{
        position: "absolute",
        left: 100,
        top,
        width: 565,
        padding: "20px 24px",
        borderLeft: `3px solid ${color}`,
        background: "#10232E",
        color,
        fontSize: 23,
        lineHeight: 1.5,
        fontWeight: 600,
        letterSpacing: 0.5,
        overflow: "hidden",
        overflowWrap: "break-word",
      }}
    >
      {states[scene]}
    </aside>
  );
};
