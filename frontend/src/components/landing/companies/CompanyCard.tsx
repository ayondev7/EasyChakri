"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export interface CompanyCardProps {
  id: string | number
  name: string
  logo?: string
  employees?: string
  industry?: string
  description?: string
}

export function CompanyCard({ id, name, logo, employees, industry, description }: CompanyCardProps) {
  return (
    <div className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-emerald-500 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
          <Image
            src={logo || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{name}</h3>
          <div className="flex flex-col items-start gap-3 text-xs text-muted-foreground">
            {industry && <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{industry}</span>}
            {employees && <span className="text-xs">{employees} employees</span>}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6 flex-1">{description}</p>

      <Button
        variant="outline"
        className="w-full text-emerald-600 border-emerald-600 hover:bg-emerald-50 bg-transparent"
        asChild
      >
        <Link href={`/companies/${id}`}>View jobs</Link>
      </Button>
    </div>
  )
}
