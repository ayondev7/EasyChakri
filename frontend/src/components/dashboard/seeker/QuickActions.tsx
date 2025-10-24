import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, User, FileText, Calendar } from "lucide-react"
import Link from "next/link"

export default function QuickActions() {
  const actions = [
    {
      label: "Browse Jobs",
      href: "/jobs",
      icon: Briefcase,
      variant: "default" as const,
      className: "bg-cyan-500 hover:bg-cyan-600 text-white",
    },
    {
      label: "My Applications",
      href: "/seeker/applications",
      icon: FileText,
      variant: "outline" as const,
    },
    {
      label: "My Interviews",
      href: "/seeker/interviews",
      icon: Calendar,
      variant: "outline" as const,
    },
    {
      label: "Edit Profile",
      href: "/seeker/profile",
      icon: User,
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.href}
              asChild
              variant={action.variant}
              className={`w-full justify-start ${action.className || ""}`}
            >
              <Link href={action.href}>
                <Icon className="mr-2 h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
