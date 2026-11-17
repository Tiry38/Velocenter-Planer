/* 1.11.4: Kunden aus Veloport-Rechnungen (Eingangskorb kdein) */
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1500,height:900}});await c.route(/gstatic|googleapis|cdnjs/,r=>r.abort());const p=await c.newPage();const er=[];p.on('pageerror',e=>er.push(e.message));let F=0;const ok=(n,v)=>{console.log((v?'OK  ':'FAIL ')+n);if(!v)F++;};
await p.goto('file://'+process.cwd()+'/test_fb.html');await p.waitForTimeout(400);await p.click('.wt[data-u=kevin]');await p.fill('#pw1','1');await p.fill('#pw2','1');await p.click('#pwGo');await p.waitForTimeout(1200);
const R=await p.evaluate(async()=>{const y=new Date().getFullYear(),dd=x=>{const d=new Date(Date.now()-x*864e5);return deDate(d);};
 await db.doc('meta/kd_'+y).set({items:{a1:{id:'a1',y:String(y),dat:dd(40),nr:'100',marke:'KTM',modell:'Macina Race SX LFC',kunde:'Alt Anna'}}},{merge:true});
 await db.collection('leasing').doc('BB').set(Object.assign({},(L.find(f=>f.id==='BB')||{}),{id:'BB',k:'BB',n:'Businessbike',reW:'PEAC Germany'}));
 await new Promise(r=>setTimeout(r,600));
 const dat=dd(0),yy=String(y).slice(2);
 // 1) normaler Verkauf, Kunde aus Kunden-Nr.
 await db.collection('kdein').doc('kr'+yy+'-2001').set({typ:'re',quelle:'kizentrale',nr:'R'+yy+'-2001',dat,marke:'ktm',modell:'macina race sx  LFC',preis:3999,rahmen:'WAB123456',fid:'FID777',adr:'Herr\nKevin Thirolf\nMusterstr. 1\n76744 Wörth',kd:[{q:'re',vn:'Kevin',nn:'Thirolf',tel:['07271 1234','0176-12345678'],mail:['k@t.de']}]});
 // 2) Leasing PEAC: Kandidat aus Kunden-Nr. = Leasinggeber → verworfen; Übernahme liegt schon im Korb
 await db.collection('kdein').doc('kr'+yy+'-2002').set({typ:'re',quelle:'kizentrale',nr:'R'+yy+'-2002',dat,marke:'Gudereit',modell:'EC-35 Evo',preis:3200,rahmen:'GUD-99887',adr:'PEAC Germany GmbH\nBahnhofstr. 1\n12345 Ort',kd:[{q:'re',name:'PEAC Germany GmbH'}]});
 await db.collection('kdein').doc('kugud99887').set({typ:'ue',quelle:'kizentrale',rahmen:'GUD99887',name:'Maria Muster',tel:['0151 2222333'],mail:['m@m.de'],ts:Date.now()});
 // 3) schon vorhandener Beleg → nicht doppelt
 await db.collection('kdein').doc('kr'+yy+'-100').set({typ:'re',quelle:'kizentrale',nr:'R'+yy+'-100',dat:dd(40),marke:'KTM',modell:'X',preis:2500,adr:'',kd:[]});
 await new Promise(r=>setTimeout(r,3000));
 const it=KD[y];const q=await db.collection('kdein').get();
 return {a:it['kr'+yy+'2001'],b:it['kr'+yy+'2002'],n:Object.keys(it).length,korb:q.docs.length};});
ok('Zeile 1 angelegt',!!R.a);ok('Modell angeglichen',R.a&&R.a.modell==='Macina Race SX LFC'&&R.a.marke==='KTM');
ok('Kunde Nachname zuerst + Handy',R.a&&R.a.kunde==='Thirolf Kevin'&&R.a.tel==='0176-12345678'&&R.a.mail==='k@t.de');
ok('Beleg-Nr. + Preis',R.a&&R.a.nr==='2001'&&R.a.preis==='3999');ok('vollständig = nicht gelb',R.a&&R.a.pr.length===0);
ok('Leasing BB erkannt',R.b&&R.b.leas==='BB');ok('Leasinggeber nicht als Kunde, Übernahme ergänzt',R.b&&R.b.kunde==='Muster Maria'&&R.b.tel==='0151 2222333'&&R.b.kq==='ue');
ok('kein Doppel (3 Zeilen)',R.n===3);ok('Korb leer',R.korb===0);
await p.evaluate(()=>show('kunden'));await p.waitForTimeout(600);
// 4) Zeile mit Lücken → gelb, ✓ macht sie weiß
await p.evaluate(async()=>{const yy=String(new Date().getFullYear()).slice(2);await db.collection('kdein').doc('kr'+yy+'-2003').set({typ:'re',quelle:'kizentrale',nr:'R'+yy+'-2003',dat:deDate(new Date()),marke:'QiO',modell:'Eins P-5',preis:2800,adr:'Frau\nEva Neu',kd:[{q:'adr',name:'Eva Neu'}]});});
await p.waitForTimeout(2500);
let n=await p.locator('#kdGrid .row.kpr').count();ok('gelbe Zeile sichtbar',n===1);
const ti=await p.getAttribute('#kdGrid .row.kpr','title');ok('Hinweis nennt Lücken',/Rahmen-Nr\..*Telefon.*E-Mail.*Rechnungsadresse/.test(ti||''));
await p.screenshot({path:'kdein_g.png',clip:{x:100,y:120,width:1400,height:120}});await p.click('#kdGrid [data-kprok]');await p.waitForTimeout(600);n=await p.locator('#kdGrid .row.kpr').count();ok('✓ geprüft = nicht mehr gelb',n===0);
await p.screenshot({path:'kdein.png'});
ok('keine JS-Fehler',!er.length);if(er.length)console.log(er);await b.close();process.exit(F?1:0);})();
