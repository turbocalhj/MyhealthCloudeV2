<template>
  <div class="console-card-container notranslate" translate="no">
    <div class="filter-tabs-row-box">
      <span class="filter-caption-lbl">到期时间</span>
      <el-radio-group v-model="activeTimeTab" size="small" @change="handleTimeTabChange">
        <el-radio-button label="全部" />
        <el-radio-button label="已到期" />
        <el-radio-button label="1天内" />
        <el-radio-button label="3天内" />
        <el-radio-button label="7天内" />
      </el-radio-group>
    </div>

    <div v-if="isContractMode" class="contract-advanced-search-bar">
      <div class="search-fields-flex">
        <div class="field-cell">
          <span class="cell-label">合同编号</span>
          <el-input v-model="contractIdQuery" placeholder="请输入合同编号" style="width: 200px" clearable />
        </div>
        <div class="field-cell">
          <span class="cell-label">合同名称</span>
          <el-input v-model="contractNameQuery" placeholder="请输入合同名称" style="width: 200px" clearable />
        </div>
      </div>
      <div class="search-actions">
        <el-button type="primary" class="btn-primary-blue" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </div>
    </div>

    <div v-if="isEmptyData" class="empty-state-workspace-canvas">
      <el-empty description="暂无数据" :image-size="120" />
    </div>

    <div v-else class="console-table-wrapper" style="margin-top: 20px;">
      <el-table 
        :data="renderedTableData" 
        style="width: 100%"
        :header-cell-style="{ background: '#F7F8FA', color: '#1D2129', fontWeight: '500' }"
      >
        <template v-if="isContractMode">
          <el-table-column prop="contractId" label="合同编号" width="160" />
          <el-table-column prop="contractName" label="合同名称" min-width="150">
            <template #default="scope">
              <span class="table-blue-link-lbl">{{ scope.row.contractName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cloudId" label="云上合同ID" width="150" />
          <el-table-column prop="demandUser" label="需求方" width="100" />
          <el-table-column prop="providerUser" label="供给方" width="100" />
          <el-table-column prop="amount" label="合同金额" width="120" />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="scope">
              <span class="blue-contract-status-pill">{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="130" />
          <el-table-column prop="endTime" label="结束时间" width="130" />
        </template>

        <template v-else>
          <el-table-column prop="resourceId" label="资源ID" width="180" show-overflow-tooltip />
          <el-table-column prop="resourceName" label="资源名称" min-width="150">
            <template #default="scope">
              <span class="table-blue-link-lbl" @click="handleCheckDetail(scope.row)">{{ scope.row.resourceName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="resourceType" label="资源类型" width="120" />
          <el-table-column prop="region" label="区域" width="100" />
          <el-table-column prop="gpuModel" label="显卡型号" width="160" />
          <el-table-column prop="gpuNum" label="显卡数量" width="90" align="center" />
          <el-table-column prop="vram" label="显存" width="90" />
          <el-table-column prop="cpu" label="CPU" width="90" />
          <el-table-column prop="memory" label="内存" width="90" />
          <el-table-column prop="systemDisk" label="系统盘" width="100" />
        </template>

        <el-table-column label="操作" fixed="right" width="80">
          <template #default="scope">
            <span class="action-blue-link-btn" @click="handleCheckDetail(scope.row)">详情</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-footer-flex-row">
        <el-pagination :total="renderedTableData.length" :page-size="10" layout="total, prev, pager, next" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const activeTimeTab = ref('全部')
const contractIdQuery = ref('')
const contractNameQuery = ref('')

const isContractMode = computed(() => route.path.includes('contract'))
const isEmptyData = computed(() => route.path.includes('general'))

const mockIntelligentResourceList = ref([
  { resourceId: '8731370905908269056', resourceName: 'yintestLiantong', resourceType: '裸金属', region: '萧山区', gpuModel: 'Huawei Atlas 300', gpuNum: 2, vram: '64GB', cpu: '104核', memory: '256GB', systemDisk: '--', intranetIp: '192.168.20.121', status: '运行中' },
  { resourceId: '825416335817216000', resourceName: 'sherrytestalam1', resourceType: '裸金属', region: '拱墅区', gpuModel: 'Ascend 910B2', gpuNum: 8, vram: '64GB', cpu: '128核', memory: '1536GB', systemDisk: '894GB', intranetIp: '192.168.20.122', status: '运行中' },
  { resourceId: '821876165683744768', resourceName: 'FT-BMS-Prod-sh...', resourceType: '裸金属', region: '萧山区', gpuModel: 'Huawei Ascend 910', gpuNum: 1, vram: '32GB', cpu: '192核', memory: '1024GB', systemDisk: '894GB', intranetIp: '192.168.20.125', status: '运行中' }
])

const mockContractList = ref([
  { contractId: 'HT20260529001', contractName: '阿里合同', cloudId: 'HT20260529001', demandUser: '测评中心', providerUser: '健康云', amount: '¥0.00', status: '履约中', startTime: '2026-05-29', endTime: '2026-06-29' }
])

const renderedTableData = computed(() => {
  if (isContractMode.value) {
    return mockContractList.value.filter(item => {
      return (!contractIdQuery.value || item.contractId.includes(contractIdQuery.value)) &&
             (!contractNameQuery.value || item.contractName.includes(contractNameQuery.value))
    })
  }
  return mockIntelligentResourceList.value
})

// 🚀 核心：赋予智算到期查看“图二/图三高保真趋势详情看板”的功能
const handleCheckDetail = (row: any) => {
  if (isContractMode.value) {
    ElMessage.info(`合同详请单号: ${row.contractId}`)
    return
  }
  
  // 如果是智算到期资产，直接导流跳转到精美看板
  router.push({
    path: '/console/resource-detail',
    query: {
      id: row.resourceId,
      name: row.resourceName,
      status: row.status || '运行中',
      intranetIp: row.intranetIp || '192.168.2.166',
      cpu: row.cpu,
      memory: row.memory,
      systemDisk: row.systemDisk,
      region: row.region,
      gpuModel: row.gpuModel,
      gpuNum: row.gpuNum,
      vram: row.vram,
      demander: '测评中心',
      provider: '中国联通'
    }
  })
}

const handleTimeTabChange = (val: any) => { console.log(val) }
const handleSearch = () => { ElMessage.success('到期检索完毕') }
const handleReset = () => { contractIdQuery.value = ''; contractNameQuery.value = '' }
</script>

<style scoped>
.console-card-container { background: #ffffff; padding: 20px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,21,41,.03); }
.filter-tabs-row-box { display: flex; align-items: center; gap: 16px; margin-bottom: 4px; }
.filter-caption-lbl { font-size: 14px; color: #4E5969; }
.contract-advanced-search-bar { display: flex; justify-content: space-between; align-items: center; background-color: #FAFAFA; padding: 14px 20px; border-radius: 4px; margin-top: 16px; }
.search-fields-flex { display: flex; gap: 24px; }
.field-cell { display: flex; align-items: center; gap: 10px; }
.cell-label { font-size: 14px; color: #4E5969; }
.btn-primary-blue { background-color: #1677FF !important; border-color: #1677FF !important; }
.empty-state-workspace-canvas { padding: 60px 0; display: flex; justify-content: center; align-items: center; }
.table-blue-link-lbl { color: #1677FF; cursor: pointer; }
.action-blue-link-btn { color: #1677FF; cursor: pointer; font-size: 14px; }
.blue-contract-status-pill { background-color: #E8F3FF; color: #1677FF; padding: 2px 10px; border-radius: 2px; font-size: 12px; }
.pagination-footer-flex-row { display: flex; justify-content: flex-end; padding-top: 20px; }
</style>