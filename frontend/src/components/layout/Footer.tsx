import Link from "next/link"
import { Briefcase, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
]

const footerSections = [
  {
    title: "For Job Seekers",
    links: [
      { label: "Browse Jobs", href: "/jobs" },
      { label: "Browse Companies", href: "/companies" },
      { label: "My Applications", href: "/seeker/dashboard" },
      { label: "My Profile", href: "/seeker/profile" },
    ],
  },
  {
    title: "For Employers",
    links: [
      { label: "Post a Job", href: "/recruiter/post-job" },
      { label: "Manage Jobs", href: "/recruiter/dashboard" },
      { label: "Create Account", href: "/auth/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-emerald-600 bg-emerald-500 px-[100px]">
      <div className="container mx-auto py-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white shadow-lg">
                <Briefcase className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-white">
                EasyChakri
              </span>
            </div>
            <p className="text-sm text-emerald-50 leading-relaxed">
              Your trusted partner in finding the perfect career opportunity and building your future.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="p-2.5 rounded-lg bg-emerald-600 text-white hover:bg-white hover:text-emerald-600 hover:scale-110 transition-all duration-300 shadow-md"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-6 text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-emerald-50 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block relative group"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-emerald-400">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-emerald-50">
              &copy; 2025 <span className="text-white font-semibold">EasyChakri</span>. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-emerald-100">
              <span className="hover:text-white cursor-pointer transition-colors">Made with ❤️ for job seekers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
