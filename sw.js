const prefix = "coachplan:";
const version = "6d3b6a1b984a5ef992";
const cacheName = prefix + self.registration.scope + ':' + version;
const index = new URL('index.html', self.registration.scope).href;
const files = new Set(["assets/esm-BOBvcXOj.js","assets/esm-Bc-2l_on.js","assets/esm-DBz92gRL.js","assets/field-YWL_XjI4.js","assets/index-B3OuKJ07.css","assets/index-C9jZi2A4.js","assets/web-Bx4Vks6v.js","assets/web-INvIbfV8.js","assets/web-QKFs8qYu.js","assets/zip-BegWk9xZ.js","icon-192.png","icon-512.png","icon.svg","index.html","manifest.webmanifest"].map(path => new URL(path, self.registration.scope).href));
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
