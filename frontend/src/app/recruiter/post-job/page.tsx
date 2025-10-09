"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AddJobForm from '@/components/jobs/AddJobForm'

export default function PostJobPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [companyId, setCompanyId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || !user || user.role !== 'recruiter') {
      router.push('/auth/signin')
      return
    };
    (async () => {
      try {
        const res = await fetch('/api/companies/recruiter/my-company')
        if (res.ok) {
          const json = await res.json()
          setCompanyId(json.data?.id ?? null)
        }
      } catch (err) {
      }
    })()
  }, [authLoading, isAuthenticated, user, router])

  if (authLoading) return null
  if (!isAuthenticated || !user || user.role !== 'recruiter') return null

  return (
    <main className="py-8">
      <div className="container mx-auto px-[100px] max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Post a New Job</h1>
          <p className="text-muted-foreground">Fill in the details to create a job posting</p>
        </div>

        <AddJobForm companyId={companyId} />
      </div>
    </main>
  )
}
