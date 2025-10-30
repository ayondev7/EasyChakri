import type React from "react"
import { SideNavigation } from "@/components/layout/SideNavigation"

export default function SeekerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex gap-8 py-8">
      <SideNavigation />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}
