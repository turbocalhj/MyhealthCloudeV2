import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  // ==========================================================================
  // 1. 前台门户系统路由组（Header 和 Footer 体系）
  // ==========================================================================
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/home/index.vue') },
      { path: 'market', name: 'Market', component: () => import('@/views/market/index.vue') },
      { path: 'solution', name: 'Solution', component: () => import('@/views/solution/index.vue') },
      { path: 'policy', name: 'Policy', component: () => import('@/views/policy/index.vue') },
      { path: 'provider', name: 'Provider', component: () => import('@/views/provider/index.vue') }
    ]
  },

  // ==========================================================================
  // 2. 后台控制台管理系统路由组（解除锁定、100% 独立映射）
  // ==========================================================================
  {
    path: '/console',
    component: () => import('@/layout/ConsoleLayout.vue'),
    redirect: '/console/dashboard',
    children: [
      // 控制台首页看板
      {
        path: 'dashboard',
        name: 'ConsoleDashboard',
        component: () => import('@/views/console/Dashboard.vue'),
        meta: { title: '控制台首页' }
      },
      // --- 智算资源组（利用组件多态参数解耦渲染） ---
      {
        path: 'bms',
        name: 'ConsoleBms',
        component: () => import('@/views/console/ResourceList.vue'),
        meta: { title: '裸金属', type: 'BMS' }
      },
      {
        path: 'ecs',
        name: 'ConsoleEcs',
        component: () => import('@/views/console/ResourceList.vue'),
        meta: { title: '云主机', type: 'ECS' }
      },
      {
        path: 'container',
        name: 'ConsoleContainer',
        component: () => import('@/views/console/ResourceList.vue'),
        meta: { title: '容器', type: 'CONTAINER' }
      },
      {
        path: 'resource-detail',
        name: 'ResourceDetail',
        component: () => import('@/views/console/ResourceDetail.vue'), 
        meta: { title: '实例详情' }
      },
      // --- 通算资源页 ---
      {
        path: 'general',
        name: 'GeneralResource',
        component: () => import('@/views/console/GeneralResource.vue'),
        meta: { title: '通算资源' }
      },
      // --- 面对管理 (到期管理组) ---
      {
        path: 'expire-intel',
        name: 'ExpireIntel',
        component: () => import('@/views/console/ExpireManager.vue'),
        meta: { title: '智算到期', category: 'INTEL' }
      },
      {
        path: 'expire-general',
        name: 'ExpireGeneral',
        component: () => import('@/views/console/ExpireManager.vue'),
        meta: { title: '通算到期', category: 'GENERAL' }
      },
      {
        path: 'expire-contract',
        name: 'ExpireContract',
        component: () => import('@/views/console/ExpireManager.vue'),
        meta: { title: '合同到期', category: 'CONTRACT' }
      },
      // --- 我的订阅 (订购管理组) ---
      {
        path: 'order-apply',
        name: 'OrderApply',
        component: () => import('@/views/console/OrderManager.vue'),
        meta: { title: '我的申请', tab: 'APPLY' }
      },
      {
        path: 'order-renew',
        name: 'OrderRenew',
        component: () => import('@/views/console/OrderManager.vue'),
        meta: { title: '资源续费', tab: 'RENEW' }
      },
      {
        path: 'order-quit',
        name: 'OrderQuit',
        component: () => import('@/views/console/OrderManager.vue'),
        meta: { title: '资源退订', tab: 'QUIT' }
      },
      // --- 我的权益组 ---
      {
        path: 'my-equity',
        name: 'MyEquity',
        component: () => import('@/views/console/MyEquity.vue'),
        meta: { title: '资源试用' }
      },
      // --- 消息服务组 ---
      {
        path: 'message',
        name: 'MessageCenter',
        component: () => import('@/views/console/MessageCenter.vue'),
        meta: { title: '消息中心' }
      },
      // --- 工单运营组 ---
      {
        path: 'ticket-list',
        name: 'TicketList',
        component: () => import('@/views/console/TicketList.vue'),
        meta: { title: '我的工单' }
      },
      {
        path: 'ticket-create',
        name: 'TicketCreate',
        component: () => import('@/views/console/TicketCreate.vue'),
        meta: { title: '需求登记' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router