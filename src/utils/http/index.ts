/**
 * src/utils/http/index.ts
 *
 * 统一方法封装
 *
 * 语义（升级后）：
 *   拦截器已经"业务成功时直接 return data"，所以业务层：
 *     const data = await http.get<MyType, MyParam>('/api/x', { params: p })
 *   拿到的 data 就是后端的真实业务数据（不再有 { data: T } 包装）
 *
 * 双泛型 <T, D>：
 *   T = 响应数据类型（业务层希望拿到的）
 *   D = 请求参数类型
 *
 * 业务层调用范式：
 *   ```ts
 *   export function loginApi(data: LoginRequest) {
 *     return http.post<LoginResponse, LoginRequest>('/auth/login', { data })
 *   }
 *   // 调用：const res = await loginApi({ username, password }) // res 即 LoginResponse
 *   ```
 */

import service from './axios'

/** 请求方法 + URL + 参数的可选配置 */
export interface RequestConfig<D = unknown> {
  /** URL 参数，GET 走此处 */
  params?: D
  /** 请求体数据，POST/PUT/PATCH 走此处（也可显式指定） */
  data?: D
  /** 自定义 header */
  headers?: Record<string, string>
  /** 取消令牌 / AbortSignal */
  signal?: AbortSignal
  /** 响应类型（blob 用于文件下载） */
  responseType?: 'json' | 'blob' | 'arraybuffer' | 'text'
}

/**
 * 通用请求方法
 * @param method HTTP 方法
 * @param url 路径（自动拼接 baseURL）
 * @param config 配置 + 参数
 * @returns Promise<T>：拦截器已解包，业务层直接拿到后端的真实 data
 */
async function request<T = unknown, D = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  config: RequestConfig<D> = {}
): Promise<T> {
  const isGet = method === 'GET' || method === 'DELETE'

  const payload: Record<string, unknown> = {
    url,
    method,
    headers: config.headers,
    signal: config.signal,
    responseType: config.responseType
  }
  if (isGet) {
    payload.params = config.params ?? config.data
  } else {
    payload.data = config.data ?? config.params
  }

  // 拦截器已解包：service.request<T> 的 T 就是后端的 data 类型
  const data = (await service.request(payload as Parameters<typeof service.request>[0])) as unknown as T

  // 兜底：如果后端直接返回的不是 ApiEnvelope 而是纯数据，data 就是它本身
  return data
}

const http = {
  get<T = unknown, D = unknown>(url: string, config?: RequestConfig<D>) {
    return request<T, D>('GET', url, config)
  },
  post<T = unknown, D = unknown>(url: string, config?: RequestConfig<D>) {
    return request<T, D>('POST', url, config)
  },
  put<T = unknown, D = unknown>(url: string, config?: RequestConfig<D>) {
    return request<T, D>('PUT', url, config)
  },
  patch<T = unknown, D = unknown>(url: string, config?: RequestConfig<D>) {
    return request<T, D>('PATCH', url, config)
  },
  delete<T = unknown, D = unknown>(url: string, config?: RequestConfig<D>) {
    return request<T, D>('DELETE', url, config)
  }
}

export default http

// 同时导出 service 实例，便于特殊场景（如文件上传第三方接口、第三方 SDK 拦截）直接使用
export { default as service } from './axios'
export { cancelAllRequests } from './axios'
export type { ApiEnvelope } from './axios'
