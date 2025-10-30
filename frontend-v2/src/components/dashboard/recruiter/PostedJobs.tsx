"use client"
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, Eye, Briefcase, Plus, MoreVertical, Edit, Trash2 } from "lucide-react"
import { formatDate, stripParenthesizedCompany } from "@/utils/utils"
import { useDeleteJob } from "@/hooks/jobHooks"
import toast from "react-hot-toast"

type Job = {
  id: string
  title: string
  slug: string
  recruiterId: string
  company: { name: string; logo?: string }
  featured?: boolean
  location?: string
  type?: string
  views?: number
  createdAt?: Date
}

export default function PostedJobs({ jobs, getApplicantCount }: { jobs: Job[]; getApplicantCount: (jobId: string) => number }) {
  const router = useRouter()
  const deleteJobMutation = useDeleteJob()
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null)

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
      return
    }

    setDeletingJobId(jobId)
    try {
      await deleteJobMutation.mutateAsync({ id: jobId })
      toast.success("Job deleted successfully")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to delete job. Please try again."
      toast.error(errorMessage)
    } finally {
      setDeletingJobId(null)
    }
  }

  const handleEditJob = (jobId: string) => {
    router.push(`/recruiter/jobs/${jobId}/edit`)
  }

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
                        href={`/jobs/${job.slug}`}
                        className="font-semibold hover:text-emerald-500 transition-colors line-clamp-1"
                      >
                        {stripParenthesizedCompany(job.title)}
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
                      <span>Posted {job.createdAt ? formatDate(job.createdAt) : "-"}</span>
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
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={deletingJobId === job.id}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditJob(job.id)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteJob(job.id, stripParenthesizedCompany(job.title))}
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          disabled={deletingJobId === job.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deletingJobId === job.id ? "Deleting..." : "Delete Job"}
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
