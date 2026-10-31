// cart store 单元测试（Zustand）
import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '@/store/cart'
import type { CartItem } from '@/types'

const mockProduct = (id: number, price = 100): CartItem => ({
  id,
  name: `Test Product ${id}`,
  price,
  marketTag: 'test',
  labels: [],
  gpuType: 'GPU1',
  gpuCount: '1 卡',
  memory: '16 GB',
  cpu: '4 核',
  ram: '8 GB',
  disk: '50 GB',
  priceUnit: '/月',
  metaSourceType: '自营',
  metaSubSource: '健康云',
  metaProvince: '浙江省',
  metaCity: '杭州市',
  metaGpuBrand: '华为',
  metaGpuCount: '1卡',
  metaSubsidy: '50%'
})

const resetCart = () => {
  useCartStore.setState({
    cartItems: [],
    cartDrawerVisible: false,
    totalCount: 0,
    totalPrice: 0,
    selectedTotalPrice: 0,
    selectedCount: 0,
    isAllSelected: false
  })
}

describe('Cart Store', () => {
  beforeEach(() => {
    localStorage.clear()
    resetCart()
  })

  describe('Initial State', () => {
    it('should have empty cart items initially', () => {
      expect(useCartStore.getState().cartItems).toEqual([])
    })

    it('should have zero totals initially', () => {
      const state = useCartStore.getState()
      expect(state.totalCount).toBe(0)
      expect(state.totalPrice).toBe(0)
      expect(state.selectedTotalPrice).toBe(0)
      expect(state.selectedCount).toBe(0)
    })

    it('should have cart drawer closed and nothing selected initially', () => {
      const state = useCartStore.getState()
      expect(state.cartDrawerVisible).toBe(false)
      expect(state.isAllSelected).toBe(false)
    })
  })

  describe('Cart Drawer', () => {
    it('should open and close cart drawer', () => {
      useCartStore.getState().openCartDrawer()
      expect(useCartStore.getState().cartDrawerVisible).toBe(true)
      useCartStore.getState().closeCartDrawer()
      expect(useCartStore.getState().cartDrawerVisible).toBe(false)
    })
  })

  describe('Add Cart Item', () => {
    it('should add a new item with quantity 1 and selected', () => {
      const added = useCartStore.getState().addCartItem(mockProduct(1))
      const state = useCartStore.getState()
      expect(added).toBe(true)
      expect(state.cartItems).toHaveLength(1)
      expect(state.cartItems[0].quantity).toBe(1)
      expect(state.cartItems[0].selected).toBe(true)
      expect(state.totalCount).toBe(1)
      expect(state.totalPrice).toBe(100)
    })

    it('should increase quantity when adding an existing item', () => {
      const store = useCartStore.getState()
      store.addCartItem(mockProduct(1))
      store.addCartItem(mockProduct(1))
      const state = useCartStore.getState()
      expect(state.cartItems).toHaveLength(1)
      expect(state.cartItems[0].quantity).toBe(2)
      expect(state.totalPrice).toBe(200)
    })

    it('should persist cart with platform_cart key', () => {
      useCartStore.getState().addCartItem(mockProduct(1))
      const raw = localStorage.getItem('platform_cart')
      expect(raw).toBeTruthy()
      const parsed = JSON.parse(raw as string)
      expect(parsed.cartItems).toHaveLength(1)
    })
  })

  describe('Quantity Operations', () => {
    beforeEach(() => {
      useCartStore.getState().addCartItem(mockProduct(1, 100))
    })

    it('should increase quantity', () => {
      useCartStore.getState().increaseQuantity(1)
      expect(useCartStore.getState().cartItems[0].quantity).toBe(2)
    })

    it('should decrease quantity', () => {
      useCartStore.getState().increaseQuantity(1)
      useCartStore.getState().decreaseQuantity(1)
      expect(useCartStore.getState().cartItems[0].quantity).toBe(1)
    })

    it('should remove item when quantity drops below 1', () => {
      useCartStore.getState().decreaseQuantity(1)
      expect(useCartStore.getState().cartItems).toHaveLength(0)
    })

    it('should remove item when updateQuantity is less than 1', () => {
      useCartStore.getState().updateQuantity(1, 0)
      expect(useCartStore.getState().cartItems).toHaveLength(0)
    })
  })

  describe('Selection', () => {
    beforeEach(() => {
      useCartStore.getState().addCartItem(mockProduct(1, 100))
      useCartStore.getState().addCartItem(mockProduct(2, 200))
    })

    it('should toggle single item selection', () => {
      useCartStore.getState().toggleSelect(1)
      const state = useCartStore.getState()
      expect(state.cartItems.find((item) => item.id === 1)?.selected).toBe(false)
      expect(state.selectedCount).toBe(1)
      expect(state.selectedTotalPrice).toBe(200)
      expect(state.isAllSelected).toBe(false)
    })

    it('should toggle select all on and off', () => {
      useCartStore.getState().toggleSelectAll()
      expect(useCartStore.getState().isAllSelected).toBe(false)
      useCartStore.getState().toggleSelectAll()
      const state = useCartStore.getState()
      expect(state.isAllSelected).toBe(true)
      expect(state.selectedTotalPrice).toBe(300)
    })

    it('should remove only selected items', () => {
      useCartStore.getState().toggleSelect(2)
      useCartStore.getState().removeSelected()
      const state = useCartStore.getState()
      expect(state.cartItems).toHaveLength(1)
      expect(state.cartItems[0].id).toBe(2)
    })
  })

  describe('Remove & Clear', () => {
    it('should remove a specific item', () => {
      useCartStore.getState().addCartItem(mockProduct(1))
      useCartStore.getState().removeCartItem(1)
      expect(useCartStore.getState().cartItems).toHaveLength(0)
    })

    it('should clear the cart', () => {
      useCartStore.getState().addCartItem(mockProduct(1))
      useCartStore.getState().clearCart()
      const state = useCartStore.getState()
      expect(state.cartItems).toEqual([])
      expect(state.totalCount).toBe(0)
      expect(state.totalPrice).toBe(0)
    })
  })
})
