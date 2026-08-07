import { request } from './liveApi.js'

export async function fetchAnalyticsDashboard(platform, rangeName) {
  return request(`/analytics/dashboard?platform=${encodeURIComponent(platform)}&range_name=${encodeURIComponent(rangeName)}`)
}
