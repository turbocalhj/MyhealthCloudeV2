import { useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, Modal, Pagination, Radio, Select, Table, Tag, message } from 'antd'
import type { TableColumnsType } from 'antd'
import {
  BellOutlined,
  CheckOutlined,
  DownloadOutlined,
  FileUnknownOutlined,
  FolderOpenOutlined,
  MessageOutlined,
  PlusOutlined,
  ReadOutlined,
  ReloadOutlined,
  SearchOutlined,
  WarningFilled,
  WarningOutlined
} from '@ant-design/icons'
import { useUserStore } from '@/store/user'
import styles from './MessageCenter.module.css'

/* ========== 类型定义 ========== */
type MessageCategory = '合同' | '到期通知' | '系统通知' | '订单消息' | '安全告警' | '资源监控'
type MessagePriority = '高' | '中' | '低'
type MessageStatus = '未读' | '已读'
type ExportFormat = 'csv' | 'json'
type PriorityTagColor = 'error' | 'warning' | 'default'

interface MessageRow {
  id: number | string
  title: string
  content: string
  category: MessageCategory
  priority: MessagePriority
  status: MessageStatus
  time: string
}

interface MessageTemplate {
  id: number
  name: string
  category: MessageCategory
  priority: MessagePriority
  content: string
}

interface TemplateFormState {
  name: string
  category: MessageCategory | ''
  priority: MessagePriority
  content: string
}

interface UseTemplateFormState {
  title: string
  content: string
  priority: MessagePriority
}

interface CategoryStat {
  category: string
  count: number
  percentage: number
}

/* ========== 常量 ========== */
const MESSAGES_KEY = 'platform_system_messages'
const TEMPLATES_KEY = 'platform_message_templates'

const MESSAGE_CATEGORIES: MessageCategory[] = ['合同', '到期通知', '系统通知', '订单消息', '安全告警', '资源监控']

const CATEGORY_OPTIONS = MESSAGE_CATEGORIES.map((category) => ({ value: category, label: category }))
const STATUS_OPTIONS: Array<{ value: MessageStatus; label: MessageStatus }> = [
  { value: '未读', label: '未读' },
  { value: '已读', label: '已读' }
]
const PRIORITY_OPTIONS: Array<{ value: MessagePriority; label: MessagePriority }> = [
  { value: '高', label: '高' },
  { value: '中', label: '中' },
  { value: '低', label: '低' }
]

const CATEGORY_DEFAULT_PRIORITY: Record<MessageCategory, MessagePriority> = {
  合同: '中',
  到期通知: '高',
  系统通知: '中',
  订单消息: '中',
  安全告警: '高',
  资源监控: '低'
}

const CATEGORY_BADGE_CLASS: Record<MessageCategory, string> = {
  合同: styles.categoryContract,
  到期通知: styles.categoryExpire,
  系统通知: styles.categorySystem,
  订单消息: styles.categoryOrder,
  安全告警: styles.categorySecurity,
  资源监控: styles.categoryMonitor
}

const CATEGORY_BAR_CLASS: Record<MessageCategory, string> = {
  合同: styles.barColorCategoryContract,
  到期通知: styles.barColorCategoryExpire,
  系统通知: styles.barColorCategorySystem,
  订单消息: styles.barColorCategoryOrder,
  安全告警: styles.barColorCategorySecurity,
  资源监控: styles.barColorCategoryMonitor
}

const PRIORITY_TAG_MAP: Record<MessagePriority, PriorityTagColor> = {
  高: 'error',
  中: 'warning',
  低: 'default'
}

const TEMPLATE_TAG_MAP: Record<MessageCategory, string> = {
  合同: 'processing',
  到期通知: 'warning',
  系统通知: 'default',
  订单消息: 'success',
  安全告警: 'error',
  资源监控: 'default'
}

const DEFAULT_TEMPLATES: MessageTemplate[] = [
  { id: 1, name: '合同到期提醒', category: '到期通知', priority: '高', content: '合同编号：{合同编号} 即将到期，剩余天数：{剩余天数}，请及时处理续费事宜。' },
  { id: 2, name: '订单支付成功', category: '订单消息', priority: '中', content: '您的订单 {订单号} 已支付成功，金额 ¥{金额}，资源正在准备中。' },
  { id: 3, name: '系统维护通知', category: '系统通知', priority: '中', content: '平台将于 {维护时间} 进行系统升级维护，届时部分服务可能出现短暂不可用。' },
  { id: 4, name: '安全告警通知', category: '安全告警', priority: '高', content: '检测到异常登录行为，IP地址：{IP地址}，如非本人操作请立即修改密码。' }
]

/* ========== 工具函数 ========== */
const isMessageCategory = (value: unknown): value is MessageCategory =>
  typeof value === 'string' && (MESSAGE_CATEGORIES as string[]).includes(value)

const isMessagePriority = (value: unknown): value is MessagePriority =>
  value === '高' || value === '中' || value === '低'

const categoryBadgeClass = (category: string): string =>
  CATEGORY_BADGE_CLASS[category as MessageCategory] || styles.categoryDefault

const categoryBarClass = (category: string): string =>
  CATEGORY_BAR_CLASS[category as MessageCategory] || styles.barColorCategoryDefault

const getPriorityTag = (priority: MessagePriority): PriorityTagColor => PRIORITY_TAG_MAP[priority] || 'default'

const getTemplateCategoryTag = (category: MessageCategory): string => TEMPLATE_TAG_MAP[category] || 'default'

const formatNow = (): string => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(
    now.getMinutes()
  )}:${pad(now.getSeconds())}`
}

const buildMessage = (
  id: number,
  title: string,
  content: string,
  category: MessageCategory,
  status: MessageStatus,
  time: string,
  priority: MessagePriority = CATEGORY_DEFAULT_PRIORITY[category]
): MessageRow => ({ id, title, content, category, priority, status, time })

// mock 数据集：12 条高保真流水账期通知 + 89 条补充流水，共 101 条
const create100PlusMessagesDataset = (): MessageRow[] => {
  const dataset: MessageRow[] = []

  dataset.push(
    buildMessage(1, '合同资源配置通知', '运营方已配置合同资源，合同编号：yin0529，资源将持续保持高可用监控，请登录资源监控台查看物理设备实例。', '合同', '未读', '2026-06-01 17:15:52'),
    buildMessage(2, '合同即将到期通知', '合同编号：HT20260529001（云上合同ID：HT20260529001）即将到达续费截止期，为避免裸金属主机被停机回收，请尽快处理。', '到期通知', '未读', '2026-05-31 09:00:00'),
    buildMessage(3, '合同即将到期通知', '合同编号：HT20260529001（云上合同ID：HT20260529001）剩余可用天数不足2天，算力资源调度池将执行锁定预警。', '到期通知', '未读', '2026-05-30 09:00:00'),
    buildMessage(4, '合同资源交付完成通知', '合同编号：HT20260529001，资源按合同配置已全部按需部署上架完毕，包含 8*Ascend 910B 算力卡组。', '合同', '未读', '2026-05-29 14:38:49'),
    buildMessage(5, '合同资源配置通知', '运营方已配置合同资源，合同编号：HT20260529001，物理隔离策略已部署，安全通道已下发。', '合同', '未读', '2026-05-29 14:38:48'),
    buildMessage(6, '合同申请审批通过通知，业务单号CA202605291436145947', '您的合同【单号：CA202605291436145947】审批通过，计费系统已建立对应的免费账期策略流。', '合同', '未读', '2026-05-29 14:36:44'),
    buildMessage(7, '合同申请审批通过通知，业务单号CA202605290942469582', '您的合同【单号：CA202605290942469582】审批通过，对应云主机和网络频宽配置就绪。', '合同', '未读', '2026-05-29 09:42:58'),
    buildMessage(8, '系统升级维护通知', '平台将于2026-06-15 02:00-06:00进行系统升级维护，届时部分服务可能出现短暂不可用，请提前做好业务安排。', '系统通知', '未读', '2026-06-10 10:00:00'),
    buildMessage(9, '订单支付成功通知', '您的订单 ORD202606101246282536 已支付成功，金额 ¥2,400.00，资源正在准备中。', '订单消息', '未读', '2026-06-10 12:50:00'),
    buildMessage(10, '安全登录异常告警', '检测到您的账号在异常地点登录，IP地址：192.168.1.100，如非本人操作请立即修改密码。', '安全告警', '未读', '2026-06-09 23:15:30'),
    buildMessage(11, 'GPU资源使用率告警', '您的GPU实例 gpu-instance-001 CPU使用率持续超过90%已达30分钟，请关注业务负载情况。', '资源监控', '未读', '2026-06-09 18:20:00'),
    buildMessage(12, '订单创建成功通知', '您的订单 ORD202606091126404900 已创建成功，金额 ¥5,800.00，请尽快完成支付。', '订单消息', '未读', '2026-06-09 11:30:00')
  )

  for (let i = 1; i <= 89; i++) {
    const category = MESSAGE_CATEGORIES[i % 6]
    const isUnread = i <= 20
    let title = ''
    let content = ''

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

    dataset.push(
      buildMessage(
        12 + i,
        title,
        content,
        category,
        isUnread ? '未读' : '已读',
        `2026-05-${formattedDay} 14:${(i % 60).toString().padStart(2, '0')}:12`
      )
    )
  }

  return dataset
}

const normalizeMessage = (raw: unknown): MessageRow => {
  const item = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const category: MessageCategory = isMessageCategory(item.category) ? item.category : '系统通知'
  const id =
    typeof item.id === 'number' || typeof item.id === 'string'
      ? item.id
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return {
    id,
    title: typeof item.title === 'string' ? item.title : '',
    content: typeof item.content === 'string' ? item.content : '',
    category,
    priority: isMessagePriority(item.priority) ? item.priority : CATEGORY_DEFAULT_PRIORITY[category],
    status: item.status === '已读' ? '已读' : '未读',
    time: typeof item.time === 'string' ? item.time : ''
  }
}

const loadInitData = (): MessageRow[] => {
  const localData = localStorage.getItem(MESSAGES_KEY)
  if (localData) {
    try {
      const parsed = JSON.parse(localData) as unknown
      if (Array.isArray(parsed)) return parsed.map(normalizeMessage)
    } catch {
      // 数据损坏时回落到内置快照
    }
  }
  const initData = create100PlusMessagesDataset()
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(initData))
  return initData
}

const normalizeTemplate = (raw: unknown): MessageTemplate | null => {
  const item = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  if (typeof item.name !== 'string') return null
  const category: MessageCategory = isMessageCategory(item.category) ? item.category : '系统通知'
  return {
    id: typeof item.id === 'number' ? item.id : Date.now() + Math.floor(Math.random() * 1000),
    name: item.name,
    category,
    priority: isMessagePriority(item.priority) ? item.priority : CATEGORY_DEFAULT_PRIORITY[category],
    content: typeof item.content === 'string' ? item.content : ''
  }
}

const loadTemplates = (): MessageTemplate[] => {
  const localData = localStorage.getItem(TEMPLATES_KEY)
  if (localData) {
    try {
      const parsed = JSON.parse(localData) as unknown
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeTemplate).filter((item): item is MessageTemplate => item !== null)
      }
    } catch {
      // 数据损坏时回落到默认模板
    }
  }
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(DEFAULT_TEMPLATES))
  return DEFAULT_TEMPLATES
}

const downloadFile = (blob: Blob, filename: string) => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export default function MessageCenter() {
  const unreadCount = useUserStore((state) => state.unreadCount)
  const syncMessageStatus = useUserStore((state) => state.syncMessageStatus)
  const getUnreadCount = useUserStore((state) => state.getUnreadCount)
  const markAsRead = useUserStore((state) => state.markAsRead)
  const markAllAsRead = useUserStore((state) => state.markAllAsRead)

  const [messages, setMessages] = useState<MessageRow[]>(loadInitData)
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(loadTemplates)

  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [keywordSearch, setKeywordSearch] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [tableRefreshKey, setTableRefreshKey] = useState(0)

  // 详情弹窗
  const [detailDialogVisible, setDetailDialogVisible] = useState(false)
  const [activeMessage, setActiveMessage] = useState<MessageRow | null>(null)

  // 导出
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv')

  // 消息模板
  const [showCreateTemplateDialog, setShowCreateTemplateDialog] = useState(false)
  const [showUseTemplateDialog, setShowUseTemplateDialog] = useState(false)
  const [templateForm, setTemplateForm] = useState<TemplateFormState>({ name: '', category: '', priority: '中', content: '' })
  const [useTemplateForm, setUseTemplateForm] = useState<UseTemplateFormState>({ title: '', content: '', priority: '中' })
  const [currentUsingTemplate, setCurrentUsingTemplate] = useState<MessageTemplate | null>(null)

  // 首屏与顶栏铃铛读数保持同一数据源
  useEffect(() => {
    getUnreadCount()
  }, [getUnreadCount])

  /* ========== 统计面板 ========== */
  const totalCount = messages.length
  const readCount = useMemo(() => messages.filter((item) => item.status === '已读').length, [messages])
  const unreadPercent = totalCount > 0 ? Math.round((unreadCount / totalCount) * 100) : 0
  const readRate = 100 - unreadPercent
  const highPriorityCount = useMemo(
    () => messages.filter((item) => item.priority === '高' && item.status === '未读').length,
    [messages]
  )

  // 分类统计数据
  const categoryStatsData = useMemo<CategoryStat[]>(() => {
    if (totalCount === 0) return []
    const categoryMap: Record<string, number> = {}
    messages.forEach((item) => {
      categoryMap[item.category] = (categoryMap[item.category] || 0) + 1
    })
    return Object.entries(categoryMap)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / totalCount) * 100)
      }))
      .sort((a, b) => b.count - a.count)
  }, [messages, totalCount])

  /* ========== 过滤与分页 ========== */
  const filteredMessageDataset = useMemo(() => {
    const keyword = keywordSearch.toLowerCase()
    return messages.filter((item) => {
      const matchCategory = !categoryFilter || item.category === categoryFilter
      const matchStatus = !statusFilter || item.status === statusFilter
      const matchPriority = !priorityFilter || item.priority === priorityFilter
      const matchKeyword =
        !keywordSearch ||
        item.title.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword)
      return matchCategory && matchStatus && matchPriority && matchKeyword
    })
  }, [messages, categoryFilter, statusFilter, priorityFilter, keywordSearch])

  const filteredMessageTotalCount = filteredMessageDataset.length

  const paginatedMessageData = useMemo(() => {
    const startOffset = (currentPage - 1) * pageSize
    return filteredMessageDataset.slice(startOffset, startOffset + pageSize)
  }, [filteredMessageDataset, currentPage, pageSize])

  const selectedRows = useMemo(
    () => messages.filter((item) => selectedRowKeys.some((key) => key === item.id)),
    [messages, selectedRowKeys]
  )

  /* ========== 数据落盘与跨页面联动 ========== */
  const persistMessages = (next: MessageRow[]) => {
    setMessages(next)
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(next))
    syncMessageStatus()
    window.dispatchEvent(new CustomEvent('update-message-bell-badge'))
  }

  const persistTemplates = (next: MessageTemplate[]) => {
    setMessageTemplates(next)
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(next))
  }

  /* ========== 筛选动作 ========== */
  const handleFilterSearch = () => {
    setCurrentPage(1)
    message.success('消息过滤器执行重调')
  }

  const handleFilterReset = () => {
    setCategoryFilter('')
    setStatusFilter('')
    setPriorityFilter('')
    setKeywordSearch('')
    setCurrentPage(1)
  }

  const handleKeywordSearch = (value: string) => {
    setKeywordSearch(value)
    setCurrentPage(1)
  }

  const handleKeywordClear = () => {
    setKeywordSearch('')
    setCurrentPage(1)
  }

  const handlePaginationChange = (page: number, size: number) => {
    if (size !== pageSize) {
      setPageSize(size)
      setCurrentPage(1)
      return
    }
    setCurrentPage(page)
  }

  /* ========== 已读状态 ========== */
  const toggleSingleRead = (row: MessageRow) => {
    if (row.status !== '未读') return
    setMessages((prev) => prev.map((item) => (item.id === row.id ? { ...item, status: '已读' } : item)))
    setTableRefreshKey((key) => key + 1)
    message.success('消息已标为阅读态')
    markAsRead(row.id)
  }

  const batchMarkAsRead = () => {
    const selectedIds = selectedRows.map((item) => item.id)
    const next = messages.map((item) =>
      selectedIds.some((id) => id === item.id) ? { ...item, status: '已读' as MessageStatus } : item
    )
    setTableRefreshKey((key) => key + 1)
    message.success('选中的批量流水单号已全部切为已读')
    persistMessages(next)
  }

  const allMarkAsRead = () => {
    setMessages((prev) => prev.map((item) => ({ ...item, status: '已读' as MessageStatus })))
    setTableRefreshKey((key) => key + 1)
    message.success('当前面板中所有未读通知已全局一键清空')
    markAllAsRead()
  }

  const checkMessageDetail = (row: MessageRow) => {
    if (row.status === '未读') {
      setMessages((prev) => prev.map((item) => (item.id === row.id ? { ...item, status: '已读' } : item)))
      setTableRefreshKey((key) => key + 1)
      markAsRead(row.id)
    }
    setActiveMessage({ ...row, status: '已读' })
    setDetailDialogVisible(true)
  }

  /* ========== 导出 ========== */
  const exportAsJSON = (data: MessageRow[]) => {
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    downloadFile(blob, `消息导出_${new Date().toLocaleDateString()}.json`)
  }

  const exportAsCSV = (data: MessageRow[]) => {
    const headers = ['ID', '标题', '内容', '分类', '优先级', '状态', '时间']
    const rows = data.map((item) => [
      String(item.id),
      `"${item.title}"`,
      `"${item.content}"`,
      item.category,
      item.priority,
      item.status,
      item.time
    ])
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    downloadFile(blob, `消息导出_${new Date().toLocaleDateString()}.csv`)
  }

  const handleExport = () => {
    const data = filteredMessageDataset
    if (data.length === 0) {
      message.warning('没有可导出的数据')
      setShowExportDialog(false)
      return
    }
    if (exportFormat === 'json') {
      exportAsJSON(data)
    } else {
      exportAsCSV(data)
    }
    setShowExportDialog(false)
    message.success(`成功导出 ${data.length} 条消息`)
  }

  /* ========== 消息模板 ========== */
  const handleCreateTemplate = () => {
    if (!templateForm.name || !templateForm.category || !templateForm.content) {
      message.warning('请填写完整的模板信息')
      return
    }
    const newTemplate: MessageTemplate = {
      id: Date.now(),
      name: templateForm.name,
      category: templateForm.category,
      priority: templateForm.priority,
      content: templateForm.content
    }
    persistTemplates([...messageTemplates, newTemplate])
    message.success('模板创建成功')
    setShowCreateTemplateDialog(false)
    setTemplateForm({ name: '', category: '', priority: '中', content: '' })
  }

  const useTemplate = (template: MessageTemplate) => {
    setCurrentUsingTemplate(template)
    setUseTemplateForm({
      title: template.name,
      content: template.content,
      priority: template.priority
    })
    setShowUseTemplateDialog(true)
  }

  const handleSendFromTemplate = () => {
    if (!useTemplateForm.title || !useTemplateForm.content) {
      message.warning('请填写完整的消息信息')
      return
    }
    const newMessage: MessageRow = {
      id: Date.now(),
      title: useTemplateForm.title,
      content: useTemplateForm.content,
      category: currentUsingTemplate?.category || '系统通知',
      priority: useTemplateForm.priority,
      status: '未读',
      time: formatNow()
    }
    persistMessages([newMessage, ...messages])
    message.success('消息发送成功')
    setShowUseTemplateDialog(false)
    setUseTemplateForm({ title: '', content: '', priority: '中' })
    setCurrentUsingTemplate(null)
  }

  const deleteTemplate = (id: number) => {
    persistTemplates(messageTemplates.filter((template) => template.id !== id))
    message.success('模板已删除')
  }

  /* ========== 表格列 ========== */
  const columns: TableColumnsType<MessageRow> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 240,
      ellipsis: { showTitle: true },
      render: (_, row) => (
        <span className={`${styles.titleTextNode} ${row.status === '未读' ? styles.isUnreadBold : ''}`}>
          {row.priority === '高' && (
            <WarningFilled className={`${styles.priorityIcon} ${styles.highPriority}`} />
          )}
          {row.title}
        </span>
      )
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 320,
      ellipsis: { showTitle: true }
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 90,
      render: (_, row) => (
        <Tag color={getPriorityTag(row.priority)}>
          {row.priority}
        </Tag>
      )
    },
    {
      title: '消息分类',
      dataIndex: 'category',
      key: 'category',
      width: 110,
      render: (_, row) => (
        <span className={`${styles.categoryBadgeTag} ${categoryBadgeClass(row.category)}`}>{row.category}</span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (_, row) => (
        <span
          className={`${styles.statusBadgeLblLink} ${
            row.status === '未读' ? styles.colorInteractiveBlue : styles.colorNeutralRead
          }`}
          onClick={() => toggleSingleRead(row)}
        >
          {row.status === '未读' && <MessageOutlined className={styles.bubbleIconPrefix} />}
          {row.status}
        </span>
      )
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 170
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, row) => (
        <span className={styles.actionCheckDetailBtn} onClick={() => checkMessageDetail(row)}>
          详情
        </span>
      )
    }
  ]

  return (
    <div className={styles.consoleMessageCenterDashboardLayout}>
      {/* 消息统计面板 */}
      <div className={styles.messageStatsPanel}>
        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.bgBlue}`}>
            <MessageOutlined style={{ fontSize: 24 }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>消息总数</div>
            <div className={styles.statValue}>{totalCount}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.bgOrange}`}>
            <BellOutlined style={{ fontSize: 24 }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>未读消息</div>
            <div className={styles.statValue}>{unreadCount}</div>
            <div className={styles.statTrend}>占比 {unreadPercent}%</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.bgGreen}`}>
            <CheckOutlined style={{ fontSize: 24 }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>已读消息</div>
            <div className={styles.statValue}>{readCount}</div>
            <div className={styles.statTrend}>阅读率 {readRate}%</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIconBox} ${styles.bgRed}`}>
            <WarningOutlined style={{ fontSize: 24 }} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>高优先级</div>
            <div className={styles.statValue}>{highPriorityCount}</div>
            <div className={`${styles.statTrend} ${styles.statTrendWarning}`}>需关注</div>
          </div>
        </div>
      </div>

      {/* 消息分类统计图表 */}
      <div className={styles.categoryStatsChartPanel}>
        <div className={styles.chartHeaderTitle}>
          <span className={styles.titleText}>消息分类分布</span>
          <Tag color="default">实时</Tag>
        </div>
        <div className={styles.chartBarsContainer}>
          {categoryStatsData.map((item) => (
            <div key={item.category} className={styles.chartBarItem}>
              <div className={styles.barLabelRow}>
                <span className={styles.barCategoryName}>{item.category}</span>
                <span className={styles.barCountValue}>{item.count} 条</span>
              </div>
              <div className={styles.barTrackBg}>
                <div
                  className={`${styles.barFillProgress} ${categoryBarClass(item.category)}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className={styles.barPercentLabel}>{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* 消息模板快捷面板 */}
      <div className={styles.messageTemplateQuickPanel}>
        <div className={styles.templatePanelHeader}>
          <span className={styles.panelTitleText}>
            <FolderOpenOutlined />
            消息模板
          </span>
          <Button size="small" type="primary" ghost onClick={() => setShowCreateTemplateDialog(true)}>
            <PlusOutlined className={styles.iconMargin} />
            新建模板
          </Button>
        </div>
        <div className={styles.templateGridList}>
          {messageTemplates.map((template) => (
            <div key={template.id} className={styles.templateCardItem}>
              <div className={styles.templateCardHeader}>
                <span className={styles.templateNameText}>{template.name}</span>
                <Tag color={getTemplateCategoryTag(template.category)}>{template.category}</Tag>
              </div>
              <p className={styles.templatePreviewText}>{template.content.substring(0, 50)}...</p>
              <div className={styles.templateCardActions}>
                <Button size="small" type="link" onClick={() => useTemplate(template)}>
                  使用
                </Button>
                <Button size="small" type="link" danger onClick={() => deleteTemplate(template.id)}>
                  删除
                </Button>
              </div>
            </div>
          ))}
          {messageTemplates.length === 0 && (
            <div className={styles.templateEmptyState}>
              <FileUnknownOutlined style={{ fontSize: 48, color: '#C0C4CC' }} />
              <p>暂无消息模板，点击"新建模板"创建</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.messageFilterCardBox}>
        <div className={styles.filterLayoutFieldsInlineRow}>
          <div className={styles.fieldItemCell}>
            <span className={styles.lblCaption}>消息分类</span>
            <Select
              allowClear
              placeholder="请选择消息分类"
              style={{ width: 220 }}
              value={categoryFilter || undefined}
              options={CATEGORY_OPTIONS}
              onChange={(value) => setCategoryFilter(value ?? '')}
            />
          </div>
          <div className={styles.fieldItemCell}>
            <span className={styles.lblCaption}>状态</span>
            <Select
              allowClear
              placeholder="请选择状态"
              style={{ width: 220 }}
              value={statusFilter || undefined}
              options={STATUS_OPTIONS}
              onChange={(value) => setStatusFilter(value ?? '')}
            />
          </div>
          <div className={styles.fieldItemCell}>
            <span className={styles.lblCaption}>优先级</span>
            <Select
              allowClear
              placeholder="请选择优先级"
              style={{ width: 220 }}
              value={priorityFilter || undefined}
              options={PRIORITY_OPTIONS}
              onChange={(value) => setPriorityFilter(value ?? '')}
            />
          </div>
          <div className={styles.actionsFlexButtonsGroup}>
            <Button type="primary" className={styles.btnBlueSearchAction} icon={<SearchOutlined />} onClick={handleFilterSearch}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleFilterReset}>
              重置
            </Button>
          </div>
        </div>

        {/* 关键字搜索栏 */}
        <div className={styles.keywordSearchRow}>
          <Input
            allowClear
            className={styles.keywordSearchInput}
            placeholder="🔍 输入关键字搜索消息标题或内容..."
            prefix={<SearchOutlined />}
            value={keywordSearch}
            onChange={(event) => handleKeywordSearch(event.target.value)}
            onClear={handleKeywordClear}
          />
          {keywordSearch && (
            <span className={styles.searchResultCount}>找到 {filteredMessageTotalCount} 条结果</span>
          )}
        </div>

        <div className={styles.batchManipulationTriggerRow}>
          <Button
            className={styles.btnPlainBatchRead}
            disabled={selectedRowKeys.length === 0}
            onClick={batchMarkAsRead}
          >
            <CheckOutlined className={styles.iconMargin} /> 标记为已读
          </Button>
          <Button type="primary" ghost className={styles.btnOutlineAllRead} onClick={allMarkAsRead}>
            <ReadOutlined className={styles.iconMargin} /> 全部已读
          </Button>
          <Button className={styles.btnExportAction} onClick={() => setShowExportDialog(true)}>
            <DownloadOutlined className={styles.iconMargin} /> 导出消息
          </Button>
        </div>
      </div>

      <div className={styles.messageTableCanvasCard}>
        <div key={tableRefreshKey} className={styles.tableFlashAnimation}>
          <Table<MessageRow>
            rowKey="id"
            size="middle"
            style={{ width: '100%' }}
            columns={columns}
            dataSource={paginatedMessageData}
            scroll={{ x: 1100 }}
            rowSelection={{
              selectedRowKeys,
              columnWidth: 50,
              onChange: (keys) => setSelectedRowKeys(keys)
            }}
            pagination={false}
          />
        </div>

        <div className={styles.tablePaginationFooterRow}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredMessageTotalCount}
            pageSizeOptions={['10', '20', '50']}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
            onChange={handlePaginationChange}
          />
        </div>
      </div>

      {/* 消息详情弹窗 */}
      <Modal
        title="消息详情"
        width={720}
        centered
        open={detailDialogVisible}
        onCancel={() => setDetailDialogVisible(false)}
        footer={
          <div className={styles.dialogCustomFooterActions}>
            <Button
              type="primary"
              className={styles.btnDialogCloseAction}
              onClick={() => setDetailDialogVisible(false)}
            >
              关闭
            </Button>
          </div>
        }
      >
        <div className={styles.messageMatrixGridFrame}>
          <div className={styles.gridRowItem}>
            <div className={styles.gridCellLabel}>标题</div>
            <div className={`${styles.gridCellValue} ${styles.boldTitleText}`}>{activeMessage?.title ?? ''}</div>
          </div>

          <div className={`${styles.gridRowItem} ${styles.splitTwoCols}`}>
            <div className={styles.halfCol}>
              <div className={styles.gridCellLabel}>消息分类</div>
              <div className={styles.gridCellValue}>
                <span className={`${styles.categoryTagNode} ${categoryBadgeClass(activeMessage?.category ?? '')}`}>
                  {activeMessage?.category ?? ''}
                </span>
              </div>
            </div>
            <div className={`${styles.halfCol} ${styles.borderLeftDivider}`}>
              <div className={styles.gridCellLabel}>优先级</div>
              <div className={styles.gridCellValue}>
                {activeMessage && (
                  <Tag color={getPriorityTag(activeMessage.priority)}>{activeMessage.priority}</Tag>
                )}
              </div>
            </div>
          </div>

          <div className={`${styles.gridRowItem} ${styles.splitTwoCols}`}>
            <div className={styles.halfCol}>
              <div className={styles.gridCellLabel}>状态</div>
              <div className={styles.gridCellValue}>{activeMessage?.status ?? ''}</div>
            </div>
            <div className={`${styles.halfCol} ${styles.borderLeftDivider}`}>
              <div className={styles.gridCellLabel}>发送时间</div>
              <div className={`${styles.gridCellValue} ${styles.fontMonoStyle}`}>{activeMessage?.time ?? ''}</div>
            </div>
          </div>

          <div className={`${styles.gridRowItem} ${styles.alignStretchMode}`}>
            <div className={`${styles.gridCellLabel} ${styles.contentLabelFix}`}>内容</div>
            <div className={`${styles.gridCellValue} ${styles.textParagraphContent}`}>
              {activeMessage?.content ?? ''}
            </div>
          </div>
        </div>
      </Modal>

      {/* 导出弹窗 */}
      <Modal
        title="导出消息"
        width={480}
        centered
        open={showExportDialog}
        onCancel={() => setShowExportDialog(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowExportDialog(false)}>
            取消
          </Button>,
          <Button key="ok" type="primary" onClick={handleExport}>
            确认导出
          </Button>
        ]}
      >
        <div className={styles.exportDialogContent}>
          <p className={styles.exportDesc}>选择导出格式，将导出当前筛选条件下的所有消息：</p>
          <div className={styles.exportFormatOptions}>
            <Radio.Group value={exportFormat} onChange={(event) => setExportFormat(event.target.value as ExportFormat)}>
              <Radio value="csv">CSV 表格</Radio>
              <Radio value="json">JSON 数据</Radio>
            </Radio.Group>
          </div>
          <div className={styles.exportPreview}>
            <span>预计导出 {filteredMessageTotalCount} 条消息</span>
          </div>
        </div>
      </Modal>

      {/* 创建消息模板弹窗 */}
      <Modal
        title="新建消息模板"
        width={560}
        centered
        open={showCreateTemplateDialog}
        onCancel={() => setShowCreateTemplateDialog(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowCreateTemplateDialog(false)}>
            取消
          </Button>,
          <Button key="ok" type="primary" onClick={handleCreateTemplate}>
            创建模板
          </Button>
        ]}
      >
        <Form
          colon={false}
          labelAlign="right"
          labelCol={{ flex: '0 0 80px' }}
          wrapperCol={{ flex: 'auto' }}
          className={styles.templateFormLayout}
        >
          <Form.Item label="模板名称">
            <Input
              placeholder="请输入模板名称"
              value={templateForm.name}
              onChange={(event) => setTemplateForm({ ...templateForm, name: event.target.value })}
            />
          </Form.Item>
          <Form.Item label="消息分类">
            <Select
              style={{ width: '100%' }}
              placeholder="请选择分类"
              options={CATEGORY_OPTIONS}
              value={templateForm.category || undefined}
              onChange={(value) => setTemplateForm({ ...templateForm, category: value ?? '' })}
            />
          </Form.Item>
          <Form.Item label="优先级">
            <Select
              style={{ width: '100%' }}
              placeholder="请选择优先级"
              options={PRIORITY_OPTIONS}
              value={templateForm.priority}
              onChange={(value) => setTemplateForm({ ...templateForm, priority: value })}
            />
          </Form.Item>
          <Form.Item label="模板内容">
            <Input.TextArea
              rows={4}
              placeholder="请输入消息模板内容，支持使用 {变量名} 作为占位符"
              value={templateForm.content}
              onChange={(event) => setTemplateForm({ ...templateForm, content: event.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 使用模板弹窗 */}
      <Modal
        title="使用消息模板"
        width={560}
        centered
        open={showUseTemplateDialog}
        onCancel={() => setShowUseTemplateDialog(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowUseTemplateDialog(false)}>
            取消
          </Button>,
          <Button key="ok" type="primary" onClick={handleSendFromTemplate}>
            发送消息
          </Button>
        ]}
      >
        <Form
          colon={false}
          labelAlign="right"
          labelCol={{ flex: '0 0 80px' }}
          wrapperCol={{ flex: 'auto' }}
          className={styles.templateFormLayout}
        >
          <Form.Item label="消息标题">
            <Input
              placeholder="请输入消息标题"
              value={useTemplateForm.title}
              onChange={(event) => setUseTemplateForm({ ...useTemplateForm, title: event.target.value })}
            />
          </Form.Item>
          <Form.Item label="消息内容">
            <Input.TextArea
              rows={6}
              placeholder="消息内容"
              value={useTemplateForm.content}
              onChange={(event) => setUseTemplateForm({ ...useTemplateForm, content: event.target.value })}
            />
          </Form.Item>
          <Form.Item label="优先级">
            <Select
              style={{ width: '100%' }}
              placeholder="请选择优先级"
              options={PRIORITY_OPTIONS}
              value={useTemplateForm.priority}
              onChange={(value) => setUseTemplateForm({ ...useTemplateForm, priority: value })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
