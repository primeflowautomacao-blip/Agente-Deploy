const CACHE = 'agente-deploy-v1';
const ASSETS = [
  '/agente-deploy/',
  '/agente-deploy/index.html',
  '/agente-deploy/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Para chamadas de API (Groq, GitHub, Render) vai sempre à rede
  const url = e.request.url;
  if (url.includes('groq.com') || url.includes('github.com') || url.includes('render.com')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
