import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { scenes, FPS, totalFrames, assets, audioCues } from "./config";
import { AnimatedScene } from "./components";
import {
  Scene1,
  Civil,
  Structural,
  Transport,
  Sustainability,
  Finale,
} from "./Scenes";
import "./style.css";
import { Scene2Backdrop } from "./Scene2Benchmark";
import { Scene3Backdrop } from "./Scene3Structural";
import { Scene4Backdrop } from "./Scene4Transport";
import { Scene5Backdrop } from "./Scene5Sustainability";
import { AudioSlotPlayer } from "./AudioTimeline";
const views = [Scene1, Civil, Structural, Transport, Sustainability, Finale];
const Shot = ({ index }: { index: number }) => {
  const f = useCurrentFrame();
  const scene = scenes[index];
  const View = views[index];
  if (index === 5) return <Finale />;
  return (
    <AnimatedScene
      backdrop={
        index === 1 ? (
          <Scene2Backdrop />
        ) : index === 2 ? (
          <Scene3Backdrop />
        ) : index === 3 ? (
          <Scene4Backdrop />
        ) : index === 4 ? (
          <Scene5Backdrop />
        ) : undefined
      }
      snow={index !== 2 && index !== 3}
      index={index}
      title={index === 5 && f > 200 ? "" : scene.title}
      department={scene.department}
      duration={scene.duration * FPS}
      caption={
        index === 2 && f >= 260
          ? undefined
          : index === 1 && f >= 265
            ? scene.resolvedCaption
            : index === 3 && f > 165
              ? scene.secondCaption
              : scene.caption
      }
    >
      <View />
    </AnimatedScene>
  );
};
export const Film = () => {
  let offset = 0;
  return (
    <AbsoluteFill>
      {scenes.map((s, i) => {
        const start = offset;
        offset += s.duration * FPS;
        return (
          <Sequence
            key={s.department}
            from={start}
            durationInFrames={s.duration * FPS}
            name={s.department}
          >
            <Shot index={i} />
          </Sequence>
        );
      })}
      {audioCues.map((c) => (
        <Sequence
          key={c.name}
          from={Math.round(c.start * FPS)}
          durationInFrames={Math.round(c.duration * FPS)}
          name={`AUDIO PLACEHOLDER / ${c.name}`}
        >
          {c.src ? (
            <AudioSlotPlayer slot={{ ...c, src: c.src }} />
          ) : (
            <span style={{ display: "none" }} />
          )}
        </Sequence>
      ))}
      {assets.audio.map((a, i) => (
        <Sequence
          key={i}
          from={Math.round(a.start * FPS)}
          durationInFrames={Math.round(a.duration * FPS)}
          name={a.src}
        >
          <AudioSlotPlayer slot={a} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
const First = () => <Shot index={0} />;
const CivilBenchmark = () => <Shot index={1} />;
const StructuralBenchmark = () => <Shot index={2} />;
const TransportScene = () => <Shot index={3} />;
const SustainabilityScene = () => <Shot index={4} />;
export const Root = () => (
  <>
    <Composition
      id="Christmas2026"
      component={Film}
      durationInFrames={totalFrames}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Scene2Benchmark"
      component={CivilBenchmark}
      durationInFrames={325}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Scene3Benchmark"
      component={StructuralBenchmark}
      durationInFrames={325}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Scene4"
      component={TransportScene}
      durationInFrames={325}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Scene5"
      component={SustainabilityScene}
      durationInFrames={325}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Scene6"
      component={Finale}
      durationInFrames={700}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Scene1"
      component={First}
      durationInFrames={250}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
