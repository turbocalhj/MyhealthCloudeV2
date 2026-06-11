// 算力调度运营平台 - 主入口文件
// 功能：初始化Vue应用、配置路由、状态管理、UI组件库
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import pinia from './store'
import '@/assets/styles/theme.css' 

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')