"use client"

import Link from "next/link"
import { Home, Globe, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function RemoteJobs() {
  return (
    <section className="py-[100px] bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="container mx-auto px-[100px]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6">
            <Home className="h-4 w-4" />
            <span className="font-semibold">Work From Anywhere</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4">Discover Remote Opportunities</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join the future of work with 1,200+ remote positions from companies worldwide
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white">
              <Globe className="h-8 w-8 text-emerald-600 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Global Companies</h3>
              <p className="text-sm text-muted-foreground">Work with teams from around the world</p>
            </Card>
            <Card className="p-6 bg-white">
              <Clock className="h-8 w-8 text-emerald-600 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Flexible Hours</h3>
              <p className="text-sm text-muted-foreground">Choose your own schedule and work-life balance</p>
            </Card>
            <Card className="p-6 bg-white">
              <Home className="h-8 w-8 text-emerald-600 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Work From Home</h3>
              <p className="text-sm text-muted-foreground">Save commute time and work comfortably</p>
            </Card>
          </div>

          <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/jobs?type=Remote">Browse Remote Jobs</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
