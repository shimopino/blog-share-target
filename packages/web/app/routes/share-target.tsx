import { useLoaderData, useSearchParams } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export function meta() {
  return [
    { title: "共有されたコンテンツ - 記事要約アプリ" },
    { name: "description", content: "共有されたコンテンツを表示" },
  ];
}

interface ShareData {
  title: string;
  text: string;
  url: string;
}

export function loader({
  request,
}: LoaderFunctionArgs): ShareData {
  // URLからクエリパラメータを取得
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "";
  const text = url.searchParams.get("text") || "";
  const sharedUrl = url.searchParams.get("url") || "";

  return {
    title,
    text,
    url: sharedUrl,
  };
}

export default function ShareTarget() {
  // useLoaderDataにジェネリック型を指定
  const { title, text, url } = useLoaderData() as ShareData;
  const [searchParams] = useSearchParams();

  // URLクエリパラメータから直接読み取ることもできます
  const titleParam = searchParams.get("title");
  const textParam = searchParams.get("text");
  const urlParam = searchParams.get("url");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">共有されたコンテンツ</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">受信したデータ</h2>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-700">タイトル:</h3>
          <p className="mt-1">{title || "（タイトルなし）"}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-700">テキスト:</h3>
          <p className="mt-1">{text || "（テキストなし）"}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-700">URL:</h3>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-blue-600 hover:underline break-all"
            >
              {url}
            </a>
          ) : (
            <p className="mt-1">（URLなし）</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          ホームに戻る
        </a>
      </div>
    </div>
  );
} 