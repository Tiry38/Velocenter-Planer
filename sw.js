// Nur Netz – immer die neueste Version, keine alte Kopie aus dem Cache
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{});
