import { useQueryClient } from '@tanstack/react-query'
import { useGet, usePost, usePut, useDelete } from './index'
import type { Interview, CreateInterviewInput, UpdateInterviewInput } from '@/types'
import INTERVIEW_ROUTES from '@/routes/interviewRoutes'

export interface InterviewQueryParams {
  page?: number
  limit?: number
  status?: string
  type?: string
}

export interface InterviewsResponse {
  data: Interview[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface InterviewResponse {
  data: Interview
  message?: string
}

export interface InterviewStatsResponse {
  total: number
  stats: Record<string, number>
}

export const interviewKeys = {
  all: ['interviews'] as const,
  lists: () => [...interviewKeys.all, 'list'] as const,
  recruiterLists: (params?: InterviewQueryParams) => [...interviewKeys.all, 'recruiter', params] as const,
  seekerLists: (params?: InterviewQueryParams) => [...interviewKeys.all, 'seeker', params] as const,
  details: () => [...interviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...interviewKeys.details(), id] as const,
  stats: () => [...interviewKeys.all, 'stats'] as const,
  upcoming: () => [...interviewKeys.all, 'upcoming'] as const,
}

export function useScheduleInterview() {
  const queryClient = useQueryClient()
  
  return usePost<InterviewResponse, CreateInterviewInput>(INTERVIEW_ROUTES.scheduleInterview, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.lists() })
      queryClient.invalidateQueries({ queryKey: interviewKeys.stats() })
      queryClient.invalidateQueries({ queryKey: interviewKeys.upcoming() })
    },
  })
}

export function useUpdateInterview() {
  const queryClient = useQueryClient()
  
  return usePut<InterviewResponse, UpdateInterviewInput & { id: string }>(
    (variables) => INTERVIEW_ROUTES.updateInterview(variables.id),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: interviewKeys.detail(variables.id) })
        queryClient.invalidateQueries({ queryKey: interviewKeys.lists() })
        queryClient.invalidateQueries({ queryKey: interviewKeys.stats() })
        queryClient.invalidateQueries({ queryKey: interviewKeys.upcoming() })
      },
    }
  )
}

export function useInterview(id: string) {
  return useGet<InterviewResponse>(
    interviewKeys.detail(id),
    INTERVIEW_ROUTES.getInterviewDetails(id),
    {
      enabled: !!id,
    }
  )
}

export function useRecruiterInterviews(params?: InterviewQueryParams) {
  const queryString = new URLSearchParams()
  if (params?.page) queryString.append('page', params.page.toString())
  if (params?.limit) queryString.append('limit', params.limit.toString())
  if (params?.status) queryString.append('status', params.status)
  if (params?.type) queryString.append('type', params.type)
  const query = queryString.toString()
  
  return useGet<InterviewsResponse>(
    interviewKeys.recruiterLists(params),
    `${INTERVIEW_ROUTES.recruiterMyInterviews}${query ? `?${query}` : ''}`
  )
}

export function useSeekerInterviews(params?: InterviewQueryParams) {
  const queryString = new URLSearchParams()
  if (params?.page) queryString.append('page', params.page.toString())
  if (params?.limit) queryString.append('limit', params.limit.toString())
  if (params?.status) queryString.append('status', params.status)
  if (params?.type) queryString.append('type', params.type)
  const query = queryString.toString()
  
  return useGet<InterviewsResponse>(
    interviewKeys.seekerLists(params),
    `${INTERVIEW_ROUTES.seekerMyInterviews}${query ? `?${query}` : ''}`
  )
}

export function useCancelInterview() {
  const queryClient = useQueryClient()
  
  return useDelete<{ message: string }, { id: string }>(
    (variables) => INTERVIEW_ROUTES.cancelInterview(variables.id),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: interviewKeys.detail(variables.id) })
        queryClient.invalidateQueries({ queryKey: interviewKeys.lists() })
        queryClient.invalidateQueries({ queryKey: interviewKeys.stats() })
        queryClient.invalidateQueries({ queryKey: interviewKeys.upcoming() })
      },
    }
  )
}

export function useInterviewStats() {
  return useGet<InterviewStatsResponse>(
    interviewKeys.stats(),
    INTERVIEW_ROUTES.interviewStatistics
  )
}

export function useUpcomingInterviews() {
  return useGet<{ data: Interview[] }>(
    interviewKeys.upcoming(),
    INTERVIEW_ROUTES.upcomingInterviews
  )
}
