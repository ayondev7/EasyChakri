// Navbar navigation for unauthenticated users
export const publicNavLinks = [
  {
    label: "Find Jobs",
    href: "/jobs",
  },
  {
    label: "Companies",
    href: "/companies",
  },
]

// Authentication links for unauthenticated users
export const authLinks = [
  {
    label: "Sign In",
    href: "/auth/signin",
    variant: "ghost" as const,
  },
  {
    label: "Sign Up",
    href: "/auth/signup",
    variant: "default" as const,
  },
]

// Seeker navigation items (without logout - added dynamically in component)
export const seekerMenuItems = [
  {
    label: "Dashboard",
    href: "/seeker/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "My Applications",
    href: "/seeker/applications",
    icon: "FileText",
  },
  {
    label: "My Interviews",
    href: "/seeker/interviews",
    icon: "Calendar",
  },
  {
    label: "My Profile",
    href: "/seeker/profile",
    icon: "User",
  },
]

// Recruiter navigation items (without logout - added dynamically in component)
export const recruiterMenuItems = [
  {
    label: "Dashboard",
    href: "/recruiter/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Post New Job",
    href: "/recruiter/post-job",
    icon: "PlusCircle",
  },
  {
    label: "Manage Jobs",
    href: "/recruiter/jobs",
    icon: "Briefcase",
  },
  {
    label: "Manage Interviews",
    href: "/recruiter/interviews",
    icon: "Calendar",
  },
  {
    label: "Company Profile",
    href: "/recruiter/company-profile",
    icon: "Building2",
  },
]
