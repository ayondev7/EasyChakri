"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import type { Interview } from "@/types"
import { Calendar } from "lucide-react"
import TabsField from "@/components/form/TabsField"
import InterviewCard from "@/components/interviews/InterviewCard"
import EmptyState from "@/components/EmptyState"

export default function RecruiterInterviewsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Don't redirect while session is still loading
    if (isLoading) return

    // Redirect if not authenticated or wrong role
    if (!isAuthenticated || !user) {
      router.push("/auth/signin")
      return
    }
    
    if (user.role !== "recruiter") {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, user, router, isLoading])

  // Show loading state while session is being checked
  if (isLoading) {
    return null
  }

  // Don't render page until authenticated
  if (!isAuthenticated || !user || user.role !== "recruiter") {
    return null
  }

  const userInterviews: Interview[] = []

  const filteredInterviews: Interview[] =
    filter === "all" ? userInterviews : userInterviews.filter((interview) => interview.status === filter.toUpperCase())

  const tabOptions = [
    { label: "All", value: "all", count: userInterviews.length },
    { label: "Scheduled", value: "scheduled" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ]

  return (
    <main className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Interview Management</h1>
          <p className="text-muted-foreground">Schedule and manage interviews with candidates</p>
        </div>

        <TabsField options={tabOptions} value={filter} onChange={setFilter} className="mb-6" />

        {filteredInterviews.length > 0 ? (
          <div className="space-y-4">
            {filteredInterviews.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} role="recruiter" />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title={filter === "all" ? "No interviews scheduled yet" : `No ${filter} interviews`}
            actionLabel="View Job Postings"
            actionHref="/recruiter/jobs"
          />
        )}
      </div>
    </main>
  )
}