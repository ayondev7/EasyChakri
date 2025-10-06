"use client"

import Link from "next/link"
import { MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"

const locations = [
  { city: "San Francisco", state: "CA", jobs: 1250 },
  { city: "New York", state: "NY", jobs: 1840 },
  { city: "Austin", state: "TX", jobs: 890 },
  { city: "Seattle", state: "WA", jobs: 1120 },
  { city: "Boston", state: "MA", jobs: 760 },
  { city: "Chicago", state: "IL", jobs: 980 },
  { city: "Los Angeles", state: "CA", jobs: 1340 },
  { city: "Denver", state: "CO", jobs: 620 },
]

export function JobsByLocation() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Jobs by Location</h2>
          <p className="text-muted-foreground">Find opportunities in your preferred city</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {locations.map((location) => (
            <Link key={location.city} href={`/jobs?location=${location.city}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-emerald-500">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{location.city}</h3>
                    <p className="text-sm text-muted-foreground">{location.state}</p>
                    <p className="text-sm text-emerald-600 font-medium mt-1">{location.jobs} jobs</p>
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
