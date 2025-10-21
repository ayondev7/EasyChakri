import type { Job } from "./jobTypes"

export type ApplicationStatus = "PENDING" | "REVIEWED" | "SHORTLISTED" | "INTERVIEW_SCHEDULED" | "INTERVIEW_COMPLETED" | "REJECTED" | "ACCEPTED"

export interface Application {
  id: string
  jobId: string
  job: Job
  seekerId: string
  status: ApplicationStatus
  appliedAt: Date
  updatedAt: Date
}
