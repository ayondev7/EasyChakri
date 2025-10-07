import React from "react"
import { Lock } from "lucide-react"

export default function Header() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-500 mb-4">
        <Lock className="h-6 w-6" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Sign In</h1>
      <p className="text-muted-foreground">Welcome back — sign in to continue</p>
    </div>
  )
}
