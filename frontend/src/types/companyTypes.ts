import type { User } from "./userTypes"

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
  contact?: User
}
