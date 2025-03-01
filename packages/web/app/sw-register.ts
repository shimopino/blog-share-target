// Service Workerの登録を行う関数
export function registerServiceWorker() {
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			// baseURLを取得してService Workerのスコープを設定
			const baseUrl =
				document.head.querySelector("base")?.getAttribute("href") || "/";

			navigator.serviceWorker
				.register("/sw.js", { scope: baseUrl })
				.then((registration) => {
					console.log(
						"ServiceWorker registration successful with scope: ",
						registration.scope,
					);
				})
				.catch((err) => {
					console.error("ServiceWorker registration failed: ", err);
				});
		});
	}
}
