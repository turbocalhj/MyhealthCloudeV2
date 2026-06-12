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
        <el-menu-item index="/main/home" class="nav-item-animated">
          <span class="nav-text">首页</span>
          <span class="nav-underline"></span>
        </el-menu-item>
        <el-menu-item index="/main/market" class="nav-item-animated">
          <span class="nav-text">智算超市</span>
          <span class="nav-underline"></span>
        </el-menu-item>
        <el-menu-item index="/main/solution" class="nav-item-animated">
          <span class="nav-text">解决方案</span>
          <span class="nav-underline"></span>
        </el-menu-item>
        <el-menu-item index="/main/policy" class="nav-item-animated">
          <span class="nav-text">政策专区</span>
          <span class="nav-underline"></span>
        </el-menu-item>
        <el-menu-item index="/main/provider" class="nav-item-animated">
          <span class="nav-text">供给方入驻</span>
          <span class="nav-underline"></span>
        </el-menu-item>
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
              <!-- 用户信息头部 -->
              <div class="dropdown-user-header">
                <div class="user-avatar-circle">
                  <svg viewBox="0 0 1024 1024" class="user-avatar-icon">
                    <path d="M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384z m0 64c-143.6 0-448 72.2-448 215.4V832h896v-40.6c0-143.2-304.4-215.4-448-215.4z" />
                  </svg>
                </div>
                <div class="user-info">
                  <div class="user-name">测评中心</div>
                  <div class="user-status">
                    <span class="status-dot"></span>
                    <span>在线</span>
                  </div>
                </div>
              </div>

              <!-- 功能分组 -->
              <div class="dropdown-section">
                <div class="section-title">服务入口</div>
                <el-dropdown-item command="/console/dashboard" class="dropdown-item-with-icon">
                  <el-icon class="item-icon"><Odometer /></el-icon>
                  <span>控制台首页</span>
                </el-dropdown-item>
                <el-dropdown-item command="/console/bms" class="dropdown-item-with-icon">
                  <el-icon class="item-icon"><Monitor /></el-icon>
                  <span>裸金属服务</span>
                </el-dropdown-item>
                <el-dropdown-item command="/console/ecs" class="dropdown-item-with-icon">
                  <el-icon class="item-icon"><Cpu /></el-icon>
                  <span>云主机服务</span>
                </el-dropdown-item>
                <el-dropdown-item command="/console/container" class="dropdown-item-with-icon">
                  <el-icon class="item-icon"><Connection /></el-icon>
                  <span>容器服务</span>
                </el-dropdown-item>
              </div>

              <el-divider class="dropdown-divider" />

              <!-- 管理分组 -->
              <div class="dropdown-section">
                <div class="section-title">管理中心</div>
                <el-dropdown-item command="/console/order-apply" class="dropdown-item-with-icon">
                  <el-icon class="item-icon"><Document /></el-icon>
                  <span>我的申请</span>
                </el-dropdown-item>
                <el-dropdown-item command="/console/account-settings" class="dropdown-item-with-icon">
                  <el-icon class="item-icon"><Edit /></el-icon>
                  <span>信息修改</span>
                </el-dropdown-item>
                <el-dropdown-item command="/console/account-settings" class="dropdown-item-with-icon">
                  <el-icon class="item-icon"><Setting /></el-icon>
                  <span>账户设置</span>
                </el-dropdown-item>
              </div>

              <el-divider class="dropdown-divider" />

              <!-- 退出登录 -->
              <el-dropdown-item command="logout" class="dropdown-item-logout">
                <el-icon class="item-icon"><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
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
import { ShoppingCart, Odometer, Monitor, Cpu, Connection, Document, Setting, SwitchButton, Edit } from '@element-plus/icons-vue'
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
    router.push('/console/dashboard')
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
/* Header 相关的 CSS 从 layout 完美迁移到独立组件 */
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

/* 🎯 导航项悬浮动画 */
.nav-item-animated {
  position: relative !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
}

.nav-item-animated .nav-text {
  position: relative;
  z-index: 1;
}

.nav-item-animated .nav-underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background-color: var(--pc-brand-primary, #1677FF);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* 鼠标悬浮：横线从中间向两边展开 */
.nav-item-animated:hover .nav-underline {
  width: 80%;
}

/* 鼠标离开：横线从两边收缩到中间 */
.nav-item-animated:not(:hover) .nav-underline {
  width: 0;
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
  outline: none !important;
}
.tool-link:hover, .dropdown-link:hover {
  color: #409eff;
}
.tool-link:focus, .dropdown-link:focus {
  outline: none !important;
  box-shadow: none !important;
}
.msg-badge :deep(.el-badge__content) {
  top: 5px;
}
.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none !important;
}
.user-profile:focus, .custom-hover-profile:focus {
  outline: none !important;
  box-shadow: none !important;
}

/* Element Plus 下拉框去除 focus 黑圈 */
:deep(.el-dropdown) {
  outline: none !important;
}
:deep(.el-dropdown:focus),
:deep(.el-dropdown:focus-visible) {
  outline: none !important;
  box-shadow: none !important;
}
:deep(.el-tooltip__trigger:focus-visible) {
  outline: none !important;
  box-shadow: none !important;
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
  width: 220px !important;
  padding: 0 !important;
  border-radius: 12px !important;
  border: none !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08) !important;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
}

/* 用户信息头部 */
.dropdown-user-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.user-avatar-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-avatar-icon {
  width: 24px;
  height: 24px;
  fill: #ffffff;
}

.user-info {
  margin-left: 12px;
  flex: 1;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
}

.user-status {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  margin-right: 6px;
  box-shadow: 0 0 6px rgba(74, 222, 128, 0.6);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 功能分组 */
.dropdown-section {
  padding: 8px 0;
}

.section-title {
  padding: 6px 16px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 带图标的菜单项 */
.dropdown-item-with-icon {
  padding: 10px 16px !important;
  display: flex !important;
  align-items: center !important;
  gap: 10px;
  transition: all 0.2s ease;
  border-radius: 0;
  margin: 0 8px;
  border-radius: 8px;
}

.dropdown-item-with-icon:hover {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%) !important;
}

.item-icon {
  font-size: 16px;
  color: #6b7280;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.dropdown-item-with-icon:hover .item-icon {
  color: #6366f1;
}

.dropdown-item-with-icon span {
  font-size: 14px;
  color: #374151;
  transition: color 0.2s ease;
}

.dropdown-item-with-icon:hover span {
  color: #6366f1;
  font-weight: 500;
}

/* 分隔线 */
.dropdown-divider {
  margin: 0 !important;
  border-color: #f0f0f0;
}

/* 退出登录 */
.dropdown-item-logout {
  padding: 10px 16px !important;
  display: flex !important;
  align-items: center !important;
  gap: 10px;
  margin: 0 8px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.dropdown-item-logout:hover {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.08) 100%) !important;
}

.dropdown-item-logout .item-icon {
  color: #ef4444;
}

.dropdown-item-logout span {
  font-size: 14px;
  color: #ef4444;
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