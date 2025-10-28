"use client"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { JobFilters } from "@/components/jobs/JobFilters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SelectField from "@/components/form/SelectField"
import { SlidersHorizontal, Search } from "lucide-react"
import JobsList from "@/components/jobs/JobsList"

export default function JobsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [searchInput, setSearchInput] = useState("")
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

  const handleSearch = () => {
    if (searchInput.trim()) {
      const params = new URLSearchParams()
      params.set("q", searchInput.trim())
      if (locationQuery) {
        params.set("location", locationQuery)
      }
      router.push(`/jobs?${params.toString()}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-4">
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                <div className="flex items-center gap-3 flex-1 sm:max-w-2xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Search jobs by title, company, category..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 pr-4"
                    />
                  </div>
                  <Button onClick={handleSearch} className="flex-shrink-0">
                    <Search className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden md:inline">Sort by:</span>
                  <SelectField
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-full sm:w-[180px]"
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
