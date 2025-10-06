import { Search, FileText, CheckCircle, Rocket } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    icon: Search,
    title: "Search Jobs",
    description: "Browse thousands of job listings from top companies across various industries",
  },
  {
    icon: FileText,
    title: "Create Profile",
    description: "Build your professional profile and upload your resume to stand out",
  },
  {
    icon: CheckCircle,
    title: "Apply Easily",
    description: "Apply to multiple jobs with one click using your saved profile",
  },
  {
    icon: Rocket,
    title: "Get Hired",
    description: "Connect with recruiters and land your dream job faster",
  },
]

export function HowItWorks() {
  return (
    <section className="py-[100px] md:py-[100px]">
      <div className="container mx-auto px-[100px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">How It Works</h2>
          <p className="text-muted-foreground">Get hired in 4 easy steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={index} className="relative border-border/40">
                <CardContent className="p-6 text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-emerald-500/10 text-emerald-500 mb-4 mt-4">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
