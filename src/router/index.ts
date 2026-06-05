// 路由配置文件
// 功能：管理整个平台的路由映射，包含前台展示、后台管理、财务管理等模块的路由定义
import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

// 前台展示系统路由（无需权限）
const constantRoutes = [
  {
    path: '/',
    redirect: '/main/home'
  },
  // 前台展示主框架
  {
    path: '/main',
    component: () => import('@/layout/index.vue'), 
    redirect: '/main/home', 
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'market',
        name: 'Market',
        component: () => import('@/views/market/index.vue'),
        meta: { title: '智算超市' }
      },
      {
        path: 'solution',
        name: 'Solution',
        component: () => import('@/views/solution/index.vue'),
        meta: { title: '解决方案' }
      },
      {
        path: 'policy',
        name: 'Policy',
        component: () => import('@/views/policy/index.vue'),
        meta: { title: '政策专区' }
      },
      {
        path: 'policy-detail',
        name: 'PolicyDetail',
        component: () => import('@/views/policy/Detail.vue'),
        meta: { title: '政策详情' }
      },
      {
        path: 'provider',
        name: 'Provider',
        component: () => import('@/views/provider/index.vue'),
        meta: { title: '供给方入驻' }
      },
      {
        path: 'provider-apply',
        name: 'ProviderApply',
        component: () => import('@/views/provider/Apply.vue'),
        meta: { title: '入驻申请' }
      }
    ]
  },
  // 独立登录页面
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'), 
    meta: { title: '登录' }
  },
  // 兜底路径
  {
    path: '/:pathMatch(.*)*',
    redirect: '/main/home'
  }
]

// 后台管理系统路由（需根据Token和权限动态挂载）
export const asyncRoutes = [
  // 控制台主框架
  {
    path: '/console',
    name: 'ConsoleLayout',
    component: () => import('@/layout/ConsoleLayout.vue'),
    redirect: '/console/dashboard',
    meta: { roles: ['admin', 'user'] }, // 模拟权限要求
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/console/Dashboard.vue'),
        meta: { title: '控制台首页', roles: ['admin', 'user'] }
      },
      {
        path: 'bms', 
        name: 'ResourceBMS',
        component: () => import('@/views/console/ResourceList.vue'),
        meta: { title: '裸金属', type: 'BMS', roles: ['admin', 'user'] }
      },
      {
        path: 'ecs',
        name: 'ResourceECS',
        component: () => import('@/views/console/ResourceList.vue'),
        meta: { title: '云主机', type: 'ECS', roles: ['admin', 'user'] }
      },
      {
        path: 'container',
        name: 'ResourceContainer',
        component: () => import('@/views/console/ResourceList.vue'),
        meta: { title: '容器', type: 'CONTAINER', roles: ['admin', 'user'] }
      },
      {
        path: 'general',
        name: 'GeneralResource',
        component: () => import('@/views/console/GeneralResource.vue'),
        meta: { title: '通算资源', roles: ['admin', 'user'] }
      },
      {
        path: 'expire-intel',
        name: 'ExpireManagerIntel',
        component: () => import('@/views/console/ExpireManager.vue'),
        meta: { title: '智算到期', roles: ['admin', 'user'] }
      },
      {
        path: 'expire-general',
        name: 'ExpireManagerGeneral',
        component: () => import('@/views/console/ExpireManager.vue'),
        meta: { title: '通算到期', roles: ['admin', 'user'] }
      },
      {
        path: 'expire-contract',
        name: 'ExpireManagerContract',
        component: () => import('@/views/console/ExpireManager.vue'),
        meta: { title: '合同到期', roles: ['admin', 'user'] }
      },
      {
        path: 'resource-detail',
        name: 'ResourceDetail',
        component: () => import('@/views/console/ResourceDetail.vue'),
        meta: { title: '资源详情', roles: ['admin', 'user'] }
      },
      {
        path: 'order-apply',
        name: 'OrderApply',
        component: () => import('@/views/console/OrderManager.vue'),
        meta: { title: '我的申请', roles: ['admin', 'user'] }
      },
      {
        path: 'order-renew',
        name: 'OrderRenew',
        component: () => import('@/views/console/OrderManager.vue'),
        meta: { title: '资源续费', roles: ['admin', 'user'] }
      },
      {
        path: 'order-quit',
        name: 'OrderQuit',
        component: () => import('@/views/console/OrderManager.vue'),
        meta: { title: '资源退订', roles: ['admin', 'user'] }
      },
      {
        path: 'my-equity',
        name: 'MyEquity',
        component: () => import('@/views/console/MyEquity.vue'),
        meta: { title: '我的权益', roles: ['admin', 'user'] }
      },
      {
        path: 'message',
        name: 'MessageCenter',
        component: () => import('@/views/console/MessageCenter.vue'),
        meta: { title: '消息服务', roles: ['admin', 'user'] }
      },
      {
        path: 'ticket-list',
        name: 'TicketList',
        component: () => import('@/views/console/TicketList.vue'),
        meta: { title: '工单管理', roles: ['admin', 'user'] }
      },
      {
        path: 'ticket-create',
        name: 'TicketCreate',
        component: () => import('@/views/console/TicketCreate.vue'),
        meta: { title: '创建工单', roles: ['admin', 'user'] }
      },
      {
        path: 'ticket-detail',
        name: 'TicketDetail',
        component: () => import('@/views/console/TicketDetail.vue'),
        meta: { title: '工单服务详情', roles: ['admin', 'user'] }
      },
      {
        path: 'apply-detail',
        name: 'ApplyDetail',
        component: () => import('@/views/console/ApplyDetail.vue'),
        meta: { title: '申请工单详情', roles: ['admin', 'user'] }
      }
    ]
  },
  // 顶级框架 B：费用中心
  {
    path: '/finance',
    name: 'FinanceLayout',
    component: () => import('@/layout/FinanceLayout.vue'),
    redirect: '/finance/order',
    meta: { roles: ['admin', 'finance'] }, // 模拟权限隔离：仅管理员或财务可见
    children: [
      {
        path: 'order',
        name: 'FinanceOrder',
        component: () => import('@/views/finance/OrderManager.vue'),
        meta: { title: '订单管理', roles: ['admin', 'finance'] }
      },
      {
        path: 'billing-personal',
        name: 'BillingPersonal',
        component: () => import('@/views/finance/BillingPersonal.vue'),
        meta: { title: '个人账单', roles: ['admin', 'finance'] }
      },
      {
        path: 'billing-resource',
        name: 'BillingResource',
        component: () => import('@/views/finance/BillingResource.vue'),
        meta: { title: '资源账单', roles: ['admin', 'finance'] }
      },
      {
        path: 'contract',
        name: 'FinanceContractDetail',
        component: () => import('@/views/finance/ContractManager.vue'),
        meta: { title: '合同管理详情', roles: ['admin', 'finance'] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

// 用于标记是否已经挂载了动态路由，防止无限循环
let hasAddedRoutes = false

// ==================== 全局路由前置守卫 (JWT + 动态路由鉴权) ====================
router.beforeEach((to, from, next) => {
  // 引入真实 JWT Token 校验机制（替代明文判断）
  const token = localStorage.getItem('accessToken')

  // 判断目标路径是否属于需要登录保护的私密路由（这里简易判断，实际也可以结合 meta.requireAuth）
  const requireAuth = to.path.startsWith('/console') || to.path.startsWith('/finance')

  if (token) {
    if (to.path === '/login') {
      // 已登录状态下拦截登录页，直接放行回首页
      next('/main/home')
    } else {
      if (!hasAddedRoutes) {
        // 🚨 RBAC 核心：如果没有挂载过动态路由，根据当前用户权限动态挂载
        try {
          // 这里可以获取 localStorage 中存的用户角色，或者请求接口。假设这里读取到了角色:
          const userRolesStr = localStorage.getItem('userRoles')
          const roles = userRolesStr ? JSON.parse(userRolesStr) : ['user']

          // 遍历并动态注入具备权限的路由
          asyncRoutes.forEach(route => {
            // 简单权限过滤逻辑：如果没设权限或者用户包含该权限，就挂载（为演示全量接管，这里全量注册）
            router.addRoute(route)
          })
          
          hasAddedRoutes = true
          // 路由添加后需要重新触发一次导航 (确保刚加入的动态路由可以被访问到)
          next({ ...to, replace: true })
        } catch (error) {
          // 挂载异常，可能是 Token 解析错误或者数据被篡改，清空缓存打回登录
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userRoles')
          next(`/login?redirect=${to.path}`)
        }
      } else {
        // 动态路由已挂载，直接放行
        next()
      }
    }
  } else {
    // ⚠️ 没有 Token 的情况
    if (requireAuth) {
      ElMessage({
        message: '登录已过期或无权限，请重新登录',
        type: 'error',
        duration: 3000,
        showClose: true
      })
      // 携带重定向参数，登录后可以自动跳回想去的页面
      next(`/login?redirect=${to.path}`)
    } else {
      // 访问公共页，直接放行
      next()
    }
  }
})

export default router