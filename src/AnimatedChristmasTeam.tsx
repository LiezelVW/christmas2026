import React, { useEffect, useMemo, useState } from "react";
import {
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
const prepare = (root: T.Object3D) => {
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
const FlyingReindeer = ({
  gltf,
  x,
  z,
  phase,
}: {
  gltf: GLTF;
  x: number;
  z: number;
  phase: number;
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
    const mixers = specs.map((s, i) => {
      const clip = new T.AnimationClip(
        "airborne_" + i,
        source.duration,
        source.tracks.filter((t) => s.names.has(t.name.split(".")[0])),
      );
      const m = new T.AnimationMixer(root);
      m.clipAction(clip).play();
      return { m, offset: s.offset };
    });
    return { root, mixers, duration: source.duration };
  }, [gltf]);
  const cycle = time * 1.18 + phase;
  for (const r of rig.mixers) r.m.setTime(cycle + r.offset * rig.duration);
  // Elastic spine/neck response is layered on source animation, after the clip evaluates.
  bone(rig.root, "neck").rotateX(Math.sin(cycle * 10) * 0.025);
  bone(rig.root, "head").rotateX(Math.sin(cycle * 10 + 0.65) * 0.018);
  bone(rig.root, "spine1").rotateX(Math.sin(cycle * 10 + 1) * 0.02);
  rig.root.updateMatrixWorld(true);
  return (
    <group
      position={[x, 0.65 + Math.sin(cycle * 10) * 0.065, z]}
      rotation={[Math.sin(cycle * 10) * 0.02, 0, 0.015 * Math.sin(cycle * 8)]}
    >
      <primitive object={rig.root} />
    </group>
  );
};

const SeatedSanta = ({ gltf }: { gltf: GLTF }) => {
  const frame = useCurrentFrame(),
    t = frame / 25;
  const rig = useMemo(() => {
    const root = prepare(clone(gltf.scene));
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
}: {
  from: [number, number, number];
  to: [number, number, number];
  phase?: number;
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
              0.14 +
              Math.sin(frame * 0.12 + phase) * 0.035,
            (from[2] + to[2]) / 2,
          ),
          new T.Vector3(...to),
        ]),
        36,
        0.009,
        5,
        false,
      ),
    [frame, from, to, phase],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#745039" roughness={0.8} />
    </mesh>
  );
};

export type ChristmasTeamMode = "flight" | "standing" | "parked";
// Shared scene-space contact point keeps the hand attached to the animated neck.
const petAmount = (t: number) => {
  const smooth = (v: number) => {
    const x = T.MathUtils.clamp(v, 0, 1);
    return x * x * (3 - 2 * x);
  };
  return smooth((t - 4) / 1.2) * (1 - smooth((t - 10.5) / 1.2));
};
const StandingReindeer = ({
  gltf,
  x,
  z,
  phase,
  contact,
}: {
  gltf: GLTF;
  x: number;
  z: number;
  phase: number;
  contact?: T.Vector3;
}) => {
  const t = useCurrentFrame() / 25;
  const rig = useMemo(() => {
    const root = prepare(clone(gltf.scene));
    const mixer = new T.AnimationMixer(root);
    const clip = gltf.animations.find((a) => a.name === "idle");
    if (!clip) throw Error("Reindeer idle skeletal clip missing");
    mixer.clipAction(clip).play();
    return { root, mixer };
  }, [gltf]);
  rig.mixer.setTime(t * 0.75 + phase);
  bone(rig.root, "neck").rotateX(Math.sin(t * 1.7 + phase) * 0.012);
  bone(rig.root, "head").rotateY(Math.sin(t * 0.85 + phase) * 0.025);
  if (contact) {
    bone(rig.root, "neck").rotateZ(petAmount(t) * 0.055);
    bone(rig.root, "head").rotateY(-petAmount(t) * 0.08);
  }
  rig.root.updateMatrixWorld(true);
  if (contact) {
    const point = bone(rig.root, "head").getWorldPosition(new T.Vector3());
    rig.root.worldToLocal(point);
    contact.copy(point).add(new T.Vector3(x - 0.14, 0.025, z - 0.09));
  }
  return (
    <group position={[x, 0, z]}>
      <primitive object={rig.root} />
    </group>
  );
};
const StandingSanta = ({
  gltf,
  position = [-1.48, 0, 0.25],
  contact,
}: {
  gltf: GLTF;
  position?: [number, number, number];
  contact?: T.Vector3;
}) => {
  const t = useCurrentFrame() / 25;
  const rig = useMemo(() => {
    const root = prepare(clone(gltf.scene));
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
  for (const [joint, r] of rig.rest) {
    joint.position.copy(r.p);
    joint.quaternion.copy(r.q);
    joint.scale.copy(r.s);
  }
  root.updateMatrixWorld(true);
  direction(bone(root, "LeftArm"), new T.Vector3(0.12, -1, 0.12));
  direction(bone(root, "RightArm"), new T.Vector3(-0.14, -1, 0.08));
  direction(bone(root, "LeftForeArm"), new T.Vector3(0.1, -1, 0.3));
  direction(bone(root, "RightForeArm"), new T.Vector3(-0.08, -1, 0.22));
  bone(root, "Spine").rotateX(0.012 * Math.sin(t * 1.8));
  bone(root, "Spine01").rotateZ(0.008 * Math.sin(t * 1.3));
  bone(root, "Head").rotateY(0.07 * Math.sin(t * 0.65));
  bone(root, "LeftForeArm").rotateX(0.035 * Math.sin(t * 1.4));
  root.updateMatrixWorld(true);
  if (contact) {
    // Work in scene coordinates, including Santa's planted position and heading.
    const wrapper = new T.Matrix4().compose(
      new T.Vector3(...position),
      new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), 0.12),
      new T.Vector3(1, 1, 1),
    );
    const target = contact.clone();
    target.y += Math.sin(t * 3.4) * 0.018 * petAmount(t);
    target.z += Math.sin(t * 3.4) * 0.045 * petAmount(t);
    target.applyMatrix4(wrapper.invert());
    // Convert to the rig's current parent coordinate system before solving.
    root.parent?.updateWorldMatrix(true, false);
    if (root.parent) target.applyMatrix4(root.parent.matrixWorld);
    const hand = bone(root, "LeftHand");
    const start = hand.getWorldPosition(new T.Vector3());
    target.lerpVectors(start, target.clone(), petAmount(t));
    for (let iteration = 0; iteration < 14; iteration++) {
      for (const name of ["LeftForeArm", "LeftArm"]) {
        const joint = bone(root, name);
        const origin = joint.getWorldPosition(new T.Vector3());
        const current = hand
          .getWorldPosition(new T.Vector3())
          .sub(origin)
          .normalize();
        const desired = target.clone().sub(origin).normalize();
        const turn = new T.Quaternion().setFromUnitVectors(current, desired);
        const world = joint
          .getWorldQuaternion(new T.Quaternion())
          .premultiply(turn);
        const parent = joint
          .parent!.getWorldQuaternion(new T.Quaternion())
          .invert();
        joint.quaternion.copy(parent.multiply(world));
        joint.updateMatrixWorld(true);
      }
    }
    bone(root, "Head").rotateY(0.25 * petAmount(t));
  }
  return (
    <group position={position} rotation={[0, 0.12, 0]}>
      <primitive object={root} />
    </group>
  );
};
const Sleigh = ({ gltf }: { gltf: GLTF }) => {
  const root = useMemo(() => {
    const root = prepare(clone(gltf.scene));
    root.traverse((o) => {
      if (o instanceof T.Mesh) {
        const mats = (
          Array.isArray(o.material) ? o.material : [o.material]
        ).map((original) => {
          const m = original.clone();
          if (m instanceof T.MeshStandardMaterial) {
            m.roughness = 0.46;
            m.onBeforeCompile = (shader) => {
              shader.fragmentShader = shader.fragmentShader.replace(
                "#include <map_fragment>",
                `#include <map_fragment>
 if(diffuseColor.r>diffuseColor.g*1.45 && diffuseColor.r>diffuseColor.b*1.3) diffuseColor.rgb*=vec3(.48,.22,.32);
 if(diffuseColor.g>diffuseColor.r*1.3 && diffuseColor.g>diffuseColor.b*1.3) diffuseColor.rgb=vec3(.12,.015,.024)*(.5+diffuseColor.g);`,
              );
            };
            m.customProgramCacheKey = () => "dbfl-burgundy-gold";
          }
          return m;
        });
        o.material = Array.isArray(o.material) ? mats : mats[0];
      }
    });
    return root;
  }, [gltf]);
  return (
    <group position={[0, 0, -3.3]}>
      <primitive object={root} />
    </group>
  );
};
const FlightTeam = ({ models }: { models: Bundle }) => {
  const t = useCurrentFrame() / 25;
  return (
    <group
      rotation={[
        0.018 * Math.sin(t * 2.2),
        0.025 * Math.sin(t * 0.6),
        0.022 * Math.sin(t * 1.7),
      ]}
    >
      <Sleigh gltf={models.sleigh} />
      <SeatedSanta gltf={models.santa} />
      {[
        { x: -0.65, z: 0.15, p: 0 },
        { x: 0.65, z: 0.15, p: 0.11 },
        { x: -0.65, z: 2.5, p: 0.23 },
        { x: 0.65, z: 2.5, p: 0.35 },
      ].map((r, i) => (
        <FlyingReindeer
          key={i}
          gltf={models.deer}
          x={r.x}
          z={r.z}
          phase={r.p}
        />
      ))}
      {[-0.65, 0.65].map((x, i) => (
        <React.Fragment key={x}>
          <Rein from={[x * 0.35, 1.3, -2.45]} to={[x, 1.65, 0.6]} phase={i} />
          <Rein from={[x, 1.65, 0.6]} to={[x, 1.65, 2.95]} phase={i + 0.7} />
        </React.Fragment>
      ))}
    </group>
  );
};
const ParkedTeam = ({ models }: { models: Bundle }) => {
  const contact = useMemo(() => new T.Vector3(), []);
  return (
    <>
      <Sleigh gltf={models.sleigh} />
      {[
        { x: -0.8, z: 0.15, phase: 0 },
        { x: 0.8, z: 0.15, phase: 1.3 },
        { x: -0.8, z: 2.8, phase: 2.1 },
        { x: 0.8, z: 2.8, phase: 3.4 },
      ].map((r, i) => (
        <StandingReindeer
          key={i}
          gltf={models.deer}
          {...r}
          contact={i === 0 ? contact : undefined}
        />
      ))}
      <StandingSanta
        gltf={models.santa}
        position={[-1.55, 0, 0.65]}
        contact={contact}
      />
      {[-0.8, 0.8].map((x, i) => (
        <React.Fragment key={x}>
          <Rein from={[x * 0.35, 1.3, -2.45]} to={[x, 1.65, 0.6]} phase={i} />
          <Rein from={[x, 1.65, 0.6]} to={[x, 1.65, 3.25]} phase={i + 0.7} />
        </React.Fragment>
      ))}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.015, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>
    </>
  );
};
const FixedCamera = ({ mode }: { mode: ChristmasTeamMode }) => {
  const { camera } = useThree();
  if (mode === "flight") {
    camera.position.set(-12, 3.3, 2);
    camera.lookAt(0, 1.25, -0.35);
  } else if (mode === "parked") {
    camera.position.set(-11, 4.1, 9);
    camera.lookAt(0, 1, -0.1);
  } else {
    camera.position.set(4, 2.4, 8);
    camera.lookAt(0, 1, 0);
  }
  camera.updateProjectionMatrix();
  return null;
};
/** Transparent 3D overlay. Characters use skinned GLBs and frame-based bone animation.
 * The component never renders a photographic environment. */
export const AnimatedChristmasTeam = ({
  mode,
  width,
  height,
  style,
}: {
  mode: ChristmasTeamMode;
  width: number;
  height: number;
  style?: React.CSSProperties;
}) => {
  const [handle] = useState(() =>
    delayRender("Loading animated Santa and reindeer"),
  );
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
      ["tevy-reindeer.glb", "santa-claus-rigged.glb", "sleigh.glb"].map(
        (file) => loader.loadAsync(staticFile("assets/characters/" + file)),
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
  return (
    <div
      aria-label={
        mode !== "flight"
          ? "Animated Santa standing with reindeer and parked sleigh"
          : "Animated Santa and reindeer in flight"
      }
      style={{
        position: "absolute",
        width,
        height,
        pointerEvents: "none",
        ...style,
      }}
    >
      {models ? (
        <ThreeCanvas
          style={{ position: "absolute", inset: 0 }}
          width={width}
          height={height}
          camera={{ fov: mode === "standing" ? 29 : 26, near: 0.08, far: 100 }}
          gl={{
            alpha: true,
            antialias: true,
            toneMapping: T.ACESFilmicToneMapping,
            toneMappingExposure: mode === "flight" ? 1.2 : 1.05,
          }}
          shadows
        >
          <ambientLight color="#91afd4" intensity={0.45} />
          <hemisphereLight args={["#c2dfff", "#182b44", 0.8]} />
          <directionalLight
            position={[-5, 8, 6]}
            color="#bddaff"
            intensity={2.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-7}
            shadow-camera-right={7}
            shadow-camera-top={7}
            shadow-camera-bottom={-7}
            shadow-bias={-0.0003}
          />
          <directionalLight
            position={[5, 4, 5]}
            color="#ffd0a0"
            intensity={1.6}
          />
          <FixedCamera mode={mode} />
          {mode === "flight" ? (
            <FlightTeam models={models} />
          ) : mode === "parked" ? (
            <ParkedTeam models={models} />
          ) : (
            <>
              <StandingSanta gltf={models.santa} />
              <StandingReindeer
                gltf={models.deer}
                x={0.1}
                z={-0.15}
                phase={0}
              />
              <StandingReindeer
                gltf={models.deer}
                x={1.4}
                z={-0.7}
                phase={1.9}
              />
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.015, 0]}
                receiveShadow
              >
                <planeGeometry args={[20, 20]} />
                <shadowMaterial transparent opacity={0.25} />
              </mesh>
            </>
          )}
        </ThreeCanvas>
      ) : null}
    </div>
  );
};
