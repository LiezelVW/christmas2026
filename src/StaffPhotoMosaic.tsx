import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { assets, brand } from "./config";
import { progress } from "./CampaignDesign";
export type StaffPhoto = {
  src: string;
  name: string;
  office: string;
  kind?: "portrait" | "group";
  fit?: "cover" | "contain";
  position?: string;
};
/** Asset-driven layout: groups span 2x2, portraits 1x1; crop settings live in config. */
export const StaffPhotoMosaic = ({
  startFrame = 425,
}: {
  startFrame?: number;
}) => {
  const f = useCurrentFrame() - startFrame;
  const people = assets.staff as StaffPhoto[];
  const data: (StaffPhoto | null)[] = people.length
    ? people
    : Array.from({ length: 200 }, () => null);
  const columns = people.length > 220 ? 28 : 20;
  const units = data.reduce((n, p) => n + (p?.kind === "group" ? 4 : 1), 0);
  const rows =
    Math.ceil(units / columns) +
    (people.some((p) => p.kind === "group") ? 2 : 0);
  const cell = Math.max(6, Math.min(53, (590 - (rows - 1) * 7) / rows));
  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        right: 100,
        top: 290,
        display: "grid",
        gridTemplateColumns: `repeat(${columns},minmax(0,1fr))`,
        gridAutoRows: cell,
        gap: 7,
        gridAutoFlow: "dense",
      }}
    >
      {data.map((person, i) => {
        const p = progress(
          f,
          (i % columns) * 1.5 + Math.floor(i / columns),
          30 + (i % columns) * 1.5 + Math.floor(i / columns),
        );
        return (
          <div
            key={person?.src ?? i}
            style={{
              position: "relative",
              gridColumn: person?.kind === "group" ? "span 2" : undefined,
              gridRow: person?.kind === "group" ? "span 2" : undefined,
              overflow: "hidden",
              border: "1px solid #B0C6CD33",
              background: i % 11 === 0 ? "#9C452C" : "#29424D",
              opacity: p,
              transform: `translateY(${(1 - p) * 22}px) scale(${0.95 + p * 0.05})`,
              boxShadow: "0 4px 9px #0002",
            }}
          >
            {person ? (
              <Img
                alt={person.name}
                src={staticFile(person.src)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit:
                    person.fit ??
                    (person.kind === "group" ? "contain" : "cover"),
                  objectPosition: person.position ?? "50% 40%",
                }}
              />
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  color: "#BED0D6",
                }}
              >
                <span style={{ fontSize: 7, letterSpacing: 1.5 }}>
                  STAFF PHOTO
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: i % 11 === 0 ? "#FFE9DA" : "#D5E2E7",
                  }}
                >
                  {String(i + 1).padStart(3, "0")}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
