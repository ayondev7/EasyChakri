"use client"
import type React from "react"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/auth/signin/Header"
import SigninForm from "@/components/auth/signin/SigninForm"

export default function SignInPage() {
  const [role, setRole] = useState<"seeker" | "recruiter">("seeker")

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Header />

          <Tabs value={role} onValueChange={(v) => setRole(v as "seeker" | "recruiter")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="seeker">Job Seeker</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </Tabs>

          <SigninForm role={role} />
        </div>
      </main>
    </div>
  )
}
