"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCompaniesByIndustry } from "@/hooks/companyHooks"
import Loader from "@/components/Loader"

export function CompaniesHiringNow() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data, isLoading } = useCompaniesByIndustry()
  
  const companiesByIndustry = data?.data || []

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Top companies hiring now</h2>
          </div>
          <Loader />
        </div>
      </section>
    )
  }

  if (companiesByIndustry.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Top companies hiring now</h2>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">No companies available at the moment.</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Top companies hiring now</h2>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hidden md:flex"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
            {companiesByIndustry.map((item) => (
              <Link
                key={item.industry}
                href={`/jobs?industry=${item.industry}`}
                className="flex-shrink-0 w-[280px] snap-start"
              >
                <div className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all duration-200 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{item.industry}</h3>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{item.count}+ are actively hiring</p>
                  <div className="flex gap-2 flex-wrap">
                    {item.companies.map((company) => (
                      <div
                        key={company.id}
                        className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                      >
                        <Image
                          src={company.logo || "/placeholder.svg"}
                          alt={company.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hidden md:flex"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
