<template>
  <div class="seamless-scroll-container">
    <div class="scroll-icon">
      <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
        <path d="M576 128v768a32 32 0 0 1-50.048 26.528L292.032 704H128a64 64 0 0 1-64-64V384a64 64 0 0 1 64-64h164.032l233.92-218.528A32 32 0 0 1 576 128z m288 384c0-104.96-50.624-197.824-128-257.152v64.448C760.384 366.528 800 434.304 800 512s-39.616 145.472-104 192.704v64.448c77.376-59.328 128-152.192 128-257.152z m128 0c0-164.8-85.312-309.248-213.312-393.152v66.432C873.92 258.112 928 378.432 928 512s-54.08 253.888-141.312 326.72v66.432C914.688 821.248 1000 676.8 1000 512z"></path>
      </svg>
    </div>

    <div 
      class="scroll-wrapper" 
      @mouseenter="isPause = true" 
      @mouseleave="isPause = false"
    >
      <div class="scroll-track" :style="trackStyle">
        <div class="scroll-group">
          <span v-for="(item, idx) in rawOrderData" :key="'real-' + idx" class="scroll-item">
            <span class="item-date">{{ item.date }}</span>
            <span class="item-tag">测评**</span>
            <span class="item-text">通过算力调度运营平台成功下单了{{ item.device }}</span>
          </span>
        </div>

        <div class="scroll-group">
          <span v-for="(item, idx) in rawOrderData" :key="'clone-' + idx" class="scroll-item">
            <span class="item-date">{{ item.date }}</span>
            <span class="item-tag">测评**</span>
            <span class="item-text">通过算力调度运营平台成功下单了{{ item.device }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface OrderNotice {
  date: string
  device: string
}

const rawOrderData = ref<OrderNotice[]>([
  { date: '2026年04月24日', device: 'GPU云主机 英伟达 A100-40G' },
  { date: '2026年04月24日', device: '联通云主机-atlas-300i-pro' },
  { date: '2026年05月19日', device: '阿里云-昆仑200' },
  { date: '2026年05月11日', device: 'GPU云主机-华为T4' }
])

const isPause = ref(false)

const trackStyle = computed(() => {
  return {
    animation: 'marqueeContinuous 30s linear infinite',
    animationPlayState: isPause.value ? 'paused' : 'running'
  }
})
</script>

<style scoped>
.seamless-scroll-container {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 30px; 
  padding: 0 24px;
  height: 48px;
  overflow: hidden;
  width: 100%;             
  box-sizing: border-box;
}

.scroll-icon {
  display: flex;
  align-items: center;
  color: #1677FF; /* 完美契合系统的科技蓝 */
  margin-right: 15px;
  flex-shrink: 0;
}

.scroll-wrapper {
  overflow: hidden;
  flex-grow: 1; 
  display: flex;
  align-items: center;
  width: 0; 
}

.scroll-track {
  display: flex;
  width: max-content; 
  white-space: nowrap; 
}

.scroll-group {
  display: flex;
  align-items: center;
  flex-shrink: 0; 
}

.scroll-item {
  display: inline-flex;
  align-items: center;
  padding-right: 120px; 
  font-size: 14px;
  color: #333333;
  white-space: nowrap;
}

.item-date {
  color: #888888;
  margin-right: 8px;
}

.item-tag {
  font-weight: 600;
  color: #222222;
  margin-right: 8px;
}

.item-text {
  color: #444444;
}
</style>

<style>
/* 全局无感抽回动画轨道 */
@keyframes marqueeContinuous {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}
</style>