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
  key: vi.fn((index: number) => Object.keys(localStorageMock.store)[index] ?? null),
  get length() {
    return Object.keys(localStorageMock.store).length
  },
  store: {} as Record<string, string>
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true
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
  key: vi.fn((index: number) => Object.keys(sessionStorageMock.store)[index] ?? null),
  get length() {
    return Object.keys(sessionStorageMock.store).length
  },
  store: {} as Record<string, string>
}

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  configurable: true
})

// antd 组件依赖的浏览器 API
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock
})

// 每个测试前清理
beforeEach(() => {
  localStorageMock.store = {}
  sessionStorageMock.store = {}
  vi.clearAllMocks()
})
