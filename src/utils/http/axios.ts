/**
 * src/utils/http/axios.ts
 *
 * HTTP 实例化 + 拦截器
 *  1. 业务成功时直接拿到后端 data 主体
 *  2. 兼容 code===200 / 1 / 0 / success===true
 *  3. blob 文件下载透传
 *  4. 伪 401 处理
 *  5. 401 互斥锁
 *  6. 同 URL/参数请求自动取消
 *  7. token 注入与统一错误提示
 */
import axios, { type AxiosResponse } from 'axios'
import { message } from 'antd'
import { getToken, clearAuth } from '@/utils/auth'

export interface ApiEnvelope<T = unknown> {
  code: number
  data: T
  message: string
  success?: boolean
}

let isHandlingExpired = false

/** 401 处理：清认证 → 提示 → 跳登录页（带重定向） */
function handleExpired(): void {
  if (isHandlingExpired) return
  isHandlingExpired = true

  message.error('登录状态已过期或无权限，请重新登录')
  clearAuth()

  const current = window.location.hash.replace(/^#/, '') || '/'
  window.location.hash = `#/login?redirect=${encodeURIComponent(current)}`
  window.setTimeout(() => {
    isHandlingExpired = false
  }, 0)
}

// ==================== 请求取消管理 ====================

const pendingRequests = new Map<string, AbortController>()

const generateRequestKey = (config: {
  method?: string
  url?: string
  params?: unknown
  data?: unknown
}): string => {
  const method = (config.method || 'get').toLowerCase()
  const url = config.url || ''
  return `${method}_${url}_${JSON.stringify(config.params || null)}_${JSON.stringify(config.data || null)}`
}

/** 取消所有待处理的请求 */
export const cancelAllRequests = (reason = '页面切换'): void => {
  pendingRequests.forEach((controller) => {
    try {
      controller.abort(reason)
    } catch {
      /* noop */
    }
  })
  pendingRequests.clear()
}

// ==================== 创建实例 ====================

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000
})

// ==================== 请求拦截器 ====================

service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    const requestKey = generateRequestKey({
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data
    })
    const existing = pendingRequests.get(requestKey)
    if (existing) {
      existing.abort('重复请求，已取消上一次')
      pendingRequests.delete(requestKey)
    }

    const controller = new AbortController()
    config.signal = controller.signal
    pendingRequests.set(requestKey, controller)

    return config
  },
  (error) => Promise.reject(error)
)

// ==================== 响应拦截器 ====================

service.interceptors.response.use(
  (response: AxiosResponse<ApiEnvelope | Blob>): AxiosResponse<ApiEnvelope | Blob> | Promise<never> => {
    const key = generateRequestKey({
      method: response.config.method,
      url: response.config.url,
      params: response.config.params,
      data: response.config.data
    })
    pendingRequests.delete(key)

    if (response.config.responseType === 'blob') {
      return response
    }

    const body = response.data as ApiEnvelope | undefined

    if (!body || typeof body !== 'object') {
      return response
    }

    const isSuccess =
      body.code === 200 ||
      body.code === 1 ||
      body.code === 0 ||
      body.success === true
    if (isSuccess) {
      response.data = body.data as unknown as ApiEnvelope
      return response
    }

    if (body.code === 401) {
      handleExpired()
      return Promise.reject(new Error(body.message || '登录已过期'))
    }

    message.error(body.message || '系统繁忙，请稍后再试')
    return Promise.reject(new Error(body.message || 'Error'))
  },
  handleAxiosError
)

// ==================== 网络层错误处理 ====================

function handleAxiosError(error: unknown): Promise<never> {
  if (axios.isAxiosError(error) && error.config) {
    const key = generateRequestKey({
      method: error.config.method,
      url: error.config.url,
      params: error.config.params,
      data: error.config.data
    })
    pendingRequests.delete(key)
  }

  if (axios.isCancel(error) || (error as { code?: string })?.code === 'ERR_CANCELED') {
    return Promise.reject(error)
  }

  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      handleExpired()
      return Promise.reject(error)
    }
    if (error.response?.status === 403) {
      message.error('您没有权限访问该资源')
      return Promise.reject(error)
    }
    if (error.response?.status === 404) {
      message.error('请求的资源接口不存在')
      return Promise.reject(error)
    }
    if (error.response && error.response.status >= 500) {
      message.error('服务器异常，请稍后再试')
      return Promise.reject(error)
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message.error('请求超时，请稍后重试')
      return Promise.reject(error)
    }
    if (error.message === 'Network Error') {
      message.error('网络连接失败，请检查您的网络')
      return Promise.reject(error)
    }
    message.error(error.message || '请求失败')
    return Promise.reject(error)
  }

  return Promise.reject(error)
}

export default service
