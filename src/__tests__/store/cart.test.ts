// cart store 单元测试
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCartStore } from '@/store/modules/cart'
import type { CartItem } from '@/types'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should have empty cart items initially', () => {
      const store = useCartStore()
      expect(store.cartItems).toEqual([])
    })

    it('should have zero total count initially', () => {
      const store = useCartStore()
      expect(store.totalCount).toBe(0)
    })

    it('should have zero total price initially', () => {
      const store = useCartStore()
      expect(store.totalPrice).toBe(0)
    })

    it('should have zero selected total price initially', () => {
      const store = useCartStore()
      expect(store.selectedTotalPrice).toBe(0)
    })

    it('should have cart drawer closed initially', () => {
      const store = useCartStore()
      expect(store.cartDrawerVisible).toBe(false)
    })

    it('should not be all selected when cart is empty', () => {
      const store = useCartStore()
      expect(store.isAllSelected).toBe(false)
    })
  })

  describe('Cart Drawer', () => {
    it('should open cart drawer', () => {
      const store = useCartStore()
      store.openCartDrawer()
      expect(store.cartDrawerVisible).toBe(true)
    })

    it('should close cart drawer', () => {
      const store = useCartStore()
      store.cartDrawerVisible = true
      store.closeCartDrawer()
      expect(store.cartDrawerVisible).toBe(false)
    })
  })

  describe('Add Cart Item', () => {
    const mockProduct: CartItem = {
      id: 1,
      name: 'Test Product',
      price: 100,
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
    }

    it('should add item to cart with quantity 1', () => {
      const store = useCartStore()
      const result = store.addCartItem(mockProduct)
      
      expect(result).toBe(true)
      expect(store.cartItems).toHaveLength(1)
      expect(store.cartItems[0].quantity).toBe(1)
      expect(store.cartItems[0].selected).toBe(true)
      expect(store.totalCount).toBe(1)
    })

    it('should increase quantity when adding duplicate item', () => {
      const store = useCartStore()
      store.addCartItem(mockProduct)
      const result = store.addCartItem(mockProduct)
      
      expect(result).toBe(true)
      expect(store.cartItems).toHaveLength(1)
      expect(store.cartItems[0].quantity).toBe(2)
      expect(store.totalCount).toBe(2)
    })

    it('should calculate total price correctly with quantity', () => {
      const store = useCartStore()
      const product2: CartItem = { ...mockProduct, id: 2, price: 200 }
      
      store.addCartItem(mockProduct)
      store.addCartItem(mockProduct) // quantity = 2
      store.addCartItem(product2)
      
      expect(store.totalPrice).toBe(100 * 2 + 200) // 400
    })
  })

  describe('Remove Cart Item', () => {
    const mockProduct: CartItem = {
      id: 1,
      name: 'Test Product',
      price: 100,
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
    }

    it('should remove item from cart by id', () => {
      const store = useCartStore()
      store.addCartItem(mockProduct)
      store.removeCartItem(mockProduct.id)
      
      expect(store.cartItems).toHaveLength(0)
    })

    it('should not error when removing non-existent item', () => {
      const store = useCartStore()
      expect(() => store.removeCartItem(999)).not.toThrow()
    })
  })

  describe('Quantity Control', () => {
    const mockProduct: CartItem = {
      id: 1,
      name: 'Test Product',
      price: 100,
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
    }

    it('should increase quantity', () => {
      const store = useCartStore()
      store.addCartItem(mockProduct)
      store.increaseQuantity(mockProduct.id)
      
      expect(store.cartItems[0].quantity).toBe(2)
      expect(store.totalCount).toBe(2)
    })

    it('should decrease quantity', () => {
      const store = useCartStore()
      store.addCartItem(mockProduct)
      store.increaseQuantity(mockProduct.id)
      store.decreaseQuantity(mockProduct.id)
      
      expect(store.cartItems[0].quantity).toBe(1)
    })

    it('should remove item when decreasing quantity to 0', () => {
      const store = useCartStore()
      store.addCartItem(mockProduct)
      store.decreaseQuantity(mockProduct.id)
      
      expect(store.cartItems).toHaveLength(0)
    })

    it('should update quantity directly', () => {
      const store = useCartStore()
      store.addCartItem(mockProduct)
      store.updateQuantity(mockProduct.id, 5)
      
      expect(store.cartItems[0].quantity).toBe(5)
    })

    it('should remove item when updating quantity to 0', () => {
      const store = useCartStore()
      store.addCartItem(mockProduct)
      store.updateQuantity(mockProduct.id, 0)
      
      expect(store.cartItems).toHaveLength(0)
    })
  })

  describe('Select Control', () => {
    const mockProduct: CartItem = {
      id: 1,
      name: 'Test Product',
      price: 100,
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
    }

    it('should toggle select for single item', () => {
      const store = useCartStore()
      store.addCartItem(mockProduct)
      
      expect(store.cartItems[0].selected).toBe(true)
      store.toggleSelect(mockProduct.id)
      expect(store.cartItems[0].selected).toBe(false)
    })

    it('should toggle select all', () => {
      const store = useCartStore()
      const product2 = { ...mockProduct, id: 2 }
      store.addCartItem(mockProduct)
      store.addCartItem(product2)
      
      expect(store.isAllSelected).toBe(true)
      store.toggleSelectAll()
      expect(store.isAllSelected).toBe(false)
      expect(store.cartItems.every(item => !item.selected)).toBe(true)
    })

    it('should calculate selected total price correctly', () => {
      const store = useCartStore()
      const product2 = { ...mockProduct, id: 2, price: 200 }
      store.addCartItem(mockProduct)
      store.addCartItem(product2)
      
      // Deselect first item
      store.toggleSelect(mockProduct.id)
      
      expect(store.selectedCount).toBe(1)
      expect(store.selectedTotalPrice).toBe(200)
    })
  })

  describe('Batch Operations', () => {
    const mockProduct: CartItem = {
      id: 1,
      name: 'Test Product',
      price: 100,
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
    }

    it('should remove selected items', () => {
      const store = useCartStore()
      const product2 = { ...mockProduct, id: 2 }
      store.addCartItem(mockProduct)
      store.addCartItem(product2)
      
      // Deselect first item
      store.toggleSelect(mockProduct.id)
      
      store.removeSelected()
      
      expect(store.cartItems).toHaveLength(1)
      expect(store.cartItems[0].id).toBe(mockProduct.id)
    })

    it('should warn when no items selected for removal', () => {
      const store = useCartStore()
      store.addCartItem(mockProduct)
      store.toggleSelect(mockProduct.id)
      
      store.removeSelected()
      
      // Item should still be in cart
      expect(store.cartItems).toHaveLength(1)
    })
  })

  describe('Clear Cart', () => {
    const mockProduct: CartItem = {
      id: 1,
      name: 'Test Product',
      price: 100,
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
    }

    it('should clear all cart items', () => {
      const store = useCartStore()
      store.addCartItem(mockProduct)
      store.clearCart()
      
      expect(store.cartItems).toHaveLength(0)
      expect(store.totalCount).toBe(0)
      expect(store.totalPrice).toBe(0)
      expect(store.selectedCount).toBe(0)
    })
  })
})