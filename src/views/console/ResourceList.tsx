import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Dropdown, Input, Modal, Pagination, Table, Tooltip, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { MoreOutlined, ReloadOutlined, SearchOutlined, WarningFilled } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  deleteResourceApi,
  listResourcesApi,
  powerOffApi,
  powerOnApi,
  rebootApi
} from '@/api/resource'
import type { ResourceItem, ResourceType } from '@/api/resource'
import styles from './ResourceList.module.css'

const resolveResourceType = (pathname: string): ResourceType => {
  if (pathname.includes('/console/ecs')) return 'ECS'
  if (pathname.includes('/console/container')) return 'CONTAINER'
  return 'BMS'
}

export default function ResourceList() {
  const navigate = useNavigate()
  const location = useLocation()

  const [localQueryText, setLocalQueryText] = useState('')
  const [destroyDialogVisible, setDestroyDialogVisible] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState<ResourceItem | null>(null)

  // 数据状态
  const [resourceList, setResourceList] = useState<ResourceItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const activeType = useMemo<ResourceType>(
    () => resolveResourceType(location.pathname),
    [location.pathname]
  )

  // 加载数据（前后端联动）
  const loadData = useCallback(
    async (queryPage: number, queryPageSize: number, keyword: string) => {
      setLoading(true)
      try {
        const data = await listResourcesApi({
          type: activeType,
          keyword,
          page: queryPage,
          pageSize: queryPageSize
        })
        setResourceList(data.list)
        setTotal(data.total)
      } catch {
        // 拦截器已弹错误，这里不再重复
        setResourceList([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    },
    [activeType]
  )

  // 切换 tab 类型时重置 + 重新加载
  useEffect(() => {
    setPage(1)
    setLocalQueryText('')
    void loadData(1, pageSize, '')
    // 仅跟随资源类型切换重置，pageSize 变化不触发重置
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType])

  const handleFilterSearch = () => {
    setPage(1)
    void loadData(1, pageSize, localQueryText)
  }

  const handleFilterReset = () => {
    setLocalQueryText('')
    setPage(1)
    void loadData(1, pageSize, '')
  }

  const navigateToDetailPage = (row: ResourceItem) => {
    const query = new URLSearchParams()
    Object.entries(row).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value))
      }
    })
    navigate(`/console/resource-detail?${query.toString()}`)
  }

  // 开机
  const togglePowerOn = async (row: ResourceItem) => {
    if (row.powerStatus === 'rebooting') {
      // 启动中状态：实际是开机动作
      try {
        const data = await powerOnApi(row.id)
        setResourceList((prev) => prev.map((item) => (item.id === row.id ? data : item)))
        message.success(`物理实例 [${row.name}] 上电引导开机成功。`)
      } catch {
        /* 已提示 */
      }
      return
    }
    // 关机状态：直接开机
    try {
      const data = await powerOnApi(row.id)
      setResourceList((prev) => prev.map((item) => (item.id === row.id ? data : item)))
      message.success(`物理实例 [${row.name}] 上电引导开机成功。`)
    } catch {
      /* 已提示 */
    }
  }

  // 重启
  const handleTriggerReboot = async (row: ResourceItem) => {
    try {
      const data = await rebootApi(row.id)
      setResourceList((prev) => prev.map((item) => (item.id === row.id ? data : item)))
      message.warning(`实例 [${row.name}] 正在执行重启流转。`)
    } catch {
      /* 已提示 */
    }
  }

  const handleMoreActionCommand = async (command: string, row: ResourceItem) => {
    setSelectedRowData(row)
    if (command === 'destroy') {
      setDestroyDialogVisible(true)
    } else if (command === 'poweroff') {
      try {
        const data = await powerOffApi(row.id)
        setResourceList((prev) => prev.map((item) => (item.id === row.id ? data : item)))
        message.info('安全关机指令传递就绪。')
      } catch {
        /* 已提示 */
      }
    } else if (command === 'connect') {
      message.success('正在连接安全远程终端隧道...')
    }
  }

  const executeMockDestroy = async () => {
    setDestroyDialogVisible(false)
    if (!selectedRowData) return
    const row = selectedRowData
    try {
      await new Promise<void>((resolve, reject) => {
        Modal.confirm({
          title: '二次确认',
          content: `算力实例 [${row.name}] 一旦销毁将不可恢复，确认继续？`,
          okText: '确认销毁',
          cancelText: '取消',
          okButtonProps: { danger: true },
          onOk: () => resolve(),
          onCancel: () => reject(new Error('cancel'))
        })
      })
    } catch {
      return
    }
    try {
      await deleteResourceApi(row.id)
      message.error('算力实例已从主集群物理摘除。')
      void loadData(page, pageSize, localQueryText)
    } catch {
      /* 已提示 */
    }
  }

  const columns = useMemo<ColumnsType<ResourceItem>>(() => {
    const baseColumns: ColumnsType<ResourceItem> = [
      { title: '资源ID', dataIndex: 'id', key: 'id', width: 180, ellipsis: true },
      {
        title: '资源名称',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        render: (_, row) => (
          <span className={styles.interactiveBlueLbl} onClick={() => navigateToDetailPage(row)}>
            {row.name}
          </span>
        )
      },
      { title: '区域', dataIndex: 'region', key: 'region', width: 100 }
    ]

    if (activeType === 'BMS' || activeType === 'ECS') {
      baseColumns.push(
        { title: '显卡型号', dataIndex: 'gpuModel', key: 'gpuModel', width: 160 },
        { title: '显卡数量', dataIndex: 'gpuNum', key: 'gpuNum', width: 100, align: 'center' },
        { title: '显存', dataIndex: 'vram', key: 'vram', width: 100 }
      )
    }

    baseColumns.push(
      { title: 'CPU', dataIndex: 'cpu', key: 'cpu', width: 100 },
      { title: '内存', dataIndex: 'memory', key: 'memory', width: 100 }
    )

    if (activeType === 'BMS') {
      baseColumns.push({ title: '系统盘', dataIndex: 'systemDisk', key: 'systemDisk', width: 100 })
    }
    if (activeType === 'ECS') {
      baseColumns.push({ title: '内网IP', dataIndex: 'intranetIp', key: 'intranetIp', width: 130 })
    }
    if (activeType === 'CONTAINER') {
      baseColumns.push({
        title: '命名空间',
        dataIndex: 'namespace',
        key: 'namespace',
        width: 130,
        render: (_, row) => (
          <span className={styles.purpleNamespacePillBadge}>{row.namespace}</span>
        )
      })
    }

    baseColumns.push({
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 160,
      render: (_, row) => (
        <div className={styles.tableOpLinksFlexBox}>
          <span className={styles.opBtnActionLink} onClick={() => navigateToDetailPage(row)}>
            详情
          </span>

          {row.powerStatus === 'off' ? (
            <Tooltip title="开机" placement="top">
              <span className={styles.opBtnActionLink} onClick={() => togglePowerOn(row)}>
                开机
              </span>
            </Tooltip>
          ) : row.powerStatus === 'rebooting' ? (
            <Tooltip title="开机" placement="top">
              <span
                className={`${styles.opBtnActionLink} ${styles.warningAmberLbl}`}
                onClick={() => togglePowerOn(row)}
              >
                启动
              </span>
            </Tooltip>
          ) : (
            <Tooltip title="重启实例" placement="top">
              <span className={styles.opBtnActionLink} onClick={() => handleTriggerReboot(row)}>
                重启
              </span>
            </Tooltip>
          )}

          <Dropdown
            trigger={['hover']}
            placement="bottomRight"
            menu={{
              items: [
                { key: 'connect', label: '远程连接' },
                { key: 'poweroff', label: '安全关机', disabled: row.powerStatus === 'off' },
                { key: 'destroy', label: '销毁', danger: true, className: styles.dangerDropdownItem }
              ],
              onClick: ({ key }) => {
                void handleMoreActionCommand(key, row)
              }
            }}
          >
            <span className={styles.moreActionTriggerDotsIcon}>
              <MoreOutlined />
            </span>
          </Dropdown>
        </div>
      )
    })

    return baseColumns
  }, [activeType])

  return (
    <div
      className={`${styles.consoleDynamicAssetWorkspaceWrapper} notranslate`}
      translate="no"
    >
      <div className={styles.assetSearchCard}>
        <div className={styles.searchLayoutRow}>
          <div className={styles.searchInputBox}>
            <span className={styles.lbl}>资源名称</span>
            <Input
              value={localQueryText}
              placeholder="输入资源名称或ID"
              style={{ width: 240 }}
              allowClear
              onChange={(e) => setLocalQueryText(e.target.value)}
            />
          </div>
          <div className={styles.searchButtonsBox}>
            <Button
              type="primary"
              className={styles.btnPrimaryBlue}
              icon={<SearchOutlined />}
              onClick={handleFilterSearch}
            >
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleFilterReset}>
              重置
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.assetTableCard}>
        <Table<ResourceItem>
          dataSource={resourceList}
          columns={columns}
          rowKey="id"
          loading={loading}
          size="middle"
          style={{ width: '100%' }}
          scroll={{ x: 1100 }}
          pagination={false}
        />

        {/* 分页 */}
        <div className={styles.paginationWrapper}>
          <Pagination
            current={page}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50]}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={(count) => `共 ${count} 条`}
            onChange={(nextPage, nextPageSize) => {
              setPage(nextPage)
              setPageSize(nextPageSize)
              void loadData(nextPage, nextPageSize, localQueryText)
            }}
          />
        </div>
      </div>

      <Modal
        title="安全风险提示"
        width={460}
        centered
        open={destroyDialogVisible}
        onCancel={() => setDestroyDialogVisible(false)}
        footer={
          <div className={styles.dialogCustomActionsFooter}>
            <Button onClick={() => setDestroyDialogVisible(false)}>取消</Button>
            <Button type="primary" danger onClick={executeMockDestroy}>
              确认销毁
            </Button>
          </div>
        }
      >
        <div className={styles.destroyAlertBodyContent}>
          <WarningFilled className={styles.warningLargeIcon} />
          <div className={styles.alertTexts}>
            <h4>确定要销毁该算力资源实例吗？</h4>
            <p>此操作不可逆！实例物理注销后，磁盘存储以及运行环境都将被清空，且数据绝对无法恢复。</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
