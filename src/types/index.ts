// src/types/index.ts

/**
 * 全局通用算力产品模型
 */
export interface ComputingProduct {
  id: number
  name: string
  marketTag: string
  labels: string[]
  gpuType: string
  gpuCount: string
  memory: string
  cpu: string
  ram: string
  disk: string
  price: number
  priceUnit: string
  isOutOfStock?: boolean
  metaSourceType: '自营' | '市场'
  metaSubSource: string
  metaProvince: string
  metaCity: string
  metaGpuBrand: string
  metaGpuCount: string
  metaSubsidy: string
}

/**
 * 购物车实体项
 */
export interface CartItem extends ComputingProduct {
  // 可在未来扩展购物车专属字段，如: buyCount, duration 等
}

/**
 * 系统消息实体
 */
export interface MessageItem {
  id: string | number
  title: string
  time: string
  status: '已读' | '未读'
  content?: string
}