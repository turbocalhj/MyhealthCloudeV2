import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 引入 Element Plus 的样式
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(router)
app.mount('#app')