// user store 单元测试
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '@/store/modules/user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('Initial State', () => {
    it('should have empty token initially', () => {
      const store = useUserStore()
      expect(store.token).toBe('')
    })

    it('should have empty roles initially', () => {
      const store = useUserStore()
      expect(store.roles).toEqual([])
    })

    it('should not be logged in initially', () => {
      const store = useUserStore()
      expect(store.isLoggedIn).toBe(false)
    })

    it('should have empty unread list initially', () => {
      const store = useUserStore()
      expect(store.unreadList).toEqual([])
    })

    it('should have zero unread count initially', () => {
      const store = useUserStore()
      expect(store.unreadCount).toBe(0)
    })
  })

  describe('Authentication', () => {
    it('should set auth info correctly', () => {
      const store = useUserStore()
      store.setAuth({
        token: 'test-token-123',
        roles: ['admin', 'user']
      })

      expect(store.token).toBe('test-token-123')
      expect(store.roles).toEqual(['admin', 'user'])
      expect(store.isLoggedIn).toBe(true)
      expect(localStorage.getItem('accessToken')).toBe('test-token-123')
    })

    it('should clear auth info correctly', () => {
      const store = useUserStore()
      store.setAuth({
        token: 'test-token',
        roles: ['admin']
      })
      store.clearAuth()

      expect(store.token).toBe('')
      expect(store.roles).toEqual([])
      expect(store.isLoggedIn).toBe(false)
      expect(localStorage.getItem('accessToken')).toBeNull()
      expect(localStorage.getItem('userRoles')).toBeNull()
    })
  })

  describe('Role Checking', () => {
    it('should check if user has specific role', () => {
      const store = useUserStore()
      store.setAuth({
        token: 'test-token',
        roles: ['admin', 'user']
      })

      expect(store.hasRole('admin')).toBe(true)
      expect(store.hasRole('finance')).toBe(false)
    })

    it('should check if user has any of the specified roles', () => {
      const store = useUserStore()
      store.setAuth({
        token: 'test-token',
        roles: ['user']
      })

      expect(store.hasAnyRole(['admin', 'user'])).toBe(true)
      expect(store.hasAnyRole(['admin', 'finance'])).toBe(false)
    })
  })

  describe('Message Sync', () => {
    it('should sync unread messages from localStorage', () => {
      const store = useUserStore()
      const messages = [
        { id: 1, title: 'Msg 1', time: '2024-01-01', status: '未读' as const },
        { id: 2, title: 'Msg 2', time: '2024-01-02', status: '已读' as const },
        { id: 3, title: 'Msg 3', time: '2024-01-03', status: '未读' as const }
      ]
      localStorage.setItem('platform_system_messages', JSON.stringify(messages))

      store.syncMessageStatus()

      expect(store.unreadList).toHaveLength(2)
      expect(store.unreadCount).toBe(2)
    })

    it('should handle empty messages', () => {
      const store = useUserStore()
      store.syncMessageStatus()

      expect(store.unreadList).toEqual([])
    })
  })
})
