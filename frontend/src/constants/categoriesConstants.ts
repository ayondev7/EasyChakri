import type { LucideIcon } from "lucide-react"
import {
  Users,
  Monitor,
  Settings,
  Search,
  TrendingUp,
  Briefcase,
  IndianRupee,
} from "lucide-react"

export interface CategoryWithIcon {
  id: number
  name: string
  icon: string
}

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Monitor,
  Settings,
  Search,
  TrendingUp,
  Briefcase,
  IndianRupee,
}

export const POPULAR_CATEGORIES: CategoryWithIcon[] = [
  { id: 1, name: "HR", icon: "Users" },
  { id: 2, name: "Software & IT", icon: "Monitor" },
  { id: 3, name: "Engineering", icon: "Settings" },
  { id: 4, name: "Analytics", icon: "Search" },
  { id: 5, name: "Marketing", icon: "TrendingUp" },
  { id: 6, name: "Sales", icon: "Briefcase" },
  { id: 7, name: "Banking & Finance", icon: "IndianRupee" },
]
