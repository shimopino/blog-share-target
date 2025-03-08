import { useEffect } from "react";
import { ShareDialog } from "../components/share/ShareDialog";
import { useShareState } from "../hooks/useShareState";

export function meta() {
  return [
    { title: "共有中... - 記事要約アプリ" },
    { name: "description", content: "コンテンツを共有しています" },
  ];
}

export default function Shared() {
  const { 
    loading, 
    error, 
    success, 
    debugInfo,
    secondsRemaining,
    timerPaused,
    handleShare,
    toggleTimer,
    closeWithRedirect 
  } = useShareState();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const url = urlParams.get("url");
    const title = urlParams.get("title") || "";
    const text = urlParams.get("text") || "";
    
    handleShare({ url, title, text });
  }, [handleShare]);

  return (
    <ShareDialog
      loading={loading}
      error={error}
      success={success}
      debugInfo={debugInfo}
      secondsRemaining={secondsRemaining}
      timerPaused={timerPaused}
      onToggleTimer={toggleTimer}
      onClose={closeWithRedirect}
    />
  );
} 