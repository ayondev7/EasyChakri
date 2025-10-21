"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useMyJobs } from "@/hooks/jobHooks"
import { mockApplications, mockInterviews } from "@/utils/MockData"
import { Briefcase, Users, Eye, Calendar } from "lucide-react"
import StatsGrid from "@/components/dashboard/StatsGrid"
import RecruiterHeader from "@/components/dashboard/recruiter/RecruiterHeader"
import PostedJobs from "@/components/dashboard/recruiter/PostedJobs"

export default function RecruiterDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  const { data, isLoading: jobsLoading, error } = useMyJobs(1, 6)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated || !user) {
      router.push("/auth/signin")
      return
    }
    if (user.role !== "recruiter") {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, user, router, isLoading])

  if (isLoading) return null
  if (!isAuthenticated || !user || user.role !== "recruiter") return null

  const myJobs = data?.data ?? []

  const getJobApplicantCount = (jobId: string) => mockApplications.filter((app) => app.jobId === jobId).length

  const totalApplicants = myJobs.reduce((sum, job: any) => sum + getJobApplicantCount(job.id), 0)
  const totalViews = myJobs.reduce((sum: number, job: any) => sum + (job.views || 0), 0)

  const stats = [
    {
      title: "Active Jobs",
      value: myJobs.length,
      icon: Briefcase,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Total Applicants",
      value: totalApplicants,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Interviews",
      value: mockInterviews.filter((interview) => interview.interviewerId === user.id).length,
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      link: "/recruiter/interviews",
    },
    {
      title: "Total Views",
      value: totalViews,
      icon: Eye,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ]

  return (
    <main className="py-8">
      <div className="container mx-auto">
        <RecruiterHeader />
        <StatsGrid stats={stats} />
        <PostedJobs jobs={myJobs} getApplicantCount={getJobApplicantCount} />
      </div>
    </main>
  )
}
