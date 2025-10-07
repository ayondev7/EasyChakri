"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

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

export default function SignUpPage() {
  const router = useRouter()
  const [role, setRole] = useState<"seeker" | "recruiter">("seeker")
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
      const result = await signIn("credentials-signup", {
        email: data.email,
        password: data.password,
        name: data.name,
        role: "SEEKER",
        redirect: false,
      })

      if (!result) {
        toast.error("Failed to create account. Please try again.")
      } else if ((result as any).error) {
        // NextAuth sometimes returns error string
        const err = (result as any).error
        toast.error(typeof err === 'string' ? err : 'Failed to create account. Please try again.')
      } else if ((result as any).ok || (result as any).url) {
        toast.success("🎉 Welcome to EasyChakri!")
        // If NextAuth returned a url (sometimes), prefer it
        const url = (result as any).url || "/seeker/dashboard"
        router.push(url)
      } else {
        toast.error("Failed to create account. Please try again.")
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
        redirect: false,
      })

      if (!result) {
        toast.error("Failed to create account. Please try again.")
      } else if ((result as any).error) {
        const err = (result as any).error
        toast.error(typeof err === 'string' ? err : 'Failed to create account. Please try again.')
      } else if ((result as any).ok || (result as any).url) {
        toast.success("🎉 Welcome to EasyChakri!")
        const url = (result as any).url || "/recruiter/dashboard"
        router.push(url)
      } else {
        toast.error("Failed to create account. Please try again.")
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const errors = role === "seeker" ? errorsSeeker : errorsRecruiter

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-500 mb-4">
              <Briefcase className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join thousands of job seekers and recruiters</p>
          </div>

          <Tabs value={role} onValueChange={(v) => setRole(v as "seeker" | "recruiter")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="seeker">Job Seeker</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                {role === "seeker"
                  ? "Create your job seeker account to start applying"
                  : "Create your recruiter account and company profile to post jobs"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={role === "seeker" ? handleSubmitSeeker(onSubmitSeeker) : handleSubmitRecruiter(onSubmitRecruiter)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...(role === "seeker" ? registerSeeker("name") : registerRecruiter("name"))}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...(role === "seeker" ? registerSeeker("email") : registerRecruiter("email"))}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...(role === "seeker" ? registerSeeker("password") : registerRecruiter("password"))}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...(role === "seeker" ? registerSeeker("confirmPassword") : registerRecruiter("confirmPassword"))}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {role === "recruiter" && (
                  <>
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Tech Corp Inc."
                        {...registerRecruiter("companyName")}
                      />
                      {errorsRecruiter.companyName && (
                        <p className="text-xs text-destructive">{errorsRecruiter.companyName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyDescription">Company Description</Label>
                      <Textarea
                        id="companyDescription"
                        placeholder="Tell us about your company..."
                        className="min-h-[100px]"
                        {...registerRecruiter("companyDescription")}
                      />
                      {errorsRecruiter.companyDescription && (
                        <p className="text-xs text-destructive">{errorsRecruiter.companyDescription.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyIndustry">Industry</Label>
                        <Input
                          id="companyIndustry"
                          type="text"
                          placeholder="Technology"
                          {...registerRecruiter("companyIndustry")}
                        />
                        {errorsRecruiter.companyIndustry && (
                          <p className="text-xs text-destructive">{errorsRecruiter.companyIndustry.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companySize">Company Size</Label>
                        <Input
                          id="companySize"
                          type="text"
                          placeholder="50-100"
                          {...registerRecruiter("companySize")}
                        />
                        {errorsRecruiter.companySize && (
                          <p className="text-xs text-destructive">{errorsRecruiter.companySize.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyLocation">Location</Label>
                      <Input
                        id="companyLocation"
                        type="text"
                        placeholder="New York, USA"
                        {...registerRecruiter("companyLocation")}
                      />
                      {errorsRecruiter.companyLocation && (
                        <p className="text-xs text-destructive">{errorsRecruiter.companyLocation.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite">Website (Optional)</Label>
                      <Input
                        id="companyWebsite"
                        type="url"
                        placeholder="https://example.com"
                        {...registerRecruiter("companyWebsite")}
                      />
                      {errorsRecruiter.companyWebsite && (
                        <p className="text-xs text-destructive">{errorsRecruiter.companyWebsite.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyLogo">Company Logo (Optional)</Label>
                      <Input
                        id="companyLogo"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleLogoChange}
                      />
                      <p className="text-xs text-muted-foreground">JPG, JPEG, PNG, or WEBP (Max 3MB)</p>
                      {logoPreview && (
                        <div className="mt-2">
                          <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-cover rounded-lg border" />
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-border"
                    {...(role === "seeker" ? registerSeeker("terms") : registerRecruiter("terms"))}
                  />
                  <span className="text-muted-foreground">
                    I agree to the{" "}
                    <Link href="/terms" className="text-emerald-500 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-emerald-500 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </div>
                {errors.terms && (
                  <p className="text-xs text-destructive">{errors.terms.message}</p>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-emerald-500 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
