"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

interface SavedJobsContextType {
  savedJobIds: string[]
  saveJob: (jobId: string) => void
  unsaveJob: (jobId: string) => void
  isJobSaved: (jobId: string) => boolean
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined)

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [savedJobIds, setSavedJobIds] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`saved_jobs_${user.id}`)
      if (stored) {
        setSavedJobIds(JSON.parse(stored))
      }
    }
  }, [user])

  const saveJob = (jobId: string) => {
    if (!user) return

    const newSavedJobs = [...savedJobIds, jobId]
    setSavedJobIds(newSavedJobs)
    localStorage.setItem(`saved_jobs_${user.id}`, JSON.stringify(newSavedJobs))
  }

  const unsaveJob = (jobId: string) => {
    if (!user) return

    const newSavedJobs = savedJobIds.filter(id => id !== jobId)
    setSavedJobIds(newSavedJobs)
    localStorage.setItem(`saved_jobs_${user.id}`, JSON.stringify(newSavedJobs))
  }

  const isJobSaved = (jobId: string) => {
    return savedJobIds.includes(jobId)
  }

  return (
    <SavedJobsContext.Provider value={{
      savedJobIds,
      saveJob,
      unsaveJob,
      isJobSaved
    }}>
      {children}
    </SavedJobsContext.Provider>
  )
}

export function useSavedJobs() {
  const context = useContext(SavedJobsContext)
  if (context === undefined) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider')
  }
  return context
}