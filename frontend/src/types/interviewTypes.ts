import type { Application } from "./applicationTypes"
import type { User } from "./userTypes"

export type InterviewType = "ONLINE" | "PHYSICAL"

export type InterviewStatus = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED"

export type InterviewPlatform = "ZOOM" | "GOOGLE_MEET" | "TEAMS" | "SKYPE" | "OTHER"

export interface Interview {
  id: string
  applicationId: string
  application: Application
  interviewerId: string
  interviewer: User
  seekerId: string
  seeker: User
  type: InterviewType
  status: InterviewStatus
  scheduledAt: Date
  duration: number
  location?: string
  meetingLink?: string
  platform?: InterviewPlatform
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateInterviewInput {
  applicationId: string
  type: InterviewType
  scheduledAt: Date
  duration: number
  location?: string
  meetingLink?: string
  platform?: InterviewPlatform
  notes?: string
}

export interface UpdateInterviewInput {
  type?: InterviewType
  status?: InterviewStatus
  scheduledAt?: Date
  duration?: number
  location?: string
  meetingLink?: string
  platform?: InterviewPlatform
  notes?: string
}

