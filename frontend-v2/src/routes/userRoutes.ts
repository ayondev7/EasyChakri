import API_URL from "./api"

const BASE = `${API_URL}/users`

export const USER_ROUTES = {
  me: `${BASE}/me`,
  profileDetails: `${BASE}/profile-details`,
  getProfileInformation: `${BASE}/get-profile-information`,
  checkProfileComplete: `${BASE}/profile-status`,
  getById: (id: string) => `${BASE}/get-user/${id}`,
} as const

export default USER_ROUTES
