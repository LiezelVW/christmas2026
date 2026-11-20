import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BrandLogo } from "./BrandLogo";

const p = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
const Icon = ({ kind, size = 28 }: { kind: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {kind === "camera" ? (
      <>
        <rect x="3" y="6" width="12" height="12" rx="3" />
        <path d="m15 10 6-4v12l-6-4" />
      </>
    ) : kind === "phone" ? (
      <path d="M5 3 3 5c-1 5 11 17 16 16l2-2-5-4-3 2-6-6 2-3Z" />
    ) : kind === "mic" ? (
      <>
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M6 10v2a6 6 0 0 0 12 0v-2M12 18v4M8 22h8" />
      </>
    ) : kind === "people" ? (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 20v-3c0-5 12-5 12 0v3M16 3a3 3 0 0 1 0 6M18 13c4 0 4 4 4 7" />
      </>
    ) : kind === "share" ? (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="m8 10 4-4 4 4M12 6v10" />
      </>
    ) : kind === "chat" ? (
      <>
        <path d="M4 4h16v12H9l-5 4Z" />
        <path d="M8 8h8M8 12h5" />
      </>
    ) : (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    )}
  </svg>
);
const SantaProfile = ({ size }: { size: number }) => (
  <div
    aria-label="Santa caller profile photograph"
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      position: "relative",
      background: "radial-gradient(circle,#9D5543,#382338)",
      flexShrink: 0,
    }}
  >
    <Img
      src={staticFile("assets/scene-6/sleigh-team.png")}
      style={{
        position: "absolute",
        width: (size * 1672) / 160,
        height: (size * 941) / 160,
        maxWidth: "none",
        left: (-size * 200) / 160,
        top: (-size * 285) / 160,
      }}
    />
  </div>
);
const Name = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: "absolute",
      bottom: 18,
      left: 18,
      padding: "8px 13px",
      background: "#111C",
      borderRadius: 5,
      fontSize: 18,
    }}
  >
    {children}
  </div>
);
export const TeamsCallIntro = () => {
  const f = useCurrentFrame();
  const joined = f >= 75;
  const toast = p(f, 8, 18) * (1 - p(f, 69, 77));
  const deadline = p(f, 175, 190);
  return (
    <AbsoluteFill
      style={{
        background: "#10232E",
        color: "#FFF",
        fontFamily: "Montserrat,Arial,sans-serif",
        opacity: p(f, 0, 8) * (1 - p(f, 242, 250)),
      }}
    >
      <header
        style={{
          height: 100,
          padding: "22px 72px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 17, letterSpacing: 5 }}>
          OPERATION CHRISTMAS <span style={{ color: "#F15A29" }}>2026</span>
        </div>
        <BrandLogo />
      </header>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 112,
          bottom: 65,
          border: "1px solid #5B646B",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 24px 70px #0008",
          background: "#202020",
          fontFamily: "Arial,sans-serif",
        }}
      >
        <div
          style={{
            height: 44,
            background: "#121212",
            padding: "13px 22px",
            fontSize: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>
            Microsoft Teams ·{" "}
            {joined
              ? "Santa | North Pole Operations"
              : "John Hayes | DBFL Consulting Engineers"}
          </span>
          <span style={{ letterSpacing: 22 }}>— □ ×</span>
        </div>
        <div
          style={{
            height: 94,
            background: "#292929",
            borderBottom: "1px solid #454545",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 30px",
          }}
        >
          <div style={{ fontSize: 19, color: "#D2D2D2" }}>
            {joined
              ? `00:0${Math.floor((f - 75) / 25)}`
              : "Ready for your next call"}
          </div>
          <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
            {["chat", "people", "camera", "mic", "share"].map((kind, i) => (
              <div
                key={kind}
                style={{
                  display: "grid",
                  justifyItems: "center",
                  gap: 9,
                  fontSize: 14,
                }}
              >
                <Icon kind={kind} />
                <span>{["Chat", "People", "Camera", "Mic", "Share"][i]}</span>
              </div>
            ))}
            <div
              style={{
                color: "#EF6F7C",
                display: "grid",
                justifyItems: "center",
                gap: 9,
                fontSize: 14,
              }}
            >
              <Icon kind="phone" />
              <span>Leave</span>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            inset: "158px 22px 22px",
            display: "flex",
            gap: 18,
            opacity: joined ? p(f, 75, 84) : 0.25,
          }}
        >
          <div
            style={{
              flex: 1,
              position: "relative",
              borderRadius: 8,
              overflow: "hidden",
              background: "#343434",
            }}
          >
            <Img
              src={staticFile("assets/staff-mosaic/staff-125.jpg")}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(30px) brightness(.4)",
                transform: "scale(1.1)",
              }}
            />
            <Img
              alt="John Hayes, DBFL"
              src={staticFile("assets/staff-mosaic/staff-125.jpg")}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
            <Name>John Hayes · DBFL</Name>
          </div>
          <div
            style={{
              width: 490,
              position: "relative",
              borderRadius: 8,
              background: "#302E42",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 25,
            }}
          >
            <SantaProfile size={220} />
            <div style={{ fontSize: 30, fontWeight: 600 }}>Santa</div>
            <div style={{ fontSize: 19, color: "#C8C5DB" }}>
              North Pole Operations
            </div>
            <Name>Santa · North Pole Operations</Name>
          </div>
        </div>
        {!joined ? (
          <div
            style={{
              position: "absolute",
              inset: 138,
              background: "#17172180",
              backdropFilter: "blur(8px)",
            }}
          />
        ) : null}
        {f < 77 ? (
          <div
            style={{
              position: "absolute",
              width: 650,
              height: 426,
              left: "50%",
              top: "50%",
              marginLeft: -325,
              marginTop: -160,
              borderRadius: 14,
              border: "1px solid #76717E",
              background: "linear-gradient(145deg,#514F64,#302E41)",
              boxShadow: "0 25px 90px #000A",
              padding: "24px 28px",
              opacity: toast,
              transform: `translateY(${(1 - p(f, 8, 18)) * 18}px)`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 19,
              }}
            >
              <span>▣ &nbsp; Microsoft Teams</span>
              <span>··· &nbsp; ×</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 24,
              }}
            >
              <SantaProfile size={135} />
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: 19,
                fontSize: 25,
                fontWeight: 600,
              }}
            >
              Santa (North Pole Operations)
            </div>
            <div style={{ textAlign: "center", fontSize: 21, marginTop: 9 }}>
              is calling you
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 29 }}>
              {["camera", "phone", "phone"].map((kind, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 59,
                    borderRadius: 6,
                    display: "grid",
                    placeItems: "center",
                    background:
                      i === 2
                        ? "#C72F42"
                        : i === 0 && f >= 64
                          ? "#8680DE"
                          : "#6259B4",
                    boxShadow:
                      i === 0 && f >= 64 ? "0 0 0 4px #C8C3FF" : "none",
                  }}
                >
                  <Icon kind={kind} />
                </div>
              ))}
            </div>
            {f >= 43 ? (
              <svg
                width="44"
                height="50"
                viewBox="0 0 44 50"
                style={{
                  position: "absolute",
                  left: 100 + (1 - p(f, 43, 63)) * 150,
                  top: 355 + (1 - p(f, 43, 63)) * 75,
                  filter: "drop-shadow(0 2px 3px #000)",
                }}
              >
                <path
                  d="M5 3v35l9-8 8 16 7-4-8-15 13-2Z"
                  fill="white"
                  stroke="#252525"
                  strokeWidth="2"
                />
              </svg>
            ) : null}
          </div>
        ) : null}
        {joined ? (
          <div
            style={{
              position: "absolute",
              right: 56,
              bottom: 43,
              padding: "16px 21px",
              borderLeft: "4px solid #F15A29",
              background: "#12232FF5",
              opacity: deadline,
              fontFamily: "Montserrat,Arial,sans-serif",
            }}
          >
            <div style={{ fontSize: 14, letterSpacing: 3, color: "#FF976E" }}>
              THE DEADLINE
            </div>
            <div style={{ fontSize: 29, fontWeight: 600, marginTop: 7 }}>
              24 December
            </div>
          </div>
        ) : null}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 25,
          left: 74,
          fontSize: 12,
          letterSpacing: 3,
          color: "#9AB2BD",
        }}
      >
        DBFL CONSULTING ENGINEERS / NORTH POLE COMMISSION
      </div>
    </AbsoluteFill>
  );
};
