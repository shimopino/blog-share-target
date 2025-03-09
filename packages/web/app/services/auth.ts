export interface AuthConfig {
	authority: string;
	client_id: string;
	redirect_uri: string;
	response_type: string;
	scope: string;
}

export interface AuthUser {
	id: string;
	email: string;
	givenName: string;
	familyName: string;
	picture?: string;
}

// SSR環境でも動作するように修正
const getOrigin = () => {
	if (typeof window === "undefined") {
		return process.env.FRONTEND_URL || "http://localhost:3000";
	}
	return window.location.origin;
};

export const createAuthConfig = (config: {
	userPoolId: string;
	userPoolWebClientId: string;
	region: string;
}): AuthConfig => {
	const origin = getOrigin();
	const domainPrefix = `blog-share-${process.env.STAGE || "dev"}`;

	return {
		authority: `https://${domainPrefix}.auth.${config.region}.amazoncognito.com`,
		client_id: config.userPoolWebClientId,
		redirect_uri: origin,
		response_type: "code",
		scope: "email openid profile",
	};
};

export const createSignOutRedirect = (config: {
	userPoolId: string;
	userPoolWebClientId: string;
	region: string;
}) => {
	const origin = getOrigin();
	const cognitoDomain = `https://${config.userPoolId.split("_")[0]}.auth.${config.region}.amazoncognito.com`;
	return () => {
		if (typeof window !== "undefined") {
			window.location.href = `${cognitoDomain}/logout?client_id=${config.userPoolWebClientId}&logout_uri=${encodeURIComponent(origin)}`;
		}
	};
};
