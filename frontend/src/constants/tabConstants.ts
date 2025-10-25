export interface TabOption {
  label: string
  value: string
  count?: number
}

export const INTERVIEW_TABS = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
]

export const APPLICATION_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Reviewed", value: "REVIEWED" },
  { label: "Shortlisted", value: "SHORTLISTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Accepted", value: "ACCEPTED" },
]

export const APPLICANT_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Rejected", value: "rejected" },
  { label: "Accepted", value: "accepted" },
]

export const NOTIFICATION_TABS = [
  { label: "All", value: "all" },
  { label: "Applications", value: "application" },
  { label: "Interviews", value: "interview" },
  { label: "Jobs", value: "job" },
  { label: "System", value: "system" },
]
