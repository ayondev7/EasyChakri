import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function RecruiterHeader() {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Recruiter Dashboard</h1>
        <p className="text-muted-foreground">Manage your job postings and applications</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/recruiter/jobs">Manage Jobs</Link>
        </Button>
        <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Link href="/recruiter/post-job">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Link>
        </Button>
      </div>
    </div>
  )
}
