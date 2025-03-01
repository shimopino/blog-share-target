export function meta() {
  return [
    { title: "404 - ページが見つかりません", status: 404 },
  ];
}

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">404</h1>
      <h2 className="text-2xl font-semibold mb-4">ページが見つかりません</h2>
      
      <p className="mb-8 text-gray-600">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      
      <a
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
      >
        ホームページに戻る
      </a>
    </div>
  );
} 