"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, Briefcase, FileText, CheckCircle } from "lucide-react"
// TODO: wire to backend notifications endpoint when available
import type { Notification } from "@/types"
import { formatDate } from "@/utils/utils"
import { useAuth } from "@/contexts/AuthContext"

export function NotificationsDropdown() {
  const { user } = useAuth()
  const [notifications] = useState<Notification[]>([])
  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="h-4 w-4 text-emerald-500" />
      case "job":
        return <Briefcase className="h-4 w-4 text-blue-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-emerald-500 text-white text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-emerald-500">
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
                  className={`flex items-start gap-3 p-3 ${!notification.read ? "bg-emerald-500/5" : ""}`}
                >
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{notification.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.createdAt)}</p>
                  </div>
                  {!notification.read && <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2" />}
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
