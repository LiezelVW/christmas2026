import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import path from 'node:path';
const serveUrl=path.resolve('out/upload-validation-bundle');
for(const frame of [175,180,220]){
 const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'}});
 try{
  const composition=await selectComposition({serveUrl,id:'Scene2Benchmark',puppeteerInstance:browser});
  await renderStill({serveUrl,composition,frame,output:`out/text-stability-${frame}.png`,puppeteerInstance:browser});
  console.log('Rendered cold-browser text check',frame);
 }finally{await browser.close({silent:true});}
}
