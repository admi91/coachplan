const prefix = "coachplan:";
const version = "2762c44163774677da";
const cacheName = prefix + self.registration.scope + ':' + version;
const index = new URL('index.html', self.registration.scope).href;
const files = new Set(["assets/esm-BA_ON7vN.js","assets/esm-Bp6Mjg0G.js","assets/esm-DF9iIdcc.js","assets/field-DNiW3uOR.js","assets/index-BhTCcNCT.css","assets/index-xX9bszZw.js","assets/web-Blb133g5.js","assets/web-Bnd9SmQ4.js","assets/web-D0jzWuuI.js","assets/zip-Uk-izHdF.js","icon-192.png","icon-512.png","icon.svg","index.html","manifest.webmanifest"].map(path => new URL(path, self.registration.scope).href));
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
