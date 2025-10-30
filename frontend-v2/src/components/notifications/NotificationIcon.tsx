"use client"

import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useUnreadCount } from "@/hooks/notificationHooks"
import { cn } from "@/lib/utils"

interface NotificationIconProps {
  className?: string
  iconClassName?: string
  badgeClassName?: string
}

export function NotificationIcon({ className, iconClassName, badgeClassName }: NotificationIconProps) {
  const { data: unreadData } = useUnreadCount()
  const unreadCount = unreadData?.unreadCount || 0

  return (
    <div className={cn("relative", className)}>
      <Bell className={cn("h-5 w-5", unreadCount > 0 && "text-emerald-600", iconClassName)} />
      {unreadCount > 0 && (
        <Badge className={cn(
          "absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-emerald-500 text-white text-xs animate-pulse",
          badgeClassName
        )}>
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </div>
  )
}
