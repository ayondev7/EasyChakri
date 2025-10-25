import API_URL from "./api"

const BASE = `${API_URL}/notifications`

export const NOTIFICATION_ROUTES = {
  getAll: BASE,
  unreadCount: `${BASE}/unread-count`,
  markAsRead: `${BASE}/mark-as-read`,
} as const

export default NOTIFICATION_ROUTES
