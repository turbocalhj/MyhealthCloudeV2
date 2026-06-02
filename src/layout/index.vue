<template>
  <div class="layout-wrapper">
    <el-container>
      <el-header class="custom-header">
        <div class="header-left">
          <div class="logo">算力调度运营平台</div>
          
          <el-menu
            :key="isLogged ? 'logged' : 'unlogged'"
            :default-active="activeMenu"
            mode="horizontal"
            router
            class="nav-menu"
          >
            <el-menu-item index="/main/home">首页</el-menu-item>
            <el-menu-item index="/main/market">智算超市</el-menu-item>
            <el-menu-item index="/main/solution">解决方案</el-menu-item>
            <el-menu-item index="/main/policy">政策专区</el-menu-item>
            <el-menu-item index="/main/provider">供给方入驻</el-menu-item>
          </el-menu>
        </div>

        <div class="header-right">
          <span class="tool-link" @click="drawerVisible = true">文档</span>
          
          <el-dropdown trigger="hover" @command="handleTicketCommand">
            <span class="tool-link dropdown-link">
              工单 <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="/console/ticket-create">创建工单</el-dropdown-item>
                <el-dropdown-item command="/console/order-apply">需求登记</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
          <template v-if="isLogged">
            <span class="tool-link" @click="router.push('/console/dashboard')">控制台</span>
            <el-badge :value="58" class="msg-badge">
              <span class="tool-link">消息</span>
            </el-badge>
            <div class="user-profile" @click="handleLogout">
              <el-avatar :size="28" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
              <span class="username">测评中心</span>
              <span class="tool-link" style="margin-left: 6px; font-size: 12px; color: #f56c6c;">(退出)</span>
            </div>
          </template>

          <template v-else>
            <el-button type="primary" size="default" @click="router.push('/login')">登录</el-button>
          </template>
        </div>
      </el-header>

      <el-main class="custom-main">
        <router-view />
      </el-main>
    </el-container>

    <el-drawer
      v-model="drawerVisible"
      title="文档中心"
      direction="rtl"
      size="45%"
      :destroy-on-close="true"
    >
      <div class="drawer-iframe-container">
        <iframe 
          src="https://element-plus.org/zh-CN/component/drawer.html" 
          frameborder="0" 
          class="doc-iframe"
        ></iframe>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus' // 💡 引入 ElMessageBox 弹框核心组件
import { ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 响应式维护用户登录状态
const isLogged = ref(false)

// 响应式维护右侧文档抽屉半框的显隐状态
const drawerVisible = ref(false)

// 动态计算当前激活的菜单项，保证刷新页面后高亮状态不丢失
const activeMenu = computed(() => {
  if (!route || !route.path) return '/main/home'
  if (route.path === '/' || route.path === '/main') return '/main/home'
  return route.path
})

// 监听路由路径，实时同步缓存中的登录标记
watch(
  () => route.path,
  () => {
    isLogged.value = localStorage.getItem('isPlatformLogged') === 'true'
  },
  { immediate: true }
)

/**
 * 🌟 核心修改：悬浮菜单点击后的权限拦截与带【立即登录】的确认弹框逻辑
 * @param command 点击菜单项传过来的目标控制台路由路径
 */
const handleTicketCommand = (command: string) => {
  const isLoggedNow = localStorage.getItem('isPlatformLogged') === 'true'

  if (isLoggedNow) {
    // 1. 已登录：直接顺畅推入控制台对应功能区
    router.push(command)
  } else {
    // 2. 未登录（升级版）：精准拉出带【立即登录】和【取消】按钮的定制提示弹框（满足图示效果）
    ElMessageBox.confirm(
      '登录已过期，请重新登录',
      '提示',
      {
        confirmButtonText: '立即登录',
        cancelButtonText: '取消',
        type: 'error',
        center: false // 保持传统的左对齐
      }
    )
    .then(() => {
      // 💡 点击【立即登录】后的业务行为：直接无缝跳转到登录页面框架
      router.push('/login')
    })
    .catch(() => {
      // 点击取消：安静关闭弹框，留在首页原地，不做任何破坏性动作
    })
  }
}

// 退出登录方法
const handleLogout = () => {
  localStorage.removeItem('isPlatformLogged')
  localStorage.removeItem('token')
  isLogged.value = false
  ElMessage.success('已成功退出登录')
  
  router.push('/main/home').then(() => {
    window.location.reload()
  })
}
</script>

<style scoped>
.layout-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 40px;
  background-color: #ffffff;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  height: 100%;
  flex: 1;         
  min-width: 0;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-right: 40px;
}

.nav-menu {
  border-bottom: none !important;
  height: 100%;
  flex: 1;          
  min-width: 500px; 
}

:deep(.el-menu-item) {
  font-size: 15px !important;
  height: 60px !important;
  line-height: 60px !important;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.tool-link {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
  display: inline-flex;
  align-items: center;
  outline: none;
}

.tool-link:hover, .dropdown-link:hover {
  color: #409eff;
}

.el-icon--right {
  margin-left: 4px;
  font-size: 12px;
}

.msg-badge :deep(.el-badge__content) {
  top: 5px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #333;
}

.custom-main {
  background-color: #f7f9fc;
  padding: 0; 
  min-height: calc(100vh - 60px);
}

.drawer-iframe-container {
  width: 100%;
  height: calc(100vh - 80px);
  overflow: hidden;
}

.doc-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

:deep(.el-drawer__body) {
  padding: 0 !important;
}
</style>