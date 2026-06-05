<template>
  <div class="solution-page-global-container">

    <div v-if="!showDetail" class="list-view-wrapper">
      <div class="solution-banner-block">
        <div class="banner-background-layer">
          <img 
            src="@/assets/images/solution/Mask.png" 
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
    </div>

    <div v-else class="detail-view-container">
      <div class="detail-back-nav" @click="showDetail = false">
        <span>&lt; 返回精选方案</span>
      </div>

      <div class="detail-banner-section">
        <h1 class="detail-banner-title">通用算力解决方案</h1>
        <p class="detail-banner-desc">
          基于算力中心的多元算力服务体系与 AI 大模型技术深度融合，构建覆盖多场景的全链路解决方案，<br>为各类服务提供实时精准的计算赋能，实现效率跃升与流程再造。
        </p>
      </div>

      <div class="detail-content-wrapper-1600">
        <div class="detail-section-block">
          <h2 class="detail-section-title">业务痛点</h2>
          <div class="detail-pain-grid">
            <div class="detail-pain-card">
              <div class="detail-pain-num">1</div>
              <h4 class="detail-pain-card-title">算力资源不足</h4>
              <p class="detail-pain-card-desc">业务高峰期算力缺口大，闲时利用率不足。</p>
            </div>
            <div class="detail-pain-card">
              <div class="detail-pain-num">2</div>
              <h4 class="detail-pain-card-title">存储成本高</h4>
              <p class="detail-pain-card-desc">行业数据年增长规模大，长期留存成本高。</p>
            </div>
            <div class="detail-pain-card">
              <div class="detail-pain-num">3</div>
              <h4 class="detail-pain-card-title">数据共享难</h4>
              <p class="detail-pain-card-desc">大文件传输慢，多业务多部门间数据共享困难。</p>
            </div>
          </div>
        </div>

        <div class="detail-section-block divider-top">
          <h2 class="detail-section-title">方案架构</h2>
          <div class="detail-arch-layout">
            <div class="arch-diagram-box">
              <img src="@/assets/images/solution/Jiegou.png">
            </div>
            
            <div class="arch-text-box">
              <div class="arch-text-item">
                <h4 class="arch-text-title">● 分层协同的全链路架构</h4>
                <p class="arch-text-desc">
                  采用“门户层 - 基础模块层 - 业务中台层 - 基础支持层”四层架构，配合应用集成、数据集成板块，实现从 PC / 移动门户的用户交互，到基础功能配置、资源管理，再到业务中台的应用/流程/AI 服务支撑，以及底层数据库、消息队列等技术支持的全链路贯通，各层级分工明确且协同高效。
                </p>
              </div>
              <div class="arch-text-item">
                <h4 class="arch-text-title">● “通算+智算”的资源服务体系</h4>
                <p class="arch-text-desc">
                  基础模块层中，“计算资源”（计算、存储、网络服务）覆盖通用算力需求，“智算资源”（GPU主机、模型服务、算法服务）聚焦 AI 类智能化场景。结合内容管理、个人中心等模块，既能满足企业日常业务的基础算力供给，也能为 AI 模型训练、算法创新等场景提供专属算力与服务支持。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section-block divider-top">
          <h2 class="detail-section-title">方案优势</h2>
          <div class="detail-adv-grid">
            <div class="detail-adv-card">
              <div class="detail-adv-icon"></div>
              <h4 class="detail-adv-title">高性能算存网基础设施</h4>
              <p class="detail-adv-desc">算-存-网采用100G大带宽组网，时延低至1s，满足AI场景对数据处理高性能需求。</p>
            </div>
            <div class="detail-adv-card">
              <div class="detail-adv-icon"></div>
              <h4 class="detail-adv-title">热-冷数据自动分级</h4>
              <p class="detail-adv-desc">热数据采用全闪存，温冷数据采用混闪，数据按需流动，满足高性能需求的同时降低存储成本。</p>
            </div>
            <div class="detail-adv-card">
              <div class="detail-adv-icon"></div>
              <h4 class="detail-adv-title">减少运维成本</h4>
              <p class="detail-adv-desc">采用全局文件系统，不管数据在哪里，数据全局可视、可管、可用、可享。</p>
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
import { ref } from 'vue'

// 新增：控制是否显示详情页的变量
const showDetail = ref(false)

// 修改：接收路由点击进行跳转的方法
const handleSolutionLink = (type: string) => {
  showDetail.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
  grid-template-columns: 758px 422px; 
  gap: 5px;
  width: max-content;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

.solution-mega-interactive-card,
.solution-mini-interactive-card {
  height: 478px;
  background: linear-gradient(180deg, #F3F7FF 0%, #FFFFFF 100%);
  border-radius: 12px;
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

.solutions-right-vertical-column {
  display: flex;
  flex-direction: column;
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

/* ==========================================================================
   第四部分：新增详情页样式（纯CSS，无嵌套结构，避免Sass编译报错）
   ========================================================================== */
.detail-view-container {
  width: 100%;
  background-color: #FAFCFF;
  padding-bottom: 60px;
}

.detail-back-nav {
  width: 1600px;
  margin: 0 auto;
  padding: 24px 0;
  color: #1677FF;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.detail-back-nav:hover {
  opacity: 0.8;
}

.detail-banner-section {
  height: 460px;
  background: linear-gradient(180deg, #E6F0FF 0%, #FFFFFF 100%);
  background-image: url("@/assets/images/solution/FangAn.png");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.detail-banner-title {
  font-size: 34px;
  font-weight: bold;
  color: #1677FF;
  margin-top: 0;
  margin-bottom: 16px;
}

.detail-banner-desc {
  font-size: 15px;
  color: #555555;
  max-width: 820px;
  line-height: 1.8;
  margin-top: 0;
}

.detail-content-wrapper-1600 {
  width: 1600px;
  margin: 0 auto;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  padding: 40px 60px;
  box-sizing: border-box;
  margin-top: -20px;
}

.detail-section-block {
  padding: 40px 0;
}

.divider-top {
  border-top: 1px solid #F0F4F8;
}

.detail-section-title {
  font-size: 24px;
  font-weight: bold;
  color: #222222;
  text-align: center;
  margin-top: 0;
  margin-bottom: 40px;
}

.detail-pain-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.detail-pain-card {
  background: #F8FAFF;
  border-radius: 8px;
  padding: 32px;
  transition: transform 0.3s;
}

.detail-pain-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(22, 119, 255, 0.05);
}

.detail-pain-num {
  width: 28px;
  height: 28px;
  background: #1677FF;
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 16px;
}

.detail-pain-card-title {
  font-size: 17px;
  font-weight: bold;
  color: #333333;
  margin-top: 0;
  margin-bottom: 12px;
}

.detail-pain-card-desc {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin: 0;
}

.detail-arch-layout {
  display: flex;
  gap: 60px;
  align-items: flex-start;
}

.arch-diagram-box {
  flex: 1.4;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 20px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.arch-row {
  display: flex;
  border: 1px solid #EDF2F7;
  border-radius: 6px;
  overflow: hidden;
}

.arch-label {
  width: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: bold;
  border-right: 1px solid #EDF2F7;
  padding: 10px;
  text-align: center;
}

.label-yellow { background: #FFFBEB; color: #D97706; }
.label-blue { background: #EFF6FF; color: #2563EB; }
.label-green { background: #F0FDF4; color: #16A34A; }
.label-grey { background: #F8FAFC; color: #475569; }

.arch-cells {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: #FFFFFF;
}

.arch-cell {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #E2E8F0;
  color: #475569;
}

.cell-yellow { background: #FEF9C3; border-color: #FEF08A; color: #854D0E; }
.cell-blue { background: #DBEAFE; border-color: #BFDBFE; color: #1E40AF; }
.cell-green { background: #DCFCE7; border-color: #BBF7D0; color: #166534; }
.cell-grey { background: #F1F5F9; border-color: #E2E8F0; }

.arch-text-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.arch-text-title {
  font-size: 16px;
  font-weight: bold;
  color: #1677FF;
  margin-top: 0;
  margin-bottom: 12px;
}

.arch-text-desc {
  font-size: 14px;
  color: #555555;
  line-height: 1.8;
  margin: 0;
  text-align: justify;
}

.detail-adv-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.detail-adv-card {
  background: #FFFFFF;
  border: 1px solid #F0F4F8;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  transition: box-shadow 0.3s;
}

.detail-adv-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
}

.detail-adv-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.detail-adv-title {
  font-size: 17px;
  font-weight: bold;
  color: #333333;
  margin-top: 0;
  margin-bottom: 12px;
}

.detail-adv-desc {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin: 0;
}
</style>