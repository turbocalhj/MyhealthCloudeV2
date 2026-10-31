import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, Layout, Menu } from 'antd'
import {
  CreditCardOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  UserOutlined
} from '@ant-design/icons'
import styles from './FinanceLayout.module.css'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/finance/order', icon: <FileTextOutlined />, label: '订单管理' },
  {
    key: 'billing-sub-group',
    icon: <CreditCardOutlined />,
    label: '账单管理',
    children: [
      { key: '/finance/billing-personal', label: '个人账单' },
      { key: '/finance/billing-resource', label: '资源账单' }
    ]
  },
  { key: '/finance/contract', icon: <FolderOpenOutlined />, label: '合同管理' }
]

export default function FinanceLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Layout className={styles.financeLayoutWrapper}>
      <Header className={styles.financeGlobalHeader}>
        <div className={styles.headerLogoBrand} onClick={() => navigate('/')}>
          <span className={styles.logoText}>算力调度运营平台</span>
        </div>
        <div className={styles.headerActionsLinks}>
          <span className={styles.actionBtnItem}>去购买</span>
          <span
            className={`${styles.actionBtnItem} ${styles.backConsoleStyle}`}
            onClick={() => navigate('/console/dashboard')}
          >
            返回控制台
          </span>
          <div className={styles.userInfoAvatarBlock}>
            <Avatar size={24} icon={<UserOutlined />} />
            <span className={styles.usernameDisplay}>测评中心</span>
          </div>
        </div>
      </Header>

      <Layout className={styles.financeSubContainer}>
        <Sider width={220} theme="light" className={styles.financeLeftMenuAside}>
          <div className={styles.financeAsideMenuCaption}>费用中心</div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['billing-sub-group']}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            className={styles.financeCleanMenuInstance}
          />
        </Sider>

        <Content className={styles.financePageContentCanvas}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
