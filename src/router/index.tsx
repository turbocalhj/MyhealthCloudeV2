import { Suspense, lazy, useEffect, type ComponentType, type ReactElement } from 'react'
import { createHashRouter, Navigate, Outlet, useLocation } from 'react-router-dom'
import NProgress from 'nprogress'
import PageLoading from '@/components/PageLoading'
import AuthGuard from './guard'
import FrontLayout from '@/layout/FrontLayout'
import ConsoleLayout from '@/layout/ConsoleLayout'
import FinanceLayout from '@/layout/FinanceLayout'
import Login from '@/views/Login'
import Register from '@/views/Register'
import ForgotPassword from '@/views/ForgotPassword'

NProgress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200
})

/** 路由标题（控制台面包屑 / 文档标题） */
export const routeTitles: Record<string, string> = {
  '/': '首页',
  '/main/home': '首页',
  '/main/market': '智算超市',
  '/main/market-detail': '商品详情',
  '/main/solution': '解决方案',
  '/main/policy': '政策专区',
  '/main/policy-detail': '政策详情',
  '/main/provider': '供给方入驻',
  '/main/provider-apply': '入驻申请',
  '/login': '登录',
  '/register': '注册',
  '/forgot-password': '忘记密码',
  '/console/dashboard': '控制台首页',
  '/console/bms': '裸金属',
  '/console/ecs': '云主机',
  '/console/container': '容器',
  '/console/general': '通算资源',
  '/console/expire-intel': '智算到期',
  '/console/expire-general': '通算到期',
  '/console/expire-contract': '合同到期',
  '/console/resource-detail': '资源详情',
  '/console/resource-lifecycle': '资源生命周期',
  '/console/order-apply': '我的申请',
  '/console/order-create': '创建订单',
  '/console/order-detail': '订单详情',
  '/console/order-renew': '资源续费',
  '/console/order-quit': '资源退订',
  '/console/my-equity': '我的权益',
  '/console/message': '消息服务',
  '/console/ticket-list': '工单管理',
  '/console/ticket-create': '创建工单',
  '/console/ticket-detail': '工单服务详情',
  '/console/apply-detail': '申请工单详情',
  '/console/account-settings': '账户设置',
  '/finance/order': '订单管理',
  '/finance/billing-personal': '个人账单',
  '/finance/billing-resource': '资源账单',
  '/finance/contract': '合同管理详情'
}

export const getRouteTitle = (pathname: string): string => {
  if (routeTitles[pathname]) return routeTitles[pathname]
  const matched = Object.keys(routeTitles)
    .filter((path) => path !== '/' && pathname.startsWith(path))
    .sort((a, b) => b.length - a.length)[0]
  return matched ? routeTitles[matched] : '详情'
}

/** 懒加载页面，统一包一层 Suspense + 顶部进度条 */
const page = (loader: () => Promise<{ default: ComponentType }>): ReactElement => {
  const Component = lazy(loader)
  return (
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  )
}

function RootLayout() {
  const location = useLocation()

  useEffect(() => {
    NProgress.done()
    document.title = `${getRouteTitle(location.pathname)} - 算力调度运营平台`
  }, [location.pathname])

  return <Outlet />
}

const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/main/home" replace /> },
      {
        path: 'main',
        element: <FrontLayout />,
        children: [
          { index: true, element: <Navigate to="/main/home" replace /> },
          { path: 'home', element: page(() => import('@/views/home')) },
          { path: 'market', element: page(() => import('@/views/market')) },
          { path: 'market-detail', element: page(() => import('@/views/market/Detail')) },
          { path: 'solution', element: page(() => import('@/views/solution')) },
          { path: 'policy', element: page(() => import('@/views/policy')) },
          { path: 'policy-detail', element: page(() => import('@/views/policy/Detail')) },
          { path: 'provider', element: page(() => import('@/views/provider')) },
          { path: 'provider-apply', element: page(() => import('@/views/provider/Apply')) }
        ]
      },
      {
        path: 'login',
        element: (
          <AuthGuard>
            <Login />
          </AuthGuard>
        )
      },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      {
        path: 'console',
        element: (
          <AuthGuard requireAuth roles={['admin', 'user']}>
            <ConsoleLayout />
          </AuthGuard>
        ),
        children: [
          { index: true, element: <Navigate to="/console/dashboard" replace /> },
          { path: 'dashboard', element: page(() => import('@/views/console/Dashboard')) },
          { path: 'bms', element: page(() => import('@/views/console/ResourceList')) },
          { path: 'ecs', element: page(() => import('@/views/console/ResourceList')) },
          { path: 'container', element: page(() => import('@/views/console/ResourceList')) },
          { path: 'general', element: page(() => import('@/views/console/GeneralResource')) },
          { path: 'expire-intel', element: page(() => import('@/views/console/ExpireManager')) },
          { path: 'expire-general', element: page(() => import('@/views/console/ExpireManager')) },
          { path: 'expire-contract', element: page(() => import('@/views/console/ExpireManager')) },
          { path: 'resource-detail', element: page(() => import('@/views/console/ResourceDetail')) },
          { path: 'resource-lifecycle', element: page(() => import('@/views/console/ResourceLifecycle')) },
          { path: 'order-apply', element: page(() => import('@/views/console/OrderManager')) },
          { path: 'order-create', element: page(() => import('@/views/console/OrderCreate')) },
          { path: 'order-detail', element: page(() => import('@/views/console/OrderDetail')) },
          { path: 'order-renew', element: page(() => import('@/views/console/OrderManager')) },
          { path: 'order-quit', element: page(() => import('@/views/console/OrderManager')) },
          { path: 'my-equity', element: page(() => import('@/views/console/MyEquity')) },
          { path: 'message', element: page(() => import('@/views/console/MessageCenter')) },
          { path: 'ticket-list', element: page(() => import('@/views/console/TicketList')) },
          { path: 'ticket-create', element: page(() => import('@/views/console/TicketCreate')) },
          { path: 'ticket-detail', element: page(() => import('@/views/console/TicketDetail')) },
          { path: 'apply-detail', element: page(() => import('@/views/console/ApplyDetail')) },
          { path: 'account-settings', element: page(() => import('@/views/console/AccountSettings')) }
        ]
      },
      {
        path: 'finance',
        element: (
          <AuthGuard requireAuth roles={['admin', 'finance']}>
            <FinanceLayout />
          </AuthGuard>
        ),
        children: [
          { index: true, element: <Navigate to="/finance/order" replace /> },
          { path: 'order', element: page(() => import('@/views/finance/OrderManager')) },
          { path: 'billing-personal', element: page(() => import('@/views/finance/BillingPersonal')) },
          { path: 'billing-resource', element: page(() => import('@/views/finance/BillingResource')) },
          { path: 'contract', element: page(() => import('@/views/finance/ContractManager')) }
        ]
      },
      { path: '*', element: <Navigate to="/main/home" replace /> }
    ]
  }
])

export default router
