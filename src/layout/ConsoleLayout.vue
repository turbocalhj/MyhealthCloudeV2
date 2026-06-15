<template>
  <el-container class="console-layout">
    <el-header class="custom-header">
      <div class="header-left">
        <div class="logo" @click="router.push('/main/home')" style="cursor: pointer;">算力调度运营平台</div>
      </div>

      <div class="header-right">
        
        <el-dropdown trigger="hover" @command="handleTicketCommand">
          <span class="tool-link dropdown-link">工单</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="/console/ticket-create">创建工单</el-dropdown-item>
              <el-dropdown-item command="/console/order-apply">需求登记</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <span class="tool-link" @click="docDrawerVisible = true">文档</span>
        
        <span class="tool-link" @click="router.push('/main/market')">去购买</span>

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
              <el-dropdown-item command="/console/account-settings">账户设置</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="console-body">
      <el-aside width="220px" class="console-aside">
        <el-menu
          :default-active="activeMenu"
          class="console-menu"
          router
          unique-opened
          active-text-color="#1677FF"
          background-color="#ffffff"
          text-color="#4E5969"
        >
          <el-menu-item index="/console/dashboard">
            <el-icon><DataBoard /></el-icon>
            <span>总览</span>
          </el-menu-item>

          <el-sub-menu index="resource">
            <template #title>
              <el-icon><Monitor /></el-icon>
              <span>计算资源</span>
            </template>
            <el-menu-item index="/console/bms">裸金属服务</el-menu-item>
            <el-menu-item index="/console/ecs">云主机服务</el-menu-item>
            <el-menu-item index="/console/container">容器服务</el-menu-item>
          </el-sub-menu>
          
          <el-menu-item index="/console/general">
            <el-icon><Odometer /></el-icon>
            <span>通算资源</span>
          </el-menu-item>

          <el-sub-menu index="expire">
            <template #title>
              <el-icon><Warning /></el-icon>
              <span>资源到期</span>
            </template>
            <el-menu-item index="/console/expire-intel">智算到期管理</el-menu-item>
            <el-menu-item index="/console/expire-general">通算到期管理</el-menu-item>
            <el-menu-item index="/console/expire-contract">合同到期管理</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/console/resource-lifecycle">
            <el-icon><Connection /></el-icon>
            <span>资源生命周期</span>
          </el-menu-item>

          <el-menu-item index="/finance/order">
            <el-icon><Wallet /></el-icon>
            <span>费用中心</span>
          </el-menu-item>
          
          <el-menu-item index="/console/ticket-list">
            <el-icon><Tickets /></el-icon>
            <span>工单管理</span>
          </el-menu-item>
          
          <el-menu-item index="/console/order-apply">
            <el-icon><Document /></el-icon>
            <span>我的申请</span>
          </el-menu-item>

          <el-menu-item index="/console/my-equity">
            <el-icon><Star /></el-icon>
            <span>我的权益</span>
          </el-menu-item>

          <el-menu-item index="/console/message">
            <el-icon><Message /></el-icon>
            <span>消息服务</span>
          </el-menu-item>

          <el-menu-item index="/console/account-settings">
            <el-icon><Setting /></el-icon>
            <span>账户设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="console-main-content">
        <div class="breadcrumb-container">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/console/dashboard' }">控制台</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRouteTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="content-wrapper">
          <router-view />
        </div>
      </el-main>
    </el-container>
    
    <el-drawer
      v-model="docDrawerVisible"
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

  </el-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  DataBoard, Monitor, Warning, Tickets, Document, Wallet, Message, Star, Odometer, Setting
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const docDrawerVisible = ref(false)

const userStore = useUserStore()

const activeMenu = computed(() => {
  if (route.path === '/console' || route.path === '/console/') {
    return '/console/dashboard'
  }
  return route.path
})

const currentRouteTitle = computed(() => {
  return route.meta.title || '详情'
})

onMounted(() => {
  userStore.syncMessageStatus()
  window.addEventListener('storage', userStore.syncMessageStatus)
  window.addEventListener('update-message-bell-badge', userStore.syncMessageStatus)
})

onUnmounted(() => {
  window.removeEventListener('storage', userStore.syncMessageStatus)
  window.removeEventListener('update-message-bell-badge', userStore.syncMessageStatus)
})

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

const handleTicketCommand = (command: string) => {
  router.push(command)
}

const handleLogout = () => {
  localStorage.removeItem('isPlatformLogged')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('userRoles')
  ElMessage.success('已安全退出控制台')
  router.push('/main/home').then(() => {
    window.location.reload()
  })
}
</script>

<style scoped>
/* 原有CSS 100% 不变 */
.console-layout { height: 100vh; display: flex; flex-direction: column; background-color: #f7f9fc; }
.custom-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding: 0 40px; background-color: #ffffff; height: 60px; flex-shrink: 0; z-index: 10; }
.header-left { display: flex; align-items: center; height: 100%; }
.logo { font-size: 18px; font-weight: bold; color: #333; }
.header-right { display: flex; align-items: center; gap: 20px; }
.tool-link { font-size: 14px; color: #333; cursor: pointer; transition: color 0.3s; display: inline-flex; align-items: center; }
.tool-link:hover, .dropdown-link:hover { color: #409eff; }
.msg-badge :deep(.el-badge__content) { top: 5px; }
.user-profile { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.username { font-size: 14px; color: #333; transition: color 0.3s; }
.avatar-svg { width: 24px; height: 24px; fill: #333; transition: fill 0.3s; }
.custom-hover-profile:hover .username { color: #409eff !important; }
.custom-hover-profile:hover .avatar-svg { fill: #409eff !important; }
.user-dropdown-menu { width: 160px; }
.disabled-menu-item { color: #c0c4cc !important; cursor: not-allowed !important; background-color: transparent !important; }
.custom-msg-dropdown { width: 280px; padding: 8px 0; }
.msg-dropdown-header { padding: 8px 16px; font-weight: bold; font-size: 14px; color: #333; border-bottom: 1px solid #f0f0f0; }
.msg-item { padding: 10px 16px; display: flex; flex-direction: column; align-items: flex-start !important; gap: 4px; }
.msg-item-title { font-size: 13px; color: #606266; white-space: normal; line-height: 1.4; }
.msg-item-time { font-size: 11px; color: #909399; }
.msg-dropdown-footer { text-align: center; padding: 10px 0 4px; font-size: 13px; color: #409eff; cursor: pointer; border-top: 1px solid #f0f0f0; margin-top: 4px; }
.msg-empty-box { padding: 20px 0; }
.console-body { flex: 1; overflow: hidden; display: flex; }
.console-aside { background-color: #ffffff; border-right: 1px solid #e5e6eb; overflow-y: auto; box-shadow: 2px 0 8px rgba(29, 33, 41, 0.05); }
.console-menu { border-right: none !important; padding-top: 8px; }
:deep(.el-menu-item) { height: 48px; line-height: 48px; font-size: 14px; margin: 4px 8px; border-radius: 4px; }
:deep(.el-menu-item.is-active) { background-color: #e8f3ff !important; font-weight: 500; }
:deep(.el-sub-menu__title) { font-size: 14px; height: 48px; line-height: 48px; }
.console-main-content { flex: 1; padding: 24px; overflow-y: auto; background-color: #f7f8fa; display: flex; flex-direction: column; }
.breadcrumb-container { margin-bottom: 20px; }
.content-wrapper { flex: 1; background-color: transparent; border-radius: 4px; position: relative; }
.drawer-iframe-container { width: 100%; height: calc(100vh - 80px); overflow: hidden; }
.doc-iframe { width: 100%; height: 100%; border: none; }
:deep(.el-drawer__body) { padding: 0 !important; }
.fade-transform-leave-active, .fade-transform-enter-active { transition: all 0.3s; }
.fade-transform-enter-from { opacity: 0; transform: translateX(-10px); }
.fade-transform-leave-to { opacity: 0; transform: translateX(10px); }
</style>