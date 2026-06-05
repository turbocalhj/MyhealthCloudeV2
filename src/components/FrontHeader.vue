<template>
  <el-header class="custom-header">
    <div class="header-left">
      <div class="logo" @click="router.push('/main/home')" style="cursor: pointer;">算力调度运营平台</div>
      
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
      <el-badge :value="cartStore.totalCount" :max="99" :hidden="cartStore.totalCount === 0" class="msg-badge">
        <span class="tool-link" @click="cartStore.openCartDrawer" title="购物车">
          <el-icon :size="18"><ShoppingCart /></el-icon>
        </span>
      </el-badge>

      <span class="tool-link" @click="drawerVisible = true">文档</span>
      
      <el-dropdown trigger="hover" @command="handleTicketCommand">
        <span class="tool-link dropdown-link">工单</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="/console/ticket-create">创建工单</el-dropdown-item>
            <el-dropdown-item command="/console/order-apply">需求登记</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
      <template v-if="isLogged">
        <span class="tool-link" @click="handleConsoleClick">控制台</span>
        
        <el-dropdown trigger="hover" placement="bottom-end" @command="handleMessageDropdown">
          <el-badge :value="userStore.unreadCount" :max="99" :hidden="userStore.unreadCount === 0" class="msg-badge">
            <span class="tool-link">消息</span>
          </el-badge>
          <template #dropdown>
            <el-dropdown-menu class="custom-msg-dropdown">
              <div class="msg-dropdown-header">未读消息</div>
              <template v-if="userStore.unreadList.length > 0">
                <el-dropdown-item v-for="item in userStore.unreadList.slice(0, 5)" :key="item.id" command="goMessageCenter" class="msg-item">
                  <div class="msg-item-title">{{ item.title }}</div>
                  <div class="msg-item-time">{{ item.time }}</div>
                </el-dropdown-item>
                <div class="msg-dropdown-footer" @click="router.push('/console/message')">查看全部消息</div>
              </template>
              <template v-else>
                <div class="msg-empty-box">
                  <el-empty :image-size="40" description="暂无未读消息" />
                </div>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-dropdown trigger="hover" placement="bottom-end" @command="handleUserDropdown">
          <div class="user-profile custom-hover-profile">
            <svg class="avatar-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path d="M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384z m0 64c-143.6 0-448 72.2-448 215.4V832h896v-40.6c0-143.2-304.4-215.4-448-215.4z" />
            </svg>
            <span class="username">测评中心</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown-menu">
              <el-dropdown-item command="/console/dashboard">控制台首页</el-dropdown-item>
              <el-dropdown-item command="/console/bms">裸金属服务</el-dropdown-item>
              <el-dropdown-item command="/console/ecs">云主机服务</el-dropdown-item>
              <el-dropdown-item command="/console/container">容器服务</el-dropdown-item>
              <el-dropdown-item command="/console/order-apply">我的申请</el-dropdown-item>
              <el-dropdown-item disabled class="disabled-menu-item">账户设置</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>

      <template v-else>
        <span class="tool-link" style="margin-right: 20px;" @click="handleConsoleClick">控制台</span>
        <el-button type="primary" size="default" @click="router.push('/login')">登录</el-button>
      </template>
    </div>
  </el-header>

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
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus' 
import { ShoppingCart } from '@element-plus/icons-vue'
import { useCartStore } from '@/store/modules/cart'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const router = useRouter()

const cartStore = useCartStore()
const userStore = useUserStore()

const isLogged = ref(false)
const drawerVisible = ref(false)

const activeMenu = computed(() => {
  if (!route || !route.path) return '/main/home'
  if (route.path === '/' || route.path === '/main') return '/main/home'
  return route.path
})

watch(
  () => route.path,
  () => {
    isLogged.value = !!localStorage.getItem('accessToken') || localStorage.getItem('isPlatformLogged') === 'true'
  },
  { immediate: true }
)

const handleMessageDropdown = (command: string) => {
  if (command === 'goMessageCenter') {
    router.push('/console/message')
  }
}

const handleUserDropdown = (command: string) => {
  if (command === 'logout') {
    handleLogout()
  } else if (command) {
    router.push(command)
  }
}

const handleConsoleClick = () => {
  const isLoggedNow = !!localStorage.getItem('accessToken') || localStorage.getItem('isPlatformLogged') === 'true'
  if (isLoggedNow) {
    router.push('/console/bms')
  } else {
    triggerAuthBox()
  }
}

const handleTicketCommand = (command: string) => {
  const isLoggedNow = !!localStorage.getItem('accessToken') || localStorage.getItem('isPlatformLogged') === 'true'
  if (isLoggedNow) {
    router.push(command)
  } else {
    triggerAuthBox()
  }
}

const triggerAuthBox = () => {
  ElMessageBox.confirm(
    '登录已过期，请重新登录',
    '提示',
    {
      confirmButtonText: '立即登录',
      cancelButtonText: '取消',
      type: 'error',
      center: false
    }
  )
  .then(() => {
    router.push('/login')
  })
  .catch(() => {})
}

const handleLogout = () => {
  localStorage.removeItem('isPlatformLogged')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('userRoles')
  isLogged.value = false
  ElMessage.success('已成功退出登录')
  
  router.push('/main/home').then(() => {
    window.location.reload()
  })
}
</script>

<style scoped>
/* 🚀 Header 相关的 CSS 从 layout 完美迁移到独立组件 */
.custom-header {
    /* 🌟 新增：粘性定位三剑客，让导航栏永远吸附在顶部 */
  position: sticky;
  top: 0;
  z-index: 1000;
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
  color: #000000;
  cursor: pointer;
  transition: color 0.3s;
  display: inline-flex;
  align-items: center;
  outline: none;
}
.tool-link:hover, .dropdown-link:hover {
  color: #409eff;
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
  color: #000000;
  transition: color 0.3s;
}
.avatar-svg {
  width: 24px;
  height: 24px;
  fill: #000000;
  transition: fill 0.3s;
}
.custom-hover-profile:hover .username {
  color: #409eff !important;
}
.custom-hover-profile:hover .avatar-svg {
  fill: #409eff !important;
}
.user-dropdown-menu {
  width: 160px;
}
.disabled-menu-item {
  color: #c0c4cc !important;
  cursor: not-allowed !important;
  background-color: transparent !important;
}
.custom-msg-dropdown {
  width: 280px;
  padding: 8px 0;
}
.msg-dropdown-header {
  padding: 8px 16px;
  font-weight: bold;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}
.msg-item {
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start !important;
  gap: 4px;
}
.msg-item-title {
  font-size: 13px;
  color: #606266;
  white-space: normal;
  line-height: 1.4;
}
.msg-item-time {
  font-size: 11px;
  color: #909399;
}
.msg-dropdown-footer {
  text-align: center;
  padding: 10px 0 4px;
  font-size: 13px;
  color: #409eff;
  cursor: pointer;
  border-top: 1px solid #f0f0f0;
  margin-top: 4px;
}
.msg-empty-box {
  padding: 20px 0;
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
</style>