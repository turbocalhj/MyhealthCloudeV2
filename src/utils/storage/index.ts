/**
 * src/utils/storage/index.ts
 * 通用存储工具：JSON 自动序列化/反序列化 + 可选过期时间
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

const isExpired = (e?: number): boolean => {
  if (!e) return false
  return Date.now() > e
}

/** 设置存储值 */
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

/** 读取存储值（自动 JSON.parse + 过期校验） */
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
    return raw as unknown as T
  }
}

export const removeItem = (key: string, type: StorageType = 'local'): void => {
  pick(type).removeItem(key)
}

export const clear = (type: StorageType = 'local'): void => {
  pick(type).clear()
}
