import { useMemo, useState } from 'react'
import { Button, DatePicker, Form, Input, Modal, Pagination, Select, Table, Tag, message } from 'antd'
import type { GetProps, TableColumnsType } from 'antd'
import {
  AppstoreOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  FileTextOutlined,
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  WarningFilled
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import styles from './TicketList.module.css'

type RangePickerValue = GetProps<typeof DatePicker.RangePicker>['value']

interface TicketRow {
  ticketId: string
  title: string
  ticketType: string
  priority: string
  status: string
  reporter: string
  createTime: string
  updateTime: string
}

interface TicketTemplate {
  id: number
  name: string
  type: string
  desc: string
}

interface TicketFilterForm {
  ticketId: string
  ticketType: string
  title: string
  status: string
  priority: string
}

const EMPTY_FILTER_FORM: TicketFilterForm = {
  ticketId: '',
  ticketType: '',
  title: '',
  status: '',
  priority: ''
}

const TICKET_TYPE_OPTIONS = [
  { label: '咨询工单', value: '咨询工单' },
  { label: '运维工单', value: '运维工单' },
  { label: '故障工单', value: '故障工单' }
]

const TICKET_STATUS_OPTIONS = [
  { label: '待处理', value: '待处理' },
  { label: '处理中', value: '处理中' },
  { label: '转派待接收', value: '转派待接收' },
  { label: '已关闭', value: '已关闭' },
  { label: '已撤回', value: '已撤回' },
  { label: '待客户反馈', value: '待客户反馈' }
]

const TICKET_PRIORITY_OPTIONS = [
  { label: '高', value: '高' },
  { label: '中', value: '中' },
  { label: '低', value: '低' }
]

const RAW_TICKET_LIST: TicketRow[] = [
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
]

// 工单模板
const TICKET_TEMPLATES: TicketTemplate[] = [
  { id: 1, name: '服务器故障报修', type: '故障工单', desc: '适用于服务器宕机、网络异常等紧急故障提报' },
  { id: 2, name: '资源申请', type: '资源类工单', desc: '申请新资源、扩容或调整资源配置' },
  { id: 3, name: '技术咨询', type: '咨询工单', desc: '产品功能、使用方式等技术问题咨询' },
  { id: 4, name: '运维协助', type: '运维工单', desc: '需要运维人员协助处理的操作请求' }
]

const TEMPLATE_TAG_COLOR_MAP: Record<string, string> = {
  故障工单: 'error',
  资源类工单: 'processing',
  咨询工单: 'default',
  运维工单: 'success'
}

const getTemplateTypeTag = (type: string): string => TEMPLATE_TAG_COLOR_MAP[type] || 'default'

/** 状态标签外圈实线色块架构 */
const getStatusClass = (status: string): string => {
  switch (status) {
    case '转派待接收':
      return styles.statusTransferWait
    case '已撤回':
      return styles.statusWithdrawn
    case '已关闭':
      return styles.statusClosed
    case '处理中':
      return styles.statusProcessing
    case '待客户反馈':
      return styles.statusClientFeedback
    case '待处理':
      return styles.statusPending
    default:
      return ''
  }
}

const getPriorityClass = (priority: string): string => {
  switch (priority) {
    case '高':
      return styles.priorityHighTag
    case '中':
      return styles.priorityMediumTag
    case '低':
      return styles.priorityLowTag
    default:
      return ''
  }
}

export default function TicketList() {
  const navigate = useNavigate()

  const [filterForm, setFilterForm] = useState<TicketFilterForm>(EMPTY_FILTER_FORM)
  const [timeRange, setTimeRange] = useState<RangePickerValue>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [tableRawDataset, setTableRawDataset] = useState<TicketRow[]>(RAW_TICKET_LIST)

  const patchFilterForm = (patch: Partial<TicketFilterForm>) => {
    setFilterForm((prev) => ({ ...prev, ...patch }))
  }

  // 统计计算属性
  const totalTickets = tableRawDataset.length
  const pendingTickets = tableRawDataset.filter((item) => item.status === '待处理').length
  const processingTickets = tableRawDataset.filter((item) => item.status === '处理中').length
  const highPriorityTickets = tableRawDataset.filter(
    (item) => item.priority === '高' && item.status !== '已关闭'
  ).length

  const filteredTableData = useMemo(
    () =>
      tableRawDataset.filter((item) => {
        const matchId = !filterForm.ticketId || item.ticketId.includes(filterForm.ticketId)
        const matchType = !filterForm.ticketType || item.ticketType === filterForm.ticketType
        const matchTitle = !filterForm.title || item.title.includes(filterForm.title)
        const matchStatus = !filterForm.status || item.status === filterForm.status
        const matchPriority = !filterForm.priority || item.priority === filterForm.priority
        return matchId && matchType && matchTitle && matchStatus && matchPriority
      }),
    [tableRawDataset, filterForm]
  )

  const paginatedTableData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTableData.slice(start, start + pageSize)
  }, [filteredTableData, currentPage, pageSize])

  // 使用模板跳转到创建页
  const useTemplate = (tpl: TicketTemplate) => {
    const params = new URLSearchParams({
      templateType: tpl.type,
      templateName: tpl.name,
      templateDesc: tpl.desc
    })
    navigate(`/console/ticket-create?${params.toString()}`)
  }

  // 导出工单列表
  const handleExport = () => {
    if (filteredTableData.length === 0) {
      message.warning('暂无可导出的工单数据')
      return
    }
    const headers = ['工单编号', '标题', '类型', '优先级', '状态', '提报人', '创建时间', '更新时间']
    const rows = filteredTableData.map((item) => [
      item.ticketId,
      item.title,
      item.ticketType,
      item.priority,
      item.status,
      item.reporter,
      item.createTime,
      item.updateTime
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `工单导出_${new Date().toLocaleDateString()}.csv`
    link.click()
    URL.revokeObjectURL(url)
    message.success(`已成功导出 ${filteredTableData.length} 条工单`)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    message.success('筛选过滤条件载入成功')
  }

  const handleReset = () => {
    setFilterForm(EMPTY_FILTER_FORM)
    setTimeRange(null)
    setCurrentPage(1)
  }

  const goToCreateTicket = () => {
    navigate('/console/ticket-create')
  }

  // 详情动作流，携带 Query 精准下沉跳转详情页
  const handleDetail = (row: TicketRow) => {
    const params = new URLSearchParams({
      ticketId: row.ticketId,
      title: row.title,
      ticketType: row.ticketType,
      status: row.status,
      createTime: row.createTime
    })
    navigate(`/console/ticket-detail?${params.toString()}`)
  }

  const updateTicketStatus = (ticketId: string, status: string) => {
    setTableRawDataset((prev) =>
      prev.map((item) => (item.ticketId === ticketId ? { ...item, status } : item))
    )
  }

  // 遮罩式“关闭确认”弹窗提示与状态切换
  const handleClose = (row: TicketRow) => {
    Modal.confirm({
      title: '关闭确认',
      content: `确定要关闭工单【${row.ticketId}】吗？关闭后将无法继续处理。`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        updateTicketStatus(row.ticketId, '已关闭')
        message.success({
          content: '工单已关闭',
          duration: 3
        })
      }
    })
  }

  const handleCancel = (row: TicketRow) => {
    Modal.confirm({
      title: '安全风险核验',
      content: `确定要撤回工单 ${row.title} 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        updateTicketStatus(row.ticketId, '已撤回')
        message.success('工单撤回成功')
      }
    })
  }

  const handleDelete = (row: TicketRow) => {
    Modal.confirm({
      title: '警示核验',
      content: '确定要永久清空该条工单提报记录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setTableRawDataset((prev) => prev.filter((item) => item.ticketId !== row.ticketId))
        message.success('工单删除成功')
      }
    })
  }

  const columns: TableColumnsType<TicketRow> = [
    { title: '工单编号', dataIndex: 'ticketId', key: 'ticketId', width: 200 },
    {
      title: '工单标题',
      dataIndex: 'title',
      key: 'title',
      width: 180,
      render: (_, record) => (
        <span className={styles.interactiveBlueLinkLbl} onClick={() => handleDetail(record)}>
          {record.title}
        </span>
      )
    },
    { title: '工单类型', dataIndex: 'ticketType', key: 'ticketType', width: 120 },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 90,
      render: (_, record) => (
        <span className={`${styles.priorityTagPillNode} ${getPriorityClass(record.priority)}`}>
          {record.priority === '高' && <WarningFilled className={styles.priorityWarnIcon} />}
          {record.priority}
        </span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (_, record) => (
        <span className={`${styles.statusTagPillNode} ${getStatusClass(record.status)}`}>
          <span className={styles.statusDotInner}>●</span> {record.status}
        </span>
      )
    },
    { title: '提报人', dataIndex: 'reporter', key: 'reporter', width: 100 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 130,
      render: (_, record) => (
        <div className={styles.tableActionsInlineFlex}>
          <span className={styles.actionLinkBtn} onClick={() => handleDetail(record)}>
            详情
          </span>
          {record.status === '待处理' ? (
            <span
              className={`${styles.actionLinkBtn} ${styles.warningLbl}`}
              onClick={() => handleCancel(record)}
            >
              撤回
            </span>
          ) : record.status === '已撤回' ? (
            <span
              className={`${styles.actionLinkBtn} ${styles.dangerLbl}`}
              onClick={() => handleDelete(record)}
            >
              删除
            </span>
          ) : record.status !== '已关闭' ? (
            <span
              className={`${styles.actionLinkBtn} ${styles.infoLbl}`}
              onClick={() => handleClose(record)}
            >
              关闭
            </span>
          ) : (
            <span className={styles.finishedDisabledLbl}>--</span>
          )}
        </div>
      )
    }
  ]

  return (
    <div className={styles.consoleTicketManagementWorkspace}>
      {/* 工单统计面板 */}
      <div className={styles.ticketStatsOverviewPanel}>
        <div className={styles.statCardItem}>
          <div className={`${styles.statIconWrapper} ${styles.bgBlue}`}>
            <FileTextOutlined style={{ fontSize: 24 }} />
          </div>
          <div className={styles.statContentInfo}>
            <div className={styles.statLabelText}>工单总数</div>
            <div className={styles.statValueNumber}>{totalTickets}</div>
          </div>
        </div>
        <div className={styles.statCardItem}>
          <div className={`${styles.statIconWrapper} ${styles.bgOrange}`}>
            <ClockCircleOutlined style={{ fontSize: 24 }} />
          </div>
          <div className={styles.statContentInfo}>
            <div className={styles.statLabelText}>待处理</div>
            <div className={styles.statValueNumber}>{pendingTickets}</div>
            <div className={styles.statTrendText}>需关注</div>
          </div>
        </div>
        <div className={styles.statCardItem}>
          <div className={`${styles.statIconWrapper} ${styles.bgGreen}`}>
            <LoadingOutlined style={{ fontSize: 24 }} />
          </div>
          <div className={styles.statContentInfo}>
            <div className={styles.statLabelText}>处理中</div>
            <div className={styles.statValueNumber}>{processingTickets}</div>
            <div className={styles.statTrendText}>跟进中</div>
          </div>
        </div>
        <div className={styles.statCardItem}>
          <div className={`${styles.statIconWrapper} ${styles.bgRed}`}>
            <WarningFilled style={{ fontSize: 24 }} />
          </div>
          <div className={styles.statContentInfo}>
            <div className={styles.statLabelText}>高优先级</div>
            <div className={styles.statValueNumber}>{highPriorityTickets}</div>
            <div className={`${styles.statTrendText} ${styles.warningText}`}>紧急</div>
          </div>
        </div>
      </div>

      {/* 工单模板快捷面板 */}
      <div className={styles.ticketTemplateQuickPanel}>
        <div className={styles.templatePanelHeaderRow}>
          <span className={styles.panelTitleText}>
            <AppstoreOutlined />
            工单模板
          </span>
          <Button size="small" type="primary" ghost onClick={goToCreateTicket}>
            <PlusOutlined /> 新建工单
          </Button>
        </div>
        <div className={styles.templateCardsList}>
          {TICKET_TEMPLATES.map((tpl) => (
            <div key={tpl.id} className={styles.templateItemCard} onClick={() => useTemplate(tpl)}>
              <div className={styles.templateItemHeader}>
                <span className={styles.templateItemName}>{tpl.name}</span>
                <Tag color={getTemplateTypeTag(tpl.type)}>{tpl.type}</Tag>
              </div>
              <p className={styles.templateItemDesc}>{tpl.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.filterSearchPanelCard}>
        <Form layout="inline" className={styles.filterInlineForm} size="middle">
          <Form.Item label="时间范围">
            <DatePicker.RangePicker
              value={timeRange}
              separator="→"
              placeholder={['开始日期', '结束日期']}
              className={styles.standardFormWidthDate}
              onChange={(value) => setTimeRange(value)}
            />
          </Form.Item>

          <Form.Item label="工单编号">
            <Input
              allowClear
              placeholder="请输入工单编号"
              className={styles.standardFormWidth}
              value={filterForm.ticketId}
              onChange={(e) => patchFilterForm({ ticketId: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="工单类型">
            <Select
              allowClear
              placeholder="请选择类型"
              className={styles.standardFormWidth}
              options={TICKET_TYPE_OPTIONS}
              value={filterForm.ticketType || undefined}
              onChange={(value?: string) => patchFilterForm({ ticketType: value ?? '' })}
            />
          </Form.Item>

          <Form.Item label="工单标题">
            <Input
              allowClear
              placeholder="请输入工单标题"
              className={styles.standardFormWidth}
              value={filterForm.title}
              onChange={(e) => patchFilterForm({ title: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="工单状态">
            <Select
              allowClear
              placeholder="请选择状态"
              className={styles.standardFormWidth}
              options={TICKET_STATUS_OPTIONS}
              value={filterForm.status || undefined}
              onChange={(value?: string) => patchFilterForm({ status: value ?? '' })}
            />
          </Form.Item>

          <Form.Item label="优先级">
            <Select
              allowClear
              placeholder="请选择优先级"
              className={styles.standardFormWidth}
              options={TICKET_PRIORITY_OPTIONS}
              value={filterForm.priority || undefined}
              onChange={(value?: string) => patchFilterForm({ priority: value ?? '' })}
            />
          </Form.Item>

          <Form.Item className={styles.filterActionsFormItem}>
            <Button
              type="primary"
              className={styles.actionSearchPrimaryBtn}
              onClick={handleSearch}
            >
              <SearchOutlined /> 搜索
            </Button>
            <Button className={styles.actionResetPlainBtn} onClick={handleReset}>
              <ReloadOutlined /> 重置
            </Button>
            <Button className={styles.actionExportPlainBtn} onClick={handleExport}>
              <DownloadOutlined /> 导出
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className={styles.dataTableContainerCard}>
        <div className={styles.tableTopBarActions}>
          <Button
            type="primary"
            className={styles.tableCreateTicketActionBtn}
            onClick={goToCreateTicket}
          >
            <PlusOutlined className={styles.plusIconMargin} /> 创建工单
          </Button>
        </div>

        <Table<TicketRow>
          rowKey="ticketId"
          columns={columns}
          dataSource={paginatedTableData}
          pagination={false}
          scroll={{ x: 1400 }}
          className={styles.customCleanDataTable}
        />

        <div className={styles.tablePaginationFooterRow}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50]}
            total={filteredTableData.length}
            showSizeChanger
            showTotal={(total) => `共 ${total} 条`}
            onChange={(page, size) => {
              if (size !== pageSize) {
                setPageSize(size)
                setCurrentPage(1)
                return
              }
              setCurrentPage(page)
            }}
          />
        </div>
      </div>
    </div>
  )
}
