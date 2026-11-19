import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { assets, brand, FPS } from "./config";
export const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
export const AnimatedTypography: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const f = useCurrentFrame();
  const p = spring({ frame: f - delay, fps: FPS, config: { damping: 22 } });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 45}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
export const SnowParticles = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 70 }, (_, i) => (
        <i
          key={i}
          style={{
            position: "absolute",
            left: ((i * 173.23) % 1920) + Math.sin(f / 80 + i) * 24,
            top: ((i * 91 + f * (0.4 + (i % 4) * 0.22)) % 1120) - 20,
            width: 2 + (i % 4),
            height: 2 + (i % 4),
            borderRadius: "50%",
            background: "white",
            opacity: 0.12 + (i % 5) * 0.08,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
export { BrandLogo as DBFLBranding } from "./BrandLogo";
import { BrandLogo as DBFLBranding } from "./BrandLogo";
export const TechnicalBlueprint = () => {
  const f = useCurrentFrame();
  return (
    <svg
      width="1920"
      height="1080"
      style={{ position: "absolute", inset: 0, opacity: 0.16 }}
    >
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M60 0H0V60" fill="none" stroke="#8DA8B2" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="1920" height="1080" fill="url(#grid)" />
      <circle
        cx="1390"
        cy="500"
        r={340 + Math.sin(f / 80) * 8}
        fill="none"
        stroke="#8DA8B2"
      />
      <path
        d="M80 850H1840M1390 100V920"
        stroke="#8DA8B2"
        strokeDasharray="5 14"
      />
    </svg>
  );
};
export const AnimatedScene: React.FC<{
  children: React.ReactNode;
  index: number;
  title: string;
  department: string;
  duration: number;
  backdrop?: React.ReactNode;
  snow?: boolean;
}> = ({
  children,
  index,
  title,
  department,
  duration,
  backdrop,
  snow = true,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: "#14252D",
        color: brand.paper,
        fontFamily: "Montserrat, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, #34505A55, transparent 65%)",
        }}
      />
      {backdrop ?? <TechnicalBlueprint />}
      <div
        style={{
          opacity: ease(f, 0, 12) * (1 - ease(f, duration - 10, duration)),
          height: "100%",
        }}
      >
        <header
          style={{
            position: "absolute",
            left: 100,
            right: 100,
            top: 58,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 17, letterSpacing: 5 }}>
            OPERATION CHRISTMAS{" "}
            <span style={{ color: brand.orange }}>2026</span>
          </div>
          <DBFLBranding />
        </header>
        {title ? (
          <div style={{ position: "absolute", top: 185, left: 100, zIndex: 3 }}>
            <AnimatedTypography
              style={{
                fontSize: 17,
                letterSpacing: 4,
                color: brand.orange,
                marginBottom: 24,
              }}
            >
              {String(index + 1).padStart(2, "0")} / {department}
            </AnimatedTypography>
            <AnimatedTypography
              delay={6}
              style={{
                fontSize: 66,
                fontWeight: 600,
                letterSpacing: -3,
                maxWidth: 750,
                lineHeight: 1.12,
              }}
            >
              {title}
            </AnimatedTypography>
          </div>
        ) : null}
        {children}
        <footer
          style={{
            position: "absolute",
            bottom: 40,
            left: 100,
            right: 100,
            fontSize: 12,
            letterSpacing: 3,
            color: brand.blue,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>DBFL CONSULTING ENGINEERS / NORTH POLE COMMISSION</span>
          <span>24 DEC 2026 · REV 06</span>
        </footer>
      </div>

      {snow ? <SnowParticles /> : null}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 4,
          width: `${(f / duration) * 100}%`,
          background: brand.orange,
        }}
      />
    </AbsoluteFill>
  );
};
export const ProjectApproval = ({
  label = "APPROVED",
  delay = 0,
  color = brand.green,
}: {
  label?: string;
  delay?: number;
  color?: string;
}) => {
  const f = useCurrentFrame();
  const p = spring({ frame: f - delay, fps: FPS, config: { damping: 14 } });
  return (
    <div
      style={{
        display: "inline-block",
        padding: "15px 24px",
        border: `4px solid ${color}`,
        color,
        fontWeight: 700,
        fontSize: 27,
        letterSpacing: 3,
        opacity: p,
        transform: `rotate(-8deg) scale(${1.8 - p * 0.8})`,
      }}
    >
      {label}
    </div>
  );
};
export const IsometricBuilding = ({
  reinforced = false,
}: {
  reinforced?: boolean;
}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(0 ${Math.sin(f / 50) * 2})`}>
      <path d="M-270 0L0-140 310 0 40 155Z" fill="#E1E7E5" />
      <path d="M-270 0V210L40 365V155Z" fill="#647D86" />
      <path d="M40 155V365L310 210V0Z" fill="#3A5661" />
      <path
        d="M-300-15L0-180 340-15 40 160Z"
        fill="#F5F5E9"
        stroke="#AEC2C5"
        strokeWidth="3"
      />
      {[-200, -100, 0].map((x) => (
        <path
          key={x}
          d={`M${x} ${90 + x * 0.5}v150`}
          stroke={reinforced ? brand.orange : "#B4C8C9"}
          strokeWidth={reinforced ? 14 : 6}
        />
      ))}
      {[100, 180, 260].map((x) => (
        <path
          key={x}
          d={`M${x} ${135 - (x - 40) * 0.5}v200`}
          stroke={reinforced ? brand.orange : "#8EAAB2"}
          strokeWidth={reinforced ? 14 : 6}
        />
      ))}
      <text x="-180" y="185" fill="white" fontSize="22" transform="skewY(27)">
        NORTH POLE / WORKSHOP
      </text>
    </g>
  );
};
export const SleighAnimation = ({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) => {
  const f = useCurrentFrame();
  return (
    <g
      transform={`translate(${x} ${y + Math.sin(f / 8) * 7}) scale(${scale})`}
      fill="#F15A29"
    >
      <path
        d="M0 25h115l25-50h-35L90 0H0ZM-10 42q80 45 155-5"
        fill="none"
        stroke="#F15A29"
        strokeWidth="8"
      />
      <circle cx="50" cy="-18" r="16" />
      <path d="M40-35l20-35 18 38Z" />
      {[210, 320, 430].map((r, i) => (
        <g key={r} transform={`translate(${r},${Math.sin(f / 7 + i) * 7})`}>
          <ellipse rx="36" ry="14" />
          <path
            d="M20 0l18-35 13 5M-20 7l-20 26M20 7l18 23M40-35l-4-23m4 23 20-17"
            fill="none"
            stroke="#F15A29"
            strokeWidth="6"
          />
        </g>
      ))}
      <path
        d="M130 5Q260 25 430 0"
        fill="none"
        stroke="#D9D3BB"
        strokeWidth="2"
      />
    </g>
  );
};
export const StaffPhotoMosaic = () => {
  const f = useCurrentFrame();
  const count = assets.staff.length || 200;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(20, 1fr)",
        gap: 7,
        width: 1720,
        opacity: 0.8,
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const person = assets.staff[i];
        return (
          <div
            key={person?.src || i}
            style={{
              height: 48,
              background: i % 7 === 0 ? "#F15A29" : "#3A5661",
              opacity: ease(f, (i % 20) * 2, 30 + (i % 20) * 2),
              transform: `translateY(${(1 - ease(f, (i % 20) * 2, 30 + (i % 20) * 2)) * 40}px)`,
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
            }}
          >
            {person ? (
              <Img
                src={staticFile(person.src)}
                alt={person.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: 12, color: "#B9CCD1" }}>
                {String(i + 1).padStart(3, "0")}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
export const EngineeringDashboard = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: 770, display: "grid", gap: 16 }}>
      {["CIVIL", "STRUCTURAL", "TRANSPORT", "ENVIRONMENT"].map((d, i) => (
        <div
          key={d}
          style={{
            padding: "22px 26px",
            border: "1px solid #78939A55",
            background: "#253E47",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 23,
            opacity: ease(f, i * 18, i * 18 + 15),
          }}
        >
          <span>{d}</span>
          <span style={{ color: brand.green }}>✓ APPROVED</span>
        </div>
      ))}
    </div>
  );
};
export const AnimatedMap = () => {
  const f = useCurrentFrame();
  const solution = f > 160;
  return (
    <svg viewBox="0 0 900 660" width="1000" height="730">
      <path
        d="M380 35l90 40 70-15 40 80-30 60 40 65-15 90-60 25 10 80-85 60-40 80-100-15-55 30-65-50 45-55-15-65 55-40-20-65 55-50-10-65 60-40Z"
        fill="#314D57"
        stroke="#A6BFC5"
        strokeWidth="3"
      />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${260 + i * 35} ${500 - i * 20}Q${500 - i * 50} ${350 - i * 50} 543 260`}
          fill="none"
          stroke="#819CA4"
          strokeWidth="2"
          strokeDasharray="8 10"
          strokeDashoffset={-f * 0.5}
        />
      ))}
      <path
        d="M543 240C460 250 470 360 545 400"
        fill="none"
        stroke={solution ? brand.green : brand.orange}
        strokeWidth="12"
      />
      <path
        d="M545 400Q680 340 543 240"
        fill="none"
        stroke={brand.orange}
        strokeWidth="4"
        strokeDasharray="12 9"
        strokeDashoffset={-f * 2}
      />
      <circle cx="543" cy="260" r="8" fill="white" />
      <text x="570" y="270" fill="white" fontSize="24">
        DUBLIN
      </text>
      <text x="400" y="330" fill="white" fontSize="20">
        M50
      </text>
      <circle
        cx={543 + 110 * Math.sin(f / 60)}
        cy={320 + 80 * Math.cos(f / 60)}
        r="8"
        fill={brand.orange}
      />
      <text x="100" y="610" fill={brand.blue} fontSize="16">
        SCHEMATIC ROUTE STUDY / NOT FOR NAVIGATION
      </text>
    </svg>
  );
};
