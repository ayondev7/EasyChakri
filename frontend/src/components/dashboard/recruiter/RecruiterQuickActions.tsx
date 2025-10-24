import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Briefcase, Building2, Calendar, Users } from "lucide-react"
import Link from "next/link"

export default function RecruiterQuickActions() {
  const actions = [
    {
      label: "Post New Job",
      href: "/recruiter/post-job",
      icon: PlusCircle,
      variant: "default" as const,
      className: "bg-cyan-500 hover:bg-cyan-600 text-white",
    },
    {
      label: "My Jobs",
      href: "/recruiter/jobs",
      icon: Briefcase,
      variant: "outline" as const,
    },
    {
      label: "View Interviews",
      href: "/recruiter/interviews",
      icon: Calendar,
      variant: "outline" as const,
    },
    {
      label: "Company Profile",
      href: "/recruiter/company-profile",
      icon: Building2,
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
