"use client"

import React, { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useJob } from '@/hooks/jobHooks'
import EditJobForm from '@/components/jobs/EditJobForm'
import Loader from '@/components/Loader'

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params?.id as string
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: jobData, isLoading: jobLoading, error } = useJob(jobId)

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || !user || user.role !== 'RECRUITER') {
      router.push('/auth/signin')
      return
    }
  }, [authLoading, isAuthenticated, user, router])

  if (authLoading || jobLoading) {
    return (
      <main className="py-8">
        <div className="container mx-auto max-w-4xl">
          <Loader />
        </div>
      </main>
    )
  }

  if (!isAuthenticated || !user || user.role !== 'RECRUITER') return null

  if (error || !jobData?.data) {
    return (
      <main className="py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The job you're trying to edit doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.push('/recruiter/dashboard')}
              className="text-emerald-500 hover:underline"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    )
  }

  const job = jobData.data

  if (job.recruiterId !== user.id) {
    return (
      <main className="py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to edit this job.
            </p>
            <button
              onClick={() => router.push('/recruiter/dashboard')}
              className="text-emerald-500 hover:underline"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Edit Job</h1>
          <p className="text-muted-foreground">Update the job details</p>
        </div>

        <EditJobForm job={job} />
      </div>
    </main>
  )
}
