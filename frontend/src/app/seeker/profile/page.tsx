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
  const [isFormInitialized, setIsFormInitialized] = useState(false)

  const [formData, setFormData] = useState<{
    name: string
    phone: string
    location: string
    bio: string
    experience: string
    education: string
    skills: string[]
    resume: string
  }>({
    name: "",
    phone: "",
    location: "",
    bio: "",
    experience: "",
    education: "",
    skills: [],
    resume: "",
  })

  // Initialize form data only once when user data is first available
  useEffect(() => {
    if (user && !isFormInitialized) {
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
      setIsFormInitialized(true)
    }
  }, [user, isFormInitialized])

  // Reset form initialization when entering edit mode to get latest user data
  const handleEditClick = () => {
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
    setIsEditing(true)
  }

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
      // Only send fields that have actually changed
      const changedFields: any = {};
      
      if (formData.name !== user.name) changedFields.name = formData.name;
      if (formData.phone !== user.phone) changedFields.phone = formData.phone;
      if (formData.location !== user.location) changedFields.location = formData.location;
      if (formData.bio !== user.bio) changedFields.bio = formData.bio;
      if (formData.experience !== user.experience) changedFields.experience = formData.experience;
      if (formData.education !== user.education) changedFields.education = formData.education;
      if (formData.resume !== user.resume) changedFields.resume = formData.resume;
      
      // Compare skills arrays
      const skillsChanged = JSON.stringify(formData.skills?.sort()) !== JSON.stringify(user.skills?.sort());
      if (skillsChanged) changedFields.skills = formData.skills;

      // If no fields changed, show info message
      if (Object.keys(changedFields).length === 0) {
        toast.success("No changes to save");
        setIsEditing(false);
        return;
      }

      await updateProfile.mutateAsync(changedFields);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        // Handle validation errors array
        toast.error(errorMessage.join(', '));
      } else {
        toast.error(errorMessage || "Failed to update profile");
      }
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
            <Button onClick={handleEditClick} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
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
