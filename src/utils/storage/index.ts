/**
 * src/utils/storage/index.ts
 * 通用存储工具
 * 设计：只封装最常用的 set/get/remove + 跨窗口 sessionStorage/localStorage 切换
 *        + JSON 自动序列化/反序列化 + 过期时间（可选）
 */

export type StorageType = 'local' | 'session'

export interface StorageOption {
  /** 默认 'local' */
  type?: StorageType
  /** 单位 ms，0 表示不过期 */
  expires?: number
}

interface StorageValue {
  v: unknown
  /** 到期时间戳（ms），undefined 表示不过期 */
  e?: number
}

const pick = (type: StorageType = 'local'): Storage => {
  return type === 'session' ? sessionStorage : localStorage
}

/** 判断是否已过期 */
const isExpired = (e?: number): boolean => {
  if (!e) return false
  return Date.now() > e
}

/**
 * 设置存储值
 * @param key 键
 * @param value 值（自动 JSON.stringify）
 * @param option 存储类型与过期时间
 */
export const setItem = (key: string, value: unknown, option: StorageOption = {}): void => {
  const store = pick(option.type)
  const payload: StorageValue = { v: value }
  if (option.expires && option.expires > 0) {
    payload.e = Date.now() + option.expires
  }
  try {
    store.setItem(key, JSON.stringify(payload))
  } catch (err) {
    console.error('[storage.setItem] 失败：', err)
  }
}

/**
 * 读取存储值（自动 JSON.parse + 过期校验）
 */
export const getItem = <T = unknown>(key: string, type: StorageType = 'local'): T | null => {
  const store = pick(type)
  const raw = store.getItem(key)
  if (raw == null) return null

  try {
    const parsed = JSON.parse(raw) as StorageValue
    if (isExpired(parsed.e)) {
      store.removeItem(key)
      return null
    }
    return parsed.v as T
  } catch {
    // 兼容：原始值不是 JSON 包装（旧数据），原样返回
    return raw as unknown as T
  }
}

export const removeItem = (key: string, type: StorageType = 'local'): void => {
  pick(type).removeItem(key)
}

export const clear = (type: StorageType = 'local'): void => {
  pick(type).clear()
}
