"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CompanyCard } from "./CompanyCard"

const featuredCompanies = [
  {
    id: 1,
    name: "Intellect Design Arena",
    logo: "/tech-company-logo.jpg",
    employees: "5,000+",
    industry: "Financial Technology",
    description: "World's largest, future-ready Enterprise FinTech Company",
  },
  {
    id: 2,
    name: "Infosys",
    logo: "/data-analytics-logo.jpg",
    employees: "300,000+",
    industry: "IT Services",
    description: "Global leader in next-gen digital services & consulting.",
  },
  {
    id: 3,
    name: "Empower",
    logo: "/cloud-systems-logo.jpg",
    employees: "1,200+",
    industry: "Financial Services",
    description: "We're a financial services company.",
  },
  {
    id: 4,
    name: "Genpact",
    logo: "/innovate-labs-logo.jpg",
    employees: "100,000+",
    industry: "Professional Services",
    description: "Global professional services firm.",
  },
  {
    id: 5,
    name: "TechCorp Solutions",
    logo: "/tech-company-logo.jpg",
    employees: "2,500+",
    industry: "Technology",
    description: "Leading digital transformation company.",
  },
  {
    id: 6,
    name: "DataFlow Analytics",
    logo: "/data-analytics-logo.jpg",
    employees: "850+",
    industry: "Data Analytics",
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
                <CompanyCard
                  id={company.id}
                  name={company.name}
                  logo={company.logo}
                  employees={company.employees}
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
