"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// Header and Footer provided by root layout
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Building2 } from "lucide-react"

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
      <main className="py-8">
        <div className="container mx-auto px-4 max-w-3xl">
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

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input id="companyName" name="companyName" placeholder="e.g., Tech Innovations Inc." required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select name="industry" required>
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size *</Label>
                    <Select name="size" required>
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501-1000">501-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Headquarters Location *</Label>
                  <Input id="location" name="location" placeholder="e.g., San Francisco, CA" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input id="website" name="website" type="url" placeholder="https://www.example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Tell us about your company, its mission, and what makes it unique..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  {hasProfile && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
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
        </div>
      </main>
  )
}
