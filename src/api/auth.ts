// src/api/auth.ts
import request from '@/utils/request'

/**
 * 真实业务中应使用标准 request，取消注释以下代码：
 * export function login(data: any) {
 * return request.post('/auth/login', data)
 * }
 */

//  当前前端工程化演进阶段，我们导出一个包裹了 Promise 的 Mock 函数，完美模拟网络请求的异步行为
export function loginApi(data: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟简单的校验逻辑
      if (data.username && data.password) {
        resolve({
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken_base64_payload.signature_xxx',
          roles: ['admin', 'user', 'finance']
        })
      } else {
        reject(new Error('请输入完整的账号和密码'))
      }
    }, 800) // 模拟 800ms 的网络耗时
  })
}