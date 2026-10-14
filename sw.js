// Calcolatore Viaggio – versione da viaggio: tutto in cache per l'uso offline
const V='cv-202610141842';
const CORE=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
const EXTRA=["https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js", "https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js", "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js", "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", "https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js", "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js", "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);await c.addAll(CORE);
 await Promise.all(EXTRA.map(u=>fetch(u,{mode:'cors'}).then(r=>r.ok?c.put(u,r):fetch(u,{mode:'no-cors'}).then(r2=>c.put(u,r2))).catch(()=>{})));self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 // pagina: prima la rete (per avere gli aggiornamenti), se non c'è usa la copia salvata
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html')));return}
 e.respondWith(caches.match(r,{ignoreSearch:u.origin===location.origin}).then(hit=>hit||fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')&&(u.origin===location.origin||/jsdelivr|cdnjs|unpkg|fonts\.(googleapis|gstatic)/.test(u.host))){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})))});
