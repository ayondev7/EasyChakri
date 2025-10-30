"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DollarSign, Briefcase, Users, MapPin, Calendar } from "lucide-react"
import { formatDate, formatDeadline, formatSalary } from "@/utils/utils"
import type { Job } from "@/types"

interface JobOverviewProps {
  job: Job
}

export function JobOverview({ job }: JobOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <DollarSign className="h-5 w-5 text-emerald-500 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Salary</p>
            <p className="font-semibold">{formatSalary(job.salary)}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start gap-3">
          <Briefcase className="h-5 w-5 text-emerald-500 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Job Type</p>
            <p className="font-semibold">{job.type.replace('_', ' ')}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-emerald-500 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Experience</p>
            <p className="font-semibold">{job.experience} Years</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-emerald-500 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-semibold">{job.location}</p>
          </div>
        </div>
        {job.deadline && (
          <>
            <Separator />
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Application Deadline</p>
                <p className="font-semibold">{formatDeadline(job.deadline)}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
