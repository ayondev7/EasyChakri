import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { satoshi } from "@/utils/font"

export const metadata: Metadata = {
  title: "EasyChakri - Find Your Dream Job",
  description: "Connect with top companies and find your perfect career opportunity",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${satoshi.variable} font-sans antialiased`}>
        <Providers>
          <Navbar />
          <main className="container mx-auto px-[100px]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
