import API_URL from "."

const BASE = `${API_URL}/users`

export const USER_ROUTES = {
  me: `${BASE}/me`,
  checkProfileComplete: `${BASE}/check-profile-complete`,
} as const

export default USER_ROUTES
