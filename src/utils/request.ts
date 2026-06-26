/**
 * src/utils/request.ts
 *
 * 向后兼容入口（升级版）
 *
 * 历史背景：
 *   旧版 utils/request.ts 是一个直接创建 axios 实例 + 拦截器 + 工具方法的单体文件。
 *   现已按"实例化 → 拦截器 → 统一方法封装"三段式拆分到 utils/http/ 下：
 *     - utils/http/axios.ts  : 实例 + 拦截器（拦截器已解包，业务层拿到 data 主体）
 *     - utils/http/index.ts  : 双泛型统一方法封装
 *
 * 升级要点（2026-06）：
 *   - 拦截器已"业务成功时直接 return data"
 *   - 旧 request.ts 直接 return raw（拦截器已经解包 code==200 的 data）
 *   - 新版 http 默认也 return T（已解包），不再有 { data: T } 包装
 *   - 旧调用 `request.post('/x', data)` 仍直接拿到 data，**不需要改业务 API 文件**
 */

import httpOriginal, { cancelAllRequests as _cancelAllRequests, service } from './http'
import type { ApiEnvelope } from './http'

/**
 * 重新组装一个"老式" request 兼容层：让旧调用方的 .post(url, data) 直接拿到 data
 * 由于新版 http 已经解包，这里就是一层轻量转发
 */
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

/** 默认导出：旧 request 兼容对象（直接返回 data） */
export default legacyRequest

/** 重新导出 cancelAllRequests，便于旧代码 cancelAllRequests() 调用 */
export const cancelAllRequests = _cancelAllRequests

/** 重新导出底层 axios 实例，便于特殊场景使用 */
export { service }

/** 重新导出 ApiEnvelope 类型 */
export type { ApiEnvelope }
