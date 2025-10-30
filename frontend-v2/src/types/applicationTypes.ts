import type { Job } from "./jobTypes"
import type { User } from "./userTypes"

export type ApplicationStatus = "PENDING" | "REVIEWED" | "SHORTLISTED" | "INTERVIEW_SCHEDULED" | "INTERVIEW_COMPLETED" | "REJECTED" | "ACCEPTED"

export interface Application {
  id: string
  jobId: string
  job: Job
  seekerId: string
  seeker?: User
  status: ApplicationStatus
  appliedAt: Date
  updatedAt: Date
}
