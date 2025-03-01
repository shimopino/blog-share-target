import { useEffect } from "react";
import { useNavigate } from "react-router";

export function meta() {
  return [
    { title: "共有成功 - 記事要約アプリ" },
    { name: "description", content: "コンテンツの共有が完了しました" },
  ];
}

export default function ShareSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // 共有処理中のフラグがあるか確認
    const hasShareFlag = sessionStorage.getItem('shareInProgress') === 'true';
    
    if (!hasShareFlag) {
      console.log("Invalid access to share success route");
      navigate("/not-found", { replace: true });
      return;
    }

    // 3秒後に自動的に閉じる/戻る
    const timer = setTimeout(() => {
      // 共有完了フラグをクリア
      sessionStorage.removeItem('shareInProgress');
      
      if (window.history.length > 1) {
        window.history.back(); // 前のページに戻る
      } else {
        window.close(); // タブ/ウィンドウを閉じる
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="successIconTitle"
            role="img"
          >
            <title id="successIconTitle">成功チェックマーク</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-3">
            共有が完了しました
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              記事が正常に保存されました。このウィンドウは自動的に閉じられます。
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              今すぐ戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 