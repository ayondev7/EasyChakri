export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "APPLICATION" | "JOB" | "INTERVIEW" | "SYSTEM"
  isRead: boolean
  createdAt: Date
  link?: string
}

export interface JobCategory {
  id: string
  name: string
  icon: string
  jobCount: number
}
