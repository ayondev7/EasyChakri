"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Building2 } from "lucide-react"
import CompanyProfileForm from "@/components/recruiter/CompanyProfileForm"

export default function CompanyProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)

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

    // Check if company profile exists in localStorage
    const profile = localStorage.getItem(`company_profile_${user?.id}`)
    setHasProfile(!!profile)
  }, [isAuthenticated, user, router, authLoading])

  // Show loading state while session is being checked
  if (authLoading) {
    return null
  }

  // Don't render page until authenticated
  if (!isAuthenticated || !user || user.role !== "recruiter") {
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const profileData = {
      companyName: formData.get("companyName"),
      industry: formData.get("industry"),
      size: formData.get("size"),
      location: formData.get("location"),
      website: formData.get("website"),
      description: formData.get("description"),
    }

    // Save to localStorage
    localStorage.setItem(`company_profile_${user?.id}`, JSON.stringify(profileData))

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    router.push("/recruiter/dashboard")
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
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onCancel={hasProfile ? () => router.back() : undefined}
      />
    </div>
  )
}
