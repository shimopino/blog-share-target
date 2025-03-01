import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // マウント後に表示を有効化（SSRとクライアントでのレンダリング不一致を防止）
  useEffect(() => {
    setMounted(true);
  }, []);

  // マウントされるまでは何も表示しない
  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md ${
          theme === "light" 
            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100" 
            : "text-gray-500 dark:text-gray-400"
        }`}
        aria-label="ライトモードに切り替え"
        type="button"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-5 h-5"
          aria-hidden="true"
        >
          <title>太陽</title>
          <path 
            d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" 
          />
        </svg>
      </button>
      
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md ${
          theme === "dark" 
            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100" 
            : "text-gray-500 dark:text-gray-400"
        }`}
        aria-label="ダークモードに切り替え"
        type="button"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-5 h-5"
          aria-hidden="true"
        >
          <title>月</title>
          <path 
            fillRule="evenodd" 
            d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
      
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-md ${
          theme === "system" 
            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100" 
            : "text-gray-500 dark:text-gray-400"
        }`}
        aria-label="システム設定に合わせる"
        type="button"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-5 h-5"
          aria-hidden="true"
        >
          <title>システム</title>
          <path 
            fillRule="evenodd" 
            d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v9.75c0 .83.67 1.5 1.5 1.5h13.5c.83 0 1.5-.67 1.5-1.5V5.25c0-.83-.67-1.5-1.5-1.5H5.25c-.83 0-1.5.67-1.5 1.5z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
    </div>
  );
} 