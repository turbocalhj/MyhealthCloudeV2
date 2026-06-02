<template>
  <div class="console-dashboard-page">
    <div class="search-filter-card">
      <div class="filter-row">
        <span class="filter-label">资源名称</span>
        <el-input v-model="searchQuery" placeholder="输入资源名称或ID" class="search-input" clearable />
        <el-button type="primary" class="action-blue-btn" @click="handleSearch">
          <el-icon><Search /></el-icon> 搜索
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon> 重置
        </el-button>
      </div>
    </div>

    <div class="data-table-wrapper-card">
      <el-table :data="tableData" style="width: 100%" size="default" :header-cell-style="{ background: '#f7f8fa', color: '#1d2129', fontWeight: '500' }">
        <el-table-column prop="id" label="资源ID" width="180" show-overflow-tooltip />
        <el-table-column prop="name" label="资源名称" width="160">
          <template #default="scope">
            <span class="blue-link-text">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="region" label="区域" width="100" />
        <el-table-column prop="gpuModel" label="显卡型号" width="160" />
        <el-table-column prop="gpuNum" label="显卡数量" width="100" align="center" />
        <el-table-column prop="vram" label="显存" width="100" />
        <el-table-column prop="cpu" label="CPU" width="100" />
        <el-table-column prop="memory" label="内存" width="100" />
        <el-table-column prop="systemDisk" label="系统盘" width="100" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default>
            <span class="table-op-btn">详情</span>
            <span class="table-op-btn danger-text">销毁</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container-row">
        <el-pagination :total="21" :current-page="1" :page-size="10" layout="total, prev, pager, next, sizes" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'

const searchQuery = ref('')

// 完美还原图六的核心资产数据快照
const tableData = ref([
  { id: '8716cee3-743b-4a72-a83...', name: 'sssss', region: '--', gpuModel: '--', gpuNum: '--', vram: '--', cpu: '40核', memory: '384GB', systemDisk: '480GB' },
  { id: '8731370905908269056', name: 'yintestLiantong', region: '萧山区', gpuModel: 'Huawei Atlas 300', gpuNum: 2, vram: '64GB', cpu: '104核', memory: '256GB', systemDisk: '--' },
  { id: '825416335817216000', name: 'sherrytestalam1', region: '拱墅区', gpuModel: 'Ascend 910B2', gpuNum: 8, vram: '64GB', cpu: '128核', memory: '1536GB', systemDisk: '894GB' },
  { id: '818855540908134400', name: 'work-910b-eekzk1', region: '--', gpuModel: '--', gpuNum: '--', vram: '--', cpu: '192核', memory: '1024GB', systemDisk: '894GB' }
])

const handleSearch = () => { console.log('检索：', searchQuery.value) }
const handleReset = () => { searchQuery.value = '' }
</script>

<style scoped>
.console-dashboard-page { display: flex; flex-direction: column; gap: 16px; }
.search-filter-card { background: #ffffff; padding: 18px 24px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,21,41,.04); }
.filter-row { display: flex; align-items: center; gap: 12px; }
.filter-label { font-size: 14px; color: #4e5969; }
.search-input { width: 240px; }
.action-blue-btn { background-color: #1677FF !important; border-color: #1677FF !important; }
.data-table-wrapper-card { background: #ffffff; padding: 20px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,21,41,.04); }
.blue-link-text { color: #1677FF; cursor: pointer; }
.table-op-btn { color: #1677FF; font-size: 14px; cursor: pointer; margin-right: 12px; }
.danger-text { color: #f53f3f; }
.pagination-container-row { display: flex; justify-content: flex-end; padding-top: 18px; }
</style>