import React from "react";
import { brand } from "./config";

const copy = [
  [
    "Santa? As in… the Santa?",
    "We’ve received a rather unusual brief from North Pole Operations.",
    "The deadline? The twenty-fourth of December.",
    "Naturally, we’ve assembled a team.",
  ],
  [
    "First, civil engineering.",
    "Before Santa can take off, we need to make sure the workshop infrastructure is fit for purpose.",
    "We have a problem with the runway drainage.",
  ],
  [
    "Then, structural engineering.",
    "Because when you’re delivering presents to the entire world, load calculations matter.",
    "Has anyone calculated the weight of the presents?",
  ],
  [
    "Next, transport planning.",
    "We’ve assessed the routes, reviewed the traffic and considered every possible obstacle.",
    "We’ve identified a slight issue with the M50.",
    "Can the sleigh use the bus lane?",
  ],
  [
    "Of course, sustainability remains a priority.",
    "We’re proposing a fully renewable, reindeer-powered system.",
    "Subject, naturally, to the relevant approvals.",
  ],
  [
    "After extensive coordination, careful planning and a few last-minute revisions, the project is finally ready.",
    "The client wants it by the twenty-fourth.",
    "And we wouldn’t want to disappoint Santa.",
  ],
];

export const ScriptSidebar = ({
  scene,
  top = 390,
}: {
  scene: number;
  top?: number;
}) => (
  <aside
    data-script-sidebar={scene + 1}
    style={{
      position: "absolute",
      left: 100,
      top,
      width: 565,
      padding: "20px 24px",
      borderLeft: `3px solid ${brand.orange}`,
      background: "#10232EF2",
      color: "#EEF1EF",
      fontSize: 25,
      lineHeight: 1.52,
      fontWeight: 400,
    }}
  >
    {copy[scene].map((text, i) => (
      <p
        key={text}
        style={{
          margin: i === 0 ? 0 : "18px 0 0",
          color: i === 0 ? "#FF976E" : undefined,
        }}
      >
        {text}
      </p>
    ))}
  </aside>
);
