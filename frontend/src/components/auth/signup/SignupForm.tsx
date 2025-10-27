import React, { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import SignUpCard from "@/components/auth/signup/SignUpCard"
import SeekerForm from "@/components/auth/signup/SeekerForm"
import RecruiterForm from "@/components/auth/signup/RecruiterForm"

const seekerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  dateOfBirth: z.string().refine((d) => !isNaN(Date.parse(d)), "Please provide a valid date of birth"),
  phone: z.string().min(6, "Phone number is required"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

const recruiterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  companyName: z.string().min(2, "Company name is required"),
  companyDescription: z.string().min(10, "Company description must be at least 10 characters"),
  companyWebsite: z.string().url("Please provide a valid URL").optional().or(z.literal("")),
  companyIndustry: z.string().min(2, "Industry is required"),
  companySize: z.string().min(1, "Company size is required"),
  companyLocation: z.string().min(2, "Company location is required"),
  companyLogo: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type SeekerFormData = z.infer<typeof seekerSchema>
type RecruiterFormData = z.infer<typeof recruiterSchema>

export default function SignupForm({ role }: { role: "seeker" | "recruiter" }) {
  const [isLoading, setIsLoading] = useState(false)
  const [seekerImageFile, setSeekerImageFile] = useState<File | null>(null)
  const [seekerImagePreview, setSeekerImagePreview] = useState<string>("")
  const [recruiterImageFile, setRecruiterImageFile] = useState<File | null>(null)
  const [recruiterImagePreview, setRecruiterImagePreview] = useState<string>("")
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null)
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string>("")

  const {
    register: registerSeeker,
    handleSubmit: handleSubmitSeeker,
    formState: { errors: errorsSeeker },
  } = useForm<SeekerFormData>({
    resolver: zodResolver(seekerSchema),
  })

  const {
    register: registerRecruiter,
    handleSubmit: handleSubmitRecruiter,
    formState: { errors: errorsRecruiter },
  } = useForm<RecruiterFormData>({
    resolver: zodResolver(recruiterSchema),
  })

  const handleSeekerImageChange = (file: File | null) => {
    if (!file) {
      setSeekerImageFile(null)
      setSeekerImagePreview("")
      return
    }
    
    setSeekerImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setSeekerImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRecruiterImageChange = (file: File | null) => {
    if (!file) {
      setRecruiterImageFile(null)
      setRecruiterImagePreview("")
      return
    }
    
    setRecruiterImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setRecruiterImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCompanyLogoChange = (file: File | null) => {
    if (!file) {
      setCompanyLogoFile(null)
      setCompanyLogoPreview("")
      return
    }

    setCompanyLogoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setCompanyLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const onSubmitSeeker = async (data: SeekerFormData) => {
    setIsLoading(true)

    try {
      if (!seekerImageFile) {
        toast.error("Profile image is required")
        setIsLoading(false)
        return
      }
      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("password", data.password)
      formData.append("name", data.name)
      formData.append("role", "SEEKER")
      formData.append("dateOfBirth", data.dateOfBirth)
      formData.append("phone", data.phone)
      
      if (seekerImageFile) {
        formData.append("image", seekerImageFile)
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || "Failed to create account. Please try again.")
        return
      }

      const signInResult = await signIn("credentials-signin", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        toast.error("Account created but failed to sign in. Please sign in manually.")
      } else if (signInResult?.ok) {
        toast.success("🎉 Welcome to EasyChakri!")
        window.location.href = "/seeker/dashboard"
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitRecruiter = async (data: RecruiterFormData) => {
    setIsLoading(true)

    try {
      if (!companyLogoFile) {
        toast.error("Company logo is required")
        setIsLoading(false)
        return
      }

      if (!recruiterImageFile) {
        toast.error("Profile image is required")
        setIsLoading(false)
        return
      }

      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("password", data.password)
      formData.append("name", data.name)
      formData.append("role", "RECRUITER")
      formData.append("companyName", data.companyName)
      formData.append("companyDescription", data.companyDescription)
      formData.append("companyIndustry", data.companyIndustry)
      formData.append("companySize", data.companySize)
      formData.append("companyLocation", data.companyLocation)
      
      if (data.companyWebsite) {
        formData.append("companyWebsite", data.companyWebsite)
      }

      if (companyLogoFile) {
        formData.append("companyLogo", companyLogoFile)
      }

      if (recruiterImageFile) {
        formData.append("image", recruiterImageFile)
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || "Failed to create account. Please try again.")
        return
      }

      const signInResult = await signIn("credentials-signin", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        toast.error("Account created but failed to sign in. Please sign in manually.")
      } else if (signInResult?.ok) {
        toast.success("🎉 Welcome to EasyChakri!")
        window.location.href = "/recruiter/dashboard"
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const errors = role === "seeker" ? errorsSeeker : errorsRecruiter

  return (
    <SignUpCard
      role={role}
      isLoading={isLoading}
      onSubmit={role === "seeker" ? handleSubmitSeeker(onSubmitSeeker) : handleSubmitRecruiter(onSubmitRecruiter)}
      checkboxRegister={role === "seeker" ? registerSeeker("terms") : registerRecruiter("terms")}
      checkboxError={errors.terms}
      footerExtra={<p className="text-sm text-center text-muted-foreground">Already have an account? <Link href="/auth/signin" className="text-emerald-500 hover:underline font-medium">Sign in</Link></p>}
    >
      {role === "seeker" ? (
        <SeekerForm registerSeeker={registerSeeker} errorsSeeker={errorsSeeker} seekerImagePreview={seekerImagePreview} handleSeekerImageChange={handleSeekerImageChange} />
      ) : (
        <RecruiterForm registerRecruiter={registerRecruiter} errorsRecruiter={errorsRecruiter} companyLogoPreview={companyLogoPreview} handleCompanyLogoChange={handleCompanyLogoChange} recruiterImagePreview={recruiterImagePreview} handleRecruiterImageChange={handleRecruiterImageChange} />
      )}
    </SignUpCard>
  )
}