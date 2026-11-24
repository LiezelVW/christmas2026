import {
  poseSantaReinWrists,
  poseSantaGripGloves,
  updateSantaReinGrips,
  type ReinGrips,
} from "./SantaWrist";
import React, { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
  cancelRender,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as T from "three";
import {
  GLTFLoader,
  type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

type Bundle = { deer: GLTF; santa: GLTF; sleigh: GLTF };
const DIR = new T.Vector3(0, 1, 0);
const bone = (root: T.Object3D, name: string) => {
  const b = root.getObjectByName(name);
  if (!b) throw Error("Required joint missing: " + name);
  return b;
};
const direction = (b: T.Object3D, v: T.Vector3) => {
  b.parent?.updateWorldMatrix(true, false);
  const parent =
    b.parent?.getWorldQuaternion(new T.Quaternion()) ?? new T.Quaternion();
  b.quaternion.copy(
    parent
      .invert()
      .multiply(new T.Quaternion().setFromUnitVectors(DIR, v.normalize())),
  );
  b.updateMatrixWorld(true);
};
export const prepare = (root: T.Object3D) => {
  root.traverse((o) => {
    if (o instanceof T.Mesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      const ms = Array.isArray(o.material) ? o.material : [o.material];
      ms.forEach((m) => {
        if (m instanceof T.MeshStandardMaterial) {
          m.roughness = Math.max(0.4, m.roughness);
          m.envMapIntensity = 0.75;
        }
      });
    }
  });
  return root;
};

/** Retimed skeletal source tracks. Fore and hind pairs have separate phase offsets;
 * four animals also run at slightly different phases. No mesh is translated in lieu of limb motion. */
const Reindeer = ({
  gltf,
  x,
  z,
  phase,
  index,
}: {
  gltf: GLTF;
  x: number;
  z: number;
  phase: number;
  index: number;
}) => {
  const frame = useCurrentFrame(),
    time = frame / 25;
  const rig = useMemo(() => {
    const root = prepare(clone(gltf.scene));
    const source = gltf.animations.find((a) => a.name === "trot");
    if (!source) throw Error("Reindeer trot animation missing");
    const limbs = [
      [
        "shoulder_L",
        "upperarm_L",
        "forearm_L",
        "front_cannon_L",
        "front_hoof_L",
      ],
      [
        "shoulder_R",
        "upperarm_R",
        "forearm_R",
        "front_cannon_R",
        "front_hoof_R",
      ],
      ["thigh_L", "shin_L", "hind_cannon_L", "hind_hoof_L"],
      ["thigh_R", "shin_R", "hind_cannon_R", "hind_hoof_R"],
    ];
    const all = new Set(limbs.flat());
    const specs = [
      ...limbs.map((names, i) => ({
        names: new Set(names),
        offset: [0, 0.58, 0.02, 0.58][i],
      })),
      {
        names: new Set(
          source.tracks
            .map((t) => t.name.split(".")[0])
            .filter((n) => !all.has(n)),
        ),
        offset: 0,
      },
    ];
    const idle = new T.AnimationMixer(root);
    idle.clipAction(gltf.animations.find((a) => a.name === "idle")!).play();
    const mixers = specs.map((s, i) => {
      const clip = new T.AnimationClip(
        "airborne_" + i,
        source.duration,
        source.tracks.filter((t) => s.names.has(t.name.split(".")[0])),
      );
      const m = new T.AnimationMixer(root);
      m.clipAction(clip).play();
      return { m, action: m.clipAction(clip), offset: s.offset };
    });
    return { root, mixers, idle, duration: source.duration };
  }, [gltf]);
  const airborne = smooth(4 + (index < 2 ? 0.17 : 0), 5.15, time);
  const cycle = gaitTime(time) + phase;
  const run = smooth(1.85, 2.3, time);
  rig.idle.setTime(time * 0.65 + phase);
  // Blend from idle into actual source joint tracks, then phase the limbs into a flying bound.
  for (const r of rig.mixers) {
    r.action.setEffectiveWeight(run);
    r.m.setTime(cycle + r.offset * rig.duration * airborne);
  }
  rig.root.updateMatrixWorld(true);
  const hoofY = Math.min(
    ...HOOVES.map(
      (n) =>
        rig.root.worldToLocal(
          bone(rig.root, n).getWorldPosition(new T.Vector3()),
        ).y,
    ),
  );
  const groundOffset = 0.092 - hoofY;
  bone(rig.root, "neck").rotateX(Math.sin(cycle * 10) * 0.018 * run);
  bone(rig.root, "head").rotateX(Math.sin(cycle * 10 + 0.65) * 0.012 * run);
  rig.root.updateMatrixWorld(true);
  const lift = deerLift(time, index);
  return (
    <group
      position={[x, groundOffset + lift, z]}
      rotation={[-0.11 * airborne, 0, 0.012 * Math.sin(cycle * 9) * airborne]}
    >
      <primitive object={rig.root} />
      <Harness />
      <Breath time={time} phase={phase} />
    </group>
  );
};

export const Santa = ({
  gltf,
  grips,
  reinTransform,
}: {
  gltf: GLTF;
  grips?: ReinGrips;
  reinTransform?: T.Matrix4;
}) => {
  const frame = useCurrentFrame(),
    t = frame / 25;
  const rig = useMemo(() => {
    const root = prepare(clone(gltf.scene));
    poseSantaGripGloves(root);
    const rest = new Map<
      T.Object3D,
      { p: T.Vector3; q: T.Quaternion; s: T.Vector3 }
    >();
    root.traverse((o) => {
      if (o instanceof T.Bone)
        rest.set(o, {
          p: o.position.clone(),
          q: o.quaternion.clone(),
          s: o.scale.clone(),
        });
    });
    return { root, rest };
  }, [gltf]);
  const root = rig.root;
  for (const [joint, rest] of rig.rest) {
    joint.position.copy(rest.p);
    joint.quaternion.copy(rest.q);
    joint.scale.copy(rest.s);
  }
  const hips = bone(root, "Hips");
  hips.position.y = 94.1162;
  hips.rotation.set(0.025 * Math.sin(t * 2.7), 0, 0.02 * Math.sin(t * 2.2));
  root.updateMatrixWorld(true);
  direction(bone(root, "LeftUpLeg"), new T.Vector3(0.16, -0.05, 1));
  direction(bone(root, "RightUpLeg"), new T.Vector3(-0.16, -0.05, 1));
  direction(bone(root, "LeftLeg"), new T.Vector3(0.03, -1, 0.12));
  direction(bone(root, "RightLeg"), new T.Vector3(-0.03, -1, 0.12));
  direction(bone(root, "LeftFoot"), new T.Vector3(0, -0.1, 1));
  direction(bone(root, "RightFoot"), new T.Vector3(0, -0.1, 1));
  direction(bone(root, "LeftArm"), new T.Vector3(0.1, -0.62, 0.8));
  direction(bone(root, "RightArm"), new T.Vector3(-0.1, -0.62, 0.8));
  direction(bone(root, "LeftForeArm"), new T.Vector3(-0.08, 0.12, 1));
  direction(bone(root, "RightForeArm"), new T.Vector3(0.08, 0.12, 1));
  direction(
    bone(root, "Head"),
    new T.Vector3(0.025 * Math.sin(t * 2), 1, 0.08),
  );
  // Gentle torso and arm movement, independent of the sleigh's global bank.
  bone(root, "Spine").rotateX(0.035 * Math.sin(t * 3.1));
  bone(root, "LeftForeArm").rotateX(0.018 * Math.sin(t * 3.4));
  bone(root, "RightForeArm").rotateX(0.018 * Math.sin(t * 3.4 + 0.4));
  poseSantaReinWrists(root);
  if (grips && reinTransform) updateSantaReinGrips(root, grips, reinTransform);
  root.updateMatrixWorld(true);
  return (
    <group position={[0, -0.06, -3.2]}>
      <primitive object={root} />
    </group>
  );
};

const Rein = ({
  from,
  to,
  phase = 0,
  taut = 0,
}: {
  from: [number, number, number];
  to: [number, number, number];
  phase?: number;
  taut?: number;
}) => {
  const frame = useCurrentFrame();
  const geometry = useMemo(
    () =>
      new T.TubeGeometry(
        new T.CatmullRomCurve3([
          new T.Vector3(...from),
          new T.Vector3(
            (from[0] + to[0]) / 2,
            (from[1] + to[1]) / 2 -
              (0.16 * (1 - taut) + 0.025) +
              Math.sin(frame * 0.12 + phase) * 0.025 * (1 - taut),
            (from[2] + to[2]) / 2,
          ),
          new T.Vector3(...to),
        ]),
        36,
        0.009,
        5,
        false,
      ),
    [frame, from, to, phase, taut],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#745039" roughness={0.8} />
    </mesh>
  );
};

const smooth = (a: number, b: number, t: number) => {
  const p = T.MathUtils.clamp((t - a) / (b - a), 0, 1);
  return p * p * (3 - 2 * p);
};
const HOOVES = ["front_hoof_L", "front_hoof_R", "hind_hoof_L", "hind_hoof_R"];
const gaitTime = (t: number) => {
  const a = Math.max(0, t - 2);
  return a < 2 ? 0.5 * a * a : 2 + (a - 2) * 1.65;
};
const motion = (t: number) => {
  const a = Math.max(0, t - 2);
  return {
    z: a < 2 ? 0.9 * a * a : 3.6 + 3.6 * (a - 2) + 2 * (a - 2) ** 2,
    y: 1.8 * Math.max(0, t - 4.25) ** 1.55,
  };
};
const deerLift = (t: number, i: number) => {
  const a = Math.max(0, t - (i < 2 ? 4.16 : 4));
  return 1.8 * a ** 1.55;
};
const TEAMS = [
  { x: -0.73, z: 0.3, p: 0 },
  { x: 0.73, z: 0.3, p: 0.14 },
  { x: -0.73, z: 2.9, p: 0.27 },
  { x: 0.73, z: 2.9, p: 0.39 },
];
const random = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

const Harness = () => {
  const geo = useMemo(
    () =>
      new T.TubeGeometry(
        new T.CatmullRomCurve3(
          Array.from({ length: 33 }, (_, i) => {
            const a = (i / 32) * Math.PI * 2;
            return new T.Vector3(
              Math.cos(a) * 0.254,
              0.83 + Math.sin(a) * 0.265,
              -0.06,
            );
          }),
          true,
        ),
        48,
        0.018,
        6,
        true,
      ),
    [],
  );
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#46251e" roughness={0.72} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[s * 0.255, 0.94, -0.06]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <torusGeometry args={[0.034, 0.008, 6, 12]} />
          <meshStandardMaterial
            color="#b89a52"
            metalness={0.75}
            roughness={0.35}
          />
        </mesh>
      ))}
    </>
  );
};
const puffTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(210,230,250,.6)");
  g.addColorStop(0.4, "rgba(205,225,245,.22)");
  g.addColorStop(1, "rgba(210,230,250,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new T.CanvasTexture(c);
};
const Breath = ({ time, phase }: { time: number; phase: number }) => {
  const tex = useMemo(puffTexture, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <>
      {[0, 1, 2].map((i) => {
        const age = (time * 0.7 + phase + i / 3) % 1;
        return (
          <sprite
            key={i}
            position={[0.02, 1.1 + age * 0.14, 0.93 + age * 0.5]}
            scale={[0.12 + age * 0.28, 0.08 + age * 0.17, 1]}
          >
            <spriteMaterial
              map={tex}
              opacity={(1 - age) * 0.2}
              depthWrite={false}
            />
          </sprite>
        );
      })}
    </>
  );
};

// The photograph is rendered exactly once below. This invisible receiver adds
// only the characters' shadows; it contains no image, map or coloured surface.
const Ground = () => {
  const t = useCurrentFrame() / 25;
  const height = motion(t).y;
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.014, 100]}
      receiveShadow
    >
      <planeGeometry args={[200, 500]} />
      <shadowMaterial
        transparent
        opacity={0.32 * (1 - smooth(0.5, 5, height))}
      />
    </mesh>
  );
};

// Locked throughout all 175 frames: no tracking, dolly, zoom, bank or FOV changes.
const Camera = () => {
  const { camera } = useThree();
  camera.position.set(9.2, 2.5, -18);
  camera.lookAt(0, 1, 0);
  camera.updateProjectionMatrix();
  return null;
};
const Team = ({ models }: { models: Bundle }) => {
  const grips = useMemo<ReinGrips>(
    () => [
      [0, 0, 0],
      [0, 0, 0],
    ],
    [],
  );
  const t = useCurrentFrame() / 25;
  const m = motion(t);
  const flight = smooth(4.25, 5.5, t);
  const run = smooth(2, 3.8, t);
  const sleigh = useMemo(() => {
    const root = prepare(clone(models.sleigh.scene));
    root.traverse((o) => {
      if (o instanceof T.Mesh) {
        const mats = (
          Array.isArray(o.material) ? o.material : [o.material]
        ).map((material) => {
          const mat = material.clone();
          if (mat instanceof T.MeshStandardMaterial) {
            mat.roughness = 0.46;
            mat.onBeforeCompile = (shader) => {
              shader.fragmentShader = shader.fragmentShader.replace(
                "#include <map_fragment>",
                `#include <map_fragment>
 if(diffuseColor.r > diffuseColor.g * 1.45 && diffuseColor.r > diffuseColor.b * 1.3) diffuseColor.rgb *= vec3(.48,.22,.32);
 if(diffuseColor.g > diffuseColor.r * 1.3 && diffuseColor.g > diffuseColor.b * 1.3) diffuseColor.rgb = vec3(.12,.015,.024) * (0.5 + diffuseColor.g);`,
              );
            };
            mat.customProgramCacheKey = () => "burgundy-gold-v1";
          }
          return mat;
        });
        o.material = Array.isArray(o.material) ? mats : mats[0];
      }
    });
    return root;
  }, [models.sleigh]);
  const sy = m.y;
  const pitch = -0.13 * flight;
  const bank = -0.045 * smooth(5.1, 6.7, t);
  const reinTransform = new T.Matrix4()
    .compose(
      new T.Vector3(0, sy + 0.025, -3.3),
      new T.Quaternion().setFromEuler(new T.Euler(pitch, 0, bank)),
      new T.Vector3(1, 1, 1),
    )
    .multiply(new T.Matrix4().makeTranslation(0, -0.06, 0));
  return (
    <group
      position={[5.5 + 1.0 * smooth(5, 7, t), 0, m.z - 8]}
      rotation={[0, 0.08 * smooth(5, 7, t), 0]}
    >
      <group
        position={[
          0,
          sy + 0.022 + Math.sin(t * 19) * 0.012 * run * (1 - flight),
          -3.3,
        ]}
        rotation={[pitch, 0, bank]}
      >
        <primitive object={sleigh} />
      </group>
      <group position={[0, sy + 0.025, -3.3]} rotation={[pitch, 0, bank]}>
        <group position={[0, 0, 3.2]}>
          <Santa
            gltf={models.santa}
            grips={grips}
            reinTransform={reinTransform}
          />
        </group>
      </group>
      {TEAMS.map((r, i) => (
        <Reindeer
          key={i}
          gltf={models.deer}
          x={r.x}
          z={r.z}
          phase={r.p}
          index={i}
        />
      ))}
      {[-0.73, 0.73].map((x, i) => (
        <React.Fragment key={x}>
          <Rein
            from={grips[i]}
            to={[x + Math.sign(x) * 0.255, deerLift(t, i) + 0.95, 0.24]}
            phase={i}
            taut={smooth(3.9, 4.9, t)}
          />
          <Rein
            from={[x + Math.sign(x) * 0.255, deerLift(t, i) + 0.95, 0.24]}
            to={[x + Math.sign(x) * 0.255, deerLift(t, i + 2) + 0.95, 2.84]}
            phase={i + 0.5}
            taut={smooth(3.8, 4.8, t)}
          />
        </React.Fragment>
      ))}
      <Displacement time={t} />
    </group>
  );
};
const Displacement = ({ time: t }: { time: number }) => {
  const tex = useMemo(puffTexture, []);
  useEffect(() => () => tex.dispose(), [tex]);
  const strength = smooth(2, 3.8, t) * (1 - smooth(4.3, 5, t));
  return (
    <>
      {Array.from({ length: 32 }, (_, i) => {
        const age = (t * 2 + random(i)) % 1;
        return (
          <sprite
            key={i}
            position={[
              (i % 2 ? 1 : -1) * (0.6 + age * 0.6),
              0.04 + age * 0.12,
              -3.3 - age * 3,
            ]}
            scale={[0.2 + age * 0.6, 0.07 + age * 0.17, 1]}
          >
            <spriteMaterial
              map={tex}
              color="#b5cbe1"
              opacity={(1 - age) * strength * 0.27}
              depthWrite={false}
            />
          </sprite>
        );
      })}
    </>
  );
};
const Snow = () => {
  const t = useCurrentFrame() / 25;
  const z = 0;
  const positions = useMemo(
    () =>
      new Float32Array(
        Array.from({ length: 180 }, (_, i) => [
          (random(i * 3) - 0.5) * 32,
          (random(i * 3 + 1) * 12 - t * 0.28 + 20) % 12,
          z - 12 + random(i * 3 + 2) * 45,
        ]).flat(),
      ),
    [t, z],
  );
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#d9e7ef"
        size={0.025}
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
};

export const ApprovedRunwayTakeoff = () => {
  const frame = useCurrentFrame(),
    t = frame / 25;
  const { width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender("Loading rigged takeoff assets"));
  const [models, setModels] = useState<Bundle | null>(null);
  useEffect(() => {
    let active = true;
    const probe = new T.WebGLRenderer();
    const ktx = new KTX2Loader()
      .setTranscoderPath(staticFile("basis/"))
      .detectSupport(probe);
    const loader = new GLTFLoader()
      .setKTX2Loader(ktx)
      .setMeshoptDecoder(MeshoptDecoder);
    Promise.all(
      ["tevy-reindeer.glb", "santa-claus-rigged.glb", "sleigh.glb"].map((p) =>
        loader.loadAsync(staticFile("assets/characters/" + p)),
      ),
    )
      .then(([deer, santa, sleigh]) => {
        if (active) setModels({ deer, santa, sleigh });
        probe.dispose();
        ktx.dispose();
      })
      .catch(cancelRender);
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (models) continueRender(handle);
  }, [models, handle]);
  const phase =
    t < 2
      ? "CLEARED FOR TAKEOFF"
      : t < 4
        ? "RUNWAY ACCELERATION"
        : t < 5
          ? "LIFTOFF"
          : "CHRISTMAS TAKES FLIGHT";
  return (
    <AbsoluteFill
      style={{
        background: "#0b1d34",
        fontFamily: "Montserrat,Arial,sans-serif",
        color: "#f3f7fa",
      }}
    >
      <Img
        src={staticFile("assets/scene-2/runway-dry-v3.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,#06132122,transparent 46%,#0d2135a0)",
        }}
      />
      {models ? (
        <ThreeCanvas
          style={{ position: "absolute", inset: 0 }}
          width={width}
          height={height}
          camera={{ fov: 42, near: 0.08, far: 600, position: [9.2, 2.5, -18] }}
          gl={{
            alpha: true,
            antialias: true,
            toneMapping: T.ACESFilmicToneMapping,
            toneMappingExposure: 0.95,
          }}
          shadows
        >
          <fog attach="fog" args={["#1a3350", 50, 230]} />
          <ambientLight color="#91afd4" intensity={0.35} />
          <hemisphereLight args={["#c2dfff", "#182b44", 0.7]} />
          <directionalLight
            position={[-12, 18, 24]}
            color="#bddaff"
            intensity={2.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={65}
            shadow-camera-bottom={-20}
            shadow-camera-far={150}
            shadow-bias={-0.0003}
          />
          <directionalLight
            position={[14, 4, -8]}
            color="#ffc080"
            intensity={1.1}
          />
          <Camera />
          <Ground />
          <Team models={models} />
          <Snow />
        </ThreeCanvas>
      ) : null}

      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 160px #04101b80",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 58,
          fontSize: 17,
          letterSpacing: 4,
          color: "#e0e9ee",
        }}
      >
        OPERATION CHRISTMAS <span style={{ color: "#f15a29" }}>2026</span>
      </div>
      <Img
        src={staticFile("assets/branding/dbfl-logo.svg")}
        style={{ position: "absolute", right: 80, top: 53, width: 150 }}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 72,
          fontSize: 25,
          letterSpacing: 2,
          textShadow: "0 2px 12px #000",
          borderLeft: "3px solid #f15a29",
          padding: "10px 20px",
          background: "#071a2bd9",
        }}
      >
        {phase}
        <div
          style={{
            fontSize: 14,
            letterSpacing: 1.2,
            marginTop: 9,
            color: "#bed1df",
          }}
        >
          NORTH POLE / RUNWAY 24
        </div>
      </div>
    </AbsoluteFill>
  );
};
