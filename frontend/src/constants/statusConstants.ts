import { Calendar, Clock, MapPin, Video, ExternalLink, User, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const APPLICATION_STATUS_CONFIG: Record<string, { icon: LucideIcon; color: string }> = {
  PENDING: {
    icon: Clock,
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  REVIEWED: {
    icon: Eye,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  SHORTLISTED: {
    icon: CheckCircle,
    color: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  INTERVIEW_SCHEDULED: {
    icon: Calendar,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  INTERVIEW_COMPLETED: {
    icon: CheckCircle,
    color: "bg-teal-500/10 text-teal-500 border-teal-500/20",
  },
  REJECTED: {
    icon: XCircle,
    color: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  ACCEPTED: {
    icon: CheckCircle,
    color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  },
}

export const INTERVIEW_STATUS_CONFIG: Record<string, { icon: LucideIcon; color: string }> = {
  SCHEDULED: {
    icon: Calendar,
    color: "bg-blue-500/10 text-blue-700 border-blue-200",
  },
  CONFIRMED: {
    icon: CheckCircle,
    color: "bg-green-500/10 text-green-700 border-green-200",
  },
  COMPLETED: {
    icon: CheckCircle,
    color: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
  },
  CANCELLED: {
    icon: XCircle,
    color: "bg-red-500/10 text-red-700 border-red-200",
  },
  RESCHEDULED: {
    icon: AlertCircle,
    color: "bg-orange-500/10 text-orange-700 border-orange-200",
  },
}

export const getApplicationStatusIcon = (status: string): LucideIcon => {
  return APPLICATION_STATUS_CONFIG[status.toUpperCase()]?.icon || AlertCircle
}

export const getApplicationStatusColor = (status: string): string => {
  return APPLICATION_STATUS_CONFIG[status.toUpperCase()]?.color || "bg-muted text-muted-foreground"
}

export const getInterviewStatusIcon = (status: string): LucideIcon => {
  return INTERVIEW_STATUS_CONFIG[status.toUpperCase()]?.icon || AlertCircle
}

export const getInterviewStatusColor = (status: string): string => {
  return INTERVIEW_STATUS_CONFIG[status.toUpperCase()]?.color || "bg-gray-500/10 text-gray-700 border-gray-200"
}
