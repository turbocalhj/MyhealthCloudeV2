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
          <el-pagination :total="265" :current-page="1" :page-size="10" layout="total, prev, pager, next, jumper" />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="order-empty-action-header-row">
        <div class="empty-top-mock-filters">
          <div class="mock-cell">到期时间 <el-select placeholder="全部" style="width: 120px" disabled /></div>
          <div class="mock-cell">资源类型 <el-select placeholder="裸金属" style="width: 120px" disabled /></div>
        </div>
        
        <div v-if="isRenewView" class="batch-renew-action-container">
          <el-button type="primary" class="btn-primary-blue" disabled>批量续费</el-button>
        </div>
      </div>

      <div class="empty-fullscreen-display-box">
        <el-empty description="暂无数据" :image-size="130" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const activeStatusSelect = ref('待审批')
const applyIdQuery = ref('')

// 动态路由计算机制：辨别是我的申请、资源续费还是资源退订
const isApplyOrderView = computed(() => route.path.includes('apply'))
const isRenewView = computed(() => route.path.includes('renew'))

// 历史提报申请快照数据矩阵
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

watch(() => route.path, () => {
  applyIdQuery.value = ''
  activeStatusSelect.value = '待审批'
})

const handleSearch = () => { 
  ElMessage.success('订购工单清单载入完成') 
}

// 🚀 新增页面跳转函数：将当前行的数据通过 query 传递给详情页
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
</script>

<style scoped>
.console-card-container { background: #ffffff; padding: 20px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,21,41,.03); }
.order-action-filter-header-bar { display: flex; justify-content: space-between; align-items: center; background-color: #FAFAFA; padding: 12px 20px; border-radius: 4px; }
.filter-flex-inputs { display: flex; gap: 24px; }
.select-cell { display: flex; align-items: center; gap: 10px; }
.cell-lbl { font-size: 14px; color: #4E5969; }
.btn-primary-blue { background-color: #1677FF !important; border-color: #1677FF !important; }
.table-interactive-blue-lbl { color: #1677FF; cursor: pointer; font-weight: 500; }
.table-interactive-blue-lbl:hover { text-decoration: underline; }
.table-action-trigger-lbl { color: #1677FF; cursor: pointer; font-size: 14px; }
.table-action-trigger-lbl:hover { color: #4096ff; }

/* 橙黄色圆点 “● 待审批” 状态标签排版规范 */
.orange-pending-status-node { color: #FAAD14; font-size: 13px; display: inline-flex; align-items: center; gap: 4px; font-weight: 400; }
.dot-blink-inner { font-size: 10px; }

/* 续费与退订布局 */
.order-empty-action-header-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid #F0F2F5; }
.empty-fullscreen-display-box { padding: 80px 0; display: flex; justify-content: center; align-items: center; width: 100%; }
.empty-top-mock-filters { display: flex; gap: 20px; font-size: 14px; color: #4E5969; }
.mock-cell { display: flex; align-items: center; gap: 8px; }
.pagination-footer-flex-row { display: flex; justify-content: flex-end; padding-top: 20px; }
</style>