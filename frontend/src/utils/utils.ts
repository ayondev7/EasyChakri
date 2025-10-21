import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date?: Date | string | null): string {
  if (!date) return "Unknown"

  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return "Unknown"

  const now = new Date()
  const diffInMs = now.getTime() - d.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "Today"
  if (diffInDays === 1) return "Yesterday"
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

/**
 * Format a deadline date into a human-friendly relative string.
 * Examples:
 *  - future: "20 days left" or "in 3 weeks"
 *  - past: "30 days ago" or "2 months ago"
 *  - today: "Today"
 *  - invalid/null: "No deadline"
 */
export function formatDeadline(date?: Date | string | null): string {
  if (!date) return "No deadline"

  const d = typeof date === "string" ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return "No deadline"

  const day = d.getDate()
  const monthShort = d.toLocaleString("en-US", { month: "short" })
  const year = d.getFullYear()

  // Return in the form: 2 Nov, 2025
  return `${day} ${monthShort}, ${year}`
}

export function formatSalary(salary?: string | number | null): string {
  if (salary === null || salary === undefined) return ""

  // If a number is passed directly
  if (typeof salary === "number") {
    return salary.toLocaleString("en-US")
  }

  const raw = String(salary).trim()
  if (!raw) return ""

  // Try to capture a trailing currency token like 'BDT' or 'USD'
  const currencyMatch = raw.match(/([A-Za-z]+)$/)
  const currency = currencyMatch ? ` ${currencyMatch[1]}` : ""

  // Core part without the currency token
  const core = currencyMatch ? raw.slice(0, raw.lastIndexOf(currencyMatch[1])).trim() : raw

  // If it's a range like 110000-190000 or 110000 - 190000
  if (core.includes("-")) {
    const parts = core.split("-").map((p) => p.trim())
    const formattedParts = parts.map((p) => {
      const digits = p.replace(/[^0-9]/g, "")
      if (!digits) return p
      return Number(digits).toLocaleString("en-US")
    })
    return `${formattedParts.join("-")}${currency}`
  }

  // Single amount
  const digits = core.replace(/[^0-9]/g, "")
  if (!digits) return raw
  return `${Number(digits).toLocaleString("en-US")}${currency}`
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Remove trailing parenthesized company name from a job title.
 * Example: "Senior Engineer (Acme Corp)" -> "Senior Engineer"
 */
export function stripParenthesizedCompany(title?: string | null): string {
  if (!title) return ""
  // Remove any trailing ' (....)' including nested parentheses content
  return String(title).replace(/\s*\([^)]*\)\s*$/, "").trim()
}
