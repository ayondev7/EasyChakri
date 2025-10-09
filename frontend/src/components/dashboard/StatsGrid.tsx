import React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

type Stat = {
  title: string
  value: number | string
  icon: React.ElementType
  color?: string
  bgColor?: string
  link?: string
}

export default function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon
        const StatCard = (
          <Card key={stat.title} className={stat.link ? "hover:shadow-md transition-shadow cursor-pointer" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.bgColor || "bg-muted"} ${stat.color || "text-muted-foreground"} flex items-center justify-center`}>
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
