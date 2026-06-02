<template>
  <div class="standalone-contract-detail-container">
    <div class="finance-detail-navigation-bar">
      <span class="back-arrow-clickable-btn" @click="$router.back()">⬅ Back</span>
      <span class="contract-headline-title">{{ currentContractInfo.name || '阿里合同' }}</span>
      <span class="status-badge-fulfillment">履约中</span>
    </div>

    <div class="contract-metadata-infobar-panel">
      <div class="meta-cell-item"><span class="lbl">合同编号：</span><span class="val font-mono">{{ currentContractInfo.id || 'HT20260529001' }}</span></div>
      <div class="meta-cell-item"><span class="lbl">云上合同ID：</span><span class="val font-mono">HT20260529001</span></div>
      <div class="meta-cell-item"><span class="lbl">合同期限：</span><span class="val">2026-05-29 ~ 2026-05-31</span></div>
      <div class="meta-cell-item"><span class="lbl">合同类型：</span><span class="val">折扣合同</span></div>
      <div class="meta-cell-item"><span class="lbl">折扣比例：</span><span class="val">50%</span></div>
      <div class="meta-cell-item"><span class="lbl">提交人：</span><span class="val">张海洋</span></div>
      <div class="meta-cell-item"><span class="lbl">合同提交时间：</span><span class="val">2026-05-29 14:36:14</span></div>
    </div>

    <div class="contract-tabs-navigation-strip">
      <span class="strip-item active">合同信息</span>
      <span class="strip-item">产品清单</span>
      <span class="strip-item">审批记录</span>
      <span class="strip-item">资源列表</span>
    </div>

    <div class="white-card-content-block margin-top-20">
      <div class="block-inner-title">签署方信息</div>
      <div class="quad-grid-properties-layout">
        <div class="grid-cell"><span class="p-lbl">需求方</span><span class="p-val">测评中心</span></div>
        <div class="grid-cell"><span class="p-lbl">联系人</span><span class="p-val">张海洋</span></div>
        <div class="grid-cell"><span class="p-lbl">联系电话</span><span class="p-val">18215684930</span></div>
        <div class="grid-cell"><span class="p-lbl">邮箱</span><span class="p-val">--</span></div>
        
        <div class="grid-cell"><span class="p-lbl">供给方</span><span class="p-val">{{ currentContractInfo.provider || '健康云' }}</span></div>
        <div class="grid-cell"><span class="p-lbl">联系人</span><span class="p-val">常玉林</span></div>
        <div class="grid-cell"><span class="p-lbl">联系电话</span><span class="p-val">13810565403</span></div>
        <div class="grid-cell"><span class="p-lbl">邮箱</span><span class="p-val">changyulin@163.com</span></div>
      </div>
    </div>

    <div class="white-card-content-block margin-top-20">
      <div class="block-inner-title">合同说明</div>
      <div class="placeholder-null-text">--</div>
    </div>

    <div class="white-card-content-block margin-top-20">
      <div class="block-inner-title">合同附件</div>
      <div class="file-download-wrapper-capsule">
        <span style="font-size: 24px; margin-right: 12px;">📄</span>
        <div class="file-metadata-info-flex">
          <span class="file-main-name">Hermes-Agent-从入门到精通-v260407.pdf</span>
          <span class="file-sub-info">7.23 MB · 张海洋 · 上传于 2026-05-29 14:36:14</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentContractInfo = ref<any>({})

onMounted(() => {
  if (route.query && Object.keys(route.query).length > 0) {
    currentContractInfo.value = { ...route.query }
  } else {
    currentContractInfo.value = { id: 'HT20260529001', name: '阿里合同', provider: '健康云' }
  }
})
</script>

<style scoped>
.standalone-contract-detail-container { width: 100%; display: flex; flex-direction: column; }
.finance-detail-navigation-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.back-arrow-clickable-btn { font-size: 14px; color: #4E5969; cursor: pointer; background: #e5e6eb; padding: 4px 10px; border-radius: 4px; }
.contract-headline-title { font-size: 16px; font-weight: 600; color: #1D2129; }
.status-badge-fulfillment { background-color: #E8F3FF; color: #1677FF; font-size: 12px; padding: 2px 8px; border-radius: 2px; font-weight: 500; }
.contract-metadata-infobar-panel { background-color: #F2F6FC; border-radius: 4px; padding: 14px 20px; display: flex; flex-wrap: wrap; gap: 16px 40px; border: 1px solid #E5E6EB; }
.meta-cell-item { font-size: 13px; display: flex; align-items: center; }
.meta-cell-item .lbl { color: #86909C; }
.meta-cell-item .val { color: #1D2129; }
.contract-tabs-navigation-strip { display: flex; gap: 32px; border-bottom: 1px solid #E5E6EB; margin-top: 20px; padding-left: 4px; }
.strip-item { font-size: 14px; color: #4E5969; padding-bottom: 10px; cursor: pointer; position: relative; }
.strip-item.active { color: #1677FF; font-weight: 500; }
.strip-item.active::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background-color: #1677FF; }
.white-card-content-block { background-color: #ffffff; border-radius: 4px; padding: 20px; border: 1px solid #E5E6EB; }
.margin-top-20 { margin-top: 20px; }
.block-inner-title { font-size: 14px; font-weight: 600; color: #1D2129; margin-bottom: 20px; }
.quad-grid-properties-layout { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px 32px; }
.grid-cell { display: flex; flex-direction: column; gap: 6px; font-size: 13px; }
.grid-cell .p-lbl { color: #86909C; }
.grid-cell .p-val { color: #1D2129; font-weight: 400; }
.placeholder-null-text { font-size: 13px; color: #86909C; }
.file-download-wrapper-capsule { display: flex; align-items: center; background-color: #FAFAFA; border: 1px solid #E5E6EB; border-radius: 4px; padding: 12px 16px; gap: 16px; max-width: 600px; }
.file-metadata-info-flex { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.file-main-name { font-size: 14px; color: #1D2129; font-weight: 500; }
.file-sub-info { font-size: 12px; color: #86909C; }
.font-mono { font-family: monospace; }
</style>