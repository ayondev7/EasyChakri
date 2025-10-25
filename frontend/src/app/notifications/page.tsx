"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSocket } from "@/contexts/SocketContext"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/types"
import { Bell } from "lucide-react"
import TabsField from "@/components/form/TabsField"
import NotificationCard from "@/components/notifications/NotificationCard"
import EmptyState from "@/components/EmptyState"
import { NOTIFICATION_TABS } from "@/constants/tabConstants"
import { useInfiniteNotifications, useMarkAsRead } from "@/hooks/notificationHooks"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import Loader from "@/components/Loader"

export default function NotificationsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { socket } = useSocket()
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState("all")
  const markAsReadMutation = useMarkAsRead()

  const type = filter === "all" ? undefined : filter.toUpperCase()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteNotifications({
    limit: 20,
    type: type as "APPLICATION" | "JOB" | "INTERVIEW" | "SYSTEM" | undefined,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (!socket) return

    const handleNewNotification = (notification: Notification) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    }

    socket.on("notification:new", handleNewNotification)

    return () => {
      socket.off("notification:new", handleNewNotification)
    }
  }, [socket, queryClient])

  if (!isAuthenticated) {
    return null
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAsReadMutation.mutateAsync(undefined)
      toast.success("All notifications marked as read")
    } catch (error) {
      toast.error("Failed to mark notifications as read")
    }
  }

  const allNotifications = data?.pages.flatMap((page) => page.data) || []
  const hasUnreadNotifications = allNotifications.some((n) => !n.isRead)

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your job search activity</p>
          </div>
          {hasUnreadNotifications && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAsReadMutation.isPending}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <TabsField options={NOTIFICATION_TABS} value={filter} onChange={setFilter} className="mb-6" />

        {allNotifications.length > 0 ? (
          <>
            <div className="space-y-3">
              {allNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState icon={Bell} title="No notifications to display" />
        )}
      </div>
    </main>
  )
}
