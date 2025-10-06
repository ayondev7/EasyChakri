"use client"

import { Briefcase, Building2, Users, CheckCircle } from "lucide-react"

const stats = [
  { icon: Briefcase, value: "50,000+", label: "Active Jobs" },
  { icon: Building2, value: "10,000+", label: "Companies" },
  { icon: Users, value: "2M+", label: "Job Seekers" },
  { icon: CheckCircle, value: "100,000+", label: "Success Stories" },
]

export function StatsSection() {
  return (
    <section className="py-[100px] bg-emerald-600 text-white">
      <div className="container mx-auto px-[100px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="text-center">
                <Icon className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-emerald-100 text-lg">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
