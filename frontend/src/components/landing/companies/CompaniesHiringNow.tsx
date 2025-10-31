"use client"

import { useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCompaniesByIndustry } from "@/hooks/companyHooks"
import Loader from "@/components/Loader"
import useEmblaCarousel from "embla-carousel-react"

export function CompaniesHiringNow() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: "start",
    slidesToScroll: 1,
  })
  const { data, isLoading } = useCompaniesByIndustry()
  
  const companiesByIndustry = data?.data || []

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Leading Industries</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Leading Industries</h2>
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
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Leading Industries</h2>
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
          <div className="flex gap-4">
            {companiesByIndustry.map((item) => (
              <div key={item.industry} className="flex-[0_0_280px] min-w-0">
                <Link href={`/jobs?industry=${item.industry}`}>
                  <div className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-emerald-500 hover:shadow-lg transition-all duration-300 h-full">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg group-hover:text-emerald-600 transition-colors">{item.industry}</h3>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{item.count}+ are actively hiring</p>
                    <div className="flex gap-2 flex-wrap">
                      {item.companies.map((company) => (
                        <div
                          key={company.id}
                          className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 group-hover:border-emerald-200 transition-colors"
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
