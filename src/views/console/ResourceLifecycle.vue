<template>
  <div class="resource-lifecycle-page">
    <!-- 顶部统计 -->
    <div class="lifecycle-stats-row">
      <div class="lifecycle-stat-card">
        <div class="stat-icon-wrap stat-blue">
          <el-icon :size="24"><Document /></el-icon>
        </div>
        <div class="stat-content-wrap">
          <div class="stat-label-text">申请总数</div>
          <div class="stat-number">{{ lifecycleStats.total }}</div>
          <div class="stat-sub-text">本季度</div>
        </div>
      </div>
      <div class="lifecycle-stat-card">
        <div class="stat-icon-wrap stat-orange">
          <el-icon :size="24"><Loading /></el-icon>
        </div>
        <div class="stat-content-wrap">
          <div class="stat-label-text">审批中</div>
          <div class="stat-number">{{ lifecycleStats.pending }}</div>
          <div class="stat-sub-text">平均 2.3h</div>
        </div>
      </div>
      <div class="lifecycle-stat-card">
        <div class="stat-icon-wrap stat-green">
          <el-icon :size="24"><CircleCheck /></el-icon>
        </div>
        <div class="stat-content-wrap">
          <div class="stat-label-text">运行中</div>
          <div class="stat-number">{{ lifecycleStats.running }}</div>
          <div class="stat-sub-text">开通率 92%</div>
        </div>
      </div>
      <div class="lifecycle-stat-card">
        <div class="stat-icon-wrap stat-purple">
          <el-icon :size="24"><Clock /></el-icon>
        </div>
        <div class="stat-content-wrap">
          <div class="stat-label-text">即将到期</div>
          <div class="stat-number">{{ lifecycleStats.expiring }}</div>
          <div class="stat-sub-text warning-text">30天内</div>
        </div>
      </div>
      <div class="lifecycle-stat-card">
        <div class="stat-icon-wrap stat-gray">
          <el-icon :size="24"><Delete /></el-icon>
        </div>
        <div class="stat-content-wrap">
          <div class="stat-label-text">已退订</div>
          <div class="stat-number">{{ lifecycleStats.retired }}</div>
          <div class="stat-sub-text">本年</div>
        </div>
      </div>
    </div>

    <!-- 主体两列布局：左侧资源列表 + 右侧详情 -->
    <div class="lifecycle-main-row">
      <!-- 左侧：资源列表 -->
      <div class="resource-list-card">
        <div class="resource-list-header">
          <h3 class="list-title">资源列表</h3>
          <div class="list-search-area">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索资源ID/名称"
              clearable
              size="small"
              :prefix-icon="Search"
            />
            <el-select v-model="filterStage" placeholder="筛选阶段" clearable size="small" style="width: 120px">
              <el-option v-for="opt in stageOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </div>
        </div>
        <div class="resource-items-scroll">
          <div
            v-for="item in filteredResourceList"
            :key="item.id"
            :class="['resource-item', { active: selectedResourceId === item.id }]"
            @click="selectResource(item.id)"
          >
            <div class="resource-item-top">
              <span class="resource-name-text">{{ item.name }}</span>
              <el-tag :type="getStageTagType(item.currentStage)" size="small" effect="light">
                {{ getStageLabel(item.currentStage) }}
              </el-tag>
            </div>
            <div class="resource-item-meta">
              <span class="resource-type-text">{{ item.type }}</span>
              <span class="meta-divider">·</span>
              <span class="resource-id-text">{{ item.id }}</span>
            </div>
            <div class="resource-item-progress">
              <div class="mini-step-bar">
                <div
                  v-for="(step, idx) in lifecycleStages"
                  :key="step.key"
                  :class="['mini-step', {
                    'done': idx < getStageIndex(item.currentStage),
                    'active': idx === getStageIndex(item.currentStage)
                  }]"
                ></div>
              </div>
              <span class="progress-text">{{ getStageIndex(item.currentStage) + 1 }}/{{ lifecycleStages.length }}</span>
            </div>
          </div>
          <div v-if="filteredResourceList.length === 0" class="empty-list-tip">
            <el-empty description="未找到匹配的资源" :image-size="60" />
          </div>
        </div>
      </div>

      <!-- 右侧：详情 -->
      <div class="resource-detail-card" v-if="currentResource">
        <!-- 资源概览 -->
        <div class="detail-section-card">
          <div class="detail-section-header">
            <div class="resource-title-row">
              <h2 class="resource-big-name">{{ currentResource.name }}</h2>
              <el-tag :type="getStageTagType(currentResource.currentStage)" effect="dark">
                {{ getStageLabel(currentResource.currentStage) }}
              </el-tag>
            </div>
            <div class="resource-quick-actions">
              <el-button size="small" :icon="View" @click="goResourceDetail">查看详情</el-button>
              <el-button
                v-if="currentResource.currentStage === 'running'"
                size="small"
                type="warning"
                :icon="Refresh"
                @click="handleRenew"
              >续费</el-button>
              <el-button
                v-if="currentResource.currentStage === 'running' || currentResource.currentStage === 'expiring'"
                size="small"
                type="danger"
                :icon="Delete"
                @click="handleRetire"
              >退订</el-button>
            </div>
          </div>

          <div class="resource-info-grid">
            <div class="info-grid-item">
              <div class="info-label">资源ID</div>
              <div class="info-value font-code">{{ currentResource.id }}</div>
            </div>
            <div class="info-grid-item">
              <div class="info-label">资源类型</div>
              <div class="info-value">{{ currentResource.type }}</div>
            </div>
            <div class="info-grid-item">
              <div class="info-label">所属区域</div>
              <div class="info-value">{{ currentResource.region }}</div>
            </div>
            <div class="info-grid-item">
              <div class="info-label">供给方</div>
              <div class="info-value">{{ currentResource.provider }}</div>
            </div>
            <div class="info-grid-item">
              <div class="info-label">规格</div>
              <div class="info-value">{{ currentResource.spec }}</div>
            </div>
            <div class="info-grid-item">
              <div class="info-label">月费</div>
              <div class="info-value price-text">¥{{ currentResource.monthlyFee.toLocaleString() }}</div>
            </div>
          </div>
        </div>

        <!-- 生命周期时间线 -->
        <div class="detail-section-card">
          <div class="section-title-row">
            <span class="blue-v-line"></span>
            <span class="section-title-text">生命周期时间线</span>
            <span class="duration-text">总耗时 {{ totalDurationText }}</span>
          </div>
          <div class="lifecycle-timeline-container">
            <div
              v-for="(stage, idx) in currentResource.history"
              :key="stage.id"
              :class="['timeline-stage-item', stage.status]"
            >
              <div class="stage-dot-circle" :class="stage.status">
                <el-icon v-if="stage.status === 'completed'" :size="14"><Check /></el-icon>
                <el-icon v-else-if="stage.status === 'current'" :size="14"><Loading /></el-icon>
                <el-icon v-else :size="14"><Clock /></el-icon>
              </div>
              <div class="stage-content-block">
                <div class="stage-title-row">
                  <span class="stage-name-text">{{ stage.stageName }}</span>
                  <el-tag
                    :type="getStageStatusType(stage.status)"
                    size="small"
                    effect="plain"
                  >
                    {{ getStageStatusLabel(stage.status) }}
                  </el-tag>
                </div>
                <div class="stage-time-text">{{ stage.startTime }} → {{ stage.endTime || '进行中' }}</div>
                <div v-if="stage.description" class="stage-desc-text">{{ stage.description }}</div>
                <div v-if="stage.operator" class="stage-operator-text">
                  <el-icon :size="12"><User /></el-icon>
                  <span>操作人：{{ stage.operator }}</span>
                </div>
                <div v-if="stage.attachments && stage.attachments.length" class="stage-attachments">
                  <div
                    v-for="(att, i) in stage.attachments"
                    :key="i"
                    class="attachment-chip"
                  >
                    <el-icon :size="12"><Paperclip /></el-icon>
                    <span>{{ att }}</span>
                  </div>
                </div>
              </div>
              <div v-if="idx < currentResource.history.length - 1" class="stage-connector-line" :class="stage.status"></div>
            </div>
          </div>
        </div>

        <!-- 资源使用统计 -->
        <div class="detail-section-card">
          <div class="section-title-row">
            <span class="blue-v-line"></span>
            <span class="section-title-text">资源使用统计</span>
          </div>
          <div class="usage-stats-grid">
            <div class="usage-stat-item">
              <div class="usage-stat-label">运行时长</div>
              <div class="usage-stat-value">{{ currentResource.usage.runtimeHours }}<span class="unit-text">小时</span></div>
              <div class="usage-stat-trend">累计</div>
            </div>
            <div class="usage-stat-item">
              <div class="usage-stat-label">平均CPU</div>
              <div class="usage-stat-value">{{ currentResource.usage.avgCpu }}<span class="unit-text">%</span></div>
              <div class="usage-stat-trend">{{ currentResource.usage.avgCpuPeak > 80 ? '高峰' : '正常' }}</div>
            </div>
            <div class="usage-stat-item">
              <div class="usage-stat-label">平均GPU</div>
              <div class="usage-stat-value">{{ currentResource.usage.avgGpu }}<span class="unit-text">%</span></div>
              <div class="usage-stat-trend">利用率良好</div>
            </div>
            <div class="usage-stat-item">
              <div class="usage-stat-label">网络流量</div>
              <div class="usage-stat-value">{{ currentResource.usage.totalTraffic }}<span class="unit-text">GB</span></div>
              <div class="usage-stat-trend">累计</div>
            </div>
            <div class="usage-stat-item">
              <div class="usage-stat-label">告警次数</div>
              <div class="usage-stat-value">{{ currentResource.usage.alarmCount }}</div>
              <div class="usage-stat-trend" :class="currentResource.usage.alarmCount > 0 ? 'warning-text' : 'success-text'">
                {{ currentResource.usage.alarmCount > 0 ? '需关注' : '运行稳定' }}
              </div>
            </div>
            <div class="usage-stat-item">
              <div class="usage-stat-label">累计消费</div>
              <div class="usage-stat-value price-text">¥{{ currentResource.usage.totalCost.toLocaleString() }}</div>
              <div class="usage-stat-trend">已发生</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="resource-detail-empty">
        <el-empty description="请从左侧选择资源查看生命周期" :image-size="120" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search, Document, Loading, CircleCheck, Clock, Delete, Refresh, View,
  Check, User, Paperclip
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const searchKeyword = ref('')
const filterStage = ref('')
const selectedResourceId = ref('r-001')

// 生命周期阶段定义
const lifecycleStages = [
  { key: 'applied', label: '已申请' },
  { key: 'approving', label: '审批中' },
  { key: 'provisioning', label: '开通中' },
  { key: 'running', label: '运行中' },
  { key: 'expiring', label: '即将到期' },
  { key: 'retired', label: '已退订' }
]

const stageOptions = [
  { value: 'applied', label: '已申请' },
  { value: 'approving', label: '审批中' },
  { value: 'provisioning', label: '开通中' },
  { value: 'running', label: '运行中' },
  { value: 'expiring', label: '即将到期' },
  { value: 'retired', label: '已退订' }
]

// 统计数据
const lifecycleStats = ref({
  total: 28,
  pending: 3,
  running: 18,
  expiring: 4,
  retired: 3
})

// 资源数据（带完整生命周期历史）
const resourceList = ref([
  {
    id: 'r-001',
    name: 'GPU计算实例-01',
    type: '裸金属',
    region: '萧山区',
    provider: '中国移动',
    spec: 'NVIDIA A100 × 8',
    monthlyFee: 12800,
    currentStage: 'running',
    history: [
      { id: 'h1', stageName: '提交申请', status: 'completed', startTime: '2026-01-15 09:00', endTime: '2026-01-15 09:00', description: '客户提交智算服务订单', operator: 'admin', attachments: ['需求文档.pdf'] },
      { id: 'h2', stageName: '需求审批', status: 'completed', startTime: '2026-01-15 09:00', endTime: '2026-01-15 11:30', description: '审核资源规格与配额', operator: '张经理', attachments: [] },
      { id: 'h3', stageName: '资源开通', status: 'completed', startTime: '2026-01-15 11:30', endTime: '2026-01-15 15:45', description: '完成裸金属物理机配置、网络调测、操作系统安装', operator: '李工', attachments: ['开通报告.pdf', '网络配置.json'] },
      { id: 'h4', stageName: '投入使用', status: 'completed', startTime: '2026-01-15 15:45', endTime: '2026-01-15 16:00', description: '资源已交付客户使用', operator: 'system', attachments: [] },
      { id: 'h5', stageName: '运行维护', status: 'current', startTime: '2026-01-15 16:00', endTime: null, description: '资源稳定运行中，已持续 152 天', operator: 'system', attachments: [] },
      { id: 'h6', stageName: '到期退订', status: 'pending', startTime: '预计 2026-07-15', endTime: null, description: '资源将自动到期', operator: '', attachments: [] }
    ],
    usage: { runtimeHours: 3648, avgCpu: 65, avgCpuPeak: 92, avgGpu: 78, totalTraffic: 1280, alarmCount: 2, totalCost: 76800 }
  },
  {
    id: 'r-002',
    name: 'sherrytestalam1',
    type: '云主机',
    region: '拱墅区',
    provider: '中国联通',
    spec: 'Ascend 910B2 × 8',
    monthlyFee: 9600,
    currentStage: 'approving',
    history: [
      { id: 'h1', stageName: '提交申请', status: 'completed', startTime: '2026-06-10 14:20', endTime: '2026-06-10 14:20', description: '客户提交云主机订单', operator: 'admin', attachments: [] },
      { id: 'h2', stageName: '需求审批', status: 'current', startTime: '2026-06-10 14:20', endTime: null, description: '等待技术评审', operator: '', attachments: [] },
      { id: 'h3', stageName: '资源开通', status: 'pending', startTime: '待开始', endTime: null, description: '', operator: '', attachments: [] },
      { id: 'h4', stageName: '投入使用', status: 'pending', startTime: '待开始', endTime: null, description: '', operator: '', attachments: [] },
      { id: 'h5', stageName: '运行维护', status: 'pending', startTime: '待开始', endTime: null, description: '', operator: '', attachments: [] },
      { id: 'h6', stageName: '到期退订', status: 'pending', startTime: '待开始', endTime: null, description: '', operator: '', attachments: [] }
    ],
    usage: { runtimeHours: 0, avgCpu: 0, avgCpuPeak: 0, avgGpu: 0, totalTraffic: 0, alarmCount: 0, totalCost: 0 }
  },
  {
    id: 'r-003',
    name: 'AI推理服务器-02',
    type: '裸金属',
    region: '拱墅区',
    provider: '华为云',
    spec: 'NVIDIA H100 × 4',
    monthlyFee: 15600,
    currentStage: 'expiring',
    history: [
      { id: 'h1', stageName: '提交申请', status: 'completed', startTime: '2025-08-20 10:00', endTime: '2025-08-20 10:00', description: 'AI 推理专项资源申请', operator: 'admin', attachments: ['项目计划.docx'] },
      { id: 'h2', stageName: '需求审批', status: 'completed', startTime: '2025-08-20 10:00', endTime: '2025-08-20 14:00', description: '技术委员会通过', operator: '王总监', attachments: [] },
      { id: 'h3', stageName: '资源开通', status: 'completed', startTime: '2025-08-20 14:00', endTime: '2025-08-22 18:00', description: '完成 2 台裸金属开通', operator: '张工组', attachments: ['开通报告.pdf'] },
      { id: 'h4', stageName: '投入使用', status: 'completed', startTime: '2025-08-22 18:00', endTime: '2025-08-22 18:30', description: '客户验收通过', operator: 'admin', attachments: [] },
      { id: 'h5', stageName: '运行维护', status: 'completed', startTime: '2025-08-22 18:30', endTime: '2026-06-25 23:59', description: '稳定运行 305 天，零故障', operator: 'system', attachments: [] },
      { id: 'h6', stageName: '即将到期', status: 'current', startTime: '2026-06-25 23:59', endTime: null, description: '剩余 7 天到期，请及时续费', operator: 'system', attachments: [] }
    ],
    usage: { runtimeHours: 7320, avgCpu: 72, avgCpuPeak: 96, avgGpu: 88, totalTraffic: 2580, alarmCount: 0, totalCost: 156000 }
  },
  {
    id: 'r-004',
    name: '数据处理集群',
    type: '云主机',
    region: '萧山区',
    provider: '中国移动',
    spec: 'Ascend 910B × 2',
    monthlyFee: 6800,
    currentStage: 'provisioning',
    history: [
      { id: 'h1', stageName: '提交申请', status: 'completed', startTime: '2026-06-08 16:00', endTime: '2026-06-08 16:00', description: '数据处理任务资源申请', operator: 'admin', attachments: [] },
      { id: 'h2', stageName: '需求审批', status: 'completed', startTime: '2026-06-08 16:00', endTime: '2026-06-09 10:00', description: '快速审批通过', operator: '李经理', attachments: [] },
      { id: 'h3', stageName: '资源开通', status: 'current', startTime: '2026-06-09 10:00', endTime: null, description: '正在配置网络与存储', operator: '王工', attachments: [] },
      { id: 'h4', stageName: '投入使用', status: 'pending', startTime: '待开始', endTime: null, description: '', operator: '', attachments: [] },
      { id: 'h5', stageName: '运行维护', status: 'pending', startTime: '待开始', endTime: null, description: '', operator: '', attachments: [] },
      { id: 'h6', stageName: '到期退订', status: 'pending', startTime: '待开始', endTime: null, description: '', operator: '', attachments: [] }
    ],
    usage: { runtimeHours: 0, avgCpu: 0, avgCpuPeak: 0, avgGpu: 0, totalTraffic: 0, alarmCount: 0, totalCost: 0 }
  },
  {
    id: 'r-005',
    name: 'work-910b-eekzk1',
    type: '容器',
    region: '萧山区',
    provider: '阿里云',
    spec: 'CPU 192核 / 内存 1TB',
    monthlyFee: 4200,
    currentStage: 'retired',
    history: [
      { id: 'h1', stageName: '提交申请', status: 'completed', startTime: '2025-04-01 10:00', endTime: '2025-04-01 10:00', description: '容器集群部署', operator: 'admin', attachments: [] },
      { id: 'h2', stageName: '需求审批', status: 'completed', startTime: '2025-04-01 10:00', endTime: '2025-04-01 15:00', description: '审批通过', operator: '张经理', attachments: [] },
      { id: 'h3', stageName: '资源开通', status: 'completed', startTime: '2025-04-01 15:00', endTime: '2025-04-02 09:00', description: 'Kubernetes 集群搭建', operator: '李工', attachments: [] },
      { id: 'h4', stageName: '投入使用', status: 'completed', startTime: '2025-04-02 09:00', endTime: '2025-04-02 10:00', description: '完成部署', operator: 'admin', attachments: [] },
      { id: 'h5', stageName: '运行维护', status: 'completed', startTime: '2025-04-02 10:00', endTime: '2026-05-30 18:00', description: '稳定运行 14 个月', operator: 'system', attachments: [] },
      { id: 'h6', stageName: '已退订', status: 'completed', startTime: '2026-05-30 18:00', endTime: '2026-05-30 20:00', description: '客户主动退订，已完成数据清理', operator: 'admin', attachments: ['退订确认单.pdf', '数据销毁证明.pdf'] }
    ],
    usage: { runtimeHours: 10032, avgCpu: 58, avgCpuPeak: 88, avgGpu: 0, totalTraffic: 3200, alarmCount: 5, totalCost: 58800 }
  },
  {
    id: 'r-006',
    name: 'yintestLiantong',
    type: '裸金属',
    region: '萧山区',
    provider: '中国联通',
    spec: 'Huawei Atlas 300 × 2',
    monthlyFee: 5800,
    currentStage: 'applied',
    history: [
      { id: 'h1', stageName: '提交申请', status: 'current', startTime: '2026-06-15 11:00', endTime: null, description: '等待进入审批队列', operator: 'admin', attachments: ['需求说明.docx'] },
      { id: 'h2', stageName: '需求审批', status: 'pending', startTime: '待开始', endTime: null, description: '', operator: '', attachments: [] },
      { id: 'h3', stageName: '资源开通', status: 'pending', startTime: '待开始', endTime: null, description: '', operator: '', attachments: [] },
      { id: 'h4', stageName: '投入使用', status: 'pending', startTime: '待开始', endTime: null, description: '', operator: '', attachments: [] },
      { id: 'h5', stageName: '运行维护', status: 'pending', startTime: '待开始', endTime: null, description: '', operator: '', attachments: [] },
      { id: 'h6', stageName: '到期退订', status: 'pending', startTime: '待开始', endTime: null, description: '', operator: '', attachments: [] }
    ],
    usage: { runtimeHours: 0, avgCpu: 0, avgCpuPeak: 0, avgGpu: 0, totalTraffic: 0, alarmCount: 0, totalCost: 0 }
  }
])

// 计算属性：过滤后的资源列表
const filteredResourceList = computed(() => {
  let list = resourceList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item =>
      item.name.toLowerCase().includes(kw) || item.id.toLowerCase().includes(kw)
    )
  }
  if (filterStage.value) {
    list = list.filter(item => item.currentStage === filterStage.value)
  }
  return list
})

// 当前选中的资源
const currentResource = computed(() => {
  return resourceList.value.find(item => item.id === selectedResourceId.value)
})

// 总耗时文本
const totalDurationText = computed(() => {
  if (!currentResource.value) return '--'
  const stage = currentResource.value
  // 简单模拟：根据当前阶段返回
  const map: Record<string, string> = {
    'applied': '< 1 小时',
    'approving': '2.5 小时',
    'provisioning': '5 天',
    'running': '152 天',
    'expiring': '305 天',
    'retired': '14 个月'
  }
  return map[stage.currentStage] || '--'
})

// 方法
const getStageIndex = (stage: string) => {
  return lifecycleStages.findIndex(s => s.key === stage)
}

const getStageLabel = (stage: string) => {
  return lifecycleStages.find(s => s.key === stage)?.label || stage
}

const getStageTagType = (stage: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    'applied': 'info',
    'approving': 'warning',
    'provisioning': 'warning',
    'running': 'success',
    'expiring': 'danger',
    'retired': 'info'
  }
  return map[stage] || 'info'
}

const getStageStatusType = (status: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    'completed': 'success',
    'current': 'warning',
    'pending': 'info'
  }
  return map[status] || 'info'
}

const getStageStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    'completed': '已完成',
    'current': '进行中',
    'pending': '未开始'
  }
  return map[status] || status
}

const selectResource = (id: string) => {
  selectedResourceId.value = id
}

const goResourceDetail = () => {
  if (!currentResource.value) return
  router.push({
    path: '/console/resource-detail',
    query: { id: currentResource.value.id }
  })
}

const handleRenew = () => {
  ElMessageBox.confirm(
    `确认对资源 "${currentResource.value?.name}" 进行续费？`,
    '续费确认',
    { confirmButtonText: '确认续费', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('续费申请已提交')
  }).catch(() => {})
}

const handleRetire = () => {
  ElMessageBox.confirm(
    `确认退订资源 "${currentResource.value?.name}"？退订后将清除所有数据。`,
    '退订确认',
    { confirmButtonText: '确认退订', cancelButtonText: '取消', type: 'error' }
  ).then(() => {
    ElMessage.success('退订申请已提交')
  }).catch(() => {})
}
</script>

<style scoped>
.resource-lifecycle-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ==================== 顶部统计 ==================== */
.lifecycle-stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.lifecycle-stat-card {
  background: #fff;
  padding: 16px 18px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.04);
  display: flex;
  align-items: center;
  gap: 14px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.lifecycle-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 21, 41, 0.08);
}

.stat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.stat-blue { background: linear-gradient(135deg, #1677FF, #4096FF); }
.stat-orange { background: linear-gradient(135deg, #FA8C16, #FFC069); }
.stat-green { background: linear-gradient(135deg, #52C41A, #73D13D); }
.stat-purple { background: linear-gradient(135deg, #722ED1, #9254DE); }
.stat-gray { background: linear-gradient(135deg, #86909C, #B5BDC9); }

.stat-content-wrap {
  flex: 1;
}

.stat-label-text {
  font-size: 13px;
  color: #86909C;
  margin-bottom: 4px;
}

.stat-number {
  font-size: 22px;
  font-weight: 600;
  color: #1D2129;
  line-height: 1.2;
}

.stat-sub-text {
  font-size: 11px;
  color: #C9CDD4;
  margin-top: 2px;
}

.warning-text { color: #FA8C16; }
.success-text { color: #52C41A; }

/* ==================== 主体两列布局 ==================== */
.lifecycle-main-row {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 16px;
  min-height: 600px;
}

/* 左侧资源列表 */
.resource-list-card {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.04);
  display: flex;
  flex-direction: column;
}

.resource-list-header {
  margin-bottom: 12px;
}

.list-title {
  font-size: 15px;
  font-weight: 600;
  color: #1D2129;
  margin: 0 0 10px 0;
}

.list-search-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resource-items-scroll {
  flex: 1;
  overflow-y: auto;
  max-height: 580px;
  padding-right: 4px;
}

.resource-items-scroll::-webkit-scrollbar {
  width: 4px;
}

.resource-items-scroll::-webkit-scrollbar-thumb {
  background: #C9CDD4;
  border-radius: 2px;
}

.resource-item {
  background: #F7F8FA;
  border: 1px solid #F0F2F5;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.resource-item:hover {
  background: #fff;
  border-color: #1677FF;
}

.resource-item.active {
  background: #E6F4FF;
  border-color: #1677FF;
  box-shadow: 0 2px 6px rgba(22, 119, 255, 0.12);
}

.resource-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.resource-name-text {
  font-size: 13px;
  font-weight: 600;
  color: #1D2129;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.resource-item-meta {
  font-size: 11px;
  color: #86909C;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.resource-id-text {
  font-family: 'Consolas', 'Monaco', monospace;
}

.meta-divider { color: #C9CDD4; }

.resource-item-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mini-step-bar {
  display: flex;
  gap: 2px;
  flex: 1;
}

.mini-step {
  flex: 1;
  height: 4px;
  background: #E5E6EB;
  border-radius: 2px;
  transition: background 0.3s;
}

.mini-step.done { background: #52C41A; }
.mini-step.active { background: #1677FF; }

.progress-text {
  font-size: 11px;
  color: #86909C;
  min-width: 30px;
  text-align: right;
}

.empty-list-tip {
  padding: 20px 0;
}

/* 右侧详情 */
.resource-detail-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resource-detail-empty {
  background: #fff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.04);
  min-height: 400px;
}

.detail-section-card {
  background: #fff;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.04);
}

.detail-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.resource-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.resource-big-name {
  font-size: 18px;
  font-weight: 600;
  color: #1D2129;
  margin: 0;
}

.resource-quick-actions {
  display: flex;
  gap: 8px;
}

.resource-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  background: #F7F8FA;
  border-radius: 6px;
  padding: 16px;
}

.info-grid-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #86909C;
}

.info-value {
  font-size: 14px;
  color: #1D2129;
  font-weight: 500;
}

.font-code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
}

.price-text {
  color: #FA8C16;
  font-weight: 600;
}

/* 区块标题 */
.section-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.blue-v-line {
  display: inline-block;
  width: 3px;
  height: 14px;
  background: #1677FF;
  border-radius: 2px;
}

.section-title-text {
  font-size: 15px;
  font-weight: 600;
  color: #1D2129;
}

.duration-text {
  margin-left: auto;
  font-size: 12px;
  color: #86909C;
  background: #F0F5FF;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 时间线 */
.lifecycle-timeline-container {
  position: relative;
}

.timeline-stage-item {
  position: relative;
  display: flex;
  gap: 16px;
  padding-bottom: 24px;
}

.timeline-stage-item:last-child {
  padding-bottom: 0;
}

.stage-dot-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  z-index: 1;
  font-weight: 600;
}

.stage-dot-circle.completed { background: linear-gradient(135deg, #52C41A, #73D13D); }
.stage-dot-circle.current {
  background: linear-gradient(135deg, #1677FF, #4096FF);
  box-shadow: 0 0 0 4px rgba(22, 119, 255, 0.2);
  animation: pulse 2s infinite;
}
.stage-dot-circle.pending { background: #E5E6EB; color: #86909C; }

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(22, 119, 255, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(22, 119, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(22, 119, 255, 0); }
}

.stage-content-block {
  flex: 1;
  background: #F7F8FA;
  border-radius: 6px;
  padding: 12px 16px;
  border-left: 3px solid #E5E6EB;
  min-width: 0;
}

.timeline-stage-item.completed .stage-content-block { border-left-color: #52C41A; }
.timeline-stage-item.current .stage-content-block {
  border-left-color: #1677FF;
  background: #F0F5FF;
}

.stage-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.stage-name-text {
  font-size: 14px;
  font-weight: 600;
  color: #1D2129;
}

.stage-time-text {
  font-size: 12px;
  color: #86909C;
  font-family: 'Consolas', 'Monaco', monospace;
  margin-bottom: 6px;
}

.stage-desc-text {
  font-size: 13px;
  color: #4E5969;
  line-height: 1.6;
  margin-bottom: 6px;
}

.stage-operator-text {
  font-size: 12px;
  color: #86909C;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.stage-attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.attachment-chip {
  background: #fff;
  border: 1px solid #E5E6EB;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  color: #4E5969;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stage-connector-line {
  position: absolute;
  left: 15px;
  top: 32px;
  bottom: -8px;
  width: 2px;
  background: #E5E6EB;
}

.stage-connector-line.completed { background: #52C41A; }

/* 使用统计 */
.usage-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.usage-stat-item {
  background: #F7F8FA;
  border-radius: 6px;
  padding: 14px 16px;
  border: 1px solid #F0F2F5;
}

.usage-stat-label {
  font-size: 12px;
  color: #86909C;
  margin-bottom: 6px;
}

.usage-stat-value {
  font-size: 22px;
  font-weight: 600;
  color: #1D2129;
  line-height: 1.2;
}

.unit-text {
  font-size: 12px;
  color: #86909C;
  font-weight: normal;
  margin-left: 2px;
}

.usage-stat-trend {
  font-size: 11px;
  color: #C9CDD4;
  margin-top: 4px;
}

/* 响应式 */
@media (max-width: 1400px) {
  .lifecycle-stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
  .resource-info-grid,
  .usage-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1100px) {
  .lifecycle-main-row {
    grid-template-columns: 1fr;
  }
  .resource-items-scroll {
    max-height: 300px;
  }
}

@media (max-width: 768px) {
  .lifecycle-stats-row {
    grid-template-columns: 1fr;
  }
  .resource-info-grid,
  .usage-stats-grid {
    grid-template-columns: 1fr;
  }
  .resource-quick-actions {
    flex-wrap: wrap;
  }
}
</style>
