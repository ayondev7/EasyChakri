import { use } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
// Header and Footer provided by root layout
import { JobCard } from "@/components/JobCard"
import { mockCompanies, mockJobs } from "@/lib/MockData"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Globe, Calendar, Briefcase } from "lucide-react"

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const company = mockCompanies.find((c) => c.id === id)

  if (!company) {
    notFound()
  }

  const companyJobs = mockJobs.filter((job) => job.company.id === company.id)

  return (
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Company Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={company.logo || "/placeholder.svg?height=96&width=96"}
                    alt={company.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{company.name}</h1>
                  <p className="text-lg text-muted-foreground mb-4">{company.industry}</p>
                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{company.size} employees</span>
                    </div>
                    {company.founded && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Founded {company.founded}</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-500 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h2 className="font-semibold text-lg mb-3">About {company.name}</h2>
                <p className="text-muted-foreground leading-relaxed">{company.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Company Jobs */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="h-6 w-6 text-cyan-500" />
              <h2 className="text-2xl font-bold">Open Positions ({companyJobs.length})</h2>
            </div>

            {companyJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companyJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No open positions at the moment</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
  )
}
