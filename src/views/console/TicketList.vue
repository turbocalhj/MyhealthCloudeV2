<template>
  <div class="console-ticket-management-workspace">
    
    <div class="filter-search-panel-card">
      <el-form :inline="true" :model="filterForm" class="filter-inline-form" size="default">
        
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.timeRange"
            type="daterange"
            range-separator="→"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="standard-form-width-date"
          />
        </el-form-item>

        <el-form-item label="工单编号">
          <el-input v-model="filterForm.ticketId" placeholder="请输入工单编号" clearable class="standard-form-width" />
        </el-form-item>

        <el-form-item label="工单类型">
          <el-select v-model="filterForm.ticketType" placeholder="请选择类型" clearable class="standard-form-width">
            <el-option label="咨询工单" value="咨询工单" />
            <el-option label="运维工单" value="运维工单" />
            <el-option label="故障工单" value="故障工单" />
          </el-select>
        </el-form-item>

        <el-form-item label="工单标题">
          <el-input v-model="filterForm.title" placeholder="请输入工单标题" clearable class="standard-form-width" />
        </el-form-item>

        <el-form-item label="工单状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable class="standard-form-width">
            <el-option label="待处理" value="待处理" />
            <el-option label="处理中" value="处理中" />
            <el-option label="转派待接收" value="转派待接收" />
            <el-option label="已关闭" value="已关闭" />
            <el-option label="已撤回" value="已撤回" />
            <el-option label="待客户反馈" value="待客户反馈" />
          </el-select>
        </el-form-item>

        <el-form-item class="filter-actions-form-item">
          <el-button type="primary" class="action-search-primary-btn" @click="handleSearch">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button class="action-reset-plain-btn" @click="handleReset">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </el-form-item>

      </el-form>
    </div>

    <div class="data-table-container-card">
      
      <div class="table-top-bar-actions">
        <el-button type="primary" class="table-create-ticket-action-btn" @click="goToCreateTicket">
          <el-icon class="plus-icon-margin"><Plus /></el-icon> 创建工单
        </el-button>
      </div>

      <el-table 
        :data="paginatedTableData" 
        style="width: 100%" 
        size="default"
        class="custom-clean-data-table"
        :header-cell-style="{ background: '#F7F8FA', color: '#1D2129', fontWeight: '500', height: '44px', padding: '0' }"
      >
        <el-table-column prop="ticketId" label="工单编号" width="200" />
        
        <el-table-column prop="title" label="工单标题" min-width="180">
          <template #default="scope">
            <span class="interactive-blue-link-lbl" @click="handleDetail(scope.row)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="ticketType" label="工单类型" width="120" />
        
        <el-table-column prop="status" label="状态" width="130">
          <template #default="scope">
            <span :class="['status-tag-pill-node', getStatusClass(scope.row.status)]">
              <span class="status-dot-inner">●</span> {{ scope.row.status }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column prop="reporter" label="提报人" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column prop="updateTime" label="更新时间" width="170" />
        
        <el-table-column label="操作" fixed="right" width="130">
          <template #default="scope">
            <div class="table-actions-inline-flex">
              <span class="action-link-btn" @click="handleDetail(scope.row)">详情</span>
              
              <span v-if="scope.row.status === '待处理'" class="action-link-btn warning-lbl" @click="handleCancel(scope.row)">撤回</span>
              <span v-else-if="scope.row.status === '已撤回'" class="action-link-btn danger-lbl" @click="handleDelete(scope.row)">删除</span>
              <span v-else class="action-link-btn info-lbl" @click="handleClose(scope.row)">关闭</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pagination-footer-row">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="totalRecords"
          layout="total, prev, pager, next, sizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 检索筛选表单层响应式变量
const filterForm = ref({
  timeRange: null,
  ticketId: '',
  ticketType: '',
  title: '',
  status: ''
})

// 分页元数据
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(35)

// 100% 深度克隆图一原始快照真实数据集
const tableRawDataset = ref([
  { ticketId: 'WA202604180043013110', title: '故障咨询', ticketType: '故障工单', status: '转派待接收', reporter: '张海洋', createTime: '2026-04-18 00:43:01', updateTime: '2026-04-18 00:43:40' },
  { ticketId: 'WA202604121219522077', title: 'ceshi09328e4032', ticketType: '资源类工单', status: '已撤回', reporter: '张海洋', createTime: '2026-04-12 12:19:52', updateTime: '2026-04-12 12:20:04' },
  { ticketId: 'WA202604121209139291', title: '测试1239210', ticketType: '运维工单', status: '已关闭', reporter: '张海洋', createTime: '2026-04-12 12:09:13', updateTime: '2026-04-12 12:15:58' },
  { ticketId: 'WA202604121115338543', title: '计费咨询', ticketType: '资源类工单', status: '处理中', reporter: '张海洋', createTime: '2026-04-12 11:53:38', updateTime: '2026-04-12 12:10:02' },
  { ticketId: 'WA202604112244432474', title: '工单提报', ticketType: '资源类工单', status: '待客户反馈', reporter: '张海洋', createTime: '2026-04-11 22:44:43', updateTime: '2026-04-12 14:14:57' },
  { ticketId: 'WA202604112243402075', title: '工单提报', ticketType: '资源类工单', status: '待客户反馈', reporter: '张海洋', createTime: '2026-04-11 22:43:40', updateTime: '2026-04-13 11:48:39' },
  { ticketId: 'WA202604112242111820', title: '工单提报', ticketType: '资源类工单', status: '待客户反馈', reporter: '张海洋', createTime: '2026-04-11 22:42:11', updateTime: '2026-04-13 11:50:43' },
  { ticketId: 'WA202604112241430805', title: '工单提报', ticketType: '资源类工单', status: '处理中', reporter: '张海洋', createTime: '2026-04-11 22:41:43', updateTime: '2026-04-15 20:17:23' },
  { ticketId: 'WA202604112239401742', title: '工单提报', ticketType: '资源类工单', status: '处理中', reporter: '张海洋', createTime: '2026-04-11 22:39:40', updateTime: '2026-04-23 15:51:01' },
  { ticketId: 'WA202604112239050107', title: '工单提报', ticketType: '资源类工单', status: '待处理', reporter: '张海洋', createTime: '2026-04-11 22:39:05', updateTime: '2026-04-11 22:39:04' }
])

// 用于支撑本地模拟检索过滤计算机制
const filteredTableData = computed(() => {
  return tableRawDataset.value.filter(item => {
    const matchId = !filterForm.value.ticketId || item.ticketId.includes(filterForm.value.ticketId)
    const matchType = !filterForm.value.ticketType || item.ticketType === filterForm.value.ticketType
    const matchTitle = !filterForm.value.title || item.title.includes(filterForm.value.title)
    const matchStatus = !filterForm.value.status || item.status === filterForm.value.status
    return matchId && matchType && matchTitle && matchStatus
  })
})

// 分页截取处理
const paginatedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTableData.value.slice(start, end)
})

// 依据状态字符串映射对应图一的实色外圈样式类名
const getStatusClass = (status: string) => {
  switch (status) {
    case '转派待接收': return 'status-transfer-wait'
    case '已撤回': return 'status-withdrawn'
    case '已关闭': return 'status-closed'
    case '处理中': return 'status-processing'
    case '待客户反馈': return 'status-client-feedback'
    case '待处理': return 'status-pending'
    default: return ''
  }
}

// 核心业务行为方法流转
const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('筛选过滤条件载入成功')
}

const handleReset = () => {
  filterForm.value = { timeRange: null, ticketId: '', ticketType: '', title: '', status: '' }
  currentPage.value = 1
}

// 跳转到图二页面
const goToCreateTicket = () => {
  router.push('/console/ticket-create')
}

const handleDetail = (row: any) => {
  ElMessage.info(`正在调取工单详情: ${row.ticketId}`)
}

const handleCancel = (row: any) => {
  ElMessageBox.confirm(`确定要撤回工单 ${row.title} 吗？`, '安全风险核验').then(() => {
    row.status = '已撤回'
    ElMessage.success('工单撤回成功')
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要永久清空该条工单提报记录吗？', '警示核验', { type: 'warning' }).then(() => {
    tableRawDataset.value = tableRawDataset.value.filter(item => item.ticketId !== row.ticketId)
    ElMessage.success('工单删除成功')
  })
}

const handleClose = (row: any) => {
  row.status = '已关闭'
  ElMessage.info('工单强制变更为关闭终止态')
}

const handleSizeChange = (val: number) => { pageSize.value = val }
const handleCurrentChange = (val: number) => { currentPage.value = val }
</script>

<style scoped>
/* ==========================================================================
   全局工作空间板式
   ========================================================================== */
.console-ticket-management-workspace {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}

/* ==========================================================================
   1. 高级检索卡片盒样式区
   ========================================================================== */
.filter-search-panel-card {
  background-color: #ffffff;
  padding: 20px 24px 4px 24px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03);
}

.filter-inline-form {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 0px;
}

:deep(.el-form-item) {
  margin-right: 28px !important;
  margin-bottom: 16px !important;
  display: flex;
  align-items: center;
}

:deep(.el-form-item__label) {
  font-size: 14px !important;
  color: #4E5969 !important;
  font-weight: 400 !important;
  padding-right: 12px !important;
}

.standard-form-width {
  width: 200px !important;
}

.standard-form-width-date {
  width: 260px !important;
}

/* 按钮位置排版机制 */
.filter-actions-form-item {
  margin-left: auto;
  margin-right: 0 !important;
}

.action-search-primary-btn {
  background-color: #1677FF !important;
  border-color: #1677FF !important;
}

.action-search-primary-btn:hover {
  background-color: #4096ff !important;
}

/* ==========================================================================
   2. 数据表格底层卡片区（包含图一的高质感 Badge 标签）
   ========================================================================== */
.data-table-container-card {
  background-color: #ffffff;
  padding: 20px 24px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03);
  display: flex;
  flex-direction: column;
}

.table-top-bar-actions {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-start;
}

.table-create-ticket-action-btn {
  background-color: #1677FF !important;
  border-color: #1677FF !important;
  font-size: 14px !important;
  padding: 8px 16px !important;
  height: 34px;
}

.plus-icon-margin {
  margin-right: 4px;
}

/* 纯净简洁风格 Element Plus 边框及单元格定制 */
.custom-clean-data-table {
  font-size: 14px;
  color: #1D2129;
}

:deep(.el-table__row) {
  height: 48px;
}

.interactive-blue-link-lbl {
  color: #1677FF;
  cursor: pointer;
  user-select: none;
}

.interactive-blue-link-lbl:hover {
  text-decoration: underline;
}

/* --------------------------------------------------------------------------
   图一核心高保真还原：状态标签外圈实线色块架构
   -------------------------------------------------------------------------- */
.status-tag-pill-node {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}

.status-dot-inner {
  font-size: 8px;
}

/* 转派待接收（浅紫） */
.status-transfer-wait {
  background-color: #F5EEFF;
  color: #722ED1;
  border: 1px solid #D3ADF7;
}

/* 已撤回（淡粉） */
.status-withdrawn {
  background-color: #FFF0F6;
  color: #EB2F96;
  border: 1px solid #FFADD2;
}

/* 已关闭（浅灰） */
.status-closed {
  background-color: #F5F5F5;
  color: #595959;
  border: 1px solid #D9D9D9;
}

/* 处理中（明黄） */
.status-processing {
  background-color: #FFFBE6;
  color: #D46B08;
  border: 1px solid #FFE7BA;
}

/* 待客户反馈（橙黄） */
.status-client-feedback {
  background-color: #FFF7E6;
  color: #D46B08;
  border: 1px solid #FFD591;
}

/* 待处理（纯蓝） */
.status-pending {
  background-color: #E6F7FF;
  color: #1D5BFF;
  border: 1px solid #91D5FF;
}

/* --------------------------------------------------------------------------
   操作动作流超轻量化链接链
   -------------------------------------------------------------------------- */
.table-actions-inline-flex {
  display: flex;
  align-items: center;
  gap: 14px;
}

.action-link-btn {
  color: #1677FF;
  cursor: pointer;
  user-select: none;
}

.action-link-btn:hover {
  color: #4096ff;
}

.warning-lbl { color: #E6A23C; }
.warning-lbl:hover { color: #f3b755; }

.danger-lbl { color: #F53F3F; }
.danger-lbl:hover { color: #ff6363; }

.info-lbl { color: #86909C; }
.info-lbl:hover { color: #a9b4c3; }

/* 分页 */
.table-pagination-footer-row {
  display: flex;
  justify-content: flex-end;
  padding-top: 18px;
}
</style>