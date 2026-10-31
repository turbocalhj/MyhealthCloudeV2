// src/store/user.ts
// 用户认证与消息状态（Zustand），持久化键与 Vue 版保持一致
import { create } from 'zustand'
import type { MessageItem, UserInfo } from '@/types'

const TOKEN_KEY = 'accessToken'
const ROLES_KEY = 'userRoles'
const MESSAGES_KEY = 'platform_system_messages'
const USER_MSG_KEY = 'platform_user_msg'

const readRoles = (): string[] => {
  const raw = localStorage.getItem(ROLES_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const readPersistedUnread = (): MessageItem[] => {
  const raw = localStorage.getItem(USER_MSG_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as { unreadList?: MessageItem[] } | MessageItem[]
    if (Array.isArray(parsed)) return parsed
    return Array.isArray(parsed.unreadList) ? parsed.unreadList : []
  } catch {
    return []
  }
}

const readAllMessages = (): MessageItem[] => {
  const raw = localStorage.getItem(MESSAGES_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const initialToken = localStorage.getItem(TOKEN_KEY) || ''
const initialUnread = readPersistedUnread()

export interface UserState {
  token: string
  roles: string[]
  unreadList: MessageItem[]
  unreadCount: number
  isLoggedIn: boolean
  hasRole: (role: string) => boolean
  hasAnyRole: (roleList: string[]) => boolean
  setAuth: (userInfo: UserInfo) => void
  clearAuth: () => void
  syncMessageStatus: () => void
  getUnreadCount: () => number
  markAsRead: (messageId: number | string) => void
  markAllAsRead: () => void
}

export const useUserStore = create<UserState>()((set, get) => ({
  token: initialToken,
  roles: readRoles(),
  unreadList: initialUnread,
  unreadCount: initialUnread.length,
  isLoggedIn: !!initialToken,

  hasRole: (role) => get().roles.includes(role),

  hasAnyRole: (roleList) => roleList.some((role) => get().roles.includes(role)),

  setAuth: (userInfo) => {
    localStorage.setItem(TOKEN_KEY, userInfo.token)
    localStorage.setItem(ROLES_KEY, JSON.stringify(userInfo.roles))
    set({ token: userInfo.token, roles: userInfo.roles, isLoggedIn: true })
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLES_KEY)
    localStorage.removeItem(MESSAGES_KEY)
    set({ token: '', roles: [], unreadList: [], unreadCount: 0, isLoggedIn: false })
  },

  syncMessageStatus: () => {
    const unread = readAllMessages().filter((m) => m.status === '未读')
    set({ unreadList: unread, unreadCount: unread.length })
  },

  getUnreadCount: () => {
    get().syncMessageStatus()
    return get().unreadCount
  },

  markAsRead: (messageId) => {
    const allMessages = readAllMessages()
    const target = allMessages.find((m) => m.id === messageId)
    if (!target) return
    target.status = '已读'
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages))
    get().syncMessageStatus()
    window.dispatchEvent(new CustomEvent('update-message-bell-badge'))
  },

  markAllAsRead: () => {
    const allMessages = readAllMessages()
    allMessages.forEach((m) => {
      m.status = '已读'
    })
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages))
    get().syncMessageStatus()
    window.dispatchEvent(new CustomEvent('update-message-bell-badge'))
  }
}))
