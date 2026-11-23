import { EngineeringStatus } from "./EngineeringStatus";
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import {
  AnimatedTypography,
  ProjectApproval,
  IsometricBuilding,
  ease,
  SleighAnimation,
  AnimatedMap,
  StaffPhotoMosaic,
  EngineeringDashboard,
  DBFLBranding,
} from "./components";
import { assets, brand } from "./config";
const note: React.CSSProperties = {
  fontSize: 16,
  letterSpacing: 3,
  color: brand.blue,
};
export const Scene1 = () => {
  const f = useCurrentFrame();
  const answered = f > 80;
  return (
    <>
      {f < 145 ? (
        <div
          style={{
            position: "absolute",
            left: 1100,
            top: 175,
            width: 390,
            height: 650,
            border: "3px solid #8299A0",
            borderRadius: 48,
            background: "linear-gradient(160deg,#3F5963,#0C1B23)",
            boxShadow: "35px 45px 80px #0007",
            transform: `perspective(1600px) rotateY(-13deg) rotateZ(${answered ? -4 : Math.sin(f * 0.6) * 1.1}deg) translateY(${(1 - ease(f, 0, 28)) * 500}px)`,
            textAlign: "center",
            padding: 40,
          }}
        >
          <div
            style={{
              width: 120,
              height: 17,
              background: "#071117",
              borderRadius: 20,
              margin: "0 auto 75px",
            }}
          />
          <div style={note}>
            {answered ? "SECURE LINE CONNECTED" : "INCOMING CALL"}
          </div>
          <div style={{ fontSize: 36, lineHeight: 1.3, marginTop: 25 }}>
            NORTH POLE
            <br />
            OPERATIONS
          </div>
          <div
            style={{
              width: 110,
              height: 110,
              border: "1px solid #C4D5D5",
              borderRadius: "50%",
              margin: "55px auto",
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
              background: "#102333",
              boxShadow: "0 0 0 5px #8DA8B21F, 0 8px 24px #0005",
            }}
          >
            <Img
              alt="North Pole workshop caller profile"
              src={staticFile("assets/caller/north-pole-profile.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "50% 50%",
              }}
            />
          </div>
          <div
            style={{
              margin: "0 auto",
              width: 75,
              height: 75,
              borderRadius: "50%",
              background: answered ? brand.orange : brand.green,
              display: "grid",
              placeItems: "center",
              fontSize: 35,
            }}
          >
            ⌕
          </div>
          <div style={{ ...note, marginTop: 25 }}>
            {answered ? "00:0" + Math.floor((f - 80) / 25) : "ACCEPT CALL"}
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: 870,
            top: 245,
            width: 800,
            padding: 50,
            background: "#E9EDE7",
            color: "#263F49",
            transform: `rotate(-3deg) translateX(${(1 - ease(f, 145, 165)) * 1000}px)`,
            boxShadow: "25px 35px 60px #0005",
          }}
        >
          <div style={{ ...note, color: "#536F79" }}>
            ENGINEERING COMMISSION / 001
          </div>
          <h2 style={{ fontSize: 41 }}>PROJECT BRIEF</h2>
          {[
            ["CLIENT", "NORTH POLE OPERATIONS"],
            ["PROJECT", "GLOBAL CHRISTMAS DELIVERY UPGRADE"],
            ["DEADLINE", "24 DECEMBER"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{ padding: "20px 0", borderTop: "1px solid #A2B3B8" }}
            >
              <div style={{ fontSize: 12, letterSpacing: 3 }}>{k}</div>
              <div style={{ fontSize: 25, fontWeight: 600, marginTop: 8 }}>
                {v}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 10 }}>
            <ProjectApproval
              label="URGENT / PRIORITY 01"
              delay={190}
              color="#C74637"
            />
          </div>
        </div>
      )}
      <EngineeringStatus scene={0} />
    </>
  );
};
export { Scene2Analysis as Civil } from "./Scene2Benchmark";
export { Scene3Analysis as Structural } from "./Scene3Structural";
export { Scene4Analysis as Transport } from "./Scene4Transport";
export { Scene5Analysis as Sustainability } from "./Scene5Sustainability";
export { Scene6Finale as Finale } from "./Scene6Finale";
