// user store 单元测试（Zustand）
import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from '@/store/user'
import type { MessageItem } from '@/types'

const resetUser = () => {
  useUserStore.setState({
    token: '',
    roles: [],
    unreadList: [],
    unreadCount: 0,
    isLoggedIn: false
  })
}

describe('User Store', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    resetUser()
  })

  describe('Initial State', () => {
    it('should have empty auth state', () => {
      const state = useUserStore.getState()
      expect(state.token).toBe('')
      expect(state.roles).toEqual([])
      expect(state.isLoggedIn).toBe(false)
    })

    it('should have empty unread messages', () => {
      const state = useUserStore.getState()
      expect(state.unreadList).toEqual([])
      expect(state.unreadCount).toBe(0)
    })
  })

  describe('Authentication', () => {
    it('should set auth info and persist token/roles', () => {
      useUserStore.getState().setAuth({ token: 'test-token-123', roles: ['admin', 'user'] })
      const state = useUserStore.getState()
      expect(state.token).toBe('test-token-123')
      expect(state.roles).toEqual(['admin', 'user'])
      expect(state.isLoggedIn).toBe(true)
      expect(localStorage.getItem('accessToken')).toBe('test-token-123')
      expect(localStorage.getItem('userRoles')).toBe('["admin","user"]')
    })

    it('should clear auth info and message cache', () => {
      const store = useUserStore.getState()
      store.setAuth({ token: 'test-token', roles: ['admin'] })
      localStorage.setItem('platform_system_messages', '[]')
      store.clearAuth()

      const state = useUserStore.getState()
      expect(state.token).toBe('')
      expect(state.roles).toEqual([])
      expect(state.isLoggedIn).toBe(false)
      expect(state.unreadList).toEqual([])
      expect(localStorage.getItem('accessToken')).toBeNull()
      expect(localStorage.getItem('userRoles')).toBeNull()
      expect(localStorage.getItem('platform_system_messages')).toBeNull()
    })
  })

  describe('Role Checking', () => {
    beforeEach(() => {
      useUserStore.getState().setAuth({ token: 'test-token', roles: ['admin', 'user'] })
    })

    it('should check a single role', () => {
      expect(useUserStore.getState().hasRole('admin')).toBe(true)
      expect(useUserStore.getState().hasRole('finance')).toBe(false)
    })

    it('should check any of the given roles', () => {
      expect(useUserStore.getState().hasAnyRole(['admin', 'user'])).toBe(true)
      expect(useUserStore.getState().hasAnyRole(['admin', 'finance'])).toBe(true)
      expect(useUserStore.getState().hasAnyRole(['finance', 'guest'])).toBe(false)
    })
  })

  describe('Message Sync', () => {
    const messages: MessageItem[] = [
      { id: 1, title: 'Msg 1', time: '2024-01-01', status: '未读' },
      { id: 2, title: 'Msg 2', time: '2024-01-02', status: '已读' },
      { id: 3, title: 'Msg 3', time: '2024-01-03', status: '未读' }
    ]

    it('should sync unread messages from platform_system_messages', () => {
      localStorage.setItem('platform_system_messages', JSON.stringify(messages))
      useUserStore.getState().syncMessageStatus()

      const state = useUserStore.getState()
      expect(state.unreadList).toHaveLength(2)
      expect(state.unreadCount).toBe(2)
    })

    it('should handle empty message list', () => {
      useUserStore.getState().syncMessageStatus()
      expect(useUserStore.getState().unreadList).toEqual([])
      expect(useUserStore.getState().unreadCount).toBe(0)
    })

    it('should mark one message as read and refresh unread count', () => {
      localStorage.setItem('platform_system_messages', JSON.stringify(messages))
      useUserStore.getState().markAsRead(1)

      const state = useUserStore.getState()
      expect(state.unreadCount).toBe(1)
      expect(state.unreadList.map((m) => m.id)).toEqual([3])
    })

    it('should mark all messages as read', () => {
      localStorage.setItem('platform_system_messages', JSON.stringify(messages))
      useUserStore.getState().markAllAsRead()

      const state = useUserStore.getState()
      expect(state.unreadCount).toBe(0)
      expect(state.unreadList).toEqual([])
    })
  })
})
