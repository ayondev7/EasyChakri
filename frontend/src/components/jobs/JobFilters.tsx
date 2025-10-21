"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import SelectField from "@/components/form/SelectField"
import SliderField from "@/components/form/SliderField"

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

const salaryMarks = [
  { value: 0, label: "$0" },
  { value: 1, label: "$50k" },
  { value: 2, label: "$100k" },
  { value: 3, label: "$150k+" },
]

const getSalaryRangeFromIndex = (index: number): string => {
  const ranges = ["", "0-50000", "50000-100000", "100000-150000", "150000-999999"]
  return ranges[index] || ""
}

const getIndexFromSalaryRange = (range: string): number => {
  const ranges = ["", "0-50000", "50000-100000", "100000-150000", "150000-999999"]
  return ranges.indexOf(range)
}

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
          <Label className="font-semibold mb-3 block">Job Type</Label>
          <SelectField
            options={jobTypes}
            value={filters.jobType}
            onChange={(value) => handleFilterChange("jobType", value)}
            placeholder="Select job type"
          />
        </div>

        <Separator />

        <div>
          <Label className="font-semibold mb-3 block">Experience Level</Label>
          <SelectField
            options={experienceLevels}
            value={filters.experience}
            onChange={(value) => handleFilterChange("experience", value)}
            placeholder="Select experience level"
          />
        </div>

        <Separator />

        <div>
          <Label className="font-semibold mb-3 block">Category</Label>
          <SelectField
            options={categories}
            value={filters.category}
            onChange={(value) => handleFilterChange("category", value)}
            placeholder="Select category"
          />
        </div>

        <Separator />

        <div>
          <Label className="font-semibold mb-3 block">Salary Range</Label>
          <SliderField
            value={getIndexFromSalaryRange(filters.salaryRange)}
            onChange={(index) => handleFilterChange("salaryRange", getSalaryRangeFromIndex(index))}
            min={0}
            max={4}
            step={1}
            marks={salaryMarks}
          />
        </div>
      </CardContent>
    </Card>
  )
}
