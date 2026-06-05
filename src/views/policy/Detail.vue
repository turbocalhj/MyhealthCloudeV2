<template>
  <div class="policy-detail-global-container">
    
    <div class="policy-detail-banner-block">
      <div class="banner-background-layer">
        <img 
          src="./images/banner.png" 
          alt="政策详情背景" 
          class="banner-mask-native-img" 
        />
      </div>
      <div class="banner-text-inner">
        <h1 class="banner-main-headline">{{ policyTitle }}</h1>
      </div>
    </div>

    <div class="policy-detail-content-wrapper">
      <div class="detail-paper-card">
        
        <div class="section-title-row">
          <span class="blue-vertical-bar"></span>
          <h3 class="section-title-text">政策正文</h3>
        </div>
        
        <div class="policy-grey-box">
          <el-empty description="该政策的具体内容正在整理中..." />
        </div>

      </div>
    </div>

    <footer class="global-dark-footer-block">
      <div class="footer-inner-1600-container">
        <div class="footer-top-columns-row">
          <div class="footer-brand-logo-col">
            <h2 class="footer-brand-main-title">算力调度运营平台</h2>
          </div>
          
          <div class="footer-info-details-col">
            <h4 class="column-header-title-lbl">基本信息</h4>
            <p class="info-text-line-item">联系邮箱：service@cs-xxxxxxxxxx-platform.com</p>
            <p class="info-text-line-item">联系地址：XX省XX市XX区智慧科创园区A栋商务中心</p>
          </div>
          
          <div class="footer-contact-action-col">
            <h4 class="column-header-title-lbl">联系我们</h4>
            <el-button type="primary" class="footer-consult-action-btn" @click="handleConsult">
              立即咨询
            </el-button>
          </div>
        </div>
        
        <div class="footer-bottom-compliance-bar">
          <p class="compliance-text-line-row">ICP备案编号：浙ICP备2024132127-3号</p>
          <p class="compliance-text-line-row">国家人工智能应用中试基地(医疗)-浙江版权所有 技术支持:国家人工智能应用中试基地(医疗)-浙江</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 取出路由 query 里带过来的标题
const policyTitle = computed(() => {
  return route.query.title || '政策详情'
})

const handleConsult = () => {
  console.log('触发页脚咨询')
}
</script>

<style scoped>
/* ==========================================================================
   全局容器
   ========================================================================== */
.policy-detail-global-container {
  width: 100%;
  min-height: 100vh;
  background-color: #F7F9FC;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* ==========================================================================
   顶部 Banner (背景图与动态标题)
   ========================================================================== */
.policy-detail-banner-block {
  position: relative;
  width: 100%;
  height: 280px; /* 详情页 Banner 高度可比主页稍短一点 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
}

.banner-background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.banner-mask-native-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-text-inner {
  position: relative;
  z-index: 5;
  text-align: center;
  max-width: 1000px; /* 给标题留出足够的宽度 */
  padding: 0 40px;
}

.banner-main-headline {
  font-size: 32px;
  font-weight: bold;
  color: #1677FF; /* 在背景图上使用纯白更清晰，如有需要可改回 #1677FF */
  margin: 0;
  line-height: 1.5;
}

/* ==========================================================================
   中间正文区 (白卡、标识栏、灰框)
   ========================================================================== */
.policy-detail-content-wrapper {
  flex: 1;
  width: 1185px; /* 对齐原页面的版心宽度 */
  margin: 40px auto;
  box-sizing: border-box;
}

.detail-paper-card {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 40px;
  min-height: 500px;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.05);
  border: 1px solid #E3EBF7;
}

/* 标题行容器 */
.section-title-row {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

/* 蓝条标识 */
.blue-vertical-bar {
  display: inline-block;
  width: 4px;
  height: 18px;
  background-color: #1677FF;
  border-radius: 2px;
  margin-right: 12px;
}

/* 小节标题 */
.section-title-text {
  font-size: 18px;
  color: #222222;
  font-weight: bold;
  margin: 0;
}

/* 政策正文灰底框 */
.policy-grey-box {
  background-color: #F8FAFC;
  border: 1px solid #EAEFEF;
  border-radius: 6px;
  padding: 40px;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ==========================================================================
   底部 Footer (完整复刻原样式)
   ========================================================================== */
.global-dark-footer-block {
  width: 100%;
  background-color: #1e1e1e;
  padding-top: 60px;
  padding-bottom: 30px;
  box-sizing: border-box;
}

.footer-inner-1600-container {
  width: 1600px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  padding-left: 24px;
  padding-right: 24px;
}

.footer-top-columns-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 40px;
  border-bottom: 1px solid #333333;
}

.footer-brand-logo-col {
  font-size: 22px;
  font-weight: bold;
  color: #FFFFFF;
  margin-top: 0;
  margin-bottom: 0;
}

.footer-info-details-col {
  max-width: 500px;
}

.column-header-title-lbl {
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  margin-top: 0;
  margin-bottom: 18px;
}

.info-text-line-item {
  font-size: 14px;
  color: #a6a6a6;
  line-height: 1.8;
  margin-top: 0;
  margin-bottom: 8px;
}

.footer-contact-action-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-consult-action-btn {
  width: 110px !important;
  height: 40px !important;
  background: #1677FF !important;
  border: 1px solid #1677FF !important;
  border-radius: 4px !important;
  color: #FFFFFF !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  padding: 0 !important;
}

.footer-consult-action-btn:hover {
  background: #4693ff !important;
  border-color: #4693ff !important;
}

.footer-bottom-compliance-bar {
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.compliance-text-line-row {
  font-size: 13px;
  color: #777777;
  margin-top: 0;
  margin-bottom: 0;
  line-height: 1.5;
}
</style>