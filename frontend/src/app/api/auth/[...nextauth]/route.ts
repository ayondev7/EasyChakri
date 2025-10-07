 import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import AUTH_ROUTES from "@/routes/authRoutes";
import { processTokens, type AuthResponse } from "@/utils/auth";

const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: "credentials-signup",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
				name: { label: "Name", type: "text" },
				role: { label: "Role", type: "text" },
				companyName: { label: "Company Name", type: "text" },
				companyDescription: { label: "Company Description", type: "text" },
				companyWebsite: { label: "Company Website", type: "text" },
				companyIndustry: { label: "Company Industry", type: "text" },
				companySize: { label: "Company Size", type: "text" },
				companyLocation: { label: "Company Location", type: "text" },
				companyLogo: { label: "Company Logo", type: "text" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password || !credentials?.name || !credentials?.role) {
					return null;
				}

				try {
					const body: any = {
						email: credentials.email,
						password: credentials.password,
						name: credentials.name,
						role: credentials.role,
					};

					if (credentials.role === "RECRUITER") {
						body.companyName = credentials.companyName;
						body.companyDescription = credentials.companyDescription;
						body.companyWebsite = credentials.companyWebsite;
						body.companyIndustry = credentials.companyIndustry;
						body.companySize = credentials.companySize;
						body.companyLocation = credentials.companyLocation;
						body.companyLogo = credentials.companyLogo;
					}

					const response = await fetch(AUTH_ROUTES.credential.signup, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(body),
					});

					if (!response.ok) {
						const errorData = await response.json().catch(() => ({}));
						console.error("Signup error:", errorData);
						return null;
					}

					const data: { data: AuthResponse } = await response.json();
					return {
						id: data.data.user.id,
						email: data.data.user.email,
						name: data.data.user.name,
						image: data.data.user.image,
						role: data.data.user.role as "seeker" | "recruiter",
						accessToken: data.data.accessToken,
						refreshToken: data.data.refreshToken,
					};
				} catch (error) {
					console.error("Signup error:", error);
					return null;
				}
			},
		}),
		CredentialsProvider({
			name: "credentials-signin",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					const response = await fetch(AUTH_ROUTES.credential.signin, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							email: credentials.email,
							password: credentials.password,
						}),
					});

					if (!response.ok) {
						const errorData = await response.json().catch(() => ({}));
						console.error("Signin error:", errorData);
						return null;
					}

					const data: { data: AuthResponse } = await response.json();
					return {
						id: data.data.user.id,
						email: data.data.user.email,
						name: data.data.user.name,
						image: data.data.user.image,
						role: data.data.user.role as "seeker" | "recruiter",
						accessToken: data.data.accessToken,
						refreshToken: data.data.refreshToken,
					};
				} catch (error) {
					console.error("Signin error:", error);
					return null;
				}
			},
		}),
	],
	pages: {
		signIn: "/auth/signin",
	},
	callbacks: {
		async jwt({ token, user, account }) {
			if (account?.provider === "google" && user) {
				try {
					const response = await fetch(AUTH_ROUTES.google.signin, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							email: user.email,
							name: user.name,
							image: user.image,
						}),
					});

					if (response.ok) {
						const responseData: { data: AuthResponse } = await response.json();
						token = processTokens(token, responseData.data);
					}
				} catch (error) {
					console.error("Google auth error:", error);
				}
			} else if (user && (account?.provider === "credentials-signup" || account?.provider === "credentials-signin")) {
				token = processTokens(token, {
					user: {
						id: user.id,
						email: user.email!,
						name: user.name!,
						role: user.role!,
						image: user.image || undefined,
					},
					accessToken: user.accessToken!,
					refreshToken: user.refreshToken!,
				});
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub!;
				session.user.role = token.user?.role!;
			}
			session.accessToken = token.accessToken!;
			session.refreshToken = token.refreshToken!;
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };