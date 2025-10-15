"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Briefcase, Clock, Eye, Users, Bookmark, Share2 } from "lucide-react"
import { formatDate } from "@/utils/utils"
import type { Job } from "@/types"

interface JobHeaderProps {
  job: Job
  isAuthenticated: boolean
  userRole?: string
}

export function JobHeader({ job, isAuthenticated, userRole }: JobHeaderProps) {
  const applicantCount = job._count?.applications || 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={job.company.logo || "/placeholder.svg?height=80&width=80"}
              alt={job.company.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <Link
              href={`/companies/${job.company.id}`}
              className="text-lg text-emerald-500 hover:underline mb-3 inline-block"
            >
              {job.company.name}
            </Link>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span>{job.type.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{formatDate(job.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{job.views} views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{applicantCount} applicants</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={!isAuthenticated || userRole !== "SEEKER"}
          >
            {!isAuthenticated ? "Sign in to Apply" : userRole !== "SEEKER" ? "Seeker Only" : "Apply Now"}
          </Button>
          <Button size="lg" variant="outline">
            <Bookmark className="h-4 w-4 mr-2" />
            Save Job
          </Button>
          <Button size="lg" variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
