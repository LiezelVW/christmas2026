import json,urllib.request,urllib.parse,pathlib,time
query='''[out:json][timeout:60];(way[highway~"^(motorway|motorway_link|trunk|primary|secondary)$"](53.18,-6.52,53.49,-6.03);way[waterway="river"][name~"Liffey"](53.18,-6.52,53.49,-6.03););out geom;'''
for endpoint in ['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter']:
 try:
  req=urllib.request.Request(endpoint+'?'+urllib.parse.urlencode({'data':query}),headers={'User-Agent':'DBFLChristmasIllustrativeMap/1.0'})
  data=json.load(urllib.request.urlopen(req,timeout=75));break
 except Exception as e: print(type(e).__name__,str(e))
else: raise RuntimeError('Could not retrieve actual geographic data')
pathlib.Path('public/assets/scene-4/osm-dublin-source.json').write_text(json.dumps(data))
features=[]
for e in data['elements']:
 if not e.get('geometry'): continue
 tags=e.get('tags',{})
 features.append({'id':e['id'],'ref':tags.get('ref',''),'kind':tags.get('highway',tags.get('waterway','')),'name':tags.get('name',''),'points':[[p['lon'],p['lat']] for p in e['geometry']]})
pathlib.Path('src/dublin-roads.json').write_text(json.dumps(features,separators=(',',':')))
print('Saved',len(features),'road/river segments;',sum('M50' in r['ref'] for r in features),'M50 segments')
