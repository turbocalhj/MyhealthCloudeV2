<template>
  <!-- 控制台首页模块：数据可视化仪表盘 -->
  <div class="console-dashboard-page">
    <!-- 统计卡片区域 -->
    <div class="stats-cards-row">
      <div class="stat-card">
        <div class="stat-icon-box bg-blue">
          <el-icon :size="28"><Cpu /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">总资源数</div>
          <div class="stat-value">{{ stats.totalResources }}</div>
          <div class="stat-trend up">
            <el-icon><CaretTop /></el-icon>
            <span>较上月 +{{ stats.resourceGrowth }}%</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-box bg-green">
          <el-icon :size="28"><CircleCheck /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">运行中</div>
          <div class="stat-value">{{ stats.runningResources }}</div>
          <div class="stat-trend">
            <span>占比 {{ stats.runningPercent }}%</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-box bg-orange">
          <el-icon :size="28"><Warning /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">即将到期</div>
          <div class="stat-value">{{ stats.expiringSoon }}</div>
          <div class="stat-trend warning">
            <span>7天内到期</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-box bg-purple">
          <el-icon :size="28"><Wallet /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">本月费用</div>
          <div class="stat-value">¥{{ stats.monthlyCost.toLocaleString() }}</div>
          <div class="stat-trend down">
            <el-icon><CaretBottom /></el-icon>
            <span>较上月 -{{ stats.costDecrease }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域：资源使用趋势 + 资源类型分布 -->
    <div class="charts-grid-row">
      <!-- 资源使用趋势 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">资源使用趋势</h3>
          <el-radio-group v-model="usageTimeRange" size="small">
            <el-radio-button label="week">近7天</el-radio-button>
            <el-radio-button label="month">近30天</el-radio-button>
          </el-radio-group>
        </div>
        <div class="chart-body">
          <div class="usage-chart-placeholder">
            <div class="chart-y-axis">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            <div class="chart-area">
              <svg viewBox="0 0 400 180" class="chart-svg">
                <!-- 网格线 -->
                <g class="grid-lines">
                  <line v-for="(y, i) in [36, 72, 108, 144]" :key="i" x1="0" :y1="y" x2="400" :y2="y" stroke="#F0F2F5" stroke-width="1" />
                </g>
                <!-- 渐变定义 -->
                <defs>
                  <linearGradient id="cpuAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="rgba(22, 119, 255, 0.3)" />
                    <stop offset="100%" stop-color="rgba(22, 119, 255, 0)" />
                  </linearGradient>
                </defs>
                <!-- CPU 使用率曲线 -->
                <polyline
                  :points="cpuUsageAreaPoints"
                  fill="url(#cpuAreaGradient)"
                  stroke="none"
                />
                <polyline
                  :points="cpuUsagePoints"
                  fill="none"
                  stroke="#1677FF"
                  stroke-width="2.5"
                />
                <!-- 内存使用率曲线 -->
                <polyline
                  :points="memoryUsagePoints"
                  fill="none"
                  stroke="#722ED1"
                  stroke-width="2.5"
                />
                <!-- GPU 使用率曲线 -->
                <polyline
                  :points="gpuUsagePoints"
                  fill="none"
                  stroke="#FA8C16"
                  stroke-width="2.5"
                />
                <!-- 数据点 -->
                <g v-for="(point, i) in cpuUsageDataPoints" :key="'cpu-' + i">
                  <circle :cx="point.x" :cy="point.y" r="3" fill="#1677FF" />
                </g>
              </svg>
            </div>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot blue"></span>CPU</span>
            <span class="legend-item"><span class="legend-dot purple"></span>内存</span>
            <span class="legend-item"><span class="legend-dot orange"></span>GPU</span>
          </div>
        </div>
      </div>

      <!-- 资源类型分布 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">资源类型分布</h3>
        </div>
        <div class="chart-body">
          <div class="pie-chart-container">
            <div class="pie-chart">
              <svg viewBox="0 0 200 200">
                <!-- 裸金属 -->
                <circle
                  cx="100" cy="100" r="80" fill="none" stroke="#1677FF" stroke-width="40"
                  :stroke-dasharray="`${(stats.bmsCount / stats.totalResources) * 502 * 0.8} 502`"
                  stroke-dashoffset="0" transform="rotate(-90 100 100)"
                  class="pie-segment"
                />
                <!-- 云主机 -->
                <circle
                  cx="100" cy="100" r="80" fill="none" stroke="#52C41A" stroke-width="40"
                  :stroke-dasharray="`${(stats.ecsCount / stats.totalResources) * 502 * 0.8} 502`"
                  :stroke-dashoffset="`-${(stats.bmsCount / stats.totalResources) * 502 * 0.8}`"
                  transform="rotate(-90 100 100)"
                  class="pie-segment"
                />
                <!-- 容器 -->
                <circle
                  cx="100" cy="100" r="80" fill="none" stroke="#FA8C16" stroke-width="40"
                  :stroke-dasharray="`${(stats.containerCount / stats.totalResources) * 502 * 0.8} 502`"
                  :stroke-dashoffset="`-${((stats.bmsCount + stats.ecsCount) / stats.totalResources) * 502 * 0.8}`"
                  transform="rotate(-90 100 100)"
                  class="pie-segment"
                />
                <!-- 通算 -->
                <circle
                  cx="100" cy="100" r="80" fill="none" stroke="#722ED1" stroke-width="40"
                  :stroke-dasharray="`${(stats.generalCount / stats.totalResources) * 502 * 0.8} 502`"
                  :stroke-dashoffset="`-${((stats.bmsCount + stats.ecsCount + stats.containerCount) / stats.totalResources) * 502 * 0.8}`"
                  transform="rotate(-90 100 100)"
                  class="pie-segment"
                />
                <!-- 中心文字 -->
                <text x="100" y="95" text-anchor="middle" font-size="24" font-weight="bold" fill="#1D2129">{{ stats.totalResources }}</text>
                <text x="100" y="115" text-anchor="middle" font-size="12" fill="#86909C">总资源</text>
              </svg>
            </div>
            <div class="pie-legend">
              <div class="pie-legend-item">
                <span class="pie-dot blue"></span>
                <span class="pie-label">裸金属 <strong>{{ stats.bmsCount }}</strong></span>
              </div>
              <div class="pie-legend-item">
                <span class="pie-dot green"></span>
                <span class="pie-label">云主机 <strong>{{ stats.ecsCount }}</strong></span>
              </div>
              <div class="pie-legend-item">
                <span class="pie-dot orange"></span>
                <span class="pie-label">容器 <strong>{{ stats.containerCount }}</strong></span>
              </div>
              <div class="pie-legend-item">
                <span class="pie-dot purple"></span>
                <span class="pie-label">通算 <strong>{{ stats.generalCount }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 第二行图表：月度消费 + TOP5 资源占用 -->
    <div class="charts-second-row">
      <!-- 月度消费分析 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">月度消费分析</h3>
          <div class="chart-tag-info">
            <span class="tag-label">本年累计</span>
            <span class="tag-value">¥{{ stats.yearlyCost.toLocaleString() }}</span>
          </div>
        </div>
        <div class="chart-body">
          <div class="bar-chart-container">
            <div class="bar-chart-y-axis">
              <span v-for="y in [maxMonthlyCost, maxMonthlyCost * 0.75, maxMonthlyCost * 0.5, maxMonthlyCost * 0.25, 0]" :key="y">¥{{ Math.round(y / 1000) }}k</span>
            </div>
            <div class="bar-chart-area">
              <div
                v-for="(item, index) in monthlyCostData"
                :key="item.month"
                class="bar-item-wrapper"
                @mouseenter="hoveredBarIndex = index"
                @mouseleave="hoveredBarIndex = -1"
              >
                <div class="bar-tooltip" v-show="hoveredBarIndex === index">
                  <div class="tooltip-month">{{ item.month }}</div>
                  <div class="tooltip-amount">¥{{ item.amount.toLocaleString() }}</div>
                  <div class="tooltip-trend" :class="item.trend >= 0 ? 'up' : 'down'">
                    较上月 {{ item.trend >= 0 ? '+' : '' }}{{ item.trend }}%
                  </div>
                </div>
                <div
                  class="bar-fill"
                  :class="['bar-' + (item.trend >= 0 ? 'up' : 'down'), { 'bar-highlight': hoveredBarIndex === index }]"
                  :style="{ height: ((item.amount / maxMonthlyCost) * 100) + '%' }"
                >
                  <div class="bar-value-label" v-show="hoveredBarIndex === index">¥{{ (item.amount / 1000).toFixed(1) }}k</div>
                </div>
                <div class="bar-x-label">{{ item.month }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TOP5 资源占用排行 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">TOP5 资源占用排行</h3>
          <el-tag size="small" type="warning" effect="light">按 GPU 占用</el-tag>
        </div>
        <div class="chart-body">
          <div class="ranking-list">
            <div
              v-for="(item, index) in topRankingData"
              :key="item.id"
              class="ranking-item"
              @mouseenter="hoveredRankIndex = index"
              @mouseleave="hoveredRankIndex = -1"
            >
              <div class="rank-badge" :class="getRankClass(index)">
                <span v-if="index < 3">{{ ['🥇', '🥈', '🥉'][index] }}</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="rank-info">
                <div class="rank-name">{{ item.name }}</div>
                <div class="rank-meta">
                  <span class="rank-type">{{ item.type }}</span>
                  <span class="rank-divider">·</span>
                  <span class="rank-gpu">{{ item.gpuModel }} × {{ item.gpuNum }}</span>
                </div>
              </div>
              <div class="rank-progress-wrap">
                <div class="rank-progress">
                  <div
                    class="rank-progress-fill"
                    :class="getRankClass(index)"
                    :style="{ width: item.usagePercent + '%' }"
                  ></div>
                </div>
                <div class="rank-percent">{{ item.usagePercent }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 第三行：最近活动 + 快速操作 + 健康度 -->
    <div class="charts-third-row">
      <!-- 最近活动时间线 -->
      <div class="chart-card activity-card">
        <div class="chart-header">
          <h3 class="chart-title">最近活动</h3>
          <el-button text type="primary" size="small" @click="viewAllActivities">查看全部</el-button>
        </div>
        <div class="chart-body">
          <div class="activity-timeline">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="timeline-item"
            >
              <div class="timeline-dot" :class="getActivityClass(activity.type)">
                <el-icon :size="14">
                  <component :is="getActivityIcon(activity.type)" />
                </el-icon>
              </div>
              <div class="timeline-content">
                <div class="timeline-title">{{ activity.title }}</div>
                <div class="timeline-meta">
                  <span class="timeline-time">{{ activity.time }}</span>
                  <span class="timeline-user">{{ activity.user }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作面板 -->
      <div class="chart-card quick-action-card">
        <div class="chart-header">
          <h3 class="chart-title">快速操作</h3>
        </div>
        <div class="chart-body">
          <div class="quick-action-grid">
            <div
              v-for="action in quickActions"
              :key="action.path"
              class="quick-action-item"
              @click="router.push(action.path)"
            >
              <div class="action-icon-box" :class="action.colorClass">
                <el-icon :size="22">
                  <component :is="action.icon" />
                </el-icon>
              </div>
              <div class="action-label">{{ action.label }}</div>
              <div class="action-desc">{{ action.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 资源健康度评分 -->
      <div class="chart-card health-card">
        <div class="chart-header">
          <h3 class="chart-title">平台健康度</h3>
        </div>
        <div class="chart-body">
          <div class="health-score-wrap">
            <svg viewBox="0 0 120 120" class="health-ring-svg">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#F0F2F5" stroke-width="10" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke="url(#healthGradient)" stroke-width="10"
                stroke-linecap="round"
                :stroke-dasharray="`${healthScorePercent * 3.14} 314`"
                transform="rotate(-90 60 60)"
                class="health-progress-circle"
              />
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#52C41A" />
                  <stop offset="100%" stop-color="#1677FF" />
                </linearGradient>
              </defs>
            </svg>
            <div class="health-score-text">
              <div class="health-score-num">{{ healthScore }}</div>
              <div class="health-score-label">健康评分</div>
            </div>
          </div>
          <div class="health-metrics">
            <div class="health-metric-item">
              <div class="metric-name">资源可用率</div>
              <div class="metric-bar">
                <div class="metric-bar-fill green" :style="{ width: '98%' }"></div>
              </div>
              <div class="metric-value">98%</div>
            </div>
            <div class="health-metric-item">
              <div class="metric-name">网络稳定性</div>
              <div class="metric-bar">
                <div class="metric-bar-fill blue" :style="{ width: '95%' }"></div>
              </div>
              <div class="metric-value">95%</div>
            </div>
            <div class="health-metric-item">
              <div class="metric-name">故障恢复</div>
              <div class="metric-bar">
                <div class="metric-bar-fill purple" :style="{ width: '92%' }"></div>
              </div>
              <div class="metric-value">92%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 资源列表区域 -->
    <div class="resource-table-card">
      <div class="table-header-row">
        <h3 class="table-title">我的资源</h3>
        <div class="table-actions">
          <el-input v-model="searchQuery" placeholder="搜索资源名称或ID" class="table-search" clearable @keyup.enter="handleSearch" />
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </div>
      </div>

      <el-table :data="filteredTableData" style="width: 100%" size="default" :header-cell-style="{ background: '#f7f8fa', color: '#1d2129', fontWeight: '500' }">
        <el-table-column prop="id" label="资源ID" width="180" show-overflow-tooltip />
        <el-table-column prop="name" label="资源名称" width="160">
          <template #default="scope">
            <span class="blue-link-text" @click="goToDetail(scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="getResourceTypeTag(scope.row.type)" size="small">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="region" label="区域" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTag(scope.row.status)" size="small">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="gpuModel" label="显卡型号" width="140" />
        <el-table-column prop="gpuNum" label="显卡数量" width="100" align="center" />
        <el-table-column prop="expireDate" label="到期时间" width="160" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <span class="table-op-btn" @click="goToDetail(scope.row)">详情</span>
            <span class="table-op-btn danger-text" @click="handleDestroy(scope.row)">销毁</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container-row">
        <el-pagination 
          :total="filteredTableData.length" 
          :current-page="currentPage" 
          :page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, prev, pager, next, sizes, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search, Refresh, Cpu, CircleCheck, Warning, Wallet, CaretTop, CaretBottom,
  Plus, Document, Service, Bell, Operation, Setting
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const usageTimeRange = ref('week')

// 悬停状态
const hoveredBarIndex = ref(-1)
const hoveredRankIndex = ref(-1)

// 统计数据
const stats = ref({
  totalResources: 21,
  runningResources: 18,
  expiringSoon: 3,
  monthlyCost: 12580,
  yearlyCost: 142800,
  resourceGrowth: 12,
  costDecrease: 5,
  runningPercent: 86,
  bmsCount: 8,
  ecsCount: 6,
  containerCount: 4,
  generalCount: 3
})

// 资源数据
const tableData = ref([
  { id: '8716cee3-743b-4a72-a83', name: 'GPU计算实例-01', type: '裸金属', region: '萧山区', status: '运行中', gpuModel: 'NVIDIA A100', gpuNum: 8, vram: '320GB', cpu: '128核', memory: '1024GB', systemDisk: '894GB', expireDate: '2026-07-15' },
  { id: '8731370905908269056', name: 'yintestLiantong', type: '裸金属', region: '萧山区', status: '运行中', gpuModel: 'Huawei Atlas 300', gpuNum: 2, vram: '64GB', cpu: '104核', memory: '256GB', systemDisk: '--', expireDate: '2026-06-20' },
  { id: '825416335817216000', name: 'sherrytestalam1', type: '云主机', region: '拱墅区', status: '运行中', gpuModel: 'Ascend 910B2', gpuNum: 8, vram: '64GB', cpu: '128核', memory: '1536GB', systemDisk: '894GB', expireDate: '2026-06-18' },
  { id: '818855540908134400', name: 'work-910b-eekzk1', type: '容器', region: '萧山区', status: '已停止', gpuModel: '--', gpuNum: '--', vram: '--', cpu: '192核', memory: '1024GB', systemDisk: '894GB', expireDate: '2026-08-01' },
  { id: '8716cee3-743b-4a72-b94', name: 'AI推理服务器-02', type: '裸金属', region: '拱墅区', status: '运行中', gpuModel: 'NVIDIA H100', gpuNum: 4, vram: '320GB', cpu: '64核', memory: '512GB', systemDisk: '480GB', expireDate: '2026-06-15' },
  { id: '8731370905908269057', name: '数据处理集群', type: '云主机', region: '萧山区', status: '运行中', gpuModel: 'Ascend 910B', gpuNum: 2, vram: '64GB', cpu: '32核', memory: '256GB', systemDisk: '240GB', expireDate: '2026-09-01' }
])

const filteredTableData = computed(() => {
  if (!searchQuery.value) return tableData.value
  const query = searchQuery.value.toLowerCase()
  return tableData.value.filter(item =>
    item.id.toLowerCase().includes(query) ||
    item.name.toLowerCase().includes(query)
  )
})

// ==================== 月度消费分析 ====================
const monthlyCostData = ref([
  { month: '1月', amount: 10200, trend: -3 },
  { month: '2月', amount: 8800, trend: -14 },
  { month: '3月', amount: 11200, trend: 27 },
  { month: '4月', amount: 12500, trend: 12 },
  { month: '5月', amount: 13100, trend: 5 },
  { month: '6月', amount: 12580, trend: -4 },
  { month: '7月', amount: 14200, trend: 13 },
  { month: '8月', amount: 13800, trend: -3 },
  { month: '9月', amount: 14900, trend: 8 },
  { month: '10月', amount: 15600, trend: 5 },
  { month: '11月', amount: 14100, trend: -10 },
  { month: '12月', amount: 11820, trend: -16 }
])

const maxMonthlyCost = computed(() => {
  return Math.max(...monthlyCostData.value.map(d => d.amount)) * 1.15
})

// ==================== TOP5 资源占用排行 ====================
const topRankingData = ref([
  { id: 'r1', name: 'GPU计算实例-01', type: '裸金属', gpuModel: 'NVIDIA A100', gpuNum: 8, usagePercent: 96 },
  { id: 'r2', name: 'sherrytestalam1', type: '云主机', gpuModel: 'Ascend 910B2', gpuNum: 8, usagePercent: 88 },
  { id: 'r3', name: 'AI推理服务器-02', type: '裸金属', gpuModel: 'NVIDIA H100', gpuNum: 4, usagePercent: 82 },
  { id: 'r4', name: 'yintestLiantong', type: '裸金属', gpuModel: 'Huawei Atlas 300', gpuNum: 2, usagePercent: 71 },
  { id: 'r5', name: '数据处理集群', type: '云主机', gpuModel: 'Ascend 910B', gpuNum: 2, usagePercent: 63 }
])

const getRankClass = (index: number): string => {
  if (index === 0) return 'rank-gold'
  if (index === 1) return 'rank-silver'
  if (index === 2) return 'rank-bronze'
  return 'rank-normal'
}

// ==================== 最近活动 ====================
const recentActivities = ref([
  { id: 'a1', type: 'create', title: '创建了裸金属资源 "GPU计算实例-03"', time: '10 分钟前', user: 'admin' },
  { id: 'a2', type: 'order', title: '提交了智算服务订单，等待审核', time: '32 分钟前', user: 'admin' },
  { id: 'a3', type: 'success', title: '资源 "AI推理服务器-02" 已开通', time: '1 小时前', user: 'system' },
  { id: 'a4', type: 'warning', title: '资源 "work-910b-eekzk1" 即将到期 (7天)', time: '2 小时前', user: 'system' },
  { id: 'a5', type: 'ticket', title: '创建了工单 "GPU驱动异常"', time: '昨天 18:30', user: 'admin' },
  { id: 'a6', type: 'message', title: '查看了 3 条未读消息', time: '昨天 15:20', user: 'admin' }
])

const getActivityClass = (type: string): string => {
  const map: Record<string, string> = {
    create: 'activity-create',
    order: 'activity-order',
    success: 'activity-success',
    warning: 'activity-warning',
    ticket: 'activity-ticket',
    message: 'activity-message'
  }
  return map[type] || 'activity-default'
}

const getActivityIcon = (type: string) => {
  const map: Record<string, any> = {
    create: Plus,
    order: Document,
    success: CircleCheck,
    warning: Warning,
    ticket: Service,
    message: Bell
  }
  return map[type] || Operation
}

const viewAllActivities = () => {
  ElMessage.info('查看全部活动功能即将上线')
}

// ==================== 快速操作 ====================
const quickActions = ref([
  { label: '创建订单', desc: '快速创建资源', icon: Plus, colorClass: 'action-blue', path: '/console/order-create' },
  { label: '工单管理', desc: '提交工单', icon: Service, colorClass: 'action-green', path: '/console/ticket-list' },
  { label: '消息中心', desc: '查看通知', icon: Bell, colorClass: 'action-orange', path: '/console/message' },
  { label: '账户设置', desc: '账号信息', icon: Setting, colorClass: 'action-purple', path: '/console/account-settings' }
])

// ==================== 平台健康度 ====================
const healthScore = ref(95)
const healthScorePercent = computed(() => healthScore.value)

// ==================== 图表数据点生成 ====================
const generateUsagePoints = (base: number, variance: number, count: number) => {
  const points: string[] = []
  const step = 400 / (count - 1)
  for (let i = 0; i < count; i++) {
    const x = i * step
    const y = 180 - (base + Math.sin(i * 0.5) * variance + Math.random() * 10) * 1.5
    points.push(`${x},${y}`)
  }
  return points.join(' ')
}

const cpuUsagePoints = computed(() => generateUsagePoints(65, 15, usageTimeRange.value === 'week' ? 7 : 30))
const memoryUsagePoints = computed(() => generateUsagePoints(55, 10, usageTimeRange.value === 'week' ? 7 : 30))
const gpuUsagePoints = computed(() => generateUsagePoints(75, 20, usageTimeRange.value === 'week' ? 7 : 30))

const cpuUsageAreaPoints = computed(() => {
  const points = cpuUsagePoints.value.split(' ')
  return `0,180 ${points.join(' ')} 400,180`
})

// CPU 数据点坐标（用于绘制圆点）
const cpuUsageDataPoints = computed(() => {
  return cpuUsagePoints.value.split(' ').map(p => {
    const [x, y] = p.split(',')
    return { x: parseFloat(x), y: parseFloat(y) }
  })
})

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('搜索完成')
}

const handleReset = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const getResourceTypeTag = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    '裸金属': 'primary',
    '云主机': 'success',
    '容器': 'warning',
    '通算': 'info'
  }
  return map[type] || 'info'
}

const getStatusTag = (status: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    '运行中': 'success',
    '已停止': 'info',
    '创建中': 'warning'
  }
  return map[status] || 'info'
}

const goToDetail = (row: any) => {
  router.push({
    path: '/console/resource-detail',
    query: { id: row.id }
  })
}

const handleDestroy = (row: any) => {
  ElMessageBox.confirm(`确定要销毁资源 "${row.name}" 吗？此操作不可恢复！`, '警告', {
    confirmButtonText: '确认销毁',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('资源销毁申请已提交')
  }).catch(() => {})
}
</script>

<style scoped>
.console-dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 统计卡片行 */
.stats-cards-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.04);
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.stat-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.bg-blue { background: linear-gradient(135deg, #1677FF, #4096FF); }
.bg-green { background: linear-gradient(135deg, #52C41A, #73D13D); }
.bg-orange { background: linear-gradient(135deg, #FA8C16, #FFC069); }
.bg-purple { background: linear-gradient(135deg, #722ED1, #9254DE); }

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #86909C;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1D2129;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 12px;
  color: #86909C;
  display: flex;
  align-items: center;
  gap: 2px;
}

.stat-trend.up { color: #52C41A; }
.stat-trend.down { color: #F53F3F; }
.stat-trend.warning { color: #FA8C16; }

/* 图表网格行 */
.charts-grid-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.chart-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.04);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #1D2129;
  margin: 0;
}

/* 使用趋势图 */
.usage-chart-placeholder {
  display: flex;
  height: 180px;
  gap: 8px;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 12px;
  color: #86909C;
  padding: 4px 0;
}

.chart-area {
  flex: 1;
  position: relative;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.chart-legend {
  display: flex;
  gap: 20px;
  margin-top: 12px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #4E5969;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.blue { background: #1677FF; }
.legend-dot.purple { background: #722ED1; }
.legend-dot.orange { background: #FA8C16; }

/* 饼图 */
.pie-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.pie-chart {
  width: 160px;
  height: 160px;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.pie-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.pie-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.pie-dot.blue { background: #1677FF; }
.pie-dot.green { background: #52C41A; }
.pie-dot.orange { background: #FA8C16; }
.pie-dot.purple { background: #722ED1; }

.pie-label {
  flex: 1;
  color: #4E5969;
}

.pie-label strong {
  color: #1D2129;
}

/* 资源表格卡片 */
.resource-table-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.04);
}

.table-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #1D2129;
  margin: 0;
}

.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.table-search {
  width: 240px;
}

.blue-link-text {
  color: #1677FF;
  cursor: pointer;
}

.blue-link-text:hover {
  text-decoration: underline;
}

.table-op-btn {
  color: #1677FF;
  font-size: 14px;
  cursor: pointer;
  margin-right: 12px;
}

.table-op-btn:hover {
  color: #4096FF;
}

.danger-text {
  color: #F53F3F;
}

.danger-text:hover {
  color: #FF7875;
}

.pagination-container-row {
  display: flex;
  justify-content: flex-end;
  padding-top: 18px;
}

/* ==================== 第二行图表（月度消费 + TOP5） ==================== */
.charts-second-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 16px;
}

.chart-tag-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.tag-label {
  color: #86909C;
}

.tag-value {
  font-size: 18px;
  font-weight: 600;
  color: #1D2129;
}

/* 柱状图 */
.bar-chart-container {
  display: flex;
  height: 200px;
  gap: 8px;
  padding: 0 4px;
}

.bar-chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 11px;
  color: #C9CDD4;
  padding: 4px 0;
  min-width: 36px;
  text-align: right;
}

.bar-chart-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  position: relative;
  border-left: 1px solid #F0F2F5;
  border-bottom: 1px solid #F0F2F5;
  padding: 0 4px 4px 4px;
}

.bar-item-wrapper {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.bar-fill {
  width: 60%;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: relative;
  min-height: 4px;
}

.bar-fill.bar-up {
  background: linear-gradient(180deg, #1677FF 0%, #4096FF 100%);
}

.bar-fill.bar-down {
  background: linear-gradient(180deg, #52C41A 0%, #73D13D 100%);
}

.bar-fill.bar-highlight {
  filter: brightness(1.1);
  transform: scaleY(1.02);
  transform-origin: bottom;
  box-shadow: 0 -2px 8px rgba(22, 119, 255, 0.3);
}

.bar-value-label {
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #1D2129;
  font-weight: 600;
  white-space: nowrap;
}

.bar-x-label {
  font-size: 11px;
  color: #86909C;
  margin-top: 6px;
}

.bar-tooltip {
  position: absolute;
  bottom: calc(100% - 4px);
  left: 50%;
  transform: translateX(-50%);
  background: #1D2129;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bar-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #1D2129;
}

.tooltip-month {
  font-size: 11px;
  opacity: 0.7;
  margin-bottom: 2px;
}

.tooltip-amount {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 2px;
}

.tooltip-trend {
  font-size: 11px;
  opacity: 0.85;
}

.tooltip-trend.up { color: #FF7875; }
.tooltip-trend.down { color: #95DE64; }

/* 排行榜 */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.ranking-item:hover {
  background: #F7F8FA;
}

.rank-badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.rank-gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #fff;
  font-size: 14px;
}

.rank-silver {
  background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
  color: #fff;
  font-size: 14px;
}

.rank-bronze {
  background: linear-gradient(135deg, #CD7F32, #A0522D);
  color: #fff;
  font-size: 14px;
}

.rank-normal {
  background: #F0F2F5;
  color: #4E5969;
}

.rank-info {
  flex: 1;
  min-width: 0;
}

.rank-name {
  font-size: 13px;
  color: #1D2129;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-meta {
  font-size: 11px;
  color: #86909C;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.rank-divider {
  color: #C9CDD4;
}

.rank-progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.rank-progress {
  flex: 1;
  height: 6px;
  background: #F0F2F5;
  border-radius: 3px;
  overflow: hidden;
}

.rank-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.rank-progress-fill.rank-gold { background: linear-gradient(90deg, #FFD700, #FFA500); }
.rank-progress-fill.rank-silver { background: linear-gradient(90deg, #C0C0C0, #A8A8A8); }
.rank-progress-fill.rank-bronze { background: linear-gradient(90deg, #CD7F32, #A0522D); }
.rank-progress-fill.rank-normal { background: linear-gradient(90deg, #1677FF, #4096FF); }

.rank-percent {
  font-size: 12px;
  font-weight: 600;
  color: #1D2129;
  min-width: 36px;
  text-align: right;
}

/* ==================== 第三行（活动 + 快速操作 + 健康度） ==================== */
.charts-third-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 16px;
}

/* 时间线 */
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 4px;
}

.activity-timeline::-webkit-scrollbar {
  width: 4px;
}

.activity-timeline::-webkit-scrollbar-thumb {
  background: #C9CDD4;
  border-radius: 2px;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
  position: relative;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 14px;
  top: 36px;
  bottom: -4px;
  width: 1px;
  background: #F0F2F5;
}

.timeline-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  z-index: 1;
}

.activity-create { background: linear-gradient(135deg, #1677FF, #4096FF); }
.activity-order { background: linear-gradient(135deg, #722ED1, #9254DE); }
.activity-success { background: linear-gradient(135deg, #52C41A, #73D13D); }
.activity-warning { background: linear-gradient(135deg, #FA8C16, #FFC069); }
.activity-ticket { background: linear-gradient(135deg, #13C2C2, #36CFC9); }
.activity-message { background: linear-gradient(135deg, #EB2F96, #F759AB); }
.activity-default { background: #86909C; }

.timeline-content {
  flex: 1;
  min-width: 0;
}

.timeline-title {
  font-size: 13px;
  color: #1D2129;
  line-height: 1.5;
}

.timeline-meta {
  font-size: 11px;
  color: #86909C;
  margin-top: 2px;
  display: flex;
  gap: 8px;
}

.timeline-time {
  color: #86909C;
}

.timeline-user {
  color: #1677FF;
}

/* 快速操作 */
.quick-action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.quick-action-item {
  background: #F7F8FA;
  border: 1px solid #F0F2F5;
  border-radius: 6px;
  padding: 14px 12px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.quick-action-item:hover {
  background: #fff;
  border-color: #1677FF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.12);
}

.action-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin: 0 auto 8px;
}

.action-blue { background: linear-gradient(135deg, #1677FF, #4096FF); }
.action-green { background: linear-gradient(135deg, #52C41A, #73D13D); }
.action-orange { background: linear-gradient(135deg, #FA8C16, #FFC069); }
.action-purple { background: linear-gradient(135deg, #722ED1, #9254DE); }

.action-label {
  font-size: 13px;
  color: #1D2129;
  font-weight: 500;
}

.action-desc {
  font-size: 11px;
  color: #86909C;
  margin-top: 2px;
}

/* 健康度 */
.health-score-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;
}

.health-ring-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.health-progress-circle {
  transition: stroke-dasharray 1s ease-out;
}

.health-score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.health-score-num {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #52C41A, #1677FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.health-score-label {
  font-size: 11px;
  color: #86909C;
  margin-top: 2px;
}

.health-metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.health-metric-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-name {
  font-size: 12px;
  color: #4E5969;
  min-width: 70px;
}

.metric-bar {
  flex: 1;
  height: 6px;
  background: #F0F2F5;
  border-radius: 3px;
  overflow: hidden;
}

.metric-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}

.metric-bar-fill.green { background: linear-gradient(90deg, #52C41A, #95DE64); }
.metric-bar-fill.blue { background: linear-gradient(90deg, #1677FF, #69B1FF); }
.metric-bar-fill.purple { background: linear-gradient(90deg, #722ED1, #B37FEB); }

.metric-value {
  font-size: 12px;
  font-weight: 600;
  color: #1D2129;
  min-width: 32px;
  text-align: right;
}

/* 饼图动画 */
.pie-segment {
  transition: stroke-width 0.3s, opacity 0.3s;
  cursor: pointer;
}

.pie-segment:hover {
  stroke-width: 46;
  opacity: 0.9;
}

/* 响应式 */
@media (max-width: 1400px) {
  .charts-third-row {
    grid-template-columns: 1fr 1fr;
  }
  .health-card {
    grid-column: span 2;
  }
}

@media (max-width: 1200px) {
  .stats-cards-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .charts-grid-row {
    grid-template-columns: 1fr;
  }
  .charts-second-row {
    grid-template-columns: 1fr;
  }
  .charts-third-row {
    grid-template-columns: 1fr;
  }
  .health-card {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .stats-cards-row {
    grid-template-columns: 1fr;
  }
  .quick-action-grid {
    grid-template-columns: 1fr;
  }
}
</style>
