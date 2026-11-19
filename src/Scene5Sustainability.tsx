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
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 390,
          width: 610,
          opacity: progress(f, 10, 28),
        }}
      >
        <Status approved={approved}>
          {approved
            ? "SUSTAINABILITY STRATEGY APPROVED"
            : "CHRISTMAS DELIVERY — ENVIRONMENTAL REVIEW"}
        </Status>
        <div style={{ marginTop: 23 }}>
          <SmallLabel>
            {approved
              ? "03 / APPROVED STRATEGY"
              : f < 110
                ? "01 / ENVIRONMENTAL ASSESSMENT"
                : "02 / RENEWABLE DELIVERY CONCEPT"}
          </SmallLabel>
        </div>
        <div style={{ marginTop: 20, width: 475 }}>
          {[
            { name: "ENERGY SOURCE", state: "WIND + SOLAR", at: 100 },
            { name: "DELIVERY PROPULSION", state: "REINDEER POWER", at: 155 },
            { name: "CARBON ASSESSMENT", state: "SCHEMATIC REVIEW", at: 210 },
          ].map((r, i) => (
            <div
              key={r.name}
              style={{
                borderBottom: "1px solid #9CBDC42B",
                padding: "14px 0",
                opacity: progress(f, 18 + i * 12, 38 + i * 12),
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: f > r.at ? brand.green : brand.orange,
                }}
              />
              <div
                style={{
                  flex: 1,
                  fontSize: 12,
                  letterSpacing: 2,
                  color: "#C3D5DF",
                }}
              >
                {r.name}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: f > r.at ? brand.green : "#ACC3CD",
                  fontWeight: 500,
                }}
              >
                {f > r.at ? r.state : "ASSESSING"}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 24,
            color: "#DCE8EB",
            fontSize: 19,
            lineHeight: 1.7,
            maxWidth: 450,
          }}
        >
          {approved
            ? "Renewable energy. Reindeer power. A considered Christmas delivery plan."
            : "Assess the energy source, delivery system and operational carbon boundary."}
        </div>
      </div>
      <AnimatedChristmasTeam
        mode="standing"
        width={1010}
        height={440}
        style={{ left: 825, top: 460, opacity: reveal }}
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
        <rect x="1255" y="270" width="315" height="62" fill="#14252DEB" />
        <text x="1272" y="296" fontSize="18" letterSpacing="2" fill="white">
          INTEGRATED SOLAR PV
        </text>
        <text x="1272" y="320" fontSize="14" fill="#B8D0DC">
          Renewable generation / concept
        </text>
        <path
          d="M875 260L990 190H1195"
          fill="none"
          stroke={brand.orange}
          strokeWidth="2"
        />
        <text x="1000" y="178" fontSize="17" fill="#DBE8EF" letterSpacing="2">
          WIND GENERATION
        </text>
        <path
          d="M1020 825Q1330 800 1680 820"
          stroke="#91B99E"
          strokeWidth="2"
          strokeDasharray="5 10"
          strokeDashoffset={-f}
          fill="none"
        />
      </svg>
      {approved ? (
        <div
          style={{
            position: "absolute",
            left: 100,
            top: 770,
            opacity: progress(f, 265, 285),
            fontSize: 40,
            letterSpacing: 1,
            fontWeight: 600,
            color: brand.orange,
          }}
        >
          A GREENER CHRISTMAS
        </div>
      ) : null}
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
