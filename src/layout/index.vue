<template>
  <div class="layout-wrapper">
    <el-container>
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
          
          <el-badge :value="cartItems.length" :max="99" :hidden="cartItems.length === 0" class="msg-badge">
            <span class="tool-link" @click="cartDrawerVisible = true" title="购物车">
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
              <el-badge :value="unreadCount" :max="99" :hidden="unreadCount === 0" class="msg-badge">
                <span class="tool-link">消息</span>
              </el-badge>
              <template #dropdown>
                <el-dropdown-menu class="custom-msg-dropdown">
                  <div class="msg-dropdown-header">未读消息</div>
                  <template v-if="unreadList.length > 0">
                    <el-dropdown-item v-for="item in unreadList.slice(0, 5)" :key="item.id" command="goMessageCenter" class="msg-item">
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

    <el-drawer
      v-model="cartDrawerVisible"
      title="购物车与资源申请列表"
      direction="rtl"
      size="420px"
      :destroy-on-close="true"
      class="cart-drawer"
    >
      <div class="cart-drawer-content">
        <template v-if="cartItems.length > 0">
          <div class="cart-list">
            <div v-for="(item, index) in cartItems" :key="item.id + '-' + index" class="cart-card">
              <el-icon class="cart-delete-btn" @click="removeCartItem(index)"><Close /></el-icon>
              <div class="cart-item-title">{{ item.name }}</div>
              <div class="cart-item-specs">
                <span>{{ item.gpuType }}</span> | <span>{{ item.gpuCount }}</span>
              </div>
              <div class="cart-item-bottom">
                <span class="provider-tag">{{ item.marketTag }}</span>
                <span class="cart-item-price">¥{{ item.price.toLocaleString() }}<span class="unit">{{ item.priceUnit }}</span></span>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="empty-cart-box">
          <el-empty description="您的购物车空空如也，快去选购吧" />
        </div>
      </div>
      <template #footer>
        <div class="cart-footer-actions">
          <div class="cart-total" v-if="cartItems.length > 0">
            预估总计: <span class="total-price">¥{{ cartTotalPrice.toLocaleString() }}</span>
          </div>
          <el-button @click="cartDrawerVisible = false">关闭</el-button>
          <el-button type="primary" @click="handleCheckout" :disabled="cartItems.length === 0">去结算</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus' 
import { ArrowDown, ShoppingCart, Close } from '@element-plus/icons-vue' // 引入Close图标

const route = useRoute()
const router = useRouter()

const isLogged = ref(false)
const drawerVisible = ref(false)
const cartDrawerVisible = ref(false)

const activeMenu = computed(() => {
  if (!route || !route.path) return '/main/home'
  if (route.path === '/' || route.path === '/main') return '/main/home'
  return route.path
})

watch(
  () => route.path,
  () => {
    isLogged.value = localStorage.getItem('isPlatformLogged') === 'true'
  },
  { immediate: true }
)

const unreadCount = ref(0)
const unreadList = ref<any[]>([])

const syncMessageStatus = () => {
  const localData = localStorage.getItem('platform_system_messages')
  if (localData) {
    const allMsgs = JSON.parse(localData)
    unreadList.value = allMsgs.filter((m: any) => m.status === '未读')
    unreadCount.value = unreadList.value.length
  }
}

// 👇 新增：购物车数据状态管理与同步逻辑
const cartItems = ref<any[]>([])

const syncCartStatus = () => {
  const localCart = localStorage.getItem('platform_cart')
  if (localCart) {
    cartItems.value = JSON.parse(localCart)
  } else {
    cartItems.value = []
  }
}

const openCartDrawer = () => {
  cartDrawerVisible.value = true
}

const removeCartItem = (index: number) => {
  cartItems.value.splice(index, 1)
  localStorage.setItem('platform_cart', JSON.stringify(cartItems.value))
  window.dispatchEvent(new Event('sync-cart')) // 触发全局同步
  ElMessage.success('已移出购物车')
}

const handleCheckout = () => {
  const isLoggedNow = localStorage.getItem('isPlatformLogged') === 'true'
  if (!isLoggedNow) {
    cartDrawerVisible.value = false
    triggerAuthBox()
    return
  }
  ElMessage.success('订单结算功能正在建设中...')
}

const cartTotalPrice = computed(() => {
  // 简单计算总价（无视时长单位差异，仅作演示）
  return cartItems.value.reduce((total, item) => total + (item.price || 0), 0)
})

onMounted(() => {
  syncMessageStatus()
  syncCartStatus() // 挂载时读取购物车
  window.addEventListener('storage', syncMessageStatus)
  window.addEventListener('update-message-bell-badge', syncMessageStatus)
  window.addEventListener('sync-cart', syncCartStatus) // 监听智算超市触发的更新
  window.addEventListener('open-cart-drawer', openCartDrawer) // 监听“立即购买”触发的抽屉
})

onUnmounted(() => {
  window.removeEventListener('storage', syncMessageStatus)
  window.removeEventListener('update-message-bell-badge', syncMessageStatus)
  window.removeEventListener('sync-cart', syncCartStatus)
  window.removeEventListener('open-cart-drawer', openCartDrawer)
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

const handleConsoleClick = () => {
  const isLoggedNow = localStorage.getItem('isPlatformLogged') === 'true'
  if (isLoggedNow) {
    router.push('/console/bms')
  } else {
    triggerAuthBox()
  }
}

const handleTicketCommand = (command: string) => {
  const isLoggedNow = localStorage.getItem('isPlatformLogged') === 'true'
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
  localStorage.removeItem('token')
  isLogged.value = false
  ElMessage.success('已成功退出登录')
  
  router.push('/main/home').then(() => {
    window.location.reload()
  })
}
</script>

<style scoped>
/* 原有布局样式 */
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
  color: #000000;
  transition: color 0.3s;
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

/* 👇 新增购物车专用样式 */
:deep(.cart-drawer .el-drawer__body) {
  padding: 0 !important;
  background-color: #f7f9fc;
}

.cart-drawer-content {
  height: 100%;
  overflow-y: auto;
}

.cart-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-card {
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #eef2f6;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  transition: transform 0.2s ease;
}

.cart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.cart-delete-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  color: #bfbfbf;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.2s;
}

.cart-delete-btn:hover {
  color: #ff4d4f;
}

.cart-item-title {
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
  padding-right: 24px;
  line-height: 1.4;
}

.cart-item-specs {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 12px;
}

.cart-item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.provider-tag {
  background: #e6f4ff;
  color: #1677FF;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.cart-item-price {
  color: #ff9900;
  font-weight: bold;
  font-size: 16px;
}

.cart-item-price .unit {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: normal;
}

.empty-cart-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.cart-footer-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}

.cart-total {
  position: absolute;
  left: 0;
  font-size: 14px;
  color: #666;
}

.cart-total .total-price {
  color: #ff9900;
  font-size: 18px;
  font-weight: bold;
  margin-left: 4px;
}
</style>