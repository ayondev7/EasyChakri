import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Paths to ignore from middleware protection
const PUBLIC_PATHS = [
  "/",
  "/jobs",
  "/auth",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/public",
]

// Role based prefixes map
const ROLE_PATHS: { prefix: string; role: "seeker" | "recruiter" }[] = [
  { prefix: "/seeker", role: "seeker" },
  { prefix: "/recruiter", role: "recruiter" },
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip public and static assets
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next()
  }

  // Find a matching role-protected prefix
  const matched = ROLE_PATHS.find(rp => pathname.startsWith(rp.prefix))
  if (!matched) {
    // No role restriction for this path; allow
    return NextResponse.next()
  }

  // Try to get token from request (works in Edge / Server)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    // Not authenticated: redirect to sign-in with callback
    const signInUrl = new URL(`/auth/signin`, req.nextUrl.origin)
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check role claim
  if (!token.user || token.user.role !== matched.role) {
    const signInUrl = new URL(`/auth/signin`, req.nextUrl.origin)
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/seeker/:path*", "/recruiter/:path*"]
}
