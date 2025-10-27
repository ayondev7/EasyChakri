import { JobCard } from "@/components/JobCard"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase } from "lucide-react"
import type { Job } from "@/types"

interface CompanyJobsProps {
  jobs: Job[]
  companyName: string
}

export const CompanyJobs: React.FC<CompanyJobsProps> = ({ jobs, companyName }) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="h-6 w-6 text-cyan-500" />
        <h2 className="text-2xl font-bold">Open Positions ({jobs.length})</h2>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job: Job) => (
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
  )
}
