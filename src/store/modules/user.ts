// src/store/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MessageItem } from '@/types' // 🚀 引入严格类型

export const useUserStore = defineStore('user', () => {
  // 🚀 替换 any[]
  const unreadList = ref<MessageItem[]>([])

  const unreadCount = computed(() => unreadList.value.length)

  const syncMessageStatus = () => {
    const localData = localStorage.getItem('platform_system_messages')
    if (localData) {
      const allMsgs = JSON.parse(localData) as MessageItem[]
      unreadList.value = allMsgs.filter((m) => m.status === '未读')
    } else {
      unreadList.value = []
    }
  }

  return { 
    unreadList, 
    unreadCount, 
    syncMessageStatus 
  }
}, {
  persist: {
    key: 'platform_user_msg',
    storage: localStorage,
    pick: ['unreadList']
  }
})