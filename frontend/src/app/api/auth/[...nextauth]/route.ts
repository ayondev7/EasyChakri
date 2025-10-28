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
			id: "credentials-signup",
			name: "credentials-signup",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
				name: { label: "Name", type: "text" },
				role: { label: "Role", type: "text" },
				phone: { label: "Phone", type: "text" },
				dateOfBirth: { label: "Date of Birth", type: "text" },
				image: { label: "Image", type: "text" },
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
					throw new Error("Missing required fields");
				}

				try {
					const body: any = {
						email: credentials.email,
						password: credentials.password,
						name: credentials.name,
						role: credentials.role,
					};

					if (credentials.role === "SEEKER") {
						if (credentials.phone) body.phone = credentials.phone;
						if (credentials.dateOfBirth) body.dateOfBirth = credentials.dateOfBirth;
						if (credentials.image) body.image = credentials.image;
					}

					if (credentials.role === "RECRUITER") {
						body.companyName = credentials.companyName;
						body.companyDescription = credentials.companyDescription;
						body.companyWebsite = credentials.companyWebsite;
						body.companyIndustry = credentials.companyIndustry;
						body.companySize = credentials.companySize;
						body.companyLocation = credentials.companyLocation;
						if (credentials.companyLogo) body.companyLogo = credentials.companyLogo;
						if (credentials.image) body.image = credentials.image;
					}

					const response = await fetch(AUTH_ROUTES.credential.signup, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(body),
					});

					if (!response.ok) {
						const errorData = await response.json().catch(() => ({ message: "Failed to create account" }));
						const errorMessage = errorData.message || "Failed to create account";
						throw new Error(errorMessage);
					}

					const data: { data: AuthResponse } = await response.json();
					return {
						id: data.data.user.id,
						email: data.data.user.email,
						name: data.data.user.name,
						image: data.data.user.image,
						role: data.data.user.role as "SEEKER" | "RECRUITER",
						accessToken: data.data.accessToken,
						refreshToken: data.data.refreshToken,
					};
				} catch (error) {
					console.error("Signup error:", error);
					throw error;
				}
			},
		}),
		CredentialsProvider({
			id: "credentials-signin",
			name: "credentials-signin",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email and password are required");
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
						const errorData = await response.json().catch(() => ({ message: "Invalid email or password" }));
						const errorMessage = errorData.message || "Invalid email or password";
						throw new Error(errorMessage);
					}

					const data: { data: AuthResponse } = await response.json();
					return {
						id: data.data.user.id,
						email: data.data.user.email,
						name: data.data.user.name,
						image: data.data.user.image,
						role: data.data.user.role as "SEEKER" | "RECRUITER",
						accessToken: data.data.accessToken,
						refreshToken: data.data.refreshToken,
					};
				} catch (error) {
					console.error("Signin error:", error);
					throw error;
				}
			},
		}),
	],
	pages: {
		signIn: "/auth/signin",
	},
	callbacks: {
		async jwt({ token, user, account, trigger }) {
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

			if (trigger === "update") {
				const accessToken = token.accessToken as string;
				const refreshToken = token.refreshToken as string;

				if (accessToken && refreshToken) {
					try {
						const response = await fetch(AUTH_ROUTES.refresh, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								refreshToken: refreshToken,
							}),
						});

						if (response.ok) {
							const data: { data: { accessToken: string } } = await response.json();
							token.accessToken = data.data.accessToken;
						}
					} catch (error) {
						return { ...token, error: "RefreshAccessTokenError" };
					}
				}
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
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };