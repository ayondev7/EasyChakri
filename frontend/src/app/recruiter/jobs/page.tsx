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
import { mockJobs, mockApplications } from "@/utils/MockData"
import { Users, Eye, Plus, MoreVertical, Edit, Trash2 } from "lucide-react"
import { formatDate } from "@/utils/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function RecruiterJobsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "recruiter") {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "recruiter") {
    return null
  }

  const myJobs = mockJobs.filter((job) => job.recruiterId === user.id)
  
  const getJobApplicantCount = (jobId: string) => {
    return mockApplications.filter(app => app.jobId === jobId).length
  }

  return (
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Jobs</h1>
              <p className="text-muted-foreground">View and manage all your job postings</p>
            </div>
            <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Link href="/recruiter/post-job">
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Posted Jobs ({myJobs.length})</CardTitle>
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
