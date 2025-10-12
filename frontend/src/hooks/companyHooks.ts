import { useQueryClient } from '@tanstack/react-query'
import { useGet, usePost, usePut, useDelete } from './index'
import type { Company } from '@/types/companyTypes'
import COMPANY_ROUTES from '@/routes/companyRoutes'

export interface CreateCompanyInput {
  name: string
  description: string
  industry: string
  size?: string
  location?: string
  website?: string
  logo?: string
}

export interface UpdateCompanyInput extends Partial<CreateCompanyInput> {
  id: string
}

export interface CompaniesResponse {
  data: Company[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CompanyResponse {
  data: Company
  message?: string
}

export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (params?: { page?: number; limit?: number }) => [...companyKeys.lists(), params] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
  myCompany: () => [...companyKeys.all, 'my-company'] as const,
}

export function useCompanies(limit?: number, page?: number) {
  const params = new URLSearchParams()
  if (page) params.append('page', String(page))
  if (limit) params.append('limit', String(limit))
  const qs = params.toString()

  return useGet<CompaniesResponse>(
    companyKeys.list({ page, limit }),
    `${COMPANY_ROUTES.getAll}${qs ? `?${qs}` : ''}`,
  )
}

export function useCompany(id: string) {
  return useGet<CompanyResponse>(companyKeys.detail(id), COMPANY_ROUTES.getById(id), {
    enabled: !!id,
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()
  return usePost<CompanyResponse, CreateCompanyInput>(COMPANY_ROUTES.create, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() })
    },
  })
}

export function useUpdateCompany() {
  const queryClient = useQueryClient()
  return usePut<CompanyResponse, UpdateCompanyInput>((variables) => COMPANY_ROUTES.updateById(variables.id), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() })
    },
  })
}

export function useDeleteCompany() {
  const queryClient = useQueryClient()
  return useDelete<{ message: string }, { id: string }>((variables) => COMPANY_ROUTES.deleteById(variables.id), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() })
    },
  })
}
