import { Config } from "@remotion/cli/config";

// The approved GLB scenes require WebGL 2 in headless Chromium.
Config.setChromiumOpenGlRenderer("angle");
