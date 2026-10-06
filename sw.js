/* Kytara – trenér: service worker (offline aplikace)
   - HTML: nejdřív síť (4 s), při výpadku kopie z mezipaměti
   - ikony, manifest, knihovna Supabase z CDN: z mezipaměti + obnova na pozadí
   - API Supabase (*.supabase.co) se nikdy neukládá do mezipaměti (data a přihlášení jdou vždy přes síť)
   Změň VERSION jen když přidáš/odebereš soubory v SHELL; samotné index.html se aktualizuje samo. */
const VERSION = 'v2';
const CACHE = 'kytara-' + VERSION;
const SHELL = ['./', './index.html', './manifest.webmanifest',
  './icon-32.png?v=2', './icon-180.png?v=2', './icon-192.png?v=2', './icon-512.png?v=2', './icon-maskable-512.png?v=2',
  ...['A','E','F','Dm','Hm','C7','D7','E7','G7','A7','H7','Cmaj7','Fmaj7','Asus2','Dsus4'].map(n => `./${n}.wav`)];
const CDN = ['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.allSettled([
      ...SHELL.map(u => c.add(new Request(u, { cache: 'reload' }))),
      ...CDN.map(u => c.add(new Request(u, { mode: 'cors' })))
    ]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('kytara-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

function fetchTimeout(req, ms) {
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('timeout')), ms);
    fetch(req).then(r => { clearTimeout(t); res(r); }, err => { clearTimeout(t); rej(err); });
  });
}

async function networkFirst(req) {
  const c = await caches.open(CACHE);
  try {
    const r = await fetchTimeout(req, 4000);
    if (r && r.ok) await c.put('./index.html', r.clone());   // jedna sdílená kopie pro './' i '/index.html'
    return r;
  } catch (err) {
    return (await c.match('./index.html')) || (await c.match('./')) || Response.error();
  }
}

async function staleWhileRevalidate(e) {
  const req = e.request, c = await caches.open(CACHE);
  const hit = await c.match(req);
  const net = fetch(req).then(r => {
    if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone());
    return r;
  }).catch(() => null);
  e.waitUntil(net);
  if (hit) return hit;
  const r = await net;
  return r || (await c.match(req, { ignoreSearch: true })) || Response.error();
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.endsWith('.supabase.co') || url.hostname.endsWith('.supabase.in')) return;
  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate' || req.destination === 'document') e.respondWith(networkFirst(req));
    else e.respondWith(staleWhileRevalidate(e));
  } else if (url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(staleWhileRevalidate(e));
  }
});
