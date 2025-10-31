"use client"

import Link from "next/link"
import { Monitor, type LucideIcon } from "lucide-react"
import { ChevronRight } from "lucide-react"
import { POPULAR_CATEGORIES, CATEGORY_ICON_MAP } from "@/constants/categoriesConstants"

export function PopularCategories() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Popular Job Categories</h2>
          <p className="text-muted-foreground">Explore jobs by your preferred industry</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {POPULAR_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICON_MAP[category.icon] || Monitor
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
