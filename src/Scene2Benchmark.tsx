import { EngineeringStatus } from "./EngineeringStatus";
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import { brand } from "./config";
import { ease } from "./components";
const camera = (f: number) => {
  const p = interpolate(f, [25, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return `translate(${-15 + p * 95}px, ${5 - p * 75}px) scale(${1.04 + p * 0.18})`;
};
const origin = "42% 72%";
const flow = "M790 795Q940 765 1085 772L1410 900Q1475 931 1494 980";
export const Scene2Backdrop = () => {
  const f = useCurrentFrame();
  const cleared = ease(f, 160, 258);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: camera(f), transformOrigin: origin }}>
        <Img
          src={staticFile("assets/scene-2/north-pole-workshop-v2.png")}
          style={{ width: 1920, height: 1080, objectFit: "cover" }}
        />
        <Img
          src={staticFile("assets/scene-2/runway-dry-v3.png")}
          style={{
            position: "absolute",
            inset: 0,
            width: 1920,
            height: 1080,
            objectFit: "cover",
          }}
        />
        <Img
          src={staticFile("assets/scene-2/runway-flooded-v3.png")}
          style={{
            position: "absolute",
            inset: 0,
            width: 1920,
            height: 1080,
            objectFit: "cover",
            opacity: 1 - cleared * 0.25,
            maskImage: `linear-gradient(90deg, transparent ${cleared * 125 - 25}%, black ${cleared * 125 - 10}%)`,
          }}
        />
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 76% 42%, rgba(255,166,65,${0.025 + Math.sin(f / 28) * 0.012}), transparent 38%)`,
            mixBlendMode: "screen",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg,#14252DEB 0%,#14252DA6 22%,#14252D15 48%,transparent 70%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,#0B1927A0,transparent 20%,transparent 76%,#101E2BCC 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
export const Scene2Analysis = () => {
  const f = useCurrentFrame();
  const clean = 1 - ease(f, 248, 265);
  const reveal = ease(f, 90, 155) * clean;
  const draining = ease(f, 155, 180) * clean;
  const solved = f >= 265;
  const phase = f < 90 ? 0 : f < 265 ? 1 : 2;
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: camera(f),
            transformOrigin: origin,
          }}
        >
          <svg
            width="1920"
            height="1080"
            viewBox="0 0 1920 1080"
            style={{ position: "absolute", inset: 0 }}
            aria-label="Flooded runway draining to the existing outfall"
          >
            <defs>
              <marker
                id="flow-arrow"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M0 0L10 5 0 10Z" fill="#F15A29" />
              </marker>
              <linearGradient id="water-stream">
                <stop stopColor="#CCEFFF" />
                <stop offset="1" stopColor="#70C7F2" />
              </linearGradient>
            </defs>
            <g opacity={ease(f, 18, 38) * (1 - ease(f, 245, 265))}>
              <path
                d="M665 700L955 827 860 910 530 760Z"
                fill="none"
                stroke="#F15A29"
                strokeWidth="2"
                strokeDasharray="8 9"
              />
              <circle
                cx="760"
                cy="805"
                r={24 + Math.sin(f / 6) * 5}
                stroke="#F15A29"
                fill="#F15A2915"
                strokeWidth="3"
              />
            </g>
            <g opacity={reveal}>
              <path d={flow} stroke="#F15A2930" strokeWidth="22" fill="none" />
              <path
                d={flow}
                stroke={solved ? brand.green : brand.orange}
                strokeWidth="3"
                fill="none"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - reveal}
              />
              <path
                d="M950 779L1070 773M1180 809L1300 856M1395 896Q1458 919 1478 953"
                stroke={brand.orange}
                strokeWidth="3"
                fill="none"
                markerEnd="url(#flow-arrow)"
              />
            </g>
            <g opacity={draining}>
              <path
                d={flow}
                stroke="url(#water-stream)"
                strokeWidth="5"
                fill="none"
                strokeDasharray="45 55"
                strokeDashoffset={-f * 8}
              />
              <path
                d={flow}
                stroke="#EAF8FF"
                strokeWidth="2"
                fill="none"
                strokeDasharray="10 30"
                strokeDashoffset={-f * 8}
              />
            </g>
            <g opacity={ease(f, 100, 130) * clean}>
              <path
                d="M1110 766V660H1270"
                fill="none"
                stroke="#F15A29"
                strokeWidth="2"
              />
            </g>
          </svg>
          <Img
            data-label="collection-channel"
            alt="Collection channel: surface falls to grated drain"
            src={staticFile("assets/annotations/collection-channel.svg")}
            style={{
              position: "absolute",
              left: 1132,
              top: 604,
              width: 340,
              height: 72,
              opacity: ease(f, 100, 130) * clean,
            }}
          />
        </div>
      </div>
      <EngineeringStatus scene={1} />
      <Img
        data-label="drainage-outlet"
        alt="Drainage outlet: water conveyed to outfall"
        src={staticFile("assets/annotations/drainage-outlet.svg")}
        style={{
          position: "absolute",
          right: 105,
          top: 747,
          width: 300,
          height: 78,
          opacity: ease(f, 145, 170) * clean,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 840,
          fontSize: 11,
          letterSpacing: 2,
          color: "#A9BFCA",
        }}
      >
        ILLUSTRATIVE DRAINAGE SEQUENCE / NP–C01
      </div>
      <Foreground />
    </>
  );
};
const Foreground = () => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: -50,
        bottom: -55,
        width: 1000,
        height: 430,
        pointerEvents: "none",
        transform: `translateX(${f * 0.1}px) scale(${1.06 + f * 0.0003})`,
        opacity: 0.65,
      }}
    >
      <Img
        src={staticFile("assets/scene-2/foreground-evergreen-v2.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "left bottom",
        }}
      />
    </div>
  );
};
