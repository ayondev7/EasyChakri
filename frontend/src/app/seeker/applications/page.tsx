"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// Header and Footer are provided by the root layout
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockApplications } from "@/utils/MockData"
import { Clock, CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/utils/utils"

export default function ApplicationsPage() {
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

  const filteredApplications =
    filter === "all" ? mockApplications : mockApplications.filter((app) => app.status === filter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "reviewed":
        return <Eye className="h-4 w-4" />
      case "shortlisted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "reviewed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "shortlisted":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "accepted":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
      <main className="py-8">
  <div className="container mx-auto px-[100px]">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Applications</h1>
            <p className="text-muted-foreground">Track the status of your job applications</p>
          </div>

          <Tabs value={filter} onValueChange={setFilter} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All ({mockApplications.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
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
                          {application.job.title}
                        </Link>
                        <p className="text-muted-foreground mb-2">{application.job.company.name}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>{application.job.location}</span>
                          <span>•</span>
                          <span>{application.job.type}</span>
                          <span>•</span>
                          <span>Applied {formatDate(application.appliedDate)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-3">
                        <Badge variant="outline" className={getStatusColor(application.status)}>
                          <span className="flex items-center gap-1.5">
                            {getStatusIcon(application.status)}
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
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
