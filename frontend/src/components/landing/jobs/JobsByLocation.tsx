"use client"

import Link from "next/link"
import { MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useJobsByLocation } from "@/hooks/jobHooks"

export function JobsByLocation() {
  const { data, isLoading } = useJobsByLocation(8)
  
  const locations = data?.data || []

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Jobs by Location</h2>
            <p className="text-muted-foreground">Find opportunities in your preferred city</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading locations...</div>
          </div>
        </div>
      </section>
    )
  }

  if (locations.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Jobs by Location</h2>
            <p className="text-muted-foreground">Find opportunities in your preferred city</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">No locations available at the moment.</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Jobs by Location</h2>
          <p className="text-muted-foreground">Find opportunities in your preferred city</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {locations.map((location) => (
            <Link key={location.location} href={`/jobs?location=${location.location}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-emerald-500">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{location.location}</h3>
                    <p className="text-sm text-emerald-600 font-medium mt-1">{location.count} jobs</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
