<template>
  <div class="console-ticket-management-workspace">

    <!-- 工单统计面板 -->
    <div class="ticket-stats-overview-panel">
      <div class="stat-card-item">
        <div class="stat-icon-wrapper bg-blue">
          <el-icon :size="24"><Tickets /></el-icon>
        </div>
        <div class="stat-content-info">
          <div class="stat-label-text">工单总数</div>
          <div class="stat-value-number">{{ totalTickets }}</div>
        </div>
      </div>
      <div class="stat-card-item">
        <div class="stat-icon-wrapper bg-orange">
          <el-icon :size="24"><Clock /></el-icon>
        </div>
        <div class="stat-content-info">
          <div class="stat-label-text">待处理</div>
          <div class="stat-value-number">{{ pendingTickets }}</div>
          <div class="stat-trend-text">需关注</div>
        </div>
      </div>
      <div class="stat-card-item">
        <div class="stat-icon-wrapper bg-green">
          <el-icon :size="24"><Loading /></el-icon>
        </div>
        <div class="stat-content-info">
          <div class="stat-label-text">处理中</div>
          <div class="stat-value-number">{{ processingTickets }}</div>
          <div class="stat-trend-text">跟进中</div>
        </div>
      </div>
      <div class="stat-card-item">
        <div class="stat-icon-wrapper bg-red">
          <el-icon :size="24"><WarningFilled /></el-icon>
        </div>
        <div class="stat-content-info">
          <div class="stat-label-text">高优先级</div>
          <div class="stat-value-number">{{ highPriorityTickets }}</div>
          <div class="stat-trend-text warning-text">紧急</div>
        </div>
      </div>
    </div>

    <!-- 工单模板快捷面板 -->
    <div class="ticket-template-quick-panel">
      <div class="template-panel-header-row">
        <span class="panel-title-text">
          <el-icon><Collection /></el-icon>
          工单模板
        </span>
        <el-button size="small" type="primary" plain @click="goToCreateTicket">
          <el-icon><Plus /></el-icon> 新建工单
        </el-button>
      </div>
      <div class="template-cards-list">
        <div v-for="tpl in ticketTemplates" :key="tpl.id" class="template-item-card" @click="useTemplate(tpl)">
          <div class="template-item-header">
            <span class="template-item-name">{{ tpl.name }}</span>
            <el-tag size="small" :type="getTemplateTypeTag(tpl.type)" effect="plain">{{ tpl.type }}</el-tag>
          </div>
          <p class="template-item-desc">{{ tpl.desc }}</p>
        </div>
      </div>
    </div>

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

        <el-form-item label="优先级">
          <el-select v-model="filterForm.priority" placeholder="请选择优先级" clearable class="standard-form-width">
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>

        <el-form-item class="filter-actions-form-item">
          <el-button type="primary" class="action-search-primary-btn" @click="handleSearch">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button class="action-reset-plain-btn" @click="handleReset">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
          <el-button class="action-export-plain-btn" @click="handleExport">
            <el-icon><Download /></el-icon> 导出
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
        :header-cell-style="{ background: '#F7F8FA', color: '#1D2129', fontWeight: '500', height: '44px' }"
      >
        <el-table-column prop="ticketId" label="工单编号" width="200" />
        
        <el-table-column prop="title" label="工单标题" min-width="180">
          <template #default="scope">
            <span class="interactive-blue-link-lbl" @click="handleDetail(scope.row)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="ticketType" label="工单类型" width="120" />

        <el-table-column prop="priority" label="优先级" width="90">
          <template #default="scope">
            <span :class="['priority-tag-pill-node', getPriorityClass(scope.row.priority)]">
              <el-icon v-if="scope.row.priority === '高'" class="priority-warn-icon"><WarningFilled /></el-icon>
              {{ scope.row.priority }}
            </span>
          </template>
        </el-table-column>

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
              <span v-else-if="scope.row.status !== '已关闭'" class="action-link-btn info-lbl" @click="handleClose(scope.row)">关闭</span>
              <span v-else class="action-link-btn finished-disabled-lbl">--</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pagination-footer-row">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredTableData.length"
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
import { Search, Refresh, Plus, Tickets, Clock, Loading, WarningFilled, Download, Collection } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const filterForm = ref({
  timeRange: null,
  ticketId: '',
  ticketType: '',
  title: '',
  status: '',
  priority: ''
})

const currentPage = ref(1)
const pageSize = ref(10)

// 完美反填图一原始工单数据集矩阵
const tableRawDataset = ref([
  { ticketId: 'WA202604180043013110', title: '故障咨询', ticketType: '故障工单', priority: '高', status: '转派待接收', reporter: '张海洋', createTime: '2026-04-18 00:43:01', updateTime: '2026-04-18 00:43:40' },
  { ticketId: 'WA202604121219522077', title: 'ceshi09328e4032', ticketType: '资源类工单', priority: '低', status: '已撤回', reporter: '张海洋', createTime: '2026-04-12 12:19:52', updateTime: '2026-04-12 12:20:04' },
  { ticketId: 'WA202604121209139291', title: '测试1239210', ticketType: '运维工单', priority: '中', status: '已关闭', reporter: '张海洋', createTime: '2026-04-12 12:09:13', updateTime: '2026-04-12 12:15:58' },
  { ticketId: 'WA202604121115338543', title: '计费咨询', ticketType: '资源类工单', priority: '中', status: '处理中', reporter: '张海洋', createTime: '2026-04-12 11:53:38', updateTime: '2026-04-12 12:10:02' },
  { ticketId: 'WA202604112244432474', title: '工单提报', ticketType: '资源类工单', priority: '高', status: '待客户反馈', reporter: '张海洋', createTime: '2026-04-11 22:44:43', updateTime: '2026-04-12 14:14:57' },
  { ticketId: 'WA202604112243402075', title: '工单提报', ticketType: '资源类工单', priority: '中', status: '待客户反馈', reporter: '张海洋', createTime: '2026-04-11 22:43:40', updateTime: '2026-04-13 11:48:39' },
  { ticketId: 'WA202604112242111820', title: '工单提报', ticketType: '资源类工单', priority: '中', status: '待客户反馈', reporter: '张海洋', createTime: '2026-04-11 22:42:11', updateTime: '2026-04-13 11:50:43' },
  { ticketId: 'WA202604112241430805', title: '工单提报', ticketType: '资源类工单', priority: '高', status: '处理中', reporter: '张海洋', createTime: '2026-04-11 22:41:43', updateTime: '2026-04-15 20:17:23' },
  { ticketId: 'WA202604112239401742', title: '工单提报', ticketType: '资源类工单', priority: '中', status: '处理中', reporter: '张海洋', createTime: '2026-04-11 22:39:40', updateTime: '2026-04-23 15:51:01' },
  { ticketId: 'WA202604112239050107', title: '工单提报', ticketType: '资源类工单', priority: '低', status: '待处理', reporter: '张海洋', createTime: '2026-04-11 22:39:05', updateTime: '2026-04-11 22:39:04' }
])

// 工单模板
const ticketTemplates = ref([
  { id: 1, name: '服务器故障报修', type: '故障工单', desc: '适用于服务器宕机、网络异常等紧急故障提报' },
  { id: 2, name: '资源申请', type: '资源类工单', desc: '申请新资源、扩容或调整资源配置' },
  { id: 3, name: '技术咨询', type: '咨询工单', desc: '产品功能、使用方式等技术问题咨询' },
  { id: 4, name: '运维协助', type: '运维工单', desc: '需要运维人员协助处理的操作请求' }
])

// 统计计算属性
const totalTickets = computed(() => tableRawDataset.value.length)
const pendingTickets = computed(() => tableRawDataset.value.filter(t => t.status === '待处理').length)
const processingTickets = computed(() => tableRawDataset.value.filter(t => t.status === '处理中').length)
const highPriorityTickets = computed(() => tableRawDataset.value.filter(t => t.priority === '高' && t.status !== '已关闭').length)

const filteredTableData = computed(() => {
  return tableRawDataset.value.filter(item => {
    const matchId = !filterForm.value.ticketId || item.ticketId.includes(filterForm.value.ticketId)
    const matchType = !filterForm.value.ticketType || item.ticketType === filterForm.value.ticketType
    const matchTitle = !filterForm.value.title || item.title.includes(filterForm.value.title)
    const matchStatus = !filterForm.value.status || item.status === filterForm.value.status
    const matchPriority = !filterForm.value.priority || item.priority === filterForm.value.priority
    return matchId && matchType && matchTitle && matchStatus && matchPriority
  })
})

const paginatedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredTableData.value.slice(start, start + pageSize.value)
})

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

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case '高': return 'priority-high-tag'
    case '中': return 'priority-medium-tag'
    case '低': return 'priority-low-tag'
    default: return ''
  }
}

const getTemplateTypeTag = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    '故障工单': 'danger',
    '资源类工单': 'primary',
    '咨询工单': 'info',
    '运维工单': 'success'
  }
  return map[type] || 'info'
}

// 使用模板跳转到创建页
const useTemplate = (tpl: any) => {
  router.push({
    path: '/console/ticket-create',
    query: {
      templateType: tpl.type,
      templateName: tpl.name,
      templateDesc: tpl.desc
    }
  })
}

// 导出工单列表
const handleExport = () => {
  if (filteredTableData.value.length === 0) {
    ElMessage.warning('暂无可导出的工单数据')
    return
  }
  const headers = ['工单编号', '标题', '类型', '优先级', '状态', '提报人', '创建时间', '更新时间']
  const rows = filteredTableData.value.map((item: any) => [
    item.ticketId, item.title, item.ticketType, item.priority, item.status, item.reporter, item.createTime, item.updateTime
  ])
  const csvContent = [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n')
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `工单导出_${new Date().toLocaleDateString()}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success(`已成功导出 ${filteredTableData.value.length} 条工单`)
}

const handleSearch = () => { currentPage.value = 1; ElMessage.success('筛选过滤条件载入成功') }
const handleReset = () => { filterForm.value = { timeRange: null, ticketId: '', ticketType: '', title: '', status: '', priority: '' }; currentPage.value = 1 }
const goToCreateTicket = () => { router.push('/console/ticket-create') }

// 🚀 核心改动 1：详情动作流，携带 Query 精准下沉跳转图二页面
const handleDetail = (row: any) => {
  router.push({
    path: '/console/ticket-detail',
    query: {
      ticketId: row.ticketId,
      title: row.title,
      ticketType: row.ticketType,
      status: row.status,
      createTime: row.createTime
    }
  })
}

// 🚀 核心改动 2：完美实现图一遮罩式“关闭确认”弹窗提示与状态切换
const handleClose = (row: any) => {
  ElMessageBox.confirm(
    `确定要关闭工单【${row.ticketId}】吗？关闭后将无法继续处理。`,
    '关闭确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      confirmButtonClass: 'el-button--warning',
      type: 'warning',
      customClass: 'custom-confirm-box-style'
    }
  ).then(() => {
    row.status = '已关闭'
    ElMessage({
      message: '工单已关闭',
      type: 'success',
      duration: 3000
    })
  }).catch(() => {
    // 点击取消不做处理
  })
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

const handleSizeChange = (val: number) => { pageSize.value = val; currentPage.value = 1 }
const handleCurrentChange = (val: number) => { currentPage.value = val }
</script>

<style scoped>
.console-ticket-management-workspace { display: flex; flex-direction: column; gap: 16px; width: 100%; box-sizing: border-box; }

/* ==========================================================================
   工单统计面板
   ========================================================================== */
.ticket-stats-overview-panel {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03);
  transition: all 0.3s ease;
}

.stat-card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 21, 41, 0.08);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.stat-icon-wrapper.bg-blue { background: linear-gradient(135deg, #1677FF 0%, #4096FF 100%); }
.stat-icon-wrapper.bg-orange { background: linear-gradient(135deg, #FA8C16 0%, #FFC069 100%); }
.stat-icon-wrapper.bg-green { background: linear-gradient(135deg, #52C41A 0%, #95DE64 100%); }
.stat-icon-wrapper.bg-red { background: linear-gradient(135deg, #F5222D 0%, #FF7875 100%); }

.stat-content-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label-text { font-size: 13px; color: #86909C; }
.stat-value-number { font-size: 24px; font-weight: 700; color: #1D2129; line-height: 1; }
.stat-trend-text { font-size: 12px; color: #52C41A; }
.stat-trend-text.warning-text { color: #FA8C16; }

/* ==========================================================================
   工单模板快捷面板
   ========================================================================== */
.ticket-template-quick-panel {
  background-color: #ffffff;
  padding: 20px 24px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03);
}

.template-panel-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.panel-title-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1D2129;
}

.template-cards-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.template-item-card {
  border: 1px solid #E5E6EB;
  border-radius: 8px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #FAFBFC;
}

.template-item-card:hover {
  border-color: #1677FF;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.1);
  transform: translateY(-2px);
}

.template-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.template-item-name { font-size: 14px; font-weight: 600; color: #1D2129; }
.template-item-desc { font-size: 12px; color: #86909C; line-height: 1.5; margin: 0; }

/* ==========================================================================
   原有样式保持不变
   ========================================================================== */
.filter-search-panel-card { background-color: #ffffff; padding: 20px 24px 4px 24px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03); }
.filter-inline-form { display: flex; flex-wrap: wrap; gap: 4px 0px; }
:deep(.el-form-item) { margin-right: 28px !important; margin-bottom: 16px !important; display: flex; align-items: center; }
:deep(.el-form-item__label) { font-size: 14px !important; color: #4E5969 !important; font-weight: 400 !important; padding-right: 12px !important; }
.standard-form-width { width: 200px !important; }
.standard-form-width-date { width: 260px !important; }
.filter-actions-form-item { margin-left: auto; margin-right: 0 !important; }
.action-search-primary-btn { background-color: #1677FF !important; border-color: #1677FF !important; }
.action-export-plain-btn { border-color: #52C41A !important; color: #52C41A !important; }

.data-table-container-card { background-color: #ffffff; padding: 20px 24px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03); display: flex; flex-direction: column; }
.table-top-bar-actions { margin-bottom: 16px; display: flex; justify-content: flex-start; }
.table-create-ticket-action-btn { background-color: #1677FF !important; border-color: #1677FF !important; font-size: 14px !important; padding: 8px 16px !important; height: 34px; }
.plus-icon-margin { margin-right: 4px; }
.custom-clean-data-table { font-size: 14px; color: #1D2129; }
:deep(.el-table__row) { height: 48px; }
.interactive-blue-link-lbl { color: #1677FF; cursor: pointer; user-select: none; font-weight: 500; }
.interactive-blue-link-lbl:hover { text-decoration: underline; }

/* 状态标签外圈实线色块架构 */
.status-tag-pill-node { display: inline-flex; align-items: center; gap: 6px; padding: 2px 10px; border-radius: 12px; font-size: 12px; line-height: 18px; }
.status-dot-inner { font-size: 8px; }
.status-transfer-wait { background-color: #F5EEFF; color: #722ED1; border: 1px solid #D3ADF7; }
.status-withdrawn { background-color: #FFF0F6; color: #EB2F96; border: 1px solid #FFADD2; }
.status-closed { background-color: #F5F5F5; color: #595959; border: 1px solid #D9D9D9; }
.status-processing { background-color: #FFFBE6; color: #D46B08; border: 1px solid #FFE7BA; }
.status-client-feedback { background-color: #FFF7E6; color: #D46B08; border: 1px solid #FFD591; }
.status-pending { background-color: #E6F7FF; color: #1D5BFF; border: 1px solid #91D5FF; }

/* 优先级标签 */
.priority-tag-pill-node { display: inline-flex; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 12px; font-size: 12px; line-height: 18px; }
.priority-warn-icon { font-size: 12px; }
.priority-high-tag { background-color: #FFF1F0; color: #F5222D; border: 1px solid #FFA39E; }
.priority-medium-tag { background-color: #FFFBE6; color: #D46B08; border: 1px solid #FFE7BA; }
.priority-low-tag { background-color: #F6FFED; color: #52C41A; border: 1px solid #B7EB8F; }

/* 操作动作按钮流 */
.table-actions-inline-flex { display: flex; align-items: center; gap: 14px; }
.action-link-btn { color: #1677FF; cursor: pointer; font-size: 14px; user-select: none; }
.action-link-btn:hover { color: #4096ff; }
.warning-lbl { color: #E6A23C; }
.danger-lbl { color: #F53F3F; }
.info-lbl { color: #86909C; }
.finished-disabled-lbl { color: #C9CDD4; cursor: not-allowed; font-size: 14px; }
.table-pagination-footer-row { display: flex; justify-content: flex-end; padding-top: 18px; }

/* 响应式 */
@media (max-width: 1200px) {
  .ticket-stats-overview-panel { grid-template-columns: repeat(2, 1fr); }
  .template-cards-list { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .ticket-stats-overview-panel { grid-template-columns: 1fr; }
  .template-cards-list { grid-template-columns: 1fr; }
}
</style>