import { useTheme } from "../../contexts/ThemeContext";

interface ShareDialogProps {
  loading: boolean;
  error: string | null;
  success: boolean;
  debugInfo: Record<string, unknown>;
  secondsRemaining: number;
  timerPaused: boolean;
  onToggleTimer: () => void;
  onClose: () => void;
}

export function ShareDialog({
  loading,
  error,
  success,
  debugInfo,
  secondsRemaining,
  timerPaused,
  onToggleTimer,
  onClose,
}: ShareDialogProps) {
  const { isDarkMode } = useTheme();

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
            {!loading && (
              <button 
                onClick={onToggleTimer} 
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
            
            <button 
              onClick={onClose} 
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