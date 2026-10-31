import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Input, Modal, Pagination, Select, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './OrderManager.module.css'

interface ApplyOrderRow {
  applyId: string
  applicant: string
  price: string
  status: string
  applyTime: string
  updateTime: string
}

interface ResourceRow {
  instanceId: string
  type: string
  configuration: string
  expireDate: string
}

interface ResourceFilters {
  expireTime: string
  resourceType: string
  keyword: string
}

const applyRawList: ApplyOrderRow[] = [
  { applyId: 'ORD202606101246282536', applicant: '张海洋', price: '2,400.00', status: '待支付', applyTime: '2026-06-10 12:46:28', updateTime: '2026-06-10 12:46:28' },
  { applyId: 'ORD202606091126404900', applicant: '张海洋', price: '5,800.00', status: '已支付', applyTime: '2026-06-09 11:26:40', updateTime: '2026-06-09 14:30:15' },
  { applyId: 'ORD202606081119310432', applicant: '张海洋', price: '1,200.00', status: '处理中', applyTime: '2026-06-08 11:19:31', updateTime: '2026-06-09 09:00:00' },
  { applyId: 'ORD202606071108592469', applicant: '张海洋', price: '3,600.00', status: '已完成', applyTime: '2026-06-07 11:08:59', updateTime: '2026-06-08 16:45:30' },
  { applyId: 'ORD202606061055321234', applicant: '张海洋', price: '800.00', status: '已取消', applyTime: '2026-06-06 10:55:32', updateTime: '2026-06-06 11:20:00' }
]

// 模拟表格内的可续费/可退订资源矩阵
const mockResourceData: ResourceRow[] = [
  { instanceId: 'ins-bms-01 (阿里公云-昆仑200)', type: '裸金属', configuration: '1核 1GB | KUNLUNXIN GPU-R200 * 1 | 32GB显存', expireDate: '2026-07-15 23:59:59' },
  { instanceId: 'ins-bms-02 (腾讯云-澎湃弹性级)', type: '裸金属', configuration: '8核 32GB | NVIDIA A100 * 2 | 80GB显存', expireDate: '2026-06-20 12:00:00' }
]

export default function OrderManager() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isApplyOrderView = pathname.includes('apply')
  const isRenewView = pathname.includes('renew')
  const isQuitView = pathname.includes('quit')

  // ==================== 我的申请页控制状态 ====================
  const [activeStatusSelect, setActiveStatusSelect] = useState('待审批')
  const [applyIdQuery, setApplyIdQuery] = useState('')

  // ==================== 资源续费 & 资源退订 核心控制逻辑 ====================
  const [resourceFilters, setResourceFilters] = useState<ResourceFilters>({
    expireTime: '',
    resourceType: 'BMS',
    keyword: ''
  })
  const [selectedResourceRows, setSelectedResourceRows] = useState<ResourceRow[]>([])

  const filteredApplyData = useMemo(() => {
    return applyRawList.filter((item) => {
      return (
        (!activeStatusSelect || item.status === activeStatusSelect) &&
        (!applyIdQuery || item.applyId.includes(applyIdQuery))
      )
    })
  }, [activeStatusSelect, applyIdQuery])

  const resetResourceFilters = () => {
    setResourceFilters({ expireTime: '', resourceType: '', keyword: '' })
    message.info('筛选条件已重置')
  }

  // 路由监听：页面切换时洗空所有过滤器状态与复选快照
  const firstRenderRef = useRef(true)
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    setApplyIdQuery('')
    setActiveStatusSelect('待审批')
    setResourceFilters({ expireTime: '', resourceType: '', keyword: '' })
    setSelectedResourceRows([])
    message.info('筛选条件已重置')
  }, [pathname])

  const getStatusClass = (status: string): string => {
    const classMap: Record<string, string> = {
      待支付: styles.statusPendingPay,
      已支付: styles.statusPaid,
      处理中: styles.statusProcessing,
      已完成: styles.statusCompleted,
      已取消: styles.statusCancelled
    }
    return classMap[status] || styles.orangePendingStatusNode
  }

  const handleSearch = () => {
    message.success('订购工单清单载入完成')
  }

  const goToDetail = (row: ApplyOrderRow) => {
    navigate(`/console/order-detail?orderId=${row.applyId}`)
  }

  const searchResources = () => {
    message.success('已根据条件过滤最新智算资源列表')
  }

  // 图一交互逻辑：批量与单项续费
  const handleBatchRenew = () => {
    message.success(`已为选中的 ${selectedResourceRows.length} 项资源提交批量续费申请`)
  }

  const handleSingleRenew = (row: ResourceRow) => {
    message.success(`成功拉起实例 [${row.instanceId}] 的单项续费收银台`)
  }

  // 图二交互逻辑：批量与单项退订
  const handleBatchQuit = () => {
    Modal.confirm({
      title: '警告',
      content: `确定要批量退订选中的 ${selectedResourceRows.length} 项智算资源吗？退订后服务将停止。`,
      okText: '确定退订',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('批量退订指令已下发')
      }
    })
  }

  const handleSingleQuit = (row: ResourceRow) => {
    Modal.confirm({
      title: '资源退订确认',
      content: `确定要退订实例 [${row.instanceId}] 吗？`,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success('退订申请处理中')
      }
    })
  }

  const applyColumns: ColumnsType<ApplyOrderRow> = [
    {
      title: '申请单编号',
      dataIndex: 'applyId',
      key: 'applyId',
      width: 180,
      render: (_, row) => (
        <span className={styles.tableInteractiveBlueLbl} onClick={() => goToDetail(row)}>
          {row.applyId}
        </span>
      )
    },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 110 },
    { title: '金额', dataIndex: 'price', key: 'price', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <span className={getStatusClass(status)}>
          <span className={styles.dotBlinkInner}>●</span> {status}
        </span>
      )
    },
    { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: 170 },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 170 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, row) => (
        <span className={styles.tableActionTriggerLbl} onClick={() => goToDetail(row)}>
          详情
        </span>
      )
    }
  ]

  const resourceColumns: ColumnsType<ResourceRow> = [
    { title: '实例ID/名称', dataIndex: 'instanceId', key: 'instanceId', width: 180 },
    { title: '资源类型', dataIndex: 'type', key: 'type', width: 120 },
    { title: '配置规范', dataIndex: 'configuration', key: 'configuration', width: 200, ellipsis: true },
    { title: '到期时间', dataIndex: 'expireDate', key: 'expireDate', width: 170 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, row) => (
        <>
          {isRenewView && (
            <span className={styles.tableActionTriggerLbl} onClick={() => handleSingleRenew(row)}>
              续费
            </span>
          )}
          {isQuitView && (
            <span
              className={styles.tableActionTriggerDangerLbl}
              onClick={() => handleSingleQuit(row)}
            >
              退订
            </span>
          )}
        </>
      )
    }
  ]

  return (
    <div className={styles.consoleCardContainer}>
      {isApplyOrderView ? (
        <>
          <div className={styles.orderActionFilterHeaderBar}>
            <div className={styles.filterFlexInputs}>
              <div className={styles.selectCell}>
                <span className={styles.cellLbl}>状态</span>
                <Select
                  value={activeStatusSelect}
                  placeholder="选择状态"
                  style={{ width: 160 }}
                  allowClear
                  onChange={(value) => setActiveStatusSelect(value ?? '')}
                  options={[
                    { label: '全部状态', value: '' },
                    { label: '待支付', value: '待支付' },
                    { label: '已支付', value: '已支付' },
                    { label: '处理中', value: '处理中' },
                    { label: '已完成', value: '已完成' },
                    { label: '已取消', value: '已取消' }
                  ]}
                />
              </div>
              <div className={styles.selectCell}>
                <span className={styles.cellLbl}>申请单编号</span>
                <Input
                  value={applyIdQuery}
                  placeholder="输入申请单编号"
                  style={{ width: 200 }}
                  allowClear
                  onChange={(e) => setApplyIdQuery(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.actionTriggerRow}>
              <Button
                type="primary"
                className={styles.btnPrimaryBlue}
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                搜索
              </Button>
            </div>
          </div>

          <div className={styles.consoleTableWrapper} style={{ marginTop: 16 }}>
            <Table
              columns={applyColumns}
              dataSource={filteredApplyData}
              rowKey="applyId"
              scroll={{ x: 930 }}
              pagination={false}
            />

            <div className={styles.paginationFooterFlexRow}>
              <Pagination
                total={filteredApplyData.length}
                current={1}
                pageSize={10}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total) => `共 ${total} 条`}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.resourceFilterComplexBar}>
            <div className={styles.complexGridInputs}>
              <div className={styles.filterItemNode}>
                <span className={styles.nodeLbl}>到期时间</span>
                <Select
                  value={resourceFilters.expireTime}
                  placeholder="全部"
                  style={{ width: 150 }}
                  allowClear
                  onChange={(value) =>
                    setResourceFilters((prev) => ({ ...prev, expireTime: value ?? '' }))
                  }
                  options={[
                    { label: '近一周到期', value: 'week' },
                    { label: '近一个月到期', value: 'month' },
                    { label: '已到期', value: 'expired' }
                  ]}
                />
              </div>

              <div className={styles.filterItemNode}>
                <span className={styles.nodeLbl}>资源类型</span>
                <Select
                  value={resourceFilters.resourceType}
                  placeholder="裸金属"
                  style={{ width: 150 }}
                  allowClear
                  onChange={(value) =>
                    setResourceFilters((prev) => ({ ...prev, resourceType: value ?? '' }))
                  }
                  options={[
                    { label: '裸金属', value: 'BMS' },
                    { label: '云主机', value: 'ECS' },
                    { label: '容器', value: 'CONTAINER' }
                  ]}
                />
              </div>

              <div className={styles.filterItemNode}>
                <span className={styles.nodeLbl}>实例名称/ID</span>
                <Input
                  value={resourceFilters.keyword}
                  placeholder="请输入"
                  style={{ width: 220 }}
                  allowClear
                  onChange={(e) =>
                    setResourceFilters((prev) => ({ ...prev, keyword: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className={styles.resourceActionTriggerGroup}>
              <div className={styles.leftBatchBtns}>
                {isRenewView && (
                  <Button
                    type="primary"
                    className={styles.btnPrimaryBlue}
                    disabled={selectedResourceRows.length === 0}
                    onClick={handleBatchRenew}
                  >
                    批量续费
                  </Button>
                )}
                {isQuitView && (
                  <Button
                    danger
                    className={styles.btnDangerRed}
                    disabled={selectedResourceRows.length === 0}
                    onClick={handleBatchQuit}
                  >
                    批量退订
                  </Button>
                )}
              </div>
              <div className={styles.rightQueryBtns}>
                <Button icon={<ReloadOutlined />} onClick={resetResourceFilters}>
                  重置
                </Button>
                <Button
                  type="primary"
                  className={styles.btnPrimaryBlue}
                  icon={<SearchOutlined />}
                  onClick={searchResources}
                >
                  查询
                </Button>
              </div>
            </div>
          </div>

          <div className={styles.consoleTableWrapper} style={{ marginTop: 16 }}>
            <Table
              columns={resourceColumns}
              dataSource={mockResourceData}
              rowKey="instanceId"
              scroll={{ x: 830 }}
              pagination={false}
              rowSelection={{
                selectedRowKeys: selectedResourceRows.map((row) => row.instanceId),
                onChange: (_selectedKeys, selectedRows) => setSelectedResourceRows(selectedRows)
              }}
            />

            <div className={styles.paginationFooterFlexRow}>
              <Pagination
                total={mockResourceData.length}
                current={1}
                pageSize={10}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total) => `共 ${total} 条`}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
