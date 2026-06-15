// src/store/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MessageItem, UserInfo } from '@/types'

export const useUserStore = defineStore('user', () => {
  // 认证信息
  const token = ref<string>(localStorage.getItem('accessToken') || '')
  const roles = ref<string[]>([])

  // 消息相关
  const unreadList = ref<MessageItem[]>([])

  const unreadCount = computed(() => unreadList.value.length)

  /**
   * 检查是否已登录
   */
  const isLoggedIn = computed(() => !!token.value)

  /**
   * 检查是否具备指定角色
   */
  const hasRole = (role: string): boolean => {
    return roles.value.includes(role)
  }

  /**
   * 检查是否具备任一角色
   */
  const hasAnyRole = (roleList: string[]): boolean => {
    return roleList.some(role => roles.value.includes(role))
  }

  /**
   * 设置认证信息
   */
  const setAuth = (userInfo: UserInfo): void => {
    token.value = userInfo.token
    roles.value = userInfo.roles
    localStorage.setItem('accessToken', userInfo.token)
    localStorage.setItem('userRoles', JSON.stringify(userInfo.roles))
  }

  /**
   * 清除认证信息（登出）
   */
  const clearAuth = (): void => {
    token.value = ''
    roles.value = []
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userRoles')
    localStorage.removeItem('platform_system_messages')
  }

  /**
   * 同步消息状态
   */
  const syncMessageStatus = (): void => {
    const localData = localStorage.getItem('platform_system_messages')
    if (localData) {
      const allMsgs = JSON.parse(localData) as MessageItem[]
      unreadList.value = allMsgs.filter((m) => m.status === '未读')
    } else {
      unreadList.value = []
    }
  }

  /**
   * 获取未读消息数量
   */
  const getUnreadCount = (): number => {
    syncMessageStatus()
    return unreadCount.value
  }

  /**
   * 标记单条消息为已读
   */
  const markAsRead = (messageId: number | string): void => {
    const localData = localStorage.getItem('platform_system_messages')
    if (localData) {
      const allMsgs = JSON.parse(localData) as MessageItem[]
      const msg = allMsgs.find(m => m.id === messageId)
      if (msg) {
        msg.status = '已读'
        localStorage.setItem('platform_system_messages', JSON.stringify(allMsgs))
        syncMessageStatus()
        window.dispatchEvent(new CustomEvent('update-message-bell-badge'))
      }
    }
  }

  /**
   * 标记所有消息为已读
   */
  const markAllAsRead = (): void => {
    const localData = localStorage.getItem('platform_system_messages')
    if (localData) {
      const allMsgs = JSON.parse(localData) as MessageItem[]
      allMsgs.forEach(m => { m.status = '已读' })
      localStorage.setItem('platform_system_messages', JSON.stringify(allMsgs))
      syncMessageStatus()
      window.dispatchEvent(new CustomEvent('update-message-bell-badge'))
    }
  }

  return { 
    token,
    roles,
    unreadList, 
    unreadCount,
    isLoggedIn,
    hasRole,
    hasAnyRole,
    setAuth,
    clearAuth,
    syncMessageStatus,
    getUnreadCount,
    markAsRead,
    markAllAsRead
  }
}, {
  persist: {
    key: 'platform_user_msg',
    storage: localStorage,
    pick: ['unreadList']
  }
})