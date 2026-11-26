const prefix = "coachplan:";
const version = "ed41b499998e2be10d";
const cacheName = prefix + self.registration.scope + ':' + version;
const index = new URL('index.html', self.registration.scope).href;
const files = new Set(["assets/esm-BbUiTydc.js","assets/esm-D9I33614.js","assets/esm-gxFKBhy6.js","assets/field-DcHkLftc.js","assets/index-B6Rrtfpc.css","assets/index-GILkZO2Z.js","assets/web-BGozhCFE.js","assets/web-BPC2HFVR.js","assets/web-Ca-HKhu6.js","assets/zip-DO_bDop3.js","icon-192.png","icon-512.png","icon.svg","index.html","manifest.webmanifest"].map(path => new URL(path, self.registration.scope).href));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll([...files].map(url => new Request(url, { cache: 'reload' })))));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith(prefix + self.registration.scope + ':') && key !== cacheName)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  const url = new URL(request.url);
  const root = new URL(self.registration.scope);
  const home = request.mode === 'navigate' && (url.pathname === root.pathname || url.pathname === new URL(index).pathname);
  if (!home && !files.has(request.url)) return;
  event.respondWith(caches.open(cacheName).then(async cache => {
    // The local build files are invariant, even when a module request adds an Origin header.
    const response = await cache.match(home ? index : request.url, { ignoreVary: true });
    return response || fetch(request);
  }));
});
