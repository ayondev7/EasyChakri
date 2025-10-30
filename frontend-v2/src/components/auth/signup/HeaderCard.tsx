import React from "react"
import { Briefcase } from "lucide-react"

export default function HeaderCard() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-500 mb-4">
        <Briefcase className="h-6 w-6" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Create Account</h1>
      <p className="text-muted-foreground">Join thousands of job seekers and recruiters</p>
    </div>
  )
}
