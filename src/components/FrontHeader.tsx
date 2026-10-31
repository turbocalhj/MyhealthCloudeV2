import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Badge, Button, Drawer, Dropdown, Empty, Modal, Popover, message } from 'antd'
import {
  ApiOutlined,
  CloudServerOutlined,
  DashboardOutlined,
  DesktopOutlined,
  FileTextOutlined as DocumentIcon,
  EditOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useCartStore } from '@/store/cart'
import { useUserStore } from '@/store/user'
import styles from './FrontHeader.module.css'

const navItems = [
  { path: '/main/home', label: '首页' },
  { path: '/main/market', label: '智算超市' },
  { path: '/main/solution', label: '解决方案' },
  { path: '/main/policy', label: '政策专区' },
  { path: '/main/provider', label: '供给方入驻' }
]

const isLoggedNow = (): boolean =>
  !!localStorage.getItem('accessToken') || localStorage.getItem('isPlatformLogged') === 'true'

export default function FrontHeader() {
  const navigate = useNavigate()
  const location = useLocation()

  const token = useUserStore((state) => state.token)
  const unreadList = useUserStore((state) => state.unreadList)
  const unreadCount = useUserStore((state) => state.unreadCount)
  const syncMessageStatus = useUserStore((state) => state.syncMessageStatus)
  const clearAuth = useUserStore((state) => state.clearAuth)

  const totalCount = useCartStore((state) => state.totalCount)
  const openCartDrawer = useCartStore((state) => state.openCartDrawer)

  const [docDrawerVisible, setDocDrawerVisible] = useState(false)

  const isLogged = useMemo(() => !!token || isLoggedNow(), [token, location.pathname])

  useEffect(() => {
    syncMessageStatus()
    const handler = () => syncMessageStatus()
    window.addEventListener('update-message-bell-badge', handler)
    return () => {
      window.removeEventListener('update-message-bell-badge', handler)
    }
  }, [syncMessageStatus])

  const triggerAuthBox = () => {
    Modal.confirm({
      title: '提示',
      content: '登录已过期，请重新登录',
      okText: '立即登录',
      cancelText: '取消',
      onOk: () => navigate('/login')
    })
  }

  const handleConsoleClick = () => {
    if (isLoggedNow()) {
      navigate('/console/dashboard')
    } else {
      triggerAuthBox()
    }
  }

  const handleTicketCommand = (path: string) => {
    if (isLoggedNow()) {
      navigate(path)
    } else {
      triggerAuthBox()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isPlatformLogged')
    clearAuth()
    message.success('已成功退出登录')
    navigate('/main/home')
    window.location.reload()
  }

  const messagePanel = (
    <div className={styles.msgDropdown}>
      <div className={styles.msgDropdownHeader}>未读消息</div>
      {unreadList.length > 0 ? (
        <>
          {unreadList.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className={styles.msgItem}
              onClick={() => navigate('/console/message')}
            >
              <div className={styles.msgItemTitle}>{item.title}</div>
              <div className={styles.msgItemTime}>{item.time}</div>
            </div>
          ))}
          <div className={styles.msgDropdownFooter} onClick={() => navigate('/console/message')}>
            查看全部消息
          </div>
        </>
      ) : (
        <div className={styles.msgEmptyBox}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无未读消息" />
        </div>
      )}
    </div>
  )

  const userPanel = (
    <div className={styles.userDropdownMenu}>
      <div className={styles.dropdownUserHeader}>
        <div className={styles.userAvatarCircle}>
          <UserOutlined className={styles.userAvatarIcon} />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>测评中心</div>
          <div className={styles.userStatus}>
            <span className={styles.statusDot} />
            <span>在线</span>
          </div>
        </div>
      </div>

      <div className={styles.dropdownSection}>
        <div className={styles.sectionTitle}>服务入口</div>
        <div className={styles.dropdownItem} onClick={() => navigate('/console/dashboard')}>
          <DashboardOutlined className={styles.itemIcon} />
          <span>控制台首页</span>
        </div>
        <div className={styles.dropdownItem} onClick={() => navigate('/console/bms')}>
          <DesktopOutlined className={styles.itemIcon} />
          <span>裸金属服务</span>
        </div>
        <div className={styles.dropdownItem} onClick={() => navigate('/console/ecs')}>
          <CloudServerOutlined className={styles.itemIcon} />
          <span>云主机服务</span>
        </div>
        <div className={styles.dropdownItem} onClick={() => navigate('/console/container')}>
          <ApiOutlined className={styles.itemIcon} />
          <span>容器服务</span>
        </div>
      </div>

      <div className={styles.dropdownDivider} />

      <div className={styles.dropdownSection}>
        <div className={styles.sectionTitle}>管理中心</div>
        <div className={styles.dropdownItem} onClick={() => navigate('/console/order-apply')}>
          <DocumentIcon className={styles.itemIcon} />
          <span>我的申请</span>
        </div>
        <div className={styles.dropdownItem} onClick={() => navigate('/console/account-settings')}>
          <EditOutlined className={styles.itemIcon} />
          <span>信息修改</span>
        </div>
        <div className={styles.dropdownItem} onClick={() => navigate('/console/account-settings')}>
          <SettingOutlined className={styles.itemIcon} />
          <span>账户设置</span>
        </div>
      </div>

      <div className={styles.dropdownDivider} />

      <div className={`${styles.dropdownItem} ${styles.dropdownItemLogout}`} onClick={handleLogout}>
        <LogoutOutlined className={styles.itemIcon} />
        <span>退出登录</span>
      </div>
    </div>
  )

  return (
    <>
      <header className={styles.customHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.logo} onClick={() => navigate('/main/home')}>
            算力调度运营平台
          </div>

          <nav className={styles.navMenu}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
              >
                <span className={styles.navText}>{item.label}</span>
                <span className={styles.navUnderline} />
              </NavLink>
            ))}
          </nav>
        </div>

        <div className={styles.headerRight}>
          <Badge count={totalCount} size="small" offset={[2, 4]}>
            <span className={styles.toolLink} onClick={openCartDrawer} title="购物车">
              <ShoppingCartOutlined style={{ fontSize: 18 }} />
            </span>
          </Badge>

          <span className={styles.toolLink} onClick={() => setDocDrawerVisible(true)}>
            文档
          </span>

          <Dropdown
            trigger={['hover']}
            menu={{
              items: [
                { key: '/console/ticket-create', label: '创建工单' },
                { key: '/console/order-apply', label: '需求登记' }
              ],
              onClick: ({ key }) => handleTicketCommand(key)
            }}
          >
            <span className={`${styles.toolLink} ${styles.dropdownLink}`}>工单</span>
          </Dropdown>

          {isLogged ? (
            <>
              <span className={styles.toolLink} onClick={handleConsoleClick}>
                控制台
              </span>

              <Popover
                content={messagePanel}
                trigger="hover"
                placement="bottomRight"
                arrow={false}
                overlayInnerStyle={{ padding: 0 }}
              >
                <Badge count={unreadCount} size="small" offset={[2, 4]}>
                  <span className={styles.toolLink}>消息</span>
                </Badge>
              </Popover>

              <Popover
                content={userPanel}
                trigger="hover"
                placement="bottomRight"
                arrow={false}
                overlayInnerStyle={{ padding: 0 }}
              >
                <div className={`${styles.userProfile} ${styles.customHoverProfile}`}>
                  <UserOutlined className={styles.avatarIcon} />
                  <span className={styles.username}>测评中心</span>
                </div>
              </Popover>
            </>
          ) : (
            <>
              <span className={styles.toolLink} style={{ marginRight: 20 }} onClick={handleConsoleClick}>
                控制台
              </span>
              <Button type="primary" onClick={() => navigate('/login')}>
                登录
              </Button>
            </>
          )}
        </div>
      </header>

      <Drawer
        title="文档中心"
        placement="right"
        width="45%"
        open={docDrawerVisible}
        onClose={() => setDocDrawerVisible(false)}
        destroyOnClose
      >
        <div className={styles.drawerIframeContainer}>
          <iframe
            src="https://element-plus.org/zh-CN/component/drawer.html"
            title="文档中心"
            className={styles.docIframe}
          />
        </div>
      </Drawer>
    </>
  )
}
