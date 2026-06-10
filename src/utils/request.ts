// src/utils/request.ts
import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, CancelTokenSource } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 请求取消令牌管理器
const pendingRequests = new Map<string, CancelTokenSource>()

// 生成请求唯一标识
const generateRequestKey = (config: InternalAxiosRequestConfig): string => {
  const { method, url, params, data } = config
  return `${method}_${url}_${JSON.stringify(params)}_${JSON.stringify(data)}`
}

// 获取 token 的统一方法（避免循环依赖，直接读取 localStorage）
const getToken = (): string | null => {
  return localStorage.getItem('accessToken')
}

// 清除认证信息的统一方法
const clearAuth = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('userRoles')
  sessionStorage.removeItem('routes_added')
}

// 1. 创建 Axios 实例
const service: AxiosInstance = axios.create({
  // 根据环境变量配置基础路径，开发环境下由于 vite 配置了代理，可以直接使用 /api 或空
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000 // 请求超时时间：10秒
})

// 2. 请求拦截器 (统一注入 Token + 请求取消)
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // 请求取消逻辑：相同请求只保留最新的一个
    const requestKey = generateRequestKey(config)
    const existingRequest = pendingRequests.get(requestKey)
    if (existingRequest) {
      existingRequest.cancel('请求已取消：重复请求')
      pendingRequests.delete(requestKey)
    }

    const source = axios.CancelToken.source()
    config.cancelToken = source.token
    pendingRequests.set(requestKey, source)

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 3. 响应拦截器 (统一处理错误码与数据结构)
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 请求完成后从待处理列表中移除
    const requestKey = generateRequestKey(response.config as InternalAxiosRequestConfig)
    pendingRequests.delete(requestKey)

    // 假设后端统一包装了 { code, data, message } 结构
    const { code, data, message } = response.data

    if (code === 200 || code === 0) {
      return data
    } else {
      ElMessage.error(message || '系统繁忙，请稍后再试')
      return Promise.reject(new Error(message || 'Error'))
    }
  },
  (error) => {
    // 请求完成后从待处理列表中移除
    if (error.config) {
      const requestKey = generateRequestKey(error.config as InternalAxiosRequestConfig)
      pendingRequests.delete(requestKey)
    }

    // 处理请求取消
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    // 处理 HTTP 状态码层面的错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('登录状态已过期或无权限，请重新登录')
          clearAuth()
          router.push('/login')
          break
        case 403:
          ElMessage.error('您没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源接口不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(error.message || '网络请求错误')
      }
    } else {
      ElMessage.error('网络连接异常，请检查您的网络')
    }
    return Promise.reject(error)
  }
)

/**
 * 取消所有待处理的请求
 */
export const cancelAllRequests = (): void => {
  pendingRequests.forEach((source) => {
    source.cancel('请求已取消：页面切换')
  })
  pendingRequests.clear()
}

export default service