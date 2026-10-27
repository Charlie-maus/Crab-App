/* Crab App service worker. Bump VERSION (and APP_VERSION in index.html) for every release. */
const VERSION='v2';
const CACHE='crab-app-'+VERSION;
const FONTS='crab-app-fonts';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];

/* Install: fetch every file fresh (GitHub Pages caches for 10 min), then take over straight away. */
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>
    fetch(f,{cache:'reload'}).then(r=>{if(!r.ok)throw new Error('Could not fetch '+f);return c.put(f,r)})
  ))).then(()=>self.skipWaiting()));
});
/* Activate: remove older app caches (never the font cache or other apps' caches). */
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('crab-app-v')&&k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin===location.origin){
    /* app files: cache first so it works with no signal; pages fall back to index.html */
    e.respondWith(caches.open(CACHE).then(c=>c.match(req,{ignoreSearch:true}).then(hit=>hit||
      (req.mode==='navigate'?c.match('./index.html'):null)).then(hit=>hit||fetch(req))));
    return;
  }
  if(url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'){
    /* fonts: use the stored copy, refresh it in the background when online */
    e.respondWith(caches.open(FONTS).then(c=>c.match(req).then(hit=>{
      const net=fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(req,r.clone());return r}).catch(()=>hit);
      return hit||net;})));
  }
});
