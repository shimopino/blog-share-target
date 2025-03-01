import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";

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

export default function ShareTarget() {
  const [searchParams] = useSearchParams();
  const [shareData, setShareData] = useState<ShareData>({
    title: "",
    text: "",
    url: "",
  });

  useEffect(() => {
    // URLクエリパラメータから共有データを取得
    const title = searchParams.get("title") || "";
    const text = searchParams.get("text") || "";
    const url = searchParams.get("url") || "";

    setShareData({
      title,
      text,
      url,
    });
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">共有されたコンテンツ</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">受信したデータ</h2>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-700">タイトル:</h3>
          <p className="mt-1">{shareData.title || "（タイトルなし）"}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-700">テキスト:</h3>
          <p className="mt-1">{shareData.text || "（テキストなし）"}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-700">URL:</h3>
          {shareData.url ? (
            <a
              href={shareData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-blue-600 hover:underline break-all"
            >
              {shareData.url}
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