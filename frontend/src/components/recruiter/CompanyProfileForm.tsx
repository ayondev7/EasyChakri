"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import InputField from "@/components/form/InputField"
import TextareaField from "@/components/form/TextareaField"
import SelectFieldWithLabel from "@/components/form/SelectFieldWithLabel"

interface CompanyProfileFormProps {
  hasProfile: boolean
  isLoading: boolean
  onSubmit: (data: FormData) => Promise<void>
  onCancel?: () => void
  defaultValues?: {
    companyName?: string
    industry?: string
    size?: string
    location?: string
    website?: string
    description?: string
  }
}

const INDUSTRY_OPTIONS = [
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
  { label: "1-10 employees", value: "1-10" },
  { label: "11-50 employees", value: "11-50" },
  { label: "51-200 employees", value: "51-200" },
  { label: "201-500 employees", value: "201-500" },
  { label: "501-1000 employees", value: "501-1000" },
  { label: "1000+ employees", value: "1000+" },
]

export default function CompanyProfileForm({ hasProfile, isLoading, onSubmit, onCancel, defaultValues }: CompanyProfileFormProps) {
  const [formData, setFormData] = useState<{
    companyName: string
    industry: string | undefined
    size: string | undefined
    location: string
    website: string
    description: string
  }>({
    companyName: defaultValues?.companyName || "",
    industry: defaultValues?.industry || undefined,
    size: defaultValues?.size || undefined,
    location: defaultValues?.location || "",
    website: defaultValues?.website || "",
    description: defaultValues?.description || "",
  })

  // Update form when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      setFormData({
        companyName: defaultValues.companyName || "",
        industry: defaultValues.industry || undefined,
        size: defaultValues.size || undefined,
        location: defaultValues.location || "",
        website: defaultValues.website || "",
        description: defaultValues.description || "",
      })
    }
  }, [defaultValues])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formDataObj = new FormData(e.currentTarget)
    await onSubmit(formDataObj)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            id="companyName"
            name="companyName"
            label="Company Name *"
            placeholder="e.g., Tech Innovations Inc."
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectFieldWithLabel
              id="industry"
              name="industry"
              label="Industry"
              options={INDUSTRY_OPTIONS}
              placeholder="Select industry"
              value={formData.industry}
              onChange={(value) => setFormData({ ...formData, industry: value })}
              required
            />

            <SelectFieldWithLabel
              id="size"
              name="size"
              label="Company Size"
              options={COMPANY_SIZE_OPTIONS}
              placeholder="Select size"
              value={formData.size}
              onChange={(value) => setFormData({ ...formData, size: value })}
              required
            />
          </div>

          <InputField
            id="location"
            name="location"
            label="Headquarters Location *"
            placeholder="e.g., San Francisco, CA"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />

          <InputField
            id="website"
            name="website"
            type="url"
            label="Company Website"
            placeholder="https://www.example.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />

          <TextareaField
            id="description"
            name="description"
            label="Company Description *"
            placeholder="Tell us about your company, its mission, and what makes it unique..."
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
