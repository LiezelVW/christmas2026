import fs from "node:fs/promises";
const filename = process.argv[2];
if (!filename)
  throw Error(
    "Usage: node scripts/inspect-flight-asset.mjs /path/to/model.glb",
  );
const file = await fs.readFile(filename);
let doc, bin;
if (file.readUInt32LE(0) === 0x46546c67) {
  if (file.readUInt32LE(4) !== 2) throw Error("Expected GLB v2");
  let offset = 12;
  while (offset < file.length) {
    const len = file.readUInt32LE(offset),
      type = file.readUInt32LE(offset + 4),
      chunk = file.subarray(offset + 8, offset + 8 + len);
    if (type === 0x4e4f534a) doc = JSON.parse(chunk.toString());
    if (type === 0x004e4942) bin = chunk;
    offset += 8 + len;
  }
} else {
  doc = JSON.parse(file.toString());
}
if (!doc) throw Error("Missing glTF JSON");
const joints = new Set((doc.skins ?? []).flatMap((s) => s.joints ?? []));
const widths = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
function changing(index) {
  const a = doc.accessors?.[index],
    v = doc.bufferViews?.[a?.bufferView];
  if (!a || !v || !bin || a.componentType !== 5126 || a.sparse)
    return "not-inspected";
  const width = widths[a.type];
  if (!width) return "not-inspected";
  const stride = v.byteStride ?? width * 4,
    base = (v.byteOffset ?? 0) + (a.byteOffset ?? 0);
  let dynamic = false;
  for (let c = 0; c < width; c++) {
    const first = bin.readFloatLE(base + c * 4);
    for (let n = 1; n < a.count; n++) {
      if (Math.abs(bin.readFloatLE(base + n * stride + c * 4) - first) > 1e-5) {
        dynamic = true;
        break;
      }
    }
  }
  return dynamic;
}
const clips = (doc.animations ?? []).map((a, i) => ({
  name: a.name ?? `clip_${i}`,
  channels: a.channels.map((c) => {
    const node = doc.nodes?.[c.target.node];
    return {
      node: c.target.node,
      name: node?.name ?? `node_${c.target.node}`,
      path: c.target.path,
      skinJoint: joints.has(c.target.node),
      changing: changing(a.samplers[c.sampler].output),
    };
  }),
}));
const dynamic = clips
  .flatMap((c) => c.channels)
  .filter((c) => c.changing === true);
const report = {
  filename,
  skins: doc.skins?.length ?? 0,
  skinJoints: joints.size,
  animationClips: clips.length,
  dynamicJointChannels: dynamic.filter((c) => c.skinJoint).length,
  movingLegNamedNodes: dynamic.filter((c) =>
    /leg|hoof|thigh|shin|hock/i.test(c.name),
  ),
  movingHeadNamedNodes: dynamic.filter((c) => /head|neck/i.test(c.name)),
  movingReinNamedNodes: dynamic.filter((c) => /rein|harness/i.test(c.name)),
  movingSantaNamedNodes: dynamic.filter((c) =>
    /santa|arm|hand|hat|coat/i.test(c.name),
  ),
  clips,
  acceptance:
    "Candidate inspection only: visually verify anatomical gait, staggered timing, Santa and rein motion. Bone names alone are not proof of quality.",
};
console.log(JSON.stringify(report, null, 2));
if (!joints.size || !dynamic.some((c) => c.skinJoint)) process.exitCode = 2;
