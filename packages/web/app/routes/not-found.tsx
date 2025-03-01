import { useTheme } from "../contexts/ThemeContext";

export function meta() {
  return [
    { title: "404 - ページが見つかりません", status: 404 },
  ];
}

export default function NotFound() {
  const { isDarkMode } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">ページが見つかりません</h2>
        
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          ホームページに戻る
        </a>
      </div>
    </div>
  );
} 