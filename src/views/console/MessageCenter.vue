<template>
  <div class="console-message-center-dashboard-layout">
    
    <!-- 消息统计面板 -->
    <div class="message-stats-panel">
      <div class="stat-card">
        <div class="stat-icon-box bg-blue">
          <el-icon :size="24"><ChatDotRound /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">消息总数</div>
          <div class="stat-value">{{ globalMessagesMasterSource.length }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-box bg-orange">
          <el-icon :size="24"><Bell /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">未读消息</div>
          <div class="stat-value">{{ unreadCount }}</div>
          <div class="stat-trend">占比 {{ unreadPercent }}%</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-box bg-green">
          <el-icon :size="24"><Check /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">已读消息</div>
          <div class="stat-value">{{ readCount }}</div>
          <div class="stat-trend">阅读率 {{ readRate }}%</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-box bg-red">
          <el-icon :size="24"><Warning /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">高优先级</div>
          <div class="stat-value">{{ highPriorityCount }}</div>
          <div class="stat-trend warning">需关注</div>
        </div>
      </div>
    </div>

    <!-- 消息分类统计图表 -->
    <div class="category-stats-chart-panel">
      <div class="chart-header-title">
        <span class="title-text">消息分类分布</span>
        <el-tag size="small" type="info">实时</el-tag>
      </div>
      <div class="chart-bars-container">
        <div v-for="item in categoryStatsData" :key="item.category" class="chart-bar-item">
          <div class="bar-label-row">
            <span class="bar-category-name">{{ item.category }}</span>
            <span class="bar-count-value">{{ item.count }} 条</span>
          </div>
          <div class="bar-track-bg">
            <div 
              class="bar-fill-progress" 
              :class="'bar-color-' + getCategoryClass(item.category)"
              :style="{ width: item.percentage + '%' }"
            ></div>
          </div>
          <div class="bar-percent-label">{{ item.percentage }}%</div>
        </div>
      </div>
    </div>

    <!-- 消息模板快捷面板 -->
    <div class="message-template-quick-panel">
      <div class="template-panel-header">
        <span class="panel-title-text">
          <el-icon><Collection /></el-icon>
          消息模板
        </span>
        <el-button size="small" type="primary" plain @click="showCreateTemplateDialog = true">
          <el-icon><Plus /></el-icon> 新建模板
        </el-button>
      </div>
      <div class="template-grid-list">
        <div v-for="tpl in messageTemplates" :key="tpl.id" class="template-card-item">
          <div class="template-card-header">
            <span class="template-name-text">{{ tpl.name }}</span>
            <el-tag size="small" :type="getTemplateCategoryTag(tpl.category)" effect="plain">{{ tpl.category }}</el-tag>
          </div>
          <p class="template-preview-text">{{ tpl.content.substring(0, 50) }}...</p>
          <div class="template-card-actions">
            <el-button size="small" text @click="useTemplate(tpl)">使用</el-button>
            <el-button size="small" text type="danger" @click="deleteTemplate(tpl.id)">删除</el-button>
          </div>
        </div>
        <div v-if="messageTemplates.length === 0" class="template-empty-state">
          <el-icon :size="48" color="#C0C4CC"><DocumentDelete /></el-icon>
          <p>暂无消息模板，点击"新建模板"创建</p>
        </div>
      </div>
    </div>

    <div class="message-filter-card-box">
      <div class="filter-layout-fields-inline-row">
        <div class="field-item-cell">
          <span class="lbl-caption">消息分类</span>
          <el-select v-model="categoryFilter" placeholder="请选择消息分类" clearable style="width: 220px">
            <el-option label="合同" value="合同" />
            <el-option label="到期通知" value="到期通知" />
            <el-option label="系统通知" value="系统通知" />
            <el-option label="订单消息" value="订单消息" />
            <el-option label="安全告警" value="安全告警" />
            <el-option label="资源监控" value="资源监控" />
          </el-select>
        </div>
        <div class="field-item-cell">
          <span class="lbl-caption">状态</span>
          <el-select v-model="statusFilter" placeholder="请选择状态" clearable style="width: 220px">
            <el-option label="未读" value="未读" />
            <el-option label="已读" value="已读" />
          </el-select>
        </div>
        <div class="field-item-cell">
          <span class="lbl-caption">优先级</span>
          <el-select v-model="priorityFilter" placeholder="请选择优先级" clearable style="width: 220px">
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </div>
        <div class="actions-flex-buttons-group">
          <el-button type="primary" class="btn-blue-search-action" :icon="Search" @click="handleFilterSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleFilterReset">重置</el-button>
        </div>
      </div>

      <!-- 关键字搜索栏 -->
      <div class="keyword-search-row">
        <el-input
          v-model="keywordSearch"
          placeholder="🔍 输入关键字搜索消息标题或内容..."
          class="keyword-search-input"
          clearable
          @input="handleKeywordSearch"
          @clear="handleKeywordClear"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <span v-if="keywordSearch" class="search-result-count">找到 {{ filteredMessageTotalCount }} 条结果</span>
      </div>

      <div class="batch-manipulation-trigger-row">
        <el-button size="default" :disabled="selectedTableRows.length === 0" class="btn-plain-batch-read" @click="batchMarkAsRead">
          <el-icon class="icon-margin"><Check /></el-icon> 标记为已读
        </el-button>
        <el-button size="default" type="primary" plain class="btn-outline-all-read" @click="allMarkAsRead">
          <el-icon class="icon-margin"><Reading /></el-icon> 全部已读
        </el-button>
        <el-button size="default" class="btn-export-action" @click="showExportDialog = true">
          <el-icon class="icon-margin"><Download /></el-icon> 导出消息
        </el-button>
      </div>
    </div>

    <div class="message-table-canvas-card">
      <transition-group name="message-row" tag="div">
        <el-table 
          :key="tableRefreshKey"
          :data="paginatedMessageData" 
          style="width: 100%"
          size="default"
          @selection-change="handleTableSelectionChange"
          :header-cell-style="{ background: '#F7F8FA', color: '#1D2129', fontWeight: '500', height: '42px' }"
          row-key="id"
        >
        <el-table-column type="selection" width="50" />
        
        <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip>
          <template #default="scope">
            <span :class="['title-text-node', scope.row.status === '未读' ? 'is-unread-bold' : '']">
              <el-icon v-if="scope.row.priority === '高'" class="priority-icon high-priority"><WarningFilled /></el-icon>
              {{ scope.row.title }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column prop="content" label="内容" min-width="300" show-overflow-tooltip />
        
        <el-table-column prop="priority" label="优先级" width="90">
          <template #default="scope">
            <el-tag :type="getPriorityTag(scope.row.priority)" size="small" effect="plain">
              {{ scope.row.priority }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="category" label="消息分类" width="110">
          <template #default="scope">
            <span :class="['category-badge-tag', getCategoryClass(scope.row.category)]">
              {{ scope.row.category }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="90">
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
      </transition-group>

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

    <!-- 消息详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="消息详情"
      width="720px"
      :align-center="true"
      class="custom-message-detail-dialog"
    >
      <div class="message-matrix-grid-frame">
        <div class="grid-row-item">
          <div class="grid-cell-label">标题</div>
          <div class="grid-cell-value bold-title-text">{{ activeMessageRow.title }}</div>
        </div>

        <div class="grid-row-item split-two-cols">
          <div class="half-col">
            <div class="grid-cell-label">消息分类</div>
            <div class="grid-cell-value">
              <span :class="['category-tag-node', getCategoryClass(activeMessageRow.category)]">
                {{ activeMessageRow.category }}
              </span>
            </div>
          </div>
          <div class="half-col border-left-divider">
            <div class="grid-cell-label">优先级</div>
            <div class="grid-cell-value">
              <el-tag :type="getPriorityTag(activeMessageRow.priority)" size="small" effect="plain">
                {{ activeMessageRow.priority }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="grid-row-item split-two-cols">
          <div class="half-col">
            <div class="grid-cell-label">状态</div>
            <div class="grid-cell-value">{{ activeMessageRow.status }}</div>
          </div>
          <div class="half-col border-left-divider">
            <div class="grid-cell-label">发送时间</div>
            <div class="grid-cell-value font-mono-style">{{ activeMessageRow.time }}</div>
          </div>
        </div>

        <div class="grid-row-item align-stretch-mode">
          <div class="grid-cell-label content-label-fix">内容</div>
          <div class="grid-cell-value text-paragraph-content">
            {{ activeMessageRow.content }}
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-custom-footer-actions">
          <el-button type="primary" class="btn-dialog-close-action" @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导出弹窗 -->
    <el-dialog
      v-model="showExportDialog"
      title="导出消息"
      width="480px"
      :align-center="true"
    >
      <div class="export-dialog-content">
        <p class="export-desc">选择导出格式，将导出当前筛选条件下的所有消息：</p>
        <div class="export-format-options">
          <el-radio-group v-model="exportFormat">
            <el-radio label="csv">CSV 表格</el-radio>
            <el-radio label="json">JSON 数据</el-radio>
          </el-radio-group>
        </div>
        <div class="export-preview">
          <span>预计导出 {{ filteredMessageTotalCount }} 条消息</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="showExportDialog = false">取消</el-button>
        <el-button type="primary" @click="handleExport">确认导出</el-button>
      </template>
    </el-dialog>

    <!-- 创建消息模板弹窗 -->
    <el-dialog
      v-model="showCreateTemplateDialog"
      title="新建消息模板"
      width="560px"
      :align-center="true"
    >
      <el-form :model="templateForm" label-width="80px" class="template-form-layout">
        <el-form-item label="模板名称">
          <el-input v-model="templateForm.name" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="消息分类">
          <el-select v-model="templateForm.category" placeholder="请选择分类" style="width: 100%">
            <el-option label="合同" value="合同" />
            <el-option label="到期通知" value="到期通知" />
            <el-option label="系统通知" value="系统通知" />
            <el-option label="订单消息" value="订单消息" />
            <el-option label="安全告警" value="安全告警" />
            <el-option label="资源监控" value="资源监控" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="templateForm.priority" placeholder="请选择优先级" style="width: 100%">
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板内容">
          <el-input
            v-model="templateForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入消息模板内容，支持使用 {变量名} 作为占位符"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateTemplateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreateTemplate">创建模板</el-button>
      </template>
    </el-dialog>

    <!-- 使用模板弹窗 -->
    <el-dialog
      v-model="showUseTemplateDialog"
      title="使用消息模板"
      width="560px"
      :align-center="true"
    >
      <el-form :model="useTemplateForm" label-width="80px" class="template-form-layout">
        <el-form-item label="消息标题">
          <el-input v-model="useTemplateForm.title" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item label="消息内容">
          <el-input
            v-model="useTemplateForm.content"
            type="textarea"
            :rows="6"
            placeholder="消息内容"
          />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="useTemplateForm.priority" placeholder="请选择优先级" style="width: 100%">
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showUseTemplateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSendFromTemplate">发送消息</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Refresh, Check, Reading, ChatDotRound, Bell, Warning, WarningFilled, Download, Collection, Plus, DocumentDelete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const categoryFilter = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')
const keywordSearch = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const selectedTableRows = ref<any[]>([])
const tableRefreshKey = ref(0)

// 控制详情弹窗的可视性与数据载体
const detailDialogVisible = ref(false)
const activeMessageRow = ref<any>({})

// 导出相关
const showExportDialog = ref(false)
const exportFormat = ref<'csv' | 'json'>('csv')

// 消息模板相关
const showCreateTemplateDialog = ref(false)
const showUseTemplateDialog = ref(false)
const templateForm = ref({ name: '', category: '', priority: '中', content: '' })
const useTemplateForm = ref({ title: '', content: '', priority: '中' })
const currentUsingTemplate = ref<any>(null)

// 消息模板数据
const messageTemplates = ref<any[]>([])
const loadTemplates = () => {
  const localData = localStorage.getItem('platform_message_templates')
  if (localData) {
    messageTemplates.value = JSON.parse(localData)
  } else {
    // 默认模板
    messageTemplates.value = [
      { id: 1, name: '合同到期提醒', category: '到期通知', priority: '高', content: '合同编号：{合同编号} 即将到期，剩余天数：{剩余天数}，请及时处理续费事宜。' },
      { id: 2, name: '订单支付成功', category: '订单消息', priority: '中', content: '您的订单 {订单号} 已支付成功，金额 ¥{金额}，资源正在准备中。' },
      { id: 3, name: '系统维护通知', category: '系统通知', priority: '中', content: '平台将于 {维护时间} 进行系统升级维护，届时部分服务可能出现短暂不可用。' },
      { id: 4, name: '安全告警通知', category: '安全告警', priority: '高', content: '检测到异常登录行为，IP地址：{IP地址}，如非本人操作请立即修改密码。' }
    ]
    localStorage.setItem('platform_message_templates', JSON.stringify(messageTemplates.value))
  }
}
loadTemplates()

// 分类统计数据
const categoryStatsData = computed(() => {
  const total = globalMessagesMasterSource.value.length
  if (total === 0) return []
  
  const categoryMap: Record<string, number> = {}
  globalMessagesMasterSource.value.forEach((m: any) => {
    categoryMap[m.category] = (categoryMap[m.category] || 0) + 1
  })
  
  return Object.entries(categoryMap)
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count)
})

const create100PlusMessagesDataset = () => {
  const dataset: any[] = []
  const categories = ['合同', '到期通知', '系统通知', '订单消息', '安全告警', '资源监控']
  
  // 注入完美契合图一、图二高保真快照的核心流水账期通知数据
  dataset.push(
    { id: 1, title: '合同资源配置通知', content: '运营方已配置合同资源，合同编号：yin0529，资源将持续保持高可用监控，请登录资源监控台查看物理设备实例。', category: '合同', status: '未读', time: '2026-06-01 17:15:52' },
    { id: 2, title: '合同即将到期通知', content: '合同编号：HT20260529001（云上合同ID：HT20260529001）即将到达续费截止期，为避免裸金属主机被停机回收，请尽快处理。', category: '到期通知', status: '未读', time: '2026-05-31 09:00:00' },
    { id: 3, title: '合同即将到期通知', content: '合同编号：HT20260529001（云上合同ID：HT20260529001）剩余可用天数不足2天，算力资源调度池将执行锁定预警。', category: '到期通知', status: '未读', time: '2026-05-30 09:00:00' },
    { id: 4, title: '合同资源交付完成通知', content: '合同编号：HT20260529001，资源按合同配置已全部按需部署上架完毕，包含 8*Ascend 910B 算力卡组。', category: '合同', status: '未读', time: '2026-05-29 14:38:49' },
    { id: 5, title: '合同资源配置通知', content: '运营方已配置合同资源，合同编号：HT20260529001，物理隔离策略已部署，安全通道已下发。', category: '合同', status: '未读', time: '2026-05-29 14:38:48' },
    { id: 6, title: '合同申请审批通过通知，业务单号CA202605291436145947', content: '您的合同【单号：CA202605291436145947】审批通过，计费系统已建立对应的免费账期策略流。', category: '合同', status: '未读', time: '2026-05-29 14:36:44' },
    { id: 7, title: '合同申请审批通过通知，业务单号CA202605290942469582', content: '您的合同【单号：CA202605290942469582】审批通过，对应云主机和网络频宽配置就绪。', category: '合同', status: '未读', time: '2026-05-29 09:42:58' },
    { id: 8, title: '系统升级维护通知', content: '平台将于2026-06-15 02:00-06:00进行系统升级维护，届时部分服务可能出现短暂不可用，请提前做好业务安排。', category: '系统通知', status: '未读', time: '2026-06-10 10:00:00' },
    { id: 9, title: '订单支付成功通知', content: '您的订单 ORD202606101246282536 已支付成功，金额 ¥2,400.00，资源正在准备中。', category: '订单消息', status: '未读', time: '2026-06-10 12:50:00' },
    { id: 10, title: '安全登录异常告警', content: '检测到您的账号在异常地点登录，IP地址：192.168.1.100，如非本人操作请立即修改密码。', category: '安全告警', status: '未读', time: '2026-06-09 23:15:30' },
    { id: 11, title: 'GPU资源使用率告警', content: '您的GPU实例 gpu-instance-001 CPU使用率持续超过90%已达30分钟，请关注业务负载情况。', category: '资源监控', status: '未读', time: '2026-06-09 18:20:00' },
    { id: 12, title: '订单创建成功通知', content: '您的订单 ORD202606091126404900 已创建成功，金额 ¥5,800.00，请尽快完成支付。', category: '订单消息', status: '未读', time: '2026-06-09 11:30:00' }
  )

  for (let i = 1; i <= 89; i++) {
    const categoryIndex = i % 6
    const category = categories[categoryIndex]
    const isUnread = i <= 20
    
    let title, content
    switch (category) {
      case '合同':
        title = `合同变更自动备份指引通知 (流水号 #${202600 + i})`
        content = `运营方已建立全新的影子副本，合同 yin0525 的资源续期已挂载，内网互通拓扑保持稳定，业务流量将无感流转。`
        break
      case '到期通知':
        title = `【系统预警】算力中心网络物理切片到期解绑通告`
        content = `【通用云主机】资源名称：300pro-disk-m，ID：873589438${i} 租赁租期已到，系统已自动转入 72 小时数据保护观察隔离区。`
        break
      case '系统通知':
        title = `平台系统更新公告 v2.${i}.0`
        content = `平台已完成第 ${i} 次迭代更新，优化了资源调度算法，提升了GPU实例分配效率约15%。`
        break
      case '订单消息':
        title = `订单状态更新通知 #ORD${2026060000 + i}`
        content = `您的订单状态已更新为${i % 3 === 0 ? '已完成' : i % 3 === 1 ? '处理中' : '已发货'}，请登录控制台查看详情。`
        break
      case '安全告警':
        title = `安全风险提示 - 异常访问检测`
        content = `系统检测到来自非常用IP的访问请求，已自动触发二次验证机制，请确认是否为本人操作。`
        break
      case '资源监控':
        title = `资源监控报告 - 实例性能指标`
        content = `您的计算实例过去24小时内平均GPU利用率为${60 + (i % 35)}%，内存使用率${70 + (i % 25)}%，运行状态良好。`
        break
      default:
        title = `系统通知 #${i}`
        content = `这是一条系统自动生成的通知消息。`
    }
    
    const mockDay = 28 - Math.floor(i / 4)
    const formattedDay = mockDay > 0 ? mockDay.toString().padStart(2, '0') : '01'
    
    dataset.push({
      id: 12 + i,
      title,
      content,
      category,
      status: isUnread ? '未读' : '已读',
      time: `2026-05-${formattedDay} 14:${(i % 60).toString().padStart(2, '0')}:12`
    })
  }

  return dataset
}

// ========= 核心数据源加载与联动逻辑 =========
const loadInitData = () => {
  const localData = localStorage.getItem('platform_system_messages')
  if (localData) {
    return JSON.parse(localData)
  }
  const initData = create100PlusMessagesDataset()
  localStorage.setItem('platform_system_messages', JSON.stringify(initData))
  return initData
}

const globalMessagesMasterSource = ref(loadInitData())

// 统一下发跨页面联动事件
const syncAndNotify = () => {
  localStorage.setItem('platform_system_messages', JSON.stringify(globalMessagesMasterSource.value))
  window.dispatchEvent(new CustomEvent('update-message-bell-badge'))
}

// 统计面板计算属性
const unreadCount = computed(() => globalMessagesMasterSource.value.filter((m: any) => m.status === '未读').length)
const readCount = computed(() => globalMessagesMasterSource.value.filter((m: any) => m.status === '已读').length)
const unreadPercent = computed(() => {
  const total = globalMessagesMasterSource.value.length
  return total > 0 ? Math.round((unreadCount.value / total) * 100) : 0
})
const readRate = computed(() => 100 - unreadPercent.value)
const highPriorityCount = computed(() => globalMessagesMasterSource.value.filter((m: any) => m.priority === '高' && m.status === '未读').length)

const filteredMessageDataset = computed(() => {
  return globalMessagesMasterSource.value.filter((item: any) => {
    const matchCat = !categoryFilter.value || item.category === categoryFilter.value
    const matchStatus = !statusFilter.value || item.status === statusFilter.value
    const matchPriority = !priorityFilter.value || item.priority === priorityFilter.value
    const matchKeyword = !keywordSearch.value || 
      item.title.toLowerCase().includes(keywordSearch.value.toLowerCase()) || 
      item.content.toLowerCase().includes(keywordSearch.value.toLowerCase())
    return matchCat && matchStatus && matchPriority && matchKeyword
  })
})

const filteredMessageTotalCount = computed(() => filteredMessageDataset.value.length)

const paginatedMessageData = computed(() => {
  const startOffset = (currentPage.value - 1) * pageSize.value
  return filteredMessageDataset.value.slice(startOffset, startOffset + pageSize.value)
})

const handleFilterSearch = () => { currentPage.value = 1; ElMessage.success('消息过滤器执行重调') }
const handleFilterReset = () => { categoryFilter.value = ''; statusFilter.value = ''; priorityFilter.value = ''; keywordSearch.value = ''; currentPage.value = 1 }
const handleTableSelectionChange = (val: any[]) => { selectedTableRows.value = val }
const handlePageSizeChange = (val: number) => { pageSize.value = val; currentPage.value = 1 }
const handleCurrentPageChange = (val: number) => { currentPage.value = val }

// 关键字搜索
const handleKeywordSearch = () => { currentPage.value = 1 }
const handleKeywordClear = () => { keywordSearch.value = ''; currentPage.value = 1 }

// 获取优先级标签类型
const getPriorityTag = (priority: string): 'danger' | 'warning' | 'info' => {
  const map: Record<string, 'danger' | 'warning' | 'info'> = {
    '高': 'danger',
    '中': 'warning',
    '低': 'info'
  }
  return map[priority] || 'info'
}

// 导出功能
const handleExport = () => {
  const data = filteredMessageDataset.value
  if (data.length === 0) {
    ElMessage.warning('没有可导出的数据')
    showExportDialog.value = false
    return
  }

  if (exportFormat.value === 'json') {
    exportAsJSON(data)
  } else {
    exportAsCSV(data)
  }
  
  showExportDialog.value = false
  ElMessage.success(`成功导出 ${data.length} 条消息`)
}

const exportAsJSON = (data: any[]) => {
  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  downloadFile(blob, `消息导出_${new Date().toLocaleDateString()}.json`)
}

const exportAsCSV = (data: any[]) => {
  const headers = ['ID', '标题', '内容', '分类', '优先级', '状态', '时间']
  const rows = data.map((item: any) => [
    item.id,
    `"${item.title}"`,
    `"${item.content}"`,
    item.category,
    item.priority,
    item.status,
    item.time
  ])
  
  const csvContent = [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n')
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadFile(blob, `消息导出_${new Date().toLocaleDateString()}.csv`)
}

const downloadFile = (blob: Blob, filename: string) => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

// 获取消息分类样式
const getCategoryClass = (category: string) => {
  const classMap: Record<string, string> = {
    '合同': 'category-contract',
    '到期通知': 'category-expire',
    '系统通知': 'category-system',
    '订单消息': 'category-order',
    '安全告警': 'category-security',
    '资源监控': 'category-monitor'
  }
  return classMap[category] || 'category-default'
}

// 获取模板分类标签类型
const getTemplateCategoryTag = (category: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    '合同': 'primary',
    '到期通知': 'warning',
    '系统通知': 'info',
    '订单消息': 'success',
    '安全告警': 'danger',
    '资源监控': 'info'
  }
  return map[category] || 'info'
}

// 创建模板
const handleCreateTemplate = () => {
  if (!templateForm.value.name || !templateForm.value.category || !templateForm.value.content) {
    ElMessage.warning('请填写完整的模板信息')
    return
  }

  const newTemplate = {
    id: Date.now(),
    name: templateForm.value.name,
    category: templateForm.value.category,
    priority: templateForm.value.priority,
    content: templateForm.value.content
  }

  messageTemplates.value.push(newTemplate)
  localStorage.setItem('platform_message_templates', JSON.stringify(messageTemplates.value))
  
  ElMessage.success('模板创建成功')
  showCreateTemplateDialog.value = false
  templateForm.value = { name: '', category: '', priority: '中', content: '' }
}

// 使用模板
const useTemplate = (tpl: any) => {
  currentUsingTemplate.value = tpl
  useTemplateForm.value = {
    title: tpl.name,
    content: tpl.content,
    priority: tpl.priority
  }
  showUseTemplateDialog.value = true
}

// 从模板发送消息
const handleSendFromTemplate = () => {
  if (!useTemplateForm.value.title || !useTemplateForm.value.content) {
    ElMessage.warning('请填写完整的消息信息')
    return
  }

  const now = new Date()
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

  const newMessage = {
    id: Date.now(),
    title: useTemplateForm.value.title,
    content: useTemplateForm.value.content,
    category: currentUsingTemplate.value?.category || '系统通知',
    priority: useTemplateForm.value.priority,
    status: '未读',
    time: timeStr
  }

  globalMessagesMasterSource.value.unshift(newMessage)
  syncAndNotify()

  ElMessage.success('消息发送成功')
  showUseTemplateDialog.value = false
  useTemplateForm.value = { title: '', content: '', priority: '中' }
  currentUsingTemplate.value = null
}

// 删除模板
const deleteTemplate = (id: number) => {
  messageTemplates.value = messageTemplates.value.filter(t => t.id !== id)
  localStorage.setItem('platform_message_templates', JSON.stringify(messageTemplates.value))
  ElMessage.success('模板已删除')
}

// ========= 已读状态变更，全部插入 syncAndNotify =========
const toggleSingleRead = (row: any) => {
  if (row.status === '未读') { 
    row.status = '已读'
    tableRefreshKey.value++
    ElMessage.success('消息已标为阅读态') 
    syncAndNotify()
  }
}

const batchMarkAsRead = () => {
  selectedTableRows.value.forEach(row => { row.status = '已读' })
  tableRefreshKey.value++
  ElMessage.success('选中的批量流水单号已全部切为已读')
  syncAndNotify()
}

const allMarkAsRead = () => {
  globalMessagesMasterSource.value.forEach((row: any) => { row.status = '已读' })
  tableRefreshKey.value++
  ElMessage.success('当前面板中所有未读通知已全局一键清空')
  syncAndNotify()
}

// 🚀 核心改动点：详情点击动作流，同步切为阅读态并唤醒多态弹窗面板
const checkMessageDetail = (row: any) => { 
  if (row.status === '未读') {
    row.status = '已读'
    tableRefreshKey.value++
    syncAndNotify()
  }
  activeMessageRow.value = row
  detailDialogVisible.value = true
}
</script>

<style scoped>
/* 这里也原封不动保留你的 CSS 样式，一行未动 */
.console-message-center-dashboard-layout { display: flex; flex-direction: column; gap: 16px; width: 100%; box-sizing: border-box; }
.message-filter-card-box { background-color: #ffffff; padding: 20px 24px 12px 24px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03); }
.filter-layout-fields-inline-row { display: flex; align-items: center; width: 100%; margin-bottom: 16px; }
.field-item-cell { display: flex; align-items: center; gap: 12px; margin-right: 32px; }
.lbl-caption { font-size: 14px; color: #4E5969; white-space: nowrap; }
.actions-flex-buttons-group { display: flex; gap: 12px; margin-left: auto; }
.btn-blue-search-action { background-color: #1677FF !important; border-color: #1677FF !important; }
.batch-manipulation-trigger-row { display: flex; gap: 12px; border-top: 1px solid #F2F3F5; padding-top: 12px; padding-bottom: 4px; }

.btn-plain-batch-read { border-color: #E5E6EB !important; color: #4E5969 !important; background-color: #ffffff !important; }
.btn-plain-batch-read:hover:not(:disabled) { border-color: #1677FF !important; color: #1677FF !important; }
.btn-outline-all-read { color: #1677FF !important; border-color: #1677FF !important; background-color: #E8F3FF !important; }

.message-table-canvas-card { background-color: #ffffff; padding: 20px 24px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03); }
.title-text-node { font-size: 14px; color: #4E5969; }
.is-unread-bold { font-weight: 500; color: #1D2129 !important; }

.status-badge-lbl-link { display: inline-flex; align-items: center; font-size: 14px; cursor: pointer; user-select: none; }
.color-interactive-blue { color: #1677FF; }
.color-neutral-read { color: #86909C; cursor: default; }
.bubble-icon-prefix { margin-right: 4px; font-size: 14px; }

.action-check-detail-btn { color: #1677FF; cursor: pointer; font-size: 14px; }
.action-check-detail-btn:hover { color: #4096ff; }
.table-pagination-footer-row { display: flex; justify-content: flex-end; padding-top: 20px; }
.icon-margin { margin-right: 4px; }

/* ==========================================================================
   🚀 弹窗面板矩阵格子框架：完美还原图一、图二细致的双线条及灰底色框骨架
   ========================================================================== */
.message-matrix-grid-frame {
  display: flex;
  flex-direction: column;
  border: 1px solid #E5E6EB;
  border-radius: 4px;
  overflow: hidden;
}

.grid-row-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #E5E6EB;
  min-height: 48px;
}

.grid-row-item:last-child {
  border-bottom: none;
}

/* 标签列样式：浅灰底色带右边框 */
.grid-cell-label {
  width: 110px;
  background-color: #F7F8FA;
  color: #4E5969;
  font-size: 14px;
  font-weight: 500;
  padding-left: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  border-right: 1px solid #E5E6EB;
  flex-shrink: 0;
  box-sizing: border-box;
}

/* 内容列内容样式 */
.grid-cell-value {
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  color: #1D2129;
  font-size: 14px;
  box-sizing: border-box;
}

.bold-title-text {
  font-weight: 600;
  color: #1D2129;
}

/* 复合双列排版 */
.split-two-cols {
  display: flex;
  align-items: stretch;
}

.half-col {
  flex: 1;
  display: flex;
  align-items: center;
}

.border-left-divider {
  border-left: 1px solid #E5E6EB;
}

/* 动态轻奢圆角标签 */
.category-tag-node {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 2px;
  font-weight: 500;
}

/* 表格中的分类徽章样式 */
.category-badge-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 2px;
  font-weight: 500;
  display: inline-block;
}

/* 合同 - 蓝色 */
.category-contract,
.category-contract.category-badge-tag {
  background-color: #E8F3FF;
  color: #1677FF;
}

/* 到期通知 - 橙色 */
.category-expire,
.category-expire.category-badge-tag {
  background-color: #FFF7E8;
  color: #FA8C16;
}

/* 系统通知 - 紫色 */
.category-system,
.category-system.category-badge-tag {
  background-color: #F3E8FF;
  color: #722ED1;
}

/* 订单消息 - 绿色 */
.category-order,
.category-order.category-badge-tag {
  background-color: #E8FFE8;
  color: #52C41A;
}

/* 安全告警 - 红色 */
.category-security,
.category-security.category-badge-tag {
  background-color: #FFE8E8;
  color: #F5222D;
}

/* 资源监控 - 青色 */
.category-monitor,
.category-monitor.category-badge-tag {
  background-color: #E8FFFF;
  color: #13C2C2;
}

/* 默认样式 */
.category-default,
.category-default.category-badge-tag {
  background-color: #F0F0F0;
  color: #666;
}

/* 图一专属：合同蓝色徽章标签 */
.contract-blue-tag {
  background-color: #E8F3FF;
  color: #1677FF;
}

/* 图二专属：到期通知淡蓝徽章标签 */
.expire-blue-tag {
  background-color: #E6F7FF;
  color: #1D5BFF;
  border: 1px solid #91D5FF;
}

/* 正文段落对齐规范 */
.align-stretch-mode {
  align-items: stretch;
}

.content-label-fix {
  display: flex;
  align-items: flex-start;
  padding-top: 16px;
}

.text-paragraph-content {
  padding-top: 16px;
  padding-bottom: 16px;
  line-height: 1.6;
  text-align: justify;
}

.font-mono-style {
  font-family: Consolas, Monaco, monospace;
  color: #4E5969;
}

/* 底部操作 */
.dialog-custom-footer-actions {
  display: flex;
  justify-content: flex-end;
  padding-right: 4px;
}

.btn-dialog-close-action {
  background-color: #1677FF !important;
  border-color: #1677FF !important;
  padding: 8px 20px !important;
  font-size: 14px !important;
  border-radius: 4px !important;
}

/* ==========================================================================
   消息分类统计图表面板
   ========================================================================== */
.category-stats-chart-panel {
  background-color: #ffffff;
  padding: 20px 24px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03);
}

.chart-header-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title-text {
  font-size: 16px;
  font-weight: 600;
  color: #1D2129;
}

.chart-bars-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-bar-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bar-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bar-category-name {
  font-size: 14px;
  color: #4E5969;
  font-weight: 500;
}

.bar-count-value {
  font-size: 13px;
  color: #86909C;
}

.bar-track-bg {
  width: 100%;
  height: 8px;
  background-color: #F2F3F5;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill-progress {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

/* 分类颜色映射 */
.bar-color-category-contract { background-color: #1677FF; }
.bar-color-category-expire { background-color: #FA8C16; }
.bar-color-category-system { background-color: #722ED1; }
.bar-color-category-order { background-color: #52C41A; }
.bar-color-category-security { background-color: #F5222D; }
.bar-color-category-monitor { background-color: #13C2C2; }
.bar-color-category-default { background-color: #86909C; }

.bar-percent-label {
  font-size: 12px;
  color: #86909C;
  text-align: right;
}

/* ==========================================================================
   消息模板快捷面板
   ========================================================================== */
.message-template-quick-panel {
  background-color: #ffffff;
  padding: 20px 24px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03);
}

.template-panel-header {
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

.template-grid-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.template-card-item {
  border: 1px solid #E5E6EB;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  background-color: #FAFBFC;
}

.template-card-item:hover {
  border-color: #1677FF;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.1);
  transform: translateY(-2px);
}

.template-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.template-name-text {
  font-size: 14px;
  font-weight: 600;
  color: #1D2129;
}

.template-preview-text {
  font-size: 13px;
  color: #86909C;
  line-height: 1.5;
  margin: 8px 0 12px 0;
  min-height: 40px;
}

.template-card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  border-top: 1px solid #F2F3F5;
  padding-top: 12px;
}

.template-empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #86909C;
}

.template-empty-state p {
  margin-top: 12px;
  font-size: 14px;
}

/* 模板表单样式 */
.template-form-layout {
  padding: 8px 0;
}

/* 优先级图标 */
.priority-icon {
  margin-right: 4px;
  font-size: 14px;
}

.priority-icon.high-priority {
  color: #F5222D;
}

/* 关键字搜索栏样式 */
.keyword-search-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #F7F8FA;
  border-radius: 4px;
}

.keyword-search-input {
  flex: 1;
}

.search-result-count {
  font-size: 13px;
  color: #1677FF;
  font-weight: 500;
  white-space: nowrap;
}

/* 导出弹窗内容样式 */
.export-dialog-content {
  padding: 8px 0;
}

.export-desc {
  font-size: 14px;
  color: #4E5969;
  margin-bottom: 16px;
}

.export-format-options {
  margin-bottom: 16px;
}

.export-preview {
  font-size: 13px;
  color: #86909C;
  padding: 8px 12px;
  background-color: #F7F8FA;
  border-radius: 4px;
}

/* 消息统计面板样式 */
.message-stats-panel {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 21, 41, 0.08);
}

.stat-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.stat-icon-box.bg-blue { background: linear-gradient(135deg, #1677FF 0%, #4096FF 100%); }
.stat-icon-box.bg-orange { background: linear-gradient(135deg, #FA8C16 0%, #FFC069 100%); }
.stat-icon-box.bg-green { background: linear-gradient(135deg, #52C41A 0%, #95DE64 100%); }
.stat-icon-box.bg-red { background: linear-gradient(135deg, #F5222D 0%, #FF7875 100%); }

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 13px;
  color: #86909C;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1D2129;
  line-height: 1;
}

.stat-trend {
  font-size: 12px;
  color: #52C41A;
}

.stat-trend.warning {
  color: #FA8C16;
}

/* 导出按钮样式 */
.btn-export-action {
  border-color: #52C41A !important;
  color: #52C41A !important;
  background-color: #F6FFED !important;
}

.btn-export-action:hover {
  border-color: #73D13D !important;
  color: #73D13D !important;
  background-color: #F6FFED !important;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .message-stats-panel {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .template-grid-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .message-stats-panel {
    grid-template-columns: 1fr;
  }
  
  .template-grid-list {
    grid-template-columns: 1fr;
  }
  
  .filter-layout-fields-inline-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .field-item-cell {
    margin-right: 0;
    margin-bottom: 12px;
    width: 100%;
  }
  
  .actions-flex-buttons-group {
    margin-left: 0;
    width: 100%;
  }
}

/* ==========================================================================
   消息行切换动画效果
   ========================================================================== */
.message-row-move {
  transition: transform 0.4s ease;
}

.message-row-enter-active {
  transition: all 0.3s ease-out;
}

.message-row-leave-active {
  transition: all 0.2s ease-in;
}

.message-row-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.message-row-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 状态切换高亮动画 */
@keyframes statusChangeFlash {
  0% { background-color: rgba(22, 119, 255, 0.1); }
  50% { background-color: rgba(22, 119, 255, 0.05); }
  100% { background-color: transparent; }
}

.status-changed-highlight {
  animation: statusChangeFlash 0.6s ease-out;
}

/* 已读状态淡入效果 */
@keyframes readStatusFade {
  from {
    color: #1677FF;
    font-weight: 500;
  }
  to {
    color: #86909C;
    font-weight: 400;
  }
}

.read-status-animate {
  animation: readStatusFade 0.4s ease-out;
}
</style>