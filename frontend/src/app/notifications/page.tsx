"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
// Header and Footer are provided by the root layout
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockNotifications } from "@/lib/MockData"
import { Briefcase, FileText, CheckCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"

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

  const userNotifications = mockNotifications.filter((n) => n.userId === user?.id)
  const filteredNotifications =
    filter === "all" ? userNotifications : userNotifications.filter((n) => n.type === filter)

  const getIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="h-5 w-5 text-cyan-500" />
      case "job":
        return <Briefcase className="h-5 w-5 text-blue-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

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

          <Tabs value={filter} onValueChange={setFilter} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="application">Applications</TabsTrigger>
              <TabsTrigger value="job">Jobs</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`hover:border-cyan-500/50 transition-all ${!notification.read ? "bg-cyan-500/5" : ""}`}
                >
                  <CardContent className="p-4">
                    <Link href={notification.link || "#"} className="flex items-start gap-4">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold line-clamp-1">{notification.title}</h3>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No notifications to display</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
  )
}
