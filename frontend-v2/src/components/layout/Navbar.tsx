"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Menu, X } from "lucide-react"
import CustomAvatar from "@/components/CustomAvatar"
import { getInitials } from "@/utils/utils"
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown"
import { NotificationIcon } from "@/components/notifications/NotificationIcon"
import { useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

    return (
    <header className="sticky px-[100px] top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container mx-auto flex h-[100px] items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="EasyChakri" width={800} height={800} priority className="object-contain w-[200px] h-[80px]" />
          </Link>

          {!isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/jobs"
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  isActive("/jobs") ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Find Jobs
              </Link>
              <Link
                href="/companies"
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  isActive("/companies") ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Companies
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user && <NotificationsDropdown />}

          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <Link href={`/${user.role.toLowerCase()}/dashboard`} className="hidden md:flex items-center gap-3">
                <CustomAvatar src={user?.image || "/placeholder.svg"} name={user.name} alt={user.name} className="h-9 w-9" />
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">{user.role}</p>
                </div>
              </Link>
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="container mx-auto py-[100px] flex flex-col gap-4">
            {!isAuthenticated && (
              <>
                <Link
                  href="/jobs"
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    isActive("/jobs") ? "text-foreground" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link
                  href="/companies"
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    isActive("/companies") ? "text-foreground" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Companies
                </Link>
              </>
            )}
            {!isAuthenticated && (
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
