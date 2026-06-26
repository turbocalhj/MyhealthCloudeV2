/**
 * src/utils/http/axios.ts
 *
 * HTTP 实例化 + 拦截器
 *
 * 设计亮点（参考门户项目 + 上一版沉淀）：
 *  1. 拦截器直接 return data：业务层 `await http.post()` 拿到的就是后端的 data 主体
 *  2. 统一 200 风格：HTTP 200 + body.code 判定业务结果
 *  3. 兼容多种后端成功约定：code===200 / code===1 / code===0 / success===true
 *  4. blob 文件下载透传：避免对二进制流做 JSON 解包
 *  5. 伪 401 处理：部分网关会 HTTP 200 + body.code 401，同样走登录过期流程
 *  6. 模块级 401 互斥锁：防并发 401 触发多次跳转，.finally() 精准释放
 *  7. 错误处理独立成函数：handleAxiosError 关注点分离
 *  8. 请求自动取消：同 URL/参数未完成请求会被最新一次自动取消
 *  9. axios.isCancel 静默：AbortController 取消不弹错误
 * 10. 业务层零感知：token 注入、统一错误提示全部在拦截器中
 */

import axios, { type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { getToken, clearAuth } from '@/utils/auth'

// ==================== 类型定义 ====================

/** 后端统一响应结构（约定 code=200 表示业务成功） */
export interface ApiEnvelope<T = unknown> {
  code: number
  data: T
  message: string
  /** 兼容老接口 success 字段 */
  success?: boolean
}

// ==================== 401 互斥锁 ====================

/** 是否已处于"登录过期"处理中，避免并发 401 触发多次跳转 */
let isHandlingExpired = false

/**
 * 401 处理（路由跳转后 finally 精准释放锁）
 * 流程：清认证 → 弹错误 → 跳登录页（带重定向）
 */
function handleExpired(): void {
  if (isHandlingExpired) return
  isHandlingExpired = true

  ElMessage.error('登录状态已过期或无权限，请重新登录')
  clearAuth()

  const redirect = router.currentRoute.value.fullPath
  router
    .push(`/login?redirect=${encodeURIComponent(redirect)}`)
    .finally(() => {
      isHandlingExpired = false
    })
}

// ==================== 请求取消管理 ====================

const pendingRequests = new Map<string, AbortController>()

/** 生成请求唯一标识 */
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
  timeout: 30000 // 30 秒
})

// ==================== 请求拦截器 ====================

service.interceptors.request.use(
  (config) => {
    // 1. 注入 token（不带 Bearer 前缀，与现有项目保持一致）
    const token = getToken()
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // 2. 同请求自动取消（最新一次覆盖前一次）
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

    // 3. 接入 AbortController
    const controller = new AbortController()
    config.signal = controller.signal
    pendingRequests.set(requestKey, controller)

    return config
  },
  (error) => Promise.reject(error)
)

// ==================== 响应拦截器（成功回调：统一 200 风格 + 直接 return data）====================
// 注意：axios 要求拦截器返回 AxiosResponse，
//       这里通过"先放行 raw response、再由 service.request<T> 的类型转换拿走 data"
//       实现"业务层拿到 data"的效果。
//       具体见 http/index.ts 的 request() 包装。

service.interceptors.response.use(
  (response: AxiosResponse<ApiEnvelope | Blob>): AxiosResponse<ApiEnvelope | Blob> | Promise<never> => {
    // 完成后从待处理列表中移除
    const key = generateRequestKey({
      method: response.config.method,
      url: response.config.url,
      params: response.config.params,
      data: response.config.data
    })
    pendingRequests.delete(key)

    // 1. blob 文件下载：直接透传（业务层会通过 responseType='blob' 自己取 response.data）
    if (response.config.responseType === 'blob') {
      return response
    }

    const body = response.data as ApiEnvelope | undefined

    // 2. 兜底：body 不存在则直接放行 raw response
    if (!body || typeof body !== 'object') {
      return response
    }

    // 3. 业务成功：把 body.data 塞回 response.data，让 service.request<T> 业务层能直接拿到 T
    const isSuccess =
      body.code === 200 ||
      body.code === 1 ||
      body.code === 0 ||
      body.success === true
    if (isSuccess) {
      // 用"覆盖 data"的方式实现"业务层直接拿 data"
      response.data = body.data as unknown as ApiEnvelope
      return response
    }

    // 4. 伪 401：HTTP 200 + body.code 401
    if (body.code === 401) {
      handleExpired()
      return Promise.reject(new Error(body.message || '登录已过期'))
    }

    // 5. 业务失败：弹错误 + reject
    ElMessage.error(body.message || '系统繁忙，请稍后再试')
    return Promise.reject(new Error(body.message || 'Error'))
  },
  handleAxiosError
)

// ==================== 网络层错误处理（独立函数）====================

/**
 * 处理 axios 网络层错误
 * 业务层错误（HTTP 200 + code != 200）已在成功回调中处理
 * 此函数只处理：超时、断网、请求取消、HTTP 4xx/5xx 等
 */
function handleAxiosError(error: unknown): Promise<never> {
  // 完成后从待处理列表中移除
  if (axios.isAxiosError(error) && error.config) {
    const key = generateRequestKey({
      method: error.config.method,
      url: error.config.url,
      params: error.config.params,
      data: error.config.data
    })
    pendingRequests.delete(key)
  }

  // 1. 请求被取消（AbortController / SSE abort）：静默
  if (axios.isCancel(error) || (error as { code?: string })?.code === 'ERR_CANCELED') {
    return Promise.reject(error)
  }

  // 2. axios 错误分类处理
  if (axios.isAxiosError(error)) {
    // HTTP 401：清认证 + 跳登录页
    if (error.response?.status === 401) {
      handleExpired()
      return Promise.reject(error)
    }
    // HTTP 403：无权限
    if (error.response?.status === 403) {
      ElMessage.error('您没有权限访问该资源')
      return Promise.reject(error)
    }
    // HTTP 404：资源不存在
    if (error.response?.status === 404) {
      ElMessage.error('请求的资源接口不存在')
      return Promise.reject(error)
    }
    // HTTP 5xx：服务端错误
    if (error.response && error.response.status >= 500) {
      ElMessage.error('服务器异常，请稍后再试')
      return Promise.reject(error)
    }
    // 超时
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      ElMessage.error('请求超时，请稍后重试')
      return Promise.reject(error)
    }
    // 网络断开
    if (error.message === 'Network Error') {
      ElMessage.error('网络连接失败，请检查您的网络')
      return Promise.reject(error)
    }
    // 兜底
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }

  // 3. 非 axios 错误：直接 reject
  return Promise.reject(error)
}

export default service
