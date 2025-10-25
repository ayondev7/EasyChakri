"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  User,
  Building2,
  PlusCircle,
  Bell,
  LogOut,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import CustomAvatar from "@/components/CustomAvatar"
import { seekerMenuItems, recruiterMenuItems } from "@/constants/navigation"
import { getInitials } from "@/utils/utils"

interface NavItem {
  label: string
  href: string
  icon: string
  isDangerous?: boolean
}

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ElementType> = {
    LayoutDashboard,
    FileText,
    Calendar,
    User,
    Briefcase,
    PlusCircle,
    Building2,
    Bell,
    LogOut,
  }
  return iconMap[iconName] || LayoutDashboard
}

export function SideNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const seekerNavItems: NavItem[] = [
    ...seekerMenuItems.map(item => ({
      ...item,
      icon: item.icon,
    })),
    {
      label: "Logout",
      href: "#logout",
      icon: "LogOut",
      isDangerous: true,
    },
  ]

  const recruiterNavItems: NavItem[] = [
    ...recruiterMenuItems.map(item => ({
      ...item,
      icon: item.icon,
    })),
    {
      label: "Logout",
      href: "#logout",
      icon: "LogOut",
      isDangerous: true,
    },
  ]

  const navItems = user?.role === "recruiter" ? recruiterNavItems : seekerNavItems

  const isActive = (href: string) => {
    if (href.startsWith("#")) return false
    if (href === "/seeker/dashboard" || href === "/recruiter/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const handleNavClick = (href: string) => {
    if (href === "#logout") {
      logout()
      router.push("/")
    }
  }

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-28">
        <Card className="p-4 border-border/50 shadow-sm">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = getIconComponent(item.icon)
              const active = isActive(item.href)
              
              return item.href === "#logout" ? (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left",
                    item.isDangerous
                      ? "text-red-500 hover:bg-red-500/10"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              ) : (
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

          <div className="mt-6 pt-6 border-t border-border/50">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
              Quick Access
            </h3>
            <div className="space-y-1">
              <Link
                href="/jobs"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <Briefcase className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Browse Jobs</span>
              </Link>
              <Link
                href="/companies"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <Building2 className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Companies</span>
              </Link>
              <Link
                href="/notifications"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <Bell className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Notifications</span>
              </Link>
            </div>
          </div>

          {user && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="px-4 py-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <CustomAvatar src={user?.image || "/placeholder.svg"} name={user.name} alt={user.name} className="h-10 w-10 flex-shrink-0" />
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
