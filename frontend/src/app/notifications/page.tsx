"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/types"
import { Bell } from "lucide-react"
import TabsField from "@/components/form/TabsField"
import NotificationCard from "@/components/notifications/NotificationCard"
import EmptyState from "@/components/EmptyState"
import { NOTIFICATION_TABS } from "@/constants/tabConstants"

export default function NotificationsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const userNotifications: Notification[] = []
  const filteredNotifications: Notification[] = []

  return (
    <main className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your job search activity</p>
          </div>
          <Button variant="outline" size="sm">
            Mark all as read
          </Button>
        </div>

        <TabsField options={NOTIFICATION_TABS} value={filter} onChange={setFilter} className="mb-6" />

        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Bell} title="No notifications to display" />
        )}
      </div>
    </main>
  )
}
