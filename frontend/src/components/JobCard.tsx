import Link from "next/link"
import Image from "next/image"
import type { Job } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Clock, Bookmark } from "lucide-react"
import { formatDate } from "@/utils/utils"
import { useSavedJobs } from "@/contexts/SavedJobsContext"
import ApplyButton from "@/components/jobs/ApplyButton"
import { useAuth } from "@/contexts/AuthContext"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const { isJobSaved, saveJob, unsaveJob } = useSavedJobs()
  const { user } = useAuth()

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
    <div className="group bg-white border border-gray-200 rounded-lg hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={job.company?.logo || "/placeholder.svg?height=48&width=48"}
                alt={job.company?.name || "Company"}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/jobs/${job.id}`} className="group-hover:text-emerald-500 transition-colors">
                <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-1">{job.title}</h3>
              </Link>
              <p className="text-sm text-gray-600 line-clamp-1">{job.company?.name || "N/A"}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={handleBookmark}
          >
            <Bookmark className={`h-4 w-4 ${isJobSaved(job.id) ? 'fill-current text-emerald-500' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Card Content */}
      <div className="px-6 pb-6 space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
            {job.type.replace('_', ' ')}
          </Badge>
          <Badge variant="outline">{job.experience}</Badge>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
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
            <span>{formatDate(job.createdAt || job.postedDate)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {job.skills?.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills && job.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 3}
            </Badge>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 pb-6 pt-4 border-t border-gray-200">
        {user?.role === "seeker" ? (
          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/jobs/${job.id}`}>View Details</Link>
            </Button>
            <ApplyButton 
              jobId={job.id} 
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
            />
          </div>
        ) : (
          <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
