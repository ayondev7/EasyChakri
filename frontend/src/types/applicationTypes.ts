import type { Job } from "./jobTypes"

export interface Application {
  id: string
  jobId: string
  job: Job
  seekerId: string
  status: "pending" | "reviewed" | "shortlisted" | "interview_scheduled" | "interview_completed" | "rejected" | "accepted"
  appliedDate: Date
  coverLetter?: string
}
