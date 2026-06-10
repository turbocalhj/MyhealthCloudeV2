<template>
  <!-- 通用搜索栏组件：用于各列表页的筛选条件 -->
  <div class="common-search-bar">
    <slot>
      <!-- 默认搜索项 -->
      <el-input
        v-if="showDefaultSearch"
        v-model="searchQuery"
        :placeholder="searchPlaceholder"
        class="search-input"
        clearable
        @keyup.enter="handleSearch"
      />
    </slot>

    <el-button type="primary" @click="handleSearch">
      <el-icon><Search /></el-icon> 搜索
    </el-button>
    <el-button @click="handleReset">
      <el-icon><Refresh /></el-icon> 重置
    </el-button>

    <slot name="extra"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'

interface Props {
  showDefaultSearch?: boolean
  searchPlaceholder?: string
}

interface Emits {
  (e: 'search', query: string): void
  (e: 'reset'): void
}

const props = withDefaults(defineProps<Props>(), {
  showDefaultSearch: true,
  searchPlaceholder: '请输入搜索内容'
})

const emit = defineEmits<Emits>()

const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const handleReset = () => {
  searchQuery.value = ''
  emit('reset')
}

// 暴露方法供父组件调用
defineExpose({
  searchQuery
})
</script>

<style scoped>
.common-search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  width: 240px;
}
</style>
