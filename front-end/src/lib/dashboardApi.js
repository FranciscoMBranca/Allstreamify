import { request } from './liveApi.js'

export async function fetchDashboard() {
  return request('/dashboard')
}
