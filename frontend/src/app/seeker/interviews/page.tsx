"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// Header and Footer are provided by the root layout
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Interview } from "@/types"
import { Calendar, Clock, MapPin, Video, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react"
import { formatDate } from "@/utils/utils"

export default function InterviewsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Don't redirect while session is still loading
    if (isLoading) return

    // Redirect if not authenticated or wrong role
    if (!isAuthenticated || !user) {
      router.push("/auth/signin")
      return
    }
    
    if (user.role !== "seeker") {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, user, router, isLoading])

  // Show loading state while session is being checked
  if (isLoading) {
    return null
  }

  // Don't render page until authenticated
  if (!isAuthenticated || !user || user.role !== "seeker") {
    return null
  }

  // TODO: replace with real API call once backend interview endpoints are implemented.
  // Using a typed empty array so the UI remains functional and TypeScript-safe.
  const userInterviews: Interview[] = []

  const filteredInterviews: Interview[] =
    filter === "all" ? userInterviews : userInterviews.filter((interview) => interview.status === filter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-cyan-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "rescheduled":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500/10 text-blue-700 border-blue-200"
      case "confirmed":
        return "bg-green-500/10 text-green-700 border-green-200"
      case "completed":
        return "bg-cyan-500/10 text-cyan-700 border-cyan-200"
      case "cancelled":
        return "bg-red-500/10 text-red-700 border-red-200"
      case "rescheduled":
        return "bg-orange-500/10 text-orange-700 border-orange-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  const getInterviewTypeIcon = (type: string) => {
    return type === "online" ? (
      <Video className="h-4 w-4 text-cyan-500" />
    ) : (
      <MapPin className="h-4 w-4 text-orange-500" />
    )
  }

  return (
      <main className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Interviews</h1>
            <p className="text-muted-foreground">
              Manage your upcoming and past interviews
            </p>
          </div>

          <Tabs value={filter} onValueChange={setFilter} className="mb-6">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
              <TabsTrigger value="all">All ({userInterviews.length})</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredInterviews.length > 0 ? (
            <div className="space-y-4">
              {filteredInterviews.map((interview) => (
                <Card key={interview.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg truncate">
                            {interview.application.job.title}
                          </h3>
                          <Badge variant="outline" className={getStatusColor(interview.status)}>
                            <span className="flex items-center gap-1.5">
                              {getStatusIcon(interview.status)}
                              {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                            </span>
                          </Badge>
                        </div>

                        <p className="text-muted-foreground mb-3">
                          {interview.application.job.company.name}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {formatDate(interview.scheduledDate)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {interview.duration} minutes
                          </span>
                          <span className="flex items-center gap-1.5">
                            {getInterviewTypeIcon(interview.type)}
                            {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)}
                          </span>
                        </div>

                        {interview.type === "online" && interview.meetingLink && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Meeting:</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(interview.meetingLink, "_blank")}
                              className="h-7 px-2"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Join {interview.meetingPlatform?.replace("_", " ").toUpperCase()}
                            </Button>
                          </div>
                        )}

                        {interview.type === "physical" && interview.location && (
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

                        {interview.feedback && (
                          <div className="mt-3 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                            <p className="text-sm font-medium text-cyan-800 mb-1">Feedback:</p>
                            <p className="text-sm text-cyan-700">{interview.feedback}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 md:min-w-[120px]">
                        {interview.status === "scheduled" && (
                          <Button variant="outline" size="sm">
                            Confirm Attendance
                          </Button>
                        )}
                        {interview.status === "confirmed" && (
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Contact Recruiter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {filter === "all" ? "No interviews scheduled yet" : `No ${filter} interviews`}
                </p>
                <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  <a href="/jobs">Browse Jobs</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
  )
}