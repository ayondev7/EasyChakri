import { 
  useQuery, 
  useMutation, 
  type UseQueryOptions, 
  type UseMutationOptions,
  type QueryKey
} from '@tanstack/react-query'
import apiClient from '@/utils/apiClient'
import type { AxiosError } from 'axios'

export interface ApiError {
  message: string
  statusCode?: number
}

const defaultQueryOptions: Partial<UseQueryOptions<any, any, any, any>> = {
  refetchOnWindowFocus: false,
}

export function useGet<TData = unknown>(
  key: QueryKey,
  url: string,
  options?: Omit<UseQueryOptions<TData, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, AxiosError<ApiError>>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiClient.get<TData>(url)
      return data
    },
    ...defaultQueryOptions,
    ...options,
  })
}

export function usePost<TData = unknown, TVariables = unknown>(
  url: string,
  options?: UseMutationOptions<TData, AxiosError<ApiError>, TVariables>
) {
  return useMutation<TData, AxiosError<ApiError>, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const { data } = await apiClient.post<TData>(url, variables)
      return data
    },
    ...options,
  })
}

export function usePatch<TData = unknown, TVariables = unknown>(
  url: string | ((variables: TVariables) => string),
  options?: UseMutationOptions<TData, AxiosError<ApiError>, TVariables>
) {
  return useMutation<TData, AxiosError<ApiError>, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const endpoint = typeof url === 'function' ? url(variables) : url
      const { data } = await apiClient.patch<TData>(endpoint, variables)
      return data
    },
    ...options,
  })
}

export function usePut<TData = unknown, TVariables = unknown>(
  url: string | ((variables: TVariables) => string),
  options?: UseMutationOptions<TData, AxiosError<ApiError>, TVariables>
) {
  return useMutation<TData, AxiosError<ApiError>, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const endpoint = typeof url === 'function' ? url(variables) : url
      const { data } = await apiClient.put<TData>(endpoint, variables)
      return data
    },
    ...options,
  })
}

export function useDelete<TData = unknown, TVariables = unknown>(
  url: string | ((variables: TVariables) => string),
  options?: UseMutationOptions<TData, AxiosError<ApiError>, TVariables>
) {
  return useMutation<TData, AxiosError<ApiError>, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const endpoint = typeof url === 'function' ? url(variables) : url
      const { data } = await apiClient.delete<TData>(endpoint)
      return data
    },
    ...options,
  })
}

export * from "./jobHooks"
export * from "./companyHooks"
export * from "./userHooks"
export * from "./applicationHooks"
export * from "./interviewHooks"
