import Link from "next/link"
import { Briefcase, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
  <div className="container mx-auto py-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold">EasyChakri</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner in finding the perfect career opportunity.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/jobs" className="hover:text-foreground transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-foreground transition-colors">
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link href="/seeker/dashboard" className="hover:text-foreground transition-colors">
                  My Applications
                </Link>
              </li>
              <li>
                <Link href="/seeker/profile" className="hover:text-foreground transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/recruiter/post-job" className="hover:text-foreground transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/recruiter/dashboard" className="hover:text-foreground transition-colors">
                  Manage Jobs
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-foreground transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 EasyChakri. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
