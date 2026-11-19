import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const finaleSource=fs.readFileSync('src/Scene6Finale.tsx','utf8');
const approvedSequence=/<Sequence\b(?=[^>]*from=\{150\})(?=[^>]*durationInFrames=\{175\})[^>]*>\s*<ApprovedRunwayTakeoff\s*\/>\s*<\/Sequence>/s;
if(!approvedSequence.test(finaleSource))throw Error('Approved 175-frame runway takeoff is missing from Scene 6');
const publicDir=path.resolve('public');
const assets=JSON.parse(fs.readFileSync('src/staff-photos.json','utf8'));
if(assets.length!==248||assets.some(p=>!fs.existsSync(path.join(publicDir,p.src))))throw Error('Missing staff assets');
for(const f of ['public/assets/characters/santa-claus-rigged.glb','public/assets/characters/tevy-reindeer.glb','public/assets/characters/sleigh.glb']){
 const b=fs.readFileSync(f);if(b.toString('utf8',0,4)!=='glTF'||b.readUInt32LE(4)!==2)throw Error('Invalid GLB '+f);
 const json=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));if(!json.meshes?.length)throw Error('Missing geometry '+f);
 if(!f.endsWith('/sleigh.glb')&&(!json.skins?.length||!json.animations?.length))throw Error('Missing skeletal rig/clips '+f);
}
const serveUrl=await bundle({entryPoint:'src/index.ts',outDir:path.resolve('out/upload-validation-bundle')});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'}});
try{
 for(const [id,frame,name] of [['Scene1',110,'caller'],['Scene2Benchmark',285,'caption'],['Scene3Benchmark',200,'structural'],['Scene4',230,'transport'],['Scene5',175,'sustainability'],['Christmas2026',1812,'takeoff-main-composition'],['Scene6',430,'staff'],['Scene6',650,'closing']]){
  const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser});
  if(id==='Christmas2026'&&(composition.durationInFrames!==2250||composition.fps!==25||composition.width!==1920||composition.height!==1080))throw Error('Film timing/dimensions changed');
  await renderStill({serveUrl,composition,frame,output:`out/upload-check-${name}.png`,scale:2/3,puppeteerInstance:browser});console.log('PASS',id,frame,name);
 }
}finally{await browser.close({silent:true});}
