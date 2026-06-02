<template>
  <div class="console-my-equity-workspace-page">
    
    <div class="trial-process-instruction-card">
      <div class="instruction-header-row">
        <div class="lightbulb-icon-box">
          <el-icon class="bulb-icon"><Opportunity /></el-icon>
        </div>
        <div class="header-text-block">
          <h3 class="instruction-main-title">试用流程说明</h3>
          <p class="instruction-sub-desc">了解资源试用的完整流程</p>
        </div>
      </div>

      <div class="process-steps-timeline-row">
        <div class="step-node-item active-step">
          <span class="step-number-circle">1</span>
          <span class="step-node-name">提交申请</span>
        </div>
        <div class="step-connecting-line"></div>
        
        <div class="step-node-item active-step">
          <span class="step-number-circle">2</span>
          <span class="step-node-name">运营审核</span>
        </div>
        <div class="step-connecting-line"></div>
        
        <div class="step-node-item active-step">
          <span class="step-number-circle">3</span>
          <span class="step-node-name">开通试用</span>
        </div>
        <div class="step-connecting-line"></div>
        
        <div class="step-node-item active-step">
          <span class="step-number-circle">4</span>
          <span class="step-node-name">转正或释放</span>
        </div>
      </div>

      <div class="instruction-actions-row">
        <el-button type="primary" class="btn-apply-new-trial" @click="handleNewTrial">申请新试用</el-button>
        <el-button class="btn-check-policy-plain" @click="handleCheckPolicy">查看试用政策</el-button>
      </div>
    </div>

    <div class="my-trial-applications-section">
      <h3 class="section-block-title">我的试用申请</h3>

      <div class="trial-cards-vertical-list">
        
        <div class="trial-asset-spec-card">
          <div class="card-top-headline-meta">
            <h4 class="asset-display-name">移动端裸金属服务01</h4>
            <span class="status-pill-badge expired-tag">已过期</span>
          </div>
          
          <div class="card-hardware-spec-grid">
            <div class="spec-grid-item"><span class="lbl">GPU型号</span><span class="val font-semibold">NVIDIA-H800</span></div>
            <div class="spec-grid-item"><span class="lbl">规格</span><span class="val font-semibold">96核CPU + 2048GB内存 + 8卡</span></div>
            <div class="spec-grid-item"><span class="lbl">试用时长</span><span class="val font-semibold">7天</span></div>
          </div>

          <div class="card-timestamps-double-row">
            <div class="time-item"><span class="lbl">申请时间</span><span class="val">2026-03-10 10:30:00</span></div>
            <div class="time-item"><span class="lbl">审核时间</span><span class="val">2026-03-11 14:20:00</span></div>
            <div class="time-item"><span class="lbl">到期时间</span><span class="val orange-highlight-text">2026-03-18 14:20:00</span></div>
          </div>
          
          <div class="progress-container-bar">
            <div class="status-text-hint-line">已过期</div>
            <el-progress :percentage="100" status="exception" :stroke-width="8" :show-text="false" class="custom-el-progress" />
          </div>
        </div>

        <div class="trial-asset-spec-card">
          <div class="card-top-headline-meta">
            <h4 class="asset-display-name">高性能计算集群</h4>
            <span class="status-pill-badge pending-tag">审核中</span>
          </div>
          
          <div class="card-hardware-spec-grid">
            <div class="spec-grid-item"><span class="lbl">GPU型号</span><span class="val font-semibold">NVIDIA-H100</span></div>
            <div class="spec-grid-item"><span class="lbl">规格</span><span class="val font-semibold">128核CPU + 1024GB内存 + 8卡</span></div>
            <div class="spec-grid-item"><span class="lbl">试用时长</span><span class="val font-semibold">7天</span></div>
          </div>

          <div class="card-timestamps-double-row">
            <div class="time-item"><span class="lbl">申请时间</span><span class="val">2026-03-25 14:20:00</span></div>
            <div class="time-item"><span class="lbl">审核时间</span><span class="val">-</span></div>
            <div class="time-item"><span class="lbl">到期时间</span><span class="val">-</span></div>
          </div>
          
          <div class="progress-container-bar">
            <div class="status-text-hint-line">待审核</div>
            <el-progress :percentage="0" :stroke-width="8" :show-text="false" class="custom-el-progress" />
          </div>
        </div>

        <div class="trial-asset-spec-card">
          <div class="card-top-headline-meta">
            <h4 class="asset-display-name">AI推理服务器</h4>
            <span class="status-pill-badge rejected-tag">已拒绝</span>
          </div>
          
          <div class="card-hardware-spec-grid">
            <div class="spec-grid-item"><span class="lbl">GPU型号</span><span class="val font-semibold">NVIDIA-A40</span></div>
            <div class="spec-grid-item"><span class="lbl">规格</span><span class="val font-semibold">32核CPU + 256GB内存 + 2卡</span></div>
            <div class="spec-grid-item"><span class="lbl">试用时长</span><span class="val font-semibold">7天</span></div>
          </div>

          <div class="card-timestamps-double-row">
            <div class="time-item"><span class="lbl">申请时间</span><span class="val">2026-03-15 11:00:00</span></div>
            <div class="time-item"><span class="lbl">审核时间</span><span class="val">2026-03-16 10:30:00</span></div>
            <div class="time-item"><span class="lbl">到期时间</span><span class="val">-</span></div>
          </div>
          
          <div class="progress-container-bar">
            <div class="status-text-hint-line">已拒绝</div>
            <el-progress :percentage="0" status="exception" :stroke-width="8" :show-text="false" class="custom-el-progress" />
          </div>
        </div>

        <div class="trial-asset-spec-card">
          <div class="card-top-headline-meta">
            <h4 class="asset-display-name">图像处理工作站</h4>
            <span class="status-pill-badge approved-tag">已通过</span>
          </div>
          
          <div class="card-hardware-spec-grid">
            <div class="spec-grid-item"><span class="lbl">GPU型号</span><span class="val font-semibold">NVIDIA-RTX-4090</span></div>
            <div class="spec-grid-item"><span class="lbl">规格</span><span class="val font-semibold">48核CPU + 256GB内存 + 2卡</span></div>
            <div class="spec-grid-item"><span class="lbl">试用时长</span><span class="val font-semibold">10天</span></div>
          </div>

          <div class="card-timestamps-double-row">
            <div class="time-item"><span class="lbl">申请时间</span><span class="val">2026-03-22 16:45:00</span></div>
            <div class="time-item"><span class="lbl">审核时间</span><span class="val">2026-03-23 09:20:00</span></div>
            <div class="time-item"><span class="lbl">到期时间</span><span class="val">2026-04-02 09:20:00</span></div>
          </div>
          
          <div class="progress-container-bar">
            <div class="status-text-hint-line">试用进度 30%</div>
            <el-progress :percentage="30" :stroke-width="8" :show-text="false" class="custom-el-progress" />
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Opportunity } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const handleNewTrial = () => {
  ElMessage.success('正在为您调取新型高配置算力资源试用表单...')
}

const handleCheckPolicy = () => {
  ElMessage.info('正在读取最新版《云平台算力资源免费试用合规及准入政策细则》')
}
</script>

<style scoped>
.console-my-equity-workspace-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

/* ==========================================================================
   第一部分：流程卡片样式区（还原图一）
   ========================================================================== */
.trial-process-instruction-card {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03);
}

.instruction-header-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.lightbulb-icon-box {
  width: 36px;
  height: 36px;
  background-color: #E8F3FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bulb-icon {
  font-size: 18px;
  color: #1677FF;
}

.instruction-main-title {
  font-size: 15px;
  font-weight: bold;
  color: #1D2129;
  margin: 0 0 4px 0;
}

.instruction-sub-desc {
  font-size: 13px;
  color: #86909C;
  margin: 0;
}

/* 横向多步连线排版 */
.process-steps-timeline-row {
  display: flex;
  align-items: center;
  max-width: 800px;
  margin-bottom: 32px;
}

.step-node-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.step-number-circle {
  width: 22px;
  height: 22px;
  background-color: #1677FF;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.step-node-name {
  font-size: 14px;
  color: #1D2129;
  font-weight: 500;
}

.step-connecting-line {
  flex: 1;
  height: 1px;
  background-color: #E5E6EB;
  margin: 0 16px;
}

.btn-apply-new-trial {
  background-color: #1677FF !important;
  border-color: #1677FF !important;
  height: 34px;
}

.btn-check-policy-plain {
  height: 34px;
  border-color: #E5E6EB !important;
  color: #4E5969 !important;
}

/* ==========================================================================
   第二部分：试用申请卡片列表区（还原图一、图二高柔和材质）
   ========================================================================== */
.my-trial-applications-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-block-title {
  font-size: 15px;
  font-weight: bold;
  color: #1D2129;
  margin: 4px 0;
}

.trial-cards-vertical-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 核心卡片骨架 */
.trial-asset-spec-card {
  background-color: #ffffff;
  border: 1px solid #E5E6EB;
  border-radius: 4px;
  padding: 20px 24px;
  box-sizing: border-box;
}

.card-top-headline-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.asset-display-name {
  font-size: 14px;
  font-weight: bold;
  color: #1D2129;
  margin: 0;
}

/* 状态 Badge 标签色块组 */
.status-pill-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.expired-tag { background-color: #F2F3F5; color: #86909C; }
.pending-tag { background-color: #FFF7E6; color: #FAAD14; }
.rejected-tag { background-color: #FFECE8; color: #F53F3F; }
.approved-tag { background-color: #E8FFEA; color: #00B42A; }

/* 硬件配置规格灰白对齐框（图一图二亮点） */
.card-hardware-spec-grid {
  background-color: #FAFAFA;
  padding: 12px 18px;
  border-radius: 4px;
  display: flex;
  gap: 48px;
  margin-bottom: 16px;
}

.spec-grid-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.spec-grid-item .lbl {
  color: #86909C;
  background-color: #F2F3F5;
  padding: 2px 6px;
  border-radius: 2px;
}

.spec-grid-item .val {
  color: #1D2129;
}

.font-semibold {
  font-weight: 500;
}

/* 时间戳容器排版 */
.card-timestamps-double-row {
  display: flex;
  gap: 40px;
  font-size: 13px;
  color: #86909C;
  margin-bottom: 18px;
  padding-left: 4px;
}

.card-timestamps-double-row .val {
  color: #4E5969;
  margin-left: 8px;
}

.orange-highlight-text {
  color: #FF7D00 !important;
  font-weight: 500;
}

/* 进度条轨道控制 */
.progress-container-bar {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 4px;
}

.status-text-hint-line {
  font-size: 12px;
  color: #86909C;
}

.custom-el-progress :deep(.el-progress-bar__inner) {
  border-radius: 4px !important;
}

.custom-el-progress :deep(.el-progress-bar__outer) {
  background-color: #F2F3F5 !important;
  border-radius: 4px !important;
}
</style>