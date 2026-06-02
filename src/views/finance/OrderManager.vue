<template>
  <div class="standalone-order-fluid-workspace">
    <div class="filter-combination-card">
      <div class="filter-layout-line">
        <div class="inputs-cells-flex-cluster">
          <div class="cell">
            <span class="label">状态</span>
            <el-select v-model="filterStatus" placeholder="选择状态" style="width: 180px" clearable>
              <el-option label="交付中" value="交付中" />
              <el-option label="已完成" value="已完成" />
            </el-select>
          </div>
          <div class="cell">
            <span class="label">订单号</span>
            <el-input v-model="filterOrderId" placeholder="输入订单号查询" style="width: 240px" clearable />
          </div>
        </div>
        <div class="actions-buttons-cluster">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <div class="table-frame-container margin-top-12">
      <el-table :data="computedOrderRows" style="width: 100%" :header-cell-style="{ background: '#F7F8FA', color: '#1D2129' }">
        <el-table-column prop="id" label="订单号" min-width="190">
          <template #default="scope"><span class="table-interactive-blue-node">{{ scope.row.id }}</span></template>
        </el-table-column>
        <el-table-column prop="demander" label="需求方" width="120" />
        <el-table-column prop="provider" label="供给方" width="120" />
        <el-table-column prop="price" label="金额" width="120" />
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="scope">
            <span :class="['pill-tag-node', scope.row.status === '已完成' ? 'green-node' : 'orange-node']">{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicant" label="申请人" width="110" />
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" fixed="right" width="80">
          <template #default><span class="table-action-trigger-lbl">详情</span></template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const filterStatus = ref('')
const filterOrderId = ref('')

const orderDataset = ref([
  { id: 'OR202606011715527448', demander: '测评中心', provider: '健康云', price: '¥0.00', status: '交付中', applicant: '张海洋', createTime: '2026-06-01 17:15:52' },
  { id: 'OR202605291438482551', demander: '测评中心', provider: '健康云', price: '¥0.00', status: '已完成', applicant: '张海洋', createTime: '2026-05-29 14:38:48' }
])

const computedOrderRows = computed(() => {
  return orderDataset.value.filter(item => {
    return (!filterStatus.value || item.status === filterStatus.value) &&
           (!filterOrderId.value || item.id.includes(filterOrderId.value))
  })
})

const handleSearch = () => {}
const handleReset = () => { filterStatus.value = ''; filterOrderId.value = '' }
</script>

<style scoped>
.filter-combination-card { background: #ffffff; padding: 16px 20px; border-radius: 4px; border: 1px solid #E5E6EB; }
.filter-layout-line { display: flex; align-items: center; width: 100%; justify-content: space-between; }
.label { font-size: 14px; color: #1D2129; margin-right: 12px; }
.inputs-cells-flex-cluster { display: flex; gap: 32px; }
.cell { display: flex; align-items: center; }
.actions-buttons-cluster { display: flex; gap: 12px; }
.margin-top-12 { margin-top: 12px; }
.table-frame-container { background-color: #ffffff; padding: 20px; border-radius: 4px; border: 1px solid #E5E6EB; }
.table-interactive-blue-node { color: #1677FF; font-weight: 500; cursor: pointer; }
.pill-tag-node { padding: 2px 8px; border-radius: 2px; font-size: 12px; font-weight: 500; }
.green-node { background-color: #E8FFEA; color: #00B42A; }
.orange-node { background-color: #FFF7E6; color: #FAAD14; }
.table-action-trigger-lbl { color: #1677FF; cursor: pointer; }
</style>