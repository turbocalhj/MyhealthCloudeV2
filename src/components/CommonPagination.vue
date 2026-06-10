<template>
  <!-- 通用分页组件：统一分页样式和交互 -->
  <div class="common-pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="pageSizes"
      :layout="layout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  total: number
  currentPage?: number
  pageSize?: number
  pageSizes?: number[]
  layout?: string
}

interface Emits {
  (e: 'update:currentPage', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'change', params: { page: number; pageSize: number }): void
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper'
})

const emit = defineEmits<Emits>()

const handleSizeChange = (size: number) => {
  emit('update:pageSize', size)
  emit('change', { page: props.currentPage, pageSize: size })
}

const handleCurrentChange = (page: number) => {
  emit('update:currentPage', page)
  emit('change', { page, pageSize: props.pageSize })
}
</script>

<style scoped>
.common-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 18px;
}
</style>
