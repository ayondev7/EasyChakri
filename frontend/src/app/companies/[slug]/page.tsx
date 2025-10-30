import { notFound } from "next/navigation"
import type { Company, Job } from "@/types"
import COMPANY_ROUTES from "@/routes/companyRoutes"
import JOB_ROUTES from "@/routes/jobRoutes"
import CompanyHeader from "@/components/singleCompany/CompanyHeader"
import CompanyJobs from "@/components/singleCompany/CompanyJobs"

async function fetchCompanyData(slug: string): Promise<Company | null> {
  try {
    const res = await fetch(COMPANY_ROUTES.getById(slug), { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!res.ok) {
      console.error(`Failed to fetch company: ${res.status} ${res.statusText}`)
      return null
    }
    
    const companyData = await res.json()
    return companyData?.data || companyData
  } catch (error) {
    console.error('Error fetching company:', error)
    return null
  }
}

async function fetchCompanyJobs(slug: string): Promise<Job[]> {
  try {
    const company = await fetchCompanyData(slug);
    if (!company) return [];
    
    const jobsRes = await fetch(`${JOB_ROUTES.getAll}?companyId=${company.id}`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!jobsRes.ok) {
      console.error(`Failed to fetch jobs: ${jobsRes.status} ${jobsRes.statusText}`)
      return []
    }
    
    const jobsJson = await jobsRes.json()
    return jobsJson?.data ?? []
  } catch (error) {
    console.error('Error fetching company jobs:', error)
    return []
  }
}

export default async function CompanyDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params

  const company = await fetchCompanyData(slug)
  
  if (!company) {
    notFound()
  }

  const companyJobs = await fetchCompanyJobs(slug)

  return (
    <main className="py-8">
      <div className="container mx-auto px-4">
        <CompanyHeader company={company} />
        <CompanyJobs jobs={companyJobs} companyName={company.name} />
      </div>
    </main>
  )
}
