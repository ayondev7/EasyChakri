"use client"

import { useAuth } from "@/contexts/AuthContext"
import AuthGuard from "@/components/AuthGuard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMyApplications, useApplicationStats } from "@/hooks"
import { Briefcase, FileText, Eye, Clock, CheckCircle, XCircle, AlertCircle, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDate, stripParenthesizedCompany } from "@/utils/utils"
import Loader from "@/components/Loader"

export default function SeekerDashboardPage() {
  const { user } = useAuth()
  const { data: applicationsData, isLoading: applicationsLoading } = useMyApplications(1, 5)
  const { data: statsData } = useApplicationStats()

  const stats = [
    {
      title: "Applications",
      value: statsData?.total || 0,
      icon: FileText,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      link: "/seeker/applications",
    },
    {
      title: "Pending",
      value: statsData?.stats?.PENDING || 0,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Shortlisted",
      value: statsData?.stats?.SHORTLISTED || 0,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Interviews",
      value: statsData?.stats?.INTERVIEW_SCHEDULED || 0,
      icon: Calendar,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "REVIEWED":
        return <Eye className="h-4 w-4" />
      case "SHORTLISTED":
      case "ACCEPTED":
        return <CheckCircle className="h-4 w-4" />
      case "REJECTED":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "REVIEWED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "SHORTLISTED":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "REJECTED":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "ACCEPTED":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <AuthGuard role="seeker">
      <main className="py-8">
  <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user?.name || "User"}!</h1>
            <p className="text-muted-foreground">Track your applications and discover new opportunities</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              const StatCard = (
                <Card key={stat.title} className={stat.link ? "hover:shadow-md transition-shadow cursor-pointer" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div
                        className={`h-12 w-12 rounded-lg ${stat.bgColor} ${stat.color} flex items-center justify-center`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )

              return stat.link ? (
                <Link key={stat.title} href={stat.link}>
                  {StatCard}
                </Link>
              ) : (
                StatCard
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Applications */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Applications</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/seeker/applications">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    <Loader />
                  ) : (
                    <div className="space-y-4">
                      {applicationsData?.data && applicationsData.data.length > 0 ? (
                        applicationsData.data.map((application) => (
                          <div
                            key={application.id}
                            className="flex items-start gap-4 p-4 rounded-lg border border-border/40 hover:border-cyan-500/50 transition-all"
                          >
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={application.job.company?.logo || "/placeholder.svg?height=48&width=48"}
                                alt={application.job.company?.name || "Company"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/jobs/${application.job.id}`}
                                className="font-semibold hover:text-cyan-500 transition-colors line-clamp-1"
                              >
                                {stripParenthesizedCompany(application.job.title)}
                              </Link>
                              <p className="text-sm text-muted-foreground mb-2">{application.job.company?.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Applied {formatDate(application.appliedAt)}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className={getStatusColor(application.status)}>
                              <span className="flex items-center gap-1.5">
                                {getStatusIcon(application.status)}
                                {application.status.charAt(0) + application.status.slice(1).toLowerCase().replace('_', ' ')}
                              </span>
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet</p>
                          <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
                            <Link href="/jobs">Browse Jobs</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                    <Link href="/jobs">Browse Jobs</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/seeker/profile">Edit Profile</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/seeker/applications">My Applications</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  )
}
