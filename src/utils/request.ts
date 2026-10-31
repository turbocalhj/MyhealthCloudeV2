/**
 * src/utils/request.ts
 * 向后兼容入口：旧调用方的 .post(url, data) 直接拿到 data
 */
import httpOriginal, { cancelAllRequests as _cancelAllRequests, service } from './http'
import type { ApiEnvelope } from './http'

const legacyRequest = {
  get: <T = unknown, D = unknown>(url: string, config?: { params?: D }) =>
    httpOriginal.get<T, D>(url, { params: config?.params }) as Promise<T>,
  post: <T = unknown, D = unknown>(url: string, data?: D) =>
    httpOriginal.post<T, D>(url, { data }) as Promise<T>,
  put: <T = unknown, D = unknown>(url: string, data?: D) =>
    httpOriginal.put<T, D>(url, { data }) as Promise<T>,
  patch: <T = unknown, D = unknown>(url: string, data?: D) =>
    httpOriginal.patch<T, D>(url, { data }) as Promise<T>,
  delete: <T = unknown, D = unknown>(url: string, config?: { params?: D }) =>
    httpOriginal.delete<T, D>(url, { params: config?.params }) as Promise<T>
} as const

export default legacyRequest

export const cancelAllRequests = _cancelAllRequests
export { service }
export type { ApiEnvelope }
