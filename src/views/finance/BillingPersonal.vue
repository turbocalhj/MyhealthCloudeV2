<template>
  <div class="standalone-billing-personal-workspace">
    <div class="filter-panel-frame">
      <div class="filter-layout-justify-row">
        <div class="inputs-bundle-flex">
          <div class="item-cell">
            <span class="label-txt">名称</span>
            <el-input v-model="billName" placeholder="搜索名称" style="width: 220px" clearable />
          </div>
        </div>
        <div class="actions-bundle-flex">
          <el-button type="primary">搜索</el-button>
        </div>
      </div>
    </div>

    <div class="table-card-container margin-top-20">
      <el-empty description="暂无数据" :image-size="120" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const billName = ref('')
</script>

<style scoped>
.filter-panel-frame { background: #ffffff; padding: 16px 20px; border-radius: 4px; border: 1px solid #E5E6EB; }
.filter-layout-justify-row { display: flex; align-items: center; width: 100%; justify-content: space-between; }
.label-txt { font-size: 14px; color: #1D2129; margin-right: 12px; }
.table-card-container { background-color: #ffffff; padding: 40px; border-radius: 4px; border: 1px solid #E5E6EB; margin-top: 20px; }
</style>