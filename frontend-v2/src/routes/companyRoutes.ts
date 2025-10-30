import API_URL from "./api"

const BASE = `${API_URL}/companies`

export const COMPANY_ROUTES = {
  getAll: `${BASE}/get-companies`,
  getById: (id: string) => `${BASE}/get-company/${id}`,
  create: `${BASE}/create-company`,
  updateById: (id: string) => `${BASE}/update-company/${id}`,
  deleteById: (id: string) => `${BASE}/delete-company/${id}`,
  uploadLogo: (id: string) => `${BASE}/upload-logo/${id}`,
  recruiterMyCompany: `${BASE}/recruiter/my-company`,
  statsByIndustry: `${BASE}/stats/by-industry`,
} as const

export default COMPANY_ROUTES
