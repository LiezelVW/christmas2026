import { EngineeringStatus } from "./EngineeringStatus";
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { CinematicPlate, Status, SmallLabel, progress } from "./CampaignDesign";
import { AnimatedChristmasTeam } from "./AnimatedChristmasTeam";
import { brand } from "./config";
export const Scene5Backdrop = () => {
  const f = useCurrentFrame();
  return (
    <CinematicPlate
      src="assets/scene-5/renewable-north-pole-clean.png"
      focus="68% 50%"
      zoom={0.07}
      pan={20}
    >
      {[
        { x: 875, y: 230, w: 230 },
        { x: 586, y: 331, w: 135 },
        { x: 346, y: 400, w: 95 },
      ].map((r, i) => (
        <div
          key={r.x}
          style={{
            position: "absolute",
            left: r.x - r.w * 0.5,
            top: r.y - r.w * 0.58,
            width: r.w,
            height: r.w,
            transform: `rotate(${f * (0.75 + i * 0.12) + i * 35}deg)`,
            transformOrigin: "50% 58%",
          }}
        >
          <Img
            src={staticFile("assets/scene-5/turbine-rotor.png")}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ))}
    </CinematicPlate>
  );
};
export const Scene5Analysis = () => {
  const f = useCurrentFrame();
  const approved = f >= 265;
  const reveal = progress(f, 65, 135);
  const annotations = progress(f, 100, 130) * (1 - progress(f, 250, 270));
  return (
    <>
      <EngineeringStatus scene={4} />
      <Img
        data-label="reindeer-delivery"
        alt="Reindeer-powered delivery; wind and solar for the workshop"
        src={staticFile("assets/annotations/reindeer-delivery.svg")}
        style={{
          position: "absolute",
          left: 100,
          top: 520,
          width: 565,
          height: 84,
          opacity: reveal,
        }}
      />
      <AnimatedChristmasTeam
        mode="parked"
        width={1220}
        height={520}
        style={{ left: 650, top: 420, opacity: reveal }}
      />
      <svg
        width="1920"
        height="1080"
        style={{
          position: "absolute",
          inset: 0,
          opacity: annotations,
          pointerEvents: "none",
        }}
      >
        <path
          d="M1110 400L1260 323H1450"
          fill="none"
          stroke={brand.orange}
          strokeWidth="2"
        />
        <path
          d="M875 260L990 190H1195"
          fill="none"
          stroke={brand.orange}
          strokeWidth="2"
        />
      </svg>
      <Img
        data-label="solar-pv"
        alt="Integrated solar PV: renewable generation concept"
        src={staticFile("assets/annotations/solar-pv.svg")}
        style={{
          position: "absolute",
          left: 1255,
          top: 270,
          width: 340,
          height: 72,
          opacity: annotations,
        }}
      />
      <Img
        data-label="wind-generation"
        alt="Wind generation"
        src={staticFile("assets/annotations/wind-generation.svg")}
        style={{
          position: "absolute",
          left: 990,
          top: 150,
          width: 260,
          height: 48,
          opacity: annotations,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 100,
          top: 850,
          fontSize: 11,
          letterSpacing: 2,
          color: "#A9BFCA",
        }}
      >
        ILLUSTRATIVE ENVIRONMENTAL STRATEGY / NP–E04
      </div>
    </>
  );
};
