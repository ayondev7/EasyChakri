"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function JobAlertsCta() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Job alerts will be sent to: ${email}`)
    setEmail("")
  }

  return (
    <section className="py-[100px]">
  <div className="container mx-auto">
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6">
              <Bell className="h-8 w-8" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">Never Miss Your Dream Job</h2>
            <p className="text-emerald-50 text-lg mb-8">
              Get personalized job recommendations delivered straight to your inbox
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white text-gray-900"
                  required
                />
              </div>
              <Button type="submit" size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 h-12">
                Subscribe Now
              </Button>
            </form>

            <p className="text-emerald-50 text-sm mt-4">Join 500,000+ professionals receiving daily job alerts</p>
          </div>
        </Card>
      </div>
    </section>
  )
}
