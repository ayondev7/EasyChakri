"use client"
import { useRef } from "react"
import Link from "next/link"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CompanyCard } from "./CompanyCard"
import { useCompanies } from "@/hooks/companyHooks"
import Loader from "@/components/Loader"

export function FeaturedCompanies() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const { data, isLoading, error } = useCompanies(10)
  const companies = data?.data || []

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured companies actively hiring</h2>
          </div>
          <Loader />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured companies actively hiring</h2>
          </div>
          <div className="text-center text-red-500">Failed to load companies</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured companies actively hiring</h2>
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

          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
            {companies.map((company: any) => (
              <div key={company.id} className="flex-shrink-0 w-[320px] snap-start">
                <CompanyCard
                  id={company.id}
                  slug={company.slug}
                  name={company.name}
                  logo={company.logo}
                  employees={company.size || company.employees || `${company.jobCount || 0} employees`}
                  industry={company.industry}
                  description={company.description}
                />
              </div>
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

        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/companies">View all companies</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
