"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import type { Interview } from "@/types"
import { Calendar } from "lucide-react"
import TabsField from "@/components/form/TabsField"
import InterviewCard from "@/components/interviews/InterviewCard"
import EmptyState from "@/components/EmptyState"
import { INTERVIEW_TABS } from "@/constants/tabConstants"

export default function InterviewsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !user) {
      router.push("/auth/signin")
      return
    }
    
    if (user.role !== "SEEKER") {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, user, router, isLoading])

  if (isLoading) {
    return null
  }

  if (!isAuthenticated || !user || user.role !== "SEEKER") {
    return null
  }

  const userInterviews: Interview[] = []

  const filteredInterviews: Interview[] =
    filter === "all" ? userInterviews : userInterviews.filter((interview) => interview.status === filter.toUpperCase())

  const tabOptions = INTERVIEW_TABS.map((tab) =>
    tab.value === "all"
      ? { ...tab, count: userInterviews.length }
      : tab
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Interviews</h1>
        <p className="text-muted-foreground">Manage your upcoming and past interviews</p>
      </div>

      <TabsField options={tabOptions} value={filter} onChange={setFilter} className="mb-6" />

      {filteredInterviews.length > 0 ? (
        <div className="space-y-4">
          {filteredInterviews.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} role="SEEKER" />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title={filter === "all" ? "No interviews scheduled yet" : `No ${filter} interviews`}
          actionLabel="Browse Jobs"
          actionHref="/jobs"
        />
      )}
    </div>
  )
}