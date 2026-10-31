/**
 * src/api/resource.ts
 *
 * 资源管理 - 业务层 API（前后端联动）
 * 路径走 Vite proxy → Node 后端（http://localhost:3001）
 */
import http from '@/utils/http'

export type ResourceType = 'BMS' | 'ECS' | 'CONTAINER'
export type PowerStatus = 'on' | 'off' | 'rebooting'

export interface ResourceItem {
  id: string
  name: string
  type: ResourceType
  region: string
  cpu: string
  memory: string
  powerStatus: PowerStatus
  gpuModel?: string
  gpuNum?: string | number
  vram?: string
  systemDisk?: string
  intranetIp?: string
  namespace?: string
  createdAt: string
}

export interface ListQuery {
  type?: ResourceType
  keyword?: string
  page?: number
  pageSize?: number
}

export interface ListResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface CreatePayload {
  name: string
  type: ResourceType
  region?: string
  cpu?: string
  memory?: string
  gpuModel?: string
  gpuNum?: string | number
  vram?: string
  systemDisk?: string
  intranetIp?: string
  namespace?: string
  powerStatus?: PowerStatus
}

/** 列表 */
export function listResourcesApi(query: ListQuery = {}) {
  return http.get<ListResult<ResourceItem>, ListQuery>('/api/resources', { params: query })
}

/** 详情 */
export function getResourceApi(id: string) {
  return http.get<ResourceItem, undefined>(`/api/resources/${id}`)
}

/** 新建 */
export function createResourceApi(payload: CreatePayload) {
  return http.post<ResourceItem, CreatePayload>('/api/resources', { data: payload })
}

/** 更新 */
export function updateResourceApi(id: string, patch: Partial<ResourceItem>) {
  return http.put<ResourceItem, Partial<ResourceItem>>(`/api/resources/${id}`, { data: patch })
}

/** 销毁 */
export function deleteResourceApi(id: string) {
  return http.delete<{ id: string }, undefined>(`/api/resources/${id}`)
}

/** 开机 */
export function powerOnApi(id: string) {
  return http.patch<ResourceItem, undefined>(`/api/resources/${id}/power`)
}

/** 重启 */
export function rebootApi(id: string) {
  return http.patch<ResourceItem, undefined>(`/api/resources/${id}/reboot`)
}

/** 关机 */
export function powerOffApi(id: string) {
  return http.patch<ResourceItem, undefined>(`/api/resources/${id}/poweroff`)
}
