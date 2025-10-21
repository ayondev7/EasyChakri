import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const PUBLIC_PATHS = [
  "/",
  "/auth",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/public",
]

const ROLE_PATHS: { prefix: string; role: "seeker" | "recruiter" }[] = [
  { prefix: "/seeker", role: "seeker" },
  { prefix: "/recruiter", role: "recruiter" },
  { prefix: "/jobs", role: "seeker" },
  { prefix: "/companies", role: "seeker" },
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next()
  }

  const matched = ROLE_PATHS.find(rp => pathname.startsWith(rp.prefix))
  if (!matched) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const signInUrl = new URL(`/auth/signin`, req.nextUrl.origin)
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (!token.user || (token.user as any).role !== matched.role) {
    const dashboardUrl = (token.user as any)?.role === "recruiter" ? "/recruiter/dashboard" : "/seeker/dashboard"
    return NextResponse.redirect(new URL(dashboardUrl, req.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/seeker/:path*", "/recruiter/:path*", "/jobs/:path*", "/companies/:path*"]
}
