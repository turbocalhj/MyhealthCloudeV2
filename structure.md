src/
├── api/                     # 通信域：所有向后端发起的网络请求
│   ├── auth.ts              
│   └── market.ts            
│
├── assets/                  # 资产域：全系统纯静态资源统一收口
│   ├── images/              # 唯一允许存放图片的地方
│   │   ├── common/          # 全局通用图片 (如 Logo、默认头像)
│   │   ├── home/            # 首页业务配图 (Banner图.png, 位图.png)
│   │   ├── market/          # 超市业务配图
│   │   ├── policy/          # 政策业务配图 (banner.png)
│   │   ├── provider/        # 入驻业务配图 (banner1.png, banner2.png)
│   │   └── solution/        # 方案业务配图 (FangAn.png, jiegou.png)
│   └── styles/              
│       └── theme.css        
│
├── components/              # 全局组件域：多页面高频复用的基础组件
│   ├── CartDrawer.vue       
│   └── SeamlessScroll.vue   
│
├── layout/                  # 骨架域：控制宏观页面排版与框架
│   ├── components/          # 仅供 layout 使用的私有组件
│   │   └── FrontHeader.vue  
│   ├── index.vue            # 前台总骨架
│   ├── ConsoleLayout.vue    # 控制台总骨架
│   └── FinanceLayout.vue    # 财务总骨架
│
├── router/                  # 路由域：寻址规则与拦截器
│   └── index.ts             # 路由配置
│
├── store/                   # 状态域：Pinia 全局状态树
│   ├── index.ts             
│   └── modules/             
│       ├── cart.ts          
│       └── user.ts          
│
├── types/                   # 类型域：TypeScript 静态接口定义
│   └── index.ts             
│
├── utils/                   # 工具域：纯 JS/TS 工具函数库
│   └── request.ts           # 封装的 Axios 实例
│
├── views/                   # 视图域：纯粹的路由级页面
│   ├── Login.vue            
│   ├── home/                
│   │   └── index.vue        
│   ├── market/              
│   │   └── index.vue        
│   ├── solution/            
│   │   └── index.vue        
│   ├── policy/              
│   │   ├── index.vue        
│   │   └── Detail.vue       
│   ├── provider/            
│   │   ├── index.vue        
│   │   └── Apply.vue        
│   ├── console/             # 控制台相关页面 
│   │   ├── Dashboard.vue    
│   │   ├── ResourceList.vue 
│   │   └── ...              
│   └── finance/             # 费用中心相关页面
│       ├── OrderManager.vue 
│       └── ...              
│
├── App.vue                  
└── main.ts