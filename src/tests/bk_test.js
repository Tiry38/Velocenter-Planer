/* 1.10.67: Test Sicherungs-Erinnerung (node bk_test.js) */
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const c=await b.newContext({acceptDownloads:true});await c.addInitScript(()=>{window.__bkTest=true;});const p=await c.newPage();const w=t=>new Promise(r=>setTimeout(r,t));const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/test_fb.html');await w(400);await p.click('.wt[data-u=kevin]');await p.fill('#pw1','1');await p.fill('#pw2','1');await p.click('#pwGo');await w(7500);
const t1=await p.textContent('#dlgBox').catch(()=>'');console.log('Erinnerung:',/Zeit für eine Sicherung/.test(t1),/keine Sicherung/.test(t1));
const dl=p.waitForEvent('download');await p.click('#bkrGo');const d=await dl;console.log('Download:',d.suggestedFilename());await w(800);
console.log('Fenster zu:',await p.isHidden('#dlg'));
const ts=await p.evaluate(()=>IMPX.bakTs+' '+IMPX.bakVon);console.log('bakTs:',ts);
await p.evaluate(()=>{BK_IMPOK=true;bkRemind();});console.log('keine 2. Erinnerung:',await p.isHidden('#dlg'));
await p.evaluate(()=>{IMPX.bakTs=new Date(Date.now()-9*864e5).toISOString();bkRemind();});const t2=await p.textContent('#dlgBox');console.log('9 Tage:',/9 Tage/.test(t2));
await p.click('#bkrSn');await p.evaluate(()=>bkRemind());console.log('Morgen wieder wirkt:',await p.isHidden('#dlg'));
console.log('JS-Fehler:',errs);await b.close()})()
