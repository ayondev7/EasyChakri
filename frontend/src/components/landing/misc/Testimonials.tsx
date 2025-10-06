"use client"

import { Star, Quote } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "TechCorp",
    avatar: "/professional-female.png",
    rating: 5,
    text: "I found my dream job within 2 weeks of signing up. The platform is intuitive and the job recommendations were spot on!",
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "DataFlow",
    avatar: "/professional-male.jpg",
    rating: 5,
    text: "As a recruiter, this platform has been invaluable. We've hired 5 amazing candidates in the last 3 months.",
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    company: "HealthTech Pro",
    avatar: "/avatar-placeholder.png",
    rating: 5,
    text: "The application process is so smooth. I love how I can track all my applications in one place and get real-time updates.",
  },
  {
    name: "David Kumar",
    role: "Data Scientist",
    company: "AI Innovations",
    avatar: "/professional-male.jpg",
    rating: 5,
    text: "The job matching algorithm is incredible. Every recommendation was relevant to my skills and career goals.",
  },
  {
    name: "Lisa Anderson",
    role: "Marketing Manager",
    company: "BrandBoost",
    avatar: "/professional-female.png",
    rating: 5,
    text: "I've used many job portals, but this one stands out. The user experience is exceptional and the support team is responsive.",
  },
  {
    name: "James Wilson",
    role: "Full Stack Developer",
    company: "WebSolutions",
    avatar: "/professional-male.jpg",
    rating: 5,
    text: "Got multiple interview calls within the first week. The platform really connects you with serious employers.",
  },
  {
    name: "Priya Sharma",
    role: "HR Manager",
    company: "TalentHub",
    avatar: "/professional-female.png",
    rating: 5,
    text: "As a recruiter, I appreciate the quality of candidates. The filtering options help us find the perfect match quickly.",
  },
  {
    name: "Robert Taylor",
    role: "Business Analyst",
    company: "ConsultPro",
    avatar: "/professional-male.jpg",
    rating: 5,
    text: "The salary insights and company reviews helped me make an informed decision. Landed a job with 40% salary hike!",
  },
]

export function Testimonials() {
  return (
    <section className="py-[100px] bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-[100px] mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Success Stories</h2>
          <p className="text-muted-foreground">Hear from our community of job seekers and recruiters</p>
        </div>
      </div>

      <div className="relative">
        <div className="flex animate-marquee hover:pause">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <Card key={`${testimonial.name}-${index}`} className="flex-shrink-0 w-[380px] mx-3 p-6 relative">
              <Quote className="h-8 w-8 text-emerald-200 absolute top-4 right-4" />

              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-muted-foreground">{testimonial.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
