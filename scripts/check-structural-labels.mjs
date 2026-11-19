import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import path from 'node:path';
const serveUrl=await bundle({entryPoint:'src/index.ts',outDir:path.resolve('out/structural-label-check-bundle')});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'}});
try{
 for(const [id,frame,name] of [['Scene3Benchmark',270,'structural-270'],['Scene3Benchmark',280,'structural-280'],['Scene3Benchmark',290,'structural-290'],['Scene6',650,'closing-tagline']]){
  const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser});
  await renderStill({serveUrl,composition,frame,output:`out/check-${name}.png`,puppeteerInstance:browser});
  console.log('PASS',name);
 }
}finally{await browser.close({silent:true});}
