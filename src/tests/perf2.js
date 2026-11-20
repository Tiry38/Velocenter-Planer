// Leistung unter Mini-PC-Bedingungen: CPU 4× gebremst, echte Datenmengen, Öffnen + Scrollen je Liste
const {chromium}=require('playwright');const THR=+(process.env.THR||4);
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1600,height:900}});await c.route(/gstatic|googleapis|cdnjs|emailjs/,r=>r.abort());
const p=await c.newPage();const er=[];p.on('pageerror',e=>er.push(e.message));const w=t=>p.waitForTimeout(t||250);
await p.goto('file://'+process.cwd()+'/'+(process.env.F||'test_fb.html'));await w(400);await p.click('.wt[data-u=kevin]');await p.fill('#pw1','1');await p.fill('#pw2','1');await p.click('#pwGo');await w(900);
await p.evaluate(async()=>{const R=a=>a[Math.floor(Math.random()*a.length)],names=['Müller Hans','Schmidt Petra','Weber Klaus','Becker Anna','Wolf Peter','Roth Eva','Meier Jan'];
 const t=new Date();for(let i=0;i<300;i++){const d=new Date(t.getTime()+(i%80-30)*864e5);await db.collection('planer').doc('p'+i).set({id:'p'+i,datum:d.toISOString().slice(0,10),spalte:R(['int','t1','t2','ws','wa','bst']),text:'Eintrag '+i,zeit:i%3?'':'10:00',von:'kevin',ts:Date.now()});}
 for(let i=0;i<180;i++)await db.collection('verkauf').doc('v'+i).set({id:'v'+i,name:R(names),modell:R(['KTM Macina Sport','i:SY E5','Gudereit EC-35 Evo']),dat:'0'+(1+i%9)+'.10.2026',firma:R(['BL','JR','']),lt:'KW '+(40+i%12)+'/26',m:i%3?'1':'',b:i%4?'':'1',a:'',notiz:i%2?'Notiz '+i:''});
 for(let i=0;i<120;i++)await db.collection('bestell').doc('b'+i).set({id:'b'+i,artikel:'Teil '+i,status:R(['offen','bestellt','da']),datum:'01.11.2026'});
 for(let i=0;i<120;i++)await db.collection('lieferanten').doc('l'+i).set({id:'l'+i,name:'Lieferant '+i,kdnr:String(1000+i),tel:'07271 '+i,mail:'a'+i+'@b.de'});
 for(let y=1995;y<=2026;y++){const it={};for(let i=0;i<380;i++){const id='k'+y+'_'+i;it[id]={id,y:String(y),dat:String(1+i%28).padStart(2,'0')+'.'+String(1+i%12).padStart(2,'0')+'.'+y,nr:String(1000+i),marke:R(['KTM','Gudereit','i:SY','Victoria','Velo de Ville']),modell:'Modell '+i,preis:String(2000+i*7),leas:R(['','JR','BL']),kunde:R(names),tel:'0176'+i,mail:i%2?'x'+i+'@x.de':'',rahmen:'WAX'+i};}
  await db.doc('meta/kd_'+y).set({items:it});}});
await w(3000);const quiet=()=>p.evaluate(()=>new Promise(r=>{let t;const ob=new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>{ob.disconnect();r();},1500);});ob.observe(document.body,{childList:true,subtree:true,attributes:true});t=setTimeout(()=>{ob.disconnect();r();},1500);}));
await p.evaluate(()=>show('kunden'));await quiet();await p.evaluate(()=>show('planer'));await quiet();
const cdp=await c.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:THR});
const views=['planer','verkauf','bestell','rekla','kunden','ausw','lief','leasing','tg'];const T={};
for(let k=0;k<2;k++)for(const v of views){T[v]=T[v]||[];T[v].push(await p.evaluate(v=>new Promise(r=>{const t0=performance.now();show(v);requestAnimationFrame(()=>setTimeout(()=>r(Math.round(performance.now()-t0)),0));}),v));}
console.log('CPU ×'+THR+' – Reiter öffnen ms (1./2.):',JSON.stringify(T));
const SC={planer:'#v-planer .board',verkauf:'#v-verkauf .vtab',kunden:'#v-kunden .kdboard',lief:'#v-lief .stab, #v-lief .vtab, #v-lief [class*=tab]',bestell:'#v-bestell .board',ausw:'#v-ausw'};
for(const v in SC){await p.evaluate(v=>show(v),v);await quiet();
 const r=await p.evaluate(sel=>new Promise(res=>{let el=null;for(const s of sel.split(','))if(!el){const c=[...document.querySelectorAll(s.trim())].find(e=>e.scrollHeight>e.clientHeight+20);el=c;}
  if(!el){const all=[...document.querySelectorAll('.view.on *, section:not([hidden]) *')].filter(e=>e.scrollHeight>e.clientHeight+50&&getComputedStyle(e).overflowY!='visible');el=all[0];}
  if(!el)return res({err:'kein Scroller'});let n=0,fr=[],last=performance.now();const f=()=>{const t=performance.now();fr.push(t-last);last=t;el.scrollTop+=60;if(++n<80)requestAnimationFrame(f);else{fr.shift();fr.sort((a,b)=>a-b);res({sel:el.className.slice(0,30),rows:el.querySelectorAll('tr,.row,.day').length,avg:Math.round(fr.reduce((a,b)=>a+b)/fr.length*10)/10,p95:Math.round(fr[Math.floor(fr.length*.95)]),max:Math.round(fr[fr.length-1]),dom:document.getElementsByTagName('*').length});}};requestAnimationFrame(f);}),SC[v]);
 console.log('Scroll',v,JSON.stringify(r));}
// Änderung im Planer / Verkauf (anderer Nutzer)
for(const [v,col,id,f] of [['planer','planer','p1','text'],['verkauf','verkauf','v1','notiz'],['kunden',null]]){await p.evaluate(v=>show(v),v);await w(300);
 const ms=await p.evaluate(async([col,id,f])=>{const t0=performance.now();if(col)await db.collection(col).doc(id).update({[f]:'Neu '+Math.random()});else await db.doc('meta/kd_2026').update({'items.k2026_1.kunde':'Neu '+Math.random()});await new Promise(r=>requestAnimationFrame(()=>setTimeout(r,0)));return Math.round(performance.now()-t0);},[col,id,f]);console.log('Änderung',v,ms,'ms');}
// 1.11.14: reines Neuzeichnen nach einer Änderung (ohne Testdatenbank-Schreibzeit): 1 Datensatz im Speicher ändern → renderAll → Layout erzwingen → nächstes Bild
for(const v of ['verkauf','kunden','planer']){await p.evaluate(v=>show(v),v);await quiet();const ms=[];for(let i=0;i<4;i++)ms.push(await p.evaluate(v=>new Promise(r=>{const t0=performance.now();
 if(v==='verkauf'){V[1]=Object.assign({},V[1],{notiz:'X'+Math.random()});}else if(v==='kunden'){const y=Object.keys(KD).sort().pop(),k=Object.keys(KD[y])[1];KD[y][k]=Object.assign({},KD[y][k],{kunde:'X'+Math.random()});kdDirty=true;}else{P[1]=Object.assign({},P[1],{text:'X'+Math.random()});}
 renderAll();document.body.offsetHeight;requestAnimationFrame(()=>setTimeout(()=>r(Math.round(performance.now()-t0)),0));}),v));console.log('Neuzeichnen',v,JSON.stringify(ms),'ms');}
await p.evaluate(()=>{window.__lt=[];new PerformanceObserver(l=>l.getEntries().forEach(e=>__lt.push(Math.round(e.duration)))).observe({entryTypes:['longtask']});show('planer');});
await w(6000);console.log('Leerlauf Planer lange Aufgaben:',JSON.stringify(await p.evaluate(()=>__lt)));
console.log('Fehler',er);await b.close();})();
