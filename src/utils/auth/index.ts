/**
 * src/utils/auth/index.ts
 * 认证信息工具（token / roles / clear），纯 localStorage 工具。
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

/** 清除认证信息 */
export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLES_KEY)
  sessionStorage.removeItem('routes_added')
}

/** 是否已登录 */
export const isAuthenticated = (): boolean => {
  return !!getToken()
}
