# 算力调度运营平台 · React 重建版

> 本仓库已完成从 **Vue 3 + Element Plus** 到 **React 18 + Ant Design 5** 的整体重建。
> 上一版（Vue）的技术档案完整保留在 [`README-V1.md`](./README-V1.md)，本文件记录 React 版本的技术方案、工程结构与重建历程。

---

## 一、项目定位

面向全国一体化算力网络体系的前端业务载体，覆盖三条业务主线：

| 业务域 | 路由前缀 | 能力 |
| --- | --- | --- |
| 门户前台 | `/main/*` | 首页展示、智算超市选购、解决方案、政策专区、供给方入驻 |
| 用户控制台 | `/console/*` | 资源管理（裸金属/云主机/容器/通算）、到期管理、生命周期、订单、权益、消息、工单、账户设置 |
| 费用中心 | `/finance/*` | 订单管理、个人账单、资源账单、合同详情 |
| 认证 | `/login` `/register` `/forgot-password` | 登录、注册、找回密码 |

前台与后台在路由层物理隔离，控制台与费用中心通过角色守卫（RBAC）限制访问。

---

## 二、技术栈

| 层次 | 选型 | 说明 |
| --- | --- | --- |
| 视图框架 | React 18.3 + TypeScript 6.0 | 函数组件 + Hooks，全程严格模式（`strict` / `noUnusedLocals` / `noUnusedParameters`） |
| 构建工具 | Vite 8 + `@vitejs/plugin-react` | 路径别名 `@ -> src`，开发期 `/api` 代理到 `http://localhost:3001` |
| UI 组件库 | Ant Design 5 | `ConfigProvider` 注入中文语言包与主题令牌（品牌色 `#1677FF`） |
| 路由 | React Router 7（`createHashRouter`） | 哈希路由，保持与 V1 一致的地址形态；路由级懒加载 + `Suspense` |
| 状态管理 | Zustand 5 | 购物车、用户/消息两个独立 store，内置 `localStorage` 持久化 |
| 网络请求 | Axios | 统一实例、令牌注入、业务信封解包、重复请求取消、401 互斥跳转 |
| 样式方案 | CSS Modules + 全局主题变量 | 每个组件/页面独立 `*.module.css`，色值统一收敛到 `--pc-*` 变量池 |
| 测试 | Vitest 4 + jsdom | 44 个用例覆盖路由权限、状态仓库、认证工具与 Mock API |

---

## 三、功能地图

### 3.1 前台门户

- **首页**：Banner、政策/公告无缝滚动条、算力产品三页轮播、供给方入驻流程（滚动进入动画）、政策专区卡片、全局页脚。
- **智算超市**：算力来源、地域（省/市）、GPU 品牌、显卡数量、算力补贴五组多维筛选；价格区间、五种排序、关键字检索；卡片列表 + `IntersectionObserver` 无限滚动；滚动后筛选区吸顶折叠；行级按钮独立 Loading 锁。
- **商品详情**：商品信息、配置明细、供给方信息、加入购物车/立即购买。
- **解决方案**：精选方案列表与详情页切换、方案架构图、优势拆解。
- **政策专区/详情**：政策分类 Tab、列表与详情阅读、原文外链。
- **供给方入驻**：入驻流程引导与申请表单（校验 + 提交反馈）。

### 3.2 用户控制台

- **控制台首页**：资源统计卡、CPU/内存/GPU 使用率趋势（SVG 自绘）、资源类型环图、月度消费柱状图、TOP5 占用排行、最近活动、快捷入口、健康度评分、资源列表。
- **资源列表**：裸金属 / 云主机 / 容器三类共用一套页面，按路由切换列与操作；开机、重启、关机、销毁（二次确认）；分页与检索。
- **通算资源**：通算实例列表、快捷命令、详情跳转。
- **到期管理**：智算到期、通算到期、合同到期三种模式，合同模式跳转费用中心。
- **资源详情**：实例信息、监控指标、5 秒轮询与时间范围切换。
- **资源生命周期**：资源列表 + 六阶段时间线、附件、用量统计、续费/退订。
- **订单**：申请列表、续费/退订列表、创建订单（读取购物车选中项）、订单详情（支付模拟）。
- **我的权益 / 消息服务 / 工单 / 申请详情 / 账户设置**：权益卡片、消息已读同步、工单流转、资料维护。

### 3.3 费用中心

订单管理、个人账单、资源账单、合同管理详情，统一使用财务状况栏导航。

---

## 四、目录结构

```text
src/
├── api/                    # 业务接口层（auth / market / resource）
├── assets/
│   ├── images/             # 页面图片资源
│   └── styles/theme.css    # 全局 CSS 变量池（--pc-*）
├── components/             # 共享组件：FrontHeader / CartDrawer / SeamlessScroll / PageLoading
├── layout/                 # 布局骨架：FrontLayout / ConsoleLayout / FinanceLayout
├── router/
│   ├── index.tsx           # 路由表（哈希路由）、标题映射、懒加载封装
│   └── guard.tsx           # AuthGuard：登录态 + 角色校验 + 登录页反向拦截
├── store/
│   ├── cart.ts             # 购物车（Zustand，持久化 platform_cart）
│   └── user.ts             # 用户令牌 / 角色 / 未读消息（持久化 accessToken 等）
├── types/index.ts          # 全局业务类型（ComputingProduct、MessageItem 等）
├── utils/
│   ├── auth/               # 令牌与角色 localStorage 读写
│   ├── http/               # Axios 实例、拦截器、统一方法封装
│   ├── storage/            # 存储工具
│   └── request.ts          # 旧调用方的向后兼容入口
├── views/                  # 页面视图（按业务域分目录，*.tsx + *.module.css）
├── __tests__/              # Vitest 用例（router / store / utils）
├── App.tsx                 # 主题与路由提供者
├── main.tsx                # 应用入口
└── style.css               # 全局基础样式与动画关键帧
```

---

## 五、架构设计要点

### 5.1 路由与权限

- 采用 `createHashRouter`，刷新与静态托管无需额外回退配置；路由表集中维护在 `src/router/index.tsx`。
- 私有路由统一包裹 `AuthGuard`：无令牌跳转 `/login?redirect=...`，角色不匹配回退首页并提示，已登录访问登录页自动重定向。
- 控制台要求 `admin | user`，费用中心要求 `admin | finance`，权限判定使用角色交集算法（`hasPermission`）。

### 5.2 状态管理

`Zustand` 取代原 `Pinia + persistedstate`，保持**存储键完全兼容**，V1 用户刷新升级后购物车与登录态不丢失：

| 存储键 | 含义 | 所属 store |
| --- | --- | --- |
| `accessToken` | 访问令牌 | `store/user.ts` |
| `userRoles` | 角色数组（JSON） | `store/user.ts` |
| `isPlatformLogged` | 前台登录标识 | 登录流程 |
| `platform_system_messages` | 系统消息全集（含已读状态） | `store/user.ts` |
| `platform_user_msg` | 未读消息缓存 | `store/user.ts` |
| `platform_cart` | 购物车 `{ cartItems: [...] }` | `store/cart.ts` |

派生数据（总数量、总价、选中数、全选态）在每次写入时统一重算，避免视图层重复计算导致的不一致。

### 5.3 网络层

- 请求拦截：自动注入 `Authorization: Bearer <token>`；相同「方法 + URL + 参数」的并发请求自动取消上一次。
- 响应拦截：兼容 `code === 200 / 1 / 0` 与 `success === true` 的业务信封，直接返回 `data`；`blob` 下载透传。
- 错误处理：401 触发互斥的「清理认证 + 提示 + 跳转登录」流程；403 / 404 / 5xx / 超时 / 网络错误分别给出中文提示。
- 页面切换时可调用 `cancelAllRequests()` 统一中止在途请求。

### 5.4 UI 与样式

- Element Plus → Ant Design 5 的全量组件映射（表格、表单、弹窗、抽屉、菜单、时间线、步骤条、描述列表等），业务文案、层级、间距与主色保持一致。
- 每个页面/组件配套 CSS Module，类名统一 camelCase；Ant Design 内部节点通过 `:global(...)` 精准覆盖，避免污染全局。
- 品牌色、背景、边框、文本色收敛到 `--pc-*` 变量；登录页、首页、控制台等原有视觉细节（渐变、阴影、圆角、动效）逐项还原。

### 5.5 性能与交互

- 路由级 `React.lazy` + `Suspense` 骨架屏，配合 `NProgress` 顶部进度条。
- 页面切换自动滚动复位、`document.title` 随路由更新。
- 列表页分页/无限滚动、图片懒加载式布局、行级按钮防抖锁（加购/购买/续费/退订等）。
- 首页与长列表使用 CSS `transform` 动画替代定时器滚动，降低主线程压力。

---

## 六、重建历程（提交脉络）

本次重建按「骨架 → 基础设施 → 布局与共享组件 → 前台页面 → 控制台与费用中心 → 测试 → 文档与清理」分层推进，每一步均可独立回溯：

1. **工程骨架**：切换 React + TypeScript 依赖，重写 Vite / Vitest / tsconfig 配置与入口文件。
2. **基础设施**：类型模型、Mock API 层、Axios 请求层、认证与存储工具、Zustand 状态仓库、路由与权限守卫。
3. **布局与共享组件**：前台顶栏、购物车抽屉、无缝滚动、页面加载态、三套布局骨架。
4. **前台页面**：首页、智算超市、商品详情、解决方案、政策专区、供给方入驻、登录/注册/找回密码。
5. **控制台与费用中心**：资源、到期、生命周期、订单、权益、消息、工单、账户设置、账单与合同。
6. **测试**：迁入 Vitest + jsdom，覆盖权限、购物车、用户消息、认证工具与 Mock API。
7. **文档与清理**：新增本文件，归档 V1 文档，移除 Vue 旧源码与遗留声明文件。

> 详细的历史变更可通过 `git log --oneline --decorate` 查看。

---

## 七、本地开发与构建

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建（先执行 tsc -b 类型检查，再打包）
npm run build

# 预览构建产物
npm run preview

# 单元测试
npm run test:run
```

### 环境要求

- Node.js 20+（建议 LTS）
- 包管理器以 `package-lock.json` 为准，避免核心依赖大版本漂移

### 部署说明

构建产物为纯静态资源（`dist/`），可托管于 Nginx、Apache 或现代边缘平台。项目使用哈希路由（`#/console/dashboard`），静态服务器无需额外 rewrite 规则；如需兼容历史路径，仍可保留以下回退：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 八、测试覆盖

| 测试文件 | 覆盖内容 |
| --- | --- |
| `src/__tests__/router/permission.test.ts` | 角色交集判定、路由过滤（admin / user / finance / 无权限） |
| `src/__tests__/store/cart.test.ts` | 加购合并、数量增减、单选/全选、删除、清空、`platform_cart` 持久化 |
| `src/__tests__/store/user.test.ts` | 登录态写入与清理、角色判定、未读消息同步/单条已读/全部已读 |
| `src/__tests__/utils/request.test.ts` | 令牌与角色读写、认证清理、Axios 配置、Mock 商品与登录接口 |

当前共 **44** 个用例，执行 `npm run test:run` 全部通过。

---

## 九、与 V1 的差异说明

- **数据层**：沿用前端 Mock 数据生成逻辑（64 条算力商品、资源/订单/账单等静态样本），后端接入点已预留在 `src/api/*`。
- **视觉层**：Ant Design 5 的组件内部结构与 Element Plus 不同，通过 CSS Modules 逐项对齐；个别交互（如下拉、Tooltip、日期选择）遵循 Ant Design 原生行为。
- **工程化**：新增严格类型检查、模块化样式、单元测试与统一错误处理；V1 的 Vue 源码已归档至 Git 历史，技术文档保留在 `README-V1.md`。
