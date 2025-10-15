"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Job } from "@/types"

interface JobDescriptionProps {
  job: Job
}

export function JobDescription({ job }: JobDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-muted-foreground leading-relaxed">{job.description}</p>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-3">Key Responsibilities</h3>
          <ul className="space-y-2">
            {job.responsibilities.map((resp, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <span className="text-emerald-500 mt-1">•</span>
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-3">Requirements</h3>
          <ul className="space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <span className="text-emerald-500 mt-1">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {job.benefits && job.benefits.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-3">Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit) => (
                  <Badge key={benefit} variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
        
        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
