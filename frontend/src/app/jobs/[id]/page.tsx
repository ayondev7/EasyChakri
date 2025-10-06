"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
// Navbar/Footer provided by root layout
import { JobCard } from "@/components/JobCard"
import { mockJobs } from "@/utils/MockData"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  Eye,
  Share2,
  Bookmark,
  Building2,
  Globe,
  Calendar,
} from "lucide-react"
import { formatDate } from "@/utils/utils"
import { useAuth } from "@/contexts/AuthContext"

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { isAuthenticated, user } = useAuth()
  const job = mockJobs.find((j) => j.id === id)

  if (!job) {
    notFound()
  }

  const similarJobs = mockJobs
    .filter((j) => j.id !== job.id && (j.company.id === job.company.id || j.skills.some((s) => job.skills.includes(s))))
    .slice(0, 3)

  return (
    <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={job.company.logo || "/placeholder.svg?height=80&width=80"}
                        alt={job.company.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                      <Link
                        href={`/companies/${job.company.id}`}
                        className="text-lg text-cyan-500 hover:underline mb-3 inline-block"
                      >
                        {job.company.name}
                      </Link>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(job.postedDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4" />
                          <span>{job.views} views</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4" />
                          <span>{job.applicants} applicants</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                      disabled={!isAuthenticated || user?.role !== "seeker"}
                    >
                      {!isAuthenticated ? "Sign in to Apply" : user?.role !== "seeker" ? "Seeker Only" : "Apply Now"}
                    </Button>
                    <Button size="lg" variant="outline">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save Job
                    </Button>
                    <Button size="lg" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Key Responsibilities</h3>
                    <ul className="space-y-2">
                      {job.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-cyan-500 mt-1">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-cyan-500 mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {job.benefits && job.benefits.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Benefits</h3>
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.map((benefit) => (
                            <Badge key={benefit} variant="secondary" className="bg-cyan-500/10 text-cyan-500">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Similar Jobs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {similarJobs.map((similarJob) => (
                      <JobCard key={similarJob.id} job={similarJob} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-cyan-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Salary</p>
                      <p className="font-semibold">{job.salary}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-cyan-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Job Type</p>
                      <p className="font-semibold">{job.type}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-cyan-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="font-semibold">{job.experience}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-cyan-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{job.location}</p>
                    </div>
                  </div>
                  {job.deadline && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-cyan-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Application Deadline</p>
                          <p className="font-semibold">{formatDate(job.deadline)}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle>About Company</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={job.company.logo || "/placeholder.svg?height=64&width=64"}
                        alt={job.company.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{job.company.name}</h3>
                      <p className="text-sm text-muted-foreground">{job.company.industry}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{job.company.description}</p>

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{job.company.size} employees</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{job.company.location}</span>
                    </div>
                    {job.company.website && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <a
                          href={job.company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-cyan-500"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href={`/companies/${job.company.id}`}>View All Jobs ({job.company.jobCount})</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
  )
}
