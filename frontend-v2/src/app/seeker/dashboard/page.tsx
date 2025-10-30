"use client"

import { useAuth } from "@/contexts/AuthContext"
import AuthGuard from "@/components/AuthGuard"
import { useMyApplications, useApplicationStats } from "@/hooks"
import SeekerHeader from "@/components/dashboard/seeker/SeekerHeader"
import SeekerStatsGrid from "@/components/dashboard/seeker/SeekerStatsGrid"
import RecentApplications from "@/components/dashboard/seeker/RecentApplications"

export default function SeekerDashboardPage() {
  const { user } = useAuth()
  const { data: applicationsData, isLoading: applicationsLoading } = useMyApplications({ page: 1, limit: 5 })
  const { data: statsData } = useApplicationStats()

  return (
    <AuthGuard role="SEEKER">
      <div>
        <SeekerHeader userName={user?.name} />
        
        <SeekerStatsGrid
          total={statsData?.data?.total || 0}
          pending={statsData?.data?.stats?.PENDING || 0}
          shortlisted={statsData?.data?.stats?.SHORTLISTED || 0}
          interviews={statsData?.data?.stats?.INTERVIEW_SCHEDULED || 0}
        />

        <RecentApplications
          applications={applicationsData?.data}
          isLoading={applicationsLoading}
        />
      </div>
    </AuthGuard>
  )
}
