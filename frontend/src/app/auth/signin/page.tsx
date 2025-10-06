"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { Briefcase, Loader2 } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [role, setRole] = useState<"seeker" | "recruiter">("seeker")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password, role)
      if (role === "seeker") {
        router.push("/seeker/dashboard")
      } else {
        router.push("/recruiter/dashboard")
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar/>
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-500 mb-4">
              <Briefcase className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <Tabs value={role} onValueChange={(v) => setRole(v as "seeker" | "recruiter")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="seeker">Job Seeker</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={role === "recruiter" ? "recruiter@techcorp.com" : "you@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {role === "recruiter" && (
                    <p className="text-xs text-muted-foreground">
                      Try: recruiter@techcorp.com, recruiter@dataflow.com, or recruiter@cloudnine.com
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-emerald-500 hover:underline">
                    Forgot password?
                  </Link>
                </div>
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
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-emerald-500 hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          <div className="text-center mt-6 p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              <strong>Demo Mode:</strong> Any password will work. For recruiters, use the suggested emails above or any email to get demo data.
            </p>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-6">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-emerald-500 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-emerald-500 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
      {/* Footer provided by root layout */}
    </div>
  )
}
