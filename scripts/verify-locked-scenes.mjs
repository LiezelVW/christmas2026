import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill} from '@remotion/renderer';
import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
for(const file of ['components.tsx','BrandLogo.tsx','Scene2Benchmark.tsx','Scene3Structural.tsx']){
 if(!Buffer.from(await fs.readFile('src/'+file)).equals(await fs.readFile('out/final-baseline/'+file)))throw Error('Locked file changed: '+file);
}
const urls=[];
for(const entryPoint of ['out/final-baseline/index.ts','src/index.ts']) urls.push(await bundle({entryPoint,publicDir:path.resolve('public')}));
for(const frame of [60,210,310,540,640,870]){
 const hashes=[];
 for(let i=0;i<urls.length;i++){
  const composition=await selectComposition({serveUrl:urls[i],id:'Christmas2026'});
  const output=`out/locked-${i}-${frame}.png`;
  await renderStill({serveUrl:urls[i],composition,frame,output,scale:.25});
  hashes.push(createHash('sha256').update(await fs.readFile(output)).digest('hex'));
 }
 if(hashes[0]!==hashes[1])throw Error('Approved frame changed: '+frame);
 console.log('Pixel-identical approved frame:',frame);
}
