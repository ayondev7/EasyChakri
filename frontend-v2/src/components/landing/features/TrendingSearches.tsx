"use client"
import Link from "next/link"
import { TrendingUp, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTrendingSearches } from "@/hooks/jobHooks"
import Loader from "@/components/Loader"

export function TrendingSearches() {
  const { data, isLoading } = useTrendingSearches(12)
  
  const trendingKeywords = data?.data || []

  if (isLoading) {
    return (
      <section className="py-[100px]">
    <div className="container mx-auto">
          <div className="mb-8 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-emerald-600" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Trending Searches</h2>
              <p className="text-muted-foreground">Most searched job titles this week</p>
            </div>
          </div>
          <Loader />
        </div>
      </section>
    )
  }

  if (trendingKeywords.length === 0) {
    return (
      <section className="py-[100px]">
        <div className="container mx-auto">
          <div className="mb-8 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-emerald-600" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Trending Searches</h2>
              <p className="text-muted-foreground">Most searched job titles this week</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">No trending data available at the moment.</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-[100px]">
  <div className="container mx-auto">
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
             className="px-4 py-[12px] text-base hover:bg-emerald-50 hover:border-emerald-500 cursor-pointer transition-colors"
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
