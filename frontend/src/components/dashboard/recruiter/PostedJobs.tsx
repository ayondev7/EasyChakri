"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Eye, Briefcase, Plus, MoreVertical, Edit, Trash2 } from "lucide-react"
import { formatDate } from "@/utils/utils"

type Job = {
  id: string
  title: string
  recruiterId: string
  company: { name: string; logo?: string }
  featured?: boolean
  location?: string
  type?: string
  views?: number
  postedDate?: Date
}

export default function PostedJobs({ jobs, getApplicantCount }: { jobs: Job[]; getApplicantCount: (jobId: string) => number }) {
  return (
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
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => {
              const applicantCount = getApplicantCount(job.id)
              return (
                <div
                  key={job.id}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border border-border/40 hover:border-emerald-500/50 transition-all"
                >
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={job?.company?.logo || "/placeholder.svg?height=48&width=48"}
                      alt={job?.company?.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-semibold hover:text-emerald-500 transition-colors line-clamp-1"
                      >
                        {job.title}
                      </Link>
                      {job.featured && (
                        <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 flex-shrink-0">Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {job.location} • {job.type}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <button
                        onClick={() => { window.location.href = `/recruiter/jobs/${job.id}/applicants` }}
                        className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
                      >
                        <Users className="h-4 w-4" />
                        {applicantCount} applicants
                      </button>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {job.views}
                      </span>
                      <span>Posted {job.postedDate ? formatDate(job.postedDate) : "-"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/recruiter/jobs/${job.id}/applicants`}>
                        View Applicants
                      </Link>
                    </Button>
                    <div className="relative">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">You haven't posted any jobs yet</p>
            <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Link href="/recruiter/post-job">
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Job
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
