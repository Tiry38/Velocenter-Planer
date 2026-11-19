const {chromium}=require('playwright');const V=process.env.V||'planer',SEL=process.env.S||'#v-planer .board';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1600,height:900}});await c.route(/gstatic|googleapis|cdnjs|emailjs/,r=>r.abort());
const p=await c.newPage();const w=t=>p.waitForTimeout(t||250);
await p.goto('file://'+process.cwd()+'/test_fb.html');await w(400);await p.click('.wt[data-u=kevin]');await p.fill('#pw1','1');await p.fill('#pw2','1');await p.click('#pwGo');await w(900);
await p.evaluate(async()=>{const R=a=>a[Math.floor(Math.random()*a.length)],names=['Müller Hans','Schmidt Petra','Weber Klaus'];const t=new Date();
 for(let i=0;i<300;i++){const d=new Date(t.getTime()+(i%80-30)*864e5);await db.collection('planer').doc('p'+i).set({id:'p'+i,datum:d.toISOString().slice(0,10),spalte:R(['int','t1','t2','ws','wa','bst']),text:'Eintrag '+i,von:'kevin',ts:Date.now()});}
 for(let i=0;i<180;i++)await db.collection('verkauf').doc('v'+i).set({id:'v'+i,name:R(names),modell:'KTM Macina Sport',dat:'01.10.2026',firma:R(['BL','JR','']),lt:'KW 48/26',m:'1'});
 for(let y=1995;y<=2026;y++){const it={};for(let i=0;i<380;i++){const id='k'+y+'_'+i;it[id]={id,y:String(y),dat:'01.0'+(1+i%9)+'.'+y,nr:String(1000+i),marke:R(['KTM','Gudereit']),modell:'Modell '+i,preis:'2500',kunde:R(names),tel:'0176'+i,mail:'x@x.de'};}await db.doc('meta/kd_'+y).set({items:it});}});
await w(3000);const quiet=()=>p.evaluate(()=>new Promise(r=>{let t;const ob=new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>{ob.disconnect();r();},1500);});ob.observe(document.body,{childList:true,subtree:true,attributes:true});t=setTimeout(()=>{ob.disconnect();r();},1500);}));await p.evaluate(v=>show(v),V);await quiet();
const cdp=await c.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
await c.tracing.start({});await cdp.send('Tracing.start',{categories:'devtools.timeline,disabled-by-default-devtools.timeline',transferMode:'ReturnAsStream'}).catch(()=>{});
await p.evaluate(sel=>new Promise(res=>{const el=document.querySelector(sel);let n=0;const f=()=>{el.scrollTop+=60;if(++n<30)requestAnimationFrame(f);else res();};requestAnimationFrame(f);}),SEL);
const ev=[];cdp.on('Tracing.dataCollected',d=>ev.push(...d.value));const done=new Promise(r=>cdp.once('Tracing.tracingComplete',r));await cdp.send('Tracing.end');const tc=await done;
let data=ev;if(tc.stream){let s='';for(;;){const r=await cdp.send('IO.read',{handle:tc.stream});s+=r.data;if(r.eof)break;}data=JSON.parse(s);data=data.traceEvents||data;}
const agg={};for(const e of data){if(e.ph!=='X'||!e.dur)continue;agg[e.name]=(agg[e.name]||0)+e.dur/1000;}
console.log(Object.entries(agg).sort((a,b)=>b[1]-a[1]).slice(0,18).map(([k,v])=>Math.round(v)+'ms '+k).join('\n'));
const fs=data.filter(e=>e.name==='FunctionCall'||e.name==='EventDispatch'||e.name==='TimerFire').reduce((m,e)=>{const k=e.name+' '+(e.args?.data?.type||e.args?.data?.functionName||'')+' '+(e.args?.data?.url||'').split('/').pop()+':'+(e.args?.data?.lineNumber||'');m[k]=(m[k]||0)+(e.dur||0)/1000;return m;},{});
console.log('--JS');console.log(Object.entries(fs).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,v])=>Math.round(v)+'ms '+k).join('\n'));await b.close();})();
