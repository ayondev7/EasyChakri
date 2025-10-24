"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Video, ExternalLink, User, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { Interview } from "@/types"
import { formatDate, stripParenthesizedCompany } from "@/utils/utils"

interface InterviewCardProps {
  interview: Interview
  role: "seeker" | "recruiter"
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "SCHEDULED":
      return <Calendar className="h-4 w-4 text-blue-500" />
    case "CONFIRMED":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "COMPLETED":
      return <CheckCircle className="h-4 w-4 text-cyan-500" />
    case "CANCELLED":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "RESCHEDULED":
      return <AlertCircle className="h-4 w-4 text-orange-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "SCHEDULED":
      return "bg-blue-500/10 text-blue-700 border-blue-200"
    case "CONFIRMED":
      return "bg-green-500/10 text-green-700 border-green-200"
    case "COMPLETED":
      return "bg-cyan-500/10 text-cyan-700 border-cyan-200"
    case "CANCELLED":
      return "bg-red-500/10 text-red-700 border-red-200"
    case "RESCHEDULED":
      return "bg-orange-500/10 text-orange-700 border-orange-200"
    default:
      return "bg-gray-500/10 text-gray-700 border-gray-200"
  }
}

const getInterviewTypeIcon = (type: string) => {
  return type === "ONLINE" ? (
    <Video className="h-4 w-4 text-cyan-500" />
  ) : (
    <MapPin className="h-4 w-4 text-orange-500" />
  )
}

export default function InterviewCard({ interview, role }: InterviewCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg truncate">
                {stripParenthesizedCompany(interview.application.job.title)}
              </h3>
              <Badge variant="outline" className={getStatusColor(interview.status)}>
                <span className="flex items-center gap-1.5">
                  {getStatusIcon(interview.status)}
                  {interview.status
                    .toLowerCase()
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </Badge>
            </div>

            {role === "recruiter" && (
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {interview.seeker.name} • {interview.seeker.email}
                </span>
              </div>
            )}

            {role === "seeker" && (
              <p className="text-muted-foreground mb-3">{interview.application.job.company.name}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {formatDate(interview.scheduledAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {interview.duration} minutes
              </span>
              <span className="flex items-center gap-1.5">
                {getInterviewTypeIcon(interview.type)}
                {interview.type
                  .toLowerCase()
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            </div>

            {interview.type === "ONLINE" && interview.meetingLink && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Meeting:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(interview.meetingLink, "_blank")}
                  className="h-7 px-2"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Join {interview.platform?.replace("_", " ").toUpperCase()}
                </Button>
              </div>
            )}

            {interview.type === "PHYSICAL" && interview.location && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">{interview.location}</span>
              </div>
            )}

            {interview.notes && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{interview.notes}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 lg:min-w-[140px]">
            {role === "seeker" && (
              <>
                {interview.status === "SCHEDULED" && (
                  <Button variant="outline" size="sm">
                    Confirm Attendance
                  </Button>
                )}
                {interview.status === "CONFIRMED" && (
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  Contact Recruiter
                </Button>
              </>
            )}

            {role === "recruiter" && (
              <>
                {interview.status === "SCHEDULED" && (
                  <Button variant="outline" size="sm">
                    Confirm Interview
                  </Button>
                )}
                {interview.status === "CONFIRMED" && (
                  <Button variant="outline" size="sm">
                    Mark Completed
                  </Button>
                )}
                {interview.status !== "COMPLETED" && interview.status !== "CANCELLED" && (
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  View Application
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
