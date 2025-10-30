"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import SelectField from "@/components/form/SelectField"
import SliderField from "@/components/form/SliderField"
import {
  jobTypes,
  experienceLevels,
  categories,
  salaryMarks,
  getSalaryRangeFromIndex,
  getIndexFromSalaryRange,
} from "@/constants/jobFilters"

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
