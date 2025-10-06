import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-lg bg-cyan-500/10 text-cyan-500 mb-6">
          <Briefcase className="h-8 w-8" />
        </div>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  )
}
