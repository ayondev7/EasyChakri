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

  const company = companyData?.data
  const hasProfile = !!company && !companyError

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated || !user) {
      router.push("/auth/signin")
      return
    }
    
    if (user.role !== "RECRUITER") {
      router.push("/auth/signin")
      return
    }
  }, [isAuthenticated, user, router, authLoading])

  if (authLoading || (companyLoading && !companyError)) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <Loader />
      </div>
    )
  }

  if (!isAuthenticated || !user || user.role !== "RECRUITER") {
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
        await updateCompany.mutateAsync({
          id: company.id,
          ...companyData,
        })
        toast.success("Company profile updated successfully!")
      } else {
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
                size: company.size,
                location: company.location,
                website: company.website,
                description: company.description,
              }
            : undefined
        }
      />
    </div>
  )
}
