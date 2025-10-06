"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { JobCard } from "@/components/JobCard"
import { JobFilters } from "@/components/jobs/JobFilters"
import { mockJobs } from "@/lib/MockData"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"

export default function JobsPage() {
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [filters, setFilters] = useState({
    jobType: [] as string[],
    experience: [] as string[],
    location: [] as string[],
    salaryRange: [] as string[],
  })

  const searchQuery = searchParams.get("q") || ""
  const locationQuery = searchParams.get("location") || ""

  const filteredJobs = useMemo(() => {
    let jobs = [...mockJobs]

    // Search filter
    if (searchQuery) {
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Location filter
    if (locationQuery) {
      jobs = jobs.filter((job) => job.location.toLowerCase().includes(locationQuery.toLowerCase()))
    }

    // Job type filter
    if (filters.jobType.length > 0) {
      jobs = jobs.filter((job) => filters.jobType.includes(job.type))
    }

    // Experience filter
    if (filters.experience.length > 0) {
      jobs = jobs.filter((job) => filters.experience.includes(job.experience))
    }

    // Location filter from sidebar
    if (filters.location.length > 0) {
      jobs = jobs.filter((job) => filters.location.some((loc) => job.location.includes(loc)))
    }

    // Sort
    if (sortBy === "recent") {
      jobs.sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime())
    } else if (sortBy === "salary-high") {
      jobs.sort((a, b) => {
        const aMax = Number.parseInt(a.salary.match(/\d+/g)?.[1] || "0")
        const bMax = Number.parseInt(b.salary.match(/\d+/g)?.[1] || "0")
        return bMax - aMax
      })
    } else if (sortBy === "salary-low") {
      jobs.sort((a, b) => {
        const aMin = Number.parseInt(a.salary.match(/\d+/g)?.[0] || "0")
        const bMin = Number.parseInt(b.salary.match(/\d+/g)?.[0] || "0")
        return aMin - bMin
      })
    }

    return jobs
  }, [searchQuery, locationQuery, filters, sortBy])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-[100px]">
        <div className="container mx-auto px-[100px]">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Browse All Jobs"}
            </h1>
            <p className="text-muted-foreground">
              {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:w-80 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="sticky top-24">
                <JobFilters filters={filters} setFilters={setFilters} />
              </div>
            </aside>

            {/* Job Listings */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                      <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No jobs found matching your criteria</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        jobType: [],
                        experience: [],
                        location: [],
                        salaryRange: [],
                      })
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
