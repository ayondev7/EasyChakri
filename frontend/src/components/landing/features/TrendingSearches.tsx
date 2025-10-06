"use client"

import Link from "next/link"
import { TrendingUp, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const trendingKeywords = [
  { keyword: "React Developer", count: 450 },
  { keyword: "Data Scientist", count: 380 },
  { keyword: "Product Manager", count: 320 },
  { keyword: "DevOps Engineer", count: 290 },
  { keyword: "UX Designer", count: 260 },
  { keyword: "Full Stack", count: 410 },
  { keyword: "Machine Learning", count: 340 },
  { keyword: "Cloud Architect", count: 220 },
  { keyword: "Mobile Developer", count: 310 },
  { keyword: "Cybersecurity", count: 190 },
  { keyword: "Blockchain", count: 150 },
  { keyword: "AI Engineer", count: 280 },
]

export function TrendingSearches() {
  return (
    <section className="py-[100px]">
      <div className="container mx-auto px-[100px]">
        <div className="mb-8 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-emerald-600" />
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Trending Searches</h2>
            <p className="text-muted-foreground">Most searched job titles this week</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {trendingKeywords.map((item) => (
            <Link key={item.keyword} href={`/jobs?search=${item.keyword}`}>
                <Badge
                variant="outline"
                className="px-[100px] py-[12px] text-base hover:bg-emerald-50 hover:border-emerald-500 cursor-pointer transition-colors"
              >
                <Search className="h-3 w-3 mr-2" />
                {item.keyword}
                <span className="ml-2 text-emerald-600 font-semibold">({item.count})</span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
