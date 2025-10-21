"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { useUpdateUserProfile } from "@/hooks"
import { toast } from "react-hot-toast"
import ProfileHeader from "@/components/profile/ProfileHeader"
import PersonalInfoCard from "@/components/profile/PersonalInfoCard"
import ProfessionalInfoCard from "@/components/profile/ProfessionalInfoCard"
import ResumeCard from "@/components/profile/ResumeCard"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const updateProfile = useUpdateUserProfile()

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
    experience: user?.experience || "",
    education: user?.education || "",
    skills: user?.skills || [],
    resume: user?.resume || "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        experience: user.experience || "",
        education: user.education || "",
        skills: user.skills || [],
        resume: user.resume || "",
      })
    }
  }, [user])

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !user) {
      router.push("/auth/signin")
      return
    }
    
    if (user.role !== "seeker") {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, user, router, isLoading])

  if (isLoading) {
    return null
  }

  if (!isAuthenticated || !user || user.role !== "seeker") {
    return null
  }

  const handleFormChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData)
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile")
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
      experience: user.experience || "",
      education: user.education || "",
      skills: user.skills || [],
      resume: user.resume || "",
    })
    setIsEditing(false)
  }

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and preferences</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <ProfileHeader user={user} />

          <PersonalInfoCard
            user={user}
            isEditing={isEditing}
            formData={formData}
            onFormChange={handleFormChange}
          />

          <ProfessionalInfoCard
            user={user}
            isEditing={isEditing}
            formData={formData}
            onFormChange={handleFormChange}
          />

          <ResumeCard
            user={user}
            isEditing={isEditing}
            formData={formData}
            onFormChange={handleFormChange}
          />
        </div>
      </div>
    </main>
  )
}
