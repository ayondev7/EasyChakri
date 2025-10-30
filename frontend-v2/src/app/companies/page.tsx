import { CompaniesList } from "@/components/companies/CompaniesList"

export default function CompaniesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Companies</h1>
            <p className="text-muted-foreground">Explore top companies hiring on our platform</p>
          </div>

          <CompaniesList initialPage={1} pageSize={6} />
        </div>
      </main>
    </div>
  )
}
