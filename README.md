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

2026-5-21
开始完成项目门户的首页制作 在制作轮播图时遇到了问题
第一阶段：组件解耦与架构进化
前身痛点： 原本的代码把所有的公告数据、卡片轮播（el-carousel）和上百行样式全部堆在首页 views/home/index.vue 里面，逻辑臃肿，且原生轮播图切换时有明显的卡顿和白屏。

重构方案： 按照 Vue3 标准工作流，我们将业务彻底解耦。在 src/components/SeamlessScroll.vue 中封装了独立组件，首页只负责单标签引入。

第二阶段：降维打击的“宽度黑魔法”
静止现象（第一次）： 刚写完动画时，文字像死机一样僵死在原地。

抓出内鬼： 审查元素发现，长跑道 .scroll-track 没有撑开，导致两组镜像数据在幕后换行、堆叠，CSS 的 -50% 平移失去了位移差。

工程化解决：

    1，引入了 width: max-content;，文字有多长，跑道就向右无限延伸多长。

    2，引入了 white-space: nowrap;，死死锁住文字，绝对不允许向下换行。

    3，引入了 width: 0; 配合 flex-grow: 1; 的外层隐藏裁剪裁剪（overflow: hidden）。

第三阶段：终结“纯 CSS”与“编译作用域”的致命冲突
静止现象（第二次）： 宽度释放了，但控制台显示动画在 running，界面却依旧纹丝不动，VS Code 还报了 4 个红叉（css-identifierexpected）。

抓出内鬼： 另一个 AI 盲目使用了 :global(marqueeContinuous) 语法。但由于你的项目是纯正的纯 CSS 流流（没有安装配置复杂的 Sass/Less 编译器），纯 CSS 编译器根本不认这个语法，导致整段 @keyframes 变成了非法代码被浏览器直接丢弃了！此外，由于 Vue3 的 scoped 属性会给动画名自动加上哈希后缀（如 marqueeContinuous_v-xxxx），导致浏览器内核有时候无法精准匹配。

终极解决： 利用 Vue 文件的天然优势，在组件最底部开辟了双样式通道：

1，<style scoped>：负责保护组件大身结构和文字颜色，加 Hash 锁死，防止污染首页。

2，< style>（不加 scoped）：专门用来存放纯全局的 @keyframes marqueeContinuous。

结果： 既消除了编译 Hash，又完美绕过了没有 Sass 编译器的环境限制。VS Code 报错瞬间全清，动画秒速丝滑跑了起来！