<template>
  <div class="console-resource-detail-page notranslate" translate="no">
    <div class="detail-back-navigation-bar" @click="handleNavigateBack">
      <el-icon class="back-arrow-icon"><arrow-left /></el-icon>
      <span class="resource-title-name">{{ instanceInfo.name || '--' }}</span>
      <span class="status-badge-stopped">
        <span class="dot">●</span> {{ instanceInfo.status || '已停止' }}
      </span>
    </div>

    <div class="top-metadata-infobar">
      <div class="meta-item"><span class="lbl">IP：</span><span class="val font-code">{{ instanceInfo.intranetIp || '--' }}</span></div>
      <div class="meta-item"><span class="lbl">区域：</span><span class="val">{{ instanceInfo.region && instanceInfo.region !== '--' ? instanceInfo.region : '默认区域' }}</span></div>
      <div class="meta-item"><span class="lbl">需求方：</span><span class="val">{{ instanceInfo.demander || '测评中心' }}</span></div>
      <div class="meta-item"><span class="lbl">供给方：</span><span class="val">{{ instanceInfo.provider || '中国移动' }}</span></div>
      <div class="meta-item"><span class="lbl">创建时间：</span><span class="val">{{ instanceInfo.createTime || '2026-04-23 14:20:00' }}</span></div>
      <div class="meta-item"><span class="lbl">过期时间：</span><span class="val">{{ instanceInfo.expireTime || '--' }}</span></div>
    </div>

    <div class="monitor-navigation-tabs">
      <span 
        v-for="tab in tabList" 
        :key="tab.key" 
        :class="['tab-item', activeTab === tab.key ? 'active' : '']"
        @click="switchTab(tab.key)"
      >
        {{ tab.name }}
      </span>
    </div>

    <div class="monitoring-metrics-grid">
      <div :class="['metric-card-box', activeTab === 'cpu' ? 'selected-card' : '']" @click="switchTab('cpu')">
        <div class="metric-title">CPU使用率</div>
        <div class="metric-value-row">
          <span class="huge-num">{{ monitorSummary.cpuUsage }}%</span>
          <span class="sub-capacity">({{ instanceInfo.cpu || '--' }})</span>
        </div>
        <div class="metric-progress-bar-wrapper">
          <el-progress :percentage="monitorSummary.cpuUsage" :stroke-width="4" :show-text="false" color="#1677FF" />
        </div>
      </div>

      <div :class="['metric-card-box', activeTab === 'memory' ? 'selected-card' : '']" @click="switchTab('memory')">
        <div class="metric-title">内存使用率</div>
        <div class="metric-value-row">
          <span class="huge-num">{{ monitorSummary.memUsage }}%</span>
          <span class="sub-capacity">({{ instanceInfo.memory || '--' }})</span>
        </div>
        <div class="metric-progress-bar-wrapper">
          <el-progress :percentage="monitorSummary.memUsage" :stroke-width="4" :show-text="false" color="#1677FF" />
        </div>
      </div>

      <div :class="['metric-card-box', activeTab === 'storage' ? 'selected-card' : '']" @click="switchTab('storage')">
        <div class="metric-title">存储使用率</div>
        <div class="metric-value-row">
          <span class="huge-num">{{ monitorSummary.storageUsage }}%</span>
          <span class="sub-capacity">({{ instanceInfo.systemDisk || '--' }})</span>
        </div>
        <div class="metric-progress-bar-wrapper">
          <el-progress :percentage="monitorSummary.storageUsage" :stroke-width="4" :show-text="false" color="#52C41A" />
        </div>
      </div>

      <div :class="['metric-card-box', activeTab === 'gpu' ? 'selected-card' : '']" @click="switchTab('gpu')">
        <div class="metric-title">GPU使用率</div>
        <div class="metric-value-row">
          <span class="huge-num">{{ monitorSummary.gpuUsage }}%</span>
          <span class="sub-capacity" v-if="instanceInfo.gpuNum">({{ instanceInfo.gpuNum }}卡)</span>
        </div>
        <div class="metric-progress-bar-wrapper">
          <el-progress :percentage="monitorSummary.gpuUsage" :stroke-width="4" :show-text="false" color="#1677FF" />
        </div>
      </div>
    </div>

    <div class="detail-dynamic-content-area">
      
      <div v-if="activeTab === 'overview'" class="bottom-resource-profile-card">
        <div class="profile-block-header">
          <span class="blue-v-line"></span>资源信息
        </div>
        <div class="profile-properties-matrix">
          <div class="prop-item"><span class="p-lbl">资源名称</span><span class="p-val">{{ instanceInfo.name || '--' }}</span></div>
          <div class="prop-item"><span class="p-lbl">资源ID</span><span class="p-val font-code">{{ instanceInfo.id || '--' }}</span></div>
          <div class="prop-item"><span class="p-lbl">内网IP</span><span class="p-val font-code">{{ instanceInfo.intranetIp || '--' }}</span></div>
          <div class="prop-item"><span class="p-lbl">公网IP</span><span class="p-val">{{ instanceInfo.internetIp || '--' }}</span></div>
          
          <div class="prop-item"><span class="p-lbl">CPU</span><span class="p-val">{{ instanceInfo.cpu || '--' }}</span></div>
          <div class="prop-item"><span class="p-lbl">内存</span><span class="p-val">{{ instanceInfo.memory || '--' }}</span></div>
          <div class="prop-item"><span class="p-lbl">系统盘</span><span class="p-val">{{ instanceInfo.systemDisk || '--' }}</span></div>
          <div class="prop-item"><span class="p-lbl">数据盘</span><span class="p-val">{{ instanceInfo.dataDisk || '--' }}</span></div>
          
          <div class="prop-item"><span class="p-lbl">显卡型号</span><span class="p-val">{{ instanceInfo.gpuModel || '--' }}</span></div>
          <div class="prop-item"><span class="p-lbl">显卡数量</span><span class="p-val">{{ instanceInfo.gpuNum || '--' }}</span></div>
          <div class="prop-item"><span class="p-lbl">显存容量</span><span class="p-val">{{ instanceInfo.vram || '--' }}</span></div>
          <div class="prop-item"><span class="p-lbl">显存总量</span><span class="p-val">{{ instanceInfo.totalVram || '--' }}</span></div>
        </div>
      </div>

      <div v-else class="monitor-graphs-dashboard">
        <div class="graph-dashboard-header">
          <div class="left-title">
            <span class="blue-v-line"></span>
            <span class="title-text">{{ getCurrentTabName() }}趋势监控</span>
          </div>
          <div class="right-time-filter">
            <el-radio-group v-model="timeRange" size="small" @change="handleTimeRangeChange">
              <el-radio-button label="1h">1小时</el-radio-button>
              <el-radio-button label="6h">6小时</el-radio-button>
              <el-radio-button label="12h">12小时</el-radio-button>
              <el-radio-button label="1d">1天</el-radio-button>
              <el-radio-button label="7d">7天</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div class="charts-slots-grid">
          <div class="chart-container-box">
            <div class="chart-inner-title">{{ getCurrentTabName() }} 使用率趋势 (%)</div>
            <div id="main-usage-chart" class="echarts-dom-placeholder">
              <div class="empty-loading-text">正在实时同步云端监控数据链...</div>
            </div>
          </div>

          <div class="chart-container-box" v-if="activeTab === 'network'">
            <div class="chart-inner-title">网络吞吐速率 (Mbps)</div>
            <div id="network-io-chart" class="echarts-dom-placeholder">
              <div class="empty-loading-text">网络 I/O 管道就绪，等待后端联调...</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 1. 整合图三列表映射的实体结构
const instanceInfo = ref<any>({
  id: '',
  name: '',
  status: '',
  intranetIp: '',
  internetIp: '--',
  cpu: '',
  memory: '',
  systemDisk: '',
  dataDisk: '--',
  gpuModel: '--',
  gpuNum: '--',
  vram: '--',
  totalVram: '--',
  region: '默认区域'
})

// 2. 导航控制与图二联动配置
const activeTab = ref('overview')
const timeRange = ref('1h')
const tabList = [
  { name: '资源概览', key: 'overview' },
  { name: 'GPU监控', key: 'gpu' },
  { name: 'CPU监控', key: 'cpu' },
  { name: '内存监控', key: 'memory' },
  { name: '存储监控', key: 'storage' },
  { name: '网络监控', key: 'network' }
]

// 3. 上方核心大字卡片的监控实时汇总简要数据
const monitorSummary = ref({
  cpuUsage: 0,
  memUsage: 1.2,
  storageUsage: 0.76,
  gpuUsage: 0
})

// 获取当前激活的 Tab 文本
const getCurrentTabName = () => {
  const target = tabList.find(t => t.key === activeTab.value)
  return target ? target.name : ''
}

// 4. 处理从【图三】列表页点击“详情”跳转过来的数据承接与对齐
onMounted(() => {
  if (route.query && Object.keys(route.query).length > 0) {
    // 动态解构图三行数据，确保属性名称与后端/列表一致
    instanceInfo.value = {
      id: route.query.id || '--',
      name: route.query.name || '--',
      status: route.query.status || '已停止',
      intranetIp: route.query.intranetIp || '--',
      internetIp: route.query.internetIp || '--',
      cpu: route.query.cpu || '--',
      memory: route.query.memory || '--',
      systemDisk: route.query.systemDisk || '--',
      dataDisk: route.query.dataDisk || '--',
      gpuModel: route.query.gpuModel || '--',
      gpuNum: route.query.gpuNum || '--',
      vram: route.query.vram || '--',
      totalVram: route.query.totalVram || '--',
      region: route.query.region || '默认区域'
    }
  }
  
  // 触发获取监控基础数据
  fetchMonitorData()
})

// 5. 【可拓展功能】后续连接数据库/后端 API 的核心骨架函数
const timer = ref<any>(null)
const fetchMonitorData = async () => {
  try {
    console.log(`[DB Pipeline] 正在向后端拉取设备 ${instanceInfo.value.id} 的最新监控指标...`)
    console.log(`[DB Pipeline] 当前筛选的时间跨度为: ${timeRange.value}`)
    
    /** * 【后续联调步骤提示】：
     * import axios from 'axios'
     * const res = await axios.get(`/api/v1/monitor/history`, { 
     * params: { id: instanceInfo.value.id, range: timeRange.value, type: activeTab.value } 
     * })
     * if(res.data) { // 在这里给渲染容器或大字报赋值 }
     **/

    // 模拟连接数据库产生的实时动态小跳动
    if (activeTab.value === 'cpu') {
      monitorSummary.value.cpuUsage = +(Math.random() * 12 + 5).toFixed(2)
    }
  } catch (error) {
    console.error("数据库管道连接失败:", error)
  }
}

// 监听 Tab 切换或时间筛选变化，自动向后端/数据库重新加载对应维度的图表数据
watch([activeTab, timeRange], () => {
  fetchMonitorData()
  // 如果在此处集成了 ECharts，可以在这里写：myChart.setOption({...}) 重新绘图
})

// 定时轮询，模拟生产级物理机数据流推送
timer.value = setInterval(() => {
  fetchMonitorData()
}, 5000)

onBeforeUnmount(() => {
  if (timer.value) clearInterval(timer.value)
})

const switchTab = (key: string) => {
  activeTab.value = key
}

const handleTimeRangeChange = (val: any) => {
  timeRange.value = val
}

const handleNavigateBack = () => {
  router.back()
}
</script>

<style scoped>
/* 基础页面布局骨架 */
.console-resource-detail-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

/* 导航返回头部 */
.detail-back-navigation-bar {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 16px;
  user-select: none;
}
.back-arrow-icon {
  font-size: 16px;
  color: #4E5969;
  margin-right: 8px;
}
.resource-title-name {
  font-size: 16px;
  font-weight: 600;
  color: #1D2129;
  margin-right: 12px;
}
.status-badge-stopped {
  background-color: #F2F3F5;
  color: #4E5969;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.status-badge-stopped .dot {
  font-size: 8px;
  color: #86909C;
}

/* 1. 顶置浅蓝元数据通栏 */
.top-metadata-infobar {
  background-color: #F2F6FC;
  border-radius: 4px;
  padding: 14px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px 40px;
  margin-bottom: 20px;
}
.meta-item {
  font-size: 13px;
  display: flex;
  align-items: center;
}
.meta-item .lbl { color: #86909C; }
.meta-item .val { color: #1D2129; font-weight: 400; }

/* 2. Tabs 条 */
.monitor-navigation-tabs {
  display: flex;
  gap: 32px;
  border-bottom: 1px solid #E5E6EB;
  margin-bottom: 20px;
  padding-left: 4px;
}
.tab-item {
  font-size: 14px;
  color: #4E5969;
  padding-bottom: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}
.tab-item:hover, .tab-item.active {
  color: #1677FF;
}
.tab-item.active { font-weight: 500; }
.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1677FF;
}

/* 3. 监控卡片网格 */
.monitoring-metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.metric-card-box {
  background-color: #ffffff;
  border: 1px solid #E5E6EB;
  border-radius: 4px;
  padding: 20px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s ease;
}
.metric-card-box:hover {
  border-color: #1677FF;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.08);
}
.selected-card {
  border-color: #1677FF !important;
  background-color: #F4F8FF;
}
.metric-title { font-size: 13px; color: #86909C; margin-bottom: 16px; }
.metric-value-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px; }
.huge-num { font-size: 32px; font-weight: 700; color: #1D2129; font-family: Arial; line-height: 1; }
.sub-capacity { font-size: 13px; color: #86909C; }

/* 4. 底部内容切换区 */
.detail-dynamic-content-area {
  min-height: 350px;
}

/* 模式 A：基本资源配置表格样式 */
.bottom-resource-profile-card {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 24px 20px;
  border: 1px solid #E5E6EB;
}
.profile-block-header {
  font-size: 14px;
  font-weight: 600;
  color: #1D2129;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}
.blue-v-line {
  display: inline-block;
  width: 3px;
  height: 14px;
  background-color: #1677FF;
  border-radius: 2px;
}
.profile-properties-matrix {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px 40px;
}
.prop-item { display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
.prop-item .p-lbl { color: #86909C; font-size: 13px; }
.prop-item .p-val { color: #1D2129; font-weight: 400; min-height: 20px; word-break: break-all; }

/* 模式 B：图二规范的折线图大看板 */
.monitor-graphs-dashboard {
  background-color: #ffffff;
  border: 1px solid #E5E6EB;
  border-radius: 4px;
  padding: 24px 20px;
}
.graph-dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.graph-dashboard-header .left-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.graph-dashboard-header .title-text {
  font-size: 14px;
  font-weight: 600;
  color: #1D2129;
}
.charts-slots-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
.chart-container-box {
  border: 1px solid #F2F3F5;
  border-radius: 4px;
  padding: 16px;
  background-color: #FCFDFE;
}
.chart-inner-title {
  font-size: 13px;
  color: #4E5969;
  font-weight: 500;
  margin-bottom: 16px;
}
.echarts-dom-placeholder {
  height: 260px;
  width: 100%;
  background-color: #F8FAFC;
  border: 1px dashed #E5E6EB;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-loading-text {
  font-size: 13px;
  color: #AFB9C6;
  font-style: italic;
}

.font-code { font-family: Consolas, Monaco, monospace; }
</style>