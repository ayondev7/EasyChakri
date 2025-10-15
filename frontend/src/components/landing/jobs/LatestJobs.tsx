"use client"

import Link from "next/link"
import { useJobs } from "@/hooks/jobHooks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, Clock, ArrowRight } from "lucide-react"
import { formatDate } from "@/utils/utils"
import Image from "next/image"

export function LatestJobs() {
  const { data, isLoading } = useJobs({ limit: 8 })
  
  const latestJobs = data?.data || []

  if (isLoading) {
    return (
      <section className="py-[100px] md:py-[100px]">
        <div className="container mx-auto px-[100px]">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading latest jobs...</div>
          </div>
        </div>
      </section>
    )
  }

  if (latestJobs.length === 0) {
    return (
      <section className="py-[100px] md:py-[100px]">
        <div className="container mx-auto px-[100px]">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">No jobs available at the moment.</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-[100px] md:py-[100px]">
      <div className="container mx-auto px-[100px]">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Latest Job Openings</h2>
            <p className="text-muted-foreground">Fresh opportunities posted recently</p>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link href="/jobs">
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {latestJobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block p-6 rounded-lg border border-border/40 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg bg-card"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={job.company.logo || "/placeholder.svg?height=56&width=56"}
                    alt={job.company.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 mb-2">
                    <h3 className="font-semibold text-lg hover:text-emerald-500 transition-colors">{job.title}</h3>
                    {job.featured && <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">Featured</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{job.company.name}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(job.createdAt || new Date())}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
                  <span className="font-semibold text-emerald-500">{job.salary}</span>
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Apply Now
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/jobs">
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
