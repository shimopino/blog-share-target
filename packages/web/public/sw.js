const CACHE_NAME = "blog-share-target-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
];

// Service Workerのインストール時にキャッシュを設定
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ネットワークリクエストの制御
self.addEventListener("fetch", (event) => {
  // Web Share Targetからのリクエストの場合
  if (event.request.url.includes("/share-target")) {
    // ここでは単純にリクエストを通過させる
    // 実際のアプリでは、共有データを処理するロジックを追加する
    return;
  }

  // 通常のリクエストの場合はキャッシュファーストで対応
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// 古いキャッシュの削除
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
