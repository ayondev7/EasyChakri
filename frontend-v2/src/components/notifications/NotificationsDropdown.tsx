"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Briefcase, FileText, Calendar, CheckCircle } from "lucide-react"
import type { Notification } from "@/types"
import { formatDate } from "@/utils/utils"
import { useAuth } from "@/contexts/AuthContext"
import { useSocket } from "@/contexts/SocketContext"
import { useNotifications, useMarkAsRead, useUnreadCount } from "@/hooks/notificationHooks"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { NotificationIcon } from "@/components/notifications/NotificationIcon"

export function NotificationsDropdown() {
  const { user } = useAuth()
  const { socket } = useSocket()
  const queryClient = useQueryClient()
  const { data: notificationsData } = useNotifications({ limit: 10 })
  const { data: unreadData } = useUnreadCount()
  const markAsReadMutation = useMarkAsRead()

  const notifications = notificationsData?.data || []
  const unreadCount = unreadData?.unreadCount || 0

  useEffect(() => {
    if (!socket) return

    const handleNewNotification = (notification: Notification) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      
      toast.success(notification.title, {
        duration: 4000,
      })
    }

    socket.on("notification:new", handleNewNotification)

    return () => {
      socket.off("notification:new", handleNewNotification)
    }
  }, [socket, queryClient])

  const handleMarkAllAsRead = async () => {
    try {
      await markAsReadMutation.mutateAsync(undefined)
      toast.success("All notifications marked as read")
    } catch (error) {
      toast.error("Failed to mark notifications as read")
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markAsReadMutation.mutateAsync([notification.id])
      } catch (error) {
        console.error("Failed to mark notification as read:", error)
      }
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "APPLICATION":
        return <FileText className="h-4 w-4 text-emerald-500" />
      case "JOB":
        return <Briefcase className="h-4 w-4 text-blue-500" />
      case "INTERVIEW":
        return <Calendar className="h-4 w-4 text-purple-500" />
      case "SYSTEM":
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <NotificationIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-emerald-500"
              onClick={handleMarkAllAsRead}
              disabled={markAsReadMutation.isPending}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification: Notification) => (
              <DropdownMenuItem key={notification.id} asChild className="cursor-pointer">
                <Link
                  href={notification.link || "#"}
                  className={`flex items-start gap-3 p-3 transition-colors ${
                    !notification.isRead 
                      ? "bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/30" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm line-clamp-1 ${!notification.isRead ? "font-semibold" : "font-medium"}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.createdAt)}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0 ring-2 ring-emerald-100 dark:ring-emerald-900" />
                  )}
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">No notifications</div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/notifications" className="w-full text-center text-sm text-emerald-500 py-2">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
