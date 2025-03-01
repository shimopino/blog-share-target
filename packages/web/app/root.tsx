import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect } from "react";

import type { Route } from "./+types/root";
import "./app.css";
import { registerServiceWorker } from "./sw-register";
import { ThemeProvider } from "./contexts/ThemeContext";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "manifest",
    href: "/manifest.json",
  },
  {
    rel: "apple-touch-icon",
    href: "/icon-192x192.png",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
    
    // Service Workerからのメッセージを処理
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SET_SHARE_FLAG') {
        sessionStorage.setItem('shareInProgress', 'true');
      }
      
      // その他のService Workerメッセージ処理をここに追加
    };
    
    // Service Workerの更新チェック
    const checkForServiceWorkerUpdate = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.waiting) {
          // 新しいServiceWorkerが待機中の場合
          console.log('New Service Worker available, updating...');
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // ページを再読み込みして新しいServiceWorkerを有効化
          window.location.reload();
        }
      }
    };
    
    // ServiceWorkerの更新イベント処理
    const handleServiceWorkerUpdate = () => {
      window.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed, reloading page');
        window.location.reload();
      });
    };
    
    // イベントリスナーを設定
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    checkForServiceWorkerUpdate();
    handleServiceWorkerUpdate();
    
    // クリーンアップ
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, []);
  
  return (
    <html lang="ja" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0f172a" />
        <base href="/" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
