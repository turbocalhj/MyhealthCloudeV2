import { useCallback, useEffect, useRef, useState } from 'react'
import { Progress, Radio } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './ResourceDetail.module.css'

interface InstanceInfo {
  id: string
  name: string
  status: string
  intranetIp: string
  internetIp: string
  cpu: string
  memory: string
  systemDisk: string
  dataDisk: string
  gpuModel: string
  gpuNum: string
  vram: string
  totalVram: string
  region: string
  demander?: string
  provider?: string
  createTime?: string
  expireTime?: string
}

interface MonitorSummary {
  cpuUsage: number
  memUsage: number
  storageUsage: number
  gpuUsage: number
}

interface TabItem {
  name: string
  key: string
}

// 1. 整合图三列表映射的实体结构
const DEFAULT_INSTANCE_INFO: InstanceInfo = {
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
}

// 2. 导航控制与图二联动配置
const tabList: TabItem[] = [
  { name: '资源概览', key: 'overview' },
  { name: 'GPU监控', key: 'gpu' },
  { name: 'CPU监控', key: 'cpu' },
  { name: '内存监控', key: 'memory' },
  { name: '存储监控', key: 'storage' },
  { name: '网络监控', key: 'network' }
]

const TIME_RANGE_OPTIONS = [
  { label: '1小时', value: '1h' },
  { label: '6小时', value: '6h' },
  { label: '12小时', value: '12h' },
  { label: '1天', value: '1d' },
  { label: '7天', value: '7d' }
]

// 4. 处理从【图三】列表页点击“详情”跳转过来的数据承接与对齐
const buildInstanceInfo = (params: URLSearchParams): InstanceInfo => {
  if (!params.toString()) return DEFAULT_INSTANCE_INFO
  return {
    id: params.get('id') || '--',
    name: params.get('name') || '--',
    status: params.get('status') || '已停止',
    intranetIp: params.get('intranetIp') || '--',
    internetIp: params.get('internetIp') || '--',
    cpu: params.get('cpu') || '--',
    memory: params.get('memory') || '--',
    systemDisk: params.get('systemDisk') || '--',
    dataDisk: params.get('dataDisk') || '--',
    gpuModel: params.get('gpuModel') || '--',
    gpuNum: params.get('gpuNum') || '--',
    vram: params.get('vram') || '--',
    totalVram: params.get('totalVram') || '--',
    region: params.get('region') || '默认区域'
  }
}

export default function ResourceDetail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [instanceInfo] = useState<InstanceInfo>(() => buildInstanceInfo(searchParams))

  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('1h')

  // 3. 上方核心大字卡片的监控实时汇总简要数据
  const [monitorSummary, setMonitorSummary] = useState<MonitorSummary>({
    cpuUsage: 0,
    memUsage: 1.2,
    storageUsage: 0.76,
    gpuUsage: 0
  })

  const activeTabRef = useRef(activeTab)
  activeTabRef.current = activeTab
  const timeRangeRef = useRef(timeRange)
  timeRangeRef.current = timeRange

  // 获取当前激活的 Tab 文本
  const getCurrentTabName = () => {
    const target = tabList.find((t) => t.key === activeTab)
    return target ? target.name : ''
  }

  // 5. 【可拓展功能】后续连接数据库/后端 API 的核心骨架函数
  const fetchMonitorData = useCallback(() => {
    try {
      console.log(`[DB Pipeline] 正在向后端拉取设备 ${instanceInfo.id} 的最新监控指标...`)
      console.log(`[DB Pipeline] 当前筛选的时间跨度为: ${timeRangeRef.current}`)

      /** * 【后续联调步骤提示】：
       * import axios from 'axios'
       * const res = await axios.get(`/api/v1/monitor/history`, {
       * params: { id: instanceInfo.id, range: timeRangeRef.current, type: activeTabRef.current }
       * })
       * if(res.data) { // 在这里给渲染容器或大字报赋值 }
       **/

      // 模拟连接数据库产生的实时动态小跳动
      if (activeTabRef.current === 'cpu') {
        setMonitorSummary((prev) => ({
          ...prev,
          cpuUsage: +(Math.random() * 12 + 5).toFixed(2)
        }))
      }
    } catch (error) {
      console.error('数据库管道连接失败:', error)
    }
  }, [instanceInfo.id])

  // 初次挂载触发获取监控基础数据
  useEffect(() => {
    fetchMonitorData()
  }, [fetchMonitorData])

  // 监听 Tab 切换或时间筛选变化，自动向后端/数据库重新加载对应维度的图表数据
  const mountedRef = useRef(false)
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    fetchMonitorData()
    // 如果在此处集成了 ECharts，可以在这里写：myChart.setOption({...}) 重新绘图
  }, [activeTab, timeRange, fetchMonitorData])

  // 定时轮询，模拟生产级物理机数据流推送
  useEffect(() => {
    const timerId = window.setInterval(() => {
      fetchMonitorData()
    }, 5000)
    return () => {
      window.clearInterval(timerId)
    }
  }, [fetchMonitorData])

  const switchTab = (key: string) => {
    setActiveTab(key)
  }

  const handleTimeRangeChange = (val: string) => {
    setTimeRange(val)
  }

  const handleNavigateBack = () => {
    navigate(-1)
  }

  return (
    <div className={`${styles.consoleResourceDetailPage} notranslate`} translate="no">
      <div className={styles.detailBackNavigationBar} onClick={handleNavigateBack}>
        <ArrowLeftOutlined className={styles.backArrowIcon} />
        <span className={styles.resourceTitleName}>{instanceInfo.name || '--'}</span>
        <span className={styles.statusBadgeStopped}>
          <span className={styles.dot}>●</span> {instanceInfo.status || '已停止'}
        </span>
      </div>

      <div className={styles.topMetadataInfobar}>
        <div className={styles.metaItem}>
          <span className={styles.lbl}>IP：</span>
          <span className={`${styles.val} ${styles.fontCode}`}>{instanceInfo.intranetIp || '--'}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.lbl}>区域：</span>
          <span className={styles.val}>
            {instanceInfo.region && instanceInfo.region !== '--' ? instanceInfo.region : '默认区域'}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.lbl}>需求方：</span>
          <span className={styles.val}>{instanceInfo.demander || '测评中心'}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.lbl}>供给方：</span>
          <span className={styles.val}>{instanceInfo.provider || '中国移动'}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.lbl}>创建时间：</span>
          <span className={styles.val}>{instanceInfo.createTime || '2026-04-23 14:20:00'}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.lbl}>过期时间：</span>
          <span className={styles.val}>{instanceInfo.expireTime || '--'}</span>
        </div>
      </div>

      <div className={styles.monitorNavigationTabs}>
        {tabList.map((tab) => (
          <span
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => switchTab(tab.key)}
          >
            {tab.name}
          </span>
        ))}
      </div>

      <div className={styles.monitoringMetricsGrid}>
        <div
          className={`${styles.metricCardBox} ${activeTab === 'cpu' ? styles.selectedCard : ''}`}
          onClick={() => switchTab('cpu')}
        >
          <div className={styles.metricTitle}>CPU使用率</div>
          <div className={styles.metricValueRow}>
            <span className={styles.hugeNum}>{monitorSummary.cpuUsage}%</span>
            <span className={styles.subCapacity}>({instanceInfo.cpu || '--'})</span>
          </div>
          <div className={styles.metricProgressBarWrapper}>
            <Progress percent={monitorSummary.cpuUsage} strokeWidth={4} showInfo={false} strokeColor="#1677FF" />
          </div>
        </div>

        <div
          className={`${styles.metricCardBox} ${activeTab === 'memory' ? styles.selectedCard : ''}`}
          onClick={() => switchTab('memory')}
        >
          <div className={styles.metricTitle}>内存使用率</div>
          <div className={styles.metricValueRow}>
            <span className={styles.hugeNum}>{monitorSummary.memUsage}%</span>
            <span className={styles.subCapacity}>({instanceInfo.memory || '--'})</span>
          </div>
          <div className={styles.metricProgressBarWrapper}>
            <Progress percent={monitorSummary.memUsage} strokeWidth={4} showInfo={false} strokeColor="#1677FF" />
          </div>
        </div>

        <div
          className={`${styles.metricCardBox} ${activeTab === 'storage' ? styles.selectedCard : ''}`}
          onClick={() => switchTab('storage')}
        >
          <div className={styles.metricTitle}>存储使用率</div>
          <div className={styles.metricValueRow}>
            <span className={styles.hugeNum}>{monitorSummary.storageUsage}%</span>
            <span className={styles.subCapacity}>({instanceInfo.systemDisk || '--'})</span>
          </div>
          <div className={styles.metricProgressBarWrapper}>
            <Progress percent={monitorSummary.storageUsage} strokeWidth={4} showInfo={false} strokeColor="#52C41A" />
          </div>
        </div>

        <div
          className={`${styles.metricCardBox} ${activeTab === 'gpu' ? styles.selectedCard : ''}`}
          onClick={() => switchTab('gpu')}
        >
          <div className={styles.metricTitle}>GPU使用率</div>
          <div className={styles.metricValueRow}>
            <span className={styles.hugeNum}>{monitorSummary.gpuUsage}%</span>
            {instanceInfo.gpuNum ? (
              <span className={styles.subCapacity}>({instanceInfo.gpuNum}卡)</span>
            ) : null}
          </div>
          <div className={styles.metricProgressBarWrapper}>
            <Progress percent={monitorSummary.gpuUsage} strokeWidth={4} showInfo={false} strokeColor="#1677FF" />
          </div>
        </div>
      </div>

      <div className={styles.detailDynamicContentArea}>
        {activeTab === 'overview' ? (
          <div className={styles.bottomResourceProfileCard}>
            <div className={styles.profileBlockHeader}>
              <span className={styles.blueVLine} />资源信息
            </div>
            <div className={styles.profilePropertiesMatrix}>
              <div className={styles.propItem}>
                <span className={styles.pLbl}>资源名称</span>
                <span className={styles.pVal}>{instanceInfo.name || '--'}</span>
              </div>
              <div className={styles.propItem}>
                <span className={styles.pLbl}>资源ID</span>
                <span className={`${styles.pVal} ${styles.fontCode}`}>{instanceInfo.id || '--'}</span>
              </div>
              <div className={styles.propItem}>
                <span className={styles.pLbl}>内网IP</span>
                <span className={`${styles.pVal} ${styles.fontCode}`}>{instanceInfo.intranetIp || '--'}</span>
              </div>
              <div className={styles.propItem}>
                <span className={styles.pLbl}>公网IP</span>
                <span className={styles.pVal}>{instanceInfo.internetIp || '--'}</span>
              </div>

              <div className={styles.propItem}>
                <span className={styles.pLbl}>CPU</span>
                <span className={styles.pVal}>{instanceInfo.cpu || '--'}</span>
              </div>
              <div className={styles.propItem}>
                <span className={styles.pLbl}>内存</span>
                <span className={styles.pVal}>{instanceInfo.memory || '--'}</span>
              </div>
              <div className={styles.propItem}>
                <span className={styles.pLbl}>系统盘</span>
                <span className={styles.pVal}>{instanceInfo.systemDisk || '--'}</span>
              </div>
              <div className={styles.propItem}>
                <span className={styles.pLbl}>数据盘</span>
                <span className={styles.pVal}>{instanceInfo.dataDisk || '--'}</span>
              </div>

              <div className={styles.propItem}>
                <span className={styles.pLbl}>显卡型号</span>
                <span className={styles.pVal}>{instanceInfo.gpuModel || '--'}</span>
              </div>
              <div className={styles.propItem}>
                <span className={styles.pLbl}>显卡数量</span>
                <span className={styles.pVal}>{instanceInfo.gpuNum || '--'}</span>
              </div>
              <div className={styles.propItem}>
                <span className={styles.pLbl}>显存容量</span>
                <span className={styles.pVal}>{instanceInfo.vram || '--'}</span>
              </div>
              <div className={styles.propItem}>
                <span className={styles.pLbl}>显存总量</span>
                <span className={styles.pVal}>{instanceInfo.totalVram || '--'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.monitorGraphsDashboard}>
            <div className={styles.graphDashboardHeader}>
              <div className={styles.leftTitle}>
                <span className={styles.blueVLine} />
                <span className={styles.titleText}>{getCurrentTabName()}趋势监控</span>
              </div>
              <div className={styles.rightTimeFilter}>
                <Radio.Group
                  size="small"
                  value={timeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value as string)}
                  optionType="button"
                  options={TIME_RANGE_OPTIONS}
                />
              </div>
            </div>

            <div className={styles.chartsSlotsGrid}>
              <div className={styles.chartContainerBox}>
                <div className={styles.chartInnerTitle}>{getCurrentTabName()} 使用率趋势 (%)</div>
                <div id="main-usage-chart" className={styles.echartsDomPlaceholder}>
                  <div className={styles.emptyLoadingText}>正在实时同步云端监控数据链...</div>
                </div>
              </div>

              {activeTab === 'network' && (
                <div className={styles.chartContainerBox}>
                  <div className={styles.chartInnerTitle}>网络吞吐速率 (Mbps)</div>
                  <div id="network-io-chart" className={styles.echartsDomPlaceholder}>
                    <div className={styles.emptyLoadingText}>网络 I/O 管道就绪，等待后端联调...</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
