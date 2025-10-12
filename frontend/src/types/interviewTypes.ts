import type { Application } from "./applicationTypes"
import type { User } from "./userTypes"

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
