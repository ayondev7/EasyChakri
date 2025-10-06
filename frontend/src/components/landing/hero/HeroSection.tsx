"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (location) params.set("location", location)
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
  <div className="container mx-auto px-[100px]">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Find Your <span className="text-emerald-500">Dream Job</span> Today
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 text-pretty">
            Connect with top companies and discover opportunities that match your skills and aspirations
          </p>

          <form onSubmit={handleSearch} className="mx-auto max-w-3xl">
            <div className="flex flex-col md:flex-row gap-3 p-2 bg-card border border-border rounded-lg shadow-lg">
              <div className="flex-1 flex items-center gap-2 px-3 border-r border-border">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="flex-1 flex items-center gap-2 px-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="City or state"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button type="submit" size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Search className="h-5 w-5 mr-2" />
                Search Jobs
              </Button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-emerald-500" />
              <span>
                <strong className="text-foreground">10,000+</strong> Active Jobs
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <strong className="text-foreground">5,000+</strong> Companies
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <strong className="text-foreground">50,000+</strong> Job Seekers
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
