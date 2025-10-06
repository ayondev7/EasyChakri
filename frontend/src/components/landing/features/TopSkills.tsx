"use client"

import Link from "next/link"
import { Code, Database, Cloud, Smartphone, Shield, Brain } from "lucide-react"
import { Card } from "@/components/ui/card"

const topSkills = [
  { name: "React", icon: Code, jobs: 890, color: "blue" },
  { name: "Python", icon: Code, jobs: 1240, color: "yellow" },
  { name: "AWS", icon: Cloud, jobs: 760, color: "orange" },
  { name: "SQL", icon: Database, jobs: 980, color: "purple" },
  { name: "React Native", icon: Smartphone, jobs: 450, color: "cyan" },
  { name: "Cybersecurity", icon: Shield, jobs: 340, color: "red" },
  { name: "Machine Learning", icon: Brain, jobs: 620, color: "emerald" },
  { name: "Node.js", icon: Code, jobs: 710, color: "green" },
]

export function TopSkills() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">In-Demand Skills</h2>
          <p className="text-muted-foreground">Explore jobs by the most sought-after skills</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topSkills.map((skill) => {
            const Icon = skill.icon
            return (
              <Link key={skill.name} href={`/jobs?skill=${skill.name}`}>
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-emerald-500">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-emerald-50 rounded-lg mb-3">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{skill.name}</h3>
                    <p className="text-sm text-emerald-600 font-medium">{skill.jobs} jobs</p>
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
