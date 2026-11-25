/* いしけん！ ホーム画面アプリ用。ページや文字は新しいものを優先し、画像は一度見たものを保存してすばやく出す */
const VER = "ishiken-v1";
const SHELL = ["./", "index.html", "style.css", "app.js", "data/chars.js", "data/manga.js", "data/mosaic.js", "data/images.js", "img/icon/icon-192.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("ishiken-") && k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isImg = /\.(webp|png|jpg|jpeg|gif|svg)$/i.test(url.pathname);
  if (isImg) {
    e.respondWith(caches.open(VER + "-img").then(c => c.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }))));
    return;
  }
  e.respondWith(fetch(req).then(res => { if (res.ok) caches.open(VER).then(c => c.put(req, res.clone())); return res; }).catch(() => caches.match(req).then(hit => hit || caches.match("index.html"))));
});
