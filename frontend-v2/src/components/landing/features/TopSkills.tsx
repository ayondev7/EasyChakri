"use client"

import Link from "next/link"
import { Code, Database, Cloud, Smartphone, Shield, Brain } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useJobsBySkill } from "@/hooks/jobHooks"
import Loader from "@/components/Loader"

const skillIcons: Record<string, any> = {
  "React": Code,
  "Python": Code,
  "AWS": Cloud,
  "SQL": Database,
  "React Native": Smartphone,
  "Cybersecurity": Shield,
  "Machine Learning": Brain,
  "Node.js": Code,
  "JavaScript": Code,
  "TypeScript": Code,
  "Java": Code,
  "Docker": Cloud,
  "Kubernetes": Cloud,
}

export function TopSkills() {
  const { data, isLoading } = useJobsBySkill(6)
  
  const topSkills = data?.data || []

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">In-Demand Skills</h2>
            <p className="text-muted-foreground">Explore jobs by the most sought-after skills</p>
          </div>
          <Loader />
        </div>
      </section>
    )
  }

  if (topSkills.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">In-Demand Skills</h2>
            <p className="text-muted-foreground">Explore jobs by the most sought-after skills</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">No skills data available at the moment.</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">In-Demand Skills</h2>
          <p className="text-muted-foreground">Explore jobs by the most sought-after skills</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topSkills.map((skill) => {
            const Icon = skillIcons[skill.skill] || Code
            return (
              <Link key={skill.skill} href={`/jobs?skill=${skill.skill}`}>
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-emerald-500">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-emerald-50 rounded-lg mb-3">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{skill.skill}</h3>
                    <p className="text-sm text-emerald-600 font-medium">{skill.count} jobs</p>
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
