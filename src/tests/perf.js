// Leistungsmessung: realistische Datenmenge, Zeiten je Reiter + CPU-Profil (Top-Funktionen)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1600,height:900}});await c.route(/gstatic|googleapis|cdnjs|emailjs/,r=>r.abort());
const p=await c.newPage();const er=[];p.on('pageerror',e=>er.push(e.message));const w=t=>p.waitForTimeout(t||250);
await p.goto('file://'+process.cwd()+'/test_fb.html');await w(400);await p.click('.wt[data-u=kevin]');await p.fill('#pw1','1');await p.fill('#pw2','1');await p.click('#pwGo');await w(900);
await p.evaluate(async()=>{const R=(a)=>a[Math.floor(Math.random()*a.length)],names=['Müller Hans','Schmidt Petra','Weber Klaus','Becker Anna','Wolf Peter','Roth Eva','Meier Jan'];
 const t=new Date();for(let i=0;i<150;i++){const d=new Date(t.getTime()+(i%60-20)*864e5);const iso=d.toISOString().slice(0,10);await db.collection('planer').doc('p'+i).set({id:'p'+i,datum:iso,spalte:R(['int','t1','t2','ws','not','wa']),text:'Eintrag '+i,von:'kevin',ts:Date.now()});}
 for(let i=0;i<120;i++)await db.collection('verkauf').doc('v'+i).set({id:'v'+i,name:R(names),modell:R(['KTM Macina Sport','i:SY E5','Gudereit EC-35 Evo']),dat:'0'+(1+i%9)+'.10.2026',firma:R(['BL','JR','']),lt:'KW 48/26',m:i%3?'1':'',b:i%4?'':'1',a:''});
 for(let i=0;i<60;i++)await db.collection('bestell').doc('b'+i).set({id:'b'+i,artikel:'Teil '+i,status:R(['offen','bestellt','da']),datum:'01.11.2026'});
 for(let y=2014;y<=2026;y++){const it={};for(let i=0;i<280;i++){const id='k'+y+'_'+i;it[id]={id,y:String(y),dat:String(1+i%28).padStart(2,'0')+'.'+String(1+i%12).padStart(2,'0')+'.'+y,nr:String(1000+i),marke:R(['KTM','Gudereit','i:SY','Victoria']),modell:'Modell '+i,preis:String(2000+i*7),kunde:R(names),tel:'0176'+i,mail:i%2?'x'+i+'@x.de':''};}
  await db.doc('meta/kd_'+y).set({items:it});}});
await w(2500);
const cdp=await c.newCDPSession(p);await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:200});await cdp.send('Profiler.start');
const T={};const views=['planer','verkauf','bestell','rekla','kunden','ausw','lief','leasing','planer'];
for(let k=0;k<2;k++)for(const v of views){const ms=await p.evaluate(v=>new Promise(r=>{const t0=performance.now();show(v);requestAnimationFrame(()=>setTimeout(()=>r(performance.now()-t0),0));}),v);(T[v]=T[v]||[]).push(Math.round(ms));}
// Änderung im Planer (wie ein anderer Nutzer) – Zeit bis gezeichnet
await p.evaluate(()=>show('planer'));await w(300);
const ch=[];for(let i=0;i<5;i++){ch.push(await p.evaluate(async i=>{const t0=performance.now();await db.collection('planer').doc('p'+i).update({text:'Neu '+i+Math.random()});await new Promise(r=>setTimeout(r,120));return Math.round(performance.now()-t0-120);},i));}
// Leerlauf: lange Aufgaben 8 s
await p.evaluate(()=>{window.__lt=[];new PerformanceObserver(l=>l.getEntries().forEach(e=>__lt.push(Math.round(e.duration)))).observe({entryTypes:['longtask']});});
await w(8000);const idle=await p.evaluate(()=>__lt);
// Scrollen im Planer
const scr=await p.evaluate(()=>new Promise(r=>{const el=document.querySelector('#v-planer .board')||document.scrollingElement;let n=0,t0=performance.now(),fr=[];let last=t0;const f=()=>{const t=performance.now();fr.push(t-last);last=t;el.scrollTop+=40;if(++n<60)requestAnimationFrame(f);else r({avg:Math.round((t-t0)/n*10)/10,max:Math.round(Math.max(...fr))});};requestAnimationFrame(f);}));
const {profile}=await cdp.send('Profiler.stop');
const self={},byId={};profile.nodes.forEach(n=>byId[n.id]=n);const dt=profile.timeDeltas;const cnt={};profile.samples.forEach((s,i)=>cnt[s]=(cnt[s]||0)+(dt[i]||0));
for(const id in cnt){const n=byId[id];const k=(n.callFrame.functionName||'(anon)')+':'+n.callFrame.lineNumber+(n.callFrame.url.includes('test_fb')?'':' ['+n.callFrame.url.split('/').pop()+']');self[k]=(self[k]||0)+cnt[id]/1000;}
const top=Object.entries(self).filter(([k])=>!/^\((idle|program|garbage)/.test(k)).sort((a,b)=>b[1]-a[1]).slice(0,25);
console.log('Reiter öffnen (ms, 1./2. Mal):',JSON.stringify(T));console.log('Planer-Änderung bis gezeichnet (ms):',ch.join(', '));console.log('Leerlauf lange Aufgaben:',JSON.stringify(idle));console.log('Scroll Planer: Ø Frame',scr.avg,'ms, max',scr.max);
console.log('GC/program:',Object.entries(self).filter(([k])=>/^\((program|garbage)/.test(k)).map(([k,v])=>k+' '+Math.round(v)).join(' | '));
console.log(top.map(([k,v])=>Math.round(v)+' ms  '+k).join('\n'));console.log('Fehler',er);await b.close();})();
