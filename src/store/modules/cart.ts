// src/store/modules/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { CartItem } from '@/types' // 🚀 引入严格类型

export const useCartStore = defineStore('cart', () => {
  // 🚀 替换 any[]
  const cartItems = ref<CartItem[]>([])
  const cartDrawerVisible = ref(false)

  const totalCount = computed(() => cartItems.value.length)
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price || 0), 0)
  })

  const openCartDrawer = () => {
    cartDrawerVisible.value = true
  }
  const closeCartDrawer = () => {
    cartDrawerVisible.value = false
  }

  // 🚀 替换 any
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