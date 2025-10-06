import { Navbar } from "@/components/layout/Navbar"
import { mockCompanies } from "@/utils/MockData"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Briefcase } from "lucide-react"

export default function CompaniesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Companies</h1>
            <p className="text-muted-foreground">Explore top companies hiring on our platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCompanies.map((company) => (
              <Link key={company.id} href={`/companies/${company.id}`}>
                <Card className="group hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg h-full">
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
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-cyan-500 transition-colors line-clamp-1">
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
                      <div className="flex items-center gap-2 text-cyan-500 font-medium">
                        <Briefcase className="h-4 w-4" />
                        <span>{company.jobCount} Jobs</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
