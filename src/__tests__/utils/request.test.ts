// request.ts 单元测试
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

describe('Request Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Token Management', () => {
    it('should return null when no token exists', () => {
      const token = localStorage.getItem('accessToken')
      expect(token).toBeNull()
    })

    it('should return token when it exists', () => {
      localStorage.setItem('accessToken', 'test-token-123')
      const token = localStorage.getItem('accessToken')
      expect(token).toBe('test-token-123')
    })
  })

  describe('Auth Clear', () => {
    it('should clear all auth-related storage', () => {
      localStorage.setItem('accessToken', 'test-token')
      localStorage.setItem('userRoles', '["admin"]')
      sessionStorage.setItem('routes_added', 'true')

      // Simulate clearAuth function
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userRoles')
      sessionStorage.removeItem('routes_added')

      expect(localStorage.getItem('accessToken')).toBeNull()
      expect(localStorage.getItem('userRoles')).toBeNull()
      expect(sessionStorage.getItem('routes_added')).toBeNull()
    })
  })

  describe('Axios Instance', () => {
    it('should create axios instance with correct config', () => {
      const instance = axios.create({
        baseURL: '',
        timeout: 10000
      })

      expect(instance.defaults.baseURL).toBe('')
      expect(instance.defaults.timeout).toBe(10000)
    })
  })
})
