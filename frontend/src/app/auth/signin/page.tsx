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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import Header from "@/components/auth/signin/Header"
import SignInCard from "@/components/auth/signin/SignInCard"
import SigninForm from "@/components/auth/signin/SigninForm"

const signinSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
})

type SigninFormData = z.infer<typeof signinSchema>

export default function SignInPage() {
  const router = useRouter()
  const [role, setRole] = useState<"seeker" | "recruiter">("seeker")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  })

  const onSubmit = async (data: SigninFormData) => {
    setIsLoading(true)

    try {
      // Use NextAuth redirect flow so the session is fully established before navigating
      const callbackUrl = role === "seeker" ? "/seeker/dashboard" : "/recruiter/dashboard"
      const result = await signIn("credentials-signin", {
        email: data.email,
        password: data.password,
        callbackUrl,
      })

      // When redirect is enabled, NextAuth will handle navigation. We still show success toast.
      if (!result) {
        toast.error("Invalid credentials. Please try again.")
      } else if ((result as any).error) {
        const err = (result as any).error
        toast.error(typeof err === 'string' ? err : 'Invalid credentials. Please try again.')
      } else {
        toast.success("👋 Welcome back!")
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (role === "recruiter") {
      toast.error("Recruiters must sign up with company details")
      return
    }

    try {
      await signIn("google", { callbackUrl: "/seeker/dashboard" })
    } catch (err) {
      toast.error("An error occurred. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Header />

          <Tabs value={role} onValueChange={(v) => setRole(v as "seeker" | "recruiter")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="seeker">Job Seeker</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </Tabs>

          <SigninForm role={role} />
        </div>
      </main>
    </div>
  )
}
