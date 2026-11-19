import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,getVideoMetadata} from '@remotion/renderer';
import fs from 'node:fs/promises';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const composition=await selectComposition({serveUrl,id:'Christmas2026'});
if(composition.durationInFrames!==2250||composition.fps!==25)throw Error('Timeline changed');
for(const frame of [875,925]) await renderStill({serveUrl,composition,frame,output:`out/transition-${frame}.png`,scale:.5});
for(const [path,width,height,duration] of [['out/scene-3-structural-v1.mp4',1920,1080,13],['out/scene-2-drainage-v3.mp4',1920,1080,13],['out/scene-3-to-4-check.mp4',960,540,4]]) {
 const m=await getVideoMetadata(path);if(m.width!==width||m.height!==height||m.fps!==25||Math.abs(m.durationInSeconds-duration)>.1)throw Error('Metadata mismatch: '+path);
 await fs.writeFile(path+'.verification.json',JSON.stringify(m,null,2));console.log('Verified',path,m.width,m.height,m.fps,m.durationInSeconds);
}
