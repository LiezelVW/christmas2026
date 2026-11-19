import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,getVideoMetadata} from '@remotion/renderer';
import fs from 'node:fs/promises';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const composition=await selectComposition({serveUrl,id:'Christmas2026'});
for(const frame of [50,210,460,790,1100,1440,1690,1870,2000,2190]){
 await renderStill({serveUrl,composition,frame,output:`out/frame-${frame}.png`,scale:.5});
 console.log('Checked frame',frame);
}
for(const file of ['out/christmas-preview.mp4','out/dbfl-christmas-2026.mp4']){
 try {console.log(file,await getVideoMetadata(file));} catch {console.log('Not yet rendered:',file);}
}
await fs.writeFile('out/timeline.json',JSON.stringify({fps:25,width:composition.width,height:composition.height,frames:composition.durationInFrames},null,2));
