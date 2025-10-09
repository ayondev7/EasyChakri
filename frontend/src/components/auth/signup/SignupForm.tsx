import React, { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import InputField from "@/components/form/InputField"
import TextareaField from "@/components/form/TextareaField"
import FileInput from "@/components/form/FileInput"
import SignUpCard from "@/components/auth/signup/SignUpCard"
import CompanySection from "@/components/auth/signup/CompanySection"

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
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [seekerImageFile, setSeekerImageFile] = useState<File | null>(null)
  const [seekerImagePreview, setSeekerImagePreview] = useState<string>("")
  const [recruiterImageFile, setRecruiterImageFile] = useState<File | null>(null)
  const [recruiterImagePreview, setRecruiterImagePreview] = useState<string>("")

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

  const handleLogoChange = (file: File | null) => {
    if (!file) {
      setLogoFile(null)
      setLogoPreview("")
      return
    }

    setLogoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

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

  const onSubmitSeeker = async (data: SeekerFormData) => {
    setIsLoading(true)

    try {
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

      // Call custom signup API
      const response = await fetch("/api/signup", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || "Failed to create account. Please try again.")
        return
      }

      // After successful signup, sign in with credentials
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

      if (logoFile) {
        formData.append("companyLogo", logoFile)
      }

      if (recruiterImageFile) {
        formData.append("image", recruiterImageFile)
      }

      // Call custom signup API
      const response = await fetch("/api/signup", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || "Failed to create account. Please try again.")
        return
      }

      // After successful signup, sign in with credentials
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
      <div className="space-y-2">
        <InputField id="name" label="Full Name" type="text" placeholder="John Doe" {...(role === "seeker" ? registerSeeker("name") : registerRecruiter("name"))} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <InputField id="email" label="Email" type="email" placeholder="you@example.com" {...(role === "seeker" ? registerSeeker("email") : registerRecruiter("email"))} />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <InputField id="password" label="Password" type="password" placeholder="••••••••" {...(role === "seeker" ? registerSeeker("password") : registerRecruiter("password"))} />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <InputField id="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" {...(role === "seeker" ? registerSeeker("confirmPassword") : registerRecruiter("confirmPassword"))} />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {role === "seeker" && (
        <>
          <div className="space-y-2">
            <InputField id="dateOfBirth" label="Date of Birth" type="date" {...registerSeeker("dateOfBirth" as any)} />
            {errorsSeeker.dateOfBirth && (
              <p className="text-xs text-destructive">{errorsSeeker.dateOfBirth.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <InputField id="phone" label="Phone" type="tel" placeholder="(123) 456-7890" {...registerSeeker("phone" as any)} />
            {errorsSeeker.phone && (
              <p className="text-xs text-destructive">{errorsSeeker.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <FileInput id="seekerImage" label="Profile Image (Optional)" accept=".jpg,.jpeg,.png,.webp" onFileChange={handleSeekerImageChange} preview={seekerImagePreview} />
            <p className="text-xs text-muted-foreground">JPG, JPEG, PNG, or WEBP (Max 3MB)</p>
          </div>
        </>
      )}

      {role === "recruiter" && (
        <>
          <CompanySection register={registerRecruiter} errors={errorsRecruiter} onLogoChange={handleLogoChange} logoPreview={logoPreview} />

          <div className="space-y-2 mt-3">
            <FileInput id="recruiterImage" label="Profile Image (Optional)" accept=".jpg,.jpeg,.png,.webp" onFileChange={handleRecruiterImageChange} preview={recruiterImagePreview} />
            <p className="text-xs text-muted-foreground">JPG, JPEG, PNG, or WEBP (Max 3MB)</p>
          </div>
        </>
      )}
    </SignUpCard>
  )
}