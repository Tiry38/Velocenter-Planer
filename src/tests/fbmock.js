/* Test-Nachbau von Firebase Auth + Firestore (compat) – Zustand in localStorage, Live-Abgleich zwischen Tabs per BroadcastChannel */
(function(){
/* 1.10.67: Sicherungs-Erinnerung in den Tests unterdrücken (eigener Test löscht vc_bksn) */
try{if(!window.__bkTest){const d=new Date();localStorage.setItem('vc_bksn',JSON.stringify(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')));}}catch(_){}
const K='__fbm';const bc=new BroadcastChannel('__fbm');
const ld=()=>{try{return JSON.parse(localStorage.getItem(K))||{users:{},docs:{}};}catch(_){return{users:{},docs:{}};}};
let ST=ld();const sv=()=>{localStorage.setItem(K,JSON.stringify(ST));bc.postMessage(1);fire();};
bc.onmessage=()=>{ST=ld();fire();};
const listeners=new Set();function fire(){setTimeout(()=>listeners.forEach(l=>l()),0);}
const dmerge=(a,b)=>{for(const k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])&&a[k]&&typeof a[k]==='object'&&!Array.isArray(a[k]))dmerge(a[k],b[k]);else a[k]=b[k];}return a;};
const err=(code,msg)=>{const e=new Error(msg||code);e.code=code;return e;};
// ---- Auth
let cur=null;const authL=[];const sess=sessionStorage.getItem('__fbm_u');if(sess)cur=mkUser(sess);
function mkUser(email){return{email,reauthenticateWithCredential:async c=>{if(ST.users[email]!==c.pw)throw err('auth/wrong-password');},updatePassword:async p=>{ST.users[email]=p;sv();}};}
function setCur(e){cur=e?mkUser(e):null;if(e)sessionStorage.setItem('__fbm_u',e);else sessionStorage.removeItem('__fbm_u');authL.forEach(f=>f(cur));}
const auth={get currentUser(){return cur;},
 async createUserWithEmailAndPassword(e,p){await tick();ST=ld();if(ST.users[e])throw err('auth/email-already-in-use');if(p.length<6)throw err('auth/weak-password');ST.users[e]=p;sv();setCur(e);},
 async signInWithEmailAndPassword(e,p){await tick();ST=ld();if(ST.users[e]!==p)throw err('auth/invalid-credential','Firebase: invalid credential');setCur(e);},
 async signOut(){setCur(null);},onAuthStateChanged(f){authL.push(f);setTimeout(()=>f(cur),0);}};
const tick=()=>new Promise(r=>setTimeout(r,20));
// ---- Firestore
const rules=(path,write)=>{const m=cur?cur.email:'';const team=/^(kevin|stefan|martina|sascha|rene)@velocenter-cockpit\.app$/.test(m),adm=/^(kevin|stefan|martina)@/.test(m)&&team;
 if(path==='meta/users')return write?team:true;if(path==='tresor/pw')return adm;if(path==='tresor/check')return write?adm:team;return team;};
const deny=p=>err('permission-denied','Missing or insufficient permissions ('+p+')');
function snapDoc(path){const d=ST.docs[path];return{id:path.split('/').pop(),exists:!!d,data:()=>d?JSON.parse(JSON.stringify(d)):undefined,ref:docRef(path)};}
function docRef(path){return{path,
 async get(){await tick();ST=ld();if(!rules(path))throw deny(path);return snapDoc(path);},
 async set(o,opt){await tick();ST=ld();if(!rules(path,1))throw deny(path);ST.docs[path]=opt&&opt.merge?dmerge(JSON.parse(JSON.stringify(ST.docs[path]||{})),JSON.parse(JSON.stringify(o))):JSON.parse(JSON.stringify(o));sv();},
 async update(o){await tick();ST=ld();if(!rules(path,1))throw deny(path);if(!ST.docs[path]){const e=new Error('No document to update: '+path);e.code='not-found';throw e;}const d=JSON.parse(JSON.stringify(ST.docs[path]));for(const k in o){const ks=k.split('.');let t=d;for(let i=0;i<ks.length-1;i++){t[ks[i]]=t[ks[i]]&&typeof t[ks[i]]==='object'?t[ks[i]]:{};t=t[ks[i]];}t[ks[ks.length-1]]=o[k];}ST.docs[path]=d;sv();},
 async delete(){await tick();ST=ld();if(!rules(path,1))throw deny(path);delete ST.docs[path];sv();},
 onSnapshot(cb,ecb){const f=()=>{if(!rules(path)){ecb&&ecb(deny(path));return;}cb(snapDoc(path));};listeners.add(f);f();return()=>listeners.delete(f);}};}
function query(col,conds){const run=()=>Object.keys(ST.docs).filter(p=>p.startsWith(col+'/')&&p.split('/').length===2).filter(p=>conds.every(([f,op,v])=>{const x=ST.docs[p][f];return op==='>='?x>=v:op==='<'?x<v:op==='=='?x===v:true;})).map(snapDoc);
 return{where:(f,op,v)=>query(col,conds.concat([[f,op,v]])),doc:id=>docRef(col+'/'+id),
  async get(){await tick();ST=ld();if(!rules(col+'/x'))throw deny(col);const docs=run();return{docs,forEach:f=>docs.forEach(f),size:docs.length};},
  onSnapshot(a,b,c){const cb=typeof a==='function'?a:b,ecb=typeof a==='function'?b:c;let prev={};const f=()=>{if(!rules(col+'/x')){ecb&&ecb(deny(col));return;}const docs=run();const ch=docs.filter(d=>JSON.stringify(d.data())!==prev[d.id]).map(d=>({type:'modified',doc:d}));prev={};docs.forEach(d=>prev[d.id]=JSON.stringify(d.data()));cb({docs,docChanges:()=>ch,metadata:{fromCache:false,hasPendingWrites:false}});};listeners.add(f);f();return()=>listeners.delete(f);}};}
const db={enablePersistence:()=>Promise.resolve(),collection:c=>query(c,[]),doc:p=>docRef(p),
 async runTransaction(fn){const ops=[];const tr={get:r=>r.get(),set:(r,o,opt)=>{ops.push(()=>r.set(o,opt));},update:(r,o)=>{ops.push(()=>r.update(o));}};const res=await fn(tr);for(const o of ops)await o();return res;},
 batch(){const ops=[];return{set:(r,o)=>ops.push(()=>r.set(o)),update:(r,o)=>ops.push(()=>r.update(o)),delete:r=>ops.push(()=>r.delete()),async commit(){for(const o of ops)await o();}};}};
const authFn=()=>auth;authFn.EmailAuthProvider={credential:(e,pw)=>({e,pw})};
const secA={async createUserWithEmailAndPassword(e,p){await tick();ST=ld();if(ST.users[e])throw err('auth/email-already-in-use');if(p.length<6)throw err('auth/weak-password');ST.users[e]=p;sv();},async signOut(){}};
window.firebase={apps:[],initializeApp(c,n){if(!n)return;const a={name:n,auth:()=>secA};this.apps.push(a);return a;},auth:authFn,firestore:()=>db};
window.__fbmState=()=>ld();
})();
