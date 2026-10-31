import { useMemo, useState, type ReactNode } from 'react'
import { Button, Input, Modal, Pagination, Radio, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  BellOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CheckCircleOutlined,
  CloudServerOutlined,
  ControlOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
  WalletOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import styles from './Dashboard.module.css'

interface ResourceRow {
  id: string
  name: string
  type: string
  region: string
  status: string
  gpuModel: string
  gpuNum: number | string
  vram: string
  cpu: string
  memory: string
  systemDisk: string
  expireDate: string
}

const stats = {
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
}

const tableData: ResourceRow[] = [
  { id: '8716cee3-743b-4a72-a83', name: 'GPU计算实例-01', type: '裸金属', region: '萧山区', status: '运行中', gpuModel: 'NVIDIA A100', gpuNum: 8, vram: '320GB', cpu: '128核', memory: '1024GB', systemDisk: '894GB', expireDate: '2026-07-15' },
  { id: '8731370905908269056', name: 'yintestLiantong', type: '裸金属', region: '萧山区', status: '运行中', gpuModel: 'Huawei Atlas 300', gpuNum: 2, vram: '64GB', cpu: '104核', memory: '256GB', systemDisk: '--', expireDate: '2026-06-20' },
  { id: '825416335817216000', name: 'sherrytestalam1', type: '云主机', region: '拱墅区', status: '运行中', gpuModel: 'Ascend 910B2', gpuNum: 8, vram: '64GB', cpu: '128核', memory: '1536GB', systemDisk: '894GB', expireDate: '2026-06-18' },
  { id: '818855540908134400', name: 'work-910b-eekzk1', type: '容器', region: '萧山区', status: '已停止', gpuModel: '--', gpuNum: '--', vram: '--', cpu: '192核', memory: '1024GB', systemDisk: '894GB', expireDate: '2026-08-01' },
  { id: '8716cee3-743b-4a72-b94', name: 'AI推理服务器-02', type: '裸金属', region: '拱墅区', status: '运行中', gpuModel: 'NVIDIA H100', gpuNum: 4, vram: '320GB', cpu: '64核', memory: '512GB', systemDisk: '480GB', expireDate: '2026-06-15' },
  { id: '8731370905908269057', name: '数据处理集群', type: '云主机', region: '萧山区', status: '运行中', gpuModel: 'Ascend 910B', gpuNum: 2, vram: '64GB', cpu: '32核', memory: '256GB', systemDisk: '240GB', expireDate: '2026-09-01' }
]

const monthlyCostData = [
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
]

const topRankingData = [
  { id: 'r1', name: 'GPU计算实例-01', type: '裸金属', gpuModel: 'NVIDIA A100', gpuNum: 8, usagePercent: 96 },
  { id: 'r2', name: 'sherrytestalam1', type: '云主机', gpuModel: 'Ascend 910B2', gpuNum: 8, usagePercent: 88 },
  { id: 'r3', name: 'AI推理服务器-02', type: '裸金属', gpuModel: 'NVIDIA H100', gpuNum: 4, usagePercent: 82 },
  { id: 'r4', name: 'yintestLiantong', type: '裸金属', gpuModel: 'Huawei Atlas 300', gpuNum: 2, usagePercent: 71 },
  { id: 'r5', name: '数据处理集群', type: '云主机', gpuModel: 'Ascend 910B', gpuNum: 2, usagePercent: 63 }
]

type ActivityType = 'create' | 'order' | 'success' | 'warning' | 'ticket' | 'message'

interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  time: string
  user: string
}

const recentActivities: ActivityItem[] = [
  { id: 'a1', type: 'create', title: '创建了裸金属资源 "GPU计算实例-03"', time: '10 分钟前', user: 'admin' },
  { id: 'a2', type: 'order', title: '提交了智算服务订单，等待审核', time: '32 分钟前', user: 'admin' },
  { id: 'a3', type: 'success', title: '资源 "AI推理服务器-02" 已开通', time: '1 小时前', user: 'system' },
  { id: 'a4', type: 'warning', title: '资源 "work-910b-eekzk1" 即将到期 (7天)', time: '2 小时前', user: 'system' },
  { id: 'a5', type: 'ticket', title: '创建了工单 "GPU驱动异常"', time: '昨天 18:30', user: 'admin' },
  { id: 'a6', type: 'message', title: '查看了 3 条未读消息', time: '昨天 15:20', user: 'admin' }
]

const activityClassMap: Record<ActivityType, string> = {
  create: styles.activityCreate,
  order: styles.activityOrder,
  success: styles.activitySuccess,
  warning: styles.activityWarning,
  ticket: styles.activityTicket,
  message: styles.activityMessage
}

const activityIconMap: Record<ActivityType, ReactNode> = {
  create: <PlusOutlined />,
  order: <FileTextOutlined />,
  success: <CheckCircleOutlined />,
  warning: <WarningOutlined />,
  ticket: <CustomerServiceOutlined />,
  message: <BellOutlined />
}

const quickActions = [
  { label: '创建订单', desc: '快速创建资源', icon: <PlusOutlined />, colorClass: styles.actionBlue, path: '/console/order-create' },
  { label: '工单管理', desc: '提交工单', icon: <CustomerServiceOutlined />, colorClass: styles.actionGreen, path: '/console/ticket-list' },
  { label: '消息中心', desc: '查看通知', icon: <BellOutlined />, colorClass: styles.actionOrange, path: '/console/message' },
  { label: '账户设置', desc: '账号信息', icon: <SettingOutlined />, colorClass: styles.actionPurple, path: '/console/account-settings' }
]

const resourceTypeColor: Record<string, string> = {
  裸金属: 'blue',
  云主机: 'green',
  容器: 'orange',
  通算: 'purple'
}

const statusColor: Record<string, string> = {
  运行中: 'green',
  已停止: 'default',
  创建中: 'orange'
}

const generateUsagePoints = (base: number, variance: number, count: number): string => {
  const points: string[] = []
  const step = 400 / (count - 1)
  for (let i = 0; i < count; i++) {
    const x = i * step
    const y = 180 - (base + Math.sin(i * 0.5) * variance + Math.random() * 10) * 1.5
    points.push(`${x},${y}`)
  }
  return points.join(' ')
}

const getRankClass = (index: number): string => {
  if (index === 0) return styles.rankGold
  if (index === 1) return styles.rankSilver
  if (index === 2) return styles.rankBronze
  return styles.rankNormal
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [usageTimeRange, setUsageTimeRange] = useState<'week' | 'month'>('week')
  const [hoveredBarIndex, setHoveredBarIndex] = useState(-1)

  const filteredTableData = useMemo(() => {
    if (!searchQuery) return tableData
    const query = searchQuery.toLowerCase()
    return tableData.filter(
      (item) => item.id.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const maxMonthlyCost = Math.max(...monthlyCostData.map((item) => item.amount)) * 1.15

  const usagePoints = useMemo(() => {
    const count = usageTimeRange === 'week' ? 7 : 30
    const cpu = generateUsagePoints(65, 15, count)
    return {
      cpu,
      memory: generateUsagePoints(55, 10, count),
      gpu: generateUsagePoints(75, 20, count),
      cpuArea: `0,180 ${cpu.split(' ').join(' ')} 400,180`,
      cpuDots: cpu.split(' ').map((point) => {
        const [x, y] = point.split(',')
        return { x: parseFloat(x), y: parseFloat(y) }
      })
    }
  }, [usageTimeRange])

  const handleSearch = () => {
    setCurrentPage(1)
    message.success('搜索完成')
  }

  const handleReset = () => {
    setSearchQuery('')
    setCurrentPage(1)
  }

  const goToDetail = (row: ResourceRow) => {
    navigate(`/console/resource-detail?id=${row.id}`)
  }

  const handleDestroy = (row: ResourceRow) => {
    Modal.confirm({
      title: '警告',
      content: `确定要销毁资源 "${row.name}" 吗？此操作不可恢复！`,
      okText: '确认销毁',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('资源销毁申请已提交')
      }
    })
  }

  const columns: ColumnsType<ResourceRow> = [
    { title: '资源ID', dataIndex: 'id', key: 'id', width: 180, ellipsis: true },
    {
      title: '资源名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      render: (_, row) => (
        <span className={styles.blueLinkText} onClick={() => goToDetail(row)}>
          {row.name}
        </span>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={resourceTypeColor[type] || 'default'} className={styles.tableTag}>
          {type}
        </Tag>
      )
    },
    { title: '区域', dataIndex: 'region', key: 'region', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusColor[status] || 'default'} className={styles.tableTag}>
          {status}
        </Tag>
      )
    },
    { title: '显卡型号', dataIndex: 'gpuModel', key: 'gpuModel', width: 140 },
    { title: '显卡数量', dataIndex: 'gpuNum', key: 'gpuNum', width: 100, align: 'center' },
    { title: '到期时间', dataIndex: 'expireDate', key: 'expireDate', width: 160 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, row) => (
        <>
          <span className={styles.tableOpBtn} onClick={() => goToDetail(row)}>
            详情
          </span>
          <span className={`${styles.tableOpBtn} ${styles.dangerText}`} onClick={() => handleDestroy(row)}>
            销毁
          </span>
        </>
      )
    }
  ]

  return (
    <div className={styles.consoleDashboardPage}>
      <div className={styles.statsCardsRow}>
        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.bgBlue}`}>
            <CloudServerOutlined style={{ fontSize: 28 }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>总资源数</div>
            <div className={styles.statValue}>{stats.totalResources}</div>
            <div className={`${styles.statTrend} ${styles.up}`}>
              <CaretUpOutlined />
              <span>较上月 +{stats.resourceGrowth}%</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.bgGreen}`}>
            <CheckCircleOutlined style={{ fontSize: 28 }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>运行中</div>
            <div className={styles.statValue}>{stats.runningResources}</div>
            <div className={styles.statTrend}>
              <span>占比 {stats.runningPercent}%</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.bgOrange}`}>
            <WarningOutlined style={{ fontSize: 28 }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>即将到期</div>
            <div className={styles.statValue}>{stats.expiringSoon}</div>
            <div className={`${styles.statTrend} ${styles.warning}`}>
              <span>7天内到期</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.bgPurple}`}>
            <WalletOutlined style={{ fontSize: 28 }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>本月费用</div>
            <div className={styles.statValue}>¥{stats.monthlyCost.toLocaleString()}</div>
            <div className={`${styles.statTrend} ${styles.down}`}>
              <CaretDownOutlined />
              <span>较上月 -{stats.costDecrease}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartsGridRow}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>资源使用趋势</h3>
            <Radio.Group
              size="small"
              value={usageTimeRange}
              onChange={(e) => setUsageTimeRange(e.target.value)}
              optionType="button"
            >
              <Radio.Button value="week">近7天</Radio.Button>
              <Radio.Button value="month">近30天</Radio.Button>
            </Radio.Group>
          </div>
          <div className={styles.chartBody}>
            <div className={styles.usageChartPlaceholder}>
              <div className={styles.chartYAxis}>
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
              <div className={styles.chartArea}>
                <svg viewBox="0 0 400 180" className={styles.chartSvg}>
                  <g>
                    {[36, 72, 108, 144].map((y) => (
                      <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#F0F2F5" strokeWidth="1" />
                    ))}
                  </g>
                  <defs>
                    <linearGradient id="cpuAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(22, 119, 255, 0.3)" />
                      <stop offset="100%" stopColor="rgba(22, 119, 255, 0)" />
                    </linearGradient>
                  </defs>
                  <polyline points={usagePoints.cpuArea} fill="url(#cpuAreaGradient)" stroke="none" />
                  <polyline points={usagePoints.cpu} fill="none" stroke="#1677FF" strokeWidth="2.5" />
                  <polyline points={usagePoints.memory} fill="none" stroke="#722ED1" strokeWidth="2.5" />
                  <polyline points={usagePoints.gpu} fill="none" stroke="#FA8C16" strokeWidth="2.5" />
                  <g>
                    {usagePoints.cpuDots.map((point, index) => (
                      <circle key={index} cx={point.x} cy={point.y} r="3" fill="#1677FF" />
                    ))}
                  </g>
                </svg>
              </div>
            </div>
            <div className={styles.chartLegend}>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.blue}`} />CPU
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.purple}`} />内存
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.orange}`} />GPU
              </span>
            </div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>资源类型分布</h3>
          </div>
          <div className={styles.chartBody}>
            <div className={styles.pieChartContainer}>
              <div className={styles.pieChart}>
                <svg viewBox="0 0 200 200">
                  <circle
                    cx="100" cy="100" r="80" fill="none" stroke="#1677FF" strokeWidth="40"
                    strokeDasharray={`${(stats.bmsCount / stats.totalResources) * 502 * 0.8} 502`}
                    strokeDashoffset="0" transform="rotate(-90 100 100)"
                    className={styles.pieSegment}
                  />
                  <circle
                    cx="100" cy="100" r="80" fill="none" stroke="#52C41A" strokeWidth="40"
                    strokeDasharray={`${(stats.ecsCount / stats.totalResources) * 502 * 0.8} 502`}
                    strokeDashoffset={`-${(stats.bmsCount / stats.totalResources) * 502 * 0.8}`}
                    transform="rotate(-90 100 100)"
                    className={styles.pieSegment}
                  />
                  <circle
                    cx="100" cy="100" r="80" fill="none" stroke="#FA8C16" strokeWidth="40"
                    strokeDasharray={`${(stats.containerCount / stats.totalResources) * 502 * 0.8} 502`}
                    strokeDashoffset={`-${((stats.bmsCount + stats.ecsCount) / stats.totalResources) * 502 * 0.8}`}
                    transform="rotate(-90 100 100)"
                    className={styles.pieSegment}
                  />
                  <circle
                    cx="100" cy="100" r="80" fill="none" stroke="#722ED1" strokeWidth="40"
                    strokeDasharray={`${(stats.generalCount / stats.totalResources) * 502 * 0.8} 502`}
                    strokeDashoffset={`-${((stats.bmsCount + stats.ecsCount + stats.containerCount) / stats.totalResources) * 502 * 0.8}`}
                    transform="rotate(-90 100 100)"
                    className={styles.pieSegment}
                  />
                  <text x="100" y="95" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1D2129">
                    {stats.totalResources}
                  </text>
                  <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#86909C">
                    总资源
                  </text>
                </svg>
              </div>
              <div className={styles.pieLegend}>
                <div className={styles.pieLegendItem}>
                  <span className={`${styles.pieDot} ${styles.blue}`} />
                  <span className={styles.pieLabel}>
                    裸金属 <strong>{stats.bmsCount}</strong>
                  </span>
                </div>
                <div className={styles.pieLegendItem}>
                  <span className={`${styles.pieDot} ${styles.green}`} />
                  <span className={styles.pieLabel}>
                    云主机 <strong>{stats.ecsCount}</strong>
                  </span>
                </div>
                <div className={styles.pieLegendItem}>
                  <span className={`${styles.pieDot} ${styles.orange}`} />
                  <span className={styles.pieLabel}>
                    容器 <strong>{stats.containerCount}</strong>
                  </span>
                </div>
                <div className={styles.pieLegendItem}>
                  <span className={`${styles.pieDot} ${styles.purple}`} />
                  <span className={styles.pieLabel}>
                    通算 <strong>{stats.generalCount}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartsSecondRow}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>月度消费分析</h3>
            <div className={styles.chartTagInfo}>
              <span className={styles.tagLabel}>本年累计</span>
              <span className={styles.tagValue}>¥{stats.yearlyCost.toLocaleString()}</span>
            </div>
          </div>
          <div className={styles.chartBody}>
            <div className={styles.barChartContainer}>
              <div className={styles.barChartYAxis}>
                {[maxMonthlyCost, maxMonthlyCost * 0.75, maxMonthlyCost * 0.5, maxMonthlyCost * 0.25, 0].map(
                  (value) => (
                    <span key={value}>¥{Math.round(value / 1000)}k</span>
                  )
                )}
              </div>
              <div className={styles.barChartArea}>
                {monthlyCostData.map((item, index) => (
                  <div
                    key={item.month}
                    className={styles.barItemWrapper}
                    onMouseEnter={() => setHoveredBarIndex(index)}
                    onMouseLeave={() => setHoveredBarIndex(-1)}
                  >
                    {hoveredBarIndex === index && (
                      <div className={styles.barTooltip}>
                        <div className={styles.tooltipMonth}>{item.month}</div>
                        <div className={styles.tooltipAmount}>¥{item.amount.toLocaleString()}</div>
                        <div className={`${styles.tooltipTrend} ${item.trend >= 0 ? styles.up : styles.down}`}>
                          较上月 {item.trend >= 0 ? '+' : ''}
                          {item.trend}%
                        </div>
                      </div>
                    )}
                    <div
                      className={`${styles.barFill} ${item.trend >= 0 ? styles.barUp : styles.barDown} ${
                        hoveredBarIndex === index ? styles.barHighlight : ''
                      }`}
                      style={{ height: `${(item.amount / maxMonthlyCost) * 100}%` }}
                    >
                      {hoveredBarIndex === index && (
                        <div className={styles.barValueLabel}>¥{(item.amount / 1000).toFixed(1)}k</div>
                      )}
                    </div>
                    <div className={styles.barXLabel}>{item.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>TOP5 资源占用排行</h3>
            <Tag color="warning" className={styles.tableTag}>
              按 GPU 占用
            </Tag>
          </div>
          <div className={styles.chartBody}>
            <div className={styles.rankingList}>
              {topRankingData.map((item, index) => (
                <div
                  key={item.id}
                  className={styles.rankingItem}
                >
                  <div className={`${styles.rankBadge} ${getRankClass(index)}`}>
                    <span>{index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}</span>
                  </div>
                  <div className={styles.rankInfo}>
                    <div className={styles.rankName}>{item.name}</div>
                    <div className={styles.rankMeta}>
                      <span className={styles.rankType}>{item.type}</span>
                      <span className={styles.rankDivider}>·</span>
                      <span className={styles.rankGpu}>
                        {item.gpuModel} × {item.gpuNum}
                      </span>
                    </div>
                  </div>
                  <div className={styles.rankProgressWrap}>
                    <div className={styles.rankProgress}>
                      <div
                        className={`${styles.rankProgressFill} ${getRankClass(index)}`}
                        style={{ width: `${item.usagePercent}%` }}
                      />
                    </div>
                    <div className={styles.rankPercent}>{item.usagePercent}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartsThirdRow}>
        <div className={`${styles.chartCard} ${styles.activityCard}`}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>最近活动</h3>
            <Button type="link" size="small" onClick={() => message.info('查看全部活动功能即将上线')}>
              查看全部
            </Button>
          </div>
          <div className={styles.chartBody}>
            <div className={styles.activityTimeline}>
              {recentActivities.map((activity) => (
                <div key={activity.id} className={styles.timelineItem}>
                  <div className={`${styles.timelineDot} ${activityClassMap[activity.type]}`}>
                    {activityIconMap[activity.type] || <ControlOutlined />}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>{activity.title}</div>
                    <div className={styles.timelineMeta}>
                      <span className={styles.timelineTime}>{activity.time}</span>
                      <span className={styles.timelineUser}>{activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${styles.chartCard} ${styles.quickActionCard}`}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>快速操作</h3>
          </div>
          <div className={styles.chartBody}>
            <div className={styles.quickActionGrid}>
              {quickActions.map((action) => (
                <div
                  key={action.path}
                  className={styles.quickActionItem}
                  onClick={() => navigate(action.path)}
                >
                  <div className={`${styles.actionIconBox} ${action.colorClass}`}>{action.icon}</div>
                  <div className={styles.actionLabel}>{action.label}</div>
                  <div className={styles.actionDesc}>{action.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${styles.chartCard} ${styles.healthCard}`}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>平台健康度</h3>
          </div>
          <div className={styles.chartBody}>
            <div className={styles.healthScoreWrap}>
              <svg viewBox="0 0 120 120" className={styles.healthRingSvg}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#F0F2F5" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="url(#healthGradient)" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${95 * 3.14} 314`}
                  transform="rotate(-90 60 60)"
                  className={styles.healthProgressCircle}
                />
                <defs>
                  <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#52C41A" />
                    <stop offset="100%" stopColor="#1677FF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className={styles.healthScoreText}>
                <div className={styles.healthScoreNum}>95</div>
                <div className={styles.healthScoreLabel}>健康评分</div>
              </div>
            </div>
            <div className={styles.healthMetrics}>
              <div className={styles.healthMetricItem}>
                <div className={styles.metricName}>资源可用率</div>
                <div className={styles.metricBar}>
                  <div className={`${styles.metricBarFill} ${styles.green}`} style={{ width: '98%' }} />
                </div>
                <div className={styles.metricValue}>98%</div>
              </div>
              <div className={styles.healthMetricItem}>
                <div className={styles.metricName}>网络稳定性</div>
                <div className={styles.metricBar}>
                  <div className={`${styles.metricBarFill} ${styles.blue}`} style={{ width: '95%' }} />
                </div>
                <div className={styles.metricValue}>95%</div>
              </div>
              <div className={styles.healthMetricItem}>
                <div className={styles.metricName}>故障恢复</div>
                <div className={styles.metricBar}>
                  <div className={`${styles.metricBarFill} ${styles.purple}`} style={{ width: '92%' }} />
                </div>
                <div className={styles.metricValue}>92%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.resourceTableCard}>
        <div className={styles.tableHeaderRow}>
          <h3 className={styles.tableTitle}>我的资源</h3>
          <div className={styles.tableActions}>
            <Input
              className={styles.tableSearch}
              placeholder="搜索资源名称或ID"
              value={searchQuery}
              allowClear
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <Table
            columns={columns}
            dataSource={filteredTableData}
            rowKey="id"
            size="middle"
            scroll={{ x: 1200 }}
            pagination={false}
          />
        </div>

        <div className={styles.paginationContainerRow}>
          <Pagination
            total={filteredTableData.length}
            current={currentPage}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50]}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
            onChange={(page, size) => {
              setCurrentPage(page)
              if (size !== pageSize) {
                setPageSize(size)
                setCurrentPage(1)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
