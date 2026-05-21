import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router' //要求纯类型的导入必须带上type关键词

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'), // 公共布局，包含 Header 和 Footer
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: 'market',
        name: 'Market',
        component: () => import('@/views/market/index.vue'),
      },
      {
        path: 'solution',
        name: 'Solution',
        component: () => import('@/views/solution/index.vue'),
      },
      {
        path: 'policy',
        name: 'Policy',
        component: () => import('@/views/policy/index.vue'),
      },
      {
        path: 'provider',
        name: 'Provider',
        component: () => import('@/views/provider/index.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router