import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../contexts/ThemeContext";

export function meta() {
  return [
    { title: "共有中... - 記事要約アプリ" },
    { name: "description", content: "コンテンツを共有しています" },
  ];
}

interface DebugInfo {
  url?: string;
  title?: string;
  text?: string;
  rawQueryString?: string;
  userAgent?: string;
  apiResponse?: unknown;
  apiError?: string;
  errorTime?: string;
}

export default function Shared() {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [timerPaused, setTimerPaused] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // デバッグ情報収集（常に実行）
    const collectDebugInfo = () => {
      const params = new URLSearchParams(window.location.search);
      const debug = {
        url: params.get("url") || undefined,
        title: params.get("title") || undefined,
        text: params.get("text") || undefined,
        rawQueryString: window.location.search,
        userAgent: navigator.userAgent,
      };
      
      setDebugInfo(debug);
      console.log("デバッグ情報:", debug);
      return debug;
    };

    // URLパラメータから情報を取得 - Androidの共有に対応する改善
    const urlParams = new URLSearchParams(window.location.search);
    collectDebugInfo();
    
    // URLの取得方法を複数試みる
    const url = urlParams.get("url");
    const title = urlParams.get("title") || "";
    const text = urlParams.get("text") || "";
    
    alert(JSON.stringify({ url, title, text }));
    
    // textパラメータにURLが含まれている場合がある（Android共有の特性）
    const targetUrl = url || text;
    
    if (!targetUrl) {
      setError("URLが指定されていません。共有時にはURLが必要です。");
      setLoading(false);
      return;
    }

    // 簡素化: パラメータのみをデバッグ表示
    console.log("共有パラメータ:", { url, title, text });

    // APIリクエスト
    fetch("/api/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, title, text }),
    })
      .then(response => {
        // ステータスコードのみでチェック (JSON解析なし)
        if (response.status === 200) {
          setSuccess(true);
        } else {
          throw new Error(`APIステータスコード: ${response.status}`);
        }
        setLoading(false);
        startCloseTimer();
      })
      .catch(err => {
        setError(`共有処理に失敗しました: ${err.message}`);
        setLoading(false);
        // 開始時点でタイマーを一時停止にしてエラーを確認しやすく
        setTimerPaused(true);
      });
  }, []);

  // ページを閉じる前にホームに遷移する関数
  const closeWithRedirect = async () => {
    // まずホーム画面に遷移
    await navigate("/");
    
    // 少し遅延させてからウィンドウを閉じる試行
    setTimeout(() => {
      window.close();
    }, 100);
  };

  // タイマー開始処理
  const startCloseTimer = () => {
    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          closeWithRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // タイマー停止と再開のトグル
  const toggleTimer = () => {
    if (timerPaused) {
      // 再開
      startCloseTimer();
    } else {
      // 一時停止
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    setTimerPaused(!timerPaused);
  };

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isDarkMode ? 'bg-gray-900/70' : 'bg-black/30'} backdrop-blur-sm`}>
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-2xl p-6 max-w-sm w-full mx-auto`}>
        <div className="text-center">
          {loading ? (
            <>
              <div className="flex justify-center mb-4">
                <div className={`animate-spin rounded-full h-10 w-10 border-b-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`} />
              </div>
              <h2 className="text-xl font-bold">記事を保存しています...</h2>
            </>
          ) : error ? (
            <>
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>エラーが発生しました</h2>
              <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
              
              {/* デバッグ情報表示（開発用） */}
              <div className={`mt-4 p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg text-left text-xs overflow-auto max-h-32`}>
                <p className="font-bold mb-1">デバッグ情報:</p>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            </>
          ) : success ? (
            <>
              <div className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} text-5xl mb-4`}>✓</div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}>保存しました</h2>
              <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>記事が正常に保存されました</p>
            </>
          ) : null}
          
          <div className={`mt-6 py-2 px-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
            {!timerPaused ? (
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                このウィンドウは{secondsRemaining}秒後に自動的に閉じます
              </p>
            ) : (
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                自動クローズは停止しています
              </p>
            )}
          </div>
          
          <div className="mt-4 flex flex-col gap-2">
            {/* タイマー制御ボタン */}
            {!loading && (
              <button 
                onClick={toggleTimer} 
                className={`py-2 px-4 rounded-lg transition-colors w-full ${
                  timerPaused
                    ? isDarkMode 
                      ? "bg-blue-800 text-blue-200 hover:bg-blue-700" 
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                type="button"
              >
                {timerPaused ? "自動クローズを再開" : "自動クローズを停止"}
              </button>
            )}
            
            {/* ウィンドウを閉じるボタン */}
            <button 
              onClick={closeWithRedirect} 
              className={`py-2 px-4 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition-colors w-full`}
              type="button"
            >
              今すぐ閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 