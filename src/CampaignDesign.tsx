import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { brand } from "./config";
export const progress = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
export const CinematicPlate = ({
  src,
  focus = "65% 55%",
  zoom = 0.08,
  pan = 30,
  children,
}: {
  src: string;
  focus?: string;
  zoom?: number;
  pan?: number;
  children?: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  const p = progress(f, 0, 325);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${-pan * p}px,${8 - p * 18}px) scale(${1.03 + zoom * p})`,
          transformOrigin: focus,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {children}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg,#14252DF2 0%,#14252DC9 24%,#14252D55 42%,transparent 72%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,#09192577,transparent 30%,transparent 70%,#101E2BED)",
        }}
      />
    </AbsoluteFill>
  );
};
export const Status = ({
  children,
  approved = false,
  style = {},
}: {
  children: React.ReactNode;
  approved?: boolean;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      padding: "18px 22px",
      borderLeft: `4px solid ${approved ? brand.green : brand.orange}`,
      background: approved ? "#16362FF0" : "#14252DEB",
      color: approved ? brand.green : "#FF976E",
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: 1,
      lineHeight: 1.45,
      ...style,
    }}
  >
    {children}
  </div>
);
export const SmallLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 13,
      letterSpacing: 2.5,
      color: "#BDD0DA",
      lineHeight: 1.6,
    }}
  >
    {children}
  </div>
);
export const SleighRig = ({
  x,
  y,
  width = 650,
  scale = 1,
  opacity = 1,
  flip = false,
  flight = true,
}: {
  x: number;
  y: number;
  width?: number;
  scale?: number;
  opacity?: number;
  flip?: boolean;
  flight?: boolean;
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height: (width * 9) / 16,
        opacity,
        transform: `translateY(${flight ? Math.sin(f / 13) * 5 : 0}px) rotate(${flight ? -3 + Math.sin(f / 55) : 0}deg) scale(${flip ? -scale : scale},${scale})`,
        transformOrigin: "50% 50%",
        filter: "drop-shadow(0 8px 12px #07141B77)",
        pointerEvents: "none",
      }}
    >
      <Img
        src={staticFile("assets/scene-6/sleigh-team.png")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};
