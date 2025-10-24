"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// Header and Footer are provided by the root layout
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMyApplications } from '@/hooks'
import type { Application } from '@/types'
import { Clock, CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDate, stripParenthesizedCompany } from "@/utils/utils"

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

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "REVIEWED":
        return <Eye className="h-4 w-4" />
      case "SHORTLISTED":
        return <CheckCircle className="h-4 w-4" />
      case "REJECTED":
        return <XCircle className="h-4 w-4" />
      case "ACCEPTED":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "REVIEWED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "SHORTLISTED":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "REJECTED":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "ACCEPTED":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
      <main className="py-8">
  <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Applications</h1>
            <p className="text-muted-foreground">Track the status of your job applications</p>
          </div>

          <Tabs value={filter} onValueChange={setFilter} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All ({allApplications.length})</TabsTrigger>
              <TabsTrigger value="PENDING">Pending ({allApplications.filter(app => app.status.toUpperCase() === "PENDING").length})</TabsTrigger>
              <TabsTrigger value="REVIEWED">Reviewed ({allApplications.filter(app => app.status.toUpperCase() === "REVIEWED").length})</TabsTrigger>
              <TabsTrigger value="SHORTLISTED">Shortlisted ({allApplications.filter(app => app.status.toUpperCase() === "SHORTLISTED").length})</TabsTrigger>
              <TabsTrigger value="REJECTED">Rejected ({allApplications.filter(app => app.status.toUpperCase() === "REJECTED").length})</TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((application: Application) => (
                <Card key={application.id} className="hover:border-cyan-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={application.job.company.logo || "/placeholder.svg?height=64&width=64"}
                          alt={application.job.company.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/jobs/${application.job.id}`}
                          className="font-semibold text-lg hover:text-cyan-500 transition-colors line-clamp-1 inline-block"
                        >
                          {stripParenthesizedCompany(application.job.title)}
                        </Link>
                        <p className="text-muted-foreground mb-2">{application.job.company.name}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>{application.job.location}</span>
                          <span>•</span>
                          <span>{application.job.type}</span>
                          <span>•</span>
                          <span>Applied {formatDate(application.appliedAt)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-3">
                        <Badge variant="outline" className={getStatusColor(application.status)}>
                          <span className="flex items-center gap-1.5">
                            {getStatusIcon(application.status)}
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1).toLowerCase().replace('_', ' ')}
                          </span>
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/jobs/${application.job.id}`}>View Job</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No applications found</p>
                <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
  )
}
