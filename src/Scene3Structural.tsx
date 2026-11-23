import { EngineeringStatus } from "./EngineeringStatus";
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
import { ease, AnimatedTypography } from "./components";
const camera = (f: number) => {
  const p = interpolate(f, [0, 225], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return `translate(${-12 - p * 22}px,${10 - p * 22}px) scale(${1.035 + p * 0.085})`;
};
const origin = "68% 50%";
export const Scene3Backdrop = () => {
  const f = useCurrentFrame();
  const reinforcement = ease(f, 170, 245);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: camera(f), transformOrigin: origin }}>
        <Img
          src={staticFile("assets/scene-3/workshop-overloaded-v1.png")}
          style={{ width: 1920, height: 1080, objectFit: "cover" }}
        />
        <Img
          src={staticFile("assets/scene-3/workshop-reinforced-v1.png")}
          style={{
            position: "absolute",
            inset: 0,
            width: 1920,
            height: 1080,
            objectFit: "cover",
            opacity: ease(f, 170, 200),
            maskImage: `linear-gradient(180deg,black ${reinforcement * 120 - 12}%, transparent ${reinforcement * 120 + 2}%)`,
          }}
        />
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 76% 40%,#FFBD6510,transparent 55%)`,
            opacity: 0.7 + Math.sin(f / 35) * 0.15,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg,#14252DF5 0%,#14252DDB 22%,#14252D65 40%,#14252D00 62%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,#0B19274D,transparent 30%,transparent 77%,#101E2BE6)",
        }}
      />
      {Array.from({ length: 28 }, (_, i) => (
        <i
          key={i}
          style={{
            position: "absolute",
            left: (i * 103.7 + Math.sin(f / 60 + i) * 18) % 1920,
            top: (i * 79.3 + f * 0.14) % 1080,
            width: (i % 3) + 1,
            height: (i % 3) + 1,
            borderRadius: "50%",
            background: "#FFE1AA",
            opacity: 0.08 + (i % 4) * 0.04,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
export const Scene3Analysis = () => {
  const f = useCurrentFrame();
  const analysis = ease(f, 80, 110);
  const reinforce = ease(f, 170, 240);
  const approved = f >= 260;
  const highlight = analysis * (1 - ease(f, 250, 275) * 0.6);
  const phase = f < 85 ? 0 : f < 170 ? 1 : f < 260 ? 2 : 3;
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
            aria-label="Illustrative mezzanine beam load paths and reinforcement"
          >
            <defs>
              <marker
                id="structural-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path
                  d="M0 0L10 5 0 10Z"
                  fill={approved ? brand.green : brand.orange}
                />
              </marker>
              <filter id="beam-glow">
                <feGaussianBlur stdDeviation="7" />
              </filter>
            </defs>
            <g opacity={ease(f, 22, 45) * (1 - ease(f, 170, 210))}>
              <path
                d="M550 490Q1125 565 1760 445"
                fill="none"
                stroke={brand.orange}
                strokeWidth="18"
                opacity={0.2 + Math.sin(f / 8) * 0.08}
                filter="url(#beam-glow)"
              />
              <path
                d="M550 490Q1125 565 1760 445"
                fill="none"
                stroke={brand.orange}
                strokeWidth="3"
                strokeDasharray="9 8"
              />
              <circle
                cx="1135"
                cy="515"
                r={28 + Math.sin(f / 8) * 4}
                stroke={brand.orange}
                strokeWidth="2"
                fill="#F15A2918"
              />
            </g>
            <g opacity={highlight}>
              {[850, 1070, 1290, 1510].map((x, i) => (
                <path
                  key={x}
                  d={`M${x} ${330 - i * 10}v${120 + Math.sin(f / 16 + i) * 5}`}
                  fill="none"
                  stroke={approved ? brand.green : brand.orange}
                  strokeWidth="3"
                  markerEnd="url(#structural-arrow)"
                />
              ))}
              <path
                d="M825 310L1540 285"
                stroke="#BED0D7"
                fill="none"
                strokeWidth="1"
                strokeDasharray="5 6"
              />
            </g>
            <g opacity={ease(f, 95, 120) * (1 - ease(f, 168, 185))}>
              <path
                d="M1150 535L1250 615H1480"
                stroke="#F15A29"
                fill="none"
                strokeWidth="2"
              />
            </g>
            <g opacity={reinforce}>
              <path
                d="M555 474L1765 428"
                fill="none"
                stroke={approved ? brand.green : brand.orange}
                strokeWidth="3"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - reinforce}
              />
              {[1110, 1500].map((x) => (
                <g key={x}>
                  <path
                    d={`M${x} 535V900`}
                    fill="none"
                    stroke={approved ? brand.green : brand.orange}
                    strokeWidth="3"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset={1 - reinforce}
                  />
                  <path
                    d={`M${x + 25} 615V830`}
                    fill="none"
                    stroke={approved ? brand.green : brand.orange}
                    strokeWidth="2"
                    markerEnd="url(#structural-arrow)"
                  />
                  <path
                    d={`M${x - 25} 900h50`}
                    stroke={approved ? brand.green : brand.orange}
                    strokeWidth="3"
                  />
                </g>
              ))}
            </g>
          </svg>
          <div
            data-engineering-label="primary-beam"
            style={{
              position: "absolute",
              left: 1245,
              top: 615,
              width: 390,
              padding: "14px 20px",
              background: "#14252D",
              borderRadius: 3,
              overflow: "hidden",
              opacity: ease(f, 95, 120) * (1 - ease(f, 168, 185)),
            }}
          >
            <div
              style={{
                fontSize: 20,
                letterSpacing: 2,
                color: "white",
                whiteSpace: "nowrap",
              }}
            >
              PRIMARY STORAGE BEAM
            </div>
            <div style={{ fontSize: 16, color: "#C3D8DF", marginTop: 8 }}>
              Present load → beam → columns
            </div>
          </div>
          <div
            data-engineering-label="additional-supports"
            style={{
              position: "absolute",
              left: 1200,
              top: 715,
              width: 360,
              padding: "14px 20px",
              background: "#14252D",
              borderRadius: 3,
              overflow: "hidden",
              opacity: reinforce,
            }}
          >
            <div
              style={{
                fontSize: 20,
                letterSpacing: 2,
                color: "white",
                whiteSpace: "nowrap",
              }}
            >
              ADDITIONAL SUPPORTS
            </div>
            <div style={{ fontSize: 16, color: "#C3D8DF", marginTop: 8 }}>
              Redistributed load path
            </div>
          </div>
        </div>
      </div>
      <EngineeringStatus scene={2} />
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 850,
          fontSize: 11,
          letterSpacing: 2,
          color: "#AEC6D0",
        }}
      >
        ILLUSTRATIVE STRUCTURAL STRATEGY / NP–S02
      </div>
    </>
  );
};
