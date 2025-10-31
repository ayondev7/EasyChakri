"use client"
import { useCallback } from "react"
import Link from "next/link"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CompanyCard } from "./CompanyCard"
import { useCompanies } from "@/hooks/companyHooks"
import Loader from "@/components/Loader"
import useEmblaCarousel from "embla-carousel-react"

export function FeaturedCompanies() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: "start",
    slidesToScroll: 1,
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const { data, isLoading, error } = useCompanies(10)
  const companies = data?.data || []

  if (isLoading) {
    return (
      <section className="py-16">
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
      <section className="py-16">
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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Featured companies actively hiring</h2>
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-white hover:bg-emerald-500 hover:text-white border-gray-300 shadow-sm transition-all duration-200"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-white hover:bg-emerald-500 hover:text-white border-gray-300 shadow-sm transition-all duration-200"
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {companies.map((company: any) => (
              <div key={company.id} className="flex-[0_0_320px] min-w-0">
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
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" className="hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-200" asChild>
            <Link href="/companies">View all companies</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
