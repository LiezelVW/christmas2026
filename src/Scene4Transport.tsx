import { EngineeringStatus } from "./EngineeringStatus";
import React from "react";
import { useCurrentFrame, Img, staticFile } from "remotion";
import { AnimatedChristmasTeam } from "./AnimatedChristmasTeam";
import roads from "./dublin-roads.json";
import { brand } from "./config";
import { CinematicPlate, Status, SmallLabel, progress } from "./CampaignDesign";
export const Scene4Backdrop = () => {
  const f = useCurrentFrame();
  return (
    <CinematicPlate
      src="assets/scene-4/dublin-night.png"
      focus="67% 62%"
      zoom={0.16}
      pan={50}
    >
      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="headlight-glow">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>
        <path
          d="M1060 1100C1330 780 1325 565 1610 330"
          fill="none"
          stroke="#FF9573"
          strokeWidth="4"
          strokeDasharray="2 25"
          strokeDashoffset={-f * 0.35}
          opacity=".65"
          filter="url(#headlight-glow)"
        />
        <path
          d="M1430 1100C1435 800 1390 575 1630 330"
          fill="none"
          stroke="#FFF2D5"
          strokeWidth="3"
          strokeDasharray="3 62"
          strokeDashoffset={f * 3}
          opacity=".8"
          filter="url(#headlight-glow)"
        />
      </svg>
    </CinematicPlate>
  );
};
const geo = (lon: number, lat: number) => ({
  x: 60 + (lon + 6.52) * 0.596 * 1740,
  y: 45 + (53.49 - lat) * 1740,
});
const network = roads.map((r) => ({
  ...r,
  p: r.points.map(([lon, lat]) => geo(lon, lat)),
  d: r.points
    .map(([lon, lat], i) => {
      const p = geo(lon, lat);
      return `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    })
    .join(" "),
}));
const m50 = network.filter((r) => r.ref.includes("M50"));
const sampled = m50.filter((r) => r.p.length > 6).slice(0, 28);
const start = geo(-6.386, 53.353),
  control = geo(-6.32, 53.438),
  end = geo(-6.2603, 53.3498);
const airPath = `M${start.x} ${start.y}Q${control.x} ${control.y} ${end.x} ${end.y}`;
export const Scene4Analysis = () => {
  const f = useCurrentFrame();
  const map = progress(f, 45, 85);
  const route = progress(f, 165, 235);
  const solved = f >= 265;
  const clean = 1 - progress(f, 255, 275);
  const t = progress(f, 205, 265);
  const flight = {
    x: (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t * t * end.x,
    y: (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t * t * end.y,
  };
  return (
    <>
      <EngineeringStatus scene={3} />
      <div
        style={{
          position: "absolute",
          left: 825,
          top: 215,
          width: 985,
          height: 670,
          opacity: map,
          transform: `translateY(${(1 - map) * 35}px) perspective(1800px) rotateY(-4deg)`,
          transformOrigin: "50% 50%",
          background: "linear-gradient(135deg,#122A36EE,#10212BEC)",
          border: "1px solid #A8CDD944",
          boxShadow: "0 30px 80px #0005",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 23,
            left: 30,
            right: 30,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            letterSpacing: 2,
            color: "#D6E5EB",
            zIndex: 2,
          }}
        >
          <span>DUBLIN / M50 NETWORK</span>
          <span style={{ color: solved ? brand.green : brand.orange }}>
            {solved ? "CORRIDOR CLEARED" : "CONGESTION ANALYSIS"}
          </span>
        </div>
        <Img
          src={staticFile("assets/scene-4/dublin-network.svg")}
          style={{
            position: "absolute",
            inset: 0,
            width: 985,
            height: 670,
            objectFit: "contain",
          }}
        />
        <svg
          viewBox="0 0 720 660"
          width="985"
          height="670"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <pattern
              id="map-grid-final"
              width="45"
              height="45"
              patternUnits="userSpaceOnUse"
            >
              <path d="M45 0H0V45" fill="none" stroke="#90AAB211" />
            </pattern>
            <filter id="road-glow">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <marker
              id="route-arrow-final"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto"
            >
              <path d="M0 0L10 5 0 10Z" fill="#91B99E" />
            </marker>
          </defs>
          <rect width="720" height="660" fill="url(#map-grid-final)" />
          {m50.map((r) => (
            <g key={r.id}>
              <path
                d={r.d}
                fill="none"
                stroke={brand.orange}
                strokeWidth="9"
                opacity={0.22 * clean}
                filter="url(#road-glow)"
              />
              <path
                d={r.d}
                fill="none"
                stroke={solved ? "#93B59E" : "#F15A29"}
                strokeWidth="3"
              />
              <path
                d={r.d}
                fill="none"
                stroke={solved ? "#D8EBE1" : "#FFC58F"}
                strokeWidth="1.3"
                strokeDasharray="1 12"
                strokeDashoffset={-f * (solved ? 2 : 0.22)}
              />
            </g>
          ))}
          {sampled.map((r, i) => {
            const q =
              ((f * (solved ? 0.025 : 0.005) + i * 0.37) % 1) *
              (r.p.length - 1);
            const a = r.p[Math.floor(q)],
              b = r.p[Math.min(Math.floor(q) + 1, r.p.length - 1)];
            return (
              <circle
                key={r.id}
                cx={a.x + (b.x - a.x) * (q % 1)}
                cy={a.y + (b.y - a.y) * (q % 1)}
                r="1.6"
                fill={i % 2 ? "#FFF4D5" : "#FF8E65"}
              />
            );
          })}
          <path
            d={airPath}
            fill="none"
            stroke="#91B99E33"
            strokeWidth="12"
            opacity={route}
          />
          <path
            d={airPath}
            fill="none"
            stroke={brand.green}
            strokeWidth="3"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - route}
            markerEnd="url(#route-arrow-final)"
          />
          {[
            ["DUBLIN", -6.2603, 53.3498],
            ["AIRPORT", -6.2499, 53.4264],
            ["WEST-LINK", -6.386, 53.353],
            ["RED COW", -6.3694, 53.3203],
          ].map(([name, lon, lat]) => {
            const p = geo(Number(lon), Number(lat));
            return (
              <g key={name}>
                <circle cx={p.x} cy={p.y} r="4" fill="#F2EFE6" />
                <text
                  x={p.x + 10}
                  y={p.y - 9}
                  fill="#E7F0F2"
                  fontSize="12"
                  letterSpacing="1.3"
                >
                  {name}
                </text>
              </g>
            );
          })}
          <text x="160" y="455" fill="#F7AD83" fontSize="20" letterSpacing="3">
            M50
          </text>
          <text x="370" y="520" fill="#AAC3CE" fontSize="12" letterSpacing="2">
            SLEIGH FLIGHT CORRIDOR / CONCEPT
          </text>
        </svg>
        {route > 0 ? (
          <div style={{ position: "absolute", inset: 0, opacity: route }}>
            <AnimatedChristmasTeam
              mode="flight"
              width={250}
              height={145}
              style={{
                left: (flight.x * 985) / 720 - 125,
                top: (flight.y * 670) / 660 - 72,
              }}
            />
          </div>
        ) : null}
        <div
          style={{
            position: "absolute",
            bottom: 19,
            left: 30,
            right: 30,
            fontSize: 10,
            letterSpacing: 1,
            color: "#93ACB9",
          }}
        >
          © OpenStreetMap contributors · ODbL · Geographic road geometry /
          illustrative traffic
        </div>
      </div>
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
        ILLUSTRATIVE AERIAL + GEOGRAPHIC NETWORK / NP–T03
      </div>
    </>
  );
};
