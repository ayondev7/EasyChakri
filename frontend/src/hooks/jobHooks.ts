import { useQueryClient } from '@tanstack/react-query'
import { useGet, usePost, usePut, useDelete } from './index'
import type { Job, Application, SavedJob } from '@/types'
import JOB_ROUTES from '@/routes/jobRoutes'
import apiClient from '@/utils/apiClient'

export interface CreateJobInput {
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits?: string[]
  skills: string[]
  type: string
  experience: string
  salary: string
  location: string
  isRemote?: boolean
  category: string
  companyId: string
  deadline?: string
}

export interface UpdateJobInput extends Partial<CreateJobInput> {
  id: string
}

export interface JobQueryParams {
  search?: string
  type?: string
  location?: string
  category?: string
  isRemote?: boolean
  page?: number
  limit?: number
}

export interface JobsResponse {
  data: Job[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface JobResponse {
  data: Job
  message?: string
}

export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (params?: JobQueryParams) => [...jobKeys.lists(), params] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
  myJobs: () => [...jobKeys.all, 'my-jobs'] as const,
}

export function useJobs(params?: JobQueryParams) {
  // Build query string properly handling boolean and number types
  let queryString = ''
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    const qs = searchParams.toString()
    if (qs) queryString = `?${qs}`
  }
  
  return useGet<JobsResponse>(
    jobKeys.list(params),
    `${JOB_ROUTES.getAll}${queryString}`
  )
}

export function useJob(id: string) {
  return useGet<JobResponse>(
    jobKeys.detail(id),
    JOB_ROUTES.getById(id),
    {
      enabled: !!id,
    }
  )
}

export function useMyJobs(page?: number, limit?: number) {
  const queryString = new URLSearchParams()
  if (page) queryString.append('page', page.toString())
  if (limit) queryString.append('limit', limit.toString())
  const query = queryString.toString()
  
  return useGet<JobsResponse>(
    jobKeys.myJobs(),
    `${JOB_ROUTES.recruiterMyJobs}${query ? `?${query}` : ''}`
  )
}

export function useCreateJob() {
  const queryClient = useQueryClient()
  
  return usePost<JobResponse, CreateJobInput>(JOB_ROUTES.create, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
      queryClient.invalidateQueries({ queryKey: jobKeys.myJobs() })
    },
  })
}

export function useUpdateJob() {
  const queryClient = useQueryClient()
  
  return usePut<JobResponse, UpdateJobInput>(
    (variables) => JOB_ROUTES.updateById(variables.id),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) })
        queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
        queryClient.invalidateQueries({ queryKey: jobKeys.myJobs() })
      },
    }
  )
}

export function useDeleteJob() {
  const queryClient = useQueryClient()
  
  return useDelete<{ message: string }, { id: string }>(
    (variables) => JOB_ROUTES.deleteById(variables.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
        queryClient.invalidateQueries({ queryKey: jobKeys.myJobs() })
      },
    }
  )
}

export interface ExperienceLevel {
  level: string
  count: number
}

export interface JobCategory {
  category: string
  count: number
}

export interface JobLocation {
  location: string
  count: number
}

export interface JobSkill {
  skill: string
  count: number
}

export interface TrendingKeyword {
  keyword: string
  count: number
  type: string
}

export function useJobsByExperience() {
  return useGet<{ data: ExperienceLevel[] }>(
    ['jobs', 'stats', 'by-experience'],
    JOB_ROUTES.statsByExperience
  )
}

export function useJobsByCategory() {
  return useGet<{ data: JobCategory[] }>(
    ['jobs', 'stats', 'by-category'],
    JOB_ROUTES.statsByCategory
  )
}

export function useJobsByLocation(limit?: number) {
  const queryString = limit ? `?limit=${limit}` : ''
  return useGet<{ data: JobLocation[] }>(
    ['jobs', 'stats', 'by-location', limit],
    `${JOB_ROUTES.statsByLocation}${queryString}`
  )
}

export function useJobsBySkill(limit?: number) {
  const queryString = limit ? `?limit=${limit}` : ''
  return useGet<{ data: JobSkill[] }>(
    ['jobs', 'stats', 'by-skill', limit],
    `${JOB_ROUTES.statsBySkill}${queryString}`
  )
}

export function useTrendingSearches(limit?: number) {
  const queryString = limit ? `?limit=${limit}` : ''
  return useGet<{ data: TrendingKeyword[] }>(
    ['jobs', 'stats', 'trending', limit],
    `${JOB_ROUTES.statsTrending}${queryString}`
  )
}

export function useSimilarJobs(jobId: string, limit?: number) {
  const queryString = limit ? `?limit=${limit}` : ''
  return useGet<{ data: Job[] }>(
    ['jobs', 'similar', jobId, limit],
    `${JOB_ROUTES.similarJobs(jobId)}${queryString}`,
    {
      enabled: !!jobId,
    }
  )
}

export interface ApplicationsResponse {
  data: Application[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApplicationStatsResponse {
  total: number
  stats: Record<string, number>
}

export const applicationKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationKeys.all, 'list'] as const,
  stats: () => [...applicationKeys.all, 'stats'] as const,
}

export function useApplyForJob() {
  const queryClient = useQueryClient()
  
  return usePost<{ message: string; data: Application }, { jobId: string }>(
    '',
    {
      mutationFn: async ({ jobId }) => {
        const { data } = await apiClient.post(JOB_ROUTES.apply(jobId))
        return data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: applicationKeys.lists() })
        queryClient.invalidateQueries({ queryKey: applicationKeys.stats() })
      },
    }
  )
}

export function useMyApplications(page?: number, limit?: number) {
  const queryString = new URLSearchParams()
  if (page) queryString.append('page', page.toString())
  if (limit) queryString.append('limit', limit.toString())
  const query = queryString.toString()
  
  return useGet<ApplicationsResponse>(
    applicationKeys.lists(),
    `${JOB_ROUTES.myApplications}${query ? `?${query}` : ''}`
  )
}

export function useApplicationStats() {
  return useGet<ApplicationStatsResponse>(
    applicationKeys.stats(),
    JOB_ROUTES.applicationStats
  )
}

export interface SavedJobsResponse {
  data: SavedJob[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const savedJobKeys = {
  all: ['savedJobs'] as const,
  lists: () => [...savedJobKeys.all, 'list'] as const,
  check: (jobId: string) => [...savedJobKeys.all, 'check', jobId] as const,
}

export function useSaveJob() {
  const queryClient = useQueryClient()
  
  return usePost<{ message: string; data: SavedJob }, { jobId: string }>(
    '',
    {
      mutationFn: async ({ jobId }) => {
        const { data } = await apiClient.post(JOB_ROUTES.saveJob(jobId))
        return data
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: savedJobKeys.lists() })
        queryClient.invalidateQueries({ queryKey: savedJobKeys.check(variables.jobId) })
      },
    }
  )
}

export function useUnsaveJob() {
  const queryClient = useQueryClient()
  
  return useDelete<{ message: string }, { jobId: string }>(
    '',
    {
      mutationFn: async ({ jobId }) => {
        const { data } = await apiClient.delete(JOB_ROUTES.unsaveJob(jobId))
        return data
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: savedJobKeys.lists() })
        queryClient.invalidateQueries({ queryKey: savedJobKeys.check(variables.jobId) })
      },
    }
  )
}

export function useSavedJobs(page?: number, limit?: number) {
  const queryString = new URLSearchParams()
  if (page) queryString.append('page', page.toString())
  if (limit) queryString.append('limit', limit.toString())
  const query = queryString.toString()
  
  return useGet<SavedJobsResponse>(
    savedJobKeys.lists(),
    `${JOB_ROUTES.savedJobs}${query ? `?${query}` : ''}`
  )
}

export function useCheckIfSaved(jobId: string) {
  return useGet<{ data: { isSaved: boolean } }>(
    savedJobKeys.check(jobId),
    JOB_ROUTES.checkSaved(jobId),
    {
      enabled: !!jobId,
    }
  )
}
