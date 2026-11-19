import { useEffect, useState } from "react";
import {
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";

let fontReady: Promise<FontFace> | undefined;
export const useBrandFont = () => {
  const [handle] = useState(() =>
    delayRender("Loading DBFL Montserrat typography"),
  );
  useEffect(() => {
    // Start after Remotion initializes its render handles, then share one load.
    fontReady ??= new FontFace(
      "Montserrat",
      `url("${staticFile("assets/fonts/Montserrat.ttf")}")`,
      { weight: "100 900", style: "normal" },
    )
      .load()
      .then((font) => {
        document.fonts.add(font);
        return font;
      });
    fontReady.then(() => continueRender(handle)).catch(cancelRender);
  }, [handle]);
};
