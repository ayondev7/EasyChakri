import type { LucideIcon } from "lucide-react"
import {
  Home,
  Building2,
  Users,
  Monitor,
  Settings,
  GraduationCap,
  Search,
  Award,
  TrendingUp,
  Briefcase,
  IndianRupee,
} from "lucide-react"

export interface CategoryWithIcon {
  id: number
  name: string
  icon: string
  jobCount: number
}

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Home,
  Building2,
  Users,
  Monitor,
  Settings,
  GraduationCap,
  Search,
  Award,
  TrendingUp,
  Briefcase,
  IndianRupee,
}

export const POPULAR_CATEGORIES: CategoryWithIcon[] = [
  { id: 1, name: "Remote", icon: "Home", jobCount: 1250 },
  { id: 2, name: "MNC", icon: "Building2", jobCount: 3420 },
  { id: 3, name: "HR", icon: "Users", jobCount: 890 },
  { id: 4, name: "Software & IT", icon: "Monitor", jobCount: 5670 },
  { id: 5, name: "Engineering", icon: "Settings", jobCount: 2340 },
  { id: 6, name: "Internship", icon: "GraduationCap", jobCount: 1560 },
  { id: 7, name: "Analytics", icon: "Search", jobCount: 980 },
  { id: 8, name: "Fortune 500", icon: "Award", jobCount: 2100 },
  { id: 9, name: "Marketing", icon: "TrendingUp", jobCount: 1450 },
  { id: 10, name: "Sales", icon: "Briefcase", jobCount: 1890 },
  { id: 11, name: "Banking & Finance", icon: "IndianRupee", jobCount: 1670 },
]
