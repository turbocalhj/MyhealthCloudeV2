<template>
  <div class="solution-page-global-container">

    <div class="solution-banner-block">
      <div class="banner-background-layer">
        <img 
          src="./images/Mask.png" 
          alt="解决方案大图背景" 
          class="banner-mask-native-img" 
        />
      </div>
      
      <div class="banner-text-inner">
        <h1 class="banner-main-headline">全栈 AI 解决方案</h1>
        <p class="banner-sub-paragraph-text">
          面向多领域业务场景，提供充足算力服务解决方案，助力客户安全高效使用智算与通算产品。
        </p>
      </div>
    </div>

    <div class="featured-solutions-wrapper">
      <div class="featured-solutions-inside-1600">
        <h2 class="section-block-main-title">精选方案</h2>
        
        <div class="solutions-grid-layout-matrix">
          <div class="solution-mega-interactive-card" @click="handleSolutionLink('medical')">
            <div class="card-inner-padded-box">
              <h3 class="card-headline-main-title">AI+医疗算力解决方案</h3>
              <p class="card-summary-paragraph">
                基于算力中心的多元算力服务体系与 AI 医学大模型技术深度融合，构建覆盖医学影像分析、智慧诊疗、临床数据挖掘及病历智能生成的全场景解决方案，为医疗服务方案提供实时精准的计算赋能，实现诊断效率跃升与医疗流程再造。
              </p>
              
              <div class="pain-points-three-cols">
                <div class="pain-point-col-item">
                  <span class="pain-badge-lbl">痛点一</span>
                  <h4 class="pain-sub-title">算力资源不足</h4>
                  <p class="pain-detail-desc">业务高峰期算力缺口大，闲时利用率不足。</p>
                </div>
                <div class="pain-point-col-item">
                  <span class="pain-badge-lbl">痛点二</span>
                  <h4 class="pain-sub-title">存储成本高</h4>
                  <p class="pain-detail-desc">病理数据年增长1~2PB，数据总量达10PB级，机房空间占用多，15~30年长期留存成本高。</p>
                </div>
                <div class="pain-point-col-item">
                  <span class="pain-badge-lbl">痛点三</span>
                  <h4 class="pain-sub-title">数据共享难</h4>
                  <p class="pain-detail-desc">切片文件大，传输慢，多业务多院区间数据共享难。</p>
                </div>
              </div>
              
              <div class="card-action-footer-bar">
                <el-button type="primary" class="go-detail-action-btn">查看详情</el-button>
              </div>
            </div>
          </div>

          <div class="solutions-right-vertical-column">
            <div class="solution-mini-interactive-card" @click="handleSolutionLink('health')">
              <div class="card-inner-padded-box">
                <h3 class="card-headline-main-title">AI+健康管理算力解决方案</h3>
                <p class="card-summary-paragraph">
                  依托算力中心的多元算力智能调度引擎平台，通过对跨机构多模态医疗数据的处理与深度挖掘，助力动态生成。
                </p>
                <div class="card-action-footer-bar">
                  <el-button type="primary" class="go-detail-action-btn">查看详情</el-button>
                </div>
              </div>
            </div>

            <div class="solution-mini-interactive-card" @click="handleSolutionLink('research')">
              <div class="card-inner-padded-box">
                <h3 class="card-headline-main-title">AI+科研算力解决方案</h3>
                <p class="card-summary-paragraph">
                  人工智能算力中心集成了国产高性能算力集群、高速网络及分布式存储系统，构建按需伸缩的科研算力池，为相关学科研究提供支撑。
                </p>
                <div class="card-action-footer-bar">
                  <el-button type="primary" class="go-detail-action-btn">查看详情</el-button>
                </div>
              </div>
            </div>
          </div>
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
// 接收路由点击进行跳转的方法
const handleSolutionLink = (type: string) => {
  console.log(`正在准备向以下方案进行页内跳转：`, type)
  // 暂时留空跳转目标，等待挂载实际的路由链接
}

// 页脚立即咨询响应
const handleConsult = () => {
  console.log('触发页脚咨询')
}
</script>

<style scoped>
/* ==========================================================================
   全局根容器：彻底破除 1600px，横向 100% 自由延展，与 Home 保持最高一致性
   ========================================================================== */
.solution-page-global-container {
  width: 100%;
  background-color: #FFFFFF;
  box-sizing: border-box;
}

/* ==========================================================================
   第一部分：大 Banner 区样式（100% 纵向排布展开）
   ========================================================================== */
.solution-banner-block {
  position: relative;
  width: 100%;
  height: 380px;
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
  max-width: 900px;
  padding-left: 20px;
  padding-right: 20px;
}

.banner-main-headline {
  font-size: 42px;
  font-weight: bold;
  color: #1677FF;
  margin-top: 0;
  margin-bottom: 24px;
  letter-spacing: 2px;
}

.banner-sub-paragraph-text {
  font-size: 15px;
  color: #555555;
  line-height: 1.8;
  margin-top: 0;
  margin-bottom: 0;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

/* ==========================================================================
   第二部分：精选方案列表区样式（在此处安全封装 1600px 居中空间）
   ========================================================================== */
.featured-solutions-wrapper {
  width: 100%;
  background-color: #FFFFFF;
  box-sizing: border-box;
}

.featured-solutions-inside-1600 {
  width: 1600px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 56px;
  padding-bottom: 80px;
  box-sizing: border-box;
}

.section-block-main-title {
  text-align: center;
  font-size: 28px;
  color: #222222;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 48px;
}

.solutions-grid-layout-matrix {
  display: grid;
  /* 左侧 758px，右侧 422px */
  grid-template-columns: 758px 422px; 
  /* 间距改为 5px */
  gap: 5px;
  /* 让整体网格在 1600px 容器内靠左或配合 margin 居中 */
  width: max-content;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

/* 卡片高质感基础样式 */
.solution-mega-interactive-card,
.solution-mini-interactive-card {
  /* 统一固定高度为 478px */
  height: 478px;
  /* 还原图二：浅蓝色微渐变背景 */
  background: linear-gradient(180deg, #F3F7FF 0%, #FFFFFF 100%);
  border-radius: 12px;
  /* 边框颜色变淡，使其更自然 */
  border: 1px solid #E3EBF7;
  box-sizing: border-box;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.solution-mega-interactive-card:hover,
.solution-mini-interactive-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(22, 119, 255, 0.08), 0 4px 12px rgba(22, 119, 255, 0.04);
}

.card-inner-padded-box {
  padding: 32px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.card-headline-main-title {
  font-size: 20px;
  font-weight: bold;
  color: #222222;
  margin-top: 0;
  margin-bottom: 16px;
}

.card-summary-paragraph {
  font-size: 14px;
  color: #666666;
  line-height: 1.7;
  margin-top: 0;
  margin-bottom: 24px;
}

/* 医疗大卡片专属：三栏痛点陈列 */
.pain-points-three-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
  padding-top: 20px;
  border-top: 1px dashed #eef2f6;
}

.pain-point-col-item {
  display: flex;
  flex-direction: column;
}

.pain-badge-lbl {
  align-self: flex-start;
  font-size: 11px;
  color: #1677FF;
  background: rgba(22, 119, 255, 0.08);
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 4px;
  font-weight: 500;
  margin-bottom: 10px;
}

.pain-sub-title {
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  margin-top: 0;
  margin-bottom: 8px;
}

.pain-detail-desc {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 1.6;
  margin-top: 0;
  margin-bottom: 0;
}

/* 右侧双卡片纵向队列 */
.solutions-right-vertical-column {
  display: flex;
  flex-direction: column;
  /* 右侧上下卡片之间的间距也同步改为 5px */
  gap: 5px; 
  width: 422px;
}

.solution-mini-interactive-card {
  flex: 1;
}

.card-action-footer-bar {
  margin-top: auto;
  display: flex;
  justify-content: flex-start;
}

.go-detail-action-btn {
  width: 96px !important;
  height: 36px !important;
  background: #1677FF !important;
  border: 1px solid #1677FF !important;
  border-radius: 4px !important;
  color: #FFFFFF !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  padding: 0 !important;
}

.go-detail-action-btn:hover {
  background: #4693ff !important;
  border-color: #4693ff !important;
}

/* ==========================================================================
   第三部分：工业级暗色 Footer 页脚区样式（横向 100% 变色撑满）
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