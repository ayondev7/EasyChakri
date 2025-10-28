export type UserRole = "SEEKER" | "RECRUITER"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  image?: string
  phone?: string
  location?: string
  bio?: string
  skills?: string[]
  experience?: string
  education?: string
  resume?: string
  companyName?: string
  companyLogo?: string
  createdAt: Date
}
