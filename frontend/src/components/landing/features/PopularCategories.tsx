"use client"

import Link from "next/link"
import {
  Home,
  Building2,
  Users,
  Monitor,
  Settings,
  GraduationCap,
  Search,
  Award,
  TrendingUp,
  Briefcase,
  IndianRupee,
  type LucideIcon,
} from "lucide-react"
import { ChevronRight } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Home,
  Building2,
  Users,
  Monitor,
  Settings,
  GraduationCap,
  Search,
  Award,
  TrendingUp,
  Briefcase,
  IndianRupee,
}

export function PopularCategories() {
  const categories = [
    { id: 1, name: "Remote", icon: "Home", jobCount: 1250 },
    { id: 2, name: "MNC", icon: "Building2", jobCount: 3420 },
    { id: 3, name: "HR", icon: "Users", jobCount: 890 },
    { id: 4, name: "Software & IT", icon: "Monitor", jobCount: 5670 },
    { id: 5, name: "Engineering", icon: "Settings", jobCount: 2340 },
    { id: 6, name: "Internship", icon: "GraduationCap", jobCount: 1560 },
    { id: 7, name: "Analytics", icon: "Search", jobCount: 980 },
    { id: 8, name: "Fortune 500", icon: "Award", jobCount: 2100 },
    { id: 9, name: "Marketing", icon: "TrendingUp", jobCount: 1450 },
    { id: 10, name: "Sales", icon: "Briefcase", jobCount: 1890 },
    { id: 11, name: "Banking & Finance", icon: "IndianRupee", jobCount: 1670 },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Popular Job Categories</h2>
          <p className="text-muted-foreground">Explore jobs by your preferred industry</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Monitor
            return (
              <Link key={category.id} href={`/jobs?category=${category.name}`}>
                <div className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
