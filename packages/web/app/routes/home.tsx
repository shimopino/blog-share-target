import type { Route } from "./+types/home";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";

export function meta() {
  return [
    { title: "ブログ記事要約アプリ" },
    { name: "description", content: "技術的気付きの瞬間を逃さないブログ記事要約アプリ" },
  ];
}

export default function Home() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ブログ記事要約アプリ</h1>
          <ThemeToggle />
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 text-gray-800 dark:text-gray-200">
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
        
        <div className={`${
          isDarkMode 
            ? 'bg-blue-900 border-blue-800 text-blue-100' 
            : 'bg-blue-50 border-blue-200 text-blue-800'
        } border rounded-lg p-6`}>
          <h2 className="text-lg font-semibold mb-3">
            インストール方法
          </h2>
          <p className="mb-4">
            このアプリはPWA（Progressive Web App）として動作します。
            iOSまたはAndroidデバイスでは、ブラウザのメニューから「ホーム画面に追加」を選択してインストールできます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className={`flex-1 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-200' 
                : 'bg-white border-gray-200 text-gray-800'
            } p-4 rounded border`}>
              <h3 className="font-medium mb-2">iOS (Safari)</h3>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>共有ボタンをタップ</li>
                <li>「ホーム画面に追加」を選択</li>
                <li>「追加」をタップ</li>
              </ol>
            </div>
            <div className={`flex-1 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-200' 
                : 'bg-white border-gray-200 text-gray-800'
            } p-4 rounded border`}>
              <h3 className="font-medium mb-2">Android (Chrome)</h3>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>メニューを開く</li>
                <li>「アプリをインストール」または「ホーム画面に追加」を選択</li>
                <li>「インストール」をタップ</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2023 ブログ記事要約アプリ</p>
        </div>
      </div>
    </div>
  );
}
