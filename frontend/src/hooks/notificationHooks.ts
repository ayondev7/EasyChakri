import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import apiClient from "@/utils/apiClient"
import { NOTIFICATION_ROUTES } from "@/routes/notificationRoutes"
import { Notification } from "@/types"

interface NotificationsResponse {
  data: Notification[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    unreadCount: number
  }
}

interface UnreadCountResponse {
  unreadCount: number
}

export const useNotifications = (params?: { page?: number; limit?: number; type?: string; unreadOnly?: boolean }) => {
  return useQuery<NotificationsResponse>({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.append("page", params.page.toString())
      if (params?.limit) searchParams.append("limit", params.limit.toString())
      if (params?.type) searchParams.append("type", params.type)
      if (params?.unreadOnly) searchParams.append("unreadOnly", "true")

      const { data } = await apiClient.get<NotificationsResponse>(
        `${NOTIFICATION_ROUTES.getAll}?${searchParams.toString()}`
      )
      return data
    },
    refetchOnWindowFocus: false,
  })
}

export const useInfiniteNotifications = (params?: { limit?: number; type?: string; unreadOnly?: boolean }) => {
  return useInfiniteQuery<NotificationsResponse>({
    queryKey: ["notifications", "infinite", params],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number
      const searchParams = new URLSearchParams()
      searchParams.append("page", page.toString())
      if (params?.limit) searchParams.append("limit", params.limit.toString())
      if (params?.type) searchParams.append("type", params.type)
      if (params?.unreadOnly) searchParams.append("unreadOnly", "true")

      const { data } = await apiClient.get<NotificationsResponse>(
        `${NOTIFICATION_ROUTES.getAll}?${searchParams.toString()}`
      )
      return data
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1
      }
      return undefined
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  })
}

export const useUnreadCount = () => {
  return useQuery<UnreadCountResponse>({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const { data } = await apiClient.get<UnreadCountResponse>(NOTIFICATION_ROUTES.unreadCount)
      return data
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  })
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationIds?: string[]) => {
      const { data } = await apiClient.put(NOTIFICATION_ROUTES.markAsRead, {
        notificationIds,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
