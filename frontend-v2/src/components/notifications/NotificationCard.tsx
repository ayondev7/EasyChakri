"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, FileText, Calendar, CheckCircle } from "lucide-react"
import type { Notification } from "@/types"
import { formatDate } from "@/utils/utils"
import Link from "next/link"
import { useMarkAsRead } from "@/hooks/notificationHooks"

interface NotificationCardProps {
  notification: Notification
}

const getIcon = (type: string) => {
  switch (type) {
    case "APPLICATION":
      return <FileText className="h-5 w-5 text-emerald-500" />
    case "JOB":
      return <Briefcase className="h-5 w-5 text-blue-500" />
    case "INTERVIEW":
      return <Calendar className="h-5 w-5 text-purple-500" />
    case "SYSTEM":
      return <CheckCircle className="h-5 w-5 text-gray-500" />
    default:
      return <CheckCircle className="h-5 w-5 text-green-500" />
  }
}

export default function NotificationCard({ notification }: NotificationCardProps) {
  const markAsReadMutation = useMarkAsRead()

  const handleClick = async () => {
    if (!notification.isRead) {
      try {
        await markAsReadMutation.mutateAsync([notification.id])
      } catch (error) {
        console.error("Failed to mark notification as read:", error)
      }
    }
  }

  return (
    <Card
      className={`transition-all border-2 ${
        !notification.isRead 
          ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600" 
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
      }`}
    >
      <CardContent className="p-4">
        <Link href={notification.link || "#"} className="flex items-start gap-4" onClick={handleClick}>
          <div className="mt-1">{getIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className={`line-clamp-1 ${!notification.isRead ? "font-bold text-emerald-900 dark:text-emerald-100" : "font-semibold"}`}>
                {notification.title}
              </h3>
              {!notification.isRead && (
                <div className="h-3 w-3 rounded-full bg-emerald-500 mt-1 flex-shrink-0 ring-2 ring-emerald-200 dark:ring-emerald-800 animate-pulse" />
              )}
            </div>
            <p className={`text-sm mb-2 line-clamp-2 ${!notification.isRead ? "text-gray-800 dark:text-gray-200" : "text-muted-foreground"}`}>
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
