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
