import React from "react";
import { Audio, staticFile } from "remotion";
import { FPS } from "./config";
export type AudioSlot = {
  src: string;
  start: number;
  duration: number;
  volume: number;
  fadeIn?: number;
  fadeOut?: number;
};
export const AudioSlotPlayer = ({ slot }: { slot: AudioSlot }) => (
  <Audio
    src={staticFile(slot.src)}
    volume={(frame) => {
      const length = Math.round(slot.duration * FPS);
      const head = Math.max(1, Math.round((slot.fadeIn ?? 0.15) * FPS));
      const tail = Math.max(1, Math.round((slot.fadeOut ?? 0.3) * FPS));
      return (
        slot.volume *
        Math.max(0, Math.min(1, frame / head, (length - frame) / tail))
      );
    }}
  />
);
