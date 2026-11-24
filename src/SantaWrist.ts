import * as T from "three";

/** The supplied glove mesh extends along +Y; its palm faces -Z.
 * Explicitly orient it after arm posing so elbow roll cannot invert the hand. */
export const poseSantaWrist = (
  hand: T.Object3D,
  fingers: T.Vector3,
  backOfHand: T.Vector3,
  amount = 1,
) => {
  const y = fingers.clone().normalize();
  const x = new T.Vector3().crossVectors(y, backOfHand).normalize();
  const z = new T.Vector3().crossVectors(x, y).normalize();
  const desired = new T.Quaternion().setFromRotationMatrix(
    new T.Matrix4().makeBasis(x, y, z),
  );
  const parent = hand.parent!.getWorldQuaternion(new T.Quaternion()).invert();
  hand.quaternion.slerp(parent.multiply(desired), amount);
  hand.updateMatrixWorld(true);
};

/** Neutral wrists parallel to the forearms, with palms facing the reins inward. */
export const poseSantaReinWrists = (root: T.Object3D) => {
  root.updateWorldMatrix(true, true);
  for (const [side, backX] of [
    ["Left", 1],
    ["Right", -1],
  ] as const) {
    const hand = root.getObjectByName(side + "Hand")!;
    const forearm = root.getObjectByName(side + "ForeArm")!;
    const fingers = hand
      .getWorldPosition(new T.Vector3())
      .sub(forearm.getWorldPosition(new T.Vector3()));
    const back = new T.Vector3(backX, 0, 0).transformDirection(
      root.matrixWorld,
    );
    poseSantaWrist(hand, fingers, back);
  }
};

export type ReinGrips = [number, number, number][];
/** Model-space point at the thumb/palm groove, transformed with Santa's seat.
 * Publish into stable arrays before the following rein meshes evaluate. */
export const updateSantaReinGrips = (
  root: T.Object3D,
  grips: ReinGrips,
  seat: T.Matrix4,
) => {
  root.updateWorldMatrix(true, true);
  for (const [i, side] of ["Right", "Left"].entries()) {
    const hand = root.getObjectByName(side + "Hand")!;
    const point = hand.localToWorld(
      new T.Vector3(side === "Left" ? 3 : -3, 13, -2),
    );
    root.worldToLocal(point).applyMatrix4(seat);
    point.toArray(grips[i]);
  }
};

/** The rig has no finger bones. Pose the existing glove vertices into a relaxed
 * rein grip once at load time; standing/petting Santa keeps his open glove. */
export const poseSantaGripGloves = (root: T.Object3D) => {
  root.traverse((object) => {
    if (!(object instanceof T.SkinnedMesh)) return;
    const geometry = object.geometry.clone();
    const positions = geometry.getAttribute("position");
    const joints = geometry.getAttribute("skinIndex");
    const weights = geometry.getAttribute("skinWeight");
    const hands = ["LeftHand", "RightHand"].map((name) => {
      const index = object.skeleton.bones.findIndex((b) => b.name === name);
      const toHand = object.skeleton.boneInverses[index]
        .clone()
        .multiply(object.bindMatrix);
      return { index, toHand, fromHand: toHand.clone().invert() };
    });
    const vertex = new T.Vector3();
    for (let i = 0; i < positions.count; i++) {
      for (const hand of hands) {
        let weight = 0;
        for (let k = 0; k < 4; k++)
          if (joints.getComponent(i, k) === hand.index)
            weight += weights.getComponent(i, k);
        if (weight < 0.7) continue;
        vertex.fromBufferAttribute(positions, i).applyMatrix4(hand.toHand);
        if (vertex.y <= 13.5) continue;
        const curl = Math.min((vertex.y - 13.5) / 5.5, 2.3);
        vertex.y = 13.5 + Math.sin(curl) * 5.5;
        vertex.z -= (1 - Math.cos(curl)) * 5.5;
        vertex.applyMatrix4(hand.fromHand);
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        break;
      }
    }
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    object.geometry = geometry;
  });
};
