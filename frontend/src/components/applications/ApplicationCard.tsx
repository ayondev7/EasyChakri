"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Application } from "@/types"
import { formatDate, stripParenthesizedCompany, formatJobType } from "@/utils/utils"
import { getApplicationStatusIcon, getApplicationStatusColor } from "@/constants/statusConstants"
import Link from "next/link"
import Image from "next/image"

interface ApplicationCardProps {
  application: Application
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const StatusIcon = getApplicationStatusIcon(application.status)
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
              href={`/jobs/${application.job.slug}`}
              className="font-semibold text-lg hover:text-cyan-500 transition-colors line-clamp-1 inline-block"
            >
              {stripParenthesizedCompany(application.job.title)}
            </Link>
            <p className="text-muted-foreground mb-2">{application.job.company.name}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{application.job.location}</span>
              <span>•</span>
              <span>{formatJobType(application.job.type)}</span>
              <span>•</span>
              <span>Applied {formatDate(application.appliedAt)}</span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <Badge variant="outline" className={getApplicationStatusColor(application.status)}>
              <span className="flex items-center gap-1.5">
                <StatusIcon className="h-4 w-4" />
                {application.status.charAt(0).toUpperCase() +
                  application.status.slice(1).toLowerCase().replace("_", " ")}
              </span>
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/jobs/${application.job.slug}`}>View Job</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
