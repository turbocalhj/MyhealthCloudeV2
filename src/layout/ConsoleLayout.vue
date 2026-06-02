<template>
  <div class="console-global-frame-layout">
    <el-container class="full-viewport-height-box">
      
      <el-header class="console-top-global-header">
        <div class="header-left-brand" @click="router.push('/')">
          <span class="brand-title-text">算力调度运营平台</span>
        </div>
        
        <div class="header-right-actions">
          <span class="tool-link" @click="router.push('/market')">去购买</span>
          
          <el-dropdown trigger="hover" @command="handleTicketCommand">
            <span class="tool-link dropdown-trigger-lbl">
              工单 <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="create">创建工单</el-dropdown-item>
                <el-dropdown-item command="demand">需求登记</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <span class="tool-link" @click="openDocDrawer">文档</span>
          
          <el-badge :value="67" class="msg-bell-badge" :max="99">
            <el-icon class="bell-icon-btn" @click="router.push('/console/message')"><Bell /></el-icon>
          </el-badge>
          
          <div class="user-profile-badge">
            <el-avatar :size="24" class="user-avatar-avatar" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
            <span class="username-lbl">测评中心</span>
          </div>
        </div>
      </el-header>

      <el-container class="console-bottom-container-wrapper">
        
        <el-aside width="220px" class="console-left-sidebar-aside">
          <div class="sidebar-context-caption">控制台</div>
          
          <el-menu
            :default-active="activeMenu"
            class="console-clean-vertical-menu"
            router
            background-color="#ffffff"
            text-color="#4e5969"
            active-text-color="#1677FF"
            :default-openeds="['resource-group', 'expire-group', 'order-group', 'equity-group', 'message-group', 'ticket-group']"
          >
            <el-sub-menu index="resource-group">
              <template #title>
                <el-icon class="menu-icon-native"><Cpu /></el-icon>
                <span>智算资源</span>
              </template>
              <el-menu-item index="/console/bms">裸金属</el-menu-item>
              <el-menu-item index="/console/ecs">云主机</el-menu-item>
              <el-menu-item index="/console/container">容器</el-menu-item>
            </el-sub-menu>

            <el-menu-item index="/console/general">
              <el-icon class="menu-icon-native"><Connection /></el-icon>
              <span>通算资源</span>
            </el-menu-item>

            <el-sub-menu index="expire-group">
              <template #title>
                <el-icon class="menu-icon-native"><Calendar /></el-icon>
                <span>到期管理</span>
              </template>
              <el-menu-item index="/console/expire-intel">智算到期</el-menu-item>
              <el-menu-item index="/console/expire-general">通算到期</el-menu-item>
              <el-menu-item index="/console/expire-contract">合同到期</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="order-group">
              <template #title>
                <el-icon class="menu-icon-native"><ShoppingBag /></el-icon>
                <span>我的订阅</span>
              </template>
              <el-menu-item index="/console/order-apply">我的申请</el-menu-item>
              <el-menu-item index="/console/order-renew">资源续费</el-menu-item>
              <el-menu-item index="/console/order-quit">资源退订</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="equity-group">
              <template #title>
                <el-icon class="menu-icon-native"><Goods /></el-icon>
                <span>我的权益</span>
              </template>
              <el-menu-item index="/console/my-equity">资源试用</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="message-group">
              <template #title>
                <el-icon class="menu-icon-native"><ChatDotSquare /></el-icon>
                <span>消息服务</span>
              </template>
              <el-menu-item index="/console/message">消息中心</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="ticket-group">
              <template #title>
                <el-icon class="menu-icon-native"><DocumentChecked /></el-icon>
                <span>工单管理</span>
              </template>
              <el-menu-item index="/console/ticket-list">我的工单</el-menu-item>
              <el-menu-item index="/console/ticket-create">需求登记</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <el-main class="console-body-workspace-canvas">
          <router-view />
        </el-main>
        
      </el-container>
    </el-container>

    <el-drawer
      v-model="docDrawerVisible"
      title="文档中心"
      direction="rtl"
      size="60%"
      :destroy-on-close="true"
      class="global-document-center-drawer"
    >
      <div class="drawer-iframe-container">
        <el-empty description="文档中心服务正在初始化，请稍后..." :image-size="160">
          <template #extra>
            <div class="empty-hint-network-badge">目标局域网域：https://172.16.71.215/midoc/</div>
          </template>
        </el-empty>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowDown, Bell, Cpu, Connection, Calendar, 
  ShoppingBag, Goods, ChatDotSquare, DocumentChecked 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeMenu = ref('')
activeMenu.value = route.path

// 实时侦听当前路由节点变化，保证左侧菜单在前进后退、前后台交互时自动选中
watch(() => route.path, (newPath) => {
  activeMenu.value = newPath
})

const docDrawerVisible = ref(false)
const openDocDrawer = () => { docDrawerVisible.value = true }

const handleTicketCommand = (command: string) => {
  if (command === 'create' || command === 'demand') {
    router.push('/console/ticket-create')
  }
}
</script>

<style scoped>
.console-global-frame-layout { width: 100vw; height: 100vh; overflow: hidden; background-color: #F4F6FA; display: flex; flex-direction: column; box-sizing: border-box; }
.full-viewport-height-box { height: 100%; display: flex; flex-direction: column; }
.console-top-global-header { height: 60px !important; background-color: #ffffff; border-bottom: 1px solid #E5E6EB; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; flex-shrink: 0; z-index: 100; }
.header-left-brand { cursor: pointer; display: flex; align-items: center; }
.brand-title-text { font-size: 16px; font-weight: bold; color: #1D2129; letter-spacing: 0.5px; }
.header-right-actions { display: flex; align-items: center; gap: 24px; }
.tool-link { font-size: 14px; color: #4E5969; cursor: pointer; transition: color 0.25s ease; display: flex; align-items: center; user-select: none; }
.tool-link:hover { color: #1677FF; }
.dropdown-trigger-lbl { outline: none !important; }
.bell-icon-btn { font-size: 18px; color: #4E5969; cursor: pointer; display: flex; align-items: center; transition: color 0.25s ease; }
.bell-icon-btn:hover { color: #1677FF; }
.msg-bell-badge :deep(.el-badge__content) { background-color: #F53F3F !important; color: #FFFFFF !important; top: 4px !important; right: 2px !important; font-size: 11px; }
.user-profile-badge { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.username-lbl { font-size: 14px; color: #1D2129; }
.console-bottom-container-wrapper { flex: 1; display: flex; flex-direction: row; overflow: hidden; width: 100%; }
.console-left-sidebar-aside { background-color: #ffffff; border-right: 1px solid #E5E6EB; display: flex; flex-direction: column; flex-shrink: 0; height: 100%; }
.sidebar-context-caption { height: 44px; line-height: 44px; padding-left: 20px; font-size: 13px; font-weight: 600; color: #1D2129; margin-top: 10px; }
.console-clean-vertical-menu { border-right: none !important; padding-top: 2px; flex: 1; overflow-y: auto; }

/* 深度作用对齐：使二级展开行和普通大分类在视觉规格上实现像素级绝对融合 */
:deep(.el-sub-menu__title) { height: 40px !important; line-height: 40px !important; font-size: 14px !important; color: #1D2129 !important; padding-left: 20px !important; margin: 3px 12px !important; border-radius: 4px; }
:deep(.el-sub-menu__title:hover) { background-color: #F2F3F5 !important; }
:deep(.el-menu-item) { height: 40px !important; line-height: 40px !important; font-size: 13px !important; margin: 3px 12px !important; border-radius: 4px; color: #4E5969 !important; padding-left: 44px !important; display: flex; align-items: center; }
.console-clean-vertical-menu > :deep(.el-menu-item) { padding-left: 20px !important; font-size: 14px !important; color: #1D2129 !important; }
.menu-icon-native { font-size: 16px !important; margin-right: 8px !important; color: #4E5969; }
:deep(.el-menu-item.is-active) { background-color: #E8F3FF !important; color: #1677FF !important; font-weight: 500; }
:deep(.el-menu-item.is-active) .menu-icon-native { color: #1677FF !important; }

/* 右侧画布及独立解耦的高清皮肤滚动条规范样式（解决 & 选择器吞灭滚动条的问题） */
.console-body-workspace-canvas { flex: 1; padding: 20px 24px 24px 24px; overflow-y: auto; box-sizing: border-box; background-color: #F4F6FA; }
.console-body-workspace-canvas::-webkit-scrollbar { width: 6px !important; height: 6px !important; }
.console-body-workspace-canvas::-webkit-scrollbar-track { background: transparent !important; }
.console-body-workspace-canvas::-webkit-scrollbar-thumb { background-color: #E5E6EB !important; border-radius: 3px !important; }
.console-body-workspace-canvas:hover::-webkit-scrollbar-thumb { background-color: #C9CDD4 !important; }
.console-body-workspace-canvas::-webkit-scrollbar-thumb:hover { background-color: #86909C !important; border-radius: 4px !important; }
.drawer-iframe-container { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #FAFAFA; }
</style>