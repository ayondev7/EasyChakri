import API_URL from "."

const BASE = `${API_URL}/companies`

export const COMPANY_ROUTES = {
  getAll: `${BASE}`,
  getById: (id: string) => `${BASE}/${id}`,
  create: `${BASE}`,
  updateById: (id: string) => `${BASE}/${id}`,
  deleteById: (id: string) => `${BASE}/${id}`,
  uploadLogo: (id: string) => `${BASE}/${id}/upload-logo`,
  recruiterMyCompany: `${BASE}/recruiter/my-company`,
  statsByIndustry: `${BASE}/stats/by-industry`,
} as const

export default COMPANY_ROUTES
