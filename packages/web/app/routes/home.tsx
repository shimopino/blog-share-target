import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "ブログ記事要約アプリ" },
    { name: "description", content: "技術的気付きの瞬間を逃さないブログ記事要約アプリ" },
  ];
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ブログ記事要約アプリ</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">使い方</h2>
        
        <ol className="list-decimal list-inside space-y-3">
          <li className="pl-2">
            <span className="font-medium">記事を共有:</span> 
            <p className="mt-1 ml-6">
              ブラウザで技術記事を閲覧中に、ブラウザの共有ボタンをタップし、このアプリを選択します。
            </p>
          </li>
          <li className="pl-2">
            <span className="font-medium">データの確認:</span> 
            <p className="mt-1 ml-6">
              共有された記事のURL、タイトル、テキストが表示されます。
            </p>
          </li>
          <li className="pl-2">
            <span className="font-medium">記事の要約（近日実装予定）:</span> 
            <p className="mt-1 ml-6">
              共有された記事の内容をAIを使って自動的に要約します。
            </p>
          </li>
        </ol>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">
          インストール方法
        </h2>
        <p className="mb-4">
          このアプリはPWA（Progressive Web App）として動作します。
          iOSまたはAndroidデバイスでは、ブラウザのメニューから「ホーム画面に追加」を選択してインストールできます。
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-white p-4 rounded border border-gray-200">
            <h3 className="font-medium mb-2">iOS (Safari)</h3>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>共有ボタンをタップ</li>
              <li>「ホーム画面に追加」を選択</li>
              <li>「追加」をタップ</li>
            </ol>
          </div>
          <div className="flex-1 bg-white p-4 rounded border border-gray-200">
            <h3 className="font-medium mb-2">Android (Chrome)</h3>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>メニューを開く</li>
              <li>「アプリをインストール」または「ホーム画面に追加」を選択</li>
              <li>「インストール」をタップ</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
