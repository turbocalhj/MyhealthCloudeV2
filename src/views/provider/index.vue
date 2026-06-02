<template>
  <div class="provider-page-global-container">
    
    <div class="provider-first-banner">
      <div class="banner-text-inner">
        <h1 class="banner-main-headline">算力供给方入驻</h1>
        <p class="banner-sub-paragraph-text">
          共同构建全国一体化算力网络。我们提供专业的技术支持和运营服务，帮助您的算力资源实现最大价值，共同构建安全、高效、合规的算力生态。
        </p>
        
        <div class="banner-badges-row">
          <span class="badge-tag-item">资源变现</span>
          <span class="badge-tag-item">安全合规</span>
          <span class="badge-tag-item">生态共建</span>
          <span class="badge-tag-item">专业标准</span>
        </div>

        <el-button type="primary" class="banner-action-apply-btn" @click="handleProviderApply">
          入驻申请
        </el-button>
      </div>
    </div>

    <div class="provider-process-standard-section">
      
      <div class="process-section-header">
        <h2 class="process-main-title">合作入驻流程</h2>
      </div>

      <div class="process-image-native-box">
        <img 
          src="./images/banner2.png" 
          alt="合作入驻流程图" 
          class="process-embed-img"
        />
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
const handleProviderApply = () => {
  console.log('触发供给方入驻表单申请逻辑')
}

const handleConsult = () => {
  console.log('触发页脚咨询')
}
</script>

<style scoped>
/* ==========================================================================
   全局整页容器
   ========================================================================== */
.provider-page-global-container {
  width: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* ==========================================================================
   第一部分：第一个 Banner（保持不动）
   ========================================================================== */
.provider-first-banner {
  position: relative;
  width: 100%;
  height: 440px; 
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('./images/banner1.png') center center no-repeat;
  background-size: cover;
  box-sizing: border-box;
}

.banner-text-inner {
  text-align: center;
  max-width: 880px;
  padding: 0 20px;
}

.banner-main-headline {
  font-size: 38px;
  font-weight: bold;
  color: #1677FF;
  margin-top: 0;
  margin-bottom: 20px;
  letter-spacing: 3px;
}

.banner-sub-paragraph-text {
  font-size: 15px;
  color: #555555;
  line-height: 1.8;
  margin-top: 0;
  margin-bottom: 24px;
}

.banner-badges-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
}

.badge-tag-item {
  font-size: 13px;
  color: #1677FF;
  background: rgba(22, 119, 255, 0.06);
  border: 1px solid rgba(22, 119, 255, 0.2);
  padding: 5px 16px;
  border-radius: 20px;
  font-weight: 500;
}

/* 核心按钮：加入精美悬浮浮动位移和浅蓝色深投影 */
.banner-action-apply-btn {
  width: 140px !important;
  height: 42px !important;
  background: #1677FF !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  border: none !important;
  box-shadow: 0 4px 10px rgba(22, 119, 255, 0.15);
  /* 增加贝塞尔曲线平滑过渡 */
  transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.25s ease !important;
}

.banner-action-apply-btn:hover {
  background: #4096ff !important;
  transform: translateY(-3px); /* 向上浮动变空灵 */
  box-shadow: 0 8px 22px rgba(22, 119, 255, 0.35) !important; /* 阴影范围扩大加深 */
}

/* ==========================================================================
   第二部分：流程展示区（纯白色内容页布局，高 644px，标题居上，图片居中）
   ========================================================================== */
.provider-process-standard-section {
  width: 100%;
  height: 644px; /* 严格要求固定高度 644px */
  background-color: #FFFFFF; /* 纯白色背景底色 */
  display: flex;
  flex-direction: column; /* 纵向流式排版：上方文字标题，下方图片 */
  align-items: center;
  justify-content: flex-start;
  padding-top: 56px; /* 预留顶部舒适间距 */
  box-sizing: border-box;
}

/* 真实的网页大标题区 */
.process-section-header {
  text-align: center;
  margin-bottom: 36px; /* 标题与下方图片组件之间的网格 gap */
}

.process-main-title {
  font-size: 28px;
  font-weight: bold;
  color: #222222;
  margin-top: 0;
  margin-bottom: 40px;
  letter-spacing: 2px;
}

.process-title-underline {
  width: 36px;
  height: 3px;
  background-color: #1677FF;
  margin: 0 auto 12px auto;
  border-radius: 2px;
}

.process-sub-title {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

/* 核心图片承载区 */
.process-image-native-box {
  width: 100%;
  max-width: 1200px; /* 限制大图范围与全站 1200 网格中轴线对齐 */
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

/* 图片渲染机制：不再全覆盖，原尺寸等比居中 */
.process-embed-img {
  max-width: 100%;
  height: auto;
  object-fit: contain; /* 保证原图卡片流线不发生任何比例变形 */
}

/* ==========================================================================
   第三部分：工业级暗色 Footer 页脚区样式
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
  color: #FFFFFF;
}

.footer-brand-main-title {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
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