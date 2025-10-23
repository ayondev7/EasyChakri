import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/utils/apiClient"
import { USER_ROUTES } from "@/routes"
import { User } from "@/types"

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await apiClient.get(USER_ROUTES.me)
      return response.data as User
    },
    refetchOnWindowFocus: false,
  })
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await apiClient.put(USER_ROUTES.me, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] })
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })
}

export const useCheckProfileComplete = () => {
  return useQuery({
    queryKey: ["user", "profile-complete"],
    queryFn: async () => {
      const response = await apiClient.get(USER_ROUTES.checkProfileComplete)
      return response.data as { isComplete: boolean; missingFields: string[] }
    },
    enabled: false,
    refetchOnWindowFocus: false,
  })
}
