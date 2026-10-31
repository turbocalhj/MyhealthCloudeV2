// 路由权限过滤工具函数测试
import { describe, it, expect } from 'vitest'
import { hasPermission } from '@/router/guard'

interface MockRoute {
  path: string
  roles?: string[]
  children?: MockRoute[]
}

const filterRoutes = (routes: MockRoute[], roles: string[]): MockRoute[] => {
  const accessible: MockRoute[] = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp.roles)) {
      if (tmp.children) {
        tmp.children = filterRoutes(tmp.children, roles)
      }
      accessible.push(tmp)
    }
  })
  return accessible
}

describe('Route Permission Filter', () => {
  const mockRoutes: MockRoute[] = [
    {
      path: '/console',
      roles: ['admin', 'user'],
      children: [
        { path: 'dashboard', roles: ['admin', 'user'] },
        { path: 'settings', roles: ['admin'] }
      ]
    },
    {
      path: '/finance',
      roles: ['admin', 'finance'],
      children: [
        { path: 'orders', roles: ['admin', 'finance'] },
        { path: 'billing', roles: ['admin', 'finance'] }
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

  describe('filterRoutes', () => {
    it('should filter routes for admin user', () => {
      const result = filterRoutes(mockRoutes, ['admin'])
      expect(result).toHaveLength(2)
      expect(result[0].children).toHaveLength(2)
      expect(result[1].children).toHaveLength(2)
    })

    it('should filter routes for regular user', () => {
      const result = filterRoutes(mockRoutes, ['user'])
      expect(result).toHaveLength(1)
      expect(result[0].path).toBe('/console')
      expect(result[0].children).toHaveLength(1)
      expect(result[0].children?.[0].path).toBe('dashboard')
    })

    it('should filter routes for finance user', () => {
      const result = filterRoutes(mockRoutes, ['finance'])
      expect(result).toHaveLength(1)
      expect(result[0].path).toBe('/finance')
    })

    it('should return empty array when user has no matching roles', () => {
      expect(filterRoutes(mockRoutes, ['guest'])).toHaveLength(0)
    })
  })
})
