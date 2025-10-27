import { notFound } from "next/navigation"
import type { Company, Job } from "@/types"
import COMPANY_ROUTES from "@/routes/companyRoutes"
import JOB_ROUTES from "@/routes/jobRoutes"
import CompanyHeader from "@/components/singleCompany/CompanyHeader"
import CompanyJobs from "@/components/singleCompany/CompanyJobs"

async function fetchCompanyData(id: string): Promise<Company | null> {
  try {
    const res = await fetch(COMPANY_ROUTES.getById(id), { 
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
    console.log("company data", companyData);
    return companyData?.data || companyData
  } catch (error) {
    console.error('Error fetching company:', error)
    return null
  }
}

async function fetchCompanyJobs(id: string): Promise<Job[]> {
  try {
    const jobsRes = await fetch(`${JOB_ROUTES.getAll}?companyId=${id}`, { 
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
  params: { id: string } 
}) {
  const { id } = params
  console.log("id", id);

  const company = await fetchCompanyData(id)
  
  if (!company) {
    notFound()
  }

  const companyJobs = await fetchCompanyJobs(id)

  return (
    <main className="py-8">
      <div className="container mx-auto px-4">
        <CompanyHeader company={company} />
        <CompanyJobs jobs={companyJobs} companyName={company.name} />
      </div>
    </main>
  )
}
