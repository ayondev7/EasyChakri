"use client"

import Link from "next/link"
import Image from "next/image"
import { useCompanies } from "@/hooks/companyHooks"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Briefcase } from "lucide-react"
import Loader from "@/components/Loader"

export function TopCompanies() {
  const { data, isLoading } = useCompanies(6, 1)
  
  const companies = data?.data || []

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <Loader />
        </div>
      </section>
    )
  }

  if (companies.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">No companies available at the moment.</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Top Companies Hiring</h2>
            <p className="text-muted-foreground">Explore opportunities at leading organizations</p>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link href="/companies">
              View All Companies
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Link key={company.id} href={`/companies/${company.slug}`}>
              <Card className="group hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={company.logo || "/placeholder.svg?height=64&width=64"}
                        alt={company.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-emerald-500 transition-colors line-clamp-1">
                        {company.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{company.industry}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{company.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500 font-medium">
                      <Briefcase className="h-4 w-4" />
                      <span>{company._count?.jobs || 0} Jobs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/companies">
              View All Companies
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
