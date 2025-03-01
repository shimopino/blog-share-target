import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";

export function meta() {
  return [
    { title: "共有中... - 記事要約アプリ" },
    { name: "description", content: "コンテンツを共有しています" },
  ];
}

// 共有ルートの検証関数
function isValidShareRequest() {
  // Web Share Targetからの要求かどうかを検証
  // 1. URLパラメータに 'url' が存在する場合 (GET方式)
  // 2. Refererヘッダーが存在する場合（外部サイトからのリダイレクト）
  // 3. 特定のセッションフラグがあるか確認 (Service Workerが設定)
  
  const hasUrlParam = new URLSearchParams(window.location.search).has('url');
  const hasReferer = document.referrer && document.referrer !== window.location.href;
  const hasShareFlag = sessionStorage.getItem('shareInProgress') === 'true';
  
  return hasUrlParam || hasReferer || hasShareFlag;
}

export default function ShareTarget() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(5); // 5秒カウントダウン
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // 直接アクセスかどうかチェック
    if (!isValidShareRequest()) {
      console.log("Invalid access to share target route");
      navigate("/not-found", { replace: true });
      return;
    }

    // 共有処理を続行するフラグを設定
    sessionStorage.setItem('shareInProgress', 'true');
    
    // URLパラメータからの取得（GET方式のフォールバック）
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get("title") || "";
    const text = urlParams.get("text") || "";
    const url = urlParams.get("url") || "";
    
    if (url) {
      // APIを直接呼び出す
      fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, title, text }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("API request failed");
          }
          setLoading(false);
          setSuccess(true);
          // 成功したら自動的にウィンドウを閉じるタイマーを開始
          startCloseTimer();
        })
        .catch(err => {
          setError(`データの共有に失敗しました: ${err.message}`);
          setLoading(false);
          // エラー時も自動的に閉じるタイマーを開始
          startCloseTimer();
        });
    } else {
      // フォームデータを処理（POSTリクエストのフォールバック）
      const form = formRef.current;
      if (form?.elements.namedItem("url")) {
        // URLがある場合にフォームデータを送信
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          
          const formData = new FormData(form);
          const formUrl = formData.get("url") as string;
          const formTitle = formData.get("title") as string;
          const formText = formData.get("text") as string;
          
          if (formUrl) {
            try {
              const response = await fetch("/api/share", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  url: formUrl,
                  title: formTitle || "",
                  text: formText || "",
                }),
              });
              
              if (!response.ok) {
                throw new Error("API request failed");
              }
              
              setLoading(false);
              setSuccess(true);
              // 成功したら自動的にウィンドウを閉じるタイマーを開始
              startCloseTimer();
            } catch (err) {
              setError(`データの共有に失敗しました: ${(err as Error).message}`);
              setLoading(false);
              // エラー時も自動的に閉じるタイマーを開始
              startCloseTimer();
            }
          } else {
            setError("URLが指定されていません。");
            setLoading(false);
            // エラー時も自動的に閉じるタイマーを開始
            startCloseTimer();
          }
        });
        
        // フォームを自動送信
        form.dispatchEvent(new Event("submit"));
      } else {
        setError("URLが見つかりませんでした。");
        setLoading(false);
        // エラー時も自動的に閉じるタイマーを開始
        startCloseTimer();
      }
    }

    // クリーンアップ時にフラグを削除
    return () => {
      if (!error) {
        // エラーがなければフラグをそのまま保持（成功ページで使用）
        console.log("Keeping share flag for success page");
      }
    };
  }, [navigate, error]);

  // 自動的にウィンドウを閉じるタイマーを開始する関数
  const startCloseTimer = () => {
    const countdownInterval = setInterval(() => {
      setSecondsRemaining((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(countdownInterval);
          window.close(); // ウィンドウを閉じる
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    // コンポーネントのアンマウント時にタイマーをクリア
    return () => clearInterval(countdownInterval);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-auto">
        <div className="text-center">
          {loading ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
              </div>
              <h2 className="text-xl font-bold">記事を保存しています...</h2>
            </>
          ) : error ? (
            <>
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-red-500">エラーが発生しました</h2>
              <p className="mt-2 text-gray-600">{error}</p>
            </>
          ) : success ? (
            <>
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h2 className="text-xl font-bold text-green-500">保存しました</h2>
              <p className="mt-2 text-gray-600">記事が正常に保存されました</p>
            </>
          ) : null}
          
          <div className="mt-6 py-2 px-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-500">
              このウィンドウは{secondsRemaining}秒後に自動的に閉じます
            </p>
          </div>
          
          <button 
            onClick={() => window.close()} 
            className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full"
            type="button"
          >
            今すぐ閉じる
          </button>
        </div>
      </div>
      
      {/* Service Workerが処理できない場合のフォールバックフォーム */}
      <form ref={formRef} method="POST" action="/share-target" className="hidden">
        <input type="text" name="title" id="title" />
        <input type="text" name="text" id="text" />
        <input type="url" name="url" id="url" required />
        <button type="submit">共有</button>
      </form>
    </div>
  );
} 