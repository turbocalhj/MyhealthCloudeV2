import { useMemo, useState } from 'react'
import { Button, Dropdown, Input, Pagination, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { MoreOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import styles from './GeneralResource.module.css'

interface GeneralResourceRow {
  id: string
  name: string
  region: string
  cpu: string
  memory: string
  intranetIp: string
  isContract: string
  demandUser: string
  status: string
  systemDisk: string
}

const tableRawDataset: GeneralResourceRow[] = [
  { id: '1-2ze2awf50fszzvp7qq1z', name: 'FT_AUTO_ALI_20260531...', region: '--', cpu: '1核', memory: '1GB', intranetIp: '172.16.0.94', isContract: '否', demandUser: '测评中心', status: '运行中', systemDisk: '40GB' },
  { id: 'i-2zehnnuzmb2te7mbo0rn', name: 'test-jacky', region: '--', cpu: '1核', memory: '2GB', intranetIp: '172.16.156.163', isContract: '否', demandUser: '测评中心', status: '运行中', systemDisk: '40GB' },
  { id: '1-2zef1oxtc4jymmbr4lk8', name: 'jky0529', region: '--', cpu: '12核', memory: '96GB', intranetIp: '172.16.0.97', isContract: '否', demandUser: '测评中心', status: '已停止', systemDisk: '100GB' },
  { id: 'i-2zehlr7vlhb57jisetavp', name: 'jacky-5-29-1', region: '--', cpu: '1核', memory: '1GB', intranetIp: '172.27.73.245', isContract: '否', demandUser: '测评中心', status: '运行中', systemDisk: '40GB' }
]

export default function GeneralResource() {
  const navigate = useNavigate()
  const [resourceSearchQuery, setResourceSearchQuery] = useState('')

  const filteredTableData = useMemo(() => {
    const keyword = resourceSearchQuery.toLowerCase()
    return tableRawDataset.filter((item) => {
      return (
        !resourceSearchQuery ||
        item.name.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword)
      )
    })
  }, [resourceSearchQuery])

  // 🚀 核心：赋予通算资源详情跳转与数据完美映射
  const goToDetailPage = (row: GeneralResourceRow) => {
    const query = new URLSearchParams({
      id: row.id,
      name: row.name,
      status: row.status || '运行中',
      intranetIp: row.intranetIp,
      cpu: row.cpu,
      memory: row.memory,
      systemDisk: row.systemDisk || '--',
      region: row.region || '--',
      demander: row.demandUser || '测评中心',
      provider: '阿里云' // 区分通算供给方
    })
    navigate(`/console/resource-detail?${query.toString()}`)
  }

  const handleSearch = () => {
    message.success('通算资产数据检索完毕')
  }
  const handleReset = () => {
    setResourceSearchQuery('')
  }
  const handleAction = (type: string) => {
    message.info(`触发 [${type}] 操作`)
  }
  const handleMoreCommand = (cmd: string) => {
    message.success(`快捷指令: ${cmd}`)
  }

  const columns: ColumnsType<GeneralResourceRow> = [
    { title: '资源ID', dataIndex: 'id', key: 'id', width: 180, ellipsis: true },
    {
      title: '资源名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      render: (_, row) => (
        <span className={styles.interactiveBlueLinkLbl} onClick={() => goToDetailPage(row)}>
          {row.name}
        </span>
      )
    },
    { title: '区域', dataIndex: 'region', key: 'region', width: 100 },
    { title: 'CPU', dataIndex: 'cpu', key: 'cpu', width: 90 },
    { title: '内存', dataIndex: 'memory', key: 'memory', width: 90 },
    { title: '内网IP', dataIndex: 'intranetIp', key: 'intranetIp', width: 140 },
    {
      title: '是否合同资源',
      dataIndex: 'isContract',
      key: 'isContract',
      width: 120,
      align: 'center',
      render: (_, row) => (
        <span className={styles.pinkContractStatusTagNo}>{row.isContract}</span>
      )
    },
    { title: '需求方', dataIndex: 'demandUser', key: 'demandUser', width: 120 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 130,
      render: (_, row) => (
        <div className={styles.tableInlineActionsFlex}>
          <span className={styles.actionBlueLink} onClick={() => goToDetailPage(row)}>
            详情
          </span>
          <span className={styles.actionBlueLink} onClick={() => handleAction('restart')}>
            重启
          </span>

          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'stop', label: '停止实例' },
                { key: 'destroy', label: '销毁资源' }
              ],
              onClick: ({ key }) => handleMoreCommand(key)
            }}
          >
            <span className={styles.moreActionTriggerDots}>
              <MoreOutlined />
            </span>
          </Dropdown>
        </div>
      )
    }
  ]

  return (
    <div
      className={`${styles.consoleGeneralResourceWorkspacePage} notranslate`}
      translate="no"
    >
      <div className={styles.searchFilterCardBox}>
        <div className={styles.filterLayoutInlineRow}>
          <div className={styles.filterInputCell}>
            <span className={styles.filterFieldLbl}>资源名称</span>
            <Input
              value={resourceSearchQuery}
              placeholder="输入资源名称或ID"
              style={{ width: 240 }}
              allowClear
              onChange={(e) => setResourceSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterActionBtnsGroup}>
            <Button
              type="primary"
              className={styles.actionSearchPrimaryBlueBtn}
              onClick={handleSearch}
            >
              <SearchOutlined className={styles.iconMarginRight} /> 搜索
            </Button>
            <Button className={styles.actionResetPlainBtn} onClick={handleReset}>
              <ReloadOutlined className={styles.iconMarginRight} /> 重置
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.dataTableContainerCard}>
        <Table<GeneralResourceRow>
          dataSource={filteredTableData}
          columns={columns}
          rowKey="id"
          size="middle"
          style={{ width: '100%' }}
          scroll={{ x: 1000 }}
          pagination={false}
        />

        <div className={styles.tablePaginationFooterRow}>
          <Pagination
            total={filteredTableData.length}
            current={1}
            pageSize={10}
            showSizeChanger
            showTotal={(total) => `共 ${total} 条`}
          />
        </div>
      </div>
    </div>
  )
}
