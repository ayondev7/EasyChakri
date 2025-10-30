import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, Calendar, LucideIcon } from "lucide-react"
import Link from "next/link"

interface StatCardData {
  title: string
  value: number
  icon: LucideIcon
  color: string
  bgColor: string
  link?: string
}

interface SeekerStatsGridProps {
  total: number
  pending: number
  shortlisted: number
  interviews: number
}

export default function SeekerStatsGrid({
  total,
  pending,
  shortlisted,
  interviews,
}: SeekerStatsGridProps) {
  const stats: StatCardData[] = [
    {
      title: "Applications",
      value: total,
      icon: FileText,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      link: "/seeker/applications",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Shortlisted",
      value: shortlisted,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Interviews",
      value: interviews,
      icon: Calendar,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon
        const StatCard = (
          <Card
            key={stat.title}
            className={stat.link ? "hover:shadow-md transition-shadow cursor-pointer" : ""}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`h-12 w-12 rounded-lg ${stat.bgColor} ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )

        return stat.link ? (
          <Link key={stat.title} href={stat.link}>
            {StatCard}
          </Link>
        ) : (
          StatCard
        )
      })}
    </div>
  )
}
