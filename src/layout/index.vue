<template>
  <div class="layout-wrapper">
    <el-container>
      <el-header class="custom-header">
        <div class="header-left">
          <div class="logo" @click="router.push('/')">算力调度运营平台</div>
          
          <el-menu
            :default-active="activeMenu"
            mode="horizontal"
            router
            class="nav-menu"
          >
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/market">智算超市</el-menu-item>
            <el-menu-item index="/solution">解决方案</el-menu-item>
            <el-menu-item index="/policy">政策专区</el-menu-item>
            <el-menu-item index="/provider">供给方入驻</el-menu-item>
          </el-menu>
        </div>

        <div class="header-right">
          <span class="tool-link" @click="openDocDrawer">文档</span>
          
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

          <span class="tool-link" @click="goToConsole">控制台</span>

          <template v-if="!isLoggedIn">
            <el-button type="primary" size="small" class="nav-login-btn" @click="mockLogin">
              登录 / 注册
            </el-button>
          </template>

          <template v-else>
            <el-badge :value="58" class="msg-badge">
              <span class="tool-link" @click="router.push('/console/ticket-list')">消息</span>
            </el-badge>
            
            <el-dropdown trigger="click" @command="handleUserCommand">
              <div class="user-profile">
                <el-avatar :size="28" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
                <span class="username">测评中心</span>
                <el-icon class="arrow-user"><arrow-down /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>

        </div>
      </el-header>

      <el-main class="custom-main">
        <router-view />
      </el-main>
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 1. 登录状态控制响应式变量 (默认先设为 true 方便你调试图二效果，你可以手动改成 false 测试图一)
const isLoggedIn = ref(true)

const activeMenu = computed(() => route.path)
const docDrawerVisible = ref(false)

const openDocDrawer = () => { docDrawerVisible.value = true }

// 模拟登录与退出
const mockLogin = () => { isLoggedIn.value = true }
const handleUserCommand = (command: string) => {
  if (command === 'logout') isLoggedIn.value = false
}

// 需求 2 动作：悬浮工单菜单项点击，统一跳转至创建页 (图四/图五逻辑)
const handleTicketCommand = (command: string) => {
  console.log(`正在触发：${command}`)
  router.push('/console/ticket-create')
}

// 需求 4 动作：点击控制台进入控制台内部主页 (图六)
const goToConsole = () => {
  router.push('/console/dashboard')
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
  cursor: pointer;
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
  gap: 22px;
  flex-shrink: 0;
}

.tool-link {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
  display: flex;
  align-items: center;
}

.dropdown-trigger-lbl {
  outline: none;
}

.tool-link:hover {
  color: #409eff;
}

.nav-login-btn {
  background-color: #1677FF !important;
  border-color: #1677FF !important;
  padding: 8px 16px !important;
}

.msg-badge :deep(.el-badge__content) {
  top: 5px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  outline: none;
}

.username {
  font-size: 14px;
  color: #333;
}

.arrow-user {
  font-size: 12px;
  color: #999;
}

.custom-main {
  background-color: #f7f9fc;
  padding: 0; 
  min-height: calc(100vh - 60px);
}

/* 抽屉样式 */
:deep(.global-document-center-drawer) .el-drawer__header {
  margin-bottom: 0 !important;
  padding: 18px 24px !important;
  border-bottom: 1px solid #F0F0F0;
  color: #222222 !important;
  font-weight: bold;
  font-size: 16px;
}
:deep(.global-document-center-drawer) .el-drawer__body { padding: 0 !important; overflow: hidden; }
.drawer-iframe-container { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #FAFAFA; }
.empty-hint-network-badge { font-size: 12px; color: #8c8c8c; background-color: #F0F2F5; padding: 6px 14px; border-radius: 4px; font-family: monospace; }
</style>