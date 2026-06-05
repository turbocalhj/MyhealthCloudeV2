<template>
  <!-- 根组件：仅提供路由视图容器，全局样式重置 -->
  <router-view />
</template>

<script setup lang="ts">
// 根组件不做业务逻辑处理，路由切换由子组件完成
</script>

<style>
/* 重置一下基础样式，让整站可以通栏铺满 */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', Arial, sans-serif;
}
</style>