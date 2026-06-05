// 购物车状态管理模块
// 功能：管理购物车中的算力资源列表，支持添加、删除、清空、持久化存储
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { CartItem } from '@/types'

export const useCartStore = defineStore('cart', () => {
  // 替换 any[]
  const cartItems = ref<CartItem[]>([])
  const cartDrawerVisible = ref(false)

  // 购物车内商品总数
  const totalCount = computed(() => cartItems.value.length)
  // 购物车总价计算
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price || 0), 0)
  })

  const openCartDrawer = () => {
    cartDrawerVisible.value = true
  }
  const closeCartDrawer = () => {
    cartDrawerVisible.value = false
  }

  // 添加商品到购物车
  const addCartItem = (product: CartItem) => {
    const isExist = cartItems.value.find((item) => item.id === product.id)
    if (isExist) {
      ElMessage.warning('该资源已在购物车中，请勿重复添加')
      return false
    }
    cartItems.value.push(product)
    return true
  }

  const removeCartItem = (index: number) => {
    cartItems.value.splice(index, 1)
    ElMessage.success('已移出购物车')
  }

  const clearCart = () => {
    cartItems.value = []
  }

  return { 
    cartItems, 
    cartDrawerVisible, 
    totalCount, 
    totalPrice, 
    openCartDrawer, 
    closeCartDrawer, 
    addCartItem, 
    removeCartItem, 
    clearCart 
  }
}, {
  persist: {
    key: 'platform_cart',
    storage: localStorage,
    pick: ['cartItems']
  }
})