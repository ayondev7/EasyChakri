import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  if (!token) {
    if (pathname.startsWith("/seeker") || pathname.startsWith("/recruiter")) {
      const signInUrl = new URL("/auth/signin", req.nextUrl.origin)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }
    return NextResponse.next()
  }


  const userRole = token.user?.role as string | undefined
  
  if (!userRole) {
    
    if (pathname.startsWith("/seeker") || pathname.startsWith("/recruiter")) {
      return NextResponse.redirect(new URL("/auth/signin", req.nextUrl.origin))
    }
    return NextResponse.next()
  }


  const normalizedRole = userRole.toUpperCase()

  if (pathname.startsWith("/seeker")) {
    if (normalizedRole !== "SEEKER") {
      return NextResponse.redirect(new URL("/auth/signin", req.nextUrl.origin))
    }
  }

  if (pathname.startsWith("/recruiter")) {
    if (normalizedRole !== "RECRUITER") {
      return NextResponse.redirect(new URL("/auth/signin", req.nextUrl.origin))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/seeker/:path*", "/recruiter/:path*"]
}
