<template>
  <div class="apply-detail-container">
    <div class="detail-navigation-header">
      <el-icon class="back-arrow-btn" @click="$router.back()"><ArrowLeft /></el-icon>
      <span class="apply-id-text">{{ applyInfo.applyId }}</span>
      <span class="status-badge-pending">待审批</span>
    </div>

    <div class="metadata-summary-infobar">
      <div class="meta-cell"><span class="lbl">需求方：</span><span class="val">{{ applyInfo.demander }}</span></div>
      <div class="meta-cell"><span class="lbl">供给方：</span><span class="val">{{ applyInfo.provider }}</span></div>
      <div class="meta-cell"><span class="lbl">申请人：</span><span class="val">{{ applyInfo.applicant }}</span></div>
      <div class="meta-cell"><span class="lbl">申请时间：</span><span class="val">{{ applyInfo.applyTime }}</span></div>
      <div class="meta-cell"><span class="lbl">金额：</span><span class="val price-blue">¥{{ applyInfo.price }}</span></div>
    </div>

    <div class="detail-tabs-navigation-strip">
      <span 
        v-for="tab in tabOptions" 
        :key="tab.key"
        :class="['strip-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </span>
    </div>

    <div class="tab-content-block-canvas" style="margin-top: 20px;">
      <div v-if="activeTab === 'product'" class="product-spec-profile-card">
        <div class="product-main-header-row">
          <div class="product-title-group">
            <h3 class="product-main-title">阿里公云-昆仑200</h3>
            <span class="product-sub-lease-lbl">包年包月 | 1个月 | 1台</span>
          </div>
          <div class="product-price-summary-box">
            <div class="discount-price"><span class="lbl-txt">优惠后金额</span> <span class="val-num">¥0.00</span></div>
            <div class="original-price">原价 ¥2,000.00</div>
          </div>
        </div>

        <div class="hardware-properties-matrix-grid">
          <div class="prop-cell"><span class="p-lbl">实例名称</span><span class="p-val font-mono">r43r</span></div>
          <div class="prop-cell"><span class="p-lbl">登录名</span><span class="p-val font-mono">root</span></div>
          <div class="prop-cell"><span class="p-lbl">实例镜像</span><span class="p-val font-mono">win2025_24H2_x64_dtc_en-us_40G_uefi...</span></div>
          <div class="prop-cell"><span class="p-lbl">显卡型号</span><span class="p-val">KUNLUNXIN GPU-R200</span></div>
          
          <div class="prop-cell"><span class="p-lbl">显卡数量</span><span class="p-val">1 卡</span></div>
          <div class="prop-cell"><span class="p-lbl">显存容量</span><span class="p-val">32GB</span></div>
          <div class="prop-cell"><span class="p-lbl">CPU</span><span class="p-val">1核</span></div>
          <div class="prop-cell"><span class="p-lbl">内存</span><span class="p-val">1GB</span></div>
          
          <div class="prop-cell"><span class="p-lbl">系统盘</span><span class="p-val">cloud_efficiency / 40GB</span></div>
          <div class="prop-cell"><span class="p-lbl">VPC</span><span class="p-val font-mono">default</span></div>
          <div class="prop-cell"><span class="p-lbl">子网</span><span class="p-val font-mono">test223</span></div>
          <div class="prop-cell"><span class="p-lbl">安全组</span><span class="p-val font-mono">sg-2zebbdw1401t5pt5cebm</span></div>
        </div>

        <div class="total-aggregate-amount-bar">
          <span class="total-lbl">合计金额</span>
          <span class="total-val">¥0.00</span>
        </div>
      </div>

      <div v-else class="empty-placeholder-block">
        <el-empty description="暂无历史流转记录" :image-size="100" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const activeTab = ref('product')

const tabOptions = [
  { label: '产品清单', key: 'product' },
  { label: '审批记录', key: 'record' },
  { label: '资源列表', key: 'resource' }
]

const applyInfo = ref({
  applyId: 'RA202606021006536985',
  demander: '测评中心',
  provider: '健康云',
  applicant: '张海洋',
  applyTime: '2026-06-02 10:06:53',
  price: '0.00'
})

onMounted(() => {
  // 如果从列表携带了动态 query 矩阵则覆盖初始快照
  if (route.query && Object.keys(route.query).length > 0) {
    applyInfo.value = {
      applyId: (route.query.applyId as string) || applyInfo.value.applyId,
      demander: '测评中心',
      provider: '健康云',
      applicant: (route.query.applicant as string) || applyInfo.value.applicant,
      applyTime: (route.query.applyTime as string) || applyInfo.value.applyTime,
      price: (route.query.price as string) || applyInfo.value.price
    }
  }
})
</script>

<style scoped>
.apply-detail-container { width: 100%; display: flex; flex-direction: column; }
.detail-navigation-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.back-arrow-btn { font-size: 16px; color: #4E5969; cursor: pointer; transition: color 0.2s; }
.back-arrow-btn:hover { color: #1677FF; }
.apply-id-text { font-size: 16px; font-weight: 600; color: #1D2129; }
.status-badge-pending { background-color: #FFF7E6; color: #FAAD14; font-size: 12px; padding: 2px 8px; border-radius: 2px; font-weight: 500; }

/* 基础元数据信息面板面板排版 */
.metadata-summary-infobar { background-color: #E8F3FF; border-radius: 4px; padding: 14px 20px; display: flex; flex-wrap: wrap; gap: 16px 40px; border: 1px solid #BAE7FF; }
.meta-cell { font-size: 13px; display: flex; align-items: center; }
.meta-cell .lbl { color: #4E5969; }
.meta-cell .val { color: #1D2129; font-weight: 400; }
.price-blue { color: #1677FF !important; font-weight: 500 !important; }

/* 选项卡条 */
.detail-tabs-navigation-strip { display: flex; gap: 32px; border-bottom: 1px solid #E5E6EB; margin-top: 24px; padding-left: 4px; }
.strip-item { font-size: 14px; color: #4E5969; padding-bottom: 12px; cursor: pointer; position: relative; transition: all 0.2s; }
.strip-item:hover, .strip-item.active { color: #1677FF; }
.strip-item.active { font-weight: 500; }
.strip-item.active::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background-color: #1677FF; }

/* 产品规格大卡片 */
.product-spec-profile-card { background-color: #ffffff; border-radius: 4px; border: 1px solid #E5E6EB; display: flex; flex-direction: column; }
.product-main-header-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 20px 24px; border-bottom: 1px solid #F2F3F5; background-color: #FAFAFA; }
.product-main-title { font-size: 15px; font-weight: bold; color: #1D2129; margin: 0 0 6px 0; }
.product-sub-lease-lbl { font-size: 12px; color: #86909C; }
.product-price-summary-box { text-align: right; }
.discount-price { font-size: 13px; color: #86909C; display: flex; align-items: baseline; gap: 8px; }
.discount-price .val-num { font-size: 22px; font-weight: 700; color: #FF7D00; }
.original-price { font-size: 12px; color: #86909C; text-decoration: line-through; margin-top: 4px; }

/* 硬件配置12宫格核心面板 */
.hardware-properties-matrix-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px 32px; padding: 24px; }
.prop-cell { display: flex; flex-direction: column; gap: 6px; font-size: 13px; }
.prop-cell .p-lbl { color: #86909C; }
.prop-cell .p-val { color: #1D2129; font-weight: 400; word-break: break-all; }

/* 合计条 */
.total-aggregate-amount-bar { background-color: #F7F8FA; border-top: 1px solid #E5E6EB; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
.total-lbl { font-size: 14px; font-weight: bold; color: #1D2129; }
.total-val { font-size: 18px; font-weight: 700; color: #1677FF; }

.empty-placeholder-block { background: #ffffff; padding: 60px; border-radius: 4px; border: 1px solid #E5E6EB; }
.font-mono { font-family: Consolas, Monaco, monospace; }
</style>