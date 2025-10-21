import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const userRole = (token?.user as any)?.role

  if (pathname.startsWith("/seeker")) {
    if (!token || userRole !== "seeker") {
      return NextResponse.redirect(new URL("/auth/signin", req.nextUrl.origin))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith("/recruiter")) {
    if (!token || userRole !== "recruiter") {
      return NextResponse.redirect(new URL("/auth/signin", req.nextUrl.origin))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith("/jobs")) {
    if (!token || userRole !== "seeker") {
      const redirectUrl = userRole === "recruiter" ? "/recruiter/dashboard" : "/auth/signin"
      return NextResponse.redirect(new URL(redirectUrl, req.nextUrl.origin))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith("/companies")) {
    if (!token || userRole !== "seeker") {
      const redirectUrl = userRole === "recruiter" ? "/recruiter/dashboard" : "/auth/signin"
      return NextResponse.redirect(new URL(redirectUrl, req.nextUrl.origin))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/seeker/:path*", "/recruiter/:path*", "/jobs/:path*", "/companies/:path*"]
}
