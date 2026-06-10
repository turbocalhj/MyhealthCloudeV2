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

    it('should have cart drawer closed initially', () => {
      const store = useCartStore()
      expect(store.cartDrawerVisible).toBe(false)
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

    it('should add item to cart', () => {
      const store = useCartStore()
      const result = store.addCartItem(mockProduct)
      
      expect(result).toBe(true)
      expect(store.cartItems).toHaveLength(1)
      expect(store.totalCount).toBe(1)
    })

    it('should not add duplicate item', () => {
      const store = useCartStore()
      store.addCartItem(mockProduct)
      const result = store.addCartItem(mockProduct)
      
      expect(result).toBe(false)
      expect(store.cartItems).toHaveLength(1)
    })

    it('should calculate total price correctly', () => {
      const store = useCartStore()
      const product2: CartItem = { ...mockProduct, id: 2, price: 200 }
      
      store.addCartItem(mockProduct)
      store.addCartItem(product2)
      
      expect(store.totalPrice).toBe(300)
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

    it('should remove item from cart', () => {
      const store = useCartStore()
      store.addCartItem(mockProduct)
      store.removeCartItem(0)
      
      expect(store.cartItems).toHaveLength(0)
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
    })
  })
})
