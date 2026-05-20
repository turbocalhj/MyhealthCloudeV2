# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

src/
├── assets/          # 静态资源（背景图、Logo）
├── components/      # 公共业务组件（如通用的算力卡片、政策卡片）
│   ├── ComputingCard.vue
│   └── PolicyCard.vue
├── layout/          # 全局布局
│   ├── Header.vue   # 顶部导航栏（包含图片1中的高亮态控制）
│   └── Footer.vue   # 底部版权信息
├── router/          # 路由配置（对应导航的 5 个主要页面）
└── views/           # 页面级组件
    ├── home/        # 首页（综合体）
    ├── market/      # 智算超市（筛选与列表页）
    ├── solution/    # 解决方案
    ├── policy/      # 政策专区
    └── provider/    # 供给方入驻（表单页）