import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill} from '@remotion/renderer';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const composition=await selectComposition({serveUrl,id:'Christmas2026'});
if(composition.durationInFrames!==2250||composition.fps!==25)throw Error('Unexpected timing');
for(const [phase,frame] of [['transport-open',930],['transport-map',1080],['transport-clear',1185],['energy-review',1280],['energy-approved',1510],['control-approvals',1645],['takeoff-stamp',1685],['departure',1780],['moon-flight',1870],['staff-mosaic',2050],['brand-ending',2215]]){
 await renderStill({serveUrl,composition,frame,output:`out/complete-${phase}.png`,scale:.5});console.log('Checked',phase,frame);
}
