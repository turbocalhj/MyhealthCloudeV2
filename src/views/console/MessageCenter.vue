<template>
  <div class="console-message-center-dashboard-layout">
    
    <div class="message-filter-card-box">
      <div class="filter-layout-fields-inline-row">
        <div class="field-item-cell">
          <span class="lbl-caption">消息分类</span>
          <el-select v-model="categoryFilter" placeholder="请选择消息分类" clearable style="width: 220px">
            <el-option label="合同" value="合同" />
            <el-option label="到期通知" value="到期通知" />
          </el-select>
        </div>
        <div class="field-item-cell">
          <span class="lbl-caption">状态</span>
          <el-select v-model="statusFilter" placeholder="请选择状态" clearable style="width: 220px">
            <el-option label="未读" value="未读" />
            <el-option label="已读" value="已读" />
          </el-select>
        </div>
        <div class="actions-flex-buttons-group">
          <el-button type="primary" class="btn-blue-search-action" :icon="Search" @click="handleFilterSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleFilterReset">重置</el-button>
        </div>
      </div>

      <div class="batch-manipulation-trigger-row">
        <el-button size="default" :disabled="selectedTableRows.length === 0" class="btn-plain-batch-read" @click="batchMarkAsRead">
          <el-icon class="icon-margin"><Check /></el-icon> 标记为已读
        </el-button>
        <el-button size="default" type="primary" plain class="btn-outline-all-read" @click="allMarkAsRead">
          <el-icon class="icon-margin"><Reading /></el-icon> 全部已读
        </el-button>
      </div>
    </div>

    <div class="message-table-canvas-card">
      <el-table 
        :data="paginatedMessageData" 
        style="width: 100%"
        size="default"
        @selection-change="handleTableSelectionChange"
        :header-cell-style="{ background: '#F7F8FA', color: '#1D2129', fontWeight: '500', height: '42px' }"
      >
        <el-table-column type="selection" width="50" />
        
        <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip>
          <template #default="scope">
            <span :class="['title-text-node', scope.row.status === '未读' ? 'is-unread-bold' : '']">
              {{ scope.row.title }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column prop="content" label="内容" min-width="360" show-overflow-tooltip />
        <el-table-column prop="category" label="消息分类" width="120" />
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <span :class="['status-badge-lbl-link', scope.row.status === '未读' ? 'color-interactive-blue' : 'color-neutral-read']" @click="toggleSingleRead(scope.row)">
              <el-icon v-if="scope.row.status === '未读'" class="bubble-icon-prefix"><ChatDotRound /></el-icon>
              {{ scope.row.status }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column prop="time" label="时间" width="170" />
        
        <el-table-column label="操作" fixed="right" width="80">
          <template #default="scope">
            <span class="action-check-detail-btn" @click="checkMessageDetail(scope.row)">详情</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pagination-footer-row">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredMessageTotalCount"
          layout="total, prev, pager, next, sizes, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Refresh, Check, Reading, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const categoryFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const selectedTableRows = ref<any[]>([])

// 依据截图，精细化编写并递增循环生成 101 条完全不同的高质感平台真实流水消息集
const create100PlusMessagesDataset = () => {
  const dataset: any[] = []
  
  // 先把截图前 5 条真实写死的权威高保真数据推入
  dataset.push(
    { id: 1, title: '合同资源配置通知', content: '运营方已配置合同资源，合同编号：yin0529，资源将持续保持高可用监控，请登录资源监控台查看物理设备实例。', category: '合同', status: '未读', time: '2026-06-01 17:15:52' },
    { id: 2, title: '合同即将到期通知', content: '合同编号：HT20260529001（云上合同ID：HT20260529001）即将到达续费截止期，为避免裸金属主机被停机回收，请尽快处理。', category: '到期通知', status: '未读', time: '2026-05-31 09:00:00' },
    { id: 3, title: '合同即将到期通知', content: '合同编号：HT20260529001（云上合同ID：HT20260529001）剩余可用天数不足2天，算力资源调度池将执行锁定预警。', category: '到期通知', status: '未读', time: '2026-05-30 09:00:00' },
    { id: 4, title: '合同资源交付完成通知', content: '合同编号：HT20260529001，资源按合同配置已全部按需部署上架完毕，包含 8*Ascend 910B 算力卡组。', category: '合同', status: '未读', time: '2026-05-29 14:38:49' },
    { id: 5, title: '合同资源配置通知', content: '运营方已配置合同资源，合同编号：HT20260529001，物理隔离策略已部署，安全通道已下发。', category: '合同', status: '未读', time: '2026-05-29 14:38:48' },
    { id: 6, title: '合同申请审批通过通知，业务单号CA202605291436145947', content: '您的合同【单号：CA202605291436145947】审批通过，计费系统已建立对应的免费账期策略流。', category: '合同', status: '未读', time: '2026-05-29 14:36:44' },
    { id: 7, title: '合同申请审批通过通知，业务单号CA202605290942469582', content: '您的合同【单号：CA202605290942469582】审批通过，对应云主机和网络频宽配置就绪。', category: '合同', status: '未读', time: '2026-05-29 09:42:58' }
  )

  // 快捷生成后续 94 条长历史消息（总数达到 101 条，完美撑起多页数据）
  for (let i = 1; i <= 94; i++) {
    const isEven = i % 2 === 0
    const mockDay = 28 - Math.floor(i / 4)
    const formattedDay = mockDay > 0 ? mockDay.toString().padStart(2, '0') : '01'
    
    dataset.push({
      id: 7 + i,
      title: isEven ? `合同变更自动备份指引通知 (流水号 #${202600 + i})` : `【系统预警】算力中心网络物理切片到期解绑通告`,
      content: isEven 
        ? `运营方已建立全新的影子副本，合同 yin0525 的资源续期已挂载，内网互通拓扑保持稳定，业务流量将无感流转。`
        : `【通用云主机】资源名称：300pro-disk-m，ID：873589438${i} 租赁租期已到，系统已自动转入 72 小时数据保护观察隔离区。`,
      category: isEven ? '合同' : '到期通知',
      status: i > 15 ? '已读' : '未读', // 前面一部分留作未读，后面全部是已读
      time: `2026-05-${formattedDay} 14:${(i % 60).toString().padStart(2, '0')}:12`
    })
  }

  return dataset
}

const globalMessagesMasterSource = ref(create100PlusMessagesDataset())

// 计算层：按检索词过滤
const filteredMessageDataset = computed(() => {
  return globalMessagesMasterSource.value.filter(item => {
    const matchCat = !categoryFilter.value || item.category === categoryFilter.value
    const matchStatus = !statusFilter.value || item.status === statusFilter.value
    return matchCat && matchStatus
  })
})

const filteredMessageTotalCount = computed(() => filteredMessageDataset.value.length)

// 分页动态截取
const paginatedMessageData = computed(() => {
  const startOffset = (currentPage.value - 1) * pageSize.value
  return filteredMessageDataset.value.slice(startOffset, startOffset + pageSize.value)
})

const handleFilterSearch = () => { currentPage.value = 1; ElMessage.success('消息过滤器执行重调') }
const handleFilterReset = () => { categoryFilter.value = ''; statusFilter.value = ''; currentPage.value = 1 }
const handleTableSelectionChange = (val: any[]) => { selectedTableRows.value = val }
const handlePageSizeChange = (val: number) => { pageSize.value = val; currentPage.value = 1 }
const handleCurrentPageChange = (val: number) => { currentPage.value = val }

// 功能方法：消息状态改变动作
const toggleSingleRead = (row: any) => {
  if (row.status === '未读') { row.status = '已读'; ElMessage.success('消息已标为阅读态') }
}
const batchMarkAsRead = () => {
  selectedTableRows.value.forEach(row => { row.status = '已读' })
  ElMessage.success('选中的批量流水单号已全部切为已读')
}
const allMarkAsRead = () => {
  globalMessagesMasterSource.value.forEach(row => { row.status = '已读' })
  ElMessage.success('当前面板中所有未读通知已全局一键清空')
}
const checkMessageDetail = (row: any) => { row.status = '已读'; ElMessage.info(`正在打开消息密档详情: ${row.id}`) }
</script>

<style scoped>
.console-message-center-dashboard-layout { display: flex; flex-direction: column; gap: 16px; width: 100%; box-sizing: border-box; }
.message-filter-card-box { background-color: #ffffff; padding: 20px 24px 12px 24px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03); }
.filter-layout-fields-inline-row { display: flex; align-items: center; width: 100%; margin-bottom: 16px; }
.field-item-cell { display: flex; align-items: center; gap: 12px; margin-right: 32px; }
.lbl-caption { font-size: 14px; color: #4E5969; white-space: nowrap; }
.actions-flex-buttons-group { display: flex; gap: 12px; margin-left: auto; }
.btn-blue-search-action { background-color: #1677FF !important; border-color: #1677FF !important; }
.batch-manipulation-trigger-row { display: flex; gap: 12px; border-top: 1px solid #F2F3F5; padding-top: 12px; padding-bottom: 4px; }

/* 批量和表单元素定制 */
.btn-plain-batch-read { border-color: #E5E6EB !important; color: #4E5969 !important; background-color: #ffffff !important; }
.btn-plain-batch-read:hover:not(:disabled) { border-color: #1677FF !important; color: #1677FF !important; }
.btn-outline-all-read { color: #1677FF !important; border-color: #1677FF !important; background-color: #E8F3FF !important; }

.message-table-canvas-card { background-color: #ffffff; padding: 20px 24px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03); }
.title-text-node { font-size: 14px; color: #4E5969; }
.is-unread-bold { font-weight: 500; color: #1D2129 !important; }

/* --------------------------------------------------------------------------
   图一真实还原：未读态呈现清爽带小气泡的蓝色可交互链接效果
   -------------------------------------------------------------------------- */
.status-badge-lbl-link { display: inline-flex; align-items: center; font-size: 14px; cursor: pointer; user-select: none; }
.color-interactive-blue { color: #1677FF; }
.color-interactive-blue:hover { text-decoration: underline; }
.color-neutral-read { color: #86909C; cursor: default; }
.bubble-icon-prefix { margin-right: 4px; font-size: 14px; }

.action-check-detail-btn { color: #1677FF; cursor: pointer; font-size: 14px; }
.action-check-detail-btn:hover { color: #4096ff; }
.table-pagination-footer-row { display: flex; justify-content: flex-end; padding-top: 20px; }
.icon-margin { margin-right: 4px; }
</style>