import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import path from 'node:path';
const serveUrl=await bundle({entryPoint:'src/index.ts',outDir:path.resolve('out/mosaic-flypast-check-bundle')});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'}});
try{
 for(const [id,frame,name] of [['MosaicFlypastPreview',20,'wipe-start'],['MosaicFlypastPreview',60,'mid-flight'],['MosaicFlypastPreview',100,'wipe-end'],['MosaicFlypastPreview',130,'mosaic-clear'],['Christmas2026',1955,'original-mosaic'],['Christmas2026Teams',2200,'closing']]){
  const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser});
  await renderStill({serveUrl,composition,frame,output:`out/mosaic-check-${name}.png`,puppeteerInstance:browser});console.log('PASS',name);
 }
}finally{await browser.close({silent:true});}
