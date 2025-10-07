"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HeaderCard from "@/components/auth/signup/HeaderCard"
import SignupForm from "@/components/auth/signup/SignupForm"

export default function SignUpPage() {
  const [role, setRole] = useState<"seeker" | "recruiter">("seeker")

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <HeaderCard />

          <Tabs value={role} onValueChange={(v) => setRole(v as "seeker" | "recruiter")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="seeker">Job Seeker</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </Tabs>

          <SignupForm role={role} />
        </div>
      </main>
    </div>
  )
}
