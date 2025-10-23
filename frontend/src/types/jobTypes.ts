import type { Company } from "./companyTypes"

export interface Job {
  id: string
  title: string
  company: Company
  location: string
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE"
  experience: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits?: string[]
  skills: string[]
  postedDate?: Date
  createdAt: Date
  updatedAt?: Date
  deadline?: Date | null
  views: number
  featured?: boolean
  recruiterId: string
  companyId: string
  slug?: string
  category: string
  isRemote?: boolean
  _count?: {
    applications: number
  }
}

export interface SavedJob {
  id: string
  userId: string
  jobId: string
  job: Job
  savedAt: Date
}

