"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { JobFilters } from "@/components/jobs/JobFilters"
import { Button } from "@/components/ui/button"
import SelectField from "@/components/form/SelectField"
import { SlidersHorizontal } from "lucide-react"
import JobsList from "@/components/jobs/JobsList"

export default function JobsPage() {
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [filters, setFilters] = useState({
    jobType: "",
    experience: "",
    category: "",
    salaryRange: "",
  })

  const searchQuery = searchParams.get("q") || ""
  const locationQuery = searchParams.get("location") || ""

  const queryParams: Record<string, any> = {}
  if (searchQuery) queryParams.search = searchQuery
  if (locationQuery) queryParams.location = locationQuery

  if (filters.jobType) {
    queryParams.type = filters.jobType
  }

  if (filters.experience) {
    queryParams.experience = filters.experience
  }

  if (filters.category) {
    queryParams.category = filters.category
  }

  if (filters.salaryRange) {
    queryParams.salaryRange = filters.salaryRange
  }

  if (sortBy && sortBy !== 'recent') {
    queryParams.sortBy = sortBy
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-[100px]">
  <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Browse All Jobs"}
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className={`lg:w-80 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="sticky top-24">
                <JobFilters filters={filters} setFilters={setFilters} />
              </div>
            </aside>

            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                  <SelectField
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-[180px]"
                    options={[
                      { label: 'Most Recent', value: 'recent' },
                      { label: 'Salary: High to Low', value: 'salary-high' },
                      { label: 'Salary: Low to High', value: 'salary-low' },
                    ]}
                  />
                </div>
              </div>

              <JobsList initialPage={1} pageSize={12} queryParams={queryParams} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
