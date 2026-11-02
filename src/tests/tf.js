const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1400,height:900}});await c.route(/gstatic|googleapis|cdnjs/,r=>r.abort());
const p=await c.newPage();const er=[];p.on('pageerror',e=>er.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ERR_|Failed to load/.test(m.text()))er.push(m.text())});
const u='file://'+process.cwd()+'/test_fb.html';await p.goto(u);await p.waitForTimeout(500);
const R=[];const ok=(n,x)=>R.push((x?'OK  ':'FAIL')+' '+n);const wait=t=>p.waitForTimeout(t||250);
ok('Login: 5 Personen, keine Rollen',(await p.$$eval('.wt',w=>w.length))===5&&!(await p.$('.wt small')));
await p.click('.wt[data-u=kevin]');await wait();ok('Erstlogin: festlegen',await p.isVisible('#pw2'));
await p.fill('#pw1','12');await p.fill('#pw2','12');await p.click('#pwGo');await wait(900);
ok('angemeldet mit Passwort "12"',!(await p.isVisible('#whoOv'))&&(await p.textContent('#meName'))==='Kevin');
ok('Leasing-Anbieter automatisch angelegt',await p.evaluate(()=>Object.keys(__fbmState().docs).filter(k=>k.startsWith('leasing/')).length)===13);
// Import
await p.click('#meImport');await wait();ok('Import fragt zuerst Tresor-PIN',await p.isVisible('#pdF'));
await p.fill('#pdP','4711');await p.click('#pdF button[type=submit]');await wait(1500);
ok('Import-Dialog nach PIN',await p.isVisible('#imF'));
await p.setInputFiles('#imFile','test.xlsx');await p.click('#imF button[type=submit]');await wait(2500);
const t=await p.textContent('#toast');ok('Import: '+t,/Übernommen: \d+ Planer/.test(t));
const st=await p.evaluate(()=>__fbmState());const raw=JSON.stringify(st.docs);
ok('Passwörter/Logins NICHT im Klartext gespeichert',!raw.includes('geheim1')&&!raw.includes('Demo-WLAN')&&!raw.includes('4711'));
ok('App-Passwort nicht im Klartext (nur Auth)',!raw.includes('VC!12'));
const tdy=await p.evaluate(()=>TODAY());await wait(400);
ok('Termin mit Zeit übernommen',await p.$eval(`.row[data-iso="${tdy}"]`,r=>r.textContent.includes('09:00')&&r.textContent.includes('Abholung Tour PX 810')));
await p.reload();await wait(1500);ok('Neu laden im selben Tab: bleibt angemeldet',!(await p.isVisible('#whoOv')));
await wait(800);ok('Rollover: Alte Werkstatt/Bestellung → heute',await p.$eval(`.row[data-iso="${tdy}"]`,r=>r.textContent.includes('Offene Werkstatt alt')&&r.textContent.includes('Offene Bestellung alt')));
ok('Anfrage als Punkt',await p.$$eval(`.row[data-iso="${tdy}"] .dot`,d=>d.length)===1);
// add
await p.hover(`.c[data-iso="${tdy}"][data-col="t2"]`);await p.click(`.c[data-iso="${tdy}"][data-col="t2"] .plus`);await p.fill('#edit','14:30 Abholung Müller');await p.keyboard.press('Enter');await wait(600);
ok('Termin eintragen → Zeit-Spalte',await p.$$eval(`.row[data-iso="${tdy}"] .c.zt`,z=>z.some(x=>x.textContent.includes('14:30'))));
{const bb=await p.locator(`.c[data-iso="${tdy}"][data-col="ws"]`).boundingBox();await p.mouse.click(bb.x+20,bb.y+bb.height-6);}await wait(200);ok('Klick ins leere Feld öffnet Eingabe',await p.isVisible('#edit'));await p.keyboard.type('Feld-Klick');await p.keyboard.press('Enter');await wait(500);ok('…und speichert',await p.evaluate(()=>P.some(e=>e.text==='Feld-Klick'&&e.spalte==='ws')));
const zc=`.row[data-iso="${tdy}"] .c.zt[data-of="t2"]`;{const bb=await p.locator(zc).boundingBox();await p.mouse.click(bb.x+40,bb.y+bb.height-5);}await wait(200);ok('Klick in Zeit-Feld öffnet Uhrzeit-Auswahl',await p.$eval('#edit',i=>i.type==='time'));
await p.fill('#edit','16:45');await p.keyboard.press('Enter');await wait(300);ok('…dann Termin-Text',await p.isVisible('#edit'));await p.keyboard.type('Abholung Schmidt');await p.keyboard.press('Enter');await wait(500);
ok('Termin mit gewählter Uhrzeit angelegt',await p.evaluate(()=>P.some(e=>e.text==='Abholung Schmidt'&&e.zeit==='16:45'&&e.spalte==='t2')));
await p.click(`.row[data-iso="${tdy}"] .tchip:text("16:45")`);await wait(200);await p.fill('#edit','17:15');await p.keyboard.press('Enter');await wait(500);ok('Uhrzeit per Klick ändern',await p.evaluate(()=>P.some(e=>e.text==='Abholung Schmidt'&&e.zeit==='17:15')));
await p.click(`.row[data-iso="${tdy}"] .e .ck`);await wait(500);ok('erledigt + Kürzel',await p.$$eval(`.row[data-iso="${tdy}"] .e.done .av`,a=>a.some(x=>x.title.includes('Kevin'))));
let n0=await p.evaluate(()=>P.length);await p.hover(`.row[data-iso="${tdy}"] .c[data-col="int"] .e`);await p.click(`.row[data-iso="${tdy}"] .c[data-col="int"] .e .x`);await wait(500);ok('löschen',await p.evaluate(()=>P.length)===n0-1);await p.click('.undo');await wait(600);ok('rückgängig',await p.evaluate(()=>P.length)===n0);
// second user live
const p2=await c.newPage();await p2.goto(u);await p2.waitForTimeout(500);await p2.click('.wt[data-u=sascha]');await p2.fill('#pw1','7');await p2.fill('#pw2','7');await p2.click('#pwGo');await p2.waitForTimeout(1200);
ok('Sascha: kein Passwörter-Reiter, kein Import',!(await p2.isVisible('.navbtn[data-v=tresor]'))&&!(await p2.isVisible('#meImport')));
await p2.hover(`.c[data-iso="${tdy}"][data-col="wa"]`);await p2.click(`.c[data-iso="${tdy}"][data-col="wa"] .plus`);await p2.fill('#edit','LIVE von Sascha');await p2.keyboard.press('Enter');
await p.bringToFront();await p.waitForTimeout(1200);ok('Live: sofort bei Kevin',await p.$$eval('.e',e=>e.some(x=>x.textContent.includes('LIVE von Sascha')&&x.querySelector('.av').textContent==='S')));
// Sascha: Lieferanten-Logins mit PIN
await p2.click('.navbtn[data-v=lief]');await p2.waitForTimeout(300);ok('Lieferanten bei Sascha, Logins verdeckt',(await p2.$$eval('#sTab tbody tr',r=>r.length))===2&&!(await p2.textContent('#sTab')).includes('velo '));
await p2.click('#sUnlock');await p2.fill('#pdP','1111');await p2.click('#pdF button[type=submit]');await p2.waitForTimeout(1500);ok('falsche PIN abgelehnt',(await p2.textContent('#pdE')).includes('falsch'));
await p2.fill('#pdP','4711');await p2.click('#pdF button[type=submit]');await p2.waitForTimeout(1500);ok('Sascha sieht mit PIN Lieferanten-Logins',(await p2.textContent('#sTab')).includes('geheim')===false&&(await p2.textContent('#sTab')).includes('velo'));
await p2.click('#sTab td[data-f="kdnr"]');await p2.keyboard.press('Control+A');await p2.keyboard.type('777');await p2.keyboard.press('Enter');await p2.waitForTimeout(500);ok('Lieferanten-Tabelle: Kunden-Nr. direkt ändern',await p2.evaluate(()=>S.some(s=>s.kdnr==='777')&&JSON.stringify(__fbmState().docs).includes('777')));
await p2.click('#sTab [data-pedit]');await p2.keyboard.press('Control+A');await p2.keyboard.type('neuPW9');await p2.keyboard.press('Enter');await p2.waitForTimeout(700);ok('Passwort direkt ändern (verschlüsselt)',await p2.evaluate(()=>LOGINS.some(l=>l.pass==='neuPW9')&&!JSON.stringify(__fbmState().docs).includes('neuPW9')));
await p2.close();
await p.click('#navTog');await wait(350);ok('Navi einklappen: nur Symbole',await p.evaluate(()=>document.body.classList.contains('navmini'))&&!(await p.isVisible('.navbtn .lbl')));
await p.click('.navbtn[data-v=kasse]');await wait(200);ok('Eingeklappt: Symbol anklickbar',await p.isVisible('#v-kasse'));await p.screenshot({path:'navmini.png'});
await p.click('#navTog');await wait(350);ok('Navi ausklappen',await p.isVisible('.navbtn .lbl'));
// Verkauf
await p.click('.navbtn[data-v=verkauf]');await wait(300);ok('Verkauf Liste: 2 offen',(await p.$$eval('.vr',b=>b.length))===2);
await p.click('.vr .st.m[aria-pressed=false]');await wait(500);ok('montiert + wer',await p.evaluate(()=>V.some(v=>v.m==='1'&&v.mVon==='kevin')));
await p.selectOption('.vr .ssel','rene');await wait(400);ok('Verkauf/Beratung',await p.evaluate(()=>V.some(v=>v.verk==='rene')));
await p.click('.vr td.kcell');await wait(200);await p.click('.vr td.kcell select option[data-now]');await wait(500);ok('LT per KW-Auswahl',await p.evaluate(()=>V.some(v=>/^KW \d+$/.test(v.lt||''))));
await p.selectOption('#vkSortSel','lt');await wait(200);ok('Sortieren nach Liefertermin',(await p.$$eval('.vr',r=>r.length))===2);
ok('Kacheln weg, Steuerung im Tabellenkopf',!(await p.$('#vkStats'))&&!!(await p.$('th.hL #vkSortSel'))&&!!(await p.$('th.hL #vkDone'))&&!!(await p.$('th.hR #vkAdd')));
ok('Keine Suche/Karten-Knöpfe mehr',!(await p.$('#vkSearch'))&&!(await p.$('#vkViewSeg'))&&!(await p.$('#live')));
await p.click('#vkAdd');await p.fill('[data-vf=new] input[name=modell]','KTM Macina');await p.click('[data-vf=new] button[type=submit]');await wait(500);ok('+ Rad',await p.evaluate(()=>V.some(v=>v.modell==='KTM Macina')));
// Bestell
await p.click('.navbtn[data-v=bestell]');await wait(300);ok('Bestell-Notiz',(await p.textContent('#iBnotiz')).includes('Einbremsmaschine'));
await p.click('#bAdd');await p.fill('[data-bf=new] input[name=artikel]','Bremsbeläge');await p.click('[data-bf=new] button[type=submit]');await wait(500);ok('+ Bestellung',await p.evaluate(()=>B.some(b=>b.artikel==='Bremsbeläge')));
await p.click('[data-bmv][data-to=bestellt]');await wait(400);ok('→ bestellt',await p.evaluate(()=>B.some(b=>b.status==='bestellt')));
// Leasing
await p.click('.navbtn[data-v=leasing]');await wait(400);ok('Leasing 13 + 13 Logos',(await p.$$eval('.lc',c=>c.length))===13&&(await p.$$eval('.lc .logo img',i=>i.length))===13);
await p.click('.edbtn[data-led="0"]');await p.fill('.edf input[name=is]','95 €');await p.click('.edf button[type=submit]');await wait(600);ok('Leasing bearbeiten gespeichert',await p.evaluate(()=>JSON.stringify(__fbmState().docs).includes('95 €')));
// TG
await p.click('.navbtn[data-v=kasse]');await wait(300);ok('TG übernommen ohne GESAMT',await p.evaluate(()=>T.length===3));await p.fill('#tgAmt','4,50');await p.click('#tgForm button');await wait(500);ok('TG eintragen',(await p.textContent('#tgStats')).includes('4,50'));
// Tresor
await p.click('.navbtn[data-v=tresor]');await wait();await p.fill('#pin','4711');await p.click('#pinForm button');await wait(1500);ok('Passwortliste entschlüsselt',await p.isVisible('#vault')&&(await p.textContent('#vTab')).includes('Servername'));
await p.click('.navbtn[data-v=planer]');ok('Reiterwechsel sperrt',!(await p.isVisible('#vault')));
// PW ändern
await p.click('#meSet');await p.fill('#pcO','12');await p.fill('#pcN','99');await p.fill('#pcN2','99');await p.click('#pcF button[type=submit]');await wait(500);ok('Passwort ändern',!(await p.isVisible('#dlg')));
await p.click('#switchUser');await wait(600);await p.click('.wt[data-u=kevin]');await wait(200);ok('Zweitlogin nur Passwort',!(await p.isVisible('#pw2')));await p.fill('#pw1','12');await p.click('#pwGo');await wait(500);ok('altes PW abgelehnt',(await p.textContent('#pwErr')).includes('falsch'));
await p.fill('#pw1','99');await p.click('#pwGo');await wait(900);ok('neues PW geht',!(await p.isVisible('#whoOv')));
const sw=await (async()=>{await p.setViewportSize({width:390,height:800});await wait();return p.evaluate(()=>document.documentElement.scrollWidth);})();ok('Handy ohne Querscroll ('+sw+')',sw<=392);
await p.setViewportSize({width:1400,height:900});await wait(300);await p.screenshot({path:'fb1.png'});
const toasts=await p.evaluate(()=>(window.__t||[]).filter(x=>x.startsWith('⚠')));
console.log(R.join('\n'));console.log('Fehler:',er,toasts);await b.close();})();
