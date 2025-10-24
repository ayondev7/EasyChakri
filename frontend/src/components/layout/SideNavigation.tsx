"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  User,
  Building2,
  PlusCircle,
  Users,
  Bell,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

export function SideNavigation() {
  const pathname = usePathname()
  const { user } = useAuth()

  const seekerNavItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/seeker/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Applications",
      href: "/seeker/applications",
      icon: FileText,
    },
    {
      label: "My Interviews",
      href: "/seeker/interviews",
      icon: Calendar,
    },
    {
      label: "My Profile",
      href: "/seeker/profile",
      icon: User,
    },
  ]

  const recruiterNavItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/recruiter/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Post New Job",
      href: "/recruiter/post-job",
      icon: PlusCircle,
    },
    {
      label: "My Jobs",
      href: "/recruiter/jobs",
      icon: Briefcase,
    },
    {
      label: "Interviews",
      href: "/recruiter/interviews",
      icon: Calendar,
    },
    {
      label: "Company Profile",
      href: "/recruiter/company-profile",
      icon: Building2,
    },
  ]

  const navItems = user?.role === "recruiter" ? recruiterNavItems : seekerNavItems

  const isActive = (href: string) => {
    if (href === "/seeker/dashboard" || href === "/recruiter/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-28">
        <Card className="p-4 border-border/50 shadow-sm">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      active ? "text-emerald-500" : ""
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions Section */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
              Quick Access
            </h3>
            <div className="space-y-1">
              <Link
                href="/jobs"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <Briefcase className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Browse Jobs</span>
              </Link>
              <Link
                href="/companies"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Companies</span>
              </Link>
              <Link
                href="/notifications"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <Bell className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Notifications</span>
              </Link>
            </div>
          </div>

          {/* User Info Card */}
          {user && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="px-4 py-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </aside>
  )
}
