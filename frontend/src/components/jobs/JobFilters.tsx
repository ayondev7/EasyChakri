"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface JobFiltersProps {
  filters: {
    jobType: string
    experience: string
    category: string
    salaryRange: string
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      jobType: string
      experience: string
      category: string
      salaryRange: string
    }>
  >
}

const jobTypes = [
  { value: "", label: "All Types" },
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "REMOTE", label: "Remote" },
]

const experienceLevels = [
  { value: "", label: "All Levels" },
  { value: "fresher", label: "Fresher (0-2 years)" },
  { value: "mid", label: "Mid-Level (2-5 years)" },
  { value: "senior", label: "Senior (5+ years)" },
]

const categories = [
  { value: "", label: "All Categories" },
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Product", label: "Product" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "Data Science", label: "Data Science" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "HR" },
  { value: "Operations", label: "Operations" },
]

const salaryRanges = [
  { value: "", label: "All Ranges" },
  { value: "0-50000", label: "$0 - $50k" },
  { value: "50000-100000", label: "$50k - $100k" },
  { value: "100000-150000", label: "$100k - $150k" },
  { value: "150000-999999", label: "$150k+" },
]

export function JobFilters({ filters, setFilters }: JobFiltersProps) {
  const handleFilterChange = (category: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      jobType: "",
      experience: "",
      category: "",
      salaryRange: "",
    })
  }

  const hasActiveFilters =
    filters.jobType !== "" ||
    filters.experience !== "" ||
    filters.category !== "" ||
    filters.salaryRange !== ""

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
          <RadioGroup value={filters.jobType} onValueChange={(value) => handleFilterChange("jobType", value)}>
            {jobTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <RadioGroupItem value={type.value} id={`type-${type.value}`} />
                <Label htmlFor={`type-${type.value}`} className="text-sm font-normal cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Experience Level</h3>
          <RadioGroup value={filters.experience} onValueChange={(value) => handleFilterChange("experience", value)}>
            {experienceLevels.map((level) => (
              <div key={level.value} className="flex items-center space-x-2">
                <RadioGroupItem value={level.value} id={`exp-${level.value}`} />
                <Label htmlFor={`exp-${level.value}`} className="text-sm font-normal cursor-pointer">
                  {level.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Category</h3>
          <RadioGroup value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
            {categories.map((cat) => (
              <div key={cat.value} className="flex items-center space-x-2">
                <RadioGroupItem value={cat.value} id={`cat-${cat.value}`} />
                <Label htmlFor={`cat-${cat.value}`} className="text-sm font-normal cursor-pointer">
                  {cat.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Salary Range</h3>
          <RadioGroup value={filters.salaryRange} onValueChange={(value) => handleFilterChange("salaryRange", value)}>
            {salaryRanges.map((range) => (
              <div key={range.value} className="flex items-center space-x-2">
                <RadioGroupItem value={range.value} id={`salary-${range.value}`} />
                <Label htmlFor={`salary-${range.value}`} className="text-sm font-normal cursor-pointer">
                  {range.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
