// request / auth utils 与 mock API 单元测试
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { clearAuth, getRoles, getToken, isAuthenticated, setRoles, setToken } from '@/utils/auth'
import { cancelAllRequests, service } from '@/utils/http'
import { fetchMarketProducts } from '@/api/market'
import { loginApi } from '@/api/auth'

describe('Auth Utils', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('Token Management', () => {
    it('should return empty string when no token exists', () => {
      expect(getToken()).toBe('')
      expect(isAuthenticated()).toBe(false)
    })

    it('should persist and read token', () => {
      setToken('test-token-123')
      expect(getToken()).toBe('test-token-123')
      expect(localStorage.getItem('accessToken')).toBe('test-token-123')
      expect(isAuthenticated()).toBe(true)
    })
  })

  describe('Roles Management', () => {
    it('should return empty array when roles are missing or invalid', () => {
      expect(getRoles()).toEqual([])
      localStorage.setItem('userRoles', 'not-json')
      expect(getRoles()).toEqual([])
    })

    it('should persist roles as JSON', () => {
      setRoles(['admin', 'finance'])
      expect(getRoles()).toEqual(['admin', 'finance'])
      expect(localStorage.getItem('userRoles')).toBe('["admin","finance"]')
    })
  })

  describe('Auth Clear', () => {
    it('should clear token, roles and route flag', () => {
      setToken('test-token')
      setRoles(['admin'])
      sessionStorage.setItem('routes_added', 'true')

      clearAuth()

      expect(localStorage.getItem('accessToken')).toBeNull()
      expect(localStorage.getItem('userRoles')).toBeNull()
      expect(sessionStorage.getItem('routes_added')).toBeNull()
    })
  })
})

describe('Axios Instance', () => {
  it('should use the configured timeout', () => {
    expect(service.defaults.timeout).toBe(30000)
  })

  it('should expose cancelAllRequests without throwing', () => {
    expect(() => cancelAllRequests()).not.toThrow()
    expect(() => cancelAllRequests('切换页面')).not.toThrow()
  })
})

describe('Mock APIs', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should resolve 64 market products with required fields', async () => {
    const promise = fetchMarketProducts()
    await vi.advanceTimersByTimeAsync(600)
    const products = await promise

    expect(products).toHaveLength(64)
    expect(products[0]).toMatchObject({
      id: 1,
      priceUnit: expect.any(String),
      metaSourceType: expect.stringMatching(/自营|市场/)
    })
    expect(products.filter((p) => p.metaSourceType === '自营').length).toBeGreaterThan(0)
    expect(products.filter((p) => p.isOutOfStock).length).toBeGreaterThan(0)
  })

  it('should resolve login token and roles for valid credentials', async () => {
    const promise = loginApi({ username: 'admin', password: '123456' })
    await vi.advanceTimersByTimeAsync(800)
    const result = await promise

    expect(result.token).toBeTruthy()
    expect(result.roles).toEqual(['admin', 'user', 'finance'])
  })

  it('should reject login when credentials are incomplete', async () => {
    const promise = loginApi({ username: '', password: '' })
    const assertion = expect(promise).rejects.toThrow('请输入完整的账号和密码')
    await vi.advanceTimersByTimeAsync(800)
    await assertion
  })
})
