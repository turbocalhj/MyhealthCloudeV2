// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const routes = [
  // 刚进入系统时，根路径默认重定向去前台大厅的首页
  {
    path: '/',
    redirect: '/main/home'
  },

  // ==================== 顶级框架 C：前台展示系统 ====================
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
        path: 'provider',
        name: 'Provider',
        component: () => import('@/views/provider/index.vue'),
        meta: { title: '供给方入驻' }
      }
    ]
  },

  // ==================== 🚀 独立登录页面框架 ====================
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'), 
    meta: { title: '登录' }
  },

  // ==================== 顶级框架 A：控制台系统 ====================
  {
    path: '/console',
    component: () => import('@/layout/ConsoleLayout.vue'),
    redirect: '/console/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/console/Dashboard.vue'),
        meta: { title: '控制台首页' }
      },
      {
        path: 'bms', 
        name: 'ResourceBMS',
        component: () => import('@/views/console/ResourceList.vue'),
        meta: { title: '裸金属', type: 'BMS' }
      },
      {
        path: 'ecs',
        name: 'ResourceECS',
        component: () => import('@/views/console/ResourceList.vue'),
        meta: { title: '云主机', type: 'ECS' }
      },
      {
        path: 'container',
        name: 'ResourceContainer',
        component: () => import('@/views/console/ResourceList.vue'),
        meta: { title: '容器', type: 'CONTAINER' }
      },
      {
        path: 'general',
        name: 'GeneralResource',
        component: () => import('@/views/console/GeneralResource.vue'),
        meta: { title: '通算资源' }
      },
      {
        path: 'expire-intel',
        name: 'ExpireManagerIntel',
        component: () => import('@/views/console/ExpireManager.vue'),
        meta: { title: '智算到期' }
      },
      {
        path: 'expire-general',
        name: 'ExpireManagerGeneral',
        component: () => import('@/views/console/ExpireManager.vue'),
        meta: { title: '通算到期' }
      },
      {
        path: 'expire-contract',
        name: 'ExpireManagerContract',
        component: () => import('@/views/console/ExpireManager.vue'),
        meta: { title: '合同到期' }
      },
      {
        path: 'resource-detail',
        name: 'ResourceDetail',
        component: () => import('@/views/console/ResourceDetail.vue'),
        meta: { title: '资源详情' }
      },
      {
        path: 'order-apply',
        name: 'OrderApply',
        component: () => import('@/views/console/OrderManager.vue'),
        meta: { title: '我的申请' }
      },
      {
        path: 'order-renew',
        name: 'OrderRenew',
        component: () => import('@/views/console/OrderManager.vue'),
        meta: { title: '资源续费' }
      },
      {
        path: 'order-quit',
        name: 'OrderQuit',
        component: () => import('@/views/console/OrderManager.vue'),
        meta: { title: '资源退订' }
      },
      {
        path: 'my-equity',
        name: 'MyEquity',
        component: () => import('@/views/console/MyEquity.vue'),
        meta: { title: '我的权益' }
      },
      {
        path: 'message',
        name: 'MessageCenter',
        component: () => import('@/views/console/MessageCenter.vue'),
        meta: { title: '消息服务' }
      },
      {
        path: 'ticket-list',
        name: 'TicketList',
        component: () => import('@/views/console/TicketList.vue'),
        meta: { title: '工单管理' }
      },
      {
        path: 'ticket-create',
        name: 'TicketCreate',
        component: () => import('@/views/console/TicketCreate.vue'),
        meta: { title: '创建工单' }
      },
      {
        path: 'ticket-detail',
        name: 'TicketDetail',
        component: () => import('@/views/console/TicketDetail.vue'),
        meta: { title: '工单服务详情' }
      },
      {
        path: 'apply-detail',
        name: 'ApplyDetail',
        component: () => import('@/views/console/ApplyDetail.vue'),
        meta: { title: '申请工单详情' }
      }
    ]
  },

  // ==================== 顶级框架 B：费用中心 ====================
  {
    path: '/finance',
    component: () => import('@/layout/FinanceLayout.vue'),
    redirect: '/finance/order',
    children: [
      {
        path: 'order',
        name: 'FinanceOrder',
        component: () => import('@/views/finance/OrderManager.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'billing-personal',
        name: 'BillingPersonal',
        component: () => import('@/views/finance/BillingPersonal.vue'),
        meta: { title: '个人账单' }
      },
      {
        path: 'billing-resource',
        name: 'BillingResource',
        component: () => import('@/views/finance/BillingResource.vue'),
        meta: { title: '资源账单' }
      },
      {
        path: 'contract',
        name: 'FinanceContractDetail',
        component: () => import('@/views/finance/ContractManager.vue'),
        meta: { title: '合同管理详情' }
      }
    ]
  },

  // 兜底路径
  {
    path: '/:pathMatch(.*)*',
    redirect: '/main/home'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// ==================== 全局路由前置守卫 ====================
router.beforeEach((to, from, next) => {
  const isLogged = localStorage.getItem('isPlatformLogged') === 'true'

  if (to.path.startsWith('/console') || to.path.startsWith('/finance')) {
    if (isLogged) {
      next() 
    } else {
      ElMessage({
        message: '登录已过期，请重新登录',
        type: 'error',
        duration: 3000,
        showClose: true
      })
      next('/login') 
    }
  } 
  else if (to.path === '/login') {
    if (isLogged) {
      next('/main/home') 
    } else {
      next() 
    }
  } 
  else {
    next()
  }
})

export default router