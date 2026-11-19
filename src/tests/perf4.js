const {chromium}=require('playwright');const SEQ=(process.env.SEQ||'verkauf,planer,verkauf').split(',');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1600,height:900}});await c.route(/gstatic|googleapis|cdnjs|emailjs/,r=>r.abort());
const p=await c.newPage();const w=t=>p.waitForTimeout(t||250);
await p.goto('file://'+process.cwd()+'/test_fb.html');await w(400);await p.click('.wt[data-u=kevin]');await p.fill('#pw1','1');await p.fill('#pw2','1');await p.click('#pwGo');await w(900);
await p.evaluate(async()=>{const R=a=>a[Math.floor(Math.random()*a.length)],names=['Müller Hans','Schmidt Petra','Weber Klaus'];const t=new Date();
 for(let i=0;i<300;i++){const d=new Date(t.getTime()+(i%80-30)*864e5);await db.collection('planer').doc('p'+i).set({id:'p'+i,datum:d.toISOString().slice(0,10),spalte:R(['int','t1','t2','ws','wa','bst']),text:'Eintrag '+i,von:'kevin',ts:Date.now()});}
 for(let i=0;i<180;i++)await db.collection('verkauf').doc('v'+i).set({id:'v'+i,name:R(names),modell:'KTM Macina Sport',dat:'01.10.2026',firma:R(['BL','JR','']),lt:'KW '+(40+i%12)+'/26',m:i%2?'1':'',notiz:'n'});
 for(let i=0;i<120;i++)await db.collection('lieferanten').doc('l'+i).set({id:'l'+i,name:'Lieferant '+i,kdnr:String(1000+i)});
 for(let y=1995;y<=2026;y++){const it={};for(let i=0;i<380;i++){const id='k'+y+'_'+i;it[id]={id,y:String(y),dat:'01.0'+(1+i%9)+'.'+y,nr:String(1000+i),marke:R(['KTM','Gudereit']),modell:'Modell '+i,preis:'2500',kunde:R(names),tel:'0176'+i,mail:'x@x.de'};}await db.doc('meta/kd_'+y).set({items:it});}});
await w(3000);const cdp=await c.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:300});await cdp.send('Profiler.start');
for(const v of SEQ){const ms=await p.evaluate(v=>new Promise(r=>{const t0=performance.now();show(v);requestAnimationFrame(()=>setTimeout(()=>r(Math.round(performance.now()-t0)),0));}),v);console.log(v,ms);await w(300);}
const {profile}=await cdp.send('Profiler.stop');const byId={};profile.nodes.forEach(n=>byId[n.id]=n);const self={},tot={};const dt=profile.timeDeltas;
const par={};profile.nodes.forEach(n=>(n.children||[]).forEach(ch=>par[ch]=n.id));
profile.samples.forEach((s,i)=>{const d=(dt[i]||0)/1000;let n=byId[s];const k=x=>(x.callFrame.functionName||'(anon)')+':'+(x.callFrame.lineNumber+1);self[k(n)]=(self[k(n)]||0)+d;const seen=new Set();for(let id=s;id;id=par[id]){const kk=k(byId[id]);if(!seen.has(kk)){seen.add(kk);tot[kk]=(tot[kk]||0)+d;}}});
const f=o=>Object.entries(o).filter(([k])=>!/^\((idle|program|root)/.test(k)).sort((a,b)=>b[1]-a[1]).slice(0,22).map(([k,v])=>Math.round(v)+' '+k).join(' | ');
console.log('SELF:',f(self));console.log('TOTAL:',f(tot));await b.close();})();
