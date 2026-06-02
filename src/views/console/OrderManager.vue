<template>
  <div class="console-card-container">
    <template v-if="isApplyOrderView">
      <div class="order-action-filter-header-bar">
        <div class="filter-flex-inputs">
          <div class="select-cell">
            <span class="cell-lbl">状态</span>
            <el-select v-model="activeStatusSelect" placeholder="选择状态" style="width: 160px" clearable>
              <el-option label="待审批" value="待审批" />
              <el-option label="审批通过" value="审批通过" />
            </el-select>
          </div>
          <div class="select-cell">
            <span class="cell-lbl">申请单编号</span>
            <el-input v-model="applyIdQuery" placeholder="输入申请单编号" style="width: 200px" clearable />
          </div>
        </div>
        <div class="action-trigger-row">
          <el-button type="primary" class="btn-primary-blue" :icon="Search" @click="handleSearch">搜索</el-button>
        </div>
      </div>

      <div class="console-table-wrapper" style="margin-top: 16px;">
        <el-table 
          :data="filteredApplyData" 
          style="width: 100%"
          :header-cell-style="{ background: '#F7F8FA', color: '#1D2129', fontWeight: '500' }"
        >
          <el-table-column prop="applyId" label="申请单编号" min-width="180">
            <template #default="scope">
              <span class="table-interactive-blue-lbl" @click="goToDetail(scope.row)">{{ scope.row.applyId }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="applicant" label="申请人" width="110" />
          <el-table-column prop="price" label="金额" width="100" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <span class="orange-pending-status-node">
                <span class="dot-blink-inner">●</span> {{ scope.row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="applyTime" label="申请时间" width="170" />
          <el-table-column prop="updateTime" label="更新时间" width="170" />
          <el-table-column label="操作" fixed="right" width="80">
            <template #default="scope">
              <span class="table-action-trigger-lbl" @click="goToDetail(scope.row)">详情</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-footer-flex-row">
          <el-pagination :total="filteredApplyData.length" :current-page="1" :page-size="10" layout="total, prev, pager, next, jumper" />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="resource-filter-complex-bar">
        <div class="complex-grid-inputs">
          <div class="filter-item-node">
            <span class="node-lbl">到期时间</span>
            <el-select v-model="resourceFilters.expireTime" placeholder="全部" style="width: 150px" clearable>
              <el-option label="近一周到期" value="week" />
              <el-option label="近一个月到期" value="month" />
              <el-option label="已到期" value="expired" />
            </el-select>
          </div>

          <div class="filter-item-node">
            <span class="node-lbl">资源类型</span>
            <el-select v-model="resourceFilters.resourceType" placeholder="裸金属" style="width: 150px" clearable>
              <el-option label="裸金属" value="BMS" />
              <el-option label="云主机" value="ECS" />
              <el-option label="容器" value="CONTAINER" />
            </el-select>
          </div>

          <div class="filter-item-node">
            <span class="node-lbl">实例名称/ID</span>
            <el-input v-model="resourceFilters.keyword" placeholder="请输入" style="width: 220px" clearable />
          </div>
        </div>
        
        <div class="resource-action-trigger-group">
          <div class="left-batch-btns">
            <el-button v-if="isRenewView" type="primary" class="btn-primary-blue" :disabled="selectedResourceRows.length === 0" @click="handleBatchRenew">
              批量续费
            </el-button>
            <el-button v-if="isQuitView" type="danger" class="btn-danger-red" :disabled="selectedResourceRows.length === 0" @click="handleBatchQuit">
              批量退订
            </el-button>
          </div>
          <div class="right-query-btns">
            <el-button :icon="Refresh" @click="resetResourceFilters">重置</el-button>
            <el-button type="primary" class="btn-primary-blue" :icon="Search" @click="searchResources">查询</el-button>
          </div>
        </div>
      </div>

      <div class="console-table-wrapper" style="margin-top: 16px;">
        <el-table 
          :data="mockResourceData" 
          style="width: 100%"
          @selection-change="handleResourceSelectionChange"
          :header-cell-style="{ background: '#F7F8FA', color: '#1D2129', fontWeight: '500' }"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="instanceId" label="实例ID/名称" min-width="180" />
          <el-table-column prop="type" label="资源类型" width="120" />
          <el-table-column prop="configuration" label="配置规范" min-width="200" show-overflow-tooltip />
          <el-table-column prop="expireDate" label="到期时间" width="170" />
          <el-table-column label="操作" fixed="right" width="100">
            <template #default="scope">
              <span v-if="isRenewView" class="table-action-trigger-lbl" @click="handleSingleRenew(scope.row)">续费</span>
              <span v-if="isQuitView" class="table-action-trigger-danger-lbl" @click="handleSingleQuit(scope.row)">退订</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-footer-flex-row">
          <el-pagination :total="mockResourceData.length" :current-page="1" :page-size="10" layout="total, prev, pager, next, jumper" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// ==================== 我的申请页控制状态 ====================
const activeStatusSelect = ref('待审批')
const applyIdQuery = ref('')

const isApplyOrderView = computed(() => route.path.includes('apply'))
const isRenewView = computed(() => route.path.includes('renew'))
const isQuitView = computed(() => route.path.includes('quit'))

const applyRawList = ref([
  { applyId: 'RA202605311246282536', applicant: '张海洋', price: '0.00', status: '待审批', applyTime: '2026-05-31 12:46:28', updateTime: '2026-05-31 12:46:28' },
  { applyId: 'RA202605291126404900', applicant: '张海洋', price: '0.00', status: '待审批', applyTime: '2026-05-29 11:26:40', updateTime: '2026-05-29 11:26:40' },
  { applyId: 'RA202605291119310432', applicant: '张海洋', price: '0.00', status: '待审批', applyTime: '2026-05-29 11:19:31', updateTime: '2026-05-29 11:19:31' },
  { applyId: 'RA202605291108592469', applicant: '张海洋', price: '0.00', status: '待审批', applyTime: '2026-05-29 11:08:59', updateTime: '2026-05-29 11:08:59' }
])

const filteredApplyData = computed(() => {
  return applyRawList.value.filter(item => {
    return (!activeStatusSelect.value || item.status === activeStatusSelect.value) &&
           (!applyIdQuery.value || item.applyId.includes(applyIdQuery.value))
  })
})

const handleSearch = () => { 
  ElMessage.success('订购工单清单载入完成') 
}

const goToDetail = (row: any) => {
  router.push({
    path: '/console/apply-detail',
    query: {
      applyId: row.applyId,
      applicant: row.applicant,
      applyTime: row.applyTime,
      price: row.price
    }
  })
}

// ==================== 资源续费(图一) & 资源退订(图二) 核心控制逻辑 ====================
const resourceFilters = ref({
  expireTime: '',
  resourceType: 'BMS',
  keyword: ''
})

const selectedResourceRows = ref<any[]>([])

// 模拟表格内的可续费/可退订资源矩阵
const mockResourceData = ref([
  { instanceId: 'ins-bms-01 (阿里公云-昆仑200)', type: '裸金属', configuration: '1核 1GB | KUNLUNXIN GPU-R200 * 1 | 32GB显存', expireDate: '2026-07-15 23:59:59' },
  { instanceId: 'ins-bms-02 (腾讯云-澎湃弹性级)', type: '裸金属', configuration: '8核 32GB | NVIDIA A100 * 2 | 80GB显存', expireDate: '2026-06-20 12:00:00' }
])

const handleResourceSelectionChange = (val: any[]) => {
  selectedResourceRows.value = val
}

const resetResourceFilters = () => {
  resourceFilters.value = { expireTime: '', resourceType: '', keyword: '' }
  ElMessage.info('筛选条件已重置')
}

const searchResources = () => {
  ElMessage.success('已根据条件过滤最新智算资源列表')
}

// 图一交互逻辑：批量与单项续费
const handleBatchRenew = () => {
  ElMessage.success(`已为选中的 ${selectedResourceRows.value.length} 项资源提交批量续费申请`)
}
const handleSingleRenew = (row: any) => {
  ElMessage.success(`成功拉起实例 [${row.instanceId}] 的单项续费收银台`)
}

// 图二交互逻辑：批量与单项退订
const handleBatchQuit = () => {
  ElMessageBox.confirm(`确定要批量退订选中的 ${selectedResourceRows.value.length} 项智算资源吗？退订后服务将停止。`, '警告', {
    confirmButtonText: '确定退订',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量退订指令已下发')
  })
}
const handleSingleQuit = (row: any) => {
  ElMessageBox.confirm(`确定要退订实例 [${row.instanceId}] 吗？`, '资源退订确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('退订申请处理中')
  })
}

// 路由监听：页面切换时洗空所有过滤器状态与复选快照
watch(() => route.path, () => {
  applyIdQuery.value = ''
  activeStatusSelect.value = '待审批'
  resetResourceFilters()
  selectedResourceRows.value = []
})
</script>

<style scoped>
.console-card-container { background: #ffffff; padding: 20px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,21,41,.03); }

/* 我的申请头部样式 */
.order-action-filter-header-bar { display: flex; justify-content: space-between; align-items: center; background-color: #FAFAFA; padding: 12px 20px; border-radius: 4px; }
.filter-flex-inputs { display: flex; gap: 24px; }
.select-cell { display: flex; align-items: center; gap: 10px; }
.cell-lbl { font-size: 14px; color: #4E5969; }

/* 🚀 补全与还原：图一、图二通用的高级卡片式多条件搜索框样式 */
.resource-filter-complex-bar { background-color: #FAFAFA; border: 1px solid #E5E6EB; border-radius: 4px; padding: 16px 20px; display: flex; flex-direction: column; gap: 16px; }
.complex-grid-inputs { display: flex; flex-wrap: wrap; gap: 24px 40px; align-items: center; }
.filter-item-node { display: flex; align-items: center; gap: 12px; }
.node-lbl { font-size: 14px; color: #4E5969; font-weight: 400; white-space: nowrap; }

/* 按钮底栏布局规范 */
.resource-action-trigger-group { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #E5E6EB; padding-top: 14px; }
.left-batch-btns { display: flex; gap: 12px; }
.right-query-btns { display: flex; gap: 12px; }

/* 按钮通用色值重塑 */
.btn-primary-blue { background-color: #1677FF !important; border-color: #1677FF !important; }
.btn-danger-red { background-color: #F53F3F !important; border-color: #F53F3F !important; color: #ffffff !important; }

/* 表格互动标签 */
.table-interactive-blue-lbl { color: #1677FF; cursor: pointer; font-weight: 500; }
.table-interactive-blue-lbl:hover { text-decoration: underline; }
.table-action-trigger-lbl { color: #1677FF; cursor: pointer; font-size: 14px; margin-right: 12px; }
.table-action-trigger-lbl:hover { color: #4096ff; }
.table-action-trigger-danger-lbl { color: #F53F3F; cursor: pointer; font-size: 14px; }
.table-action-trigger-danger-lbl:hover { color: #ff7875; }

/* 状态标签 */
.orange-pending-status-node { color: #FAAD14; font-size: 13px; display: inline-flex; align-items: center; gap: 4px; font-weight: 400; }
.dot-blink-inner { font-size: 10px; }

.pagination-footer-flex-row { display: flex; justify-content: flex-end; padding-top: 20px; }
</style>