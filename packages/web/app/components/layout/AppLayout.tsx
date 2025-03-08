import { ThemeToggle } from "../ThemeToggle";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
} 