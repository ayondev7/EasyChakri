"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
// Header and Footer provided by root layout
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockJobs, mockApplications, mockInterviews } from "@/utils/MockData"
import { Briefcase, Users, Eye, TrendingUp, Plus, MoreVertical, Edit, Trash2, Calendar } from "lucide-react"
import { formatDate } from "@/utils/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function RecruiterDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // Don't redirect while session is still loading
    if (isLoading) return

    // Redirect if not authenticated or wrong role
    if (!isAuthenticated || !user) {
      router.push("/auth/signin")
      return
    }
    
    if (user.role !== "recruiter") {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, user, router, isLoading])

  // Show loading state while session is being checked
  if (isLoading) {
    return null
  }

  // Don't render page until authenticated
  if (!isAuthenticated || !user || user.role !== "recruiter") {
    return null
  }

  const myJobs = mockJobs.filter((job) => job.recruiterId === user.id).slice(0, 6)
  
  const getJobApplicantCount = (jobId: string) => {
    return mockApplications.filter(app => app.jobId === jobId).length
  }
  
  const totalApplicants = myJobs.reduce((sum, job) => sum + getJobApplicantCount(job.id), 0)
  const totalViews = myJobs.reduce((sum, job) => sum + job.views, 0)
  const shortlistedCount = mockApplications.filter(
    app => myJobs.some(job => job.id === app.jobId) && app.status === "shortlisted"
  ).length

  const stats = [
    {
      title: "Active Jobs",
      value: myJobs.length,
      icon: Briefcase,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Total Applicants",
      value: totalApplicants,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Interviews",
      value: mockInterviews.filter(interview => interview.interviewerId === user.id).length,
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      link: "/recruiter/interviews",
    },
    {
      title: "Total Views",
      value: totalViews,
      icon: Eye,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ]

  return (
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Recruiter Dashboard</h1>
              <p className="text-muted-foreground">Manage your job postings and applications</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/recruiter/jobs">Manage Jobs</Link>
              </Button>
              <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Link href="/recruiter/post-job">
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Link>
              </Button>
            </div>
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

          {/* Posted Jobs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Posted Jobs</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/recruiter/jobs">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {myJobs.length > 0 ? (
                <div className="space-y-4">
                  {myJobs.map((job) => {
                    const applicantCount = getJobApplicantCount(job.id)
                    return (
                      <div
                        key={job.id}
                        className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border border-border/40 hover:border-cyan-500/50 transition-all"
                      >
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={job.company.logo || "/placeholder.svg?height=48&width=48"}
                            alt={job.company.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-1">
                            <Link
                              href={`/jobs/${job.id}`}
                              className="font-semibold hover:text-cyan-500 transition-colors line-clamp-1"
                            >
                              {job.title}
                            </Link>
                            {job.featured && (
                              <Badge className="bg-cyan-500 text-white hover:bg-cyan-600 flex-shrink-0">Featured</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {job.location} • {job.type}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <button
                              onClick={() => router.push(`/recruiter/jobs/${job.id}/applicants`)}
                              className="flex items-center gap-1 hover:text-cyan-500 transition-colors"
                            >
                              <Users className="h-4 w-4" />
                              {applicantCount} applicants
                            </button>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {job.views} views
                            </span>
                            <span>Posted {formatDate(job.postedDate)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/recruiter/jobs/${job.id}/applicants`}>
                              View Applicants
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Job
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Job
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't posted any jobs yet</p>
                  <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    <Link href="/recruiter/post-job">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your First Job
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
  )
}
