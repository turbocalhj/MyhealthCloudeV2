import { useMemo, useState } from 'react'
import { Button, Input, Radio, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './ExpireManager.module.css'

interface ContractRow {
  contractId: string
  contractName: string
  cloudId: string
  demandUser: string
  providerUser: string
  amount: string
  status: string
  startTime: string
  endTime: string
}

interface ExpireResourceRow {
  resourceId: string
  resourceName: string
  resourceType: string
  region: string
  cpu: string
  memory: string
}

type ExpireRow = ContractRow | ExpireResourceRow

const TIME_TABS = ['全部', '已到期', '1天内', '3天内', '7天内']

const contractDataset: ContractRow[] = [
  { contractId: 'HT20260529001', contractName: '续签阿里计算资源折扣合同', cloudId: 'HT20260529001', demandUser: '测评中心', providerUser: '健康云', amount: '¥0.00', status: '履约中', startTime: '2026-05-29', endTime: '2026-05-31' },
  { contractId: 'aaa2', contractName: '续签内部测试资产补充包', cloudId: 'aaa2', demandUser: '测评中心', providerUser: '健康云', amount: '¥0.00', status: '履约中', startTime: '2026-03-31', endTime: '2026-04-30' },
  { contractId: 'HT-260423-002', contractName: '中移高算力集群采购单', cloudId: 'HT-260423-002', demandUser: '测评中心', providerUser: '中国移动', amount: '¥1,000.00', status: '履约中', startTime: '2026-03-01', endTime: '2026-04-01' }
]

const resourceDataset: ExpireResourceRow[] = [
  { resourceId: '8731370905908269056', resourceName: 'yintestLiantong', resourceType: '裸金属', region: '萧山区', cpu: '104核', memory: '256GB' }
]

export default function ExpireManager() {
  const location = useLocation()
  const navigate = useNavigate()

  const [activeTimeTab, setActiveTimeTab] = useState('全部')
  const [contractIdQuery, setContractIdQuery] = useState('')
  const [contractNameQuery, setContractNameQuery] = useState('')

  const isContractMode = useMemo(() => location.pathname.includes('contract'), [location.pathname])

  const renderedTableData = useMemo<ExpireRow[]>(() => {
    if (isContractMode) {
      return contractDataset.filter((item) => {
        return (
          (!contractIdQuery || item.contractId.includes(contractIdQuery)) &&
          (!contractNameQuery || item.contractName.includes(contractNameQuery))
        )
      })
    }
    return resourceDataset
  }, [isContractMode, contractIdQuery, contractNameQuery])

  // 🚀 核心更正：精准切流，使跳转导向独立的平级费用中心页面结构
  const handleGoToStandaloneFinance = (row: ExpireRow) => {
    const contractRow = 'contractId' in row ? row : undefined
    const query = new URLSearchParams({
      id: contractRow?.contractId || 'HT20260529001',
      name: contractRow?.contractName || '阿里合同',
      provider: contractRow?.providerUser || '健康云'
    })
    navigate(`/finance/contract?${query.toString()}`)
  }

  const handleSearch = () => {
    message.success('合同账期过滤检索完毕')
  }
  const handleReset = () => {
    setContractIdQuery('')
    setContractNameQuery('')
  }

  const actionColumn: ColumnsType<ExpireRow>[number] = {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 80,
    render: (_, row) => (
      <span className={styles.actionBlueLinkBtn} onClick={() => handleGoToStandaloneFinance(row)}>
        详情
      </span>
    )
  }

  const columns = useMemo<ColumnsType<ExpireRow>>(() => {
    if (isContractMode) {
      const contractColumns: ColumnsType<ExpireRow> = [
        { title: '合同编号', dataIndex: 'contractId', key: 'contractId', width: 160 },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          key: 'contractName',
          width: 150,
          render: (_, row) => (
            <span
              className={styles.tableBlueLinkLbl}
              onClick={() => handleGoToStandaloneFinance(row)}
            >
              {(row as ContractRow).contractName}
            </span>
          )
        },
        { title: '云上合同ID', dataIndex: 'cloudId', key: 'cloudId', width: 150 },
        { title: '需求方', dataIndex: 'demandUser', key: 'demandUser', width: 100 },
        { title: '供给方', dataIndex: 'providerUser', key: 'providerUser', width: 100 },
        { title: '合同金额', dataIndex: 'amount', key: 'amount', width: 120 },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          align: 'center',
          render: (_, row) => (
            <span className={styles.blueContractStatusPill}>{(row as ContractRow).status}</span>
          )
        },
        { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 130 },
        { title: '结束时间', dataIndex: 'endTime', key: 'endTime', width: 130 }
      ]
      return [...contractColumns, actionColumn]
    }

    const resourceColumns: ColumnsType<ExpireRow> = [
      { title: '资源ID', dataIndex: 'resourceId', key: 'resourceId', width: 180, ellipsis: true },
      { title: '资源名称', dataIndex: 'resourceName', key: 'resourceName', width: 150 },
      { title: '资源类型', dataIndex: 'resourceType', key: 'resourceType', width: 120 },
      { title: '区域', dataIndex: 'region', key: 'region', width: 100 },
      { title: 'CPU', dataIndex: 'cpu', key: 'cpu', width: 90 },
      { title: '内存', dataIndex: 'memory', key: 'memory', width: 90 }
    ]
    return [...resourceColumns, actionColumn]
  }, [isContractMode])

  return (
    <div className={`${styles.consoleCardContainer} notranslate`} translate="no">
      <div className={styles.filterTabsRowBox}>
        <span className={styles.filterCaptionLbl}>到期时间</span>
        <Radio.Group
          size="small"
          value={activeTimeTab}
          onChange={(e) => setActiveTimeTab(e.target.value as string)}
          optionType="button"
        >
          {TIME_TABS.map((tab) => (
            <Radio.Button key={tab} value={tab}>
              {tab}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      {isContractMode && (
        <div className={styles.contractAdvancedSearchBar}>
          <div className={styles.searchFieldsFlex}>
            <div className={styles.fieldCell}>
              <span className={styles.cellLabel}>合同编号</span>
              <Input
                value={contractIdQuery}
                placeholder="请输入合同编号"
                style={{ width: 200 }}
                allowClear
                onChange={(e) => setContractIdQuery(e.target.value)}
              />
            </div>
            <div className={styles.fieldCell}>
              <span className={styles.cellLabel}>合同名称</span>
              <Input
                value={contractNameQuery}
                placeholder="请输入合同名称"
                style={{ width: 200 }}
                allowClear
                onChange={(e) => setContractNameQuery(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.searchActions}>
            <Button type="primary" className={styles.btnPrimaryBlue} onClick={handleSearch}>
              <SearchOutlined style={{ marginRight: 4 }} /> 搜索
            </Button>
            <Button onClick={handleReset}>
              <ReloadOutlined style={{ marginRight: 4 }} /> 重置
            </Button>
          </div>
        </div>
      )}

      <div className={styles.consoleTableWrapper} style={{ marginTop: 20 }}>
        <Table<ExpireRow>
          dataSource={renderedTableData}
          columns={columns}
          rowKey={(row) => ('contractId' in row ? row.contractId : row.resourceId)}
          size="middle"
          style={{ width: '100%' }}
          scroll={{ x: 1000 }}
          pagination={false}
        />
      </div>
    </div>
  )
}
