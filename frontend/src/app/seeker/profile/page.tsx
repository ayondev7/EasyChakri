"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { useUpdateUserProfile, useUserProfileInformation } from "@/hooks"
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
  const { data: profileResp, isLoading: profileLoading } = useUserProfileInformation()
  const profileUser = profileResp?.data
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

  useEffect(() => {
    if (profileUser && !isFormInitialized) {
      setFormData({
        name: profileUser.name || "",
        phone: profileUser.phone || "",
        location: profileUser.location || "",
        bio: profileUser.bio || "",
        experience: profileUser.experience || "",
        education: profileUser.education || "",
        skills: profileUser.skills || [],
        resume: profileUser.resume || "",
      })
      setIsFormInitialized(true)
    }
  }, [profileUser, isFormInitialized])

  const handleEditClick = () => {
    if (profileUser) {
      setFormData({
        name: profileUser.name || "",
        phone: profileUser.phone || "",
        location: profileUser.location || "",
        bio: profileUser.bio || "",
        experience: profileUser.experience || "",
        education: profileUser.education || "",
        skills: profileUser.skills || [],
        resume: profileUser.resume || "",
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

  if (isLoading || profileLoading) {
    return null
  }

  if (!isAuthenticated || !user || user.role !== "seeker" || !profileUser) {
    return null
  }

  const handleFormChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      const changedFields: any = {};
      
  if (formData.name !== profileUser.name) changedFields.name = formData.name;
  if (formData.phone !== profileUser.phone) changedFields.phone = formData.phone;
  if (formData.location !== profileUser.location) changedFields.location = formData.location;
  if (formData.bio !== profileUser.bio) changedFields.bio = formData.bio;
  if (formData.experience !== profileUser.experience) changedFields.experience = formData.experience;
  if (formData.education !== profileUser.education) changedFields.education = formData.education;
  if (formData.resume !== profileUser.resume) changedFields.resume = formData.resume;
      
  const skillsChanged = JSON.stringify(formData.skills?.sort()) !== JSON.stringify((profileUser.skills || [])?.sort());
      if (skillsChanged) changedFields.skills = formData.skills;

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
        toast.error(errorMessage.join(', '));
      } else {
        toast.error(errorMessage || "Failed to update profile");
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profileUser.name || "",
      phone: profileUser.phone || "",
      location: profileUser.location || "",
      bio: profileUser.bio || "",
      experience: profileUser.experience || "",
      education: profileUser.education || "",
      skills: profileUser.skills || [],
      resume: profileUser.resume || "",
    })
    setIsEditing(false)
  }

  return (
    <div>
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
        <ProfileHeader user={profileUser} />

        <PersonalInfoCard
          user={profileUser}
          isEditing={isEditing}
          formData={formData}
          onFormChange={handleFormChange}
        />

        <ProfessionalInfoCard
          user={profileUser}
          isEditing={isEditing}
          formData={formData}
          onFormChange={handleFormChange}
        />

        <ResumeCard
          user={profileUser}
          isEditing={isEditing}
          formData={formData}
          onFormChange={handleFormChange}
        />
      </div>
    </div>
  )
}
