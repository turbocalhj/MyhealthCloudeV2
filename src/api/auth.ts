// src/api/auth.ts
import type { LoginRequest, LoginResponse } from '@/types'

/**
 * 当前前端工程化演进阶段，导出一个包裹了 Promise 的 Mock 函数，模拟网络请求的异步行为。
 * 真实业务中替换为：
 *   return http.post<LoginResponse, LoginRequest>('/auth/login', { data })
 */
export function loginApi(data: LoginRequest): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.username && data.password) {
        resolve({
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken_base64_payload.signature_xxx',
          roles: ['admin', 'user', 'finance']
        })
      } else {
        reject(new Error('请输入完整的账号和密码'))
      }
    }, 800)
  })
}
