<template>
  <div class="finance-layout-wrapper notranslate" translate="no">
    <el-container class="finance-main-frame">
      <el-header class="finance-global-header">
        <div class="header-logo-brand" @click="$router.push('/')">
          <span class="logo-text">算力调度运营平台</span>
        </div>
        <div class="header-actions-links">
          <span class="action-btn-item">去购买</span>
          <span class="action-btn-item back-console-style" @click="$router.push('/console/dashboard')">返回控制台</span>
          <div class="user-info-avatar-block">
            <el-avatar :size="24" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
            <span class="username-display">测评中心</span>
          </div>
        </div>
      </el-header>

      <el-container class="finance-sub-container">
        <el-aside width="220px" class="finance-left-menu-aside">
          <div class="finance-aside-menu-caption">费用中心</div>
          
          <el-menu
            :default-active="$route.path"
            class="finance-clean-menu-instance"
            router
            background-color="#ffffff"
            text-color="#4E5969"
            active-text-color="#1677FF"
            :default-openeds="['billing-sub-group']"
          >
            <el-menu-item index="/finance/order">
              <el-icon><Document /></el-icon>
              <span>订单管理</span>
            </el-menu-item>

            <el-sub-menu index="billing-sub-group">
              <template #title>
                <el-icon><CreditCard /></el-icon>
                <span>账单管理</span>
              </template>
              <el-menu-item index="/finance/billing-personal">个人账单</el-menu-item>
              <el-menu-item index="/finance/billing-resource">资源账单</el-menu-item>
            </el-sub-menu>

            <el-menu-item index="/finance/contract">
              <el-icon><Files /></el-icon>
              <span>合同管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main class="finance-page-content-canvas">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
// 🚀 核心修复：显示注册图标，防止运行时组件未定义而白屏
import { Document, CreditCard, Files } from '@element-plus/icons-vue'
</script>

<style scoped>
.finance-layout-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #F4F6FA;
}
.finance-main-frame {
  height: 100%;
}
.finance-global-header {
  height: 60px !important;
  background-color: #ffffff;
  border-bottom: 1px solid #E5E6EB;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}
.header-logo-brand {
  cursor: pointer;
}
.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: #1D2129;
}
.header-actions-links {
  display: flex;
  align-items: center;
  gap: 24px;
}
.action-btn-item {
  font-size: 14px;
  color: #4E5969;
  cursor: pointer;
}
.action-btn-item:hover {
  color: #1677FF;
}
.back-console-style {
  font-weight: 500;
}
.user-info-avatar-block {
  display: flex;
  align-items: center;
  gap: 8px;
}
.username-display {
  font-size: 14px;
  color: #1D2129;
}
.finance-sub-container {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}
.finance-left-menu-aside {
  background-color: #ffffff;
  border-right: 1px solid #E5E6EB;
  display: flex;
  flex-direction: column;
}
.finance-aside-menu-caption {
  height: 44px;
  line-height: 44px;
  padding-left: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #1D2129;
  margin-top: 10px;
}
.finance-clean-menu-instance {
  border-right: none !important;
}
:deep(.el-sub-menu__title) {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  color: #1D2129 !important;
  margin: 3px 12px !important;
  border-radius: 4px;
}
:deep(.el-menu-item) {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 13px !important;
  margin: 3px 12px !important;
  border-radius: 4px;
  color: #4E5969 !important;
  padding-left: 44px !important;
}
.finance-clean-menu-instance > :deep(.el-menu-item) {
  padding-left: 20px !important;
  font-size: 14px !important;
  color: #1D2129 !important;
}
:deep(.el-menu-item.is-active) {
  background-color: #E8F3FF !important;
  color: #1677FF !important;
  font-weight: 500;
}
.finance-page-content-canvas {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #F4F6FA;
}
</style>