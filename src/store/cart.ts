// src/store/cart.ts
// 购物车状态管理（Zustand），持久化键与 Vue 版保持一致
import { create } from 'zustand'
import { message } from 'antd'
import type { CartItem } from '@/types'

const CART_KEY = 'platform_cart'

export interface CartItemWithQuantity extends CartItem {
  quantity: number
  selected: boolean
}

interface CartDerived {
  totalCount: number
  totalPrice: number
  selectedTotalPrice: number
  selectedCount: number
  isAllSelected: boolean
}

export interface CartState extends CartDerived {
  cartItems: CartItemWithQuantity[]
  cartDrawerVisible: boolean
  openCartDrawer: () => void
  closeCartDrawer: () => void
  addCartItem: (product: CartItem) => boolean
  removeCartItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  increaseQuantity: (id: number) => void
  decreaseQuantity: (id: number) => void
  toggleSelect: (id: number) => void
  toggleSelectAll: () => void
  removeSelected: () => void
  clearCart: () => void
}

const readCart = (): CartItemWithQuantity[] => {
  const raw = localStorage.getItem(CART_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as { cartItems?: CartItemWithQuantity[] } | CartItemWithQuantity[]
    const list = Array.isArray(parsed) ? parsed : parsed.cartItems
    if (!Array.isArray(list)) return []
    return list.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
      selected: item.selected !== undefined ? item.selected : true
    }))
  } catch {
    return []
  }
}

const persistCart = (cartItems: CartItemWithQuantity[]): void => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify({ cartItems }))
  } catch (err) {
    console.error('[cart] 持久化失败：', err)
  }
}

const derive = (cartItems: CartItemWithQuantity[]): CartDerived => {
  const selectedItems = cartItems.filter((item) => item.selected)
  return {
    totalCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    totalPrice: cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0),
    selectedTotalPrice: selectedItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0),
    selectedCount: selectedItems.length,
    isAllSelected: cartItems.length > 0 && cartItems.every((item) => item.selected)
  }
}

const initialCart = readCart()

const commit = (
  set: (partial: Partial<CartState>) => void,
  cartItems: CartItemWithQuantity[]
): void => {
  persistCart(cartItems)
  set({ cartItems, ...derive(cartItems) })
}

export const useCartStore = create<CartState>()((set, get) => ({
  cartItems: initialCart,
  cartDrawerVisible: false,
  ...derive(initialCart),

  openCartDrawer: () => set({ cartDrawerVisible: true }),

  closeCartDrawer: () => set({ cartDrawerVisible: false }),

  addCartItem: (product) => {
    const cartItems = get().cartItems
    const existing = cartItems.find((item) => item.id === product.id)
    if (existing) {
      const next = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
      commit(set, next)
      message.success('数量 +1')
      return true
    }
    commit(set, [...cartItems, { ...product, quantity: 1, selected: true }])
    return true
  },

  removeCartItem: (id) => {
    const cartItems = get().cartItems
    if (!cartItems.some((item) => item.id === id)) return
    commit(set, cartItems.filter((item) => item.id !== id))
    message.success('已移出购物车')
  },

  updateQuantity: (id, quantity) => {
    if (quantity < 1) {
      get().removeCartItem(id)
      return
    }
    commit(
      set,
      get().cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  },

  increaseQuantity: (id) => {
    commit(
      set,
      get().cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  },

  decreaseQuantity: (id) => {
    const item = get().cartItems.find((cartItem) => cartItem.id === id)
    if (!item) return
    if (item.quantity > 1) {
      get().updateQuantity(id, item.quantity - 1)
    } else {
      get().removeCartItem(id)
    }
  },

  toggleSelect: (id) => {
    commit(
      set,
      get().cartItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    )
  },

  toggleSelectAll: () => {
    const allSelected = get().isAllSelected
    commit(
      set,
      get().cartItems.map((item) => ({ ...item, selected: !allSelected }))
    )
  },

  removeSelected: () => {
    const cartItems = get().cartItems
    const selectedItems = cartItems.filter((item) => item.selected)
    if (selectedItems.length === 0) {
      message.warning('请先选择要删除的商品')
      return
    }
    commit(set, cartItems.filter((item) => !item.selected))
    message.success(`已删除 ${selectedItems.length} 件商品`)
  },

  clearCart: () => {
    commit(set, [])
  }
}))
