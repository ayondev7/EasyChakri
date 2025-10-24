"use client"

import Link from "next/link"
import { Briefcase, GraduationCap, Award } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useJobsByExperience } from "@/hooks/jobHooks"
import Loader from "@/components/Loader"

const experienceLevelConfig = {
  "Fresher": {
    description: "0-2 years",
    icon: GraduationCap,
    color: "emerald",
  },
  "Mid-Level": {
    description: "3-5 years",
    icon: Briefcase,
    color: "blue",
  },
  "Senior": {
    description: "6+ years",
    icon: Award,
    color: "purple",
  },
}

export function JobsByExperience() {
  const { data, isLoading } = useJobsByExperience()
  
  const experienceLevels = data?.data || []

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Loader />
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Jobs by Experience Level</h2>
          <p className="text-muted-foreground">Find roles that match your career stage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experienceLevels.map((level) => {
            const config = experienceLevelConfig[level.level as keyof typeof experienceLevelConfig]
            if (!config) return null
            
            const Icon = config.icon
            return (
              <Link key={level.level} href={`/jobs?experience=${level.level}`}>
                <Card className="p-8 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-emerald-500 h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-emerald-50 rounded-full mb-4">
                      <Icon className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-2xl mb-2">{level.level}</h3>
                    <p className="text-muted-foreground mb-4">{config.description}</p>
                    <p className="text-3xl font-bold text-emerald-600">{level.count}</p>
                    <p className="text-sm text-muted-foreground">open positions</p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
