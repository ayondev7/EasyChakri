import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDate, stripParenthesizedCompany } from "@/utils/utils"
import Loader from "@/components/Loader"
import type { Application } from "@/types"

interface RecentApplicationsProps {
  applications?: Application[]
  isLoading: boolean
}

const getStatusIcon = (status: string) => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return <Clock className="h-4 w-4" />
    case "REVIEWED":
      return <Eye className="h-4 w-4" />
    case "SHORTLISTED":
    case "ACCEPTED":
      return <CheckCircle className="h-4 w-4" />
    case "REJECTED":
      return <XCircle className="h-4 w-4" />
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

export default function RecentApplications({
  applications,
  isLoading,
}: RecentApplicationsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/seeker/applications">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="space-y-4">
            {applications && applications.length > 0 ? (
              applications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border/40 hover:border-cyan-500/50 transition-all"
                >
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={application.job.company?.logo || "/placeholder.svg?height=48&width=48"}
                      alt={application.job.company?.name || "Company"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/jobs/${application.job.id}`}
                      className="font-semibold hover:text-cyan-500 transition-colors line-clamp-1"
                    >
                      {stripParenthesizedCompany(application.job.title)}
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">
                      {application.job.company?.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Applied {formatDate(application.appliedAt)}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(application.status)}>
                    <span className="flex items-center gap-1.5">
                      {getStatusIcon(application.status)}
                      {application.status.charAt(0) +
                        application.status.slice(1).toLowerCase().replace("_", " ")}
                    </span>
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t applied to any jobs yet
                </p>
                <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
