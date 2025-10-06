"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/types"
import { mockUsers } from "@/utils/MockData"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: "seeker" | "recruiter") => Promise<void>
  logout: () => void
  signup: (email: string, password: string, name: string, role: "seeker" | "recruiter") => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string, role: "seeker" | "recruiter") => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find user in mock data or create demo user
    let foundUser = mockUsers.find((u) => u.email === email && u.role === role)

    if (!foundUser) {
      if (role === "recruiter") {
        // Return a default recruiter with jobs
        foundUser = mockUsers.find((u) => u.role === "recruiter") || mockUsers[7] // rec1
      } else {
        // Create demo user for seeker
        foundUser = {
          id: `user_${Date.now()}`,
          email,
          name: email.split("@")[0],
          role,
          createdAt: new Date(),
        }
      }
    }

    setUser(foundUser)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(foundUser))
  }

  const signup = async (email: string, password: string, name: string, role: "seeker" | "recruiter") => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role,
      createdAt: new Date(),
    }

    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isAuthenticated }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
