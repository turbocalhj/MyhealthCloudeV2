// 路由权限过滤工具函数测试
import { describe, it, expect } from 'vitest'

// 提取路由守卫中的权限逻辑进行测试
function hasPermission(roles: string[], routeRoles?: string[]): boolean {
  if (!routeRoles || routeRoles.length === 0) return true
  return roles.some(role => routeRoles.includes(role))
}

function filterAsyncRoutes(routes: any[], roles: string[]): any[] {
  const accessibleRoutes: any[] = []
  
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp.meta?.roles)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      accessibleRoutes.push(tmp)
    }
  })
  
  return accessibleRoutes
}

describe('Route Permission Filter', () => {
  const mockRoutes = [
    {
      path: '/console',
      meta: { roles: ['admin', 'user'] },
      children: [
        { path: 'dashboard', meta: { roles: ['admin', 'user'] } },
        { path: 'settings', meta: { roles: ['admin'] } }
      ]
    },
    {
      path: '/finance',
      meta: { roles: ['admin', 'finance'] },
      children: [
        { path: 'orders', meta: { roles: ['admin', 'finance'] } },
        { path: 'billing', meta: { roles: ['admin', 'finance'] } }
      ]
    }
  ]

  describe('hasPermission', () => {
    it('should allow access when route has no role restriction', () => {
      expect(hasPermission(['user'], undefined)).toBe(true)
      expect(hasPermission(['user'], [])).toBe(true)
    })

    it('should allow access when user has required role', () => {
      expect(hasPermission(['admin', 'user'], ['admin'])).toBe(true)
      expect(hasPermission(['user'], ['user'])).toBe(true)
    })

    it('should deny access when user lacks required role', () => {
      expect(hasPermission(['user'], ['admin'])).toBe(false)
      expect(hasPermission(['user'], ['finance'])).toBe(false)
    })

    it('should allow access when user has any of the required roles', () => {
      expect(hasPermission(['user', 'finance'], ['admin', 'user'])).toBe(true)
    })
  })

  describe('filterAsyncRoutes', () => {
    it('should filter routes for admin user', () => {
      const result = filterAsyncRoutes(mockRoutes, ['admin'])
      expect(result).toHaveLength(2)
      expect(result[0].children).toHaveLength(2)
      expect(result[1].children).toHaveLength(2)
    })

    it('should filter routes for regular user', () => {
      const result = filterAsyncRoutes(mockRoutes, ['user'])
      expect(result).toHaveLength(1)
      expect(result[0].path).toBe('/console')
      expect(result[0].children).toHaveLength(1)
      expect(result[0].children[0].path).toBe('dashboard')
    })

    it('should filter routes for finance user', () => {
      const result = filterAsyncRoutes(mockRoutes, ['finance'])
      expect(result).toHaveLength(1)
      expect(result[0].path).toBe('/finance')
    })

    it('should return empty array when user has no matching roles', () => {
      const result = filterAsyncRoutes(mockRoutes, ['guest'])
      expect(result).toHaveLength(0)
    })
  })
})
