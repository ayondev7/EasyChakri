"use client"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import type { User } from "@/types"
import { refreshAuthToken, clearAuthToken } from "@/utils/apiClient"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: "seeker" | "recruiter") => Promise<void>
  logout: () => void
  signup: (email: string, password: string, name: string, role: "seeker" | "recruiter") => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
      return
    }

    setIsLoading(false)

    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name!,
        role: session.user.role,
        image: session.user.image,
        createdAt: new Date(), 
      })
      setIsAuthenticated(true)
      refreshAuthToken()
    } else {
      setUser(null)
      setIsAuthenticated(false)
      clearAuthToken()
    }
  }, [session, status])

  const login = async (email: string, password: string, role: "seeker" | "recruiter") => {
    throw new Error("Use NextAuth signIn directly")
  }

  const logout = async () => {
    clearAuthToken()
    await signOut({ callbackUrl: "/" })
  }

  const signup = async (email: string, password: string, name: string, role: "seeker" | "recruiter") => {
    throw new Error("Use NextAuth signIn directly")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}