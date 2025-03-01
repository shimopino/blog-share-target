import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // localStorageからテーマ設定を取得、なければsystemをデフォルトとする
  const [theme, setTheme] = useState<Theme>(() => {
    // SSRでの初期化時には'system'をデフォルト値とする
    if (typeof window === "undefined") return "system";
    
    return (localStorage.getItem("theme") as Theme) || "system";
  });
  
  // 現在のダークモード状態を管理するstate
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // テーマを変更する関数
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };
  
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === "undefined") return;
    
    // システムの設定を検出
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    // 現在のテーマに基づいてダークモード状態を設定
    const updateTheme = () => {
      const isSystemDark = darkModeMediaQuery.matches;
      const isDark = theme === "system" ? isSystemDark : theme === "dark";
      
      setIsDarkMode(isDark);
      
      // HTMLのdata-theme属性を設定
      document.documentElement.dataset.theme = isDark ? "dark" : "light";
      
      // class名を設定（Tailwind CSSのダークモード用）
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    
    // 初期設定を適用
    updateTheme();
    
    // システム設定の変更を監視
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        updateTheme();
      }
    };
    
    darkModeMediaQuery.addEventListener("change", handleSystemThemeChange);
    
    // クリーンアップ
    return () => {
      darkModeMediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, setTheme: handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
}

// カスタムフック
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
} 