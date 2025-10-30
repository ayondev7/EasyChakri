interface SeekerHeaderProps {
  userName?: string
}

export default function SeekerHeader({ userName }: SeekerHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Welcome back, {userName || "User"}!
      </h1>
      <p className="text-muted-foreground">
        Track your applications and discover new opportunities
      </p>
    </div>
  )
}
