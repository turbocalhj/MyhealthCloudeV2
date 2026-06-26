/**
 * src/utils/auth/index.ts
 * 认证信息工具（token / roles / clear）
 * 设计：与 storage 解耦，纯 localStorage 工具
 *       业务层与拦截器都从这里读取单一来源，避免直接散落 localStorage 调用
 */

const TOKEN_KEY = 'accessToken'
const ROLES_KEY = 'userRoles'

/** 获取 token */
export const getToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || ''
}

/** 设置 token */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

/** 获取角色列表 */
export const getRoles = (): string[] => {
  const raw = localStorage.getItem(ROLES_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** 设置角色列表 */
export const setRoles = (roles: string[]): void => {
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles))
}

/**
 * 清除认证信息
 * 注意：保留 isPlatformLogged 标志（控制台登录态由 FrontHeader 自身管理）
 */
export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLES_KEY)
  // 清理与登录态相关的路由持久化标记，避免下次登录时残留
  sessionStorage.removeItem('routes_added')
}

/** 是否已登录 */
export const isAuthenticated = (): boolean => {
  return !!getToken()
}
