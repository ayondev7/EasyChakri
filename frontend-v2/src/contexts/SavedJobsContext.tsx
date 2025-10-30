"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useAuth } from "./AuthContext"
import { useSavedJobs as useSavedJobsQuery, useSaveJob, useUnsaveJob } from "@/hooks"

interface SavedJobsContextType {
  savedJobIds: string[]
  saveJob: (jobId: string) => void
  unsaveJob: (jobId: string) => void
  isJobSaved: (jobId: string) => boolean
  isLoading: boolean
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined)

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { data: savedJobsData, isLoading } = useSavedJobsQuery()
  const saveJobMutation = useSaveJob()
  const unsaveJobMutation = useUnsaveJob()

  const savedJobIds = savedJobsData?.data?.map((saved) => saved.jobId) || []

  const saveJob = (jobId: string) => {
    if (!user) return
    saveJobMutation.mutate({ jobId })
  }

  const unsaveJob = (jobId: string) => {
    if (!user) return
    unsaveJobMutation.mutate({ jobId })
  }

  const isJobSaved = (jobId: string) => {
    return savedJobIds.includes(jobId)
  }

  return (
    <SavedJobsContext.Provider value={{
      savedJobIds,
      saveJob,
      unsaveJob,
      isJobSaved,
      isLoading,
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