import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
for(const name of fs.readdirSync('public/assets/annotations')){
 const svg=fs.readFileSync('public/assets/annotations/'+name,'utf8');
 if(/<text\b|<foreignObject\b|font-family/.test(svg))throw Error('Live font content remains in '+name);
 if(!svg.includes('<path'))throw Error('Missing outlined label '+name);
}
const serveUrl=await bundle({entryPoint:'src/index.ts',outDir:path.resolve('out/label-team-check-bundle')});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'}});
try{
 for(const [id,frame,name] of [
  ['Scene2Benchmark',175,'civil-175'],['Scene2Benchmark',180,'civil-180'],['Scene2Benchmark',220,'civil-220'],
  ['Scene3Benchmark',130,'beam'],['Scene3Benchmark',270,'supports-270'],['Scene3Benchmark',280,'supports-280'],
  ['Scene5',175,'parked-team-175'],['Scene5',185,'parked-team-185']]){
  const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser});
  await renderStill({serveUrl,composition,frame,output:`out/label-check-${name}.png`,puppeteerInstance:browser});
  console.log('PASS',name);
 }
}finally{await browser.close({silent:true});}
