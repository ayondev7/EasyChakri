"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useApplyForJob, useCheckProfileComplete } from "@/hooks"
import { toast } from "react-hot-toast"
import apiClient from "@/utils/apiClient"
import { USER_ROUTES } from "@/routes"

interface ApplyButtonProps {
  jobId: string
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export default function ApplyButton({ jobId, className, variant = "default", size = "default" }: ApplyButtonProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(false)
  const applyForJob = useApplyForJob()

  const checkAndApply = async () => {
    setIsChecking(true)
    try {
      const { data } = await apiClient.get(USER_ROUTES.checkProfileComplete)
      
      if (!data.isComplete) {
        const missingFieldsMap: Record<string, string> = {
          name: "Full Name",
          phone: "Phone Number",
          location: "Location",
          bio: "Bio",
          skills: "Skills",
          experience: "Years of Experience",
          education: "Education",
          resume: "Resume (Google Drive Link)",
        }
        
        const missingFieldsDisplay = data.missingFields.map((field: string) => missingFieldsMap[field]).join(", ")
        
        toast.error(
          `Please complete your profile before applying. Missing: ${missingFieldsDisplay}`,
          { duration: 6000 }
        )
        
        setTimeout(() => {
          router.push("/seeker/profile")
        }, 1000)
        return
      }

      await applyForJob.mutateAsync({ jobId })
      toast.success("Application submitted!")
      
      setTimeout(() => {
        router.push("/seeker/dashboard")
      }, 1500)
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("already applied")) {
        toast.error("You have already applied for this job")
      } else {
        toast.error(error?.response?.data?.message || "Failed to submit application")
      }
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Button
      onClick={checkAndApply}
      className={className}
      variant={variant}
      size={size}
      disabled={isChecking || applyForJob.isPending}
    >
      {isChecking || applyForJob.isPending ? "Applying..." : "Apply Now"}
    </Button>
  )
}
