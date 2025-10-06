"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const featuredCompanies = [
  {
    id: 1,
    name: "Intellect Design Arena",
    logo: "/tech-company-logo.jpg",
    rating: 3.7,
    reviews: "2.3K+ reviews",
    description: "World's largest, future-ready Enterprise FinTech Company",
  },
  {
    id: 2,
    name: "Infosys",
    logo: "/data-analytics-logo.jpg",
    rating: 3.5,
    reviews: "44.8K+ reviews",
    description: "Global leader in next-gen digital services & consulting.",
  },
  {
    id: 3,
    name: "Empower",
    logo: "/cloud-systems-logo.jpg",
    rating: 4.0,
    reviews: "517 reviews",
    description: "We're a financial services company.",
  },
  {
    id: 4,
    name: "Genpact",
    logo: "/innovate-labs-logo.jpg",
    rating: 3.7,
    reviews: "38.2K+ reviews",
    description: "Global professional services firm.",
  },
  {
    id: 5,
    name: "TechCorp Solutions",
    logo: "/tech-company-logo.jpg",
    rating: 4.2,
    reviews: "1.5K+ reviews",
    description: "Leading digital transformation company.",
  },
  {
    id: 6,
    name: "DataFlow Analytics",
    logo: "/data-analytics-logo.jpg",
    rating: 4.1,
    reviews: "890 reviews",
    description: "Data-driven insights for modern businesses.",
  },
]

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
            {featuredCompanies.map((company) => (
              <div key={company.id} className="flex-shrink-0 w-[320px] snap-start">
                <div className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-emerald-500 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                      <Image
                        src={company.logo || "/placeholder.svg"}
                        alt={company.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{company.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{company.rating}</span>
                        </div>
                        <span className="text-muted-foreground">{company.reviews}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 flex-1">{company.description}</p>

                  <Button
                    variant="outline"
                    className="w-full text-emerald-600 border-emerald-600 hover:bg-emerald-50 bg-transparent"
                    asChild
                  >
                    <Link href={`/companies/${company.id}`}>View jobs</Link>
                  </Button>
                </div>
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
