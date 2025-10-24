"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react"
import type { Application } from "@/types"
import { formatDate, stripParenthesizedCompany } from "@/utils/utils"
import Link from "next/link"
import Image from "next/image"

interface ApplicationCardProps {
  application: Application
}

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

export default function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Card className="hover:border-cyan-500/50 transition-all">
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
                {application.status.charAt(0).toUpperCase() +
                  application.status.slice(1).toLowerCase().replace("_", " ")}
              </span>
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/jobs/${application.job.id}`}>View Job</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
