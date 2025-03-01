import type { Config } from "@react-router/dev/config";

export default {
	// Config options...
	// Server-side render by default, to enable SPA mode set this to `false`
	ssr: false,
	// 静的ファイルのパス設定
	basename: "/",
} satisfies Config;
