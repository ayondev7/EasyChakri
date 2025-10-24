import { useQueryClient } from '@tanstack/react-query'
import { useGet, usePut, useDelete } from './index'
import type { Application } from '@/types'
import APPLICATION_ROUTES from '@/routes/applicationRoutes'

export interface ApplicationQueryParams {
  page?: number
  limit?: number
  status?: string
  jobId?: string
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

export interface ApplicationResponse {
  data: Application
  message?: string
}

export interface UpdateApplicationStatusInput {
  status: string
  notes?: string
}

export interface ApplicationStatsResponse {
  total: number
  stats: Record<string, number>
}

export const applicationKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationKeys.all, 'list'] as const,
  jobApplications: (jobId: string, params?: ApplicationQueryParams) => [...applicationKeys.all, 'job', jobId, params] as const,
  recruiterApplications: (params?: ApplicationQueryParams) => [...applicationKeys.all, 'recruiter', params] as const,
  details: () => [...applicationKeys.all, 'detail'] as const,
  detail: (id: string) => [...applicationKeys.details(), id] as const,
  recruiterStats: () => [...applicationKeys.all, 'recruiter-stats'] as const,
}

export function useApplication(id: string) {
  return useGet<ApplicationResponse>(
    applicationKeys.detail(id),
    APPLICATION_ROUTES.getApplicationDetails(id),
    {
      enabled: !!id,
    }
  )
}

export function useJobApplications(jobId: string, params?: ApplicationQueryParams) {
  const queryString = new URLSearchParams()
  if (params?.page) queryString.append('page', params.page.toString())
  if (params?.limit) queryString.append('limit', params.limit.toString())
  if (params?.status) queryString.append('status', params.status)
  const query = queryString.toString()
  
  return useGet<ApplicationsResponse>(
    applicationKeys.jobApplications(jobId, params),
    `${APPLICATION_ROUTES.getJobApplications(jobId)}${query ? `?${query}` : ''}`,
    {
      enabled: !!jobId,
    }
  )
}

export function useRecruiterApplications(params?: ApplicationQueryParams) {
  const queryString = new URLSearchParams()
  if (params?.page) queryString.append('page', params.page.toString())
  if (params?.limit) queryString.append('limit', params.limit.toString())
  if (params?.status) queryString.append('status', params.status)
  const query = queryString.toString()
  
  return useGet<ApplicationsResponse>(
    applicationKeys.recruiterApplications(params),
    `${APPLICATION_ROUTES.recruiterAllApplications}${query ? `?${query}` : ''}`
  )
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()
  
  return usePut<ApplicationResponse, UpdateApplicationStatusInput & { id: string }>(
    (variables) => APPLICATION_ROUTES.updateApplicationStatus(variables.id),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: applicationKeys.detail(variables.id) })
        queryClient.invalidateQueries({ queryKey: applicationKeys.lists() })
        queryClient.invalidateQueries({ queryKey: applicationKeys.recruiterStats() })
      },
    }
  )
}

export function useRecruiterApplicationStats() {
  return useGet<ApplicationStatsResponse>(
    applicationKeys.recruiterStats(),
    APPLICATION_ROUTES.recruiterApplicationStatistics
  )
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient()
  
  return useDelete<{ message: string }, { id: string }>(
    (variables) => APPLICATION_ROUTES.withdrawApplication(variables.id),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: applicationKeys.detail(variables.id) })
        queryClient.invalidateQueries({ queryKey: applicationKeys.lists() })
      },
    }
  )
}
