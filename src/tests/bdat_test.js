const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1500,height:900}});await c.route(/gstatic|googleapis|cdnjs/,r=>r.abort());const p=await c.newPage();const er=[];p.on('pageerror',e=>er.push(e.message));let F=0;const ok=(n,v)=>{console.log((v?'OK  ':'FAIL ')+n);if(!v)F++;};
await p.goto('file://'+process.cwd()+'/test_fb.html');await p.waitForTimeout(400);await p.click('.wt[data-u=kevin]');await p.fill('#pw1','1');await p.fill('#pw2','1');await p.click('#pwGo');await p.waitForTimeout(900);
await p.evaluate(async()=>{await db.collection('bestell').doc('b1').set({id:'b1',artikel:'Steckachse',datum:'01.11.2026',status:'offen',lieferant:'KTM'});show('bestell');});await p.waitForTimeout(500);
let t=await p.textContent('#bCols');ok('Offen: angelegt',/angelegt 01\.11\.2026/.test(t)&&!/bestellt 01/.test(t));ok('Kopf Angeliefert',/Angeliefert · Kunde informieren/.test(t));
await p.click('[data-bmv=b1][data-to=bestellt]');await p.waitForTimeout(500);
const h=await p.evaluate(()=>TODAY().split('-').reverse().join('.'));t=await p.textContent('#bCols .col[data-k=bestellt]');ok('Bestellt: Datum heute',t.includes('bestellt '+h)&&t.includes('angelegt 01.11.2026'));ok('Knopf angeliefert',/angeliefert →/.test(t));
ok('keine JS-Fehler',!er.length);if(er.length)console.log(er);await b.close();process.exit(F?1:0);})();
