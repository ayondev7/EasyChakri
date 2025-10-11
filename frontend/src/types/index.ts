export type UserRole = "seeker" | "recruiter"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
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

export interface Company {
  id: string
  name: string
  logo: string
  description: string
  industry: string
  size: string
  location: string
  website?: string
  founded?: string
  jobCount: number
  rating?: number
}

export interface Job {
  id: string
  title: string
  company: Company
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote"
  experience: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits?: string[]
  skills: string[]
  postedDate: Date
  createdAt?: Date
  updatedAt?: Date
  deadline?: Date
  applicants: number
  views: number
  featured?: boolean
  recruiterId: string
  companyId: string
  slug?: string
  category?: string
  isRemote?: boolean
  _count?: {
    applications: number
  }
}

export interface Application {
  id: string
  jobId: string
  job: Job
  seekerId: string
  status: "pending" | "reviewed" | "shortlisted" | "interview_scheduled" | "interview_completed" | "rejected" | "accepted"
  appliedDate: Date
  coverLetter?: string
}

export interface Interview {
  id: string
  applicationId: string
  application: Application
  interviewerId: string
  interviewer: User
  seekerId: string
  seeker: User
  type: "online" | "physical"
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "rescheduled"
  scheduledDate: Date
  duration: number // in minutes
  location?: string // for physical interviews
  meetingLink?: string // for online interviews
  meetingPlatform?: "zoom" | "google_meet" | "teams" | "skype" | "other" // for online interviews
  notes?: string
  feedback?: string
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "application" | "job" | "interview" | "system"
  read: boolean
  createdAt: Date
  link?: string
}

export interface JobCategory {
  id: string
  name: string
  icon: string
  jobCount: number
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: UserRole
    }
    accessToken: string
    refreshToken: string
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    role: UserRole
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
      role: UserRole
      image?: string
    }
    accessToken?: string
    refreshToken?: string
  }
}
