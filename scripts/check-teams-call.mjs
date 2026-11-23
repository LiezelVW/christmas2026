import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import path from 'node:path';
const serveUrl=await bundle({entryPoint:'src/index.ts',outDir:path.resolve('out/teams-check-bundle')});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'}});
try {
 for(const [id,frame,name] of [['TeamsCallIntro',45,'incoming-santa'],['TeamsCallIntro',115,'john-answers'],['Christmas2026Teams',215,'deadline'],['Christmas2026OriginalOpening',110,'original-opening']]){
  const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser});
  await renderStill({serveUrl,composition,frame,output:`out/teams-check-${name}.png`,puppeteerInstance:browser});
  console.log('PASS',id,frame,name);
 }
}finally{await browser.close({silent:true});}
