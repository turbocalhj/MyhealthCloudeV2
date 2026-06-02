// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // ==================== 顶级框架 C：前台展示系统 ====================
  {
    path: '/',
    component: () => import('@/layout/index.vue'), // 使用带头部导航的公共外壳
    redirect: '/home',
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
      // 🚀 核心对齐：将路由别名和路径完全适配 ConsoleLayout 中的侧边栏 index 属性
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
      }
    ]
  },

  // ==================== 顶级框架 B：平级独立的费用中心 ====================
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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router