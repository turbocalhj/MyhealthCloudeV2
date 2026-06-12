// 购物车状态管理模块
// 功能：管理购物车中的算力资源列表，支持添加、删除、数量调整、批量操作、持久化存储
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { CartItem } from '@/types'

// 扩展购物车项，支持数量和选中状态
interface CartItemWithQuantity extends CartItem {
  quantity: number
  selected: boolean
}

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<CartItemWithQuantity[]>([])
  const cartDrawerVisible = ref(false)

  // 数据迁移：确保旧数据兼容新字段
  const migrateCartData = () => {
    cartItems.value = cartItems.value.map(item => ({
      ...item,
      quantity: item.quantity || 1,
      selected: item.selected !== undefined ? item.selected : true
    }))
  }

  // 初始化时执行数据迁移
  migrateCartData()

  // 购物车内商品总数（按数量计算）
  const totalCount = computed(() => 
    cartItems.value.reduce((total, item) => total + item.quantity, 0)
  )

  // 购物车总价计算（考虑数量）
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity
    }, 0)
  })

  // 已选中商品总价
  const selectedTotalPrice = computed(() => {
    return cartItems.value
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.price || 0) * item.quantity, 0)
  })

  // 已选中商品数量
  const selectedCount = computed(() => 
    cartItems.value.filter(item => item.selected).length
  )

  // 是否全选
  const isAllSelected = computed(() => 
    cartItems.value.length > 0 && cartItems.value.every(item => item.selected)
  )

  const openCartDrawer = () => {
    cartDrawerVisible.value = true
  }

  const closeCartDrawer = () => {
    cartDrawerVisible.value = false
  }

  // 添加商品到购物车
  const addCartItem = (product: CartItem) => {
    const existingItem = cartItems.value.find((item) => item.id === product.id)
    if (existingItem) {
      // 如果已存在，增加数量
      existingItem.quantity += 1
      ElMessage.success('数量 +1')
      return true
    }
    cartItems.value.push({
      ...product,
      quantity: 1,
      selected: true
    })
    return true
  }

  // 根据 id 删除商品
  const removeCartItem = (id: number) => {
    const index = cartItems.value.findIndex(item => item.id === id)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
      ElMessage.success('已移出购物车')
    }
  }

  // 更新商品数量
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeCartItem(id)
      return
    }
    const item = cartItems.value.find(item => item.id === id)
    if (item) {
      item.quantity = quantity
    }
  }

  // 增加数量
  const increaseQuantity = (id: number) => {
    const item = cartItems.value.find(item => item.id === id)
    if (item) {
      item.quantity += 1
    }
  }

  // 减少数量
  const decreaseQuantity = (id: number) => {
    const item = cartItems.value.find(item => item.id === id)
    if (item && item.quantity > 1) {
      item.quantity -= 1
    } else if (item) {
      removeCartItem(id)
    }
  }

  // 切换选中状态
  const toggleSelect = (id: number) => {
    const item = cartItems.value.find(item => item.id === id)
    if (item) {
      item.selected = !item.selected
    }
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    const allSelected = isAllSelected.value
    cartItems.value.forEach(item => {
      item.selected = !allSelected
    })
  }

  // 批量删除已选中商品
  const removeSelected = () => {
    const selectedItems = cartItems.value.filter(item => item.selected)
    if (selectedItems.length === 0) {
      ElMessage.warning('请先选择要删除的商品')
      return
    }
    cartItems.value = cartItems.value.filter(item => !item.selected)
    ElMessage.success(`已删除 ${selectedItems.length} 件商品`)
  }

  // 清空购物车
  const clearCart = () => {
    cartItems.value = []
  }

  return { 
    cartItems, 
    cartDrawerVisible, 
    totalCount, 
    totalPrice,
    selectedTotalPrice,
    selectedCount,
    isAllSelected,
    openCartDrawer, 
    closeCartDrawer, 
    addCartItem, 
    removeCartItem,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    toggleSelect,
    toggleSelectAll,
    removeSelected,
    clearCart 
  }
}, {
  persist: {
    key: 'platform_cart',
    storage: localStorage,
    pick: ['cartItems']
  }
})