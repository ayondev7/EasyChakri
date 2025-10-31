export * from './userTypes'
export * from './companyTypes'
export * from './jobTypes'
export * from './applicationTypes'
export * from './interviewTypes'
export * from './notificationTypes'

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: import('./userTypes').UserRole
    }
    accessToken?: string
    refreshToken?: string
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    role: import('./userTypes').UserRole
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
      role: import('./userTypes').UserRole
      image?: string
    }
    accessToken?: string
    refreshToken?: string
  }
}
