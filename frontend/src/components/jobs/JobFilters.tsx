"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface JobFiltersProps {
  filters: {
    jobType: string[]
    experience: string[]
    location: string[]
    salaryRange: string[]
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      jobType: string[]
      experience: string[]
      location: string[]
      salaryRange: string[]
    }>
  >
}

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"]
const experienceLevels = ["0-2 years", "2-4 years", "4-6 years", "6+ years"]
const locations = ["San Francisco, CA", "New York, NY", "Austin, TX", "Boston, MA", "Seattle, WA", "Remote"]
const salaryRanges = ["$0-$50k", "$50k-$100k", "$100k-$150k", "$150k+"]

export function JobFilters({ filters, setFilters }: JobFiltersProps) {
  const handleFilterChange = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      jobType: [],
      experience: [],
      location: [],
      salaryRange: [],
    })
  }

  const hasActiveFilters =
    filters.jobType.length > 0 ||
    filters.experience.length > 0 ||
    filters.location.length > 0 ||
    filters.salaryRange.length > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Job Type</h3>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.jobType.includes(type)}
                  onCheckedChange={() => handleFilterChange("jobType", type)}
                />
                <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Experience Level</h3>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`exp-${level}`}
                  checked={filters.experience.includes(level)}
                  onCheckedChange={() => handleFilterChange("experience", level)}
                />
                <Label htmlFor={`exp-${level}`} className="text-sm font-normal cursor-pointer">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Location</h3>
          <div className="space-y-2">
            {locations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`loc-${location}`}
                  checked={filters.location.includes(location)}
                  onCheckedChange={() => handleFilterChange("location", location)}
                />
                <Label htmlFor={`loc-${location}`} className="text-sm font-normal cursor-pointer">
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Salary Range</h3>
          <div className="space-y-2">
            {salaryRanges.map((range) => (
              <div key={range} className="flex items-center space-x-2">
                <Checkbox
                  id={`salary-${range}`}
                  checked={filters.salaryRange.includes(range)}
                  onCheckedChange={() => handleFilterChange("salaryRange", range)}
                />
                <Label htmlFor={`salary-${range}`} className="text-sm font-normal cursor-pointer">
                  {range}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
