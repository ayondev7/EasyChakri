
import { HeroSection } from "@/components/landing/hero/HeroSection"
import { FeaturedJobs } from "@/components/landing/jobs/FeaturedJobs"
import { TopCompanies } from "@/components/landing/companies/TopCompanies"
import { PopularCategories } from "@/components/landing/features/PopularCategories"
import { HowItWorks } from "@/components/landing/features/HowItWorks"
import { LatestJobs } from "@/components/landing/jobs/LatestJobs"
import { JobsByLocation } from "@/components/landing/jobs/JobsByLocation"
import { JobsByExperience } from "@/components/landing/jobs/JobsByExperience"
import { RemoteJobs } from "@/components/landing/jobs/RemoteJobs"
import { TrendingSearches } from "@/components/landing/features/TrendingSearches"
import { StatsSection } from "@/components/landing/stats/StatsSection"
import { Testimonials } from "@/components/landing/misc/Testimonials"
import { JobAlertsCta } from "@/components/landing/jobs/JobAlertsCta"
import { TopSkills } from "@/components/landing/features/TopSkills"
import { CompaniesHiringNow } from "@/components/landing/companies/CompaniesHiringNow"
import { FeaturedCompanies } from "@/components/landing/companies/FeaturedCompanies"

export default function HomePage() {
  return (
      <main className="flex-1 ">
        <HeroSection />
        <StatsSection />
        <FeaturedJobs />
        <JobsByLocation />
        <PopularCategories />
        <CompaniesHiringNow />
        <FeaturedCompanies />
        <JobsByExperience />
        <LatestJobs />
        <RemoteJobs />
        <TopSkills />
        <TrendingSearches />
        <TopCompanies />
        <Testimonials />
        <JobAlertsCta />
        <HowItWorks />
      </main>
  )
}
