import type { Company } from "./companyTypes"

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
