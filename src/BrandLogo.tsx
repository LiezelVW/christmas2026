import React from "react";
import { Img, staticFile } from "remotion";
import { assets } from "./config";
/** Supplied master SVG, unmodified: original colours, paths and aspect ratio.
 * Clear space is added outside the image, never by altering its viewBox. */
export const BrandLogo = ({ end = false }: { end?: boolean }) => (
  <div
    style={{
      padding: end ? "24px 32px" : "10px 16px",
      flexShrink: 0,
      lineHeight: 0,
    }}
  >
    <Img
      alt="DBFL Consulting Engineers"
      src={staticFile(assets.logo!)}
      style={{ width: end ? 310 : 120, height: "auto", objectFit: "contain" }}
    />
  </div>
);
