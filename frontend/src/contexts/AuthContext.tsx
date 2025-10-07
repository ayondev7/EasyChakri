"use client"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import type { User } from "@/types"

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
    // Wait for session to finish loading
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
        avatar: session.user.image,
        createdAt: new Date(), 
      })
      setIsAuthenticated(true)
    } else {
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [session, status])

  const login = async (email: string, password: string, role: "seeker" | "recruiter") => {
    // This is now handled by NextAuth signIn
    throw new Error("Use NextAuth signIn directly")
  }

  const logout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const signup = async (email: string, password: string, name: string, role: "seeker" | "recruiter") => {
    // This is now handled by NextAuth signIn with credentials-signup
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