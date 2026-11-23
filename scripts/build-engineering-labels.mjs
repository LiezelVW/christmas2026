import fs from 'node:fs';
import path from 'node:path';
import {openSync} from 'fontkit';
const font = openSync('public/assets/fonts/Montserrat.ttf').getVariation({wght:400});
const folder='public/assets/annotations';fs.mkdirSync(folder,{recursive:true});
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function line(text,x,y,size,color,tracking=0){
 const run=font.layout(text),scale=size/font.unitsPerEm;let cursor=x,markup='';
 for(let i=0;i<run.glyphs.length;i++){
  const pos=run.positions[i];
  markup+=`<path fill="${color}" transform="translate(${(cursor+pos.xOffset*scale).toFixed(4)} ${(y-pos.yOffset*scale).toFixed(4)}) scale(${scale} ${-scale})" d="${run.glyphs[i].path.toSVG()}"/>`;
  cursor+=pos.xAdvance*scale+tracking;
 }
 return {markup,width:cursor-x-tracking};
}
function save(name,w,h,content,title){fs.writeFileSync(path.join(folder,name+'.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${escape(title)}</title>${content}</svg>\n`);}
function card(name,w,h,title,subtitle,size=20,body=16,tracking=2,stroke=false){
 const a=line(title,18,29,size,'#FFFFFF',tracking),b=subtitle?line(subtitle,18,55,body,'#C3D8DF'):null;
 if(Math.max(a.width,b?.width??0)>w-36)throw Error('Label overflow: '+name);
 save(name,w,h,`<rect width="${w}" height="${h}" rx="3" fill="#14252D"/>${stroke?`<path d="M0 1H${w}" stroke="#F15A29" stroke-width="2"/>`:''}${a.markup}${b?.markup??''}`,title+(subtitle?' — '+subtitle:''));
}
card('collection-channel',340,72,'COLLECTION CHANNEL','Surface falls → grated drain',19,15,2);
card('drainage-outlet',300,78,'DRAINAGE OUTLET','Water conveyed to outfall',18,15,1.5,true);
card('primary-storage-beam',390,78,'PRIMARY STORAGE BEAM','Present load → beam → columns');
card('additional-supports',360,78,'ADDITIONAL SUPPORTS','Redistributed load path');
card('solar-pv',340,72,'INTEGRATED SOLAR PV','Renewable generation / concept',18,14,2);
card('wind-generation',260,48,'WIND GENERATION','',17,14,2);
card('reindeer-delivery',565,84,'REINDEER-POWERED DELIVERY','Wind + solar for the workshop',21,16,1.5,true);
const geo=(lon,lat)=>({x:60+(lon+6.52)*.596*1740,y:45+(53.49-lat)*1740});
let map='';
for(const [name,lon,lat] of [['DUBLIN',-6.2603,53.3498],['AIRPORT',-6.2499,53.4264],['WEST-LINK',-6.386,53.353],['RED COW',-6.3694,53.3203]]){
 const p=geo(lon,lat);map+=line(name,p.x+10,p.y-9,12,'#E7F0F2',1.3).markup;
}
map+=line('M50',160,455,20,'#F7AD83',3).markup;
map+=line('SLEIGH FLIGHT CORRIDOR / CONCEPT',370,520,12,'#AAC3CE',2).markup;
save('transport-map-labels',720,660,map,'Dublin transport map annotations');
console.log('Built eight self-contained vector label images; all text is outlined and panel widths verified.');
