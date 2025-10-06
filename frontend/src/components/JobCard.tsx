import Link from "next/link"
import Image from "next/image"
import type { Job } from "@/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Clock, Bookmark } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useSavedJobs } from "@/contexts/SavedJobsContext"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const { isJobSaved, saveJob, unsaveJob } = useSavedJobs()

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isJobSaved(job.id)) {
      unsaveJob(job.id)
    } else {
      saveJob(job.id)
    }
  }

  return (
    <Card className="group hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={job.company.logo || "/placeholder.svg?height=48&width=48"}
                alt={job.company.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/jobs/${job.id}`} className="group-hover:text-emerald-500 transition-colors">
                <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-1">{job.title}</h3>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-1">{job.company.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={handleBookmark}
          >
            <Bookmark className={`h-4 w-4 ${isJobSaved(job.id) ? 'fill-current text-cyan-500' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
            {job.type}
          </Badge>
          <Badge variant="outline">{job.experience}</Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{job.salary}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{formatDate(job.postedDate)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {job.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
