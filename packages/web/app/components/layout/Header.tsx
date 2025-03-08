import { ThemeToggle } from "../ThemeToggle";

export function Header() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        ブログ記事要約アプリ
      </h1>
      <ThemeToggle />
    </div>
  );
} 