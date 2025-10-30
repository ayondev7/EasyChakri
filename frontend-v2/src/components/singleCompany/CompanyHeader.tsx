import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Globe, Calendar } from "lucide-react"
import type { Company } from "@/types"

interface CompanyHeaderProps {
  company: Company
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  return (
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
                    className="text-emerald-500 hover:underline"
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
  )
}

export default CompanyHeader
