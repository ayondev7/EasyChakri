import type { JWT } from "next-auth/jwt";

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface AuthResponse {
	user: {
		id: string;
		email: string;
		name: string;
		role: string;
		image?: string;
	};
	accessToken: string;
	refreshToken: string;
}

export function processTokens(token: JWT, authResponse: AuthResponse): JWT {
	return {
		...token,
		accessToken: authResponse.accessToken,
		refreshToken: authResponse.refreshToken,
		user: {
			...authResponse.user,
			role: authResponse.user.role as "SEEKER" | "RECRUITER",
		},
	};
}