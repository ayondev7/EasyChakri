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

	const role = (authResponse.user.role as string).toUpperCase() as "SEEKER" | "RECRUITER";
	
	return {
		...token,
		accessToken: authResponse.accessToken,
		refreshToken: authResponse.refreshToken,
		user: {
			id: authResponse.user.id,
			email: authResponse.user.email,
			name: authResponse.user.name,
			role: role,
			image: authResponse.user.image,
		},
	};
}