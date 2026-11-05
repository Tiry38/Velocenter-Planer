// Gesamttest (Stand 1.10.42) – jeder Schritt einzeln, ein Fehler bricht den Lauf nicht ab.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1400,height:900}});await c.route(/gstatic|googleapis|cdnjs/,r=>r.abort());
const er=[];const watch=p=>{p.setDefaultTimeout(4000);p.on('pageerror',e=>er.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ERR_|Failed to load|version\.txt/.test(m.text()))er.push(m.text())});};
const p=await c.newPage();watch(p);const u='file://'+process.cwd()+'/test_fb.html';await p.goto(u);await p.waitForTimeout(500);
const R=[];const ok=(n,x)=>R.push((x?'OK  ':'FAIL')+' '+n);const wait=(t,q=p)=>q.waitForTimeout(t||250);
const st=async(n,f)=>{try{ok(n,await f())}catch(e){ok(n+' → '+String(e.message).split('\n')[0],false)}};
const fieldClick=async(q,sel)=>{const bb=await q.locator(sel).boundingBox();await q.mouse.click(bb.x+20,bb.y+bb.height-6);};
const state=q=>q.evaluate(()=>JSON.stringify(__fbmState().docs));
// ── Anmeldung
await st('Login: 5 Personen, keine Rollen',async()=>(await p.$$eval('.wt',w=>w.length))===5&&!(await p.$('.wt small')));
await st('Erstlogin: Passwort festlegen',async()=>{await p.click('.wt[data-u=kevin]');await wait();return p.isVisible('#pw2');});
await st('angemeldet mit Passwort "12"',async()=>{await p.fill('#pw1','12');await p.fill('#pw2','12');await p.click('#pwGo');await wait(900);return !(await p.isVisible('#whoOv'))&&(await p.textContent('#meName'))==='Kevin';});
await st('Leasing-Anbieter automatisch angelegt (13)',()=>p.evaluate(()=>Object.keys(__fbmState().docs).filter(k=>k.startsWith('leasing/')).length===13));
await st('Navi: kein Import-Knopf, kein grünes Feld',async()=>!(await p.isVisible('#meImport'))&&!(await p.$('.secure')));
// ── Import aus Sheet (Knopf liegt versteckt, wird aus ⚙ Einstellungen ausgelöst)
await st('Import fragt zuerst Tresor-PIN',async()=>{await p.evaluate(()=>document.getElementById('meImport').click());await wait();return p.isVisible('#pdF');});
await st('Import-Dialog nach PIN',async()=>{await p.fill('#pdP','4711');await p.click('#pdF button[type=submit]');await wait(1500);return p.isVisible('#imF');});
await st('Import: Planer übernommen',async()=>{await p.setInputFiles('#imFile','test.xlsx');await p.click('#imF button[type=submit]');await wait(2500);const t=await p.textContent('#toast');return /Übernommen: \d+ Planer/.test(t);});
await st('Passwörter/Logins/PIN nicht im Klartext gespeichert',async()=>{const raw=await state(p);return !raw.includes('geheim1')&&!raw.includes('Demo-WLAN')&&!raw.includes('4711');});
await st('App-Passwort nicht im Klartext (nur Auth)',async()=>!(await state(p)).includes('VC!12'));
const tdy=await p.evaluate(()=>TODAY());await wait(400);
const imT=await p.evaluate(()=>(P.find(e=>e.text==='Abholung Tour PX 810')||{}).datum);
await st('Termin mit Zeit übernommen (Vergangene zeigen)',async()=>{if(imT<tdy)await p.evaluate(()=>document.getElementById('past').click());await wait(300);return p.$eval(`.row[data-iso="${imT}"]`,r=>r.textContent.includes('09:00')&&r.textContent.includes('Abholung Tour PX 810'));});
await st('Anfrage als Punkt',async()=>(await p.$$eval(`.row[data-iso="${imT}"] .dot`,d=>d.length))===1);
if(imT<tdy)await p.evaluate(()=>document.getElementById('past').click());
await st('Neu laden: bleibt angemeldet',async()=>{await p.reload();await wait(1500);return !(await p.isVisible('#whoOv'));});
await wait(800);
await st('Rollover: alte offene Werkstatt → heute',()=>p.$eval(`.row[data-iso="${tdy}"]`,r=>r.textContent.includes('Offene Werkstatt alt')));
// ── Planer
await st('Klick ins leere Feld → Eingabe + speichern',async()=>{await fieldClick(p,`.c[data-iso="${tdy}"][data-col="ws"]`);await wait(200);if(!(await p.isVisible('#edit')))return false;await p.keyboard.type('Feld-Klick');await p.keyboard.press('Enter');await wait(500);return p.evaluate(()=>P.some(e=>e.text==='Feld-Klick'&&e.spalte==='ws'));});
await st('Zeit-Feld: nur 09:00–12:00 + 14:30–17:45',async()=>{const bb=await p.locator(`.c.zt[data-iso="${tdy}"][data-of="t2"]`).boundingBox();await p.mouse.click(bb.x+40,bb.y+bb.height-5);await wait(200);return p.$eval('#edit',i=>{const v=[...i.options].map(o=>o.value).filter(Boolean);return v[0]==='09:00'&&v.includes('12:00')&&!v.includes('12:15')&&v.includes('14:30')&&v[v.length-1]==='17:45';});});
await st('Termin mit gewählter Uhrzeit angelegt',async()=>{await p.selectOption('#edit','16:45');await wait(300);await p.keyboard.type('Abholung Schmidt');await p.keyboard.press('Enter');await wait(500);return p.evaluate(()=>P.some(e=>e.text==='Abholung Schmidt'&&e.zeit==='16:45'&&e.spalte==='t2'));});
await st('Uhrzeit per Klick ändern',async()=>{await p.click(`.row[data-iso="${tdy}"] .tchip:text("16:45")`);await wait(200);await p.selectOption('#edit','17:15');await wait(500);return p.evaluate(()=>P.some(e=>e.text==='Abholung Schmidt'&&e.zeit==='17:15'));});
await st('Kein Abhak-Kästchen mehr',async()=>!(await p.$('.row .e .ck')));
let n0=await p.evaluate(()=>P.length);
await st('löschen',async()=>{const e=p.locator(`.row[data-iso="${tdy}"] .e`).first();await e.hover();await e.locator('.x').click();await wait(500);return (await p.evaluate(()=>P.length))===n0-1;});
await st('rückgängig',async()=>{await p.click('.undo');await wait(600);return (await p.evaluate(()=>P.length))===n0;});
// ── zweiter Nutzer live
const p2=await c.newPage();watch(p2);await p2.goto(u);await wait(500,p2);await p2.click('.wt[data-u=sascha]');await p2.fill('#pw1','7');await p2.fill('#pw2','7');await p2.click('#pwGo');await wait(1200,p2);
await st('Sascha: kein Kunden/Auswertung/Notizen/Passwörter, kein Import',async()=>{for(const v of ['kunden','ausw','notes','tresor'])if(await p2.isVisible(`.navbtn[data-v=${v}]`))return false;return !(await p2.isVisible('#meImport'));});
await st('Live: Eintrag von Sascha sofort bei Kevin',async()=>{await fieldClick(p2,`.c[data-iso="${tdy}"][data-col="wa"]`);await wait(200,p2);await p2.keyboard.type('LIVE von Sascha');await p2.keyboard.press('Enter');await p.bringToFront();await wait(1200);return p.$$eval('.e',e=>e.some(x=>x.textContent.includes('LIVE von Sascha')&&x.querySelector('.av').textContent==='S'));});
await st('Sascha: Lieferanten direkt bearbeiten (Kunden-Nr.)',async()=>{await p2.bringToFront();await p2.click('.navbtn[data-v=lief]');await wait(300,p2);await p2.click('#sTab td[data-f="kdnr"]');await p2.keyboard.press('Control+A');await p2.keyboard.type('777');await p2.keyboard.press('Enter');await wait(500,p2);return p2.evaluate(()=>S.some(s=>s.kdnr==='777'));});
await st('Lieferanten: keine Logins/Passwörter in der Tabelle',async()=>{const t=await p2.textContent('#sTab');return !t.includes('geheim')&&!(await p2.$('#sTab [data-pedit]'));});
await st('Sascha: Verkauf-Status direkt (ohne Auswahl) = er selbst',async()=>{await p2.click('.navbtn[data-v=verkauf]');await wait(300,p2);await p2.click('.vr .st.an[aria-pressed=false]');await wait(500,p2);return p2.evaluate(()=>V.some(v=>v.an==='1'&&v.anVon==='sascha'));});
await p2.close();await p.bringToFront();
// ── Navi
await st('Navi startet eingeklappt',()=>p.evaluate(()=>document.body.classList.contains('navmini')));
await st('Eingeklappt: Symbol anklickbar',async()=>{await p.click('.navbtn[data-v=kasse]');await wait(200);return p.isVisible('#v-kasse');});
await st('Navi ausklappen',async()=>{await p.click('#navTog');await wait(400);return p.isVisible('.navbtn .lbl');});
await st('Navi einklappen',async()=>{await p.click('#navTog');await wait(400);return p.evaluate(()=>document.body.classList.contains('navmini'));});
// ── Verkauf
await st('Verkauf: Liste mit Rädern',async()=>{await p.click('.navbtn[data-v=verkauf]');await wait(300);return (await p.$$eval('.vr',b=>b.length))>=2;});
await st('Admin: montiert → Person wählen → gespeichert',async()=>{await p.click('.vr .st.m[aria-pressed=false]');await wait(300);const o=p.locator('.kdpop [data-u=kevin], .kdpop [data-who=kevin], .kdpop button:has-text("Kevin")').first();await o.click();await wait(500);return p.evaluate(()=>V.some(v=>v.m==='1'&&v.mVon==='kevin'));});
await st('Beratung wählen',async()=>{await p.selectOption('.vr .ssel','rene');await wait(400);return p.evaluate(()=>V.some(v=>v.verk==='rene'));});
await st('LT-Liste: aktuelle Woche markiert, wählbar',async()=>{await p.click('.vr td.kcell');await wait(300);if(!(await p.isVisible('.ltpop')))return false;await p.keyboard.press('Enter');await wait(500);return p.evaluate(()=>V.some(v=>/^KW \d+\/\d\d$/.test(v.lt||'')));});
await st('Sortieren nach Liefertermin',async()=>{await p.selectOption('#vkSortSel','lt:1');await wait(200);return (await p.$$eval('.vr',r=>r.length))>=2;});
await st('Steuerung im Tabellenkopf, keine Suche/Kacheln',async()=>!!(await p.$('#vkSortSel'))&&!!(await p.$('#vkDone'))&&!!(await p.$('#vkAdd'))&&!(await p.$('#vkStats'))&&!(await p.$('#vkSearch')));
await st('+ Verkauftes Rad',async()=>{await p.click('#vkAdd');await p.fill('[data-vf=new] input[name=modell]','KTM Macina');await p.click('[data-vf=new] button[type=submit]');await wait(500);return p.evaluate(()=>V.some(v=>v.modell==='KTM Macina'));});
// ── Bestellungen
await st('Bestell-Notiz übernommen',async()=>{await p.click('.navbtn[data-v=bestell]');await wait(300);return (await p.textContent('#iBnotiz')).includes('Einbremsmaschine');});
await st('+ Bestellung',async()=>{await p.click('#bAdd');await p.fill('[data-bf=new] input[name=artikel]','Bremsbeläge');await p.click('[data-bf=new] button[type=submit]');await wait(500);return p.evaluate(()=>B.some(b=>b.artikel==='Bremsbeläge'));});
await st('Bestellung → bestellt',async()=>{await p.click('[data-bmv][data-to=bestellt]');await wait(400);return p.evaluate(()=>B.some(b=>b.status==='bestellt'));});
// ── Reklamationen
await st('Reklamationen öffnen',async()=>{await p.click('.navbtn[data-v=rekla]');await wait(300);return p.isVisible('#v-rekla');});
// ── Leasing
await st('Leasing: 13 Karten mit Logo',async()=>{await p.click('.navbtn[data-v=leasing]');await wait(400);return (await p.$$eval('.lc',c=>c.length))===13&&(await p.$$eval('.lc .logo img',i=>i.length))===13;});
await st('Leasing bearbeiten → gespeichert',async()=>{await p.click('.edbtn[data-led="0"]');await wait(300);const f=p.locator('.edf input[type=text], .edf input:not([type]), .edf textarea').first();await f.fill('Testwert 95 €');await p.click('.edf button[type=submit]');await wait(600);return (await state(p)).includes('Testwert 95 €');});
// ── Trinkgeld
await st('Trinkgeld übernommen ohne GESAMT',async()=>{await p.click('.navbtn[data-v=kasse]');await wait(300);return p.evaluate(()=>T.length===3);});
await st('Trinkgeld eintragen',async()=>{await p.fill('#tgAmt','4,50');await p.click('#tgForm button');await wait(500);return (await p.textContent('#tgStats')).includes('4,50');});
// ── Admin-Reiter
for(const v of ['kunden','ausw','lief'])await st(`Reiter ${v} öffnet`,async()=>{await p.click(`.navbtn[data-v=${v}]`);await wait(400);return p.isVisible('#v-'+v);});
await st('Passwörter-Reiter abgeschaltet',async()=>!(await p.isVisible('.navbtn[data-v=tresor]')));
await st('🔒 Notizen mit PIN öffnen, Verlassen sperrt',async()=>{await p.evaluate(()=>document.getElementById('nOpen').click());await wait(200);await p.fill('#pdP','4711');await p.click('#pdF button[type=submit]');await wait(1500);const a=await p.isVisible('#v-notes');await p.click('.navbtn[data-v=planer]');await wait(300);return a&&!(await p.evaluate(()=>!!window.TKEY));});
// ── Einstellungen
await st('⚙ Einstellungen: Nutzer-Reiter',async()=>{await p.evaluate(()=>setDlg('u'));await wait(400);const r=await p.isVisible('#dlg');await p.keyboard.press('Escape');await wait(200);return r;});
await st('⚙ Einstellungen: Admin-Reiter mit Nutzerverwaltung',async()=>{await p.evaluate(()=>setDlg('a'));await wait(400);const r=!!(await p.$('.umnote'));await p.keyboard.press('Escape');await wait(200);return r;});
// ── Passwort ändern
await st('Passwort ändern',async()=>{await p.evaluate(()=>document.getElementById('meSet').click());await wait(200);await p.fill('#pcO','12');await p.fill('#pcN','99');await p.fill('#pcN2','99');await p.click('#pcF button[type=submit]');await wait(600);return !(await p.isVisible('#pcF'));});
await st('Abmelden → Zweitlogin nur Passwort',async()=>{await p.evaluate(()=>document.getElementById('switchUser').click());await wait(600);await p.click('.wt[data-u=kevin]');await wait(200);return !(await p.isVisible('#pw2'));});
await st('altes Passwort meldet nicht an',async()=>{await p.fill('#pw1','12');await wait(1200);return p.isVisible('#whoOv');});
await st('neues Passwort meldet an (ohne OK)',async()=>{await p.fill('#pw1','99');await wait(1500);return !(await p.isVisible('#whoOv'));});
// ── Handy
await st('Handy ohne Querscroll',async()=>{await p.setViewportSize({width:390,height:800});await wait();const sw=await p.evaluate(()=>document.documentElement.scrollWidth);return sw<=392;});
await p.setViewportSize({width:1400,height:900});await wait(300);
const toasts=await p.evaluate(()=>(window.__t||[]).filter(x=>x.startsWith('⚠')));
console.log(R.join('\n'));const f=R.filter(x=>x.startsWith('FAIL')).length;console.log(`\n${R.length-f}/${R.length} OK`);console.log('JS-Fehler:',er.length?er:'keine',toasts.length?toasts:'');await b.close();process.exit(f||er.length?1:0);})();
