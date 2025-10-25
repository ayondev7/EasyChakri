"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Loader from "@/components/Loader"

export default function AuthGuard({ children, role, fallback }: { children: React.ReactNode; role?: "seeker" | "recruiter"; fallback?: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !user) {
      const callback = typeof window !== "undefined" ? encodeURIComponent(window.location.pathname + window.location.search) : undefined
      const redirectTo = callback ? `/auth/signin?callbackUrl=${callback}` : "/auth/signin"
      router.push(redirectTo)
      return
    }

    if (role && user?.role !== role) {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, isLoading, user, router, role])

  if (isLoading) return <>{fallback ?? <Loader />}</>

  if (!isAuthenticated || !user || (role && user.role !== role)) return null

  return <>{children}</>
}
