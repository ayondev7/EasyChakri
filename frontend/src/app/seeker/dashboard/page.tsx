"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
// Header and Footer are provided by the root layout
import { useAuth } from "@/contexts/AuthContext"
import AuthGuard from "@/components/AuthGuard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockApplications, mockJobs, mockInterviews } from "@/utils/MockData"
import { Briefcase, FileText, Eye, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/utils/utils"

export default function SeekerDashboardPage() {
  const { user } = useAuth()
  const stats = [
    {
      title: "Applications",
    value: mockApplications.filter(app => app.seekerId === user?.id).length,
      icon: FileText,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      link: "/seeker/applications",
    },
    {
      title: "Profile Views",
      value: 234,
      icon: Eye,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Saved Jobs",
      value: 12,
      icon: Briefcase,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Interviews",
    value: mockInterviews.filter(interview => interview.seekerId === user?.id).length,
      icon: Calendar,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      link: "/seeker/interviews",
    },
  ]

  const recommendedJobs = mockJobs.filter((job) => job.featured).slice(0, 3)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "reviewed":
        return <Eye className="h-4 w-4" />
      case "shortlisted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "reviewed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "shortlisted":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "accepted":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <AuthGuard role="seeker">
      <main className="py-8">
        <div className="container mx-auto px-[100px]">
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
                  <div className="space-y-4">
                    {mockApplications.map((application) => (
                      <div
                        key={application.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-border/40 hover:border-cyan-500/50 transition-all"
                      >
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={application.job.company.logo || "/placeholder.svg?height=48&width=48"}
                            alt={application.job.company.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/jobs/${application.job.id}`}
                            className="font-semibold hover:text-cyan-500 transition-colors line-clamp-1"
                          >
                            {application.job.title}
                          </Link>
                          <p className="text-sm text-muted-foreground mb-2">{application.job.company.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Applied {formatDate(application.appliedDate)}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(application.status)}>
                          <span className="flex items-center gap-1.5">
                            {getStatusIcon(application.status)}
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                    ))}

                    {mockApplications.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet</p>
                        <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
                          <Link href="/jobs">Browse Jobs</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Jobs */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedJobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        className="block p-4 rounded-lg border border-border/40 hover:border-cyan-500/50 transition-all"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={job.company.logo || "/placeholder.svg?height=40&width=40"}
                              alt={job.company.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm line-clamp-1 hover:text-cyan-500 transition-colors">
                              {job.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">{job.company.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{job.location}</span>
                          <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-500">
                            {job.type}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
                    <Link href="/jobs">View More Jobs</Link>
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
