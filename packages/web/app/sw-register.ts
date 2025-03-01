// Service Workerの登録を行う関数
export function registerServiceWorker() {
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			navigator.serviceWorker
				.register("/sw.js")
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
