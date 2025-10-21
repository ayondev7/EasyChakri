"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { JobCard } from "@/components/JobCard"
import { useAuth } from "@/contexts/AuthContext"
import { useJob, useSimilarJobs } from "@/hooks/jobHooks"
import { JobHeader } from "@/components/singleJob/JobHeader"
import { JobDescription } from "@/components/singleJob/JobDescription"
import { JobOverview } from "@/components/singleJob/JobOverview"
import { CompanyInfo } from "@/components/singleJob/CompanyInfo"

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { isAuthenticated, user } = useAuth()
  
  const { data: jobData, isLoading, error } = useJob(id)
  const { data: similarJobsData, isLoading: similarLoading } = useSimilarJobs(id, 3)

  if (isLoading) {
    return (
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-muted-foreground">Loading job details...</div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !jobData?.data) {
    notFound()
  }

  const job = jobData.data
  const similarJobs = similarJobsData?.data || []

  return (
    <main className="py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <JobHeader job={job} isAuthenticated={isAuthenticated} userRole={user?.role} />
            <JobDescription job={job} />

            {/* Similar Jobs */}
            {!similarLoading && similarJobs.length > 0 && (
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
            <JobOverview job={job} />
            <CompanyInfo job={job} />
          </div>
        </div>
      </div>
    </main>
  )
}
