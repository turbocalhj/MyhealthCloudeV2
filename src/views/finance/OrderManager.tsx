import { useMemo, useState } from 'react'
import { Button, Input, Select, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import styles from './OrderManager.module.css'

interface OrderRow {
  id: string
  demander: string
  provider: string
  price: string
  status: string
  applicant: string
  createTime: string
}

const STATUS_OPTIONS = [
  { value: '交付中', label: '交付中' },
  { value: '已完成', label: '已完成' }
]

const ORDER_DATASET: OrderRow[] = [
  {
    id: 'OR202606011715527448',
    demander: '测评中心',
    provider: '健康云',
    price: '¥0.00',
    status: '交付中',
    applicant: '张海洋',
    createTime: '2026-06-01 17:15:52'
  },
  {
    id: 'OR202605291438482551',
    demander: '测评中心',
    provider: '健康云',
    price: '¥0.00',
    status: '已完成',
    applicant: '张海洋',
    createTime: '2026-05-29 14:38:48'
  }
]

const columns: ColumnsType<OrderRow> = [
  {
    title: '订单号',
    dataIndex: 'id',
    key: 'id',
    width: 190,
    render: (value: string) => <span className={styles.tableInteractiveBlueNode}>{value}</span>
  },
  { title: '需求方', dataIndex: 'demander', key: 'demander', width: 120 },
  { title: '供给方', dataIndex: 'provider', key: 'provider', width: 120 },
  { title: '金额', dataIndex: 'price', key: 'price', width: 120 },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    align: 'center',
    render: (value: string) => (
      <span
        className={`${styles.pillTagNode} ${value === '已完成' ? styles.greenNode : styles.orangeNode}`}
      >
        {value}
      </span>
    )
  },
  { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 110 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  {
    title: '操作',
    key: 'action',
    width: 80,
    fixed: 'right',
    render: () => <span className={styles.tableActionTriggerLbl}>详情</span>
  }
]

export default function OrderManager() {
  const [filterStatus, setFilterStatus] = useState('')
  const [filterOrderId, setFilterOrderId] = useState('')

  const computedOrderRows = useMemo(
    () =>
      ORDER_DATASET.filter((item) => {
        return (
          (!filterStatus || item.status === filterStatus) &&
          (!filterOrderId || item.id.includes(filterOrderId))
        )
      }),
    [filterStatus, filterOrderId]
  )

  const handleSearch = () => {}

  const handleReset = () => {
    setFilterStatus('')
    setFilterOrderId('')
  }

  return (
    <div className={styles.standaloneOrderFluidWorkspace}>
      <div className={styles.filterCombinationCard}>
        <div className={styles.filterLayoutLine}>
          <div className={styles.inputsCellsFlexCluster}>
            <div className={styles.cell}>
              <span className={styles.label}>状态</span>
              <Select
                allowClear
                placeholder="选择状态"
                style={{ width: 180 }}
                value={filterStatus || undefined}
                options={STATUS_OPTIONS}
                onChange={(value) => setFilterStatus(value ?? '')}
              />
            </div>
            <div className={styles.cell}>
              <span className={styles.label}>订单号</span>
              <Input
                allowClear
                placeholder="输入订单号查询"
                style={{ width: 240 }}
                value={filterOrderId}
                onChange={(e) => setFilterOrderId(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.actionsButtonsCluster}>
            <Button type="primary" onClick={handleSearch}>
              搜索
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </div>
        </div>
      </div>

      <div className={`${styles.tableFrameContainer} ${styles.marginTop12}`}>
        <Table<OrderRow>
          rowKey="id"
          columns={columns}
          dataSource={computedOrderRows}
          pagination={false}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}
