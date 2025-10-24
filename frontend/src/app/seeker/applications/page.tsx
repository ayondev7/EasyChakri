"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useMyApplications } from "@/hooks"
import type { Application } from "@/types"
import { Briefcase } from "lucide-react"
import TabsField from "@/components/form/TabsField"
import ApplicationCard from "@/components/applications/ApplicationCard"
import EmptyState from "@/components/EmptyState"
import { APPLICATION_TABS } from "@/constants/tabConstants"

export default function ApplicationsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [filter, setFilter] = useState("all")

  // Always call data hooks at the top; gate execution via `enabled` to avoid changing hook order
  const { data: applicationsData } = useMyApplications({
    page: 1,
    limit: 50,
  })

  useEffect(() => {
    // Don't redirect while session is still loading
    if (isLoading) return

    // Redirect if not authenticated or wrong role
    if (!isAuthenticated || !user) {
      router.push("/auth/signin")
      return
    }
    
    if (user.role !== "seeker") {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, user, router, isLoading])

  // Show loading state while session is being checked
  if (isLoading) {
    return null
  }

  // Don't render page until authenticated
  if (!isAuthenticated || !user || user.role !== "seeker") {
    return null
  }
  const allApplications: Application[] = applicationsData?.data ?? []
  const filteredApplications =
    filter === "all" ? allApplications : allApplications.filter((app) => app.status.toUpperCase() === filter.toUpperCase())

  const tabOptions = APPLICATION_TABS.map((tab) => {
    if (tab.value === "all") {
      return { ...tab, count: allApplications.length }
    }
    return {
      ...tab,
      count: allApplications.filter((app) => app.status.toUpperCase() === tab.value).length,
    }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">Track the status of your job applications</p>
      </div>

      <TabsField options={tabOptions} value={filter} onChange={setFilter} className="mb-6" />

      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((application: Application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Briefcase} title="No applications found" actionLabel="Browse Jobs" actionHref="/jobs" />
      )}
    </div>
  )
}
