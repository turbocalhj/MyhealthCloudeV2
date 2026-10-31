/**
 * src/utils/http/index.ts
 * 统一方法封装（拦截器已解包，业务层直接拿到 data）
 */
import service from './axios'

export interface RequestConfig<D = unknown> {
  params?: D
  data?: D
  headers?: Record<string, string>
  signal?: AbortSignal
  responseType?: 'json' | 'blob' | 'arraybuffer' | 'text'
}

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

  const data = (await service.request(payload as Parameters<typeof service.request>[0])) as unknown as T
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

export { default as service } from './axios'
export { cancelAllRequests } from './axios'
export type { ApiEnvelope } from './axios'
