<template>
  <div class="home-global-page">
    <el-container>
      <el-header class="home-top-navbar">
        <div class="navbar-left-brand">
          <span class="brand-logo-text">算力调度运营平台</span>
        </div>
        
        <div class="navbar-center-links">
          <span class="nav-route-item active">首页</span>
          <span class="nav-route-item">智算超市</span>
          <span class="nav-route-item">通算超市</span>
          <span class="nav-route-item">关于我们</span>
        </div>

        <div class="navbar-right-actions">
          <template v-if="!isLogged">
            <span class="nav-tool-text" @click="handleUnloggedClick">文档</span>
            <span class="nav-tool-text" @click="handleUnloggedClick">工单</span>
            <span class="nav-tool-text" @click="handleUnloggedClick">控制台</span>
            <el-button type="primary" class="nav-login-entry-btn" @click="goToLogin">登录</el-button>
          </template>

          <template v-else>
            <span class="nav-tool-text" @click="router.push('/console/bms')">控制台</span>
            <el-icon class="navbar-icon-btn"><ShoppingCart /></el-icon>
            <el-icon class="navbar-icon-btn"><Bell /></el-icon>
            
            <el-dropdown trigger="hover" placement="bottom-end">
              <div class="user-avatar-trigger-block">
                <el-avatar :size="28" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
                <span class="navbar-username-lbl">测评中心</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="custom-user-profile-menu">
                  <div class="profile-card-header">
                    <div class="card-title-line">
                      <span class="main-username">测评中心</span>
                      <el-tag size="small" effect="light" type="primary" class="enterprise-tag">企业签约用户</el-tag>
                    </div>
                    <div class="card-subtitle-subname">张海洋</div>
                  </div>
                  
                  <el-dropdown-item @click="router.push('/console/bms')">
                    <el-icon><Cpu /></el-icon><span>智算资源</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click="router.push('/console/order-apply')">
                    <el-icon><ShoppingBag /></el-icon><span>我的订购</span>
                  </el-dropdown-item>
                  
                  <el-dropdown-item divided class="logout-menu-action" @click="handleLogoutAction">
                    <el-icon><SwitchButton /></el-icon><span>退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
      </el-header>

      <el-main class="home-hero-main-viewport">
        <div class="hero-teaser-box">
          <h1>下一代海量算力调度运营平台</h1>
          <p>提供裸金属、云主机及容器化等全栈自研的优质异构智算、通算算力调度流转能力</p>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart, Bell, Cpu, ShoppingBag, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const isLogged = ref(false)

// 组件挂载时检查全局登录态标识
onMounted(() => {
  isLogged.value = localStorage.getItem('isPlatformLogged') === 'true'
})

const goToLogin = () => {
  router.push('/')
}

// 对应图二：如果不登陆点控制台、工单、文档等，会弹警告提示框
const handleUnloggedClick = () => {
  ElMessage({
    message: '权限校验失败，访问控制台前请先登录您的平台账号！',
    type: 'warning',
    duration: 3500,
    showClose: true
  })
}

// 对应图四：点击退出登录注销逻辑
const handleLogoutAction = () => {
  localStorage.removeItem('isPlatformLogged')
  isLogged.value = false
  ElMessage.success('您已成功安全退出算力调度运营平台')
  router.push('/') // 注销后跳转回最开始的登录页面
}
</script>

<style scoped>
.home-global-page { width: 100vw; height: 100vh; background-color: #F7F8FA; }
.home-top-navbar { height: 60px !important; background-color: #ffffff; border-bottom: 1px solid #E5E6EB; display: flex; align-items: center; justify-content: space-between; padding: 0 60px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.navbar-left-brand .brand-logo-text { font-size: 18px; font-weight: bold; color: #1D2129; letter-spacing: 0.5px; }
.navbar-center-links { display: flex; gap: 40px; }
.nav-route-item { font-size: 15px; color: #4E5969; cursor: pointer; user-select: none; font-weight: 500; }
.nav-route-item:hover, .nav-route-item.active { color: #1677FF; }
.navbar-right-actions { display: flex; align-items: center; gap: 24px; }
.nav-tool-text { font-size: 14px; color: #4E5969; cursor: pointer; user-select: none; }
.nav-tool-text:hover { color: #1677FF; }
.nav-login-entry-btn { background-color: #1677FF; border-color: #1677FF; padding: 8px 20px; }
.navbar-icon-btn { font-size: 18px; color: #4E5969; cursor: pointer; }
.navbar-icon-btn:hover { color: #1677FF; }
.user-avatar-trigger-block { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.navbar-username-lbl { font-size: 14px; color: #1D2129; font-weight: 500; }

/* 还原图五：自适应高订制悬浮弹窗 */
.custom-user-profile-menu { width: 220px; padding: 0; }
.profile-card-header { padding: 16px; border-bottom: 1px solid #F2F3F5; background: linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 100%); }
.card-title-line { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.main-username { font-size: 15px; font-weight: 600; color: #1D2129; }
.enterprise-tag { font-size: 11px; transform: scale(0.9); transform-origin: right center; }
.card-subtitle-subname { font-size: 12px; color: #86909C; }
.logout-menu-action { color: #F53F3F !important; }
.logout-menu-action:hover { background-color: #FFECEC !important; }

.home-hero-main-viewport { height: calc(100vh - 60px); display: flex; justify-content: center; align-items: center; text-align: center; background: radial-gradient(circle at top, #E8F3FF 0%, #F7F8FA 70%); }
.hero-teaser-box h1 { font-size: 42px; color: #1D2129; margin-bottom: 16px; font-weight: 800; }
.hero-teaser-box p { font-size: 16px; color: #4E5969; max-width: 600px; margin: 0 auto; line-height: 1.6; }
</style>