<template>
  <div class="layout-wrapper">
    <el-container direction="vertical">
      
      <FrontHeader />

      <el-main class="custom-main">
        <router-view />
      </el-main>
    </el-container>

    <CartDrawer />
  </div>
</template>

<script setup lang="ts">
import FrontHeader from '@/components/FrontHeader.vue'
import CartDrawer from '@/components/CartDrawer.vue'
</script>

<style scoped>
/* 仅保留最外层布局的基础 CSS */
.layout-wrapper {
 min-height: 100vh; 
  display: flex;
  flex-direction: column;
}

.custom-main {
  background-color: #f7f9fc;
  padding: 0; 
  min-height: calc(100vh - 60px);
}
</style>