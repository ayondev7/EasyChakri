"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Building2, MapPin, Globe } from "lucide-react"
import type { Job } from "@/types"

interface CompanyInfoProps {
  job: Job
}

export function CompanyInfo({ job }: CompanyInfoProps) {
  const company = job.company

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Company</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted">
            <Image
              src={company.logo || "/placeholder.svg?height=64&width=64"}
              alt={company.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold">{company.name}</h3>
            <p className="text-sm text-muted-foreground">{company.industry}</p>
          </div>
        </div>

        {company.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{company.description}</p>
        )}

        <Separator />

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{company.industry}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{company.location}</span>
          </div>
          {company.website && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-4 w-4" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-500"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href={`/companies/${company.slug}`}>View Company Profile</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
