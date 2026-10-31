import { useMemo, useState } from 'react'
import { Button, Empty, Input, Modal, Select, Tag, message } from 'antd'
import {
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  LoadingOutlined,
  PaperClipOutlined,
  SearchOutlined,
  SyncOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import styles from './ResourceLifecycle.module.css'

type LifecycleStageKey = 'applied' | 'approving' | 'provisioning' | 'running' | 'expiring' | 'retired'

type StageStatus = 'completed' | 'current' | 'pending'

interface StageHistoryItem {
  id: string
  stageName: string
  status: StageStatus
  startTime: string
  endTime: string | null
  description: string
  operator: string
  attachments: string[]
}

interface ResourceUsage {
  runtimeHours: number
  avgCpu: number
  avgCpuPeak: number
  avgGpu: number
  totalTraffic: number
  alarmCount: number
  totalCost: number
}

interface LifecycleResource {
  id: string
  name: string
  type: string
  region: string
  provider: string
  spec: string
  monthlyFee: number
  currentStage: LifecycleStageKey
  history: StageHistoryItem[]
  usage: ResourceUsage
}

interface LifecycleStage {
  key: LifecycleStageKey
  label: string
}

interface LifecycleStats {
  total: number
  pending: number
  running: number
  expiring: number
  retired: number
}

// 生命周期阶段定义
const LIFECYCLE_STAGES: LifecycleStage[] = [
  { key: 'applied', label: '已申请' },
  { key: 'approving', label: '审批中' },
  { key: 'provisioning', label: '开通中' },
  { key: 'running', label: '运行中' },
  { key: 'expiring', label: '即将到期' },
  { key: 'retired', label: '已退订' }
]

const STAGE_OPTIONS = LIFECYCLE_STAGES.map((stage) => ({ value: stage.key, label: stage.label }))

// 统计数据
const LIFECYCLE_STATS: LifecycleStats = {
  total: 28,
  pending: 3,
  running: 18,
  expiring: 4,
  retired: 3
}

// 资源数据（带完整生命周期历史）
const RESOURCE_LIST: LifecycleResource[] = [
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
]

const STAGE_TAG_COLOR_MAP: Record<LifecycleStageKey, string> = {
  applied: 'default',
  approving: 'warning',
  provisioning: 'warning',
  running: 'success',
  expiring: 'error',
  retired: 'default'
}

const STAGE_STATUS_COLOR_MAP: Record<StageStatus, string> = {
  completed: 'success',
  current: 'warning',
  pending: 'default'
}

const STAGE_STATUS_LABEL_MAP: Record<StageStatus, string> = {
  completed: '已完成',
  current: '进行中',
  pending: '未开始'
}

const TOTAL_DURATION_MAP: Record<LifecycleStageKey, string> = {
  applied: '< 1 小时',
  approving: '2.5 小时',
  provisioning: '5 天',
  running: '152 天',
  expiring: '305 天',
  retired: '14 个月'
}

const getStageIndex = (stage: string): number => LIFECYCLE_STAGES.findIndex((item) => item.key === stage)

const getStageLabel = (stage: string): string =>
  LIFECYCLE_STAGES.find((item) => item.key === stage)?.label || stage

const getStageTagColor = (stage: string): string =>
  STAGE_TAG_COLOR_MAP[stage as LifecycleStageKey] || 'default'

const getStageStatusColor = (status: string): string =>
  STAGE_STATUS_COLOR_MAP[status as StageStatus] || 'default'

const getStageStatusLabel = (status: string): string =>
  STAGE_STATUS_LABEL_MAP[status as StageStatus] || status

const getTotalDurationText = (resource: LifecycleResource | undefined): string => {
  if (!resource) return '--'
  return TOTAL_DURATION_MAP[resource.currentStage] || '--'
}

const stageStateClass = (status: StageStatus): string => {
  if (status === 'completed') return styles.completed
  if (status === 'current') return styles.current
  return styles.pending
}

export default function ResourceLifecycle() {
  const navigate = useNavigate()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterStage, setFilterStage] = useState('')
  const [selectedResourceId, setSelectedResourceId] = useState('r-001')

  // 过滤后的资源列表
  const filteredResourceList = useMemo(() => {
    let list = RESOURCE_LIST
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase()
      list = list.filter(
        (item) => item.name.toLowerCase().includes(kw) || item.id.toLowerCase().includes(kw)
      )
    }
    if (filterStage) {
      list = list.filter((item) => item.currentStage === filterStage)
    }
    return list
  }, [searchKeyword, filterStage])

  // 当前选中的资源
  const currentResource = useMemo(
    () => RESOURCE_LIST.find((item) => item.id === selectedResourceId),
    [selectedResourceId]
  )

  const totalDurationText = getTotalDurationText(currentResource)

  const selectResource = (id: string) => {
    setSelectedResourceId(id)
  }

  const goResourceDetail = () => {
    if (!currentResource) return
    navigate('/console/resource-detail?id=' + currentResource.id)
  }

  const handleRenew = () => {
    Modal.confirm({
      title: '续费确认',
      content: `确认对资源 "${currentResource?.name}" 进行续费？`,
      okText: '确认续费',
      cancelText: '取消',
      onOk: () => {
        message.success('续费申请已提交')
      }
    })
  }

  const handleRetire = () => {
    Modal.confirm({
      title: '退订确认',
      content: `确认退订资源 "${currentResource?.name}"？退订后将清除所有数据。`,
      okText: '确认退订',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('退订申请已提交')
      }
    })
  }

  return (
    <div className={styles.resourceLifecyclePage}>
      {/* 顶部统计 */}
      <div className={styles.lifecycleStatsRow}>
        <div className={styles.lifecycleStatCard}>
          <div className={`${styles.statIconWrap} ${styles.statBlue}`}>
            <FileTextOutlined style={{ fontSize: 24 }} />
          </div>
          <div className={styles.statContentWrap}>
            <div className={styles.statLabelText}>申请总数</div>
            <div className={styles.statNumber}>{LIFECYCLE_STATS.total}</div>
            <div className={styles.statSubText}>本季度</div>
          </div>
        </div>
        <div className={styles.lifecycleStatCard}>
          <div className={`${styles.statIconWrap} ${styles.statOrange}`}>
            <LoadingOutlined style={{ fontSize: 24 }} />
          </div>
          <div className={styles.statContentWrap}>
            <div className={styles.statLabelText}>审批中</div>
            <div className={styles.statNumber}>{LIFECYCLE_STATS.pending}</div>
            <div className={styles.statSubText}>平均 2.3h</div>
          </div>
        </div>
        <div className={styles.lifecycleStatCard}>
          <div className={`${styles.statIconWrap} ${styles.statGreen}`}>
            <CheckCircleOutlined style={{ fontSize: 24 }} />
          </div>
          <div className={styles.statContentWrap}>
            <div className={styles.statLabelText}>运行中</div>
            <div className={styles.statNumber}>{LIFECYCLE_STATS.running}</div>
            <div className={styles.statSubText}>开通率 92%</div>
          </div>
        </div>
        <div className={styles.lifecycleStatCard}>
          <div className={`${styles.statIconWrap} ${styles.statPurple}`}>
            <ClockCircleOutlined style={{ fontSize: 24 }} />
          </div>
          <div className={styles.statContentWrap}>
            <div className={styles.statLabelText}>即将到期</div>
            <div className={styles.statNumber}>{LIFECYCLE_STATS.expiring}</div>
            <div className={`${styles.statSubText} ${styles.warningText}`}>30天内</div>
          </div>
        </div>
        <div className={styles.lifecycleStatCard}>
          <div className={`${styles.statIconWrap} ${styles.statGray}`}>
            <DeleteOutlined style={{ fontSize: 24 }} />
          </div>
          <div className={styles.statContentWrap}>
            <div className={styles.statLabelText}>已退订</div>
            <div className={styles.statNumber}>{LIFECYCLE_STATS.retired}</div>
            <div className={styles.statSubText}>本年</div>
          </div>
        </div>
      </div>

      {/* 主体两列布局：左侧资源列表 + 右侧详情 */}
      <div className={styles.lifecycleMainRow}>
        {/* 左侧：资源列表 */}
        <div className={styles.resourceListCard}>
          <div className={styles.resourceListHeader}>
            <h3 className={styles.listTitle}>资源列表</h3>
            <div className={styles.listSearchArea}>
              <Input
                size="small"
                allowClear
                placeholder="搜索资源ID/名称"
                prefix={<SearchOutlined />}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <Select
                size="small"
                allowClear
                placeholder="筛选阶段"
                style={{ width: 120 }}
                value={filterStage || undefined}
                options={STAGE_OPTIONS}
                onChange={(value) => setFilterStage(value ?? '')}
              />
            </div>
          </div>
          <div className={styles.resourceItemsScroll}>
            {filteredResourceList.map((item) => (
              <div
                key={item.id}
                className={`${styles.resourceItem} ${selectedResourceId === item.id ? styles.active : ''}`}
                onClick={() => selectResource(item.id)}
              >
                <div className={styles.resourceItemTop}>
                  <span className={styles.resourceNameText}>{item.name}</span>
                  <Tag color={getStageTagColor(item.currentStage)}>{getStageLabel(item.currentStage)}</Tag>
                </div>
                <div className={styles.resourceItemMeta}>
                  <span className={styles.resourceTypeText}>{item.type}</span>
                  <span className={styles.metaDivider}>·</span>
                  <span className={styles.resourceIdText}>{item.id}</span>
                </div>
                <div className={styles.resourceItemProgress}>
                  <div className={styles.miniStepBar}>
                    {LIFECYCLE_STAGES.map((step, idx) => (
                      <div
                        key={step.key}
                        className={`${styles.miniStep} ${
                          idx < getStageIndex(item.currentStage)
                            ? styles.done
                            : idx === getStageIndex(item.currentStage)
                              ? styles.active
                              : ''
                        }`}
                      />
                    ))}
                  </div>
                  <span className={styles.progressText}>
                    {getStageIndex(item.currentStage) + 1}/{LIFECYCLE_STAGES.length}
                  </span>
                </div>
              </div>
            ))}
            {filteredResourceList.length === 0 && (
              <div className={styles.emptyListTip}>
                <Empty description="未找到匹配的资源" imageStyle={{ width: 60, height: 60 }} />
              </div>
            )}
          </div>
        </div>

        {/* 右侧：详情 */}
        {currentResource ? (
          <div className={styles.resourceDetailCard}>
            {/* 资源概览 */}
            <div className={styles.detailSectionCard}>
              <div className={styles.detailSectionHeader}>
                <div className={styles.resourceTitleRow}>
                  <h2 className={styles.resourceBigName}>{currentResource.name}</h2>
                  <Tag color={getStageTagColor(currentResource.currentStage)}>
                    {getStageLabel(currentResource.currentStage)}
                  </Tag>
                </div>
                <div className={styles.resourceQuickActions}>
                  <Button size="small" icon={<EyeOutlined />} onClick={goResourceDetail}>
                    查看详情
                  </Button>
                  {currentResource.currentStage === 'running' && (
                    <Button
                      size="small"
                      icon={<SyncOutlined />}
                      style={{ color: '#FA8C16', borderColor: '#FFC069' }}
                      onClick={handleRenew}
                    >
                      续费
                    </Button>
                  )}
                  {(currentResource.currentStage === 'running' ||
                    currentResource.currentStage === 'expiring') && (
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={handleRetire}>
                      退订
                    </Button>
                  )}
                </div>
              </div>

              <div className={styles.resourceInfoGrid}>
                <div className={styles.infoGridItem}>
                  <div className={styles.infoLabel}>资源ID</div>
                  <div className={`${styles.infoValue} ${styles.fontCode}`}>{currentResource.id}</div>
                </div>
                <div className={styles.infoGridItem}>
                  <div className={styles.infoLabel}>资源类型</div>
                  <div className={styles.infoValue}>{currentResource.type}</div>
                </div>
                <div className={styles.infoGridItem}>
                  <div className={styles.infoLabel}>所属区域</div>
                  <div className={styles.infoValue}>{currentResource.region}</div>
                </div>
                <div className={styles.infoGridItem}>
                  <div className={styles.infoLabel}>供给方</div>
                  <div className={styles.infoValue}>{currentResource.provider}</div>
                </div>
                <div className={styles.infoGridItem}>
                  <div className={styles.infoLabel}>规格</div>
                  <div className={styles.infoValue}>{currentResource.spec}</div>
                </div>
                <div className={styles.infoGridItem}>
                  <div className={styles.infoLabel}>月费</div>
                  <div className={`${styles.infoValue} ${styles.priceText}`}>
                    ¥{currentResource.monthlyFee.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* 生命周期时间线 */}
            <div className={styles.detailSectionCard}>
              <div className={styles.sectionTitleRow}>
                <span className={styles.blueVLine}></span>
                <span className={styles.sectionTitleText}>生命周期时间线</span>
                <span className={styles.durationText}>总耗时 {totalDurationText}</span>
              </div>
              <div className={styles.lifecycleTimelineContainer}>
                {currentResource.history.map((stage, idx) => (
                  <div key={stage.id} className={`${styles.timelineStageItem} ${stageStateClass(stage.status)}`}>
                    <div className={`${styles.stageDotCircle} ${stageStateClass(stage.status)}`}>
                      {stage.status === 'completed' ? (
                        <CheckOutlined style={{ fontSize: 14 }} />
                      ) : stage.status === 'current' ? (
                        <LoadingOutlined style={{ fontSize: 14 }} />
                      ) : (
                        <ClockCircleOutlined style={{ fontSize: 14 }} />
                      )}
                    </div>
                    <div className={styles.stageContentBlock}>
                      <div className={styles.stageTitleRow}>
                        <span className={styles.stageNameText}>{stage.stageName}</span>
                        <Tag color={getStageStatusColor(stage.status)}>
                          {getStageStatusLabel(stage.status)}
                        </Tag>
                      </div>
                      <div className={styles.stageTimeText}>
                        {stage.startTime} → {stage.endTime || '进行中'}
                      </div>
                      {stage.description && (
                        <div className={styles.stageDescText}>{stage.description}</div>
                      )}
                      {stage.operator && (
                        <div className={styles.stageOperatorText}>
                          <UserOutlined style={{ fontSize: 12 }} />
                          <span>操作人：{stage.operator}</span>
                        </div>
                      )}
                      {stage.attachments && stage.attachments.length > 0 && (
                        <div className={styles.stageAttachments}>
                          {stage.attachments.map((att, i) => (
                            <div key={i} className={styles.attachmentChip}>
                              <PaperClipOutlined style={{ fontSize: 12 }} />
                              <span>{att}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {idx < currentResource.history.length - 1 && (
                      <div
                        className={`${styles.stageConnectorLine} ${stageStateClass(stage.status)}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 资源使用统计 */}
            <div className={styles.detailSectionCard}>
              <div className={styles.sectionTitleRow}>
                <span className={styles.blueVLine}></span>
                <span className={styles.sectionTitleText}>资源使用统计</span>
              </div>
              <div className={styles.usageStatsGrid}>
                <div className={styles.usageStatItem}>
                  <div className={styles.usageStatLabel}>运行时长</div>
                  <div className={styles.usageStatValue}>
                    {currentResource.usage.runtimeHours}
                    <span className={styles.unitText}>小时</span>
                  </div>
                  <div className={styles.usageStatTrend}>累计</div>
                </div>
                <div className={styles.usageStatItem}>
                  <div className={styles.usageStatLabel}>平均CPU</div>
                  <div className={styles.usageStatValue}>
                    {currentResource.usage.avgCpu}
                    <span className={styles.unitText}>%</span>
                  </div>
                  <div className={styles.usageStatTrend}>
                    {currentResource.usage.avgCpuPeak > 80 ? '高峰' : '正常'}
                  </div>
                </div>
                <div className={styles.usageStatItem}>
                  <div className={styles.usageStatLabel}>平均GPU</div>
                  <div className={styles.usageStatValue}>
                    {currentResource.usage.avgGpu}
                    <span className={styles.unitText}>%</span>
                  </div>
                  <div className={styles.usageStatTrend}>利用率良好</div>
                </div>
                <div className={styles.usageStatItem}>
                  <div className={styles.usageStatLabel}>网络流量</div>
                  <div className={styles.usageStatValue}>
                    {currentResource.usage.totalTraffic}
                    <span className={styles.unitText}>GB</span>
                  </div>
                  <div className={styles.usageStatTrend}>累计</div>
                </div>
                <div className={styles.usageStatItem}>
                  <div className={styles.usageStatLabel}>告警次数</div>
                  <div className={styles.usageStatValue}>{currentResource.usage.alarmCount}</div>
                  <div
                    className={`${styles.usageStatTrend} ${
                      currentResource.usage.alarmCount > 0 ? styles.warningText : styles.successText
                    }`}
                  >
                    {currentResource.usage.alarmCount > 0 ? '需关注' : '运行稳定'}
                  </div>
                </div>
                <div className={styles.usageStatItem}>
                  <div className={styles.usageStatLabel}>累计消费</div>
                  <div className={`${styles.usageStatValue} ${styles.priceText}`}>
                    ¥{currentResource.usage.totalCost.toLocaleString()}
                  </div>
                  <div className={styles.usageStatTrend}>已发生</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.resourceDetailEmpty}>
            <Empty description="请从左侧选择资源查看生命周期" imageStyle={{ width: 120, height: 120 }} />
          </div>
        )}
      </div>
    </div>
  )
}
