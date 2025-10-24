"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Briefcase } from "lucide-react"
import { useCompanies } from "@/hooks/companyHooks"
import Pagination from "@/components/pagination/Pagination"
import { useState } from "react"
import Loader from "@/components/Loader"

interface CompaniesListProps {
  initialPage?: number
  pageSize?: number
}

export function CompaniesList({ initialPage = 1, pageSize = 6 }: CompaniesListProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const { data, isLoading, error } = useCompanies(pageSize, currentPage)

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">Failed to load companies. Please try again later.</div>
      </div>
    )
  }

  const companies = data?.data || []
  const totalPages = data?.meta?.totalPages || 1
  const total = data?.meta?.total || 0

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">No companies found.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Link key={company.id} href={`/companies/${company.id}`}>
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

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{company.description}</p>

                <div className="flex items-center justify-between text-sm pt-4 border-t">
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

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            total={total}
            page={currentPage}
            limit={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
