"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import InputField from "@/components/form/InputField"
import TextareaField from "@/components/form/TextareaField"
import SelectFieldWithLabel from "@/components/form/SelectFieldWithLabel"

interface CompanyProfileFormProps {
  hasProfile: boolean
  isLoading: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  onCancel?: () => void
}

const INDUSTRY_OPTIONS = [
  { label: "Select industry", value: "" },
  { label: "Technology", value: "Technology" },
  { label: "Finance", value: "Finance" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Education", value: "Education" },
  { label: "Retail", value: "Retail" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Consulting", value: "Consulting" },
  { label: "Other", value: "Other" },
]

const COMPANY_SIZE_OPTIONS = [
  { label: "Select size", value: "" },
  { label: "1-10 employees", value: "1-10" },
  { label: "11-50 employees", value: "11-50" },
  { label: "51-200 employees", value: "51-200" },
  { label: "201-500 employees", value: "201-500" },
  { label: "501-1000 employees", value: "501-1000" },
  { label: "1000+ employees", value: "1000+" },
]

export default function CompanyProfileForm({ hasProfile, isLoading, onSubmit, onCancel }: CompanyProfileFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <InputField
            id="companyName"
            name="companyName"
            label="Company Name *"
            placeholder="e.g., Tech Innovations Inc."
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectFieldWithLabel
              id="industry"
              name="industry"
              label="Industry"
              options={INDUSTRY_OPTIONS}
              placeholder="Select industry"
              required
            />

            <SelectFieldWithLabel
              id="size"
              name="size"
              label="Company Size"
              options={COMPANY_SIZE_OPTIONS}
              placeholder="Select size"
              required
            />
          </div>

          <InputField
            id="location"
            name="location"
            label="Headquarters Location *"
            placeholder="e.g., San Francisco, CA"
            required
          />

          <InputField
            id="website"
            name="website"
            type="url"
            label="Company Website"
            placeholder="https://www.example.com"
          />

          <TextareaField
            id="description"
            name="description"
            label="Company Description *"
            placeholder="Tell us about your company, its mission, and what makes it unique..."
            rows={6}
            required
          />

          <div className="flex gap-4 pt-4">
            {hasProfile && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : hasProfile ? (
                "Update Profile"
              ) : (
                "Save & Continue"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
