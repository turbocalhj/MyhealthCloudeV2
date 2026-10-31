src/
├── api/                     # 通信域：业务接口封装（auth / market / resource）
│   ├── auth.ts
│   ├── market.ts
│   └── resource.ts
│
├── assets/                  # 资产域：静态资源统一收口
│   ├── images/              # 业务配图（home / market / solution / login 等）
│   └── styles/theme.css     # 全局主题变量（--pc-*）
│
├── components/              # 全局组件域
│   ├── FrontHeader.tsx      # 前台顶部导航 + 消息/购物车入口
│   ├── CartDrawer.tsx       # 全局购物车结算抽屉
│   ├── SeamlessScroll.tsx   # 无缝滚动公告条
│   └── PageLoading.tsx      # 路由懒加载骨架屏
│
├── layout/                  # 骨架域：宏观页面排版
│   ├── FrontLayout.tsx      # 前台总骨架
│   ├── ConsoleLayout.tsx    # 控制台总骨架
│   └── FinanceLayout.tsx    # 费用中心总骨架
│
├── router/                  # 路由域
│   ├── index.tsx            # createHashRouter 路由表、标题映射、懒加载封装
│   └── guard.tsx            # AuthGuard：登录态 + 角色校验
│
├── store/                   # 状态域：Zustand 状态仓库
│   ├── cart.ts              # 购物车（持久化 platform_cart）
│   └── user.ts              # 令牌 / 角色 / 未读消息
│
├── types/                   # 类型域
│   └── index.ts             # ComputingProduct、MessageItem 等核心模型
│
├── utils/                   # 工具域
│   ├── auth/                # 令牌与角色读写
│   ├── http/                # Axios 实例、拦截器、统一方法
│   ├── storage/             # 存储工具
│   └── request.ts           # 旧调用方向后兼容入口
│
├── views/                   # 视图域：路由级页面（*.tsx + *.module.css）
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgotPassword.tsx
│   ├── home/
│   ├── market/
│   │   ├── index.tsx
│   │   └── Detail.tsx
│   ├── solution/
│   ├── policy/
│   │   ├── index.tsx
│   │   └── Detail.tsx
│   ├── provider/
│   │   ├── index.tsx
│   │   └── Apply.tsx
│   ├── console/             # 控制台：Dashboard、资源、订单、工单、消息、账户等
│   └── finance/             # 费用中心：订单、账单、合同
│
├── __tests__/               # 测试域：Vitest + jsdom
│   ├── setup.ts
│   ├── router/
│   ├── store/
│   └── utils/
│
├── App.tsx                  # 主题 / 语言包 / 路由提供者
├── main.tsx                 # 应用入口
└── style.css                # 全局基础样式与动画
