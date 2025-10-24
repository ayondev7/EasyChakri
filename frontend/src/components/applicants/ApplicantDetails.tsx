"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Phone, MapPin, Download, Eye, Briefcase, AtSign } from "lucide-react"
import type { Application, User } from "@/types"
import { formatDate, getInitials } from "@/utils/utils"
import { InterviewSchedulingModal } from "@/components/InterviewSchedulingModal"

interface ApplicantDetailsProps {
  application: Application
  applicantUser?: User
  onBack: () => void
  onStatusChange: (applicationId: string, newStatus: Application["status"]) => void
  getStatusColor: (status: string) => string
}

export default function ApplicantDetails({
  application,
  applicantUser,
  onBack,
  onStatusChange,
  getStatusColor,
}: ApplicantDetailsProps) {
  return (
    <main className="py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applicants
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={applicantUser?.image || "/placeholder.svg"}
                        alt={applicantUser?.name}
                      />
                      <AvatarFallback className="bg-cyan-500/10 text-cyan-500 text-xl">
                        {getInitials(applicantUser?.name || "Unknown")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">{applicantUser?.name}</h1>
                      <p className="text-muted-foreground">{applicantUser?.bio}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 text-sm">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                    <span>{applicantUser?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{applicantUser?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{applicantUser?.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{applicantUser?.experience} experience</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {applicantUser?.skills?.map((skill: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{applicantUser?.education}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Change Status</label>
                  <Select
                    value={application.status}
                    onValueChange={(value) =>
                      onStatusChange(application.id, value as Application["status"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="REVIEWED">Reviewed</SelectItem>
                      <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Applied</span>
                    <span className="font-medium">{formatDate(application.appliedAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Status</span>
                    <Badge variant="outline" className={getStatusColor(application.status)}>
                      {application.status.charAt(0).toUpperCase() +
                        application.status.slice(1).toLowerCase().replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
                <InterviewSchedulingModal
                  application={application}
                  trigger={
                    <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                      <Eye className="h-4 w-4 mr-2" />
                      Schedule Interview
                    </Button>
                  }
                  onSchedule={(interviewData) => {
                    console.log("Interview scheduled:", interviewData)
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
