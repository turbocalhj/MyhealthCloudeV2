// 测试全局 setup
import { vi, beforeEach } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn((key: string) => {
    return localStorageMock.store[key] || null
  }),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key]
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {}
  }),
  store: {} as Record<string, string>
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn((key: string) => {
    return sessionStorageMock.store[key] || null
  }),
  setItem: vi.fn((key: string, value: string) => {
    sessionStorageMock.store[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete sessionStorageMock.store[key]
  }),
  clear: vi.fn(() => {
    sessionStorageMock.store = {}
  }),
  store: {} as Record<string, string>
}

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
})

// 每个测试前清理
beforeEach(() => {
  localStorageMock.store = {}
  sessionStorageMock.store = {}
  vi.clearAllMocks()
})
