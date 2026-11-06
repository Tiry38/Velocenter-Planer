# Aufruf aus dem Ordner src/:  python3 build.py 1.1.6   (Version = neue Nummer, steht danach in ../version.txt)
import sys,os,json,re
from PIL import Image
VERSION=sys.argv[1] if len(sys.argv)>1 else '1.0.0'
CFG=open('fbconfig.js').read().strip() if os.path.exists('fbconfig.js') else "const FB_CONFIG={apiKey:'TEST',authDomain:'velocenter-planer.firebaseapp.com',projectId:'velocenter-planer'};"
head=open('head.html').read()
extra=open('sections.css').read()+'''
[hidden]{display:none!important}
#sTab td.b{font-weight:700}#sTab .pwm.ed{outline:none;padding:2px 6px;border-radius:6px;font-family:var(--mono)}#sTab td{vertical-align:top}
#sTab td.ce,#ltab td.ce{cursor:text;border-bottom:1px dashed #2A3446;outline:none}#sTab td.ce:focus,#sTab .pwm.ed:focus,#ltab td.ce:focus{box-shadow:inset 0 0 0 2px var(--cyan);background:var(--panel2)}#ltab td.tg{cursor:pointer;user-select:none}#sTab td.ce:hover,#ltab td.tg:hover,#ltab td.ce:hover{background:rgba(255,255,255,.04)}#ltab td.tg:focus-visible{outline:2px solid var(--cyan)}
@media (max-width:720px){#navTog{display:none!important}.metools{grid-template-columns:repeat(2,38px);margin-top:0;flex:none}.me{margin-top:0;flex:none}}
'''
body=open('body_fb.html').read()
logo=open('logo_small.b64').read().strip()
body=body.replace('<img src="data:image/webp;base64,__LOGO__" alt="Velocenter Hessert"><h2 id="whoT">','<img id="whoLogo" src="data:image/webp;base64,'+logo+'" alt="Velocenter Hessert"><h2 id="whoT">')
js=open('app_fb.js').read().replace('__LSDEF__',open('ls_seed.js').read()).replace('__LSREC__',open('ls_rec.js').read()).replace('__LOGOS__',open('logos_small.js').read()).replace('__SKON__',open('skon.js').read()).replace('__OKLOGO__',open('oklogo.b64').read().strip()).replace('__VERSION__',VERSION)
meta='<!doctype html>\n<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#07090D"><link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icon-192.png"><link rel="apple-touch-icon" href="icon-192.png">\n'
def page(fbscripts):
    return meta+head+extra+'</style></head><body>\n'+body+'\n'+fbscripts+'\n<script>\n'+CFG+'\n'+js+'\n</script>\n</body></html>\n'
FB='\n'.join(f'<script src="https://www.gstatic.com/firebasejs/10.12.2/{n}-compat.js"></script>' for n in ['firebase-app','firebase-auth','firebase-firestore'])
OUT='..'
open(OUT+'/index.html','w').write(page(FB))
open('tests/test_fb.html','w').write(page('<script src="xlsx.full.min.js"></script><script src="fbmock.js"></script><script>window.__t=[];</script>').replace('</body></html>','<script>(function(){const o=toast;toast=function(t,u){__t.push(t);return o(t,u);};})();</script></body></html>'))
open(OUT+'/version.txt','w').write(VERSION+'\n')
json.dump({"name":"Velocenter Werkstatt-Cockpit","short_name":"Cockpit","start_url":"./","scope":"./","display":"fullscreen","display_override":["fullscreen","standalone"],"background_color":"#07090D","theme_color":"#07090D","lang":"de",
 "icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png","purpose":"any maskable"}]},open(OUT+'/manifest.webmanifest','w'),ensure_ascii=False,indent=1)
open(OUT+'/sw.js','w').write("// Nur Netz – immer die neueste Version, keine alte Kopie aus dem Cache\nself.addEventListener('install',e=>self.skipWaiting());\nself.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));\nself.addEventListener('fetch',e=>{});\n")
lg=Image.open('assets/logo.png').convert('RGBA');lg=lg.crop(lg.getbbox())
for n in (192,512):
    c=Image.new('RGBA',(n,n),(7,9,13,255));w=int(n*.82);t=lg.copy();t.thumbnail((w,w),Image.LANCZOS);c.alpha_composite(t,((n-t.width)//2,(n-t.height)//2));c.convert('RGB').save(OUT+f'/icon-{n}.png',optimize=True)
open(OUT+'/.nojekyll','w').write('')
print('ok',VERSION,os.path.getsize(OUT+'/index.html'))
