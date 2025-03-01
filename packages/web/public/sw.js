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
  // /sharedへのナビゲーションリクエストは最優先で処理（共有機能用）
  if (
    event.request.mode === "navigate" &&
    event.request.url.includes("/shared")
  ) {
    console.log("[SW] 共有リクエスト検出:", event.request.url);

    // URLパラメータの解析とデバッグ
    const url = new URL(event.request.url);
    const params = url.searchParams;
    console.log("[SW] 検出されたパラメータ:", {
      url: params.get("url"),
      title: params.get("title"),
      text: params.get("text"),
      raw: url.search,
    });

    // セッションフラグを設定するためにクライアントに通知
    event.waitUntil(
      (async () => {
        const allClients = await self.clients.matchAll({
          includeUncontrolled: true,
        });

        for (const client of allClients) {
          client.postMessage({
            type: "SET_SHARE_FLAG",
            value: true,
            debugInfo: {
              url: params.get("url"),
              title: params.get("title"),
              text: params.get("text"),
              raw: url.search,
            },
          });
        }
      })()
    );

    // 通常のフェッチを続行
    event.respondWith(
      fetch(event.request).catch(() => {
        // オフラインの場合はindex.htmlを返す
        return caches.match("/index.html");
      })
    );
    return;
  }

  // その他のナビゲーションリクエストの場合（HTML）
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        // オフラインの場合はindex.htmlを返す（SPAルーティング用）
        return caches.match("/index.html");
      })
    );
    return;
  }

  // 通常のリクエストの場合はキャッシュファーストで対応
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      // コピーを作成（リクエストは一度しか使えないため）
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          // 無効なレスポンスの場合はそのまま返す
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // レスポンスのコピーを作成（レスポンスも一度しか使えないため）
          const responseToCache = response.clone();

          // キャッシュに保存
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // オフラインでアセットがキャッシュにない場合
          // 画像の場合は代替画像を返す、またはそのままエラーにする
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
            return caches.match("/icon-192x192.png");
          }
          // その他のリソースはエラーのまま
          return new Response("Network error occurred", {
            status: 503,
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          });
        });
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

  // 即座にクライアントコントロールを取得
  event.waitUntil(self.clients.claim());
});

// メッセージイベントのリスナー追加（skipWaiting用）
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
