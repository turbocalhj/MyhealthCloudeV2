<template>
  <!-- 通用表格容器：统一表格样式、加载状态、空数据处理 -->
  <div class="common-table-card">
    <el-table
      v-loading="loading"
      :data="data"
      style="width: 100%"
      size="default"
      :header-cell-style="headerCellStyle"
      :empty-text="emptyText"
      @selection-change="handleSelectionChange"
    >
      <slot></slot>
    </el-table>

    <slot name="pagination"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: unknown[]
  loading?: boolean
  emptyText?: string
  showSelection?: boolean
}

interface Emits {
  (e: 'selection-change', selection: unknown[]): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
  emptyText: '暂无数据',
  showSelection: false
})

const emit = defineEmits<Emits>()

const headerCellStyle = {
  background: '#f7f8fa',
  color: '#1d2129',
  fontWeight: '500'
}

const handleSelectionChange = (selection: unknown[]) => {
  emit('selection-change', selection)
}
</script>

<style scoped>
.common-table-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.04);
}
</style>
