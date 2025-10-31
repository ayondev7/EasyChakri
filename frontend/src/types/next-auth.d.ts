import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: "SEEKER" | "RECRUITER"
      image?: string | null
    }
    accessToken?: string
    refreshToken?: string
  }

  interface User {
    id: string
    email: string
    name: string
    role: "SEEKER" | "RECRUITER"
    image?: string
    accessToken?: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string
      email: string
      name: string
      role: "SEEKER" | "RECRUITER"
      image?: string
    }
    accessToken?: string
    refreshToken?: string
  }
}
