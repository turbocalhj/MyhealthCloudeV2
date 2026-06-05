// src/utils/request.ts
import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 1. 创建 Axios 实例
const service: AxiosInstance = axios.create({
  // 根据环境变量配置基础路径，开发环境下由于 vite 配置了代理，可以直接使用 /api 或空
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000 // 请求超时时间：10秒
})

// 2. 请求拦截器 (统一注入 Token)
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    // 如果存在 token，则统一在请求头携带
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 3. 响应拦截器 (统一处理错误码与数据结构)
service.interceptors.response.use(
  (response: AxiosResponse) => {
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
    // 处理 HTTP 状态码层面的错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('登录状态已过期或无权限，请重新登录')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userRoles')
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

export default service