"use client"
import React, { useState, useEffect } from 'react'
import type { Job } from '@/types'
import { JobCard } from '@/components/jobs/JobCard'
import Pagination from '@/components/pagination/Pagination'
import { useJobs } from '@/hooks/jobHooks'
import Loader from '@/components/Loader'

interface JobsListProps {
  initialPage?: number
  pageSize?: number
  queryParams?: Record<string, any>
}

export const JobsList: React.FC<JobsListProps> = ({ initialPage = 1, pageSize = 12, queryParams = {} }) => {
  const [page, setPage] = useState(initialPage)

  const params = { ...queryParams, page, limit: pageSize }

  const { data, isLoading, error } = useJobs(params)

  useEffect(() => {
    setPage(1)
  }, [JSON.stringify(queryParams)])

  useEffect(() => {
    setPage(initialPage)
  }, [initialPage])

  const jobs = data?.data || []
  const total = data?.meta?.total || 0
  const totalPages = data?.meta?.totalPages || 1

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-red-600">Failed to load jobs. Please try again later.</div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground mb-4">No jobs found matching your criteria</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {jobs.length} of {total} jobs
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job: Job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination total={total} page={page} limit={pageSize} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default JobsList
