"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Video, ExternalLink, User } from "lucide-react"
import type { Interview } from "@/types"
import { formatDate, stripParenthesizedCompany } from "@/utils/utils"
import { getInterviewStatusIcon, getInterviewStatusColor } from "@/constants/statusConstants"

interface InterviewCardProps {
  interview: Interview
  role: "SEEKER" | "RECRUITER"
}

const getInterviewTypeIcon = (type: string) => {
  return type === "ONLINE" ? (
    <Video className="h-4 w-4 text-cyan-500" />
  ) : (
    <MapPin className="h-4 w-4 text-orange-500" />
  )
}

export default function InterviewCard({ interview, role }: InterviewCardProps) {
  const StatusIcon = getInterviewStatusIcon(interview.status)
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg truncate">
                {stripParenthesizedCompany(interview.application.job.title)}
              </h3>
              <Badge variant="outline" className={getInterviewStatusColor(interview.status)}>
                <span className="flex items-center gap-1.5">
                  <StatusIcon className="h-4 w-4" />
                  {interview.status
                    .toLowerCase()
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </Badge>
            </div>

            {role === "RECRUITER" && (
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {interview.seeker.name} • {interview.seeker.email}
                </span>
              </div>
            )}

            {role === "SEEKER" && (
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
            {role === "SEEKER" && (
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

            {role === "RECRUITER" && (
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
