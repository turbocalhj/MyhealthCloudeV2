import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Badge, Breadcrumb, Drawer, Dropdown, Empty, Layout, Menu, message } from 'antd'
import {
  AppstoreOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  MessageOutlined,
  MonitorOutlined,
  SettingOutlined,
  StarOutlined,
  SwapOutlined,
  UserOutlined,
  WalletOutlined
} from '@ant-design/icons'
import { useUserStore } from '@/store/user'
import { getRouteTitle } from '@/router'
import styles from './ConsoleLayout.module.css'

const { Header, Sider, Content } = Layout

export default function ConsoleLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [docDrawerVisible, setDocDrawerVisible] = useState(false)

  const unreadList = useUserStore((state) => state.unreadList)
  const unreadCount = useUserStore((state) => state.unreadCount)
  const syncMessageStatus = useUserStore((state) => state.syncMessageStatus)
  const clearAuth = useUserStore((state) => state.clearAuth)

  useEffect(() => {
    syncMessageStatus()
    const handler = () => syncMessageStatus()
    window.addEventListener('storage', handler)
    window.addEventListener('update-message-bell-badge', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('update-message-bell-badge', handler)
    }
  }, [syncMessageStatus])

  const activeMenu = location.pathname === '/console' ? '/console/dashboard' : location.pathname
  const currentRouteTitle = getRouteTitle(location.pathname)

  const menuItems = useMemo(
    () => [
      { key: '/console/dashboard', icon: <DashboardOutlined />, label: '总览' },
      {
        key: 'resource',
        icon: <MonitorOutlined />,
        label: '计算资源',
        children: [
          { key: '/console/bms', label: '裸金属服务' },
          { key: '/console/ecs', label: '云主机服务' },
          { key: '/console/container', label: '容器服务' }
        ]
      },
      { key: '/console/general', icon: <AppstoreOutlined />, label: '通算资源' },
      {
        key: 'expire',
        icon: <ClockCircleOutlined />,
        label: '资源到期',
        children: [
          { key: '/console/expire-intel', label: '智算到期管理' },
          { key: '/console/expire-general', label: '通算到期管理' },
          { key: '/console/expire-contract', label: '合同到期管理' }
        ]
      },
      { key: '/console/resource-lifecycle', icon: <SwapOutlined />, label: '资源生命周期' },
      { key: '/finance/order', icon: <WalletOutlined />, label: '费用中心' },
      { key: '/console/ticket-list', icon: <FileTextOutlined />, label: '工单管理' },
      { key: '/console/order-apply', icon: <DatabaseOutlined />, label: '我的申请' },
      { key: '/console/my-equity', icon: <StarOutlined />, label: '我的权益' },
      { key: '/console/message', icon: <MessageOutlined />, label: '消息服务' },
      { key: '/console/account-settings', icon: <SettingOutlined />, label: '账户设置' }
    ],
    []
  )

  const handleLogout = () => {
    localStorage.removeItem('isPlatformLogged')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userRoles')
    clearAuth()
    message.success('已安全退出控制台')
    navigate('/main/home')
    window.location.reload()
  }

  const messageMenu = {
    items: [
      {
        key: 'header',
        disabled: true,
        label: <div className={styles.panelHeader}>未读消息</div>
      },
      ...(unreadList.length > 0
        ? unreadList.slice(0, 5).map((item) => ({
            key: `msg-${item.id}`,
            label: (
              <div className={styles.msgItem}>
                <div className={styles.msgItemTitle}>{item.title}</div>
                <div className={styles.msgItemTime}>{item.time}</div>
              </div>
            )
          }))
        : [
            {
              key: 'empty',
              disabled: true,
              label: (
                <div className={styles.msgEmptyBox}>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无未读消息" />
                </div>
              )
            }
          ]),
      {
        type: 'divider' as const
      },
      {
        key: '/console/message',
        label: <div className={styles.panelFooter}>查看全部消息</div>
      }
    ],
    onClick: ({ key }: { key: string }) => {
      if (key.startsWith('/')) navigate(key)
    }
  }

  const userMenu = {
    items: [
      { key: '/console/dashboard', label: '控制台首页' },
      { key: '/console/bms', label: '裸金属服务' },
      { key: '/console/ecs', label: '云主机服务' },
      { key: '/console/container', label: '容器服务' },
      { key: '/console/order-apply', label: '我的申请' },
      { key: '/console/account-settings', label: '账户设置' },
      { type: 'divider' as const },
      { key: 'logout', label: '退出登录' }
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') handleLogout()
      else navigate(key)
    }
  }

  const ticketMenu = {
    items: [
      { key: '/console/ticket-create', label: '创建工单' },
      { key: '/console/order-apply', label: '需求登记' }
    ],
    onClick: ({ key }: { key: string }) => navigate(key)
  }

  return (
    <Layout className={styles.consoleLayout}>
      <Header className={styles.customHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.logo} onClick={() => navigate('/main/home')}>
            算力调度运营平台
          </div>
        </div>

        <div className={styles.headerRight}>
          <Dropdown menu={ticketMenu} placement="bottom">
            <span className={styles.toolLink}>工单</span>
          </Dropdown>

          <span className={styles.toolLink} onClick={() => setDocDrawerVisible(true)}>
            文档
          </span>

          <span className={styles.toolLink} onClick={() => navigate('/main/market')}>
            去购买
          </span>

          <Dropdown menu={messageMenu} placement="bottomRight" overlayStyle={{ width: 280 }}>
            <span className={styles.toolLink}>
              <Badge count={unreadCount} size="small" offset={[6, -4]} overflowCount={99}>
                <span>消息</span>
              </Badge>
            </span>
          </Dropdown>

          <Dropdown menu={userMenu} placement="bottomRight">
            <div className={styles.userProfile}>
              <UserOutlined className={styles.avatarIcon} />
              <span className={styles.username}>测评中心</span>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout className={styles.consoleBody}>
        <Sider width={220} className={styles.consoleAside} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[activeMenu]}
            defaultOpenKeys={['resource', 'expire']}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            className={styles.consoleMenu}
          />
        </Sider>

        <Content className={styles.consoleMainContent}>
          <div className={styles.breadcrumbContainer}>
            <Breadcrumb
              separator="/"
              items={[
                {
                  title: (
                    <a onClick={() => navigate('/console/dashboard')}>控制台</a>
                  )
                },
                { title: currentRouteTitle }
              ]}
            />
          </div>
          <div className={styles.contentWrapper}>
            <Outlet />
          </div>
        </Content>
      </Layout>

      <Drawer
        title="文档中心"
        placement="right"
        width="45%"
        open={docDrawerVisible}
        onClose={() => setDocDrawerVisible(false)}
        destroyOnClose
        styles={{ body: { padding: 0 } }}
      >
        <div className={styles.drawerIframeContainer}>
          <iframe
            src="https://element-plus.org/zh-CN/component/drawer.html"
            className={styles.docIframe}
            title="文档中心"
          />
        </div>
      </Drawer>
    </Layout>
  )
}
