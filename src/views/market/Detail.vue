<template>
  <!-- 商品详情模块：展示算力资源完整信息 -->
  <div class="product-detail-page">
    <div class="detail-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/main/market' }">智算超市</el-breadcrumb-item>
        <el-breadcrumb-item>商品详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div v-if="loading" class="loading-box">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <p>正在加载商品信息...</p>
    </div>

    <div v-else-if="!product" class="not-found-box">
      <el-empty description="未找到该商品" />
      <el-button type="primary" @click="router.push('/main/market')">返回智算超市</el-button>
    </div>

    <div v-else class="detail-content">
      <!-- 基本信息卡片 -->
      <el-card class="info-card">
        <div class="product-header">
          <div class="product-tag">{{ product.marketTag }}</div>
          <h1 class="product-title">{{ product.name }}</h1>
          <div class="product-labels">
            <span v-for="(label, idx) in product.labels" :key="idx" class="label-tag">{{ label }}</span>
          </div>
        </div>

        <div class="product-price-section">
          <div class="price-display">
            <span class="price-symbol">¥</span>
            <span class="price-number">{{ product.price.toLocaleString() }}</span>
            <span class="price-unit">{{ product.priceUnit }}</span>
          </div>
          <div v-if="product.metaSubsidy !== '无补贴'" class="subsidy-badge">
            算力补贴 {{ product.metaSubsidy }}
          </div>
        </div>
      </el-card>

      <!-- 配置详情卡片 -->
      <el-card class="info-card">
        <h3 class="card-title">配置详情</h3>
        <div class="specs-table">
          <div class="spec-row">
            <span class="spec-label">显卡型号</span>
            <span class="spec-value">{{ product.gpuType }}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">显卡数量</span>
            <span class="spec-value">{{ product.gpuCount }}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">显存容量</span>
            <span class="spec-value">{{ product.memory }}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">CPU</span>
            <span class="spec-value">{{ product.cpu }}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">内存</span>
            <span class="spec-value">{{ product.ram }}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">系统盘</span>
            <span class="spec-value">{{ product.disk }}</span>
          </div>
        </div>
      </el-card>

      <!-- 供给方信息卡片 -->
      <el-card class="info-card">
        <h3 class="card-title">供给方信息</h3>
        <div class="provider-info">
          <div class="info-item">
            <span class="info-label">来源类型</span>
            <span class="info-value">{{ product.metaSourceType }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">供给方</span>
            <span class="info-value">{{ product.metaSubSource }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">所在地</span>
            <span class="info-value">{{ product.metaProvince }} {{ product.metaCity }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">GPU品牌</span>
            <span class="info-value">{{ product.metaGpuBrand }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">显卡数量</span>
            <span class="info-value">{{ product.metaGpuCount }}</span>
          </div>
        </div>
      </el-card>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <el-button 
          size="large" 
          class="add-cart-btn" 
          :loading="btnLoading" 
          @click="handleAddToCart"
        >
          <el-icon><ShoppingCart /></el-icon>
          加入购物车
        </el-button>
        <el-button 
          type="primary" 
          size="large" 
          class="buy-now-btn" 
          :loading="btnLoading" 
          @click="handleBuyNow"
        >
          立即购买
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading, ShoppingCart } from '@element-plus/icons-vue'
import { useCartStore } from '@/store/modules/cart'
import { fetchMarketProducts } from '@/api/market'
import type { ComputingProduct } from '@/types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref<ComputingProduct | null>(null)
const loading = ref(true)
const btnLoading = ref(false)

onMounted(async () => {
  try {
    const products = await fetchMarketProducts()
    const id = Number(route.query.id)
    product.value = products.find(p => p.id === id) || null
  } catch {
    ElMessage.error('加载商品信息失败')
  } finally {
    loading.value = false
  }
})

const handleAddToCart = () => {
  if (!product.value) return
  btnLoading.value = true
  
  setTimeout(() => {
    if (cartStore.addCartItem(product.value!)) {
      ElMessage.success('成功加入购物车！')
    }
    btnLoading.value = false
  }, 400)
}

const handleBuyNow = () => {
  if (!product.value) return
  btnLoading.value = true
  
  setTimeout(() => {
    cartStore.addCartItem(product.value!)
    cartStore.openCartDrawer()
    btnLoading.value = false
  }, 400)
}
</script>

<style scoped>
.product-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.detail-breadcrumb {
  margin-bottom: 24px;
}

.loading-box, .not-found-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 16px;
  color: #909399;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  border-radius: 8px;
}

.product-header {
  margin-bottom: 24px;
}

.product-tag {
  display: inline-block;
  background: var(--pc-bg-tag-blue);
  color: var(--pc-brand-primary);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 12px;
}

.product-title {
  font-size: 24px;
  font-weight: 600;
  color: #222;
  margin: 0 0 16px 0;
}

.product-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.label-tag {
  background: #f5f7fa;
  color: #606266;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.product-price-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid #f0f0f0;
}

.price-display {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 20px;
  color: var(--pc-brand-warning);
  font-weight: 600;
}

.price-number {
  font-size: 36px;
  color: var(--pc-brand-warning);
  font-weight: 700;
}

.price-unit {
  font-size: 14px;
  color: #909399;
  margin-left: 4px;
}

.subsidy-badge {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.specs-table {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
}

.spec-label {
  color: #909399;
  font-size: 14px;
}

.spec-value {
  color: #303133;
  font-weight: 500;
  font-size: 14px;
}

.provider-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-label {
  color: #909399;
  font-size: 14px;
}

.info-value {
  color: #303133;
  font-weight: 500;
}

.action-bar {
  display: flex;
  gap: 16px;
  padding: 24px 0;
}

.add-cart-btn, .buy-now-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
}
</style>
