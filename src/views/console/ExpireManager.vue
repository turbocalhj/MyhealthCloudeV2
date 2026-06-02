<template>
  <div class="console-card-container notranslate" translate="no">
    <div class="filter-tabs-row-box">
      <span class="filter-caption-lbl">到期时间</span>
      <el-radio-group v-model="activeTimeTab" size="small">
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
        <el-button type="primary" class="btn-primary-blue" @click="handleSearch">
          <el-icon style="margin-right: 4px;"><Search /></el-icon> 搜索
        </el-button>
        <el-button @click="handleReset">
          <el-icon style="margin-right: 4px;"><Refresh /></el-icon> 重置
        </el-button>
      </div>
    </div>

    <div class="console-table-wrapper" style="margin-top: 20px;">
      <el-table 
        :data="renderedTableData" 
        style="width: 100%"
        :header-cell-style="{ background: '#F7F8FA', color: '#1D2129', fontWeight: '500', height: '44px' }"
      >
        <template v-if="isContractMode">
          <el-table-column prop="contractId" label="合同编号" width="160" />
          <el-table-column prop="contractName" label="合同名称" min-width="150">
            <template #default="scope">
              <span class="table-blue-link-lbl" @click="handleGoToStandaloneFinance(scope.row)">{{ scope.row.contractName }}</span>
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
          <el-table-column prop="resourceName" label="资源名称" min-width="150" />
          <el-table-column prop="resourceType" label="资源类型" width="120" />
          <el-table-column prop="region" label="区域" width="100" />
          <el-table-column prop="cpu" label="CPU" width="90" />
          <el-table-column prop="memory" label="内存" width="90" />
        </template>

        <el-table-column label="操作" fixed="right" width="80">
          <template #default="scope">
            <span class="action-blue-link-btn" @click="handleGoToStandaloneFinance(scope.row)">详情</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const activeTimeTab = ref('全部')
const contractIdQuery = ref('')
const contractNameQuery = ref('')

const isContractMode = computed(() => route.path.includes('contract'))

const contractDataset = ref([
  { contractId: 'HT20260529001', contractName: '续签阿里计算资源折扣合同', cloudId: 'HT20260529001', demandUser: '测评中心', providerUser: '健康云', amount: '¥0.00', status: '履约中', startTime: '2026-05-29', endTime: '2026-05-31' },
  { contractId: 'aaa2', contractName: '续签内部测试资产补充包', cloudId: 'aaa2', demandUser: '测评中心', providerUser: '健康云', amount: '¥0.00', status: '履约中', startTime: '2026-03-31', endTime: '2026-04-30' },
  { contractId: 'HT-260423-002', contractName: '中移高算力集群采购单', cloudId: 'HT-260423-002', demandUser: '测评中心', providerUser: '中国移动', amount: '¥1,000.00', status: '履约中', startTime: '2026-03-01', endTime: '2026-04-01' }
])

const resourceDataset = ref([
  { resourceId: '8731370905908269056', resourceName: 'yintestLiantong', resourceType: '裸金属', region: '萧山区', cpu: '104核', memory: '256GB' }
])

const renderedTableData = computed(() => {
  if (isContractMode.value) {
    return contractDataset.value.filter(item => {
      return (!contractIdQuery.value || item.contractId.includes(contractIdQuery.value)) &&
             (!contractNameQuery.value || item.contractName.includes(contractNameQuery.value))
    })
  }
  return resourceDataset.value
})

// 🚀 核心更正：精准切流，使跳转导向独立的平级费用中心页面结构
const handleGoToStandaloneFinance = (row: any) => {
  router.push({
    path: '/finance/contract',
    query: { id: row.contractId || 'HT20260529001', name: row.contractName || '阿里合同', provider: row.providerUser || '健康云' }
  })
}

const handleSearch = () => { ElMessage.success('合同账期过滤检索完毕') }
const handleReset = () => { contractIdQuery.value = ''; contractNameQuery.value = '' }
</script>

<style scoped>
.console-card-container { background: #ffffff; padding: 24px; border-radius: 4px; }
.filter-tabs-row-box { display: flex; align-items: center; gap: 16px; margin-bottom: 4px; }
.filter-caption-lbl { font-size: 14px; color: #4E5969; }
.contract-advanced-search-bar { display: flex; justify-content: space-between; align-items: center; background-color: #FAFAFA; padding: 14px 20px; border-radius: 4px; margin-top: 16px; }
.search-fields-flex { display: flex; gap: 24px; }
.field-cell { display: flex; align-items: center; gap: 10px; }
.cell-label { font-size: 14px; color: #4E5969; }
.btn-primary-blue { background-color: #1677FF !important; border-color: #1677FF !important; }
.table-blue-link-lbl { color: #1677FF; cursor: pointer; font-weight: 500; }
.table-blue-link-lbl:hover { text-decoration: underline; }
.blue-contract-status-pill { background-color: #E8F3FF; color: #1677FF; padding: 2px 10px; border-radius: 2px; font-size: 12px; }
.action-blue-link-btn { color: #1677FF; cursor: pointer; font-size: 14px; }
</style>