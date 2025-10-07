import React, { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import InputField from "@/components/form/InputField"
import TextareaField from "@/components/form/TextareaField"
import SignUpCard from "@/components/auth/signup/SignUpCard"
import CompanySection from "@/components/auth/signup/CompanySection"

const seekerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast.error("Logo must be JPG, JPEG, PNG, or WEBP")
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Logo must be less than 3MB")
      return
    }

    setLogoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const onSubmitSeeker = async (data: SeekerFormData) => {
    setIsLoading(true)

    try {
      const callbackUrl = "/seeker/dashboard"
      const result = await signIn("credentials-signup", {
        email: data.email,
        password: data.password,
        name: data.name,
        role: "SEEKER",
        callbackUrl,
      })

      if (!result) {
        toast.error("Failed to create account. Please try again.")
      } else if ((result as any).error) {
        const err = (result as any).error
        toast.error(typeof err === 'string' ? err : 'Failed to create account. Please try again.')
      } else {
        toast.success("🎉 Welcome to EasyChakri!")
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
      const callbackUrl = "/recruiter/dashboard"
      const result = await signIn("credentials-signup", {
        email: data.email,
        password: data.password,
        name: data.name,
        role: "RECRUITER",
        companyName: data.companyName,
        companyDescription: data.companyDescription,
        companyWebsite: data.companyWebsite || undefined,
        companyIndustry: data.companyIndustry,
        companySize: data.companySize,
        companyLocation: data.companyLocation,
        companyLogo: logoPreview || undefined,
        callbackUrl,
      })

      if (!result) {
        toast.error("Failed to create account. Please try again.")
      } else if ((result as any).error) {
        const err = (result as any).error
        toast.error(typeof err === 'string' ? err : 'Failed to create account. Please try again.')
      } else {
        toast.success("🎉 Welcome to EasyChakri!")
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

      {role === "recruiter" && (
        <CompanySection register={registerRecruiter} errors={errorsRecruiter} onLogoChange={handleLogoChange} logoPreview={logoPreview} />
      )}
    </SignUpCard>
  )
}