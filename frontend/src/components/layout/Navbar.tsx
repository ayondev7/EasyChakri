"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { LogOut, User, LayoutDashboard, Briefcase, Menu, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/utils/utils"
import { NotificationsDropdown } from "@/components/NotificationsDropdown"
import { useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

    return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container mx-auto flex h-[100px] items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="EasyChakri" width={800} height={800} priority className="object-contain w-[200px] h-[80px]" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {user?.role !== "recruiter" && (
              <>
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
              </>
            )}
            {user?.role === "recruiter" && (
              <Link
                href="/recruiter/dashboard"
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  pathname.startsWith("/recruiter") ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user && <NotificationsDropdown />}

          {isAuthenticated && user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-emerald-500/10 text-emerald-500">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {user.role === "seeker" ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/seeker/dashboard" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/seeker/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/recruiter/dashboard" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/recruiter/post-job" className="cursor-pointer">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Post Job
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
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
            {user?.role !== "recruiter" && (
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
            {user?.role === "recruiter" && (
              <Link
                href="/recruiter/dashboard"
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  pathname.startsWith("/recruiter") ? "text-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
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
