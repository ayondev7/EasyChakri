"use client"

import Link from "next/link"
import { mockJobs } from "@/lib/MockData"
import { JobCard } from "@/components/JobCard"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FeaturedJobs() {
  const featuredJobs = mockJobs.filter((job) => job.featured).slice(0, 6)

  return (
    <section className="py-[100px] md:py-[100px]">
      <div className="container mx-auto px-[100px]">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Jobs</h2>
            <p className="text-muted-foreground">Hand-picked opportunities from top companies</p>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link href="/jobs">
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
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
