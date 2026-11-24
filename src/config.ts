import staffPhotoConfig from "./staff-photos.json";
export const FPS = 25;
// Temporary preview switch; subtitle text is retained in the scene definitions below.
export const subtitles = { enabled: false };
export const brand = {
  orange: "#F15A29",
  charcoal: "#30383D",
  paper: "#EEF1EF",
  blue: "#8DA8B2",
  green: "#91B99E",
};
export const scenes = [
  {
    title: "The call",
    duration: 10,
    department: "NORTH POLE OPERATIONS",
    caption: "Santa? As in... the Santa?",
  },
  {
    title: "Clear for landing",
    duration: 13,
    department: "CIVIL ENGINEERING",
    caption: "We have a problem with the runway drainage.",
    resolvedCaption: "Runway drainage resolved. Cleared for takeoff.",
  },
  {
    title: "Built for the big night",
    duration: 13,
    department: "STRUCTURAL ENGINEERING",
    caption: "Has anyone calculated the weight of the presents?",
  },
  {
    title: "A Smarter Way Home",
    duration: 13,
    department: "TRANSPORT ENGINEERING",
    caption: "We’ve identified a slight issue with the M50.",
    secondCaption: "Can the sleigh use the bus lane?",
  },
  {
    title: "A Greener Christmas",
    duration: 13,
    department: "ENVIRONMENT & SUSTAINABILITY",
    caption: "We’re proposing a fully renewable, reindeer-powered system.",
  },
  {
    title: "Mission Christmas — Approved",
    duration: 28,
    department: "MISSION CONTROL",
    caption: "The client wants it by the 24th.",
  },
];
// Paths relative to public/. Only approved, supplied photographs belong here.
export const assets: {
  logo: string | null;
  staff: {
    src: string;
    name: string;
    office: string;
    kind?: "portrait" | "group";
    fit?: "cover" | "contain";
    position?: string;
  }[];
  audio: {
    src: string;
    start: number;
    duration: number;
    volume: number;
    fadeIn?: number;
    fadeOut?: number;
  }[];
} = {
  logo: "assets/branding/dbfl-logo.svg",
  staff: staffPhotoConfig as {
    src: string;
    name: string;
    office: string;
    kind?: "portrait" | "group";
    fit?: "cover" | "contain";
    position?: string;
  }[],
  audio: [],
};
export const audioCues: {
  name: string;
  start: number;
  duration: number;
  src: string | null;
  volume: number;
  fadeIn: number;
  fadeOut: number;
}[] = [
  {
    name: "Incoming call",
    start: 0.8,
    duration: 2.5,
    src: null,
    volume: 0.6,
    fadeIn: 0.05,
    fadeOut: 0.15,
  },
  {
    name: "Call connection",
    start: 3.5,
    duration: 0.5,
    src: null,
    volume: 0.5,
    fadeIn: 0.03,
    fadeOut: 0.15,
  },
  {
    name: "Civil engineering interface",
    start: 10,
    duration: 13,
    src: null,
    volume: 0.25,
    fadeIn: 0.4,
    fadeOut: 0.4,
  },
  {
    name: "Structural warning",
    start: 23.8,
    duration: 2,
    src: null,
    volume: 0.4,
    fadeIn: 0.1,
    fadeOut: 0.3,
  },
  {
    name: "Structural assessment interface",
    start: 26.4,
    duration: 6,
    src: null,
    volume: 0.25,
    fadeIn: 0.3,
    fadeOut: 0.3,
  },
  {
    name: "Structural approval",
    start: 33.4,
    duration: 1.2,
    src: null,
    volume: 0.4,
    fadeIn: 0.05,
    fadeOut: 0.2,
  },
  {
    name: "Traffic ambience",
    start: 36,
    duration: 13,
    src: null,
    volume: 0.2,
    fadeIn: 0.6,
    fadeOut: 0.6,
  },
  {
    name: "Transport route evaluation",
    start: 41.5,
    duration: 5,
    src: null,
    volume: 0.25,
    fadeIn: 0.2,
    fadeOut: 0.3,
  },
  {
    name: "Environmental assessment",
    start: 49,
    duration: 13,
    src: null,
    volume: 0.25,
    fadeIn: 0.4,
    fadeOut: 0.4,
  },
  {
    name: "Mission control approval stamp",
    start: 66.48,
    duration: 1.4,
    src: null,
    volume: 0.65,
    fadeIn: 0.02,
    fadeOut: 0.4,
  },
  {
    name: "Sleigh takeoff",
    start: 69.4,
    duration: 6,
    src: null,
    volume: 0.5,
    fadeIn: 0.3,
    fadeOut: 1,
  },
  {
    name: "Licensed festive background music",
    start: 0,
    duration: 90,
    src: null,
    volume: 0.24,
    fadeIn: 1,
    fadeOut: 2.5,
  },
];
export const totalFrames = scenes.reduce((n, s) => n + s.duration * FPS, 0);
