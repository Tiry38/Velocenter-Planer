/* ================= Velocenter Werkstatt-Cockpit – Oberfläche ================= */
const CLIENT_VERSION='__VERSION__';
const USERS=[{id:'kevin',n:'Kevin',c:'#E2232D'},{id:'stefan',n:'Stefan',c:'#F59E0B'},{id:'martina',n:'Martina',c:'#EC4899'},{id:'sascha',n:'Sascha',c:'#22D3EE'},{id:'rene',n:'René',c:'#34D399'}];
const U=id=>USERS.find(u=>u.id===id)||{n:'',c:'#64748B',id:''};
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sav=id=>{const u=U(id);return id&&u.n?`<span class="sav" style="--uc:${u.c}">${esc(u.n[0])}</span>`:''};
const av=(id,t)=>{const u=U(id);return id&&u.n?`<span class="av" style="--uc:${u.c}" title="${esc((t?t+' ':'')+u.n)}">${esc(u.n[0])}</span>`:''};
const nid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const ls={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(_){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(_){}}};
const ss={get(k){try{return sessionStorage.getItem(k);}catch(_){return null;}},set(k,v){try{sessionStorage.setItem(k,v);}catch(_){}},del(k){try{sessionStorage.removeItem(k);}catch(_){}}};

let ME=null,TSET=false,TCHECK=null,USERSET={};
let P=[],V=[],B=[],T=[],L=[],S=[],I={};
const DOMAIN='@velocenter-cockpit.app';
const ADMINS=['kevin','stefan','martina'];
firebase.initializeApp(FB_CONFIG);
const auth=firebase.auth(),db=firebase.firestore();
try{db.enablePersistence({synchronizeTabs:true}).catch(()=>{});}catch(_){}
const COL={P:'planer',V:'verkauf',B:'bestell',T:'trinkgeld',L:'leasing',S:'lieferanten',I:'info'};
const PWMIN=1;/* 1.7.0: Tiry: Passwort frei wählbar (auch kurz) */
const fpw=pw=>'VC!'+pw+'#cockpit';                       // Firebase verlangt min. 6 Zeichen – so geht auch „7“
const stamp=()=>new Date().toISOString();
function clean(o){const c={};for(const k in o){if(k[0]==='_'||o[k]===undefined)continue;c[k]=o[k];}return c;}
function fail(e){toast('⚠ '+(e&&e.message||e));}
async function save(k,o){const c=clean(o);c.ts=stamp();c.tsVon=ME?ME.id:'';try{await db.collection(COL[k]).doc(String(o.id)).set(c);return c;}catch(e){fail(e);throw e;}}
async function del(k,id){try{await db.collection(COL[k]).doc(String(id)).delete();}catch(e){fail(e);}}
function sessionLost(){}
/* ---------- Datum ---------- */
const WD=['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
const WDS=['SO','MO','DI','MI','DO','FR','SA'];
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const fromIso=s=>new Date(s+'T12:00:00');
const TODAY=()=>iso(new Date());
const dmy=s=>{const d=fromIso(s);return String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear();};
function kw(d){const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const n=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-n);const y=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t-y)/864e5+1)/7);}
function easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return new Date(y,mo-1,da,12);}
const HOL={};[2026,2027,2028].forEach(y=>{const e=easter(y),add=(d,n)=>{HOL[iso(d)]=n;},off=n=>{const d=new Date(e);d.setDate(d.getDate()+n);return d;};
 add(new Date(y,0,1,12),'Neujahr');add(off(-2),'Karfreitag');add(off(1),'Ostermontag');add(new Date(y,4,1,12),'1. Mai');add(off(39),'Himmelfahrt');add(off(50),'Pfingstmontag');add(off(60),'Fronleichnam');add(new Date(y,9,3,12),'Dt. Einheit');add(new Date(y,10,1,12),'Allerheiligen');add(new Date(y,11,24,12),'Heiligabend');add(new Date(y,11,25,12),'1. Weihnachtstag');add(new Date(y,11,26,12),'2. Weihnachtstag');add(new Date(y,11,31,12),'Silvester');});
function tick(){const d=new Date();$('clock').innerHTML=String(d.getHours()).padStart(2,'0')+'<i>:</i>'+String(d.getMinutes()).padStart(2,'0');$('dWd').textContent=WD[d.getDay()];$('dKw').textContent='KW '+kw(d);$('dDate').innerHTML=d.getDate()+'. <span class="mL">'+d.toLocaleDateString('de-DE',{month:'long'})+'</span><span class="mS">'+d.toLocaleDateString('de-DE',{month:'short'})+'</span> '+d.getFullYear();}
tick();setInterval(tick,15000);

/* ---------- Navigation ---------- */
const titles={planer:'Planer',verkauf:'Verkaufte Räder',bestell:'Bestellungen',rekla:'Reklamationen',kunden:'Kunden',leasing:'Leasing-Infos',lief:'Lieferanten',kasse:'Trinkgeld EC',tresor:'Passwörter',notes:'Notizen'};
function show(v){const nb=document.querySelector(`.navbtn[data-v=${v}]`);if(!nb||nb.hidden)v='planer';const b=document.querySelector(`.navbtn[data-v=${v}]`),top=document.querySelector('.top');
 top.style.setProperty('--ac',b.style.getPropertyValue('--ac'));document.querySelector('main').style.setProperty('--ac',b.style.getPropertyValue('--ac'));$('tIco').innerHTML=b.querySelector('.tile').innerHTML;$('tSub').textContent=b.querySelector('.lbl small').textContent;
 document.querySelectorAll('.view').forEach(s=>s.classList.toggle('on',s.id==='v-'+v));document.querySelectorAll('.navbtn').forEach(x=>x.setAttribute('aria-current',x.dataset.v===v));$('title').textContent=titles[v];
 if(!['tresor','notes'].includes(v)&&(!$('vault').hidden||NOTES))relock();ls.set('vc_view',v);document.body.dataset.v=v;}
document.querySelectorAll('.navbtn').forEach(b=>b.addEventListener('click',()=>show(b.dataset.v)));
/* Navigation einklappen */
document.querySelectorAll('.navbtn').forEach(b=>{b.title=b.querySelector('.lbl').childNodes[0].textContent.trim();});
function navMini(on,keep){document.body.classList.toggle('navmini',on);$('navTog').setAttribute('aria-label',on?'Navigation ausklappen':'Navigation einklappen');$('navTog').title=on?'Navigation ausklappen':'Navigation einklappen';
 if(keep||!ME)return;ls.set('vc_navmini_'+ME.id,on);db.doc('meta/prefs').set({[ME.id]:{navmini:on}},{merge:true}).catch(()=>{});}
async function navForUser(){if(!ME)return;navMini(!!ls.get('vc_navmini_'+ME.id,false),true);try{const d=await db.doc('meta/prefs').get();const x=d.exists&&d.data()[ME.id];if(x&&typeof x.navmini==='boolean'){navMini(x.navmini,true);ls.set('vc_navmini_'+ME.id,x.navmini);}kdLayLoad(x&&x.kdlay);}catch(_){kdLayLoad(null);}}
$('navTog').addEventListener('click',()=>navMini(!document.body.classList.contains('navmini')));

function toast(t,undo){const el=$('toast');el.textContent=t;el.classList.toggle('act',!!undo);if(undo){const b=document.createElement('button');b.type='button';b.className='undo';b.textContent='Rückgängig';b.onclick=()=>{undo();el.classList.remove('on','act');};el.append(b);}el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on','act'),undo?6000:2200);}

/* ---------- Anmeldung ---------- */
let pwU=null;
async function showLogin(){ME=null;document.body.classList.remove('navmini');stopLive();$('whoOv').hidden=false;pwBack();
 try{const d=await db.doc('meta/users').get({source:'server'});USERSET=d.exists?d.data():{};}catch(e){try{const d=await db.doc('meta/users').get();USERSET=d.exists?d.data():{};}catch(_){USERSET={};}}
 $('whoGrid').innerHTML=USERS.map(u=>`<button class="wt" type="button" data-u="${u.id}" style="--uc:${u.c}"><span class="ring">${esc(u.n[0])}</span><b>${esc(u.n)}</b></button>`).join('');}
function pwOpen(id){pwU=U(id);const f=$('pwForm'),first=!USERSET[id];f.style.setProperty('--uc',pwU.c);$('pwRing').textContent=pwU.n[0];$('pwName').textContent=pwU.n;
 $('pwHint').textContent=first?'Erste Anmeldung: Leg dein Passwort fest.':USERSET[id]==='start'?'Startpasswort eingeben (bekommst du von Kevin) – danach legst du dein eigenes fest':'Passwort eingeben';
 $('pw1').placeholder=first?'Neues Passwort':'Passwort';$('pw2').hidden=!first;$('pwGo').textContent=first?'Festlegen & los':'Anmelden';
 $('pw1').value='';$('pw2').value='';$('pwErr').textContent='';$('whoGrid').hidden=true;$('whoP').hidden=true;f.hidden=false;$('pw1').focus();}
function pwBack(){$('pwForm').hidden=true;$('whoGrid').hidden=false;$('whoP').hidden=false;}
function pwErr(t){const f=$('pwForm');$('pwErr').textContent=t;f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake');}
$('pwBack').addEventListener('click',pwBack);
$('whoGrid').addEventListener('click',e=>{const b=e.target.closest('[data-u]');if(b)pwOpen(b.dataset.u);});
let autoT=null,autoSilent=false,lastTry='';
function autoLogin(){clearTimeout(autoT);if(!pwU)return;const a=$('pw1').value,first=!USERSET[pwU.id];if(!a)return;
 if(first){const b=$('pw2').value;if(a.length<PWMIN||!b||b.length<a.length)return;if(a!==b)return;}
 const key=pwU.id+'|'+a+'|'+(first?$('pw2').value:'');if(key===lastTry)return;
 autoT=setTimeout(()=>{lastTry=key;autoSilent=true;$('pwForm').requestSubmit();},first?500:650);}
['pw1','pw2'].forEach(id=>$(id).addEventListener('input',()=>{$('pwErr').textContent='';autoLogin();}));
$('pwForm').addEventListener('submit',async e=>{e.preventDefault();clearTimeout(autoT);const silent=autoSilent;autoSilent=false;const go=$('pwGo');if(go.disabled)return;const a=$('pw1').value;if(!a){pwErr('Bitte ein Passwort eingeben.');return;}
 if(!USERSET[pwU.id]&&a.length<PWMIN){pwErr('Mindestens '+PWMIN+' Zeichen.');return;}if(!USERSET[pwU.id]&&a!==$('pw2').value){pwErr('Die beiden Eingaben sind nicht gleich.');return;}
 go.disabled=true;const mail=pwU.id+DOMAIN;
 try{if(!USERSET[pwU.id]){try{await auth.createUserWithEmailAndPassword(mail,fpw(a));}catch(e){if(e.code==='auth/email-already-in-use')await auth.signInWithEmailAndPassword(mail,fpw(a));else throw e;}
   await db.doc('meta/users').set({[pwU.id]:true},{merge:true});USERSET[pwU.id]=true;}
  else{const need=USERSET[pwU.id]==='start'?'start':a.length<PWMIN?'kurz':'';if(need)ls.set('vc_pwneed',pwU.id+'|'+need);await auth.signInWithEmailAndPassword(mail,fpw(a));}}
 catch(err){ls.set('vc_pwneed','');const c=err.code||'';if(silent&&/password|credential|user-not-found/.test(c)){$('pwErr').textContent='';return;}pwErr(c==='auth/too-many-requests'?'Zu viele Versuche – bitte kurz warten.':/password|credential|user-not-found/.test(c)?'Passwort falsch.':c==='auth/network-request-failed'?'Keine Internetverbindung.':err.message);}
 finally{go.disabled=false;}});
$('switchUser').addEventListener('click',async()=>{relock();await auth.signOut();});
async function start(me){if(ME&&ME.id===me.id)return;ME=me;const u=U(me.id);$('meName').textContent=u.n;$('meRole').textContent=me.adm?'Admin':'Team';$('meAv').style.setProperty('--uc',u.c);$('meAv').textContent=u.n[0];
 document.querySelector('.navbtn[data-v=tresor]').hidden=true;/* Reiter Passwörter abgeschaltet (1.5.9, Tiry) – Daten bleiben unberührt */document.querySelector('.navbtn[data-v=notes]').hidden=!me.adm;$('whoOv').hidden=true;navForUser();startLive();show(ls.get('vc_view','planer'));toast('Hallo '+u.n+' 👋');pwForceChk();db.doc('meta/users').get().then(d=>{USERSET=d.exists?d.data():{};}).catch(()=>{});}

/* Passwort ändern / zurücksetzen */
function dlg(html){$('dlgBox').innerHTML=html;$('dlg').hidden=false;const f=$('dlgBox').querySelector('input');if(f)f.focus();}
/* 1.7.0: Startpasswort / zu kurzes Passwort -> eigenes festlegen (Pflicht, Fenster nicht wegklickbar) */
let DLGLOCK=false;
function pwForceChk(){const v=String(ls.get('vc_pwneed','')||''),[id,why]=v.split('|');if(!ME||id!==ME.id||!why)return;DLGLOCK=true;
 dlg(`<h3>Eigenes Passwort festlegen</h3><p class="hint">Du bist mit dem Startpasswort angemeldet. Bitte jetzt dein <b>eigenes Passwort</b> festlegen.</p><form id="pfF" autocomplete="off"><input id="pfN" type="password" placeholder="Neues Passwort"><input id="pfN2" type="password" placeholder="Neues Passwort wiederholen"><div class="err" id="pfE"></div><div class="acts"><button class="btn" type="button" id="pfOut">Abmelden</button><button class="btn red" type="submit">Speichern</button></div></form>`);
 $('pfOut').addEventListener('click',async()=>{DLGLOCK=false;dlgClose();relock();await auth.signOut();});
 $('pfF').addEventListener('submit',async e=>{e.preventDefault();const a=$('pfN').value;if(!a){$('pfE').textContent='Bitte ein Passwort eingeben.';return;}if(a!==$('pfN2').value){$('pfE').textContent='Die beiden Eingaben sind nicht gleich.';return;}
  try{await auth.currentUser.updatePassword(fpw(a));if(why==='start'){await db.doc('meta/users').set({[ME.id]:true},{merge:true});USERSET[ME.id]=true;}ls.set('vc_pwneed','');DLGLOCK=false;dlgClose();toast('Passwort gespeichert ✓');}catch(err){$('pfE').textContent=/recent/.test(err.code||'')?'Bitte einmal ab- und wieder anmelden, dann nochmal.':err.message||String(err);}});}
/* 1.7.0: Komplettsicherung als JSON-Datei (Admin). Tresor bleibt draußen. */
let BK_LAST=ls.get('vc_bklast','');
async function backupDl(){const out={app:'Velocenter-Planer',version:document.querySelector('meta[name=vc-ver]')?.content||'',stand:new Date().toISOString(),von:ME.id,daten:{}};let n=0;
 for(const c of ['planer','verkauf','bestell','trinkgeld','leasing','lieferanten','info','meta']){const q=await db.collection(c).get();out.daten[c]={};q.forEach(d=>{out.daten[c][d.id]=d.data();n++;});}
 const blob=new Blob([JSON.stringify(out)],{type:'application/json'}),a=document.createElement('a'),t=new Date();a.href=URL.createObjectURL(blob);a.download='velocenter-sicherung-'+iso(t)+'.json';document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},2000);
 BK_LAST=t.toLocaleDateString('de-DE')+' '+t.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});ls.set('vc_bklast',BK_LAST);return n;}
/* 1.7.0: Admin legt fehlende Konten mit Startpasswort an (zweite Firebase-Instanz, damit der Admin angemeldet bleibt) */
async function kontenSichern(start){const sec=((firebase.apps||[]).find(a=>a.name==='vcsec')||firebase.initializeApp(FB_CONFIG,'vcsec')).auth();const neu=[],da=[];
 for(const u of USERS){if(u.id===ME.id)continue;try{await sec.createUserWithEmailAndPassword(u.id+DOMAIN,fpw(start));neu.push(u);await db.doc('meta/users').set({[u.id]:'start'},{merge:true});USERSET[u.id]='start';}catch(e){if(e.code==='auth/email-already-in-use')da.push(u);else throw e;}finally{try{await sec.signOut();}catch(_){}}}
 return {neu,da};}
function dlgClose(){if(DLGLOCK)return;$('dlg').hidden=true;$('dlgBox').innerHTML='';$('dlgBox').classList.remove('wide');}
$('dlg').addEventListener('click',e=>{if(e.target.id==='dlg'||e.target.closest('[data-close]'))dlgClose();});
$('meCfg').addEventListener('click',()=>brandDlg());
/* ⚙ Einstellungen → Markenlogos: Bild hochladen → automatisch freistellen, zuschneiden, schärfen, auf Einheitshöhe bringen */
function loadImg(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('Bild nicht lesbar'));i.src=r.result;};r.onerror=()=>rej(new Error('Datei nicht lesbar'));r.readAsDataURL(file);});}
function cvs(w,h){const c=document.createElement('canvas');c.width=Math.max(1,w);c.height=Math.max(1,h);return c;}
async function procLogo(file,H=80){const img=await loadImg(file);let w=img.naturalWidth||img.width||600,h=img.naturalHeight||img.height||200;
 const up=Math.min(4,Math.max(1,1600/Math.max(w,h)));if(/svg/i.test(file.type)||up>1){w=Math.round(w*up);h=Math.round(h*up);}const sc=Math.min(1,2400/Math.max(w,h));w=Math.round(w*sc);h=Math.round(h*sc);
 let c=cvs(w,h),x=c.getContext('2d');x.drawImage(img,0,0,w,h);let D=x.getImageData(0,0,w,h),d=D.data;
 // 1) Hintergrund: Randpixel prüfen – einheitlich & deckend → per Farbabstand weich freistellen (auch Innenflächen wie im „O“)
 const edge=[];for(let i=0;i<w;i+=Math.max(1,w>>7)){edge.push((i)*4,((h-1)*w+i)*4);}for(let j=0;j<h;j+=Math.max(1,h>>7)){edge.push((j*w)*4,(j*w+w-1)*4);}
 const opaque=edge.filter(p=>d[p+3]>245).length/edge.length;
 if(opaque>.9){const med=k=>{const a=edge.map(p=>d[p+k]).sort((u,v)=>u-v);return a[a.length>>1];};const bg=[med(0),med(1),med(2)];
  const near=edge.filter(p=>Math.hypot(d[p]-bg[0],d[p+1]-bg[1],d[p+2]-bg[2])<40).length/edge.length;
  if(near>.8){const t0=26,t1=110;for(let p=0;p<d.length;p+=4){const dist=Math.hypot(d[p]-bg[0],d[p+1]-bg[1],d[p+2]-bg[2]);let a=dist<=t0?0:dist>=t1?1:(dist-t0)/(t1-t0);
   if(a<1&&a>0){for(let k=0;k<3;k++)d[p+k]=Math.max(0,Math.min(255,Math.round((d[p+k]-bg[k]*(1-a))/a)));}d[p+3]=Math.round(d[p+3]*a);}}}
 // 2) Zuschneiden auf den Inhalt
 let x0=w,y0=h,x1=-1,y1=-1;for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(d[(j*w+i)*4+3]>14){if(i<x0)x0=i;if(i>x1)x1=i;if(j<y0)y0=j;if(j>y1)y1=j;}
 if(x1<0)throw new Error('Kein Logo im Bild erkannt');x.putImageData(D,0,0);
 const cw=x1-x0+1,ch=y1-y0+1;let cur=cvs(cw,ch);cur.getContext('2d').drawImage(c,x0,y0,cw,ch,0,0,cw,ch);
 // 3) Einheitshöhe (H px = scharf bis 3× Bildschirmdichte), max. Breite 6×H, in Halbschritten verkleinern
 const s2=Math.min(H/ch,(H*6)/cw);const tw=Math.max(1,Math.round(cw*s2)),th=Math.max(1,Math.round(ch*s2));
 while(cur.width/2>tw&&cur.height/2>th){const n=cvs(Math.round(cur.width/2),Math.round(cur.height/2)),nx=n.getContext('2d');nx.imageSmoothingQuality='high';nx.drawImage(cur,0,0,n.width,n.height);cur=n;}
 const out=cvs(tw,th),ox=out.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(cur,0,0,tw,th);
 // 4) Schärfen (Unscharf-Maskierung, nur Farbe, Alpha bleibt)
 const O=ox.getImageData(0,0,tw,th),o=O.data,src=new Uint8ClampedArray(o),amt=.45;
 for(let j=1;j<th-1;j++)for(let i=1;i<tw-1;i++){const p=(j*tw+i)*4;if(src[p+3]<8)continue;for(let k=0;k<3;k++){const bl=(src[p+k]*4+src[p-4+k]+src[p+4+k]+src[p-tw*4+k]+src[p+tw*4+k])/8;o[p+k]=src[p+k]+amt*(src[p+k]-bl);}}
 ox.putImageData(O,0,0);
 // 5) Dunkles Logo auf dunkler Oberfläche unsichtbar → dunkle, unbunte Teile automatisch hell
 if(logoDark(o))logoLight(o);ox.putImageData(O,0,0);
 return out.toDataURL('image/png');}
function logoDark(o){let s=0,n=0;for(let p=0;p<o.length;p+=4){const a=o[p+3]/255;if(a<.3)continue;s+=a*(.2126*o[p]+.7152*o[p+1]+.0722*o[p+2])/255;n+=a;}return n>0&&s/n<.3;}
function logoLight(o){for(let p=0;p<o.length;p+=4){if(o[p+3]<8)continue;const r=o[p],g=o[p+1],b=o[p+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),sat=mx?(mx-mn)/mx:0,l=(.2126*r+.7152*g+.0722*b)/255;if(sat<.25&&l<.55){const v=Math.round(240-l*40);o[p]=v;o[p+1]=v;o[p+2]=Math.min(255,v+8);}}}
async function logoInvert(url){const i=new Image();await new Promise((r,j)=>{i.onload=r;i.onerror=j;i.src=url;});const c=cvs(i.width,i.height),x=c.getContext('2d');x.drawImage(i,0,0);const D=x.getImageData(0,0,c.width,c.height),o=D.data;
 for(let p=0;p<o.length;p+=4){if(o[p+3]<8)continue;const r=o[p],g=o[p+1],b=o[p+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b);if(!mx||(mx-mn)/mx<.25){o[p]=255-r;o[p+1]=255-g;o[p+2]=255-b;}}x.putImageData(D,0,0);return c.toDataURL('image/png');}
// Logos verteilt auf meta/blg_0..15 (Firestore: max. 1 MB je Dokument), meta/brands nur Liste (+ alte Logos)
const BLN=16,blShard=k=>{let h=0;for(const c of String(k))h=(h*31+c.charCodeAt(0))>>>0;return h%BLN;};
let BLEG={},BSH={};
function blMerge(){const l=Object.assign({},BLEG);for(const n in BSH){const m=BSH[n]||{};for(const k in m){if(m[k])l[k]=m[k];else delete l[k];}}BUSER.logos=l;}
function blPut(k,u){const n=blShard(k);BSH[n]=Object.assign({},BSH[n],{[k]:u||null});blMerge();return db.doc('meta/blg_'+n).set({l:{[k]:u||null},ts:stamp()},{merge:true});}
let BLOK=new Set(),BLMIG=false;
// Einmalig (Admin): alte Logos aus meta/brands in die Teil-Dokumente verschieben, danach meta/brands ohne Logos
async function blMig(){if(BLMIG||BLOK.size<BLN||!Object.keys(BLEG).length||!ME||!ADMINS.includes(ME.id))return;BLMIG=true;
 try{const g={};for(const k in BLEG){const n=blShard(k);if(BSH[n]&&k in BSH[n])continue;(g[n]=g[n]||{})[k]=BLEG[k];}
  for(const n in g)await db.doc('meta/blg_'+n).set({l:g[n],ts:stamp()},{merge:true});
  await db.doc('meta/brands').set({list:BUSER.list||[],ts:stamp()});}catch(e){console.warn('Logo-Umzug',e);BLMIG=false;}}
function brSave(){return db.doc('meta/brands').set({list:BUSER.list||[],ts:stamp()},{merge:true});}
function brandDlg(){const A0=allBrands(),A=A0.concat([...new Map(V.filter(b=>String(b.marke||'').trim()).map(b=>brandOfB(b)).filter(x=>!A0.some(a=>a.k===x.k)).map(x=>[x.k,Object.assign({own:true},x)])).values()]),LG=BUSER.logos||{},ul=BUSER.list||[];
 const miss=[...new Set(V.filter(b=>b.modell&&!brandOfB(b)).map(b=>String(b.modell).trim()))].slice(0,40);
 const row=b=>{const u=ul.find(x=>x.k===b.k)||{};const lg=LG[b.k];return `<div class="brow" data-bk="${esc(b.k)}">
  <div class="bprev">${lg?`<img src="${lg}" alt="${esc(b.n)}" class="bp1"><img src="${lg}" alt="" class="bp2">`:`<span class="bchip"${b.c?` style="color:${b.c}"`:''}>${esc(b.n)}</span><em>noch kein Logo</em>`}</div>
  <div class="binfo"><b>${esc(b.n)}</b><label>${b.own?'Erkennungswörter im Modell':'Zusätzliche Erkennungswörter'}<input class="bw" value="${esc(u.w||'')}" placeholder="${b.own?'z. B. Endeavour, Image, Entice':'automatisch erkannt – optional ergänzen'}"></label></div>
  <div class="bacts"><label class="btn bup">⬆ Logo<input type="file" accept="image/*" hidden></label>${lg?`<button class="btn" type="button" data-binv title="Schwarz/Weiß-Teile tauschen">Hell ⇄</button><button class="btn" type="button" data-bdel title="Logo entfernen">✕</button>`:''}${b.own?`<button class="btn" type="button" data-bkill title="Marke löschen">🗑</button>`:''}</div></div>`;};
 $('dlgBox').classList.add('wide');
 dlg(`<h3>⚙ Einstellungen · Markenlogos</h3><p class="hint">Logo hochladen (PNG, JPG, SVG, WebP – Screenshot reicht). Die App stellt automatisch frei, schneidet zu, schärft und bringt es auf die passende Größe für Liste und Karten. Gilt sofort auf allen PCs.</p>
 <div id="brF" class="blist">${A.map(row).join('')}</div>
 <form id="brNew" class="bnew" autocomplete="off"><input name="n" placeholder="Neue Marke, z. B. Kalkhoff" required><input name="w" placeholder="Modellwörter, z. B. Endeavour, Image"><button class="btn red" type="submit">+ Marke</button></form>
 ${miss.length?`<p class="hint bmiss"><b>Ohne erkannte Marke:</b> ${miss.map(esc).join(' · ')}</p>`:''}
 <div class="err" id="brE"></div><div class="acts"><button class="btn" type="button" data-close>Fertig</button></div>`);
 const box=$('dlgBox'),E=t=>{$('brE').textContent=t||'';};
 box.querySelectorAll('.brow').forEach(r=>{const k=r.dataset.bk;
  r.querySelector('input[type=file]').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;E('Logo wird aufbereitet …');try{const u=await procLogo(f);if(u.length>300000)throw new Error('Logo zu groß');await blPut(k,u);E('');toast('Logo gespeichert');brandDlg();}catch(err){E(err.message||String(err));}});
  const inv=r.querySelector('[data-binv]');if(inv)inv.addEventListener('click',async()=>{try{await blPut(k,await logoInvert(BUSER.logos[k]));}catch(err){fail(err);}brandDlg();});
  const del=r.querySelector('[data-bdel]');if(del)del.addEventListener('click',async()=>{try{await blPut(k,null);}catch(err){fail(err);}brandDlg();});
  const kill=r.querySelector('[data-bkill]');if(kill)kill.addEventListener('click',async()=>{BUSER.list=(BUSER.list||[]).filter(x=>x.k!==k);try{await brSave();if(BUSER.logos[k])await blPut(k,null);}catch(err){fail(err);}brandDlg();});
  r.querySelector('.bw').addEventListener('change',async e=>{const w=e.target.value.trim(),b=A.find(x=>x.k===k),l=(BUSER.list||[]).filter(x=>x.k!==k);if(w||b.own)l.push({k,n:b.n,w});BUSER.list=l;try{await brSave();toast('Erkennung gespeichert');}catch(err){fail(err);}});});
 $('brNew').addEventListener('submit',async e=>{e.preventDefault();const n=e.target.n.value.trim(),w=e.target.w.value.trim();if(!n)return;const k=bKey(n);if(allBrands().some(b=>b.k===k||b.n.toLowerCase()===n.toLowerCase())){E('Marke gibt es schon');return;}BUSER.list=(BUSER.list||[]).concat([{k,n,w}]);try{await brSave();}catch(err){fail(err);}brandDlg();});}
$('meSet').addEventListener('click',async()=>{try{const d=await db.doc('meta/users').get();USERSET=d.exists?d.data():{};}catch(_){}dlg(`<h3>Passwort ändern</h3><form id="pcF" autocomplete="off"><input id="pcO" type="password" placeholder="Altes Passwort"><input id="pcN" type="password" placeholder="Neues Passwort"><input id="pcN2" type="password" placeholder="Neues Passwort wiederholen"><div class="err" id="pcE"></div><div class="acts"><button class="btn" type="button" data-close>Abbrechen</button><button class="btn red" type="submit">Speichern</button></div></form>
 ${ME&&ME.adm?`<h3 style="margin-top:18px">🛡 Konten sichern</h3><p class="hint">Legt alle noch fehlenden Konten (${USERS.filter(u=>u.id!==ME.id&&!USERSET[u.id]).map(u=>esc(u.n)).join(', ')||'keins – alle angelegt'}) sofort mit einem <b>Startpasswort</b> an. So kann sich niemand Fremdes als diese Person registrieren. Gib das Startpasswort der Person persönlich – bei der ersten Anmeldung muss sie ein eigenes festlegen.</p><form id="ksF" autocomplete="off" class="acts" style="justify-content:flex-start"><input id="ksP" type="text" placeholder="Startpasswort, z. B. 0204" style="flex:1;min-width:180px"><button class="btn red" type="submit">Konten sichern</button></form><div class="err" id="ksE"></div>
 <h3 style="margin-top:18px">💾 Sicherung</h3><p class="hint">Lädt <b>alle Daten</b> (Planer, Verkauf, Bestellungen, Reklamationen, Kunden, Leasing, Lieferanten, Trinkgeld, Einstellungen) als Datei auf diesen PC. Der kostenlose Firebase-Tarif macht selbst keine Backups – am besten 1× pro Woche. Tresor/Notizen sind nicht dabei. <b>Enthält Kundendaten – nur auf dem Büro-PC speichern, nie verschicken.</b>${BK_LAST?'<br>Letzte Sicherung: '+esc(BK_LAST):''}</p><div class="acts" style="justify-content:flex-start"><button class="btn" type="button" id="bkGo">💾 Sicherung herunterladen</button></div><div class="err" id="bkE"></div>
 <h3 style="margin-top:18px">Passwort eines Mitarbeiters zurücksetzen</h3><p class="hint">Passwort vergessen? So geht es (dauert 1 Minute):</p><p class="hint rsHint">Firebase-Konsole → Projekt <b>Velocenter Planer</b> → Authentication → Nutzer → Person (z. B. sascha@…) → ⋮ → <b>Konto löschen</b>. Danach oben <b>„Konten sichern“</b> mit einem neuen Startpasswort – die Person legt beim nächsten Login ihr eigenes fest.</p><div class="acts">${USERS.filter(u=>u.id!==ME.id).map(u=>`<button class="btn" type="button" data-reset="${u.id}">${esc(u.n)}</button>`).join('')}</div>`:''}`);
 $('pcF').addEventListener('submit',async e=>{e.preventDefault();if($('pcN').value!==$('pcN2').value){$('pcE').textContent='Die neuen Eingaben sind nicht gleich.';return;}if(!$('pcN').value){$('pcE').textContent='Neues Passwort fehlt.';return;}
  try{const u=auth.currentUser;await u.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(u.email,fpw($('pcO').value)));await u.updatePassword(fpw($('pcN').value));ls.set('vc_pwneed','');dlgClose();toast('Passwort geändert');}catch(err){$('pcE').textContent=/password|credential/.test(err.code||'')?'Altes Passwort falsch.':err.message;}});
 const bk=$('bkGo');if(bk)bk.addEventListener('click',async()=>{bk.disabled=true;$('bkE').textContent='Sammle Daten …';try{const n=await backupDl();$('bkE').textContent='✓ Gespeichert ('+n+' Einträge) – liegt im Download-Ordner.';}catch(err){$('bkE').textContent=err.message||String(err);}finally{bk.disabled=false;}});
 const ks=$('ksF');if(ks)ks.addEventListener('submit',async e=>{e.preventDefault();const p=$('ksP').value.trim();if(!p){$('ksE').textContent='Bitte ein Startpasswort eingeben.';return;}$('ksE').textContent='Lege Konten an …';
  try{const r=await kontenSichern(p);$('ksE').innerHTML=(r.neu.length?'✓ Neu angelegt mit Startpasswort: <b>'+r.neu.map(u=>esc(u.n)).join(', ')+'</b>. ':'Kein Konto neu angelegt. ')+(r.da.length?'Gab es schon: '+r.da.map(u=>esc(u.n)+(USERSET[u.id]?'':' ⚠ (nicht über die App angelegt – in der Firebase-Konsole prüfen!)')).join(', '):'');$('ksP').value='';}catch(err){$('ksE').textContent=err.message||String(err);}});
 $('dlgBox').querySelectorAll('[data-reset]').forEach(b=>b.addEventListener('click',()=>{$('dlgBox').querySelector('.rsHint').hidden=false;}));});

/* ---------- Live-Daten (Firestore, sofort auf allen Geräten) ---------- */
let unsubs=[],rTimer=null,dirty=false;
const editing=()=>!!document.querySelector('#grid .edit, .edf, #dlg:not([hidden])')||(document.activeElement&&document.activeElement.isContentEditable);
function renderAll(){renderInfo();render();rv();rb();rr();rk();rl();rs();rtg();}
function scheduleRender(){clearTimeout(rTimer);rTimer=setTimeout(()=>{if(editing()){dirty=true;return;}dirty=false;renderAll();},60);}
document.addEventListener('focusout',()=>setTimeout(()=>{if(dirty&&!editing()){dirty=false;renderAll();}},120));
function ping(fromOther){const l=$('live');if(l&&fromOther){l.classList.remove('ping');void l.offsetWidth;l.classList.add('ping');}}
function listen(k,setter,q){let first=true;const ref=q||db.collection(COL[k]);unsubs.push(ref.onSnapshot({includeMetadataChanges:false},snap=>{
  setter(snap.docs.map(d=>Object.assign({id:d.id},d.data())));
  if(!first){const other=snap.docChanges().some(c=>(c.doc.data()||{}).tsVon&&(c.doc.data()||{}).tsVon!==ME.id&&!snap.metadata.hasPendingWrites);if(other){ping(true);}}
  first=false;$('live')&&$('live').classList.toggle('off',snap.metadata.fromCache&&!navigator.onLine);scheduleRender();},e=>{fail(e);}));}
function stopLive(){unsubs.forEach(u=>{try{u();}catch(_){}});unsubs=[];}
function startLive(){stopLive();const from=iso(new Date(Date.now()-35*864e5));
 listen('P',x=>P=x,db.collection('planer').where('datum','>=',from));
 listen('V',x=>V=x);listen('B',x=>B=x);listen('T',x=>T=x);listen('S',x=>{S=x;smbwSeed();});
 listen('L',x=>{L=x.map(o=>Object.assign({},o,{k:o.k||o.id}));if(!x.length)seedLeasing();else recLeasing();});
 listen('I',x=>{I={};x.forEach(o=>I[o.id]=o.wert);});
 if(ME&&ME.adm)unsubs.push(db.doc('tresor/pw').onSnapshot(d=>{if(KEY&&NOTES&&d.exists&&d.data().ct&&d.data().tsVon!==ME.id&&!document.querySelector('#nGrid [contenteditable]:focus'))open_(KEY,d.data()).then(x=>{if(!Array.isArray(x)){NOTES=x.notes||[];PWGRID=x.grid||PWGRID;rn();}}).catch(()=>{});},()=>{}));
 for(let y=1995;y<=new Date().getFullYear()+1;y++)unsubs.push(db.doc('meta/kd_'+y).onSnapshot(d=>{KD[y]=(d.exists&&d.data().items)||{};kdDirty=true;scheduleRender();},()=>{}));
 unsubs.push(db.doc('meta/kd_trash').onSnapshot(d=>{const it=(d.exists&&d.data().items)||{},o={};for(const k in it)if(it[k])o[k]=it[k];KDT=o;kdDirty=true;scheduleRender();kdBinPrune();},()=>{}));
 unsubs.push(db.doc('meta/kd_x').onSnapshot(d=>{KD.x=(d.exists&&d.data().items)||{};kdDirty=true;scheduleRender();},()=>{}));
 unsubs.push(db.doc('meta/import').onSnapshot(d=>{KDIMP=!!(d.exists&&d.data().kunden);if($('kdImp'))$('kdImp').hidden=!(ME&&ME.adm)||KDIMP;},()=>{}));
 unsubs.push(db.doc('meta/reklam').onSnapshot(d=>{RKD=(d.exists&&d.data().items)||{};scheduleRender();},()=>{}));
 unsubs.push(db.doc('meta/brands').onSnapshot(d=>{const x=d.exists?d.data():{};BUSER.list=x.list||[];BLEG=x.logos||{};blMerge();scheduleRender();blMig();},()=>{}));
 for(let n=0;n<BLN;n++)unsubs.push(db.doc('meta/blg_'+n).onSnapshot(d=>{BSH[n]=d.exists&&d.data().l||{};BLOK.add(n);blMerge();scheduleRender();blMig();},()=>{}));
 unsubs.push(db.doc('meta/import').onSnapshot(d=>{const x=d.exists?d.data():{};$('impBox').hidden=!(ME&&ME.adm)||x.tresor===true;},()=>{}));
 unsubs.push(db.doc('tresor/check').onSnapshot(d=>{TSET=d.exists;TCHECK=d.exists?d.data():null;$('lockHint').textContent=TSET?'PIN eingeben':'Noch keine PIN: Ein Admin legt sie jetzt mit der ersten Eingabe fest.';},()=>{}));
 rollover();}
async function seedLeasing(){if(!ME||!ME.adm)return;try{await db.runTransaction(async t=>{const f=db.doc('meta/seed');const d=await t.get(f);if(d.exists&&d.data().leasing)return;
  LSDEF.forEach(x=>t.set(db.collection('leasing').doc(x.k),Object.assign(clean(x),{ts:stamp()})));t.set(f,{leasing:true,rec:LSREC_VER},{merge:true});});}catch(e){fail(e);}}
// Leasing-Infos einmalig auf die neue Struktur (Tirys Fragenliste) bringen; alte Listen werden in „alt“ gesichert
let recDone=false;async function recLeasing(){if(recDone||!ME||!ME.adm||!L.length)return;recDone=true;try{await db.runTransaction(async t=>{const f=db.doc('meta/seed');const d=await t.get(f);const old=d.exists?(d.data().rec||0):0;if(old>=LSREC_VER)return;
  LSREC.filter(x=>(x.v||3)>old).forEach(x=>{/* nur neue Fassungen überschreiben, eigene Änderungen an anderen Karten bleiben */const o=L.find(l=>l.id===x.k)||L.find(l=>l.k===x.k);if(!o)return;const u=recMerge(o,x);u.ts=stamp();t.set(db.collection('leasing').doc(o.id),u,{merge:true});});t.set(f,{rec:LSREC_VER},{merge:true});});}catch(e){recDone=false;fail(e);}}
// Offenes (nicht gelöscht = nicht erledigt) wandert auf heute: Werkstatt wie bisher, dazu Intern/WhatsApp/Notiz ab 02.11.2026 (ältere = Sheet-Historie)
const ROLL_NEU=['int','wa','not'],ROLL_AB='2026-11-02';
async function rollover(){const t=TODAY();try{const go=await db.runTransaction(async tr=>{const f=db.doc('meta/rollover');const d=await tr.get(f);if(d.exists&&d.data().datum===t)return false;tr.set(f,{datum:t,von:ME.id});return true;});
  if(!go)return;const snap=await db.collection('planer').where('datum','<',t).get();const b=db.batch();let n=0;
  snap.forEach(d=>{const o=d.data();if(o.erledigt==='1')return;if(o.spalte==='ws'||(ROLL_NEU.includes(o.spalte)&&String(o.datum)>=ROLL_AB)){b.update(d.ref,{datum:t,ts:stamp(),tsVon:ME.id});n++;}});if(n)await b.commit();}catch(e){}}
// Mitternacht: läuft die App durch, rutscht Offenes ebenfalls automatisch auf den neuen Tag
let rollDay=TODAY();setInterval(()=>{const t=TODAY();if(t!==rollDay&&ME){rollDay=t;rollover();scheduleRender();}},60000);
/* Auto-Update: neue Version auf GitHub → Seite lädt sich selbst neu (nicht während einer Eingabe) */
async function verCheck(){try{const v=(await (await fetch('version.txt?'+Date.now(),{cache:'no-store'})).text()).trim();if(v&&v!==CLIENT_VERSION){if(editing()){$('upd').hidden=false;return;}location.replace(location.pathname+'?v='+encodeURIComponent(v));}}catch(_){}}
setInterval(verCheck,30000);setTimeout(verCheck,3000);
/* ---------- Info-Felder (Wichtig, Merker, Hinweis, Bestell-Notiz) ---------- */
function renderInfo(){document.querySelectorAll('[data-i]').forEach(el=>{if(document.activeElement===el)return;const v=I[el.dataset.i];if(v!=null)el.textContent=v;else if(el.dataset.i==='alert')el.textContent='Company Bike / Daimler Wörth: Seit März 2025 werden Angebote nur noch alle 2 Wochen freigegeben (in der ungeraden KW).';});}
document.querySelectorAll('[data-i]').forEach(el=>{el.addEventListener('keydown',e=>{if(e.key==='Enter'&&el.dataset.i!=='bnotiz'){e.preventDefault();el.blur();}});
 el.addEventListener('blur',async()=>{const v=el.textContent.trim();if(v===(I[el.dataset.i]||''))return;I[el.dataset.i]=v;try{await save('I',{id:el.dataset.i,wert:v});toast('Gespeichert');}catch(_){}});});

/* ================= PLANER ================= */
const COLS=[
 {k:'int',n:'Intern',c:'var(--cyan)',w:'2fr'},{k:'anf',n:'Anfr.',c:'var(--violet)',w:'.3fr',dot:1},
 {k:'z1',n:'Zeit',c:'var(--warn)',of:'t1'},{k:'t1',n:'1. Termin',c:'var(--warn)',w:'1.2fr'},{k:'z2',n:'Zeit',c:'var(--warn)',of:'t2'},{k:'t2',n:'2. Termin',c:'var(--warn)',w:'1.2fr'},
 {k:'wa',n:'WhatsApp',c:'#25D366',w:'.9fr',fix:'92px',ico:'<svg class="waico" viewBox="0 0 24 24" role="img" aria-label="WhatsApp"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>'},{k:'ws',n:'Sonstiges Werkstatt',c:'var(--blue)',w:'1.3fr'},{k:'not',n:'Notiz',c:'var(--muted)',w:'.9fr'}];
const vis=Object.fromEntries(COLS.map(c=>[c.k,true]));
let showPast=false,openOnly=false,q='',weeks=10;
function daysList(){const t=fromIso(TODAY()),start=new Date(t);if(showPast)start.setDate(start.getDate()-28);const end=new Date(t);end.setDate(end.getDate()+weeks*7);const lim=new Date('2027-12-31T12:00:00');const out=[];
 for(const d=new Date(start);d<=end&&d<=lim;d.setDate(d.getDate()+1)){if(d.getDay()===0)continue;out.push(iso(d));}return out;}
const tmSort=(a,b)=>(a.zeit||'99').localeCompare(b.zeit||'99');
function render(){const g=$('grid');if(document.querySelector('#grid .edit'))return;const cols=COLS.filter(c=>vis[c.of||c.k]);const today=TODAY();
 g.style.setProperty('--cols','var(--dcw,112px) '+cols.map(c=>c.of?'80px':c.dot?'34px':c.fix?c.fix:'minmax('+(/^t[12]$/.test(c.k)?180:150)+'px,'+c.w+')').join(' '));
 g.style.setProperty('--minw',(132+cols.reduce((a,c)=>a+(c.of?80:c.dot?34:/^t[12]$/.test(c.k)?180:150),0))+'px');
 const by={};P.forEach(e=>{(by[e.datum]=by[e.datum]||[]).push(e);});
 let h='<div class="hd d">Tag</div>'+cols.map(c=>c.dot?`<div class="hd hdot" style="--cc:${c.c}" title="Anfragen Abholung/Reparatur"><i style="background:${c.c}"></i></div>`:(c.ico?`<div class="hd hico" style="--cc:${c.c}" title="${c.n}">${c.ico}</div>`:`<div class="hd" style="--cc:${c.c}"><i style="background:${c.c}"></i>${c.n}</div>`)).join('');
 let lastKw=null;
 daysList().forEach(ds=>{const d=fromIso(ds),items=(by[ds]||[]),past=ds<today,k=kw(d),wd=WDS[d.getDay()];
  if(k!==lastKw){h+=`<div class="kw">KW ${k}</div>`;lastKw=k;}
  h+=`<div class="row ${wd==='SA'?'sa':''} ${wd==='MI'?'mi':''} ${ds===today?'today':''} ${past?'past':''} ${HOL[ds]?'hol':''}" data-iso="${ds}"><div class="c date"><b>${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}</b><span>${wd[0]+wd.slice(1).toLowerCase()}</span>${ds===today?'<em>Heute</em>':HOL[ds]?`<em>${esc(HOL[ds])}</em>`:''}</div>`;
  cols.forEach(c=>{
   if(c.of){const t=items.filter(e=>e.spalte===c.of&&(!openOnly||e.erledigt!=='1')).sort(tmSort);h+=`<div class="c zt" style="--cc:${c.c}" data-iso="${ds}" data-of="${c.of}" title="Klick = Uhrzeit wählen">${t.map(e=>`<button class="tchip${e.zeit?'':' empty'}" type="button" data-tm="${esc(e.id)}" title="Uhrzeit für: ${esc(e.text)}">${e.zeit?esc(e.zeit):'––:––'}</button>`).join('')}</div>`;return;}
   let its=items.filter(e=>e.spalte===c.k&&(!openOnly||e.erledigt!=='1'));if(/^t[12]$/.test(c.k))its=its.sort(tmSort);
   const hit=e=>q&&(e.text+' '+e.zeit).toLowerCase().includes(q);
   h+=`<div class="c" style="--cc:${c.c}" data-iso="${ds}" data-col="${c.k}">`+(c.dot?its.map(e=>`<button class="dot${hit(e)?' hit':''}" type="button" data-dot="${esc(e.id)}" aria-label="Anfrage: ${esc(e.text)}"><span class="tip"><b>Anfrage Abholung/Reparatur</b>${esc(e.text)}<small>${U(e.von).n?'von '+esc(U(e.von).n)+' · ':''}Klick = bearbeiten</small></span></button>`).join(''):
    its.map(e=>`<div class="e k-${c.k}${hit(e)?' hit':''}" draggable="true" data-id="${esc(e.id)}">${e.zeit&&!/^t[12]$/.test(c.k)?`<span class="tm">${esc(e.zeit)}</span>`:''}<span class="tx" data-ed="${esc(e.id)}">${esc(e.text)}</span><button class="x" type="button" data-x="${esc(e.id)}" aria-label="Eintrag löschen" title="Löschen">×</button>${av(e.von,'eingetragen von')}</div>`).join(''))+`<button class="plus" type="button" aria-label="Eintrag hinzufügen" data-add="1">+</button></div>`;});
  h+='</div>';});
 g.innerHTML=h;
 const wk=kw(fromIso(today));$('cToday').textContent=P.filter(e=>e.datum===today).length;
 $('cWeek').textContent=P.filter(e=>e.datum>=today&&kw(fromIso(e.datum))===wk&&fromIso(e.datum)-fromIso(today)<7*864e5).length;
 $('cOpen').textContent=P.filter(e=>e.erledigt!=='1'&&e.datum>=today).length;}
const findE=id=>P.find(e=>e.id===id);
function parseTm(v,col){if(!/^t[12]$/.test(col))return{zeit:'',text:v};const m=v.match(/^(\d{1,2})[:.](\d{2})\s*(?:uhr)?\s*[-–]?\s*(.*)$/i);if(m&&+m[1]<24&&+m[2]<60)return{zeit:m[1].padStart(2,'0')+':'+m[2],text:m[3]||''};return{zeit:'',text:v};}
const TSLOTS=(()=>{const a=[],f=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');for(let n=9*60;n<=12*60;n+=15)a.push(f(n));for(let n=14*60+30;n<=17*60+45;n+=15)a.push(f(n));return a;})();
function timeEdit(anchor,val,saveFn){const i=document.createElement('select');i.className='edit tin';i.id='edit';i.size=1;
 const opts=TSLOTS.slice();if(val&&!opts.includes(val))opts.push(val),opts.sort();
 i.innerHTML='<option value="">– Uhrzeit –</option><optgroup label="Vormittag">'+opts.filter(t=>t<'13:00').map(t=>`<option${t===val?' selected':''}>${t}</option>`).join('')+'</optgroup><optgroup label="Nachmittag">'+opts.filter(t=>t>='13:00').map(t=>`<option${t===val?' selected':''}>${t}</option>`).join('')+'</optgroup>';
 anchor.replaceWith(i);i.focus();try{i.showPicker();}catch(_){}
 let done=false;const fin=ok=>{if(done)return;done=true;const v=i.value;i.remove();if(ok&&/^\d\d:\d\d$/.test(v)&&v!==val)saveFn(v);else render();};
 i.addEventListener('change',()=>fin(true));i.addEventListener('keydown',k=>{if(k.key==='Enter'){k.preventDefault();fin(true);}if(k.key==='Escape')fin(false);});i.addEventListener('blur',()=>setTimeout(()=>fin(false),200));}
function inlineEdit(anchor,val,col,saveFn,onEmpty){const i=document.createElement('input');i.className='edit';i.id='edit';i.value=val;i.placeholder=/^t[12]$/.test(col)?'10:30 Abholung Müller':'Text eingeben, Enter = speichern';anchor.replaceWith(i);i.focus();let done=false;
 const fin=ok=>{if(done)return;done=true;const v=i.value.trim();i.remove();if(ok&&v)saveFn(v);else if(ok&&!v&&onEmpty&&val)onEmpty();render();};
 i.addEventListener('keydown',k=>{if(k.key==='Enter')fin(true);if(k.key==='Escape')fin(false);});i.addEventListener('blur',()=>fin(true));}
async function putE(e){const i=P.findIndex(x=>x.id===e.id);if(i<0)P.push(e);else P[i]=e;render();try{await save('P',e);}catch(_){}}
function delE(id){const e=findE(id);if(!e)return;P=P.filter(x=>x.id!==id);render();del('P',id);toast('Gelöscht: '+e.text,()=>{const n=Object.assign({},e);P.push(n);render();save('P',n).catch(()=>{});toast('Wiederhergestellt');});}
$('grid').addEventListener('click',ev=>{
 const ck=ev.target.closest('[data-ck]');if(ck){const e=findE(ck.dataset.ck);if(!e)return;const n=Object.assign({},e,{erledigt:e.erledigt==='1'?'':'1',erledigtVon:e.erledigt==='1'?'':ME.id});putE(n);toast(n.erledigt?'Erledigt ✓':'Wieder offen');return;}
 const x=ev.target.closest('[data-x]');if(x){delE(x.dataset.x);return;}
 const dt=ev.target.closest('[data-dot]');if(dt){const e=findE(dt.dataset.dot);if(e)inlineEdit(dt,e.text,'anf',v=>putE(Object.assign({},e,{text:v})),()=>delE(e.id));return;}
 const ed=ev.target.closest('[data-ed]');if(ed){const e=findE(ed.dataset.ed);if(!e)return;inlineEdit(ed.closest('.e'),(e.zeit?e.zeit+' ':'')+e.text,e.spalte,v=>{const p=parseTm(v,e.spalte);putE(Object.assign({},e,{text:p.text||e.text,zeit:p.zeit||(/^t[12]$/.test(e.spalte)?'':e.zeit)}));},()=>delE(e.id));return;}
 const tc=ev.target.closest('[data-tm]');if(tc){const e=findE(tc.dataset.tm);if(e)timeEdit(tc,e.zeit,v=>putE(Object.assign({},e,{zeit:v})));return;}
 const zc=ev.target.closest('.c.zt');if(zc&&ev.target===zc){const ph=document.createElement('span');zc.append(ph);timeEdit(ph,'',v=>{render();const cell=document.querySelector(`.c[data-iso="${zc.dataset.iso}"][data-col="${zc.dataset.of}"]`);if(!cell)return;const a=document.createElement('span');cell.append(a);inlineEdit(a,'',zc.dataset.of,txt=>{const p=parseTm(txt,zc.dataset.of);putE({id:nid('p'),datum:zc.dataset.iso,spalte:zc.dataset.of,text:p.text||txt,zeit:p.zeit||v,erledigt:'',von:ME.id,erledigtVon:''});});const inp=$('edit');if(inp){inp.placeholder='Termin um '+v+' – z. B. Abholung Müller';}});return;}
 const ec=ev.target.closest('.c[data-col]');if(ec&&ev.target===ec&&!ec.querySelector('.edit')){const pb=ec.querySelector('[data-add]');if(pb)pb.click();return;}
 const pl=ev.target.closest('[data-add]');if(pl){const cell=pl.closest('.c');inlineEdit(pl,'',cell.dataset.col,v=>{const p=parseTm(v,cell.dataset.col);putE({id:nid('p'),datum:cell.dataset.iso,spalte:cell.dataset.col,text:p.text||v,zeit:p.zeit,erledigt:'',von:ME.id,erledigtVon:''});});}});
let drag=null;
$('grid').addEventListener('dragstart',ev=>{const e=ev.target.closest('.e');if(e){drag=e.dataset.id;ev.dataTransfer.effectAllowed='move';try{ev.dataTransfer.setData('text/plain',drag);}catch(_){}}});
$('grid').addEventListener('dragover',ev=>{const c=ev.target.closest('.c[data-col]');if(c&&drag){ev.preventDefault();document.querySelectorAll('.drop').forEach(x=>x.classList.remove('drop'));c.classList.add('drop');}});
$('grid').addEventListener('drop',ev=>{const c=ev.target.closest('.c[data-col]');if(!c||!drag)return;ev.preventDefault();const e=findE(drag);drag=null;if(!e)return;putE(Object.assign({},e,{datum:c.dataset.iso,spalte:c.dataset.col,zeit:/^t[12]$/.test(c.dataset.col)?e.zeit:e.zeit}));toast('Verschoben');});
$('grid').addEventListener('dragend',()=>{drag=null;document.querySelectorAll('.drop').forEach(x=>x.classList.remove('drop'));});
$('legend').innerHTML=COLS.filter(c=>!c.of).map(c=>`<button class="lg" type="button" aria-pressed="${vis[c.k]}" data-k="${c.k}" style="border-color:${vis[c.k]?c.c:'var(--line)'}">${c.k==='anf'?'Anfragen':c.n}</button>`).join('');
$('legend').addEventListener('click',e=>{const b=e.target.closest('.lg');if(!b)return;vis[b.dataset.k]=!vis[b.dataset.k];b.setAttribute('aria-pressed',vis[b.dataset.k]);b.style.borderColor=vis[b.dataset.k]?COLS.find(c=>c.k===b.dataset.k).c:'var(--line)';ls.set('vc_vis',vis);render();});
$('q').addEventListener('input',e=>{q=e.target.value.toLowerCase().trim();render();const h=document.querySelector('.e.hit,.dot.hit');if(h)h.scrollIntoView({block:'center',behavior:'smooth'});});
$('jump').addEventListener('click',()=>{document.querySelector('.row.today .date')?.scrollIntoView({block:'start',behavior:'smooth'});});
$('past').addEventListener('click',e=>{showPast=!showPast;e.currentTarget.setAttribute('aria-pressed',showPast);render();});
$('openOnly').addEventListener('click',e=>{openOnly=!openOnly;e.currentTarget.setAttribute('aria-pressed',openOnly);render();});
$('moreWeeks').addEventListener('click',()=>{weeks+=8;render();});

/* ---------- Kennzahlen-Kacheln (in jedem Bereich gleich) ---------- */
const ICO={bike:'<path d="M5.5 17a3.5 3.5 0 1 0 0-.01M18.5 17a3.5 3.5 0 1 0 0-.01M5.5 17 9 9.5h6.5L18.5 17M9 9.5 7.8 6.5H6M15.5 9.5l-4 7.5"/>',wrench:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8 6.2 21l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',check:'<path d="M20 6 9 17l-5-5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',doc:'<path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h5"/>',box:'<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',truck:'<path d="M2.5 6h11v9h-11zM13.5 9.5h4l3.5 3.5v2h-7.5"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',euro:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5a4 4 0 1 0 0 7M7.5 10.8h6M7.5 13.2h6"/>',key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',sum:'<path d="M18 5H7l6 7-6 7h11"/>',alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>'};
function stats(el,list,active){$(el).innerHTML=list.map(x=>`<button class="stat${x.k&&x.k===active?' on':''}" type="button" ${x.k?`data-sf="${x.k}"`:'disabled'} style="--sc:${x.c}"><span class="si"><svg viewBox="0 0 24 24">${ICO[x.i]}</svg></span><span class="sv"><b>${x.v}</b><small>${x.n}</small></span></button>`).join('');}

/* ================= VERKAUF ================= */
let FN={BL:'Bikeleasing',CB:'Company Bike',KM:'Kazenmaier',BB:'Businessbike',JR:'JobRad',DD:'Deutsche Dienstrad',LB:'Lease a Bike',RD:'RIDE',ER:'Eurorad'};
let vkEdit=null,vkShowDone=false,vkF='',vkSort=ls.get('vc_vksort','dat:-1');vkSort={neu:'dat:-1',lt:'lt:1',status:'status:1'}[vkSort]||vkSort;if(!/^[a-z]+:-?1$/.test(vkSort))vkSort='dat:-1';
const VF0=[['name','Kunde'],['marke','Marke'],['modell','Modell'],['dat','Vom Kunde bestellt am'],['firma','Leasing-Anbieter']],VF1=[['form','Form'],['gr','Größe'],['lt','Liefertermin'],['antrag','Antrag gestellt am'],['ok','Leasing genehmigt'],['lende','Leasingende'],['notiz','Notiz']];
function rv(){
 const open=V.filter(b=>b.a!=='1'),F={nm:b=>b.a!=='1'&&b.m!=='1'&&b.b!=='1',mw:b=>b.a!=='1'&&b.m==='1'&&b.b!=='1',ok:b=>b.a!=='1'&&b.b==='1',lk:b=>b.a!=='1'&&b.firma&&!b.ok};
 const list=V.filter(b=>(vkShowDone||b.a!=='1'||b.id===vkEdit));
 list.sort(vkCmp);
  const form=vkEdit==='new'?vkForm({id:'new'}):vkEdit&&V.find(x=>x.id===vkEdit)?vkForm(V.find(x=>x.id===vkEdit)):'';
 if(document.querySelector('#cards [contenteditable]:focus, #cards .din'))return;
 {const hold=$('vkCtlHold');['vkSortSel','vkDone','vkAdd'].forEach(id=>hold.append($(id)));vkSelSync();
 $('cards').className='vlist';$('cards').innerHTML=form+`<div class="tbl vtab"><table><thead><tr class="h1"><th colspan="7" class="hL"></th><th colspan="4" class="lgrp"><span>Leasing</span></th><th colspan="3" class="hR"></th></tr><tr class="h2">${vkHead()}</tr></thead><tbody>${list.length?list.map(vkRow).join(''):'<tr><td colspan="14" class="empty">Keine Räder in dieser Auswahl.</td></tr>'}</tbody></table></div>`;
 document.querySelector('#cards th.hL').append($('vkSortSel'),$('vkDone'));document.querySelector('#cards th.hR').append($('vkAdd'));ltBarPos();}
 $('nOffen').textContent=V.filter(b=>b.a!=='1').length;}
/* Sortierung: Datum „17.8.“ / „29.09.“ / LT „38“ „KW 38“ „Lager“ */
function vkDate(s){const m=String(s||'').match(/(\d{1,2})\.(\d{1,2})\.?(\d{2,4})?/);if(!m)return 0;const now=new Date();let y=m[3]?+m[3]:now.getFullYear();if(y<100)y+=2000;let d=new Date(y,+m[2]-1,+m[1]);if(!m[3]&&d>new Date(now.getTime()+60*864e5))d=new Date(y-1,+m[2]-1,+m[1]);return d.getTime();}
// LT „KW 47/27“ (ab 1.6.3 mit Jahr); alte Einträge „KW 47“ ohne Jahr: Jahr wird geschätzt (bis 20 Wochen zurück = dieses Jahr, sonst nächstes)
function ltParse(s){s=String(s||'').trim();const m=s.match(/(\d{1,2})(?:\s*\/\s*(\d{2,4}))?/);if(!m||/^sofort|lager|^l$/i.test(s))return null;const k=+m[1],cy=new Date().getFullYear(),ck=kw(new Date());
 let y=m[2]?+m[2]:0;if(y&&y<100)y+=2000;if(!y){const d=k-ck;y=cy+(d<-20?1:d>32?-1:0);}return {k,y};}
/* 1.6.7: Liefertermin-Fortschritt je Zeile (Kunde → Notiz). Start = Vom Kunde bestellt am, Ziel = Montag der LT-KW.
   Lager / schon angeliefert = voll grün, Sofort = voll gelb, nach der LT-Woche = voll rot. */
function kwMon(k,y){const j=new Date(y,0,4),d=(j.getDay()||7)-1;return new Date(y,0,4-d+(k-1)*7);}
function ltBar(b){if(b.a==='1')return null;const s=String(b.lt||'').trim();
 if(b.an==='1'||b.m==='1'||b.b==='1')return s||b.an==='1'?{p:1,c:'#34D399',t:'Rad ist da'}:null;
 if(/^sofort/i.test(s))return {p:1,c:'#FACC15',t:'Liefertermin: Sofort'};if(/lager|^l$/i.test(s))return {p:1,c:'#34D399',t:'Liefertermin: Lager'};
 const L=ltParse(s);if(!L)return null;const z=kwMon(L.k,L.y).getTime(),now=Date.now();
 if(now>=z+7*864e5)return {p:1,c:'#F87171',t:'Liefertermin KW '+L.k+' überschritten'};
 const a=vkDate(b.dat);if(!a)return null;const p=now>=z?1:Math.max(0.02,Math.min(1,(now-a)/Math.max(864e5,z-a)));
 return {p:+p.toFixed(3),c:'#34D399',t:'Liefertermin KW '+L.k+': '+Math.round(p*100)+' % der Wartezeit vorbei'};}
function ltBarPos(){requestAnimationFrame(()=>{const t=document.querySelector('#cards .vtab table');if(!t)return;const r=t.querySelector('tr.vr');if(!r)return;const a=r.querySelector('td.who2'),n=r.querySelector('td.vnote');if(!a||!n)return;
 const f=r.cells[0].getBoundingClientRect().left,al=a.getBoundingClientRect().left,w=n.getBoundingClientRect().right-f;if(w>0){t.style.setProperty('--lbw',Math.round(w)+'px');t.style.setProperty('--lbx',Math.round(al-f)+'px');}});}
addEventListener('resize',()=>ltBarPos());
function vkLt(s){s=String(s||'').trim();if(/^sofort/i.test(s))return -1;if(/lager|^l$/i.test(s))return 0;const p=ltParse(s);if(!p)return 999;return p.k+(p.y-new Date().getFullYear())*53;}
const ltNorm=s=>{const p=ltParse(s);return p?'KW '+p.k+'/'+String(p.y%100).padStart(2,'0'):String(s||'');};
/* 1.6.8: „Anfang Dezember“ über der KW (Donnerstag der KW bestimmt den Monat, wie ISO) */
const ltMon=s=>{const p=ltParse(s);if(!p)return '';const d=kwMon(p.k,p.y);d.setDate(d.getDate()+3);const t=d.getDate();return `<span class="ltm">${t<=10?'Anfang':t<=20?'Mitte':'Ende'} ${d.toLocaleDateString('de-DE',{month:'long'})}</span>`;};
const ltShow=s=>{const p=ltParse(s);return p?'KW '+p.k+'<small class="lty">'+String(p.y%100).padStart(2,'0')+'</small>':esc(s||'');};
const vkRank=b=>b.a==='1'?5:b.b==='1'?4:b.m==='1'?3:b.an==='1'?2:1;
// Sortieren: Klick auf Spaltenkopf (1. Klick aufsteigend, 2. Klick absteigend) oder Auswahl oben links; leere Felder immer unten
const VKH=[['',''],['name','Kunde · Modell'],['form','Form','thf'],['gr','Größe','thf'],['dat','Vom Kunde<br>bestellt am','thb'],['lt','LT'],['notiz','Notiz','thn'],['firma','Anbieter'],['antrag','Antrag<br>gestellt am','thl'],['ok','Leasing<br>genehmigt','thl'],['lende','Leasing&shy;ende','thl'],['verk','Beratung'],['status','Status'],['','']];
const VKSL=[['dat:-1','Neueste zuerst (frische Aufträge)'],['dat:1','Älteste zuerst (wartet am längsten)'],['okf:1','Genehmigung fehlt zuerst'],['lt:1','Nach Liefertermin'],['status:1','Nach Status']];
const tx=v=>{v=String(v||'').trim().toLowerCase();return v||null;},dt=v=>vkDate(v)||null;
const VKS={name:b=>tx(b.name),form:b=>tx(b.form),gr:b=>{const m=String(b.gr||'').match(/\d+/);return m?(/"/.test(b.gr)?+m[0]*2.54:+m[0]):null;},dat:b=>dt(b.dat),lt:b=>b.lt?vkLt(b.lt):null,notiz:b=>tx([b.notiz,b.montieren].filter(Boolean).join(' ')),
 firma:b=>tx(FN[b.firma]||b.firma),antrag:b=>dt(b.antrag),ok:b=>dt(b.ok),lende:b=>dt(b.lende),verk:b=>b.verk?tx(U(b.verk).n):null,status:b=>vkRank(b),okf:b=>b.firma&&!b.ok?0:1};
function vkCmp(a,b){const [k,d]=vkSort.split(':'),f=VKS[k]||VKS.dat,x=f(a),y=f(b);if(x==null&&y==null)return vkDate(a.dat)-vkDate(b.dat);if(x==null)return 1;if(y==null)return -1;
 const r=typeof x==='string'?x.localeCompare(y,'de'):x-y;return r*(+d||1)||(k==='okf'?vkDate(b.dat)-vkDate(a.dat):vkDate(a.dat)-vkDate(b.dat));}
function vkHead(){const [k,d]=vkSort.split(':');return VKH.map(([sk,n,c])=>sk?`<th class="${c||''} srt${sk===k?' on':''}" data-sk="${sk}" title="Klick = sortieren${sk===k?' (nochmal = umdrehen)':''}">${n}<i class="sar">${sk===k?(d==='-1'?'▼':'▲'):'⇅'}</i></th>`:'<th></th>').join('');}
function vkSelSync(){const sel=$('vkSortSel'),hit=VKSL.find(x=>x[0]===vkSort);const lab=(VKH.find(x=>x[0]===vkSort.split(':')[0])||['','?'])[1].replace(/<br>|&shy;/g,' ');
 sel.innerHTML=VKSL.map(([v,n])=>`<option value="${v}">${n}</option>`).join('')+(hit?'':`<option value="${vkSort}">Spalte: ${lab} ${vkSort.endsWith(':-1')?'▼':'▲'}</option>`);sel.value=vkSort;}
function vkSetSort(v){vkSort=v;ls.set('vc_vksort',vkSort);rv();}
function ltHot(lt){const k=vkLt(lt),ck=kw(new Date());return k===-1||(k!==999&&k!==0&&k<=ck+1);}
// Herstellermarke aus dem Modelltext (Verkauf): Logo, sonst Marken-Schild, sonst 🚲
const BRANDS=[{k:'KTM',n:'KTM',c:'#FF6A00',re:/\bktm\b|macina|gravelator|revelator|scarp|kapoho|myroon|lycan|chicago|\b(tour|city|sport|team|style|fun|cross|gran|aera|life)\s*(px|p|sx|cx)?\s*-?\d{3}\b|\bpx\s*\d{3}\b|\bsx[- ]?(master|elite|prime|pro)\b/i},
 {k:'ISY',n:'i:SY',re:/\bi[:\s]?sy\b|\bp\s?12\b|\bzr\b/i},
 {k:'GUD',n:'Gudereit',re:/gudereit|\bec[- ]?\d/i}];
// Eigene Marken + Logos (⚙ Einstellungen): meta/brands = {list:[{k,n,w}], logos:{k:dataURL}}
let BUSER={list:[],logos:{}};
const reEsc=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function wordsRe(w){const p=String(w||'').split(/[,;\n]/).map(x=>x.trim()).filter(Boolean).map(x=>reEsc(x).replace(/\s+/g,'\\s*'));return p.length?new RegExp(p.join('|'),'i'):null;}
function allBrands(){const ul=BUSER.list||[];return BRANDS.map(b=>{const u=ul.find(x=>x.k===b.k);return Object.assign({},b,{ux:u?wordsRe(u.w):null,own:false});}).concat(ul.filter(u=>!BRANDS.some(b=>b.k===u.k)).map(u=>({k:u.k,n:u.n,re:wordsRe((u.w?u.w+',':'')+u.n),own:true})));}
const brandOf=m=>{m=String(m||'');if(!m)return null;const A=allBrands();return A.find(b=>b.own&&b.re&&b.re.test(m))||A.find(b=>!b.own&&(b.re.test(m)||(b.ux&&b.ux.test(m))))||null;};
// Marke: eigenes Feld „marke“ (beim Anlegen) hat Vorrang, sonst Erkennung aus dem Modelltext
function brandOfB(b){const mk=String(b.marke||'').trim();if(mk){const l=mk.toLowerCase();return allBrands().find(x=>x.n.toLowerCase()===l||x.k.toLowerCase()===l)||{k:bKey(mk),n:mk};}return brandOf(b.modell);}
const bKey=n=>'U'+String(n).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10);
function bStrip(m,x){let t=String(m||'');if(x){const r=new RegExp('^\\s*'+reEsc(x.n)+'\\s+','i');if(r.test(t))t=t.replace(r,'');}return t;}
function bModelE(b){const x=brandOfB(b);return bIcoX(x)+`<span class="ef" contenteditable="true" spellcheck="false" data-vid="${esc(b.id)}" data-f="modell" title="Klick = Modell bearbeiten">${esc(bStrip(b.modell,x))}</span>`;}
function bModel(m){const x=brandOf(m);return bIcoX(x)+esc(bStrip(m,x));}
function bIco(m){return bIcoX(brandOf(m));}
function bIcoX(b){if(!b)return'🚲 ';const lg=(BUSER.logos||{})[b.k];return lg?`<img class="blg" src="${lg}" alt="${esc(b.n)}" title="${esc(b.n)}">`:`<span class="bchip" title="${esc(b.n)}"${b.c?` style="color:${b.c}"`:''}>${esc(b.n)}</span>`;}
function leasLogo(f){if(!f)return'';const x=L.find(l=>l.k===f);const lg=x?logoOf(x):(LOGOS[f]||'');return lg?`<img class="llg" src="${esc(lg)}" alt="${esc(FN[f]||f)}" title="${esc(FN[f]||f)}">`:`<span class="lchip">${esc(f)}</span>`;}
// Status-Farbe am Namen: angeliefert = gelb, montiert = rot, O.K. = grün – mehrere = Verlauf in dieser Reihenfolge
const VKC=[['an','251,191,36','#FDE68A'],['m','239,68,68','#FECACA'],['b','52,211,153','#A7F3D0']];
function vkSty(b){const c=VKC.filter(x=>b[x[0]]==='1');if(!c.length)return'';const L=c[c.length-1];
 const bg=c.length===1?`linear-gradient(90deg,rgba(${L[1]},.32),rgba(${L[1]},.07))`:`linear-gradient(90deg,${c.map(x=>`rgba(${x[1]},.36)`).join(',')})`;
 return `--wpbg:${bg};--wpbd:rgba(${L[1]},.5);--wpgl:rgba(${L[1]},.16);--wpfg:${c.length===1?L[2]:'#fff'}`;}
function vkRow(b){const st=b.a==='1'?'a':b.b==='1'?'b':b.m==='1'?'m':b.an==='1'?'l':'o';const ce=(f,v,cls)=>`<td class="ce ${cls||''}" contenteditable="true" spellcheck="false" data-vid="${esc(b.id)}" data-f="${f}">${esc(v||'')}</td>`;
 const dcD=(f,v)=>`<td class="dcell d-dat" data-vid="${esc(b.id)}" data-df="${f}" title="Klick = Datum wählen" tabindex="0">${esc(dshort(v))}</td>`;
 const dc=(f,v,cls)=>{if(v&&!/\d/.test(v))v='';/* 1.7.2: „??“ u. ä. aus dem Sheet = nicht eingetragen */return `<td class="dcell ${cls}${f==='antrag'&&!v?' amiss':''}" data-vid="${esc(b.id)}" data-df="${f}" title="${esc(v||'')} · Klick = Datum wählen" tabindex="0">${esc(dshort(v))}${v?lvB(b,f):''}</td>`;};
 const lb=ltBar(b);
 return `<tr class="vr st-${st}${lb?' lbr':''}"${lb?` style="--lp:${lb.p};--lc:${lb.c}" title="${esc(lb.t)}"`:''}>
 <td class="sdot" title="${{o:'offen',l:'angeliefert',m:'montiert',b:'O.K. – abholbereit',a:'abgeholt'}[st]}"><i></i></td>
 <td class="who2${vkSty(b)?' wfx':''}" style="${vkSty(b)}">${lb?'<i class="ltbar"></i>':''}<div class="wp"><b class="ef" contenteditable="true" spellcheck="false" data-vid="${esc(b.id)}" data-f="name" title="Klick = Kunde bearbeiten">${esc(b.name||'')}</b><small>${bModelE(b)}</small></div></td>
 <td class="pcell pf" data-vid="${esc(b.id)}" data-pf="form" title="Klick = Form wählen" tabindex="0">${esc(b.form||'')}</td><td class="pcell pg" data-vid="${esc(b.id)}" data-pf="gr" title="Klick = Größe wählen" tabindex="0">${esc(b.gr||'')}</td>
 ${dcD('dat',b.dat)}<td class="kcell${ltHot(b.lt)&&b.a!=='1'?' hot':''}" data-vid="${esc(b.id)}" title="Klick = Kalenderwoche wählen" tabindex="0">${ltMon(b.lt)}${ltShow(b.lt)}</td>${ce('notiz',[b.notiz,b.montieren?'Montieren: '+b.montieren:''].filter(Boolean).join(' · '),'vnote'+(b.notiz&&U(b.notizVon).n?'" data-von="'+esc(U(b.notizVon).n[0])+'" style="--uc:'+U(b.notizVon).c+'" title="Notiz von '+esc(U(b.notizVon).n):''))}
<td><div class="lcell">${leasLogo(b.firma)}<select class="lsel mini2${b.firma?'':' off'}" data-vi="${esc(b.id)}" aria-label="Leasing-Firma"><option value="">–</option>${Object.entries(FN).map(([k,n])=>`<option value="${esc(k)}"${b.firma===k?' selected':''}>${esc(k)} · ${esc(n)}</option>`).join('')}${b.firma&&!FN[b.firma]?`<option selected>${esc(b.firma)}</option>`:''}</select>${b.firma?lvB(b,'firma'):''}</div></td>
 ${b.firma?dc('antrag',b.antrag,'d-antrag'):'<td class="na">–</td>'}${b.firma?dc('ok',b.ok,/\d/.test(b.ok||'')?'d-ok':'d-ok miss'):'<td class="na">–</td>'}${b.firma?dc('lende',b.lende,'d-lende'):'<td class="na">–</td>'}
 <td><select class="ssel mini2" data-vi="${esc(b.id)}" aria-label="Verkauf/Beratung"><option value="">–</option>${USERS.map(u=>`<option value="${u.id}"${b.verk===u.id?' selected':''}>${esc(u.n)}</option>`).join('')}</select></td>
 <td class="stb"><button class="st an" type="button" aria-pressed="${b.an==='1'}" data-vi="${esc(b.id)}" data-k="an" title="${b.anVon?'angeliefert, eingetragen von '+esc(U(b.anVon).n)+' '+esc(b.anAm):'angeliefert'}">📦${b.an==='1'?sav(b.anVon):''}</button><button class="st m" type="button" aria-pressed="${b.m==='1'}" data-vi="${esc(b.id)}" data-k="m" title="${b.mVon?'montiert von '+esc(U(b.mVon).n)+' '+esc(b.mAm):'montiert'}">🔧${b.m==='1'?sav(b.mVon):''}</button><button class="st b" type="button" aria-pressed="${b.b==='1'}" data-vi="${esc(b.id)}" data-k="b" title="${b.bVon?'O.K. von '+esc(U(b.bVon).n)+' '+esc(b.bAm):'O.K.'}">O.K.${b.b==='1'?sav(b.bVon):''}</button><button class="st a" type="button" aria-pressed="${b.a==='1'}" data-vi="${esc(b.id)}" data-k="a" title="${b.aVon?'abgeholt von '+esc(U(b.aVon).n)+' '+esc(b.aAm):'abgeholt'}">✓${b.a==='1'?sav(b.aVon):''}</button></td>
 <td><button class="mini" type="button" data-vedit="${esc(b.id)}" title="Alle Felder / Löschen">✎</button></td></tr>`;}
function vkForm(b){const nw=b.id==='new',dIso=nw?iso(new Date()):toIsoDe(b.dat);
 const fld=([k,n])=>k==='dat'?`<label>${n}<input name="dat" type="date" value="${esc(dIso||'')}"></label>`
  :k==='firma'?`<label>${n}<select name="firma"><option value="">– ohne Leasing</option>${Object.entries(FN).map(([kk,nn])=>`<option value="${esc(kk)}"${b.firma===kk?' selected':''}>${esc(nn)}</option>`).join('')}${b.firma&&!FN[b.firma]?`<option selected>${esc(b.firma)}</option>`:''}</select></label>`
  :k==='marke'?`<label>${n}<input name="marke" list="brandList" value="${esc(b.marke||'')}" placeholder="z. B. KTM"></label>`
  :`<label>${n}<input name="${k}" value="${esc(b[k]||'')}"></label>`;
 return `<article class="bike editing"><form class="edf vnew" data-vf="${esc(b.id)}" autocomplete="off" novalidate><b>${nw?'Neues verkauftes Rad':'Rad bearbeiten'}</b><datalist id="brandList">${allBrands().map(x=>`<option value="${esc(x.n)}">`).join('')}</datalist>
 <div class="g5">${VF0.map(fld).join('')}</div>${nw?'<p class="hint">Alles optional – Rest (LT, Form, Größe, Leasing-Daten …) später direkt in der Liste.</p>':`<div class="g2">${VF1.map(fld).join('')}</div>`}
 <div class="acts"><button class="btn red" type="submit">${nw?'In die Liste':'Speichern'}</button><button class="btn" type="button" data-vcancel>Abbrechen</button>${!nw?`<button class="btn del" type="button" data-vdel="${esc(b.id)}">Löschen</button>`:''}</div></form></article>`;}
/* 1.6.6: wer hat Leasing-Felder/Notiz eingetragen – Leasing nur Admins (Team = leer, Admin kann nachtragen), Notiz jeder */
const VLF=['firma','antrag','ok','lende'],VLN={firma:'Leasing-Anbieter',antrag:'Antrag gestellt',ok:'Leasing genehmigt',lende:'Leasingende'};
function vAutoVon(n){const o=V.find(x=>x.id===n.id)||{};VLF.concat('notiz').forEach(f=>{if((n[f]||'')===(o[f]||'')||(n[f+'Von']||'')!==(o[f+'Von']||''))return;n[f+'Von']=!n[f]?'':(f==='notiz'||(ME&&ME.adm))?ME.id:'';});}
function lvB(b,f){const u=U(b[f+'Von']),ok=b[f+'Von']&&u.n;return `<button class="lvon${ok?'':' nv'}" type="button" data-lvi="${esc(b.id)}" data-lvf="${f}" style="--uc:${u.c}" title="${ok?esc(VLN[f]+' – '+u.n):'Wer war es? Klick = auswählen'}">${ok?esc(u.n[0]):'?'}</button>`;}
function lvPick(t){const b=V.find(x=>x.id===t.dataset.lvi),f=t.dataset.lvf;if(!b)return;if(kdPop&&kdPop.lv===b.id+f){kdPopClose();return;}const cur=b[f+'Von'];
 const el=kdPopOpen(t,`<div class="vstp"><div class="kph">${VLN[f]} – von wem?</div><div class="vstl">${USERS.filter(u=>ADMINS.includes(u.id)).map(u=>`<button type="button" class="vstu${cur===u.id?' on':''}" style="--uc:${u.c}" data-vsu="${u.id}"><span class="av">${esc(u.n[0])}</span>${esc(u.n)}</button>`).join('')}</div>${cur?`<button type="button" class="vstx" data-vsu="">✕ Person entfernen</button>`:''}</div>`);kdPop.lv=b.id+f;
 el.addEventListener('click',e=>{const x=e.target.closest('[data-vsu]');if(!x)return;kdPopClose();const bb=V.find(v=>v.id===b.id);if(!bb||(bb[f+'Von']||'')===x.dataset.vsu)return;putV(Object.assign({},bb,{[f+'Von']:x.dataset.vsu}));});}
async function putV(b){vAutoVon(b);const i=V.findIndex(x=>x.id===b.id);if(i<0)V.unshift(b);else V[i]=b;rv();try{await save('V',b);}catch(_){}}
/* 1.6.5: Status setzen – who = Person-ID oder '' (entfernen). Admins wählen die Person, Team setzt nur sich selbst. */
$('cards').addEventListener('click',e=>{const t=e.target.closest('.lvon');if(!t)return;e.stopPropagation();e.preventDefault();lvPick(t);},true);
function vStSet(b,k,who){const n=Object.assign({},b);n[k]=who?'1':'';if(n[k]){n[k+'Von']=who;const _d=new Date(),_s=String(_d.getDate()).padStart(2,'0')+'.'+String(_d.getMonth()+1).padStart(2,'0')+'.';n[k+'Am']=_s;if(k==='b'&&!n.ok)n.ok=_s+_d.getFullYear();}else{n[k+'Von']='';n[k+'Am']='';}putV(n);if(n[k]){if(k==='a')toast('Abgeholt – '+(b.name||b.modell)+' (unter „Abgeholte zeigen“)',()=>{putV(Object.assign({},b));toast('Wieder offen');});else toast({an:'Angeliefert',m:'Montiert',b:'O.K.'}[k]+' – '+U(who).n);}}
const VSTN={an:'Angeliefert',m:'Montiert',b:'O.K.',a:'Abgeholt'};
function vStPick(t,b,k){if(kdPop&&kdPop.vst===b.id+k){kdPopClose();return;}const cur=b[k]==='1'?b[k+'Von']:null;
 const el=kdPopOpen(t,`<div class="vstp"><div class="kph">${VSTN[k]} – von wem?</div><div class="vstl">${USERS.map(u=>`<button type="button" class="vstu${cur===u.id?' on':''}" style="--uc:${u.c}" data-vsu="${u.id}"><span class="av">${esc(u.n[0])}</span>${esc(u.n)}</button>`).join('')}</div>${b[k]==='1'?`<button type="button" class="vstx" data-vsu="">✕ ${VSTN[k]} entfernen</button>`:''}</div>`);kdPop.vst=b.id+k;
 el.addEventListener('click',e=>{const x=e.target.closest('[data-vsu]');if(!x)return;kdPopClose();const bb=V.find(v=>v.id===b.id)||b,w=x.dataset.vsu;if(w&&bb[k]==='1'&&bb[k+'Von']===w)return;vStSet(bb,k,w);});}
$('cards').addEventListener('click',e=>{const t=e.target.closest('.st');if(t){const b=V.find(x=>x.id===t.dataset.vi);if(!b)return;const k=t.dataset.k;if(ME.adm){vStPick(t,b,k);return;}vStSet(b,k,b[k]==='1'?'':ME.id);return;}
 const ed=e.target.closest('[data-vedit]');if(ed){vkEdit=ed.dataset.vedit;rv();return;}
 if(e.target.closest('[data-vcancel]')){vkEdit=null;rv();return;}
 const dl=e.target.closest('[data-vdel]');if(dl){if(!dl.dataset.sure){dl.dataset.sure=1;dl.textContent='Wirklich löschen?';return;}const id=dl.dataset.vdel,b=V.find(x=>x.id===id);V=V.filter(x=>x.id!==id);vkEdit=null;rv();del('V',id);toast('Gelöscht: '+(b&&b.modell||''),()=>{V.unshift(b);rv();save('V',b).catch(()=>{});});}});
$('cards').addEventListener('change',e=>{const s=e.target.closest('.ssel');if(s){const b=V.find(x=>x.id===s.dataset.vi);putV(Object.assign({},b,{verk:s.value}));toast('Verkauf/Beratung: '+(s.value?U(s.value).n:'–'));return;}
 const l=e.target.closest('.lsel');if(l){const b=V.find(x=>x.id===l.dataset.vi);putV(Object.assign({},b,{firma:l.value}));toast(l.value?'Leasing: '+(FN[l.value]||l.value):'Ohne Leasing');}});
$('cards').addEventListener('submit',e=>{e.preventDefault();const f=e.target,id=f.dataset.vf,d=new FormData(f);const b=id==='new'?{id:nid('v'),m:'',b:'',a:'',verk:ME.id,firma:''}:Object.assign({},V.find(x=>x.id===id));VF0.concat(id==='new'?[]:VF1).forEach(([k])=>{let v=String(d.get(k)||'').trim();if(k==='dat'&&/^\d{4}-\d{2}-\d{2}$/.test(v)){const x=fromIso(v);v=String(x.getDate()).padStart(2,'0')+'.'+String(x.getMonth()+1).padStart(2,'0')+'.'+x.getFullYear();}b[k]=v;});vkEdit=null;putV(b);toast('Gespeichert');});
$('vkSortSel').addEventListener('change',e=>vkSetSort(e.target.value));
$('cards').addEventListener('click',e=>{const h=e.target.closest('th[data-sk]');if(!h)return;const [k,d]=vkSort.split(':');vkSetSort(h.dataset.sk===k?k+':'+(d==='-1'?'1':'-1'):h.dataset.sk+':1');});
function dshort(v){v=String(v||'').trim();const m=v.match(/^(\d{1,2})\.(\d{1,2})\.?(\d{2,4})?$/);return m?m[1].padStart(2,'0')+'.'+m[2].padStart(2,'0')+'.':v;}
function toIsoDe(v){const m=String(v||'').match(/(\d{1,2})\.(\d{1,2})\.?(\d{2,4})?/);if(!m)return '';const t=vkDate(v);if(!t)return '';const d=new Date(t);return iso(d);}
function dateEdit(td){const b=V.find(x=>x.id===td.dataset.vid),f=td.dataset.df;if(!b)return;const i=document.createElement('input');i.type='date';i.className='edit din';i.value=toIsoDe(b[f]);td.textContent='';td.append(i);i.focus();try{i.showPicker();}catch(_){}
 let done=false;const fin=ok=>{if(done)return;done=true;const v=i.value;i.remove();if(ok&&v){const d=fromIso(v);const out=String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear();if(out!==b[f]){putV(Object.assign({},b,{[f]:out}));toast({dat:'Bestellt am',antrag:'Antrag gestellt am',ok:'Leasing genehmigt',lende:'Leasingende'}[f]+': '+dshort(out));return;}}
 if(ok==='clr'&&b[f]){putV(Object.assign({},b,{[f]:''}));toast({dat:'Bestellt am',antrag:'Antrag gestellt am',ok:'Leasing genehmigt',lende:'Leasingende'}[f]+' gelöscht',()=>{const bb=V.find(x=>x.id===b.id);if(bb)putV(Object.assign({},bb,{[f]:b[f],[f+'Von']:b[f+'Von']||''}));toast('Wiederhergestellt');});return;}rv();};
 /* 1.6.9: „Löschen“ im Kalender = Feld leeren */i.addEventListener('change',()=>{fin(i.value?true:'clr');});i.addEventListener('keydown',k=>{if(k.key==='Enter'){k.preventDefault();fin(true);}if(k.key==='Escape')fin(false);});i.addEventListener('blur',()=>setTimeout(()=>fin(false),200));}
$('cards').addEventListener('click',e=>{const td=e.target.closest('td.dcell');if(td&&!td.querySelector('input'))dateEdit(td);const tk=e.target.closest('td.kcell');if(tk&&!tk.querySelector('select'))ltEdit(tk);const tp=e.target.closest('td.pcell');if(tp&&!tp.querySelector('select'))pEdit(tp);});
// LT: Klick → Kalenderwoche wählen (Lager, KW −4 … +30 mit Datum Mo–Sa), gespeichert als „KW 47“
function ltOpts(cur){const now=new Date();now.setHours(12,0,0,0);const mo=new Date(now);mo.setDate(mo.getDate()-((mo.getDay()+6)%7));const dd=d=>String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.';
 const isoY=d=>{const t=new Date(d);t.setDate(t.getDate()+3);return t.getFullYear();};
 const w1=y=>{const j=new Date(y,0,4,12);j.setDate(j.getDate()-((j.getDay()+6)%7));return j;};
 const from=new Date(mo);from.setDate(from.getDate()-7*26);const end=new Date(mo);end.setDate(end.getDate()+7*30);
 const op=(v,n,x)=>`<option value="${esc(v)}"${v===cur?' selected':''}${x||''}>${esc(n)}</option>`;
 let h=op('','–  kein LT')+op('Sofort','⚡ Sofort')+op('Lager','Lager');const vals=['','Sofort','Lager'];
 let a=w1(isoY(from)),y=-1;while(a<=end){const yy=isoY(a);if(yy!==y){if(y!==-1)h+='</optgroup>';h+=`<optgroup label="${yy}">`;y=yy;}
  const e=new Date(a);e.setDate(e.getDate()+5);const v='KW '+kw(a)+'/'+String(yy%100).padStart(2,'0'),isNow=+a===+mo;vals.push(v);h+=op(v,'KW '+kw(a)+'  ·  '+dd(a)+'–'+dd(e)+(isNow?'  ◀ diese Woche':''),isNow?' data-now="1"':'');a=new Date(a);a.setDate(a.getDate()+7);}
 h+='</optgroup>';if(cur&&!vals.includes(cur))h=op(cur,cur)+h;return h;}
const VKFORM=['US','H','TZ','MTB'],VKGR=['16"','18"','20"','22"','43cm','45cm','46cm','48cm','50cm','51cm','53cm','55cm','56cm','57cm','58cm','60cm','61cm','63cm'];
function pickOpts(list,cur){const op=v=>`<option value="${esc(v)}"${v===cur?' selected':''}>${esc(v||'–  leer')}</option>`;return op('')+(cur&&!list.includes(cur)?op(cur):'')+list.map(op).join('');}
function pEdit(td){const b=V.find(x=>x.id===td.dataset.vid);if(!b)return;const f=td.dataset.pf;popPick(td,b,f,pickOpts(f==='form'?VKFORM:VKGR,b[f]||''),f==='form'?'Form':'Größe');}
function ltEdit(td){const b=V.find(x=>x.id===td.dataset.vid);if(!b)return;popPick(td,b,'lt',ltOpts(ltNorm(b.lt)),'Liefertermin',ltNorm(b.lt));}
function popPick(td,b,f,html,lab,sel){const cur=b[f]||'',cs=sel==null?cur:sel;const sl=document.createElement('select');sl.className='edit din ksel klist'+(f==='lt'?'':' ksm');sl.innerHTML=html;sl.size=Math.min(f==='lt'?14:20,sl.options.length+sl.querySelectorAll('optgroup').length);td.textContent='';td.append(sl);
 // zur eingetragenen bzw. aktuellen Woche springen (bei doppelten KW-Nummern die nächstliegende)
 const opts=[...sl.options],now=sl.querySelector('option[data-now]'),ni=now?opts.indexOf(now):0;const hit=cs?opts.map((o,i)=>[o,i]).filter(([o])=>o.value===cs).sort((p,q)=>Math.abs(p[1]-ni)-Math.abs(q[1]-ni))[0]:null;
 const tgt=hit?hit[0]:now;if(tgt)tgt.selected=true;const rc=td.getBoundingClientRect(),H=Math.min(f==='lt'?400:560,innerHeight-24,(sl.size)*27+10);sl.style.left=Math.min(rc.left,innerWidth-330)+'px';sl.style.top=Math.max(12,Math.min(rc.top,innerHeight-H-12))+'px';sl.style.height=H+'px';sl.focus({preventScroll:true});if(tgt)setTimeout(()=>{const rh=sl.scrollHeight/(opts.length+sl.querySelectorAll('optgroup').length||1);sl.scrollTop=Math.max(0,sl.scrollTop+sl.clientHeight/2-rh*1.5);},40);
 let done=false;const fin=(ok,v)=>{if(done)return;done=true;sl.remove();if(ok&&v!=null&&v!==cur){putV(Object.assign({},b,{[f]:v}));toast(v?lab+': '+v:lab+' entfernt');return;}rv();};
 sl.addEventListener('click',e=>{const o=e.target.closest('option');if(o)fin(true,o.value);});
 sl.addEventListener('keydown',k=>{if(k.key==='Escape'){k.preventDefault();fin(false);}if(k.key==='Enter'){k.preventDefault();fin(true,sl.value);}});
 sl.addEventListener('blur',()=>setTimeout(()=>fin(false),150));}
$('cards').addEventListener('keydown',e=>{const td=e.target.closest('td.dcell');if(td&&e.key==='Enter'&&!td.querySelector('input')){e.preventDefault();dateEdit(td);return;}const tp=e.target.closest('td.pcell');if(tp&&e.key==='Enter'&&!tp.querySelector('select')){e.preventDefault();pEdit(tp);return;}const tk=e.target.closest('td.kcell');if(tk&&e.key==='Enter'&&!tk.querySelector('select')){e.preventDefault();ltEdit(tk);return;}const c=e.target.closest('[contenteditable]');if(c&&e.key==='Enter'){e.preventDefault();c.blur();}if(c&&e.key==='Escape'){c.blur();rv();}});
$('cards').addEventListener('focusin',e=>{const c=e.target.closest('.ef[data-f=modell]');if(!c)return;const b=V.find(x=>x.id===c.dataset.vid);if(b&&c.textContent!==(b.modell||''))c.textContent=b.modell||'';});
$('cards').addEventListener('focusout',e=>{const c=e.target.closest('[contenteditable][data-f]');if(!c)return;const b=V.find(x=>x.id===c.dataset.vid),f=c.dataset.f,v=c.textContent.trim();const cur=f==='notiz'?[b&&b.notiz,b&&b.montieren?'Montieren: '+b.montieren:''].filter(Boolean).join(' · '):(b&&b[f]||'');if(!b||v===cur)return;putV(Object.assign({},b,{[f]:v},f==='notiz'?{montieren:''}:{}));toast('Gespeichert');});
$('vkAdd').addEventListener('click',()=>{vkEdit='new';rv();$('cards').scrollIntoView({block:'start'});const f=document.querySelector('[data-vf=new] input');if(f)f.focus();});
$('vkDone').addEventListener('click',e=>{vkShowDone=!vkShowDone;e.currentTarget.setAttribute('aria-pressed',vkShowDone);rv();});

/* ================= BESTELLUNGEN ================= */
let bEdit=null,bShowDone=false;
const BST=[['offen','Offen'],['bestellt','Bestellt'],['da','Da · Kunde informieren']];
const BF=[['datum','Datum'],['kunde','Kunde / Modell'],['telefon','Telefon'],['artikel','Artikel'],['lieferant','Lieferant'],['lieferzeit','Lieferzeit'],['notiz','Notiz']];
let bF='';
function rb(){const m=b=>true;
 const st=k=>B.filter(b=>(b.status||'offen')===k).length;
 $('bForm').innerHTML=bEdit?bForm(bEdit==='new'?{id:'new',datum:new Date().toLocaleDateString('de-DE'),status:'offen'}:B.find(x=>x.id===bEdit)||{id:'new'}):'';
 const cols=bShowDone?[...BST,['fertig','Erledigt']]:BST;
 $('bCols').style.gridTemplateColumns=`repeat(${cols.length},minmax(0,1fr))`;
 $('bCols').innerHTML=cols.map(([k,n])=>{const it=B.filter(b=>(b.status||'offen')===k&&m(b));return `<div class="col" data-k="${k}"><h3><i></i>${n} <span>${it.length}</span></h3>${it.length?'':'<p class="empty">Nichts hier ✓</p>'}${it.map(b=>`<div class="order"><b>${esc(b.artikel||'–')}</b><small>${esc(b.kunde)}${b.telefon?' · <a href="tel:'+esc(b.telefon.replace(/\s/g,''))+'">'+esc(b.telefon)+'</a>':''}</small><small>${b.lieferant?'Lieferant: '+esc(b.lieferant):''}${b.lieferzeit?' · '+esc(b.lieferzeit):''}${b.datum?' · '+esc(b.datum):''}</small>${b.notiz?`<small>📝 ${esc(b.notiz)}</small>`:''}
 <div class="oacts"><span class="paid ${b.bezahlt==='ja'?'y':''}" data-bpaid="${esc(b.id)}" role="button" tabindex="0">${b.bezahlt==='ja'?'✓ bezahlt':'nicht bezahlt'}</span>${av(b.von,'angelegt von')}<span style="flex:1"></span>
 ${k!=='offen'?`<button class="mini" type="button" data-bmv="${esc(b.id)}" data-to="${k==='fertig'?'da':k==='da'?'bestellt':'offen'}" title="zurück">←</button>`:''}${k!=='fertig'?`<button class="mini go" type="button" data-bmv="${esc(b.id)}" data-to="${k==='offen'?'bestellt':k==='bestellt'?'da':'fertig'}">${k==='offen'?'bestellt →':k==='bestellt'?'ist da →':'✓ erledigt'}</button>`:''}<button class="mini" type="button" data-bedit="${esc(b.id)}" title="bearbeiten">✎</button></div></div>`).join('')}</div>`;}).join('');
 $('nBest').textContent=B.filter(b=>(b.status||'offen')!=='fertig').length;}
function bForm(b){return `<form class="edf card" data-bf="${esc(b.id)}" autocomplete="off"><b>${b.id==='new'?'Neue Bestellung':'Bestellung bearbeiten'}</b><div class="g2">${BF.map(([k,n])=>`<label>${n}<input name="${k}" value="${esc(b[k]||'')}"${k==='artikel'?' required':''}></label>`).join('')}<label>Bezahlt<select name="bezahlt"><option value="">nein</option><option value="ja"${b.bezahlt==='ja'?' selected':''}>ja</option></select></label></div>
 <div class="acts"><button class="btn red" type="submit">Speichern</button><button class="btn" type="button" data-bcancel>Abbrechen</button>${b.id!=='new'?`<button class="btn del" type="button" data-bdel="${esc(b.id)}">Löschen</button>`:''}</div></form>`;}
async function putB(b){const i=B.findIndex(x=>x.id===b.id);if(i<0)B.unshift(b);else B[i]=b;rb();try{await save('B',b);}catch(_){}}
$('v-bestell').addEventListener('click',e=>{const mv=e.target.closest('[data-bmv]');if(mv){const b=B.find(x=>x.id===mv.dataset.bmv);putB(Object.assign({},b,{status:mv.dataset.to}));toast({offen:'Offen',bestellt:'Bestellt',da:'Ist da – Kunde informieren',fertig:'Erledigt ✓'}[mv.dataset.to]);return;}
 const pd=e.target.closest('[data-bpaid]');if(pd){const b=B.find(x=>x.id===pd.dataset.bpaid);putB(Object.assign({},b,{bezahlt:b.bezahlt==='ja'?'':'ja'}));return;}
 const ed=e.target.closest('[data-bedit]');if(ed){bEdit=ed.dataset.bedit;rb();$('bForm').scrollIntoView({block:'start'});return;}
 if(e.target.closest('[data-bcancel]')){bEdit=null;rb();return;}
 const dl=e.target.closest('[data-bdel]');if(dl){if(!dl.dataset.sure){dl.dataset.sure=1;dl.textContent='Wirklich löschen?';return;}const id=dl.dataset.bdel,b=B.find(x=>x.id===id);B=B.filter(x=>x.id!==id);bEdit=null;rb();del('B',id);toast('Gelöscht',()=>{B.unshift(b);rb();save('B',b).catch(()=>{});});}});
$('v-bestell').addEventListener('submit',e=>{if(!e.target.dataset.bf)return;e.preventDefault();const f=e.target,id=f.dataset.bf,d=new FormData(f);const b=id==='new'?{id:nid('b'),status:'offen',von:ME.id}:Object.assign({},B.find(x=>x.id===id));BF.forEach(([k])=>b[k]=String(d.get(k)||'').trim());b.bezahlt=d.get('bezahlt')||'';bEdit=null;putB(b);toast('Gespeichert');});
$('bAdd').addEventListener('click',()=>{bEdit='new';rb();const f=document.querySelector('[data-bf=new] input[name=kunde]');if(f)f.focus();});
$('bDone').addEventListener('click',e=>{bShowDone=!bShowDone;e.currentTarget.setAttribute('aria-pressed',bShowDone);rb();});

/* ================= LEASING ================= */
__LSDEF__
__LSREC__
function recMerge(o,x){const u=clean(x);delete u.k;delete u.v;if(!o.alt&&((o.abh||[]).length||(o.ser||[]).length))u.alt={abh:o.abh||[],ser:o.ser||[],is:o.is||'',vs:o.vs||'',gs:o.gs||'',text:o.text||'',tel:o.tel||''};u.abh=[];u.ser=[];return u;}
const LSDEF=LS.map(x=>{const r=LSREC.find(r=>r.k===x.k);return r?Object.assign({},x,recMerge(x,r)):Object.assign({},x);});
__LOGOS__
let lsQ='',lsDrei=false,lsEdit=-1;
const hl=t=>{let x=esc(t);if(lsQ){const i=x.toLowerCase().indexOf(esc(lsQ));if(i>=0)x=x.slice(0,i)+'<mark>'+x.slice(i,i+esc(lsQ).length)+'</mark>'+x.slice(i+esc(lsQ).length);}return x;};
const li=t=>`<li class="${t[0]==='!'?'w':''}">${hl(t.replace(/^!/,''))}</li>`;
const logoOf=f=>f.logo||LOGOS[f.k]||'';
// Feste Fragen je Anbieter (Tirys Liste) – [Feld, Frage, 't' = ja/nein/offen]
const LQG=[['🔧 Inspektion & Verschleiß',[['isz','Inspektion – wir bekommen'],['vsd','Verschleiß dabei?'],['abMon','Einreichen ab Monat'],['isCode','Inspektionscode für Kunden?']]],
 ['🛡 Versicherung',[['vers','Versicherung dabei?']]],
 ['🧾 Rechnungsadressen',[['reNeu','Neurad'],['reIV','Inspektion & Verschleiß'],['reSch','Schaden']]],
 ['🚲 Erlaubt zu leasen',[['drei','E-Dreirad','t'],['spe','S-Pedelec','t']]],
 ['🔑 Neuradabholung',[['code','Abholcode?'],['mit','Kunde bringt mit']]],
 ['📞 Kontakt & Leasingende',[['kon','Händler-Kontakt','','o'],['ende','Leasingende / Rückgabe','','o'],['preis','Preisgrenzen','','o']]]];/* 1.7.6: 'o' = nur anzeigen, wenn gefüllt */
const LQF=LQG.flatMap(g=>g[1]);
const isVers=f=>/versicherung|schäden/i.test(f.sub||'');
const qG=f=>isVers(f)?LVG:LQG,qF=f=>isVers(f)?LVF:LQF;
// Versicherungen (ENRA, Alteos, Fahrsicherung, Assona): eigene, rein händlerrelevante Felder
const LVG=[['🚲 Was ist versicherbar?',[['vRad','Räder · Alter · Wert'],['spe','S-Pedelec','t'],['drei','E-Dreirad','t']]],
 ['🤝 Abschluss über uns',[['vAbs','So schließen wir ab']]],
 ['🔧 Inspektion & Verschleiß',[['isz','Inspektion'],['vsd','Verschleiß'],['abMon','Verschleiß ab']]],
 ['🧾 Schaden',[['vMeld','Melden über'],['vKva','KVA / Freigabe'],['reSch','Rechnung an'],['vSb','Selbstbeteiligung']]],
 ['📞 Kontakt',[['vKon','Für Händler']]]];
const LVF=LVG.flatMap(g=>g[1]);
const lRank=f=>{const r=LS.findIndex(x=>x.k===f.k);return r<0?99:r;};
const lOrd=()=>L.map((f,i)=>[f,i]).sort((a,b)=>isVers(a[0])-isVers(b[0])||lRank(a[0])-lRank(b[0])||a[1]-b[1]);
const OFFEN='<span class="qo">offen</span>';
const triV=v=>v===true?'<span class="qy">✓ ja</span>':v===false?'<span class="qn">✗ nein</span>':OFFEN;
const qv=(f,[k,,t])=>t==='t'?triV(f[k]):String(f[k]||'').trim()?hl(f[k]):OFFEN;
function lsCard(f,i){const nj=(f.zubJa||[]).length,nn=(f.zubNein||[]).length;
 return `<article class="lc" style="--ac:${esc(f.ac||'#94A3B8')}"><div class="lctop"><button class="edbtn" type="button" data-led="${i}" aria-label="${esc(f.n)} bearbeiten">✎ Bearbeiten</button></div><div class="lh">${logoOf(f)?`<div class="logo"><img src="${esc(logoOf(f))}" alt="${esc(f.n)} Logo"></div>`:`<div class="mono">${esc(f.k)}</div>`}<div style="min-width:0">${logoOf(f)?'':`<b>${esc(f.n)}</b>`}<small>${esc(f.sub||'Leasing')} · ${esc(f.k)}</small></div></div>
 <div class="blk"><h4>${isVers(f)?'🛡 Tarife · Leistungen':'📦 Pakete · Leistungen · Preis für den Kunden'}</h4>${(f.pak||[]).length?`<ul>${f.pak.map(li).join('')}</ul>`:`<p class="qe">${OFFEN}</p>`}</div>
 ${qG(f).map(([h,qs])=>[h,qs.filter(q=>q[3]!=='o'||String(f[q[0]]||'').trim())]).filter(([h,qs])=>qs.length).map(([h,qs])=>`<div class="blk"><h4>${esc(h)}</h4><dl class="qa">${qs.map(q=>`<dt>${esc(q[1])}</dt><dd>${qv(f,q)}</dd>`).join('')}</dl></div>`).join('')}
 ${isVers(f)&&!nj&&!nn?'':`<button class="zubbtn" type="button" data-zub="${i}">🧩 Leasingfähiges Zubehör <span>${nj||nn?nj+' ✓ · '+nn+' ✗':'offen'}</span></button>`}
 </article>`;}
function rl(){
 $('lgrid').innerHTML=lOrd().filter(([f,i])=>i===lsEdit||((!lsDrei||f.drei===true)&&(!lsQ||JSON.stringify(Object.assign({},f,{logo:'',alt:''})).toLowerCase().includes(lsQ)))).map(([f,i])=>i===lsEdit?editCard(f,i):lsCard(f,i)).join('')||'<p class="hint">Nichts gefunden.</p>';
 if(!document.querySelector('#ltab [contenteditable]:focus'))$('ltab').innerHTML='<thead><tr><th>Anbieter</th><th>E-Dreirad</th><th>S-Pedelec</th><th>Inspektion – wir bekommen</th><th>Verschleiß</th><th>Versicherung</th></tr></thead><tbody>'+lOrd().map(([f,i])=>`<tr><td><b style="color:${esc(f.ac)}">●</b> ${esc(f.n)}</td>${['drei','spe'].map(k=>`<td class="tg ${f[k]===true?'y':f[k]===false?'n':''}" data-lt="${i}" data-f="${k}" role="button" tabindex="0" title="Klick = ✓ / ✗ / offen">${f[k]===true?'✓':f[k]===false?'✗':'–'}</td>`).join('')}${['isz','vsd','vers'].map(k=>`<td class="ce" contenteditable="true" spellcheck="false" data-lt="${i}" data-f="${k}">${esc(f[k]||'')}</td>`).join('')}</tr>`).join('')+'</tbody>';
 FN=Object.assign({BL:'Bikeleasing',CB:'Company Bike',KM:'Kazenmaier',BB:'Businessbike',JR:'JobRad',DD:'Deutsche Dienstrad',LB:'Lease a Bike',RD:'RIDE',ER:'Eurorad'},Object.fromEntries(L.filter(f=>!/versicherung|schäden/i.test(f.sub||'')).map(f=>[f.k,f.n])));}
function zubDlg(f){const L1=a=>(a||[]).map(t=>`<li>${esc(t)}</li>`).join(''),E='<p class="qe"><span class="qo">offen</span></p>';
 dlg(`<div class="zubd" style="--ac:${esc(f.ac||'#94A3B8')}"><h3>🧩 Leasingfähiges Zubehör · ${esc(f.n)}</h3>
 <div class="zcols"><div class="zj"><h4>✓ Leasingfähig</h4>${(f.zubJa||[]).length?`<ul>${L1(f.zubJa)}</ul>`:E}</div>
 <div class="zn"><h4>✗ Nicht leasingfähig</h4>${(f.zubNein||[]).length?`<ul>${L1(f.zubNein)}</ul>`:E}</div></div>
 <div class="acts"><button class="btn" type="button" data-close>Schließen</button></div></div>`);$('dlgBox').classList.add('wide');}
function editCard(f,i){const ta=(k,lbl,r)=>`<label>${lbl} <em>(eine Zeile pro Punkt)</em><textarea name="${k}" rows="${r}">${esc((f[k]||[]).join('\n'))}</textarea></label>`;
 return `<article class="lc editing" style="--ac:${esc(f.ac||'#94A3B8')}"><form class="edf" data-lf="${i}" autocomplete="off">
 <div class="lh">${logoOf(f)?`<div class="logo"><img src="${esc(logoOf(f))}" alt=""></div>`:`<div class="mono">${esc(f.k)}</div>`}<div style="flex:1;min-width:0"><b>Bearbeiten</b><small>Änderungen gelten sofort für alle</small></div></div>
 <div class="g2"><label>Name<input name="n" value="${esc(f.n)}" required></label><label>Kürzel<input name="k" value="${esc(f.k)}" maxlength="4" required></label>
 <label>Unterzeile<input name="sub" value="${esc(f.sub||'Leasing')}"></label><label>Farbe<input name="ac" type="color" value="${esc(f.ac||'#94A3B8')}"></label></div>
 ${ta('pak',isVers(f)?'Tarife · Leistungen':'Pakete · Leistungen · Preis für den Kunden',4)}
 <div class="g2">${qF(f).map(([k,n,t])=>t==='t'?`<label>${esc(n)}<select name="${k}"><option value="1"${f[k]===true?' selected':''}>✓ ja</option><option value="0"${f[k]===false?' selected':''}>✗ nein</option><option value=""${f[k]!==true&&f[k]!==false?' selected':''}>offen</option></select></label>`:`<label>${esc(n)}<input name="${k}" value="${esc(f[k]||'')}"></label>`).join('')}</div>
 ${isVers(f)?'':ta('zubJa','Leasingfähiges Zubehör',4)+ta('zubNein','Nicht leasingfähig',3)}
 <label class="up">Logo hochladen (PNG/SVG/WebP, freigestellt – wird automatisch verkleinert)<input name="logo" type="file" accept="image/png,image/svg+xml,image/webp,image/jpeg"></label>
 ${f.logo?`<button class="btn" type="button" data-rmlogo="${i}">Eigenes Logo entfernen</button>`:''}
 <div class="acts"><button class="btn red" type="submit">Speichern</button><button class="btn" type="button" data-lcancel>Abbrechen</button><button class="btn del" type="button" data-ldel="${i}">Anbieter löschen</button></div></form></article>`;}
function shrink(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const sc=Math.min(1,360/img.width,140/img.height),c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*sc));c.height=Math.max(1,Math.round(img.height*sc));c.getContext('2d').drawImage(img,0,0,c.width,c.height);let u=c.toDataURL('image/webp',.88);if(!u.startsWith('data:image/webp'))u=c.toDataURL('image/png');res(u);};img.onerror=()=>rej(new Error('Bild nicht lesbar'));img.src=r.result;};r.onerror=()=>rej(new Error('Datei nicht lesbar'));r.readAsDataURL(file);});}
async function putL(f){const o=Object.assign({},f);const id=o.id||o.k;o.id=id;if(JSON.stringify(o).length>700000){toast('Logo zu groß – bitte kleineres Bild');return false;}
 const i=L.findIndex(x=>x.id===id);if(i<0)L.push(o);else L[i]=o;lsEdit=-1;rl();try{await save('L',o);}catch(_){}return true;}
$('lgrid').addEventListener('click',async e=>{
 const ed=e.target.closest('[data-led]');if(ed){lsEdit=+ed.dataset.led;rl();document.querySelector('.lc.editing')?.scrollIntoView({block:'start',behavior:'smooth'});return;}
 if(e.target.closest('[data-lcancel]')){if(L[lsEdit]&&L[lsEdit]._new)L.splice(lsEdit,1);lsEdit=-1;rl();return;}
 const dl=e.target.closest('[data-ldel]');if(dl){const i=+dl.dataset.ldel;if(!dl.dataset.sure){dl.dataset.sure=1;dl.textContent='Wirklich löschen?';return;}const f=L[i];L.splice(i,1);lsEdit=-1;rl();if(!f._new)del('L',f.id);toast(f.n+' gelöscht');return;}
 const rm=e.target.closest('[data-rmlogo]');if(rm){const f=Object.assign({},L[+rm.dataset.rmlogo]);delete f.logo;putL(f);toast('Eigenes Logo entfernt');return;}
 const z=e.target.closest('[data-zub]');if(z){zubDlg(L[+z.dataset.zub]);return;}});
$('ltab').addEventListener('click',e=>{const c=e.target.closest('.tg');if(!c)return;const f=Object.assign({},L[+c.dataset.lt]);const k=c.dataset.f;f[k]=f[k]===true?false:f[k]===false?null:true;putL(f).then(()=>toast('Gespeichert'));});
$('ltab').addEventListener('keydown',e=>{const c=e.target.closest('.ce,.tg');if(!c)return;if(e.key==='Enter'){e.preventDefault();if(c.classList.contains('tg'))c.click();else c.blur();}});
$('ltab').addEventListener('focusout',e=>{const c=e.target.closest('.ce');if(!c)return;const f=Object.assign({},L[+c.dataset.lt]),v=c.textContent.trim();if(v===(f[c.dataset.f]||''))return;f[c.dataset.f]=v;putL(f).then(()=>toast('Gespeichert'));});
$('lgrid').addEventListener('submit',async e=>{if(!e.target.dataset.lf)return;e.preventDefault();const fm=e.target,i=+fm.dataset.lf,f=Object.assign({},L[i]),d=new FormData(fm);delete f._new;
 ['n','k','sub','ac'].concat(qF(f).filter(q=>!q[2]).map(q=>q[0])).forEach(k=>f[k]=String(d.get(k)||'').trim());f.k=f.k.toUpperCase().replace(/[^A-Z0-9]/g,'')||'NEU';qF(f).filter(q=>q[2]).forEach(([k])=>{const v=d.get(k);f[k]=v==='1'?true:v==='0'?false:null;});
 ['pak'].concat(isVers(f)?[]:['zubJa','zubNein']).forEach(k=>f[k]=String(d.get(k)||'').split('\n').map(x=>x.trim()).filter(Boolean));
 if(!f.id)f.id=f.k+Math.random().toString(36).slice(2,5).toUpperCase();
 const file=d.get('logo');if(file&&file.size){try{f.logo=await shrink(file);}catch(err){toast(err.message);return;}}
 if(await putL(f))toast('Gespeichert');});
$('lsAdd').addEventListener('click',()=>{L.push({_new:1,k:'NEU',n:'Neuer Anbieter',sub:'Leasing',ac:'#94A3B8',drei:null,spe:null,pak:[],zubJa:[],zubNein:[]});lsEdit=L.length-1;lsQ='';$('lsSearch').value='';rl();document.querySelector('.lc.editing')?.scrollIntoView({block:'start',behavior:'smooth'});});
$('lsSearch').addEventListener('input',e=>{lsQ=e.target.value.toLowerCase().trim();rl();});
$('fDrei').addEventListener('click',e=>{lsDrei=!lsDrei;e.currentTarget.setAttribute('aria-pressed',lsDrei);rl();});

/* ================= REKLAMATIONEN =================
   Gespeichert in meta/reklam {items:{id:{…}}} (Regel meta/* ist schon freigegeben – keine Konsolen-Änderung nötig).
   Status: offen (= eingereicht) → erl (Ersatz/Gutschrift erhalten = erledigt). Lieferant = Marke. */
let RKD={},rkEdit=null,rkShowDone=false;
const RKART=['Kundenreklamation','Garantie / Gewährleistung','Defekt bei Lieferung','Transportschaden','Falschlieferung','Fehlmenge','Sonstiges'];
const RKLOES=['Ersatz','Gutschrift','Reparatur','noch offen'];
const RKST={offen:['Eingereicht','#FB923C'],erl:['Erledigt','#34D399']};
const rkSt=r=>r.st==='erl'?'erl':'offen';
const rkAll=()=>Object.values(RKD).filter(x=>x&&x.id);
const rkDays=r=>{const t=vkDate(r.dat);return t?Math.floor((Date.now()-t)/864e5):null;};
const rkLief=r=>S.find(x=>x.id===r.lid)||S.find(x=>String(x.name||'').trim().toLowerCase()===String(r.lief||'').trim().toLowerCase())||null;
const deDate=d=>String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear();
async function putR(o){o=clean(o);o.ts=stamp();o.tsVon=ME?ME.id:'';RKD=Object.assign({},RKD,{[o.id]:o});rr();
 try{await db.doc('meta/reklam').update({['items.'+o.id]:o});}catch(e){try{const d=await db.doc('meta/reklam').get();const it=Object.assign({},(d.exists&&d.data().items)||{},{[o.id]:o});await db.doc('meta/reklam').set({items:it},{merge:true});}catch(e2){fail(e2);}}}
async function delR(id){const n=Object.assign({},RKD);delete n[id];RKD=n;rr();try{await db.doc('meta/reklam').update({['items.'+id]:null});}catch(e){fail(e);}}
function rkTxt(r){const l=rkLief(r);return [r.lief,l&&l.name,r.marke,r.artikel,r.kunde,r.art,r.grund,r.loes,r.dat,r.erlAm,RKST[rkSt(r)][0]].join(' ').toLowerCase();}
function rr(){if(!$('rkTab'))return;const q=($('rkSearch').value||'').trim().toLowerCase(),all=rkAll();
 $('nRekla').textContent=all.filter(r=>rkSt(r)!=='erl').length;
 const rank={offen:0,erl:1};
 const list=all.filter(r=>q?rkTxt(r).includes(q):(rkShowDone||rkSt(r)!=='erl')||r.id===rkEdit)
  .sort((a,b)=>rank[rkSt(a)]-rank[rkSt(b)]||(rkSt(a)==='erl'?vkDate(b.erlAm)-vkDate(a.erlAm):vkDate(a.dat)-vkDate(b.dat)));
 $('rkDone').setAttribute('aria-pressed',rkShowDone);
 $('rkForm').innerHTML=rkEdit?rkFormH(rkEdit==='new'?{id:'new',st:'offen'}:RKD[rkEdit]||{id:'new',st:'offen'}):'';
 $('rkTab').innerHTML='<thead><tr><th></th><th>Eingereicht am</th><th>Lieferant / Marke</th><th>Artikel</th><th>Grund</th><th>Kunde</th><th>Lösung</th><th>Status</th><th></th></tr></thead><tbody>'+
  (list.length?list.map(rkRow).join(''):`<tr><td colspan="9" class="empty">${q?'Nichts gefunden – gesucht wird in allen Reklamationen inkl. erledigter.':'Keine offenen Reklamationen 👍'}</td></tr>`)+'</tbody>';}
function rkRow(r){const st=rkSt(r),[stn,stc]=RKST[st],l=rkLief(r),lg=l?sLogo(l):'',d=rkDays(r);
 const age=st!=='erl'&&d!=null?`<small class="rkage${d>30?' hot':d>14?' warm':''}">${d<=0?'heute':'seit '+d+' '+(d===1?'Tag':'Tagen')}</small>`:(st==='erl'&&r.erlAm?`<small>erledigt ${esc(dshort(r.erlAm))}</small>`:'');
 return `<tr class="rkr st-${st}" style="--rc:${stc}">
 <td class="sdot" title="${stn}"><i></i></td>
 <td class="rkd"><b>${esc(dshort(r.dat)||'–')}</b>${age}</td>
 <td class="rkl">${lg?`<img src="${lg}" alt="">`:''}<div><b>${esc(l?l.name:(r.lief||'–'))}</b>${l&&l.kdnr?`<small>Kd-Nr. ${esc(l.kdnr)}</small>`:''}${l?`<button class="lnk" type="button" data-golief="${esc(l.name)}">→ Lieferant</button>`:''}</div></td>
 <td class="rka"><b>${esc(r.artikel||'–')}</b>${r.menge&&r.menge!=='1'?`<small>${esc(r.menge)}×</small>`:''}</td>
 <td class="rkg">${r.art?`<span class="rkchip">${esc(r.art)}</span>`:''}<small>${esc(r.grund||'')}</small></td>
 <td>${esc(r.kunde||'–')}</td>
 <td>${r.loes?`<span class="rkchip l">${esc(r.loes)}</span>`:'–'}</td>
 <td class="rkst"><button class="st rk2" type="button" data-rkst="erl" data-rid="${esc(r.id)}" aria-pressed="${st==='erl'}" title="${r.erlAm?'erledigt '+esc(r.erlAm)+(r.erlVon?' · '+esc(U(r.erlVon).n):''):'Ersatz/Gutschrift erhalten = erledigt'}">✓ erhalten</button></td>
 <td><button class="mini" type="button" data-redit="${esc(r.id)}" title="Bearbeiten / Löschen">✎</button></td></tr>`;}
function rkFormH(r){const nw=r.id==='new',iso2=v=>toIsoDe(v)||'';const opt=(arr,v)=>'<option value="">–</option>'+arr.map(x=>`<option${x===v?' selected':''}>${esc(x)}</option>`).join('');const l=rkLief(r);
 const names=[...new Set(S.map(x=>String(x.name||'').trim()).concat(allBrands().map(x=>x.n)).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 return `<form class="edf card rkf" data-rf="${esc(r.id)}" autocomplete="off" novalidate><b>${nw?'Neue Reklamation':'Reklamation bearbeiten'}</b>
 <datalist id="rkLiefL">${names.map(n=>`<option value="${esc(n)}">`).join('')}</datalist>
 <div class="g4">
  <label>Eingereicht am<input name="dat" type="date" value="${esc(nw?iso(new Date()):iso2(r.dat))}"></label>
  <label>Lieferant / Marke<input name="lief" list="rkLiefL" value="${esc(l?l.name:(r.lief||''))}" placeholder="z. B. i:SY, ABUS …"></label>
  <label class="w2">Artikel / Teil<input name="artikel" value="${esc(r.artikel||'')}" placeholder="z. B. Bosch PowerTube 750"></label>
  <label>Menge<input name="menge" value="${esc(r.menge||'')}" placeholder="1"></label>
  <label>Kunde (falls Kundenrad)<input name="kunde" value="${esc(r.kunde||'')}"></label>
  <label>Art<select name="art">${opt(RKART,r.art)}</select></label>
  <label>Lösung erwartet<select name="loes">${opt(RKLOES,r.loes)}</select></label>
  <label class="w4">Fehler / Grund<textarea name="grund" rows="2">${esc(r.grund||'')}</textarea></label>
 </div>${r.erlAm?`<p class="hint">Erledigt am ${esc(r.erlAm)}${r.erlVon?' von '+esc(U(r.erlVon).n):''}</p>`:''}
 <div class="acts"><button class="btn red" type="submit">${nw?'Reklamation einreichen':'Speichern'}</button><button class="btn" type="button" data-rcancel>Abbrechen</button>${!nw?`<button class="btn del" type="button" data-rdel="${esc(r.id)}">Löschen</button>`:''}</div></form>`;}
$('rkSearch').addEventListener('input',rr);
$('rkDone').addEventListener('click',()=>{rkShowDone=!rkShowDone;rr();});
$('rkAdd').addEventListener('click',()=>{rkEdit='new';rr();$('rkForm').scrollIntoView({block:'start'});const f=document.querySelector('[data-rf=new] input[name=lief]');if(f)f.focus();});
$('v-rekla').addEventListener('click',e=>{
 const g=e.target.closest('[data-golief]');if(g){show('lief');$('sSearch').value=g.dataset.golief;rs();return;}
 const s1=e.target.closest('[data-rkst]');if(s1){const r=RKD[s1.dataset.rid];if(!r)return;const n=Object.assign({},r);
  if(rkSt(r)==='erl'){n.st='offen';n.erlAm='';n.erlVon='';}else{n.st='erl';n.erlAm=deDate(new Date());n.erlVon=ME.id;}
  putR(n);if(n.st==='erl')toast('Erledigt – '+(r.artikel||'Reklamation')+' (unter „Erledigte zeigen“)',()=>{putR(Object.assign({},r));toast('Wieder offen');});return;}
 const ed=e.target.closest('[data-redit]');if(ed){rkEdit=ed.dataset.redit;rr();$('rkForm').scrollIntoView({block:'start'});return;}
 if(e.target.closest('[data-rcancel]')){rkEdit=null;rr();return;}
 const dl=e.target.closest('[data-rdel]');if(dl){if(!dl.dataset.sure){dl.dataset.sure=1;dl.textContent='Wirklich löschen?';return;}rkEdit=null;delR(dl.dataset.rdel);toast('Gelöscht');}});
$('v-rekla').addEventListener('submit',e=>{if(!e.target.dataset.rf)return;e.preventDefault();const f=e.target,id=f.dataset.rf,d=new FormData(f);
 const r=id==='new'?{id:nid('r'),von:ME.id,st:'offen'}:Object.assign({},RKD[id]);
 ['lief','artikel','menge','kunde','art','loes','grund'].forEach(k=>r[k]=String(d.get(k)||'').trim());r.marke=r.lief;
 {const v=String(d.get('dat')||'');r.dat=/^\d{4}-\d{2}-\d{2}$/.test(v)?deDate(fromIso(v)):'';}
 const l=S.find(x=>String(x.name||'').trim().toLowerCase()===r.lief.toLowerCase());r.lid=l?l.id:'';
 rkEdit=null;putR(r);toast('Gespeichert');});

/* ================= KUNDEN (Verkaufshistorie seit 1995, aus Sheet-Reiter „Kunden“) =================
   Gespeichert je Jahr in meta/kd_<Jahr> = {items:{id:{…}}} (bzw. meta/kd_x ohne Jahr) – wenige Lesevorgänge, Regel meta/* reicht.
   Felder: dat (TT.MM.JJJJ) · nr (Beleg-Nr.) · marke · modell · preis · leas · kunde · vers · rahmen · tel · k (Spalte ohne Überschrift) · y (Paket). */
let KD={},KDIMP=false,kdDirty=true,kdList=[],kdYears=2,kdEdit=null;
const kdAll=()=>{if(kdDirty){kdList=[];for(const y in KD)for(const id in KD[y]){const r=KD[y][id];if(r&&r.id){r._d=vkDate(r.dat)||0;r._t=[r.kunde,r.marke,r.modell,r.rahmen,r.tel,r.nr,kdNr(r),r.leas,r.vers,r.dat,r.preis].join(' ').toLowerCase();r._o=(r.o!=null&&r.o!==''&&!isNaN(+r.o))?+r.o:r._d;kdList.push(r);}}kdList.sort((a,b)=>b._o-a._o||String(b.nr).localeCompare(String(a.nr),'de',{numeric:true}));kdDirty=false;}return kdList;};
/* Spalten wie in Excel: Reihenfolge per Ziehen am Kopf, Breite am rechten Rand des Kopfs (Doppelklick = Standard).
   Je Profil in meta/prefs[ID].kdlay = {o:[Spalten], w:{Spalte:px}} (+ localStorage). Zeilen: Griff ⋮⋮ links, nur innerhalb eines Jahres (Feld o). */
const KDC=[{k:'dat',n:'Datum',w:98,c:'kd'},{k:'nr',n:'Beleg',w:66,c:'kn'},{k:'marke',n:'Marke',w:130,c:'km'},{k:'modell',n:'Modell',min:200,fr:1.6,c:'kmo'},{k:'preis',n:'Preis',w:96,c:'kp'},{k:'leas',n:'Leasing',w:92,c:'kl2'},{k:'kunde',n:'Kunde',min:170,fr:1.2,c:'kk'},{k:'vers',n:'Vers.',w:80,c:'kv'},{k:'rahmen',n:'Rahmen-Nr.',w:130,c:'krn'},{k:'tel',n:'Telefon',w:130,c:'kt'},{k:'k',n:'',w:34,c:'kx'}];
const KDRB=['#FF3B5C','#FF6B2C','#FF9F1C','#FFD93B','#A3E635','#3DDC84','#22D3EE','#38BDF8','#4F7BFF','#8B5CF6','#D946EF'];
const kdDef=()=>({o:KDC.map(c=>c.k),w:{}});
let kdLay=kdDef(),kdDrag=null;
function kdLayLoad(x){if(!ME)return;const l=ls.get('vc_kdlay_'+ME.id,null);if(l&&Array.isArray(l.o))kdLay=l;if(x&&Array.isArray(x.o)){kdLay={o:x.o,w:x.w||{}};ls.set('vc_kdlay_'+ME.id,kdLay);}rk();}
function kdLaySave(){if(!ME)return;ls.set('vc_kdlay_'+ME.id,kdLay);const p=db.doc('meta/prefs');p.update({[ME.id+'.kdlay']:kdLay}).catch(()=>p.set({[ME.id]:{kdlay:kdLay}},{merge:true})).catch(()=>{});}
const kdCols=()=>{const o=(kdLay.o||[]).filter((k,i,a)=>KDC.some(c=>c.k===k)&&a.indexOf(k)===i);KDC.forEach(c=>{if(!o.includes(c.k))o.push(c.k);});return o.map(k=>KDC.find(c=>c.k===k));};
function kdTpl(){const g=$('kdGrid');if(!g)return;let mw=66;const t=['26px'];kdCols().forEach(c=>{const w=kdLay.w&&kdLay.w[c.k];if(w){t.push(w+'px');mw+=w;}else if(c.fr){t.push(`minmax(${c.min}px,${c.fr}fr)`);mw+=c.min;}else{t.push(c.w+'px');mw+=c.w;}});t.push('40px');g.style.gridTemplateColumns=t.join(' ');g.style.minWidth=mw+'px';
 if($('kdRst'))$('kdRst').hidden=JSON.stringify({o:kdCols().map(c=>c.k),w:kdLay.w||{}})===JSON.stringify(kdDef());}
// Beleg-Nr. mit Jahr: 20.12.2024 + 1422 -> R24-1422 (nur Anzeige; gespeichert bleibt die Nummer)
function kdNr(r){const n=String(r.nr==null?'':r.nr).trim(),d=r._d||vkDate(r.dat);return /^\d+$/.test(n)&&d?'R'+String(new Date(d).getFullYear()).slice(2)+'-'+n:n;}
// Versicherungs-Kürzel aus „Leasing-Infos“ (ENRA, Alteos, Fahrsicherung, Assona) + EP = ENRA PLUS (Tiry 02.11.)
function kdVN(){const m={E:'ENRA',EP:'ENRA PLUS'};(L||[]).filter(isVers).forEach(f=>{if(f.k)m[f.k]=f.n;});return m;}
// Logos der Leasing-/Versicherungsfirmen aus „Leasing-Infos“ (EP = ENRA PLUS -> ENRA-Logo + „PLUS“)
// Kürzel wird erkannt, egal wie geschrieben („jr“, „J.R.“); E/ENRA = ENRA, EP/ENRA PLUS/E+ = ENRA-Logo + „+“ (2 Tarife)
const kdKey=v=>{let k=String(v||'').toUpperCase().replace(/PLUS/g,'P').replace(/\+/g,'P').replace(/[^A-ZÄÖÜ]/g,'');if(k==='ENRAP'||k==='ENP')k='EP';if(k==='ENRA'||k==='E')k='EN';return k;};
function kdLogo(v){let k=kdKey(v);if(!k)return'';if(k==='EP')k='EN';const x=(L||[]).find(l=>l.k===k)||(L||[]).find(l=>kdKey(l.n)===k);return x?logoOf(x):(LOGOS[k]||'');}
const kdLogoH=v=>{const lg=kdLogo(v);return lg?`<img class="llg kll" src="${esc(lg)}" alt="${esc(v)}" draggable="false">${kdKey(v)==='EP'?'<i class="kplus" title="ENRA PLUS">+</i>':''}`:'';};
const kdVal=(k,r)=>k==='nr'?kdNr(r):k==='preis'?kdPreis(r.preis):String(r[k]==null?'':r[k]).trim();
const kdLab=(k,v)=>v===''?'(leer)':k==='leas'&&FN[v]?v+' · '+FN[v]:k==='vers'&&kdVN()[v]?v+' · '+kdVN()[v]:v;
let kdF={},kdYr=String(ls.get('vc_kdyr','')||'');  // Filter je Spalte: {Spalte: Set(Werte)} wie der Excel-Autofilter
const kdYear=r=>{const d=r._d?new Date(r._d):null;return d?d.getFullYear():'ohne Datum';};
const kdPreis=v=>{v=String(v==null?'':v).trim();if(/^\d+([.,]\d+)?$/.test(v)){const n=parseFloat(v.replace(',','.'));return n.toLocaleString('de-DE',{maximumFractionDigits:2})+' €';}return v;};
function rk(){const g=$('kdGrid');if(!g)return;const all=kdAll();{const cy=new Date().getFullYear();$('nKunden').textContent=all.length?all.length.toLocaleString('de-DE'):'–';$('nKunden').title=all.length.toLocaleString('de-DE')+' Verkäufe gesamt seit 1995 · davon '+all.filter(r=>r._d&&new Date(r._d).getFullYear()===cy).length+' in '+cy;}
 if(document.querySelector('#kdGrid [contenteditable]:focus'))return;
 const q=($('kdSearch').value||'').trim().toLowerCase();const now=new Date().getFullYear();
 const fk=Object.keys(kdF),fo=r=>fk.every(k=>kdF[k].has(kdVal(k,r)));if($('kdFx')){$('kdFx').hidden=!fk.length;$('kdFx').textContent='✕ Filter aus ('+fk.length+')';}
 // Jahres-Leiste: Klick auf einen Jahrgang zeigt nur dieses Jahr (Suche/Filter wirken dann innerhalb des Jahres)
 const yc={};all.forEach(r=>{const y=String(kdYear(r));yc[y]=(yc[y]||0)+1;});if(kdYr&&!yc[kdYr]&&all.length)kdYr='';
 const ys=Object.keys(yc).sort((a,b)=>(+b||0)-(+a||0)),de=n=>n.toLocaleString('de-DE');
 $('kdYrs').innerHTML=all.length?`<button type="button" class="kyc${kdYr?'':' on'}" data-kyr="">Alle Jahre<em>${de(all.length)}</em></button>`+ys.map(y=>`<button type="button" class="kyc${kdYr===y?' on':''}" data-kyr="${esc(y)}">${esc(y)}<em>${de(yc[y])}</em></button>`).join(''):'';
 const qOk=r=>(!q||q.split(/\s+/).every(w=>r._t.includes(w)))&&fo(r);
 let list=kdYr?all.filter(r=>String(kdYear(r))===kdYr&&qOk(r)):q||fk.length?all.filter(qOk):all.filter(r=>!r._d||new Date(r._d).getFullYear()>now-kdYears);
 const cap=kdYr?3000:600,more=kdYr?false:q||fk.length?list.length>cap:all.some(r=>r._d&&new Date(r._d).getFullYear()<=now-kdYears);list=list.slice(0,cap);
 $('kdMore').hidden=!!(kdYr||q||fk.length)||!more;$('kdMore').textContent='Ältere Jahre anzeigen (bis '+(now-kdYears-1)+')';
 $('kdForm').innerHTML=kdEdit?kdFormH():'';
 if($('kdClr'))$('kdClr').hidden=!(ME&&ME.adm)||!all.length;
 {const nb=Object.keys(KDT).length;$('kdBin').hidden=!nb;$('kdBinN').textContent=nb;}
 const cols=kdCols();kdTpl();
 let h=`<div class="hd kdh kgh" style="--hc:${KDRB[0]}"></div>`+cols.map((c,i)=>`<div class="hd kdh${c.k==='kunde'?' kl':''}${kdF[c.k]?' kfon':''}" draggable="true" data-kc="${c.k}" title="Klick = filtern · Ziehen = Spalte verschieben · rechter Rand = Breite" style="--hc:${KDRB[i%KDRB.length]}">${c.n||'·'}<i class="kfi">${kdF[c.k]?'▼':'▾'}</i><span class="kres" data-kres="${c.k}" title="Ziehen = Breite ändern · Doppelklick = Standard"></span></div>`).join('')+`<div class="hd kdh" style="--hc:${KDRB[KDRB.length-1]}"></div>`;let yr=null;const cnt={};list.forEach(r=>{const y=kdYear(r);cnt[y]=(cnt[y]||0)+1;});
 if(!all.length){kdPopClose();g.innerHTML=h+`<div class="kdempty">${ME&&ME.adm?'Noch keine Kunden – oben „📥 Kunden aus Sheet übernehmen“ und die .xlsx des Sheets wählen.':'Noch keine Kunden übernommen.'}</div>`;return;}
 for(const r of list){const y=kdYear(r);if(y!==yr){yr=y;h+=`<div class="kw kdy">${y}<span>${cnt[y]} ${cnt[y]===1?'Verkauf':'Verkäufe'}${q||fk.length?' (Treffer)':''}</span></div>`;}
  const id=esc(r.id),ky=esc(r.y);
  h+=`<div class="row kr"><div class="c kc kgrip" draggable="true" data-kid="${id}" data-ky="${ky}" title="Ziehen = Zeile verschieben">⋮⋮</div>${cols.map(c=>kdCell(c,r,id,ky)).join('')}<div class="c kc kdel" data-kid="${id}" data-ky="${ky}"><button class="nx" type="button" data-kdel="${id}" data-ky="${ky}" title="Eintrag löschen">×</button></div></div>`;}
 g.innerHTML=h+((q||fk.length)&&!list.length?'<div class="kdempty">Nichts gefunden.</div>':'');}
function kdCell(c,r,id,ky){if(c.k==='marke'){const b=brandOfB({marke:r.marke,modell:r.modell}),lg=b&&(BUSER.logos||{})[b.k];
  return `<div class="c kc km${lg?' haslg':''}" data-kid="${id}" data-ky="${ky}" data-kc="marke" title="${esc(r.marke||'')}">${lg?`<img src="${lg}" alt="" class="kml" draggable="false">`:''}<span class="kmt" contenteditable="true" spellcheck="false" data-kid="${id}" data-ky="${ky}" data-kf="marke">${esc(r.marke||'')}</span>${String(r.marke||'').trim()?`<label class="kmup" title="${lg?'Logo ersetzen':'Markenlogo hochladen'} (oder Bild hierher ziehen)">${lg?'⟳':'⬆'}<input type="file" accept="image/*" hidden data-kmup="${esc(r.marke)}"></label>`:''}</div>`;}
 if(c.k==='dat'||c.k==='leas'||c.k==='vers'){const v=String(r[c.k]||''),t=c.k==='dat'?'Klick = Datum wählen':(kdLab(c.k,v)+' · Klick = auswählen');
  const lg=c.k!=='dat'&&kdLogoH(v);return `<div class="c kc ${c.c} kpk${lg?' kplg':''}" role="button" tabindex="0" data-kpick="${c.k}" data-kid="${id}" data-ky="${ky}" data-kc="${c.k}" title="${esc(t)}">${lg||esc(v)}</div>`;}
 const v=kdVal(c.k,r);return `<div class="c kc ${c.c}" contenteditable="true" spellcheck="false" data-kid="${id}" data-ky="${ky}" data-kf="${c.k}" data-kc="${c.k}">${esc(v==null?'':v)}</div>`;}
// Papierkorb (1.5.8): gelöschte Zeilen 30 Tage in meta/kd_trash = {items:{id:{…Zeile,_y,_del,_von}}}
let KDT={};const KDT_DAYS=30;
async function kdBinSet(id,v){if(v)KDT=Object.assign({},KDT,{[id]:v});else{KDT=Object.assign({},KDT);delete KDT[id];}
 try{await db.doc('meta/kd_trash').update({['items.'+id]:v||null});}catch(e){try{await db.doc('meta/kd_trash').set({items:Object.assign({},KDT)},{merge:true});}catch(e2){fail(e2);}}}
let kdPruned=false;function kdBinPrune(){if(kdPruned||!ME)return;const lim=Date.now()-KDT_DAYS*864e5,old=Object.keys(KDT).filter(k=>(KDT[k]._del||0)<lim);if(!old.length)return;kdPruned=true;
 const u={};old.forEach(k=>{u['items.'+k]=null;delete KDT[k];});db.doc('meta/kd_trash').update(u).catch(()=>{});}
async function kdRestore(id){const x=KDT[id];if(!x)return;const r=Object.assign({},x),y=r._y||r.y||'x';delete r._y;delete r._del;delete r._von;await kdPut(y,r);await kdBinSet(id,null);kdDirty=true;rk();}
function kdBinOpen(btn){const L=Object.values(KDT).sort((a,b)=>(b._del||0)-(a._del||0));
 if(!L.length){kdPopClose();return;}
 const el=kdPopOpen(btn,`<div class="kbin"><b>↩ Gelöschte Zeilen</b><small>Bleiben ${KDT_DAYS} Tage hier, dann endgültig weg.</small><div class="kbl">${L.map(x=>{const dd=new Date(x._del||0);return `<div class="kbr"><div><b>${esc(x.kunde||'(ohne Kunde)')}</b><span>${esc([x.dat,x.marke,x.modell].filter(Boolean).join(' · '))}</span><i>gelöscht ${dd.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})} ${dd.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}${x._von?' · '+esc((U(x._von)||{}).n||x._von):''}</i></div><button class="btn" type="button" data-kres="${esc(x.id)}">↩ Zurückholen</button></div>`;}).join('')}</div></div>`);
 el.addEventListener('click',async e=>{const b=e.target.closest('[data-kres]');if(!b)return;b.disabled=true;await kdRestore(b.dataset.kres);toast('Zeile zurückgeholt');kdBinOpen(btn);});}
async function kdPut(y,r){const c=Object.assign({},r);delete c._t;delete c._d;delete c._o;c.ts=stamp();c.tsVon=ME?ME.id:'';KD[y]=Object.assign({},KD[y]||{},{[r.id]:c});kdDirty=true;
 try{await db.doc('meta/kd_'+y).update({['items.'+r.id]:c});}catch(e){try{await db.doc('meta/kd_'+y).set({items:Object.assign({},KD[y])},{merge:true});}catch(e2){fail(e2);}}}
function kdFormH(){const opt='<option value="">–</option>'+Object.entries(FN).map(([k,n])=>`<option value="${esc(k)}">${esc(k)} · ${esc(n)}</option>`).join('');
 return `<form class="edf card kdf" data-kf2="new" autocomplete="off" novalidate><b>Neuer Verkauf / Kunde</b><datalist id="kdBrandL">${allBrands().map(x=>`<option value="${esc(x.n)}">`).join('')}</datalist><div class="g4">
 <label>Datum<input name="dat" type="date" value="${iso(new Date())}"></label><label>Beleg-Nr.<input name="nr"></label><label>Marke<input name="marke" list="kdBrandL"></label><label>Modell<input name="modell"></label>
 <label>Preis<input name="preis" placeholder="z. B. 3499"></label><label>Leasing<select name="leas">${opt}</select></label><label>Kunde<input name="kunde"></label><label>Vers.<input name="vers" placeholder="z. B. E, EP, FS"></label>
 <label>Rahmen-Nr.<input name="rahmen"></label><label>Telefon<input name="tel"></label></div>
 <div class="acts"><button class="btn red" type="submit">Speichern</button><button class="btn" type="button" data-kcancel>Abbrechen</button></div></form>`;}
$('kdSearch').addEventListener('input',()=>{clearTimeout(window._kdT);window._kdT=setTimeout(rk,150);});
$('kdMore').addEventListener('click',()=>{kdYears+=3;rk();});
$('kdAdd').addEventListener('click',()=>{kdEdit='new';rk();$('kdForm').scrollIntoView({block:'start'});});
$('v-kunden').addEventListener('click',e=>{if(e.target.closest('[data-kcancel]')){kdEdit=null;rk();return;}
 const dl=e.target.closest('[data-kdel]');if(dl){const y=dl.dataset.ky,id=dl.dataset.kdel,old=KD[y]&&KD[y][id];if(!old)return;if(!dl.dataset.sure){dl.dataset.sure=1;dl.textContent='?';dl.title='Nochmal klicken = löschen';return;}
  const n=Object.assign({},KD[y]);delete n[id];KD[y]=n;kdDirty=true;rk();db.doc('meta/kd_'+y).update({['items.'+id]:null}).catch(fail);const tr=Object.assign({},old,{_y:y,_del:Date.now(),_von:ME?ME.id:''});delete tr._t;delete tr._d;delete tr._o;kdBinSet(id,tr);toast('Gelöscht – auch später über „↩ Gelöschte“ zurückholbar',()=>{kdRestore(id);toast('Wiederhergestellt');});}});
$('v-kunden').addEventListener('submit',async e=>{if(!e.target.dataset.kf2)return;e.preventDefault();const d=new FormData(e.target),y=String(new Date().getFullYear());const r={id:nid('k'),y};
 ['nr','marke','modell','preis','leas','kunde','vers','rahmen','tel'].forEach(k=>r[k]=String(d.get(k)||'').trim());const v=String(d.get('dat')||'');r.dat=/^\d{4}-\d{2}-\d{2}$/.test(v)?deDate(fromIso(v)):'';
 kdEdit=null;await kdPut(y,r);rk();toast('Gespeichert');});
$('kdGrid').addEventListener('keydown',e=>{const c=e.target.closest('[contenteditable]');if(c&&e.key==='Enter'){e.preventDefault();c.blur();}if(c&&e.key==='Escape'){c.blur();kdDirty=true;rk();}});
$('kdGrid').addEventListener('focusout',e=>{const c=e.target.closest('[contenteditable][data-kf]');if(!c)return;const y=c.dataset.ky,id=c.dataset.kid,f=c.dataset.kf,r=KD[y]&&KD[y][id];if(!r)return;let v=c.innerText.trim();
 {const km=c.closest('.km');if(km)km.classList.remove('ked');}
 const cur=f==='nr'?kdNr(r):f==='preis'?kdPreis(r.preis):(r[f]||'');if(v===String(cur))return;if(f==='nr'){const m=v.match(/^R(\d{2})-(.+)$/i);if(m&&r._d&&m[1]===String(new Date(r._d).getFullYear()).slice(2))v=m[2].trim();}if(f==='preis'&&/^[\d.]+(,\d+)?\s*€?$/.test(v))v=v.replace(/\s*€/,'').replace(/\./g,'');kdPut(y,Object.assign({},r,{[f]:v})).then(()=>{rk();});toast('Gespeichert');});
{const KG=$('kdGrid');
 const mark=()=>KG.querySelectorAll('.dropL,.dropR,.dropT,.dropB').forEach(x=>x.classList.remove('dropL','dropR','dropT','dropB'));
 const end=()=>{mark();KG.querySelectorAll('.kdrag').forEach(x=>x.classList.remove('kdrag'));kdDrag=null;};
 KG.addEventListener('dragstart',e=>{const t=e.target.closest?e.target:e.target.parentNode,hc=t.closest('.kdh[data-kc]'),gr=t.closest('.kgrip');
  if(hc)kdDrag={t:'col',k:hc.dataset.kc};else if(gr)kdDrag={t:'row',id:gr.dataset.kid,y:gr.dataset.ky};else{e.preventDefault();return;}
  (hc||gr.parentNode).classList.add('kdrag');e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain','');}catch(_){}});
 KG.addEventListener('dragover',e=>{if(!kdDrag)return;const t=e.target.closest?e.target:e.target.parentNode;mark();kdDrag.to=null;
  if(kdDrag.t==='col'){const c=t.closest('[data-kc]');if(!c||c.dataset.kc===kdDrag.k)return;e.preventDefault();const rc=c.getBoundingClientRect(),after=e.clientX>rc.left+rc.width/2;
   const hd=KG.querySelector(`.kdh[data-kc="${c.dataset.kc}"]`);if(hd)hd.classList.add(after?'dropR':'dropL');kdDrag.to=c.dataset.kc;kdDrag.after=after;}
  else{const c=t.closest('[data-kid]'),row=c&&c.closest('.row.kr');if(!row||c.dataset.kid===kdDrag.id)return;e.preventDefault();const rc=c.getBoundingClientRect(),after=e.clientY>rc.top+rc.height/2;
   row.classList.add(after?'dropB':'dropT');kdDrag.to=c.dataset.kid;kdDrag.ty=c.dataset.ky;kdDrag.after=after;}});
 KG.addEventListener('drop',e=>{if(!kdDrag||!kdDrag.to)return;e.preventDefault();const d=kdDrag;end();
  if(d.t==='col'){const o=kdCols().map(c=>c.k).filter(k=>k!==d.k);let i=o.indexOf(d.to);if(d.after)i++;o.splice(i,0,d.k);kdLay=Object.assign({},kdLay,{o});kdLaySave();rk();}
  else kdMoveRow(d);});
 KG.addEventListener('dragend',end);
 KG.addEventListener('pointerdown',e=>{const h=e.target.closest('.kres');if(!h)return;e.preventDefault();e.stopPropagation();const hd=h.parentNode,k=h.dataset.kres,x0=e.clientX,w0=hd.getBoundingClientRect().width;
  hd.draggable=false;document.body.classList.add('nresizing');
  const mv=ev=>{kdLay=Object.assign({},kdLay,{w:Object.assign({},kdLay.w,{[k]:Math.max(40,Math.round(w0+ev.clientX-x0))})});kdTpl();};
  const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);document.body.classList.remove('nresizing');hd.draggable=true;kdLaySave();};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);});
 KG.addEventListener('dblclick',e=>{const h=e.target.closest('.kres');if(!h)return;const w=Object.assign({},kdLay.w);delete w[h.dataset.kres];kdLay=Object.assign({},kdLay,{w});kdTpl();kdLaySave();});}
// Kleines Fenster unter Kopf/Zelle: Filter (Kopf antippen) bzw. Auswahl (Datum, Leasing, Vers.)
let kdPop=null;
function kdPopClose(){if(kdPop){kdPop.el.remove();kdPop=null;}}
function kdPopOpen(anchor,html,o){kdPopClose();const el=document.createElement('div');el.className='kdpop';el.innerHTML=html;document.body.appendChild(el);kdPop=Object.assign({el,t0:Date.now()},o);kdPopPos(anchor);const i=el.querySelector('input:not([type=checkbox])');if(i)i.focus();return el;}
function kdPopPos(anchor){const el=kdPop.el,rc=anchor.getBoundingClientRect(),W=el.offsetWidth,H=el.offsetHeight;el.style.left=Math.max(8,Math.min(innerWidth-W-8,rc.left))+'px';el.style.top=(rc.bottom+4+H>innerHeight-8?Math.max(8,rc.top-4-H):rc.bottom+4)+'px';}
document.addEventListener('pointerdown',e=>{if(kdPop&&!kdPop.el.contains(e.target)&&!e.target.closest('[data-kpick],.kdh[data-kc],.stb .st,.lvon'))kdPopClose();},true);
document.addEventListener('keydown',e=>{if(kdPop&&e.key==='Escape')kdPopClose();});
document.addEventListener('scroll',e=>{if(kdPop&&!kdPop.el.contains(e.target)&&Date.now()-kdPop.t0>250)kdPopClose();},true);
function kdFltOpen(hd){const k=hd.dataset.kc,c=KDC.find(x=>x.k===k);if(kdPop&&kdPop.t==='flt'&&kdPop.k===k){kdPopClose();return;}
 const cnt=new Map();kdAll().forEach(r=>{const v=kdVal(k,r);cnt.set(v,(cnt.get(v)||0)+1);});
 const vals=[...cnt].sort((a,b)=>k==='dat'||k==='nr'?0:(b[1]-a[1]||String(a[0]).localeCompare(String(b[0]),'de',{numeric:true}))),cur=new Set(kdF[k]||vals.map(x=>x[0]));
 const el=kdPopOpen(hd,`<div class="kph">${esc(c.n||'Spalte')} filtern</div><input class="kpq" placeholder="Suchen …"><div class="kpl"></div><div class="kpa"><button type="button" class="btn" data-kpall>Alle</button><button type="button" class="btn" data-kpnone>Keine</button><button type="button" class="btn red" data-kpok>Filtern</button></div>`,{t:'flt',k});
 const vis=()=>{const q=el.querySelector('.kpq').value.trim().toLowerCase();return q?vals.filter(([v])=>kdLab(k,v).toLowerCase().includes(q)):vals;};
 const draw=()=>{const vv=vis();el.querySelector('.kpl').innerHTML=vv.slice(0,500).map(([v,n])=>`<label class="kpo"><input type="checkbox" data-kv="${esc(v)}"${cur.has(v)?' checked':''}><span>${esc(kdLab(k,v))}</span><em>${n.toLocaleString('de-DE')}</em></label>`).join('')+(vv.length>500?`<p class="kpm">… ${vv.length-500} weitere – oben suchen</p>`:'')+(vv.length?'':'<p class="kpm">Nichts gefunden</p>');};
 const ok=()=>{const q=el.querySelector('.kpq').value.trim(),set=new Set((q?vis():vals).map(x=>x[0]).filter(v=>cur.has(v)));
  if(!q&&set.size===vals.length)delete kdF[k];else kdF[k]=set;kdPopClose();rk();};
 draw();el.querySelector('.kpq').addEventListener('input',draw);el.querySelector('.kpq').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();ok();}});
 el.addEventListener('change',e=>{const b=e.target.closest('[data-kv]');if(b){if(b.checked)cur.add(b.dataset.kv);else cur.delete(b.dataset.kv);}});
 el.addEventListener('click',e=>{if(e.target.closest('[data-kpall]')){vis().forEach(([v])=>cur.add(v));draw();}else if(e.target.closest('[data-kpnone]')){vis().forEach(([v])=>cur.delete(v));draw();}else if(e.target.closest('[data-kpok]'))ok();});}
function kdPickOpen(cell){const f=cell.dataset.kpick,y=cell.dataset.ky,id=cell.dataset.kid,r=KD[y]&&KD[y][id];if(!r)return;if(kdPop&&kdPop.t==='pick'&&kdPop.id===id&&kdPop.f===f){kdPopClose();return;}
 const save=v=>{kdPopClose();if(String(r[f]||'')===v)return;kdPut(y,Object.assign({},r,{[f]:v})).then(rk);toast('Gespeichert');};
 if(f==='dat'){const d=vkDate(r.dat);const el=kdPopOpen(cell,`<div class="kph">Datum</div><input type="date" class="kpd" value="${d?iso(new Date(d)):''}"><div class="kpa"><button type="button" class="btn" data-kpclr>Leeren</button><button type="button" class="btn" data-kptoday>Heute</button><button type="button" class="btn red" data-kpok>OK</button></div>`,{t:'pick',id,f});
  const inp=el.querySelector('.kpd'),put=()=>save(/^\d{4}-\d{2}-\d{2}$/.test(inp.value)?deDate(fromIso(inp.value)):r.dat||'');try{inp.showPicker();}catch(_){}
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();put();}});
  el.addEventListener('click',e=>{if(e.target.closest('[data-kpok]'))put();else if(e.target.closest('[data-kptoday]'))save(deDate(new Date()));else if(e.target.closest('[data-kpclr]'))save('');});return;}
 const base=f==='leas'?Object.assign({},FN):kdVN(),cnt={};kdAll().forEach(x=>{const v=String(x[f]||'').trim();if(v&&v.length<=4&&/^[A-ZÄÖÜa-zäöü+]+$/.test(v))cnt[v]=(cnt[v]||0)+1;});
 const opts=[...new Set([...Object.keys(base),...Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])])];
 const el=kdPopOpen(cell,`<div class="kph">${f==='leas'?'Leasing':'Versicherung'} wählen</div><input class="kpq" placeholder="Kürzel suchen oder eigenen Text + Enter"><div class="kpl kpch"></div>`,{t:'pick',id,f});
 const vis=()=>{const q=el.querySelector('.kpq').value.trim().toLowerCase();return opts.filter(v=>!q||(v+' '+(base[v]||'')).toLowerCase().includes(q));};
 const draw=()=>{el.querySelector('.kpl').innerHTML=`<button type="button" class="kpv" data-kpv=""><b>–</b><span>leer</span></button>`+vis().map(v=>`<button type="button" class="kpv${String(r[f]||'')===v?' on':''}" data-kpv="${esc(v)}"><b>${esc(v)}</b><span>${esc(base[v]||'')}</span>${kdLogo(v)?`<img class="kpl2" src="${esc(kdLogo(v))}" alt="">`:''}</button>`).join('');};
 draw();el.querySelector('.kpq').addEventListener('input',draw);
 el.querySelector('.kpq').addEventListener('keydown',e=>{if(e.key!=='Enter')return;e.preventDefault();const q=e.target.value.trim(),vv=vis();save(vv.length===1?vv[0]:(opts.find(v=>v.toLowerCase()===q.toLowerCase())||q));});
 el.addEventListener('click',e=>{const b=e.target.closest('[data-kpv]');if(b)save(b.dataset.kpv);});}
$('kdGrid').addEventListener('click',e=>{const pk=e.target.closest('[data-kpick]');if(pk){kdPickOpen(pk);return;}
 const hd=e.target.closest('.kdh[data-kc]');if(hd&&!e.target.closest('.kres')){kdFltOpen(hd);return;}
 if(e.target.closest('.kmup'))return;
 const km=e.target.closest('.km.haslg');if(km&&!e.target.closest('.kmt')){const t=km.querySelector('.kmt');km.classList.add('ked');t.focus();const s=getSelection(),rg=document.createRange();rg.selectNodeContents(t);rg.collapse(false);s.removeAllRanges();s.addRange(rg);}});
$('kdGrid').addEventListener('keydown',e=>{const pk=e.target.closest('[data-kpick]');if(pk&&(e.key==='Enter'||e.key===' ')){e.preventDefault();kdPickOpen(pk);}});
// Markenlogo aus der Kunden-Tabelle: gleiche Aufbereitung wie Einstellungen → Markenlogos (freistellen, zuschneiden, schärfen, skalieren), dort gespeichert
async function kdLogoUp(mk,file){if(!file||!/^image\//.test(file.type||''))return toast('Bitte ein Bild wählen');const b=brandOfB({marke:mk});if(!b||!b.k)return;
 toast('Logo wird aufbereitet …');try{const u=await procLogo(file);if(u.length>300000)throw new Error('Logo zu groß');if(!allBrands().some(x=>x.k===b.k)){BUSER.list=(BUSER.list||[]).concat([{k:b.k,n:b.n,w:''}]);await brSave();}await blPut(b.k,u);kdDirty=true;rk();toast('Logo „'+b.n+'“ gespeichert – auch unter Einstellungen → Markenlogos');}catch(err){fail(err);}}
$('kdGrid').addEventListener('change',e=>{const i=e.target.closest('[data-kmup]');if(i&&i.files[0])kdLogoUp(i.dataset.kmup,i.files[0]);});
$('kdGrid').addEventListener('dragover',e=>{if(kdDrag||!e.dataTransfer||![...e.dataTransfer.types].includes('Files'))return;const km=e.target.closest('.km');if(!km||!km.querySelector('[data-kmup]'))return;e.preventDefault();km.classList.add('kmdrop');});
$('kdGrid').addEventListener('dragleave',e=>{const km=e.target.closest('.km');if(km)km.classList.remove('kmdrop');});
$('kdGrid').addEventListener('drop',e=>{if(kdDrag)return;const km=e.target.closest('.km'),i=km&&km.querySelector('[data-kmup]');if(!i||!e.dataTransfer.files[0])return;e.preventDefault();km.classList.remove('kmdrop');kdLogoUp(i.dataset.kmup,e.dataTransfer.files[0]);});
$('kdYrs').addEventListener('click',e=>{const b=e.target.closest('[data-kyr]');if(!b)return;kdYr=b.dataset.kyr;ls.set('vc_kdyr',kdYr);kdPopClose();rk();const bd=document.querySelector('.kdboard');if(bd)bd.scrollTop=0;});
$('kdFx').addEventListener('click',()=>{kdF={};kdPopClose();rk();});
// Zeile verschieben: ganze Jahresliste neu durchnummerieren (o ab 1. Januar, je Zeile 1 min) – ein Schreibvorgang je Jahres-Paket
function kdMoveRow(d){const all=kdAll(),a=all.find(r=>r.id===d.id&&String(r.y)===d.y),t=all.find(r=>r.id===d.to&&String(r.y)===d.ty);if(!a||!t)return;
 const y=kdYear(a);if(kdYear(t)!==y){toast('Zeilen nur innerhalb eines Jahres verschieben');return;}
 const yl=all.filter(r=>kdYear(r)===y&&r!==a);let i=yl.indexOf(t);if(d.after)i++;yl.splice(i,0,a);
 const base=typeof y==='number'?new Date(y,0,1).getTime():0,n=yl.length,by={};
 yl.forEach((r,j)=>{const c=Object.assign({},r,{o:base+(n-j)*60000});delete c._t;delete c._d;delete c._o;if(r===a){c.ts=stamp();c.tsVon=ME?ME.id:'';}
  KD[r.y]=Object.assign({},KD[r.y],{[r.id]:c});(by[r.y]=by[r.y]||{})['items.'+r.id]=c;});
 kdDirty=true;rk();for(const yy in by)db.doc('meta/kd_'+yy).update(by[yy]).catch(fail);toast('Zeile verschoben');}
$('kdRst').addEventListener('click',()=>{kdLay=kdDef();kdLaySave();rk();toast('Spalten zurückgesetzt');});
// Alle Kunden löschen (nur Admin, mit Bestätigung). Das Google-Sheet bleibt unberührt -> über „📥 Kunden aus Sheet übernehmen“ jederzeit neu holbar.
$('kdBin').addEventListener('click',e=>{if(kdPop&&kdPop.bin){kdPopClose();return;}kdBinOpen(e.currentTarget);if(kdPop)kdPop.bin=1;});
$('kdClr').addEventListener('click',()=>{if(!ME||!ME.adm)return;const n=kdAll().length;
 dlg(`<h3>🗑 Alle Kunden löschen</h3><p class="hint">Löscht <b>alle ${n.toLocaleString('de-DE')} Einträge</b> im Reiter Kunden – für alle Nutzer. Das Google-Sheet bleibt unverändert; über „📥 Kunden aus Sheet übernehmen“ kannst du später neu übernehmen.</p><form id="kcF" autocomplete="off"><label>Zum Bestätigen <b>LÖSCHEN</b> eintippen<input id="kcIn" autocomplete="off"></label><div class="err" id="kcE"></div><div class="acts"><button class="btn" type="button" data-close>Abbrechen</button><button class="btn red" type="submit">Endgültig löschen</button></div></form>`);
 $('kcF').addEventListener('submit',async ev=>{ev.preventDefault();if($('kcIn').value.trim().toUpperCase()!=='LÖSCHEN'){$('kcE').textContent='Bitte genau LÖSCHEN eintippen.';return;}
  try{$('kcE').textContent='Löscht …';for(const y of Object.keys(KD))if(KD[y]&&Object.keys(KD[y]).length)await db.doc('meta/kd_'+y).delete();
   await db.doc('meta/import').set({kunden:false,kundenGeloescht:stamp(),kundenGeloeschtVon:ME.id},{merge:true});
   KD={};kdDirty=true;dlgClose();rk();toast('Alle Kunden gelöscht');}catch(err){$('kcE').textContent=err.message||String(err);}});});
// Einmalige Übernahme aus der Sheet-.xlsx (Reiter „Kunden“) – Daten gehen direkt in die Datenbank, nie ins Repo
$('kdImp').addEventListener('click',()=>{if(!ME.adm)return;dlg(`<h3>📥 Kunden aus dem Sheet übernehmen</h3><p class="hint">Im Google-Sheet „Abhol-Werkstattplaner“: <b>Datei → Herunterladen → Microsoft Excel (.xlsx)</b>, dann die Datei hier wählen. Übernommen wird der Reiter <b>„Kunden“</b> komplett (alle Jahre).</p><form id="kiF"><input id="kiFile" type="file" accept=".xlsx"><div class="err" id="kiE"></div><div class="acts"><button class="btn" type="button" data-close>Abbrechen</button><button class="btn red" type="submit">Übernehmen</button></div></form>`);
 $('kiF').addEventListener('submit',async ev=>{ev.preventDefault();const f=$('kiFile').files[0];if(!f){$('kiE').textContent='Bitte die .xlsx-Datei wählen.';return;}try{$('kiE').textContent='Lädt …';const n=await importKunden(f);dlgClose();toast(n.toLocaleString('de-DE')+' Kunden übernommen');}catch(err){$('kiE').textContent=err.message||String(err);}});});
function kdParse(rows){const out=[];let lastTel='';const xd=n=>{const d=new Date(Math.round((n-25569)*864e5));return deDate(new Date(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));};
 const str=v=>v==null?'':(typeof v==='number'?(Number.isInteger(v)?String(v):String(v).replace('.',',')):String(v)).trim();
 rows.forEach((r,i)=>{if(i===0)return;r=r||[];if(!r.some(v=>v!=null&&String(v).trim()!==''))return;const B=r[1];if(String(B||'').trim()==='xxx'&&!r[8])return;
  let dat='',y='x';if(B instanceof Date&&!isNaN(B)){dat=deDate(B);y=String(B.getFullYear());}else if(typeof B==='number'&&B>20000){dat=xd(B);y=dat.slice(-4);}else{dat=str(B);const c=str(r[2]).replace(/\D/g,'');if(c.length===2)y=String(+c>50?1900+ +c:2000+ +c);}
  {const yy=+y;if(y!=='x'&&(!(yy>=1995)||yy>new Date().getFullYear()+1))y='x';}
  let leas=r[7];leas=typeof leas==='number'?(leas>30000?xd(leas):(leas?str(leas):'')):str(leas);
  let tel=str(r[12]);if(tel==='"'||tel==='“'||tel==='„')tel=lastTel;else if(tel)lastTel=tel;
  const nr=str(r[0]);out.push({id:'k'+(i+1),y,dat,nr:/^-+$/.test(nr)?'':nr,marke:str(r[3]),modell:str(r[5])||str(r[4]),preis:str(r[6]),leas,kunde:str(r[8]),vers:str(r[9]),k:str(r[10]),rahmen:str(r[11]),tel});});return out;}
async function importKunden(file){await loadXLSX();const wb=XLSX.read(await file.arrayBuffer(),{cellDates:true});const ws=wb.Sheets['Kunden'];if(!ws)throw new Error('Reiter „Kunden“ nicht gefunden.');
 const rows=XLSX.utils.sheet_to_json(ws,{header:1,raw:true,defval:null});const list=kdParse(rows);if(!list.length)throw new Error('Keine Einträge gefunden.');
 const by={};list.forEach(r=>{(by[r.y]=by[r.y]||{})[r.id]=Object.assign(r,{ts:stamp(),tsVon:ME.id});});
 for(const y in by)await db.doc('meta/kd_'+y).set({items:by[y]});
 await db.doc('meta/import').set({kunden:true,kundenAm:stamp(),kundenN:list.length,kundenVon:ME.id},{merge:true});return list.length;}

/* ================= LIEFERANTEN ================= */
let sEdit=null,LOGINS=null;
const SF=[['name','Lieferant'],['kdnr','Kunden-Nr.'],['mbw','Mindestbestellwert'],['notiz','Notiz']];
let sAZ='';
// Recherchierte Mindestbestellwerte (Websuche 02.11.2026, nur Belegtes) – einmalig, nur in LEERE Felder, sobald ein Admin angemeldet ist
const SMBW_VER=1,SMBW={'böttcher':'kein Mindestbestellwert (B2B-Shop)','bbf':'kein fester MBW · unter 50 € netto +6,95 € Mindermenge · ab 50 € netto 9,90 € Fracht'};
let smbwDone=false;async function smbwSeed(){if(smbwDone||!ME||!ME.adm||!S.length)return;smbwDone=true;try{const f=db.doc('meta/seed');const d=await f.get();if(d.exists&&(d.data().smbw||0)>=SMBW_VER)return;
 for(const o of S){const v=SMBW[String(o.name||'').trim().toLowerCase()];if(v&&!String(o.mbw||'').trim()){const n=Object.assign({},o,{mbw:v});delete n.hasLogin;await save('S',n);}}await f.set({smbw:SMBW_VER},{merge:true});}catch(e){smbwDone=false;}}
// Mindestbestellwert immer in €: „500“ → „500 €“ (Text wie „frachtfrei ab 300“ bleibt unverändert)
function euro(v){const t=String(v||'').trim();const m=t.match(/^(\d{1,3}(?:[.\s]\d{3})*|\d+)(?:,(\d{1,2}))?\s*(?:€|eur|euro)?$/i);return m?m[1].replace(/\s/g,'.')+(m[2]?','+m[2].padEnd(2,'0'):'')+' €':t;}
// Lieferanten-Logo: eigenes (Feld „logo“) oder gleichnamige Marke aus ⚙ Einstellungen
function sLogo(o){if(o.logo)return o.logo;const n=String(o.name||'').trim().toLowerCase();const b=n&&allBrands().find(x=>x.n.toLowerCase()===n);return b&&(BUSER.logos||{})[b.k]||'';}
function rs(){const s1=($('sSearch').value||'').toLowerCase();
 stats('sStats',[{n:'Lieferanten',v:S.length,c:'#22D3EE',i:'truck'},{n:'mit Mindestbestellwert',v:S.filter(o=>String(o.mbw||'').trim()).length,c:'#FBBF24',i:'sum'}]);
 const letters=[...new Set(S.map(o=>String(o.name||'').trim()[0]).filter(Boolean).map(c=>c.toUpperCase()))].sort();$('sAZ').innerHTML=['Alle',...letters].map(c=>`<button type="button" class="az${(c==='Alle'?!sAZ:sAZ===c)?' on':''}" data-az="${c==='Alle'?'':esc(c)}">${esc(c)}</button>`).join('');const lg=id=>LOGINS&&LOGINS.find(x=>x.id===id);
 $('sForm').innerHTML=sEdit?sFormH(sEdit==='new'?{id:'new'}:S.find(x=>x.id===sEdit)||{id:'new'}):'';
 if(document.querySelector('#sTab [contenteditable]:focus'))return;
 const sh=(k,n)=>`<th class="ssort${sSort.k===k?' on':''}" data-ssort="${k}" title="Klick = sortieren (nochmal = umdrehen)">${n}<i>${sSort.k===k?(sSort.d>0?'▲':'▼'):'↕'}</i></th>`;
 $('sTab').innerHTML='<thead><tr><th class="thlg">Logo</th>'+sh('name','Lieferant')+sh('kdnr','Kunden-Nr.')+sh('mbw','Mindestbestellwert')+sh('notiz','Notiz')+'<th></th></tr></thead><tbody>'+
  S.filter(o=>(!s1||(o.name+' '+o.kdnr+' '+o.notiz).toLowerCase().includes(s1))&&(!sAZ||String(o.name||'').trim().toUpperCase().startsWith(sAZ))).sort(sCmp).map(o=>{const l=lg(o.id);
  const ce=(f,v,cls)=>`<td class="ce ${cls||''}" contenteditable="true" spellcheck="false" data-sid="${esc(o.id)}" data-f="${f}">${esc(v||'')}</td>`;
  const lgo=sLogo(o);return `<tr><td class="slogo${lgo?' has':''}" data-slogo="${esc(o.id)}" title="${lgo?'Klick = Logo ersetzen':'Klick = Logo hochladen (wird automatisch freigestellt + geschärft)'}">${lgo?`<img src="${lgo}" alt="">`:'<span>＋ Logo</span>'}${o.logo?`<button class="sldel" type="button" data-sldel="${esc(o.id)}" title="Logo entfernen">×</button>`:''}</td>${ce('name',o.name,'b')}${ce('kdnr',o.kdnr)}${ce('mbw',euro(o.mbw),'mbw')}${ce('notiz',o.notiz,'wrap')}<td><button class="mini" type="button" data-sedit="${esc(o.id)}" title="Formular / Löschen">✎</button></td></tr>`;}).join('')+'</tbody>';
 }
function sFormH(o){const l=LOGINS&&LOGINS.find(x=>x.id===o.id)||{};return `<form class="edf card" data-sf="${esc(o.id)}" autocomplete="off"><b>${o.id==='new'?'Neuer Lieferant':'Lieferant bearbeiten'}</b><div class="g2">${SF.map(([k,n])=>`<label>${n}<input name="${k}" value="${esc(o[k]||'')}"${k==='name'?' required':''}></label>`).join('')}
 </div>
 <div class="acts"><button class="btn red" type="submit">Speichern</button><button class="btn" type="button" data-scancel>Abbrechen</button>${o.id!=='new'?`<button class="btn del" type="button" data-sdel="${esc(o.id)}">Löschen</button>`:''}</div></form>`;}
$('v-lief').addEventListener('click',async e=>{const cp=e.target.closest('[data-cp]');if(cp){try{await navigator.clipboard.writeText(cp.dataset.cp);toast('Kopiert');}catch(_){toast('Kopieren nicht erlaubt');}arm();return;}
 const ed=e.target.closest('[data-sedit]');if(ed){sEdit=ed.dataset.sedit;rs();$('sForm').scrollIntoView({block:'start'});return;}
 if(e.target.closest('[data-scancel]')){sEdit=null;rs();return;}
 const dl=e.target.closest('[data-sdel]');if(dl){if(!dl.dataset.sure){dl.dataset.sure=1;dl.textContent='Wirklich löschen?';return;}const id=dl.dataset.sdel;S=S.filter(x=>x.id!==id);sEdit=null;rs();del('S',id);toast('Gelöscht');}});
$('v-lief').addEventListener('submit',async e=>{if(!e.target.dataset.sf)return;e.preventDefault();const f=e.target,id=f.dataset.sf,d=new FormData(f);const o=id==='new'?{id:nid('s')}:Object.assign({},S.find(x=>x.id===id));SF.forEach(([k])=>o[k]=String(d.get(k)||'').trim());o.mbw=euro(o.mbw);
 if(LOGINS){const lg={id:o.id,login:String(d.get('login')||''),pass:String(d.get('pass')||'')};const i=LOGINS.findIndex(x=>x.id===o.id);if(i<0)LOGINS.push(lg);else LOGINS[i]=lg;try{await saveLogins();}catch(e){fail(e);}}
 delete o.login;delete o.pass;sEdit=null;try{await save('S',o);const i=S.findIndex(x=>x.id===o.id);if(i<0)S.push(o);else S[i]=o;rs();toast('Gespeichert');}catch(_){}});
$('sSearch').addEventListener('input',rs);
$('sAZ').addEventListener('click',e=>{const b=e.target.closest('[data-az]');if(!b)return;sAZ=b.dataset.az;rs();});
async function setLogin(id,f,v){if(!LOGINS)return;let l=LOGINS.find(x=>x.id===id);if(!l){l={id,login:'',pass:''};LOGINS.push(l);}l[f]=v;try{await saveLogins();const o=S.find(x=>x.id===id);if(o&&!o.hasLogin){o.hasLogin=true;}toast('Gespeichert (verschlüsselt)');}catch(e){fail(e);}}
$('sTab').addEventListener('keydown',e=>{const c=e.target.closest('[contenteditable]');if(c&&e.key==='Enter'&&!e.shiftKey){e.preventDefault();c.blur();}if(c&&e.key==='Escape'){c.blur();rs();}});
$('sTab').addEventListener('focusout',async e=>{const c=e.target.closest('[contenteditable]');if(!c)return;const id=c.dataset.sid,f=c.dataset.f,v=c.textContent.trim();
 if(f==='login'||f==='pass'){const l=(LOGINS||[]).find(x=>x.id===id)||{};if(v!==(l[f]||''))await setLogin(id,f,v);setTimeout(rs,50);return;}
 const o=S.find(x=>x.id===id);const vv=f==='mbw'?euro(v):v;if(!o||vv===(o[f]||''))return;const n=Object.assign({},o,{[f]:vv});delete n.hasLogin;const i=S.indexOf(o);S[i]=Object.assign({},n,{hasLogin:o.hasLogin});try{await save('S',n);toast('Gespeichert');}catch(_){}});
// Lieferanten sortieren (1.6.0): Spaltenkopf antippen = A–Z, nochmal = Z–A; Leere immer unten; gemerkt in vc_ssort
var sSort=(()=>{const [k,d]=String(ls.get('vc_ssort','name:1')).split(':');return{k:['name','kdnr','mbw','notiz'].includes(k)?k:'name',d:d==='-1'?-1:1};})();
function sVal(o,k){const v=String(o[k]||'').trim();if(k==='mbw'){const n=parseFloat(v.replace(/[^\d,.-]/g,'').replace(/\./g,'').replace(',','.'));return isNaN(n)?'':n;}return v;}
function sCmp(a,b){const x=sVal(a,sSort.k),y=sVal(b,sSort.k);if(x===''&&y!=='')return 1;if(y===''&&x!=='')return -1;
 const r=typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y),'de',{numeric:true,sensitivity:'base'});return (r||String(a.name||'').localeCompare(String(b.name||''),'de',{sensitivity:'base'}))*(r?sSort.d:1);}
$('sTab').addEventListener('click',e=>{const sh=e.target.closest('[data-ssort]');if(sh){const k=sh.dataset.ssort;sSort=sSort.k===k?{k,d:-sSort.d}:{k,d:1};ls.set('vc_ssort',sSort.k+':'+sSort.d);rs();return;}if(e.target.closest('[data-unlock]')){pinDlg();return;}
 const sd=e.target.closest('[data-sldel]');if(sd){const o=S.find(x=>x.id===sd.dataset.sldel);if(o){const n=Object.assign({},o);delete n.logo;delete n.hasLogin;S[S.indexOf(o)]=Object.assign({},n,{hasLogin:o.hasLogin});save('S',n).then(()=>{rs();toast('Logo entfernt');}).catch(()=>{});}return;}
 const sl=e.target.closest('[data-slogo]');if(sl){const o=S.find(x=>x.id===sl.dataset.slogo);if(!o)return;const inp=document.createElement('input');inp.type='file';inp.accept='image/*';
  inp.addEventListener('change',async()=>{const f=inp.files[0];if(!f)return;toast('Logo wird aufbereitet …');try{const u=await procLogo(f,64);if(u.length>200000)throw new Error('Logo zu groß');const n=Object.assign({},o,{logo:u});delete n.hasLogin;S[S.indexOf(o)]=Object.assign({},n,{hasLogin:o.hasLogin});await save('S',n);rs();toast('Logo gespeichert – '+(o.name||''));}catch(err){toast(err.message||String(err));}});inp.click();return;}const b=e.target.closest('[data-pedit]');if(!b)return;const id=b.dataset.pedit,l=(LOGINS||[]).find(x=>x.id===id)||{};const sp=document.querySelector(`.pwm[data-sid="${id}"]`);if(!sp)return;sp.textContent=l.pass||'';sp.contentEditable='true';sp.dataset.f='pass';sp.classList.add('ed');sp.focus();arm();});
$('sAdd').addEventListener('click',()=>{sEdit='new';rs();const f=document.querySelector('[data-sf=new] input');if(f)f.focus();});

$('meImport').addEventListener('click',importDlg);
$('meFull').addEventListener('click',()=>{try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen();}catch(_){toast('Vollbild: F11 drücken');}});

/* ================= TRINKGELD ================= */
const num=s=>{const v=parseFloat(String(s||'').replace(/[^\d,.-]/g,'').replace(/\.(?=\d{3}\b)/g,'').replace(',','.'));return isNaN(v)?0:v;};
const eur=v=>v.toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
function tgDate(s){s=String(s||'').trim();let m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);if(m)return new Date(+m[1],+m[2]-1,+m[3],12);m=s.match(/^(\d{1,2})\.(\d{1,2})\.?(\d{2,4})?$/);if(!m)return null;const now=new Date();let y=m[3]?+m[3]:now.getFullYear();if(y<100)y+=2000;let d=new Date(y,+m[2]-1,+m[1],12);if(!m[3]&&d>new Date(now.getTime()+30*864e5))d=new Date(y-1,+m[2]-1,+m[1],12);return d;}
function rtg(){const now=new Date(),list=T.map(t=>Object.assign({},t,{_d:tgDate(t.datum)})).sort((a,b)=>(b._d||0)-(a._d||0));
 const sum=f=>list.filter(f).reduce((a,t)=>a+num(t.betrag),0),ym=d=>d.getFullYear()*12+d.getMonth(),cur=ym(now);
 stats('tgStats',[{n:now.toLocaleDateString('de-DE',{month:'long'})+' (dieser Monat)',v:eur(sum(t=>t._d&&ym(t._d)===cur)),c:'#34D399',i:'euro'},{n:'Letzter Monat',v:eur(sum(t=>t._d&&ym(t._d)===cur-1)),c:'#22D3EE',i:'cal'},{n:'Jahr '+now.getFullYear(),v:eur(sum(t=>t._d&&t._d.getFullYear()===now.getFullYear())),c:'#FBBF24',i:'sum'},{n:'Konto 1371 · steuerfrei',v:list.length+' Einträge',c:'#A78BFA',i:'doc'}]);
 const months=[];for(let k=5;k>=0;k--){const d=new Date(now.getFullYear(),now.getMonth()-k,1);months.push({l:d.toLocaleDateString('de-DE',{month:'short'}),v:sum(t=>t._d&&ym(t._d)===ym(d)),cur:k===0});}
 const mx=Math.max(1,...months.map(m=>m.v));
 $('tgBars').innerHTML='<h4>Letzte 6 Monate</h4><div class="bars">'+months.map(m=>`<div class="bar${m.cur?' cur':''}"><span class="bv">${m.v?eur(m.v).replace(' €',''):''}</span><i style="height:${Math.max(4,Math.round(m.v/mx*100))}%"></i><span class="bl">${esc(m.l)}</span></div>`).join('')+'</div>';
 let last='',h='';list.forEach(t=>{const k=t._d?t._d.toLocaleDateString('de-DE',{month:'long',year:'numeric'}):'Ohne Datum';if(k!==last){const tot=sum(x=>(x._d?x._d.toLocaleDateString('de-DE',{month:'long',year:'numeric'}):'Ohne Datum')===k);h+=`<tr class="grp"><td colspan="3">${esc(k)}</td><td colspan="2" class="r">${eur(tot)}</td></tr>`;last=k;}
  h+=`<tr><td>${t._d?t._d.toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'}):esc(t.datum)}</td><td><b class="amt">${eur(num(t.betrag))}</b></td><td>${esc(t.notiz)}</td><td>${av(t.von)}</td><td class="r"><button class="mini" type="button" data-tdel="${esc(t.id)}" title="löschen">×</button></td></tr>`;});
 $('tgTab').innerHTML='<thead><tr><th>Datum</th><th>Betrag</th><th>Notiz</th><th>Von</th><th></th></tr></thead><tbody>'+(h||'<tr><td colspan="5" class="empty">Noch keine Einträge</td></tr>')+'</tbody>';}
if(!$('tgDate').value)$('tgDate').value=TODAY();
$('tgForm').addEventListener('submit',async e=>{e.preventDefault();const a=$('tgAmt').value.trim();if(!num(a)){toast('Bitte Betrag eingeben');return;}const t={id:nid('t'),datum:$('tgDate').value||TODAY(),betrag:a.replace(/\s*€/,''),notiz:$('tgNote').value.trim(),von:ME.id};T.push(t);rtg();$('tgAmt').value='';$('tgNote').value='';try{await save('T',t);toast('Eingetragen: '+eur(num(a)));}catch(_){}});
$('tgTab').addEventListener('click',e=>{const d=e.target.closest('[data-tdel]');if(!d)return;const t=T.find(x=>x.id===d.dataset.tdel);T=T.filter(x=>x.id!==t.id);rtg();del('T',t.id);toast('Gelöscht',()=>{T.push(t);rtg();save('T',t).catch(()=>{});});});

/* ================= TRESOR (verschlüsselt, Schlüssel = PIN) ================= */
let lockT,KEY=null,PWGRID=null,pinFails=0,pinLockUntil=0,NOTES=null;
const enc=new TextEncoder(),dec=new TextDecoder();
const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a))),unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function deriveKey(pin,salt){const base=await crypto.subtle.importKey('raw',enc.encode(pin),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:unb64(salt),iterations:250000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
async function seal(key,obj){const iv=crypto.getRandomValues(new Uint8Array(12));const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(obj)));return{iv:b64(iv),ct:b64(ct)};}
async function open_(key,box){const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(box.iv)},key,unb64(box.ct));return JSON.parse(dec.decode(pt));}
function relock(){KEY=null;LOGINS=null;PWGRID=null;NOTES=null;rn();clearTimeout(lockT);$('vault').hidden=true;$('lock').hidden=false;$('vTab').innerHTML='';rs();}
function arm(){clearTimeout(lockT);if(KEY)lockT=setTimeout(()=>{relock();toast('Tresor automatisch gesperrt');},60000);}
['click','keydown'].forEach(ev=>document.addEventListener(ev,()=>{if(KEY)arm();}));
async function unlock(pin){if(Date.now()<pinLockUntil)throw new Error('Zu viele Versuche – bitte '+Math.ceil((pinLockUntil-Date.now())/1000)+' s warten.');if(!pin)throw new Error('PIN fehlt.');
 let chk=(await db.doc('tresor/check').get()).data();let key;
 if(!chk){if(!ME.adm)throw new Error('Die PIN muss zuerst ein Admin festlegen.');const salt=b64(crypto.getRandomValues(new Uint8Array(16)));key=await deriveKey(pin,salt);await db.doc('tresor/check').set(Object.assign({salt},await seal(key,'velocenter-ok')));}
 else{key=await deriveKey(pin,chk.salt);try{const v=await open_(key,chk);if(v!=='velocenter-ok')throw 0;}catch(_){pinFails++;if(pinFails>=5){pinFails=0;pinLockUntil=Date.now()+60000;throw new Error('5× falsch – 60 Sekunden gesperrt.');}throw new Error('PIN falsch.');}}
 pinFails=0;KEY=key;
 const lg=await db.doc('tresor/logins').get();const map=lg.exists?await open_(KEY,lg.data()):{};LOGINS=Object.entries(map).map(([id,v])=>({id,login:v.login||'',pass:v.pass||''}));
 if(ME.adm){const pw=await db.doc('tresor/pw').get();const x=pw.exists?await open_(KEY,pw.data()):[];PWGRID=Array.isArray(x)?x:(x.grid||[]);NOTES=Array.isArray(x)?[]:(x.notes||[]);showVault();rn();}
 rs();arm();}
function showVault(){$('vTab').innerHTML='<tbody>'+(PWGRID||[]).map(row=>'<tr>'+row.map((c,j)=>`<td class="${j?'wrap':''}">${esc(c)}${j&&String(c).trim()?` <button class="mini" type="button" data-cp="${esc(c)}">kopieren</button>`:''}</td>`).join('')+'</tr>').join('')+'</tbody>'||'<tbody><tr><td>Noch keine Einträge – über „⚙ Daten übernehmen“ aus dem Sheet holen.</td></tr></tbody>';$('lock').hidden=true;$('vault').hidden=false;}
async function saveLogins(){if(!KEY)return;const map={};(LOGINS||[]).forEach(l=>{if(l.login||l.pass)map[l.id]={login:l.login,pass:l.pass};});await db.doc('tresor/logins').set(await seal(KEY,map));}
$('pinForm').addEventListener('submit',async e=>{e.preventDefault();const p=$('pin').value;$('pin').value='';try{await unlock(p);$('pinErr').textContent='';}catch(err){$('pinErr').textContent=err.message;}});
$('vLock').addEventListener('click',relock);
$('vault').addEventListener('click',async e=>{const cp=e.target.closest('[data-cp]');if(cp){try{await navigator.clipboard.writeText(cp.dataset.cp);toast('Kopiert');}catch(_){toast('Kopieren nicht erlaubt');}}});
function pinDlg(after){dlg(`<h3>🔓 Tresor öffnen</h3><p class="hint">${TSET?'Tresor-PIN eingeben':'Noch keine PIN – als Admin jetzt festlegen'}</p><form id="pdF" autocomplete="off"><input id="pdP" type="password" placeholder="PIN"><div class="err" id="pdE"></div><div class="acts"><button class="btn" type="button" data-close>Abbrechen</button><button class="btn red" type="submit">Öffnen</button></div></form>`);
 $('pdF').addEventListener('submit',async e=>{e.preventDefault();try{await unlock($('pdP').value);dlgClose();toast('Tresor offen – sperrt nach 60 s');if(after)after();}catch(err){$('pdE').textContent=err.message;}});}

/* ================= NOTIZEN (🔒, nur Admins) – verschlüsselt mit der Tresor-PIN in tresor/pw {grid,notes} (Regel: nur Admins lesen/schreiben) =================
   Inhalt: [{id,t (Eintrag),z (Zusatz),c (Farbe)}]. Klartext existiert nur im geöffneten Browser. */
const NCOL=['#6EE7B7','#FDE047','#E879F9','#FB923C','#94A3B8','#60A5FA','#FDA4AF','#86EFAC','#3B82F6','#22D3EE','#EF4444','#FBBF24'];
async function saveNotes(){if(!KEY||!NOTES||!ME.adm)return;try{await db.doc('tresor/pw').set(Object.assign(await seal(KEY,{grid:PWGRID||[],notes:NOTES}),{ts:stamp(),tsVon:ME.id}));}catch(e){fail(e);}}
function rn(){const box=$('nBox');if(!box)return;const open=!!(KEY&&NOTES);$('nLock').hidden=open;box.hidden=!open;if(!open){$('nGrid').innerHTML='';return;}
 if(document.querySelector('#nGrid [contenteditable]:focus'))return;
 $('nImp').hidden=!(PWGRID&&PWGRID.length&&!NOTES.length);
 $('nGrid').style.setProperty('--nw',(+ls.get('vc_nw',0)||0)>0?ls.get('vc_nw')+'px':'minmax(320px,1.4fr)');
 $('nGrid').innerHTML='<div class="nhd">Farbe</div><div class="nhd nhr">Eintrag<span class="nres" title="Ziehen = Spaltenbreite ändern (Doppelklick = Standard)"></span></div><div class="nhd">Zusatz / Info</div><div class="nhd"></div>'+
  (NOTES.length?NOTES.map((n,i)=>{const c=n.c||NCOL[i%NCOL.length];return `<div class="nrow" style="--nc:${c}"><div class="nc ncol"><button class="ndot" type="button" data-ncol="${i}" title="Farbe wechseln"></button></div>
  <div class="nc"><div class="ne" contenteditable="true" spellcheck="false" data-ni="${i}" data-nf="t">${esc(n.t||'')}</div></div>
  <div class="nc"><div class="nz" contenteditable="true" spellcheck="false" data-ni="${i}" data-nf="z">${esc(n.z||'')}</div></div>
  <div class="nc nact"><button class="mini" type="button" data-ncp="${i}" title="Eintrag kopieren">⧉</button><button class="nx" type="button" data-ndel="${i}" title="Löschen">×</button></div></div>`;}).join('')
  :'<div class="nempty">Noch keine Notizen – „+ Notiz“ oder „Aus Passwort-Liste übernehmen“.</div>');}
// Spaltenbreite „Eintrag“ per Ziehen (pro Gerät gemerkt), Doppelklick = Standard
$('nGrid').addEventListener('pointerdown',e=>{const h=e.target.closest('.nres');if(!h)return;e.preventDefault();const g=$('nGrid'),col=h.parentElement,x0=e.clientX,w0=col.getBoundingClientRect().width;h.setPointerCapture(e.pointerId);document.body.classList.add('nresizing');
 const mv=ev=>{const w=Math.max(180,Math.min(1400,Math.round(w0+ev.clientX-x0)));g.style.setProperty('--nw',w+'px');};
 const up=ev=>{h.removeEventListener('pointermove',mv);h.removeEventListener('pointerup',up);document.body.classList.remove('nresizing');const w=Math.round(col.getBoundingClientRect().width);ls.set('vc_nw',w);arm();};
 h.addEventListener('pointermove',mv);h.addEventListener('pointerup',up);});
$('nGrid').addEventListener('dblclick',e=>{if(!e.target.closest('.nres'))return;ls.set('vc_nw',0);rn();});
$('nOpen').addEventListener('click',()=>pinDlg(()=>{show('notes');}));
$('nLockBtn').addEventListener('click',relock);
$('nAdd').addEventListener('click',()=>{if(!NOTES)return;NOTES.push({id:nid('n'),t:'',z:'',c:NCOL[NOTES.length%NCOL.length]});rn();const el=document.querySelector(`#nGrid [data-ni="${NOTES.length-1}"][data-nf=t]`);if(el)el.focus();});
$('nImp').addEventListener('click',async()=>{if(!NOTES||!PWGRID)return;PWGRID.forEach((row,i)=>{const cells=row.map(x=>String(x||'').trim()).filter(Boolean);if(!cells.length)return;NOTES.push({id:nid('n'),t:cells[0],z:cells.slice(1).join(' · '),c:NCOL[NOTES.length%NCOL.length]});});await saveNotes();rn();toast('Aus Passwort-Liste übernommen');});
$('nGrid').addEventListener('click',async e=>{if(!NOTES)return;
 const cl=e.target.closest('[data-ncol]');if(cl){const n=NOTES[+cl.dataset.ncol];const k=NCOL.indexOf(n.c);n.c=NCOL[(k+1)%NCOL.length];rn();saveNotes();return;}
 const cp=e.target.closest('[data-ncp]');if(cp){const n=NOTES[+cp.dataset.ncp];try{await navigator.clipboard.writeText([n.t,n.z].filter(Boolean).join(' – '));toast('Kopiert');}catch(_){toast('Kopieren nicht erlaubt');}return;}
 const dl=e.target.closest('[data-ndel]');if(dl){const i=+dl.dataset.ndel,old=NOTES[i];NOTES.splice(i,1);rn();saveNotes();toast('Notiz gelöscht',()=>{NOTES.splice(i,0,old);rn();saveNotes();toast('Wiederhergestellt');});}});
$('nGrid').addEventListener('keydown',e=>{const c=e.target.closest('[contenteditable]');if(c&&e.key==='Enter'&&!e.shiftKey){e.preventDefault();c.blur();}});
$('nGrid').addEventListener('focusout',e=>{const c=e.target.closest('[contenteditable][data-ni]');if(!c||!NOTES)return;const n=NOTES[+c.dataset.ni];if(!n)return;const v=c.innerText.trim();if(v===(n[c.dataset.nf]||''))return;n[c.dataset.nf]=v;saveNotes();toast('Gespeichert (verschlüsselt)');});

/* ================= DATEN AUS DEM GOOGLE-SHEET ÜBERNEHMEN (einmalig, nur Admin) ================= */
function importDlg(){if(!ME.adm){toast('Nur für Admins');return;}
 if(!KEY){pinDlg(importDlg);return;}
 dlg(`<h3>📥 Daten aus dem Sheet übernehmen</h3><p class="hint">1. Im Google-Sheet „Abhol-Werkstattplaner“: <b>Datei → Herunterladen → Microsoft Excel (.xlsx)</b>.<br>2. Die Datei hier auswählen. Planer, Verkauf, Trinkgeld und Lieferanten sind schon übernommen – jetzt kommen nur noch die <b>Passwortliste (PW)</b> und die <b>Lieferanten-Logins</b> dazu, beides mit deiner PIN verschlüsselt.</p>
 <form id="imF"><input id="imFile" type="file" accept=".xlsx"><div class="err" id="imE"></div><div class="acts"><button class="btn" type="button" data-close>Abbrechen</button><button class="btn red" type="submit">Übernehmen</button></div></form>`);
 $('imF').addEventListener('submit',async e=>{e.preventDefault();const f=$('imFile').files[0];if(!f){$('imE').textContent='Bitte die .xlsx-Datei wählen.';return;}
  try{$('imE').textContent='Lädt …';const n=await importXlsx(f);dlgClose();toast('Übernommen: '+n);}catch(err){$('imE').textContent=err.message;}});}
async function loadXLSX(){if(window.XLSX)return;await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=res;s.onerror=()=>rej(new Error('Excel-Leser konnte nicht geladen werden'));document.head.append(s);});}
async function importXlsx(file){await loadXLSX();const wb=XLSX.read(await file.arrayBuffer(),{cellDates:true});
 const done=(await db.doc('meta/import').get()).exists;
 const sh=n=>wb.Sheets[n]||wb.Sheets[n.trim()]||null;
 const rg=ws=>{const r=XLSX.utils.decode_range(ws['!ref']||'A1');r.s.r=0;r.s.c=0;return r;};const disp=ws=>ws&&ws['!ref']?XLSX.utils.sheet_to_json(ws,{header:1,raw:false,defval:'',blankrows:true,range:rg(ws)}):[],raw=ws=>ws&&ws['!ref']?XLSX.utils.sheet_to_json(ws,{header:1,raw:true,defval:'',blankrows:true,range:rg(ws)}):[];
 const ops=[];const put=(c,o)=>{if(!done)ops.push([c,o]);};const ts=stamp();let cP=0,cV=0,cT=0,cS=0;
 const pn=sh('Planer NEU');if(pn){const D=disp(pn),Rw=raw(pn);const map={2:'int',4:'anf',6:'t1',8:'t2',9:'wa',10:'ws',11:'best',12:'not'};
  for(let i=0;i<D.length;i++){const d=(Rw[i]||[])[0];if(!(d instanceof Date))continue;{const ds=iso(new Date(d.getFullYear(),d.getMonth(),d.getDate(),12));
    for(const ci in map){const lines=String(D[i][ci]||'').split('\n').map(x=>x.trim()).filter(Boolean);const tms=ci==6?String(D[i][5]||'').split('\n'):ci==8?String(D[i][7]||'').split('\n'):[];
     lines.forEach((l,li)=>{put('planer',{id:nid('p'),datum:ds,spalte:map[ci],text:l,zeit:(tms[li]||'').trim(),erledigt:'',von:'',erledigtVon:''});cP++;});}
    String(D[i][3]||'').split('\n').map(x=>x.trim()).filter(Boolean).forEach(l=>{put('planer',{id:nid('p'),datum:ds,spalte:'not',text:'Nico: '+l,zeit:'',erledigt:'',von:'',erledigtVon:''});cP++;});}
   const v=D[i]||[],rv=Rw[i]||[];if(String(v[15]||'').trim()||String(v[16]||'').trim()){const tf=x=>x===true||String(x).toUpperCase()==='TRUE';
    put('verkauf',{id:nid('v'),dat:v[14],modell:v[15],name:v[16],lt:v[17],antrag:v[18],firma:v[19],ok:v[20],lende:v[21],montieren:v[22],notiz:v[23],m:tf(rv[24])?'1':'',mVon:'',mAm:'',b:(tf(rv[25])||String(v[20]||'').trim())?'1':'',bVon:'',bAm:'',a:tf(rv[26])?'1':'',aVon:'',aAm:'',verk:''});cV++;}}}
 const tg=sh('TG');if(tg){disp(tg).slice(1).forEach(r=>{const d=String(r[0]||'').trim(),b=String(r[1]||'').trim(),n=String(r[2]||'').trim();if(!d||!b||/gesamt/i.test(n))return;put('trinkgeld',{id:nid('t'),datum:d,betrag:b.replace(/\s*€/,''),notiz:n,von:''});cT++;});}
 const lf=sh('Lieferanten');const logins={};if(lf){disp(lf).slice(2).forEach(r=>{if(!String(r[0]||'').trim())return;const id=nid('s');const extra=r.filter((x,j)=>[0,1,3,5,7].indexOf(j)<0&&String(x).trim()).join(' · ');
   const ex=done?S.find(x=>String(x.name).trim().toLowerCase()===String(r[0]).trim().toLowerCase()):null;const lid=ex?ex.id:id;put('lieferanten',{id,name:r[0],kdnr:r[1],mbw:r[3],notiz:extra});if(String(r[5]||'').trim()||String(r[7]||'').trim())logins[lid]={login:r[5],pass:r[7]};cS++;});}
 const bo=sh('Bestell+OP ')||sh('Bestell+OP');if(bo){const D=disp(bo);const note=String((D[0]||[])[0]||'').trim();if(note)put('info',{id:'bnotiz',wert:note});
  D.slice(2).forEach(r=>{if(!String(r[1]||'').trim()&&!String(r[3]||'').trim())return;put('bestell',{id:nid('b'),datum:r[0],kunde:r[1],telefon:r[2],artikel:r[3],bezahlt:String(r[4]).trim()?'ja':'',status:String(r[6]).trim()?'bestellt':'offen',lieferant:r[7],lieferzeit:r[8],notiz:'',von:ME.id});});}
 const pw=sh('PW');const grid=pw?disp(pw).filter(r=>r.some(c=>String(c).trim())).map(r=>{let k=r.length;while(k>0&&!String(r[k-1]).trim())k--;return r.slice(0,k).map(String);}):null;
 for(let i=0;i<ops.length;i+=400){const b=db.batch();ops.slice(i,i+400).forEach(([c,o])=>b.set(db.collection(c).doc(String(o.id)),Object.assign(clean(o),{ts,tsVon:ME.id})));await b.commit();}
 await db.doc('tresor/logins').set(await seal(KEY,logins));if(grid)await db.doc('tresor/pw').set(await seal(KEY,{grid,notes:NOTES||[]}));
 if(done){await db.doc('meta/import').set({tresor:true,tresorAm:ts},{merge:true});LOGINS=Object.entries(logins).map(([id,v])=>({id,login:v.login,pass:v.pass}));if(grid){PWGRID=grid;showVault();}rs();return 'Passwortliste und '+Object.keys(logins).length+' Lieferanten-Logins (verschlüsselt)';}
 await db.doc('meta/import').set({am:ts,von:ME.id,tresor:true});try{await db.doc('meta/rollover').delete();}catch(_){}await rollover();LOGINS=Object.entries(logins).map(([id,v])=>({id,login:v.login,pass:v.pass}));if(grid){PWGRID=grid;showVault();}
 return cP+' Planer-Einträge, '+cV+' Räder, '+cT+' Trinkgeld, '+cS+' Lieferanten'+(grid?', Passwortliste':'');}

/* ================= START ================= */
auth.onAuthStateChanged(u=>{if(u&&u.email&&u.email.endsWith(DOMAIN)){const id=u.email.slice(0,-DOMAIN.length);if(U(id).n){start({id,n:U(id).n,adm:ADMINS.includes(id)});return;}}ME=null;showLogin();});
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{});}

