import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill} from '@remotion/renderer';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const composition=await selectComposition({serveUrl,id:'Scene2Benchmark'});
for(const [phase,frame] of [['problem',65],['solution',195],['resolved',290]]){
 await renderStill({serveUrl,composition,frame,output:`out/scene-2-v3-${phase}.png`,scale:.5});
 console.log('Reviewed',phase,'frame',frame);
}
