"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Building2 } from "lucide-react"
import CompanyProfileForm from "@/components/recruiter/CompanyProfileForm"
import { useMyCompany, useCreateCompany, useUpdateCompany } from "@/hooks/companyHooks"
import { toast } from "react-hot-toast"
import Loader from "@/components/Loader"

export default function CompanyProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: companyData, isLoading: companyLoading, error: companyError } = useMyCompany()
  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If there's a 404 error, it means the company doesn't exist yet, which is fine
  const company = companyData?.data
  const hasProfile = !!company && !companyError

  useEffect(() => {
    // Don't redirect while session is still loading
    if (authLoading) return

    // Redirect if not authenticated or wrong role
    if (!isAuthenticated || !user) {
      router.push("/auth/signin")
      return
    }
    
    if (user.role !== "recruiter") {
      router.push("/auth/signin")
      return
    }
  }, [isAuthenticated, user, router, authLoading])

  // Show loading state while session and company data are being fetched
  // Don't show loading if there's an error (likely 404 meaning no company yet)
  if (authLoading || (companyLoading && !companyError)) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <Loader />
      </div>
    )
  }

  // Don't render page until authenticated
  if (!isAuthenticated || !user || user.role !== "recruiter") {
    return null
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      const companyData = {
        name: formData.get("companyName") as string,
        industry: formData.get("industry") as string,
        size: formData.get("size") as string,
        location: formData.get("location") as string,
        website: formData.get("website") as string,
        description: formData.get("description") as string,
      }

      if (hasProfile && company?.id) {
        // Update existing company
        await updateCompany.mutateAsync({
          id: company.id,
          ...companyData,
        })
        toast.success("Company profile updated successfully!")
      } else {
        // Create new company
        await createCompany.mutateAsync(companyData)
        toast.success("Company profile created successfully!")
      }

      router.push("/recruiter/dashboard")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save company profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-lg bg-emerald-500/10 text-emerald-500 mb-4">
          <Building2 className="h-8 w-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {hasProfile ? "Update Company Profile" : "Complete Your Company Profile"}
        </h1>
        <p className="text-muted-foreground">
          {hasProfile
            ? "Keep your company information up to date"
            : "You need to add your company details before posting jobs"}
        </p>
      </div>

      <CompanyProfileForm
        hasProfile={hasProfile}
        isLoading={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={hasProfile ? () => router.back() : undefined}
        defaultValues={
          company
            ? {
                companyName: company.name,
                industry: company.industry,
                size: company.size || undefined,
                location: company.location,
                website: company.website || undefined,
                description: company.description,
              }
            : undefined
        }
      />
    </div>
  )
}
