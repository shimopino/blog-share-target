import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { shareContent } from "../services/share";

interface ShareParams {
	url?: string | null;
	title?: string | null;
	text?: string | null;
}

export function useShareState() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [secondsRemaining, setSecondsRemaining] = useState(5);
	const [timerPaused, setTimerPaused] = useState(false);
	const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});
	const navigate = useNavigate();
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const closeWithRedirect = useCallback(async () => {
		await navigate("/");
		setTimeout(() => {
			window.close();
		}, 100);
	}, [navigate]);

	const startCloseTimer = useCallback(() => {
		timerRef.current = setInterval(() => {
			setSecondsRemaining((prev) => {
				if (prev <= 1) {
					if (timerRef.current) clearInterval(timerRef.current);
					closeWithRedirect();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}, [closeWithRedirect]);

	const toggleTimer = useCallback(() => {
		if (timerPaused) {
			startCloseTimer();
		} else {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		}
		setTimerPaused(!timerPaused);
	}, [timerPaused, startCloseTimer]);

	const handleShare = useCallback(
		async (params: ShareParams) => {
			const debug = {
				url: params.url,
				title: params.title,
				text: params.text,
				rawQueryString: window.location.search,
				userAgent: navigator.userAgent,
			};

			setDebugInfo(debug);

			const targetUrl = params.url || params.text;

			if (!targetUrl) {
				setError("URLが指定されていません。共有時にはURLが必要です。");
				setLoading(false);
				return;
			}

			try {
				await shareContent({
					url: params.url || undefined,
					title: params.title || undefined,
					text: params.text || undefined,
				});
				setSuccess(true);
				setLoading(false);
				startCloseTimer();
			} catch (err) {
				setError(err instanceof Error ? err.message : "共有処理に失敗しました");
				setLoading(false);
				setTimerPaused(true);
			}
		},
		[startCloseTimer],
	);

	return {
		loading,
		error,
		success,
		debugInfo,
		secondsRemaining,
		timerPaused,
		handleShare,
		toggleTimer,
		closeWithRedirect,
	};
}
