// Tab configurations for different pages

export interface TabOption {
  label: string
  value: string
  count?: number
}

// Interview tabs (used by both seeker and recruiter)
export const INTERVIEW_TABS = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
]

// Application tabs (for seeker applications page)
export const APPLICATION_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Reviewed", value: "REVIEWED" },
  { label: "Shortlisted", value: "SHORTLISTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Accepted", value: "ACCEPTED" },
]

// Applicant tabs (for recruiter job applicants page)
export const APPLICANT_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Rejected", value: "rejected" },
  { label: "Accepted", value: "accepted" },
]

// Notification tabs
export const NOTIFICATION_TABS = [
  { label: "All", value: "all" },
  { label: "Applications", value: "application" },
  { label: "Jobs", value: "job" },
  { label: "System", value: "system" },
]
