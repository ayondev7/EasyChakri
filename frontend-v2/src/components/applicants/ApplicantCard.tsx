"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AtSign, MapPin, Briefcase, Eye } from "lucide-react"
import type { Application, User } from "@/types"
import { formatDate, getInitials } from "@/utils/utils"
import { useRouter } from "next/navigation"

interface ApplicantCardProps {
  application: Application
  applicantUser?: User
  onStatusChange: (applicationId: string, newStatus: Application["status"]) => void
  onViewDetails?: (application: Application) => void
}

export default function ApplicantCard({
  application,
  applicantUser,
  onStatusChange,
  onViewDetails,
}: ApplicantCardProps) {
  const router = useRouter()

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/recruiter/applicants/${application.id}`)
  }

  return (
    <div
      className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border border-border/40 hover:border-cyan-500/50 transition-all cursor-pointer"
      onClick={handleViewDetails}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={applicantUser?.image || "/placeholder.svg"} alt={applicantUser?.name} />
        <AvatarFallback className="bg-cyan-500/10 text-cyan-500">
          {getInitials(applicantUser?.name || "Unknown")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold mb-1">{applicantUser?.name}</h3>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <AtSign className="h-3 w-3" />
            {applicantUser?.email}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {applicantUser?.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {applicantUser?.experience}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Applied {formatDate(application.appliedAt)}</p>
      </div>

      <div className="flex flex-col gap-3 md:items-end">
        <div className="flex items-center gap-2">
          <Select
            value={application.status}
            onValueChange={(value) => {
              onStatusChange(application.id, value as Application["status"])
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REVIEWED">Reviewed</SelectItem>
              <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
              <SelectItem value="INTERVIEW_SCHEDULED">Interview Scheduled</SelectItem>
              <SelectItem value="INTERVIEW_COMPLETED">Interview Completed</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewDetails}
        >
          <Eye className="h-3 w-3 mr-1" />
          View Details
        </Button>
      </div>
    </div>
  )
}
