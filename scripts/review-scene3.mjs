import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill} from '@remotion/renderer';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const composition=await selectComposition({serveUrl,id:'Scene3Benchmark'});
for(const [phase,frame] of [['problem',60],['analysis',135],['reinforcement',225],['approved',295]]){
 await renderStill({serveUrl,composition,frame,output:`out/scene-3-${phase}.png`,scale:.5});
 console.log('Checked',phase,'frame',frame);
}
const civil=await selectComposition({serveUrl,id:'Scene2Benchmark'});
await renderStill({serveUrl,composition:civil,frame:290,output:'out/scene-2-clear-clean.png',scale:.5});
