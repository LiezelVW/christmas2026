import { AnimatedChristmasTeam } from "./AnimatedChristmasTeam";
import { EngineeringStatus } from "./EngineeringStatus";
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";
import { assets, brand, FPS } from "./config";
import { BrandLogo } from "./BrandLogo";
import { SnowParticles } from "./components";
import { CinematicPlate, progress, SmallLabel } from "./CampaignDesign";
import { ApprovedRunwayTakeoff } from "./ApprovedRunwayTakeoff";
import { StaffPhotoMosaic } from "./StaffPhotoMosaic";
const reports = [
  {
    label: "CIVIL ENGINEERING",
    thumb: "assets/scene-2/runway-dry-v3.png",
    x: 1108,
    y: 311,
    w: 270,
    h: 140,
  },
  {
    label: "STRUCTURAL ENGINEERING",
    thumb: "assets/scene-3/workshop-reinforced-v1.png",
    x: 1390,
    y: 297,
    w: 300,
    h: 150,
  },
  {
    label: "TRANSPORT ENGINEERING",
    thumb: "assets/scene-4/dublin-night.png",
    x: 1108,
    y: 464,
    w: 270,
    h: 144,
  },
  {
    label: "ENVIRONMENT & SUSTAINABILITY",
    thumb: "assets/scene-5/renewable-north-pole-clean.png",
    x: 1390,
    y: 459,
    w: 300,
    h: 150,
  },
];
const Chrome = ({ label = "MISSION CONTROL" }: { label?: string }) => (
  <>
    <header
      style={{
        position: "absolute",
        top: 58,
        left: 100,
        right: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: 17, letterSpacing: 5 }}>
        OPERATION CHRISTMAS <span style={{ color: brand.orange }}>2026</span>
      </div>
      <BrandLogo />
    </header>
    <div
      style={{
        position: "absolute",
        left: 100,
        top: 185,
        fontSize: 17,
        letterSpacing: 4,
        color: brand.orange,
      }}
    >
      06 / {label}
    </div>
  </>
);
const MissionControl = () => {
  const f = useCurrentFrame();
  const stamp = spring({ frame: f - 112, fps: FPS, config: { damping: 15 } });
  return (
    <AbsoluteFill>
      <CinematicPlate
        src="assets/scene-6/mission-control.png"
        focus="72% 48%"
        zoom={0.035}
        pan={12}
      >
        {reports.map((r, i) => {
          const p = progress(f, 15 + i * 20, 32 + i * 20);
          return (
            <div
              key={r.label}
              style={{
                position: "absolute",
                left: r.x,
                top: r.y,
                width: r.w,
                height: r.h,
                overflow: "hidden",
                transform: "rotate(-1deg)",
                background: "#10222DE8",
                padding: "13px 15px",
              }}
            >
              <Img
                src={staticFile(r.thumb)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.22,
                }}
              />
              <div
                style={{
                  position: "relative",
                  fontSize: 17,
                  lineHeight: 1.3,
                  letterSpacing: 1,
                  maxWidth: 250,
                }}
              >
                {r.label}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 15,
                  right: 15,
                  bottom: 17,
                  color: brand.green,
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: 2,
                  opacity: p,
                }}
              >
                ✓ APPROVED
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: 2,
                  width: `${p * 100}%`,
                  background: brand.green,
                }}
              />
            </div>
          );
        })}
      </CinematicPlate>
      <Chrome />
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 240,
          width: 760,
          fontSize: 64,
          lineHeight: 1.15,
          fontWeight: 600,
          letterSpacing: -2,
        }}
      >
        Mission Christmas
        <br />
        <span style={{ color: brand.orange }}>— Approved</span>
      </div>
      <EngineeringStatus scene={5} top={440} />
      <div
        style={{
          position: "absolute",
          left: 945,
          top: 730,
          padding: "22px 30px",
          border: `5px solid ${brand.green}`,
          color: brand.green,
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: 4,
          background: "#13282DEB",
          opacity: Math.min(1, stamp),
          transform: `rotate(-7deg) scale(${1.55 - stamp * 0.55})`,
        }}
      >
        APPROVED FOR TAKEOFF
      </div>
    </AbsoluteFill>
  );
};
const OriginalPeople = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 50%,#2F4D5B,#14252D 75%)",
        opacity: progress(f, 325, 343) * (1 - progress(f, 540, 565)),
      }}
    >
      <Chrome label="THE PEOPLE BEHIND THE PLANS" />
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 235,
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: -1,
        }}
      >
        From all of us. To all of you.
      </div>
      <StaffPhotoMosaic startFrame={325} />
      <div
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          bottom: 80,
          textAlign: "center",
          fontSize: 17,
          letterSpacing: 4,
          color: "#C1D2D9",
        }}
      >
        DUBLIN · CORK · GALWAY · WATERFORD
      </div>
      <SnowParticles />
    </AbsoluteFill>
  );
};
const People = ({ flypast = false }: { flypast?: boolean }) => {
  const f = useCurrentFrame();
  if (!flypast) return <OriginalPeople />;
  const flightX = interpolate(f, [325, 440], [-2100, 2100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const revealEdge = flightX + 540;
  const mosaicContent = (
    <>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 235,
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: -1,
        }}
      >
        From all of us. To all of you.
      </div>
      <StaffPhotoMosaic startFrame={flypast ? 230 : 325} />
      <div
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          bottom: 80,
          textAlign: "center",
          fontSize: 17,
          letterSpacing: 4,
          color: "#C1D2D9",
        }}
      >
        DUBLIN · CORK · GALWAY · WATERFORD
      </div>
    </>
  );
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 50%,#2F4D5B,#14252D 75%)",
        opacity: progress(f, 325, 343) * (1 - progress(f, 540, 565)),
        overflow: flypast ? "hidden" : undefined,
      }}
    >
      <Chrome label="THE PEOPLE BEHIND THE PLANS" />
      {flypast ? (
        <AbsoluteFill
          data-mosaic-reveal="sleigh-wipe"
          style={{
            maskImage: `linear-gradient(90deg, black ${revealEdge - 75}px, transparent ${revealEdge + 75}px)`,
          }}
        >
          {mosaicContent}
        </AbsoluteFill>
      ) : (
        mosaicContent
      )}
      {flypast && f >= 325 && f < 440 ? (
        <AnimatedChristmasTeam
          mode="flight"
          width={2400}
          height={1000}
          style={{
            left: flightX,
            top: 25 - Math.sin(progress(f, 325, 440) * Math.PI) * 60,
            zIndex: 4,
          }}
        />
      ) : null}
      <SnowParticles />
    </AbsoluteFill>
  );
};
const EndFrame = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 45%,#294653,#14252D 65%)",
        opacity: progress(f, 540, 565),
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 200,
          opacity: progress(f, 545, 575),
          transform: `translateY(${(1 - progress(f, 545, 575)) * 15}px)`,
        }}
      >
        <BrandLogo end />
      </div>
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 150,
          right: 150,
          fontSize: 64,
          fontWeight: 600,
          lineHeight: 1.3,
          letterSpacing: -1.5,
          opacity: progress(f, 560, 595),
        }}
      >
        MERRY CHRISTMAS
        <br />
        FROM ALL OF US AT DBFL
      </div>
      <div
        style={{
          position: "absolute",
          top: 655,
          left: 150,
          right: 150,
          fontSize: 30,
          letterSpacing: 0,
          color: "#D7E4E9",
          opacity: progress(f, 605, 635),
        }}
      >
        <span style={{ fontWeight: 700 }}>Engineering</span>{" "}
        <span style={{ fontWeight: 500 }}>Sustainable</span>{" "}
        <span style={{ fontWeight: 400 }}>Futures.</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 750,
          width: progress(f, 585, 640) * 170,
          height: 3,
          background: brand.orange,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 140,
          fontSize: 15,
          letterSpacing: 5,
          color: brand.orange,
          opacity: progress(f, 620, 650),
        }}
      >
        CHRISTMAS 2026
      </div>
      <div style={{ opacity: 0.35 }}>
        <SnowParticles />
      </div>
    </AbsoluteFill>
  );
};
export const Scene6Finale = ({
  mosaicFlypast = false,
}: {
  mosaicFlypast?: boolean;
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: "#14252D",
        color: "#F4F2EE",
        fontFamily: "Montserrat,Arial,sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{ opacity: progress(f, 0, 12), position: "absolute", inset: 0 }}
      >
        {f < 150 ? <MissionControl /> : null}
        <Sequence
          from={150}
          durationInFrames={175}
          name="Approved runway takeoff"
        >
          <ApprovedRunwayTakeoff />
        </Sequence>

        {f >= 325 && f < 565 ? <People flypast={mosaicFlypast} /> : null}
        {f >= 540 ? <EndFrame /> : null}
      </div>
    </AbsoluteFill>
  );
};
