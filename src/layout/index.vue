<!-- 全局布局容器 -->
<template>
  <div class="layout-wrapper">
    <el-container>
      <el-header class="custom-header">
        <div class="header-left">
          <div class="logo">算力调度运营平台</div>
          
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
          <span class="tool-link">文档</span>
          <span class="tool-link">工单</span>
          <span class="tool-link">控制台</span>
          <el-badge :value="58" class="msg-badge">
            <span class="tool-link">消息</span>
          </el-badge>
          <div class="user-profile">
            <el-avatar :size="28" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
            <span class="username">测评中心</span>
          </div>
        </div>
      </el-header>

      <el-main class="custom-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// 动态计算当前激活的菜单项，保证刷新页面后高亮状态不丢失
const activeMenu = computed(() => {
  return route.path
})
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
}

.tool-link:hover {
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
  color: #333;
}

.custom-main {
  background-color: #f7f9fc;
  padding: 0; /* 清空默认边距，方便我们在子页面里做通栏 Banner */
  min-height: calc(100vh - 60px);
}
</style>