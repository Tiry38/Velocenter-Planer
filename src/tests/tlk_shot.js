const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1500,height:900}});await c.route(/gstatic|googleapis|cdnjs/,r=>r.abort());const p=await c.newPage();const er=[];p.on('pageerror',e=>er.push(e.message));
await p.goto('file://'+process.cwd()+'/test_fb.html');await p.waitForTimeout(400);await p.click('.wt[data-u=kevin]');await p.fill('#pw1','1');await p.fill('#pw2','1');await p.click('#pwGo');await p.waitForTimeout(900);
await p.evaluate(async()=>{await db.collection('verkauf').doc('vx').set({id:'vx',name:'Agi',modell:'KTM Macina Team 750 LFC LTD',b:'1'});const t=TODAY();await db.collection('planer').doc('px').set({id:'px',datum:t,spalte:'t1',text:'Agi',vid:'vx',von:'martina',ts:1});});
await p.waitForTimeout(800);const el=await p.$('.e:has(.tlk)');const r=await el.evaluate(e=>[getComputedStyle(e,'::before').display,getComputedStyle(e).backgroundImage]);console.log(r,er);
const bb=await el.boundingBox();await p.screenshot({path:'tlk.png',clip:{x:bb.x-30,y:bb.y-15,width:bb.width+60,height:bb.height+30}});await b.close();})();
