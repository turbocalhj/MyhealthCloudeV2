<template>
  <div class="banner-container">
    <div class="banner-background">
      <img src="@/views/home/images/Banner图.png" alt="Banner图" class="banner-image" />
    </div>
    <div class="banner-content">
      <div class="banner-subtitle">算力普惠民生 · 智算赋能产业</div>
      <h1 class="banner-title">一体化算力服务平台</h1>
      <p class="banner-desc">为全行业提供高性能算力、AI模型 service 及配套解决方案</p>
    </div>
  </div>

  <div class="carousel-section">
    <SeamlessScroll />
  </div>

  <div class="product-section">
    <div class="section-header">
      <h2 class="section-title">算力产品</h2>
      <p class="section-desc">为不同场景提供专业的算力解决方案</p>
    </div>

    <div class="product-window-wrapper">
      <div class="product-track" :style="trackTransform">
        
        <el-card v-for="product in products" :key="product.id" class="product-card" shadow="hover">
          <div class="card-tag">
            {{ product.marketTag }}
          </div>
          
          <div class="card-header">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-labels">
              <span v-for="(label, lIdx) in product.labels" :key="lIdx" class="label">
                {{ label }}
              </span>
            </div>
          </div>

          <div class="specs-matrix">
            <div class="spec-item">
              <span class="spec-label">显卡型号</span>
              <span class="spec-value">{{ product.gpuType }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">显卡数量</span>
              <span class="spec-value">{{ product.gpuCount }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">显存容量</span>
              <span class="spec-value">{{ product.memory }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">CPU</span>
              <span class="spec-value">{{ product.cpu }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">内存</span>
              <span class="spec-value">{{ product.ram }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">系统盘</span>
              <span class="spec-value">{{ product.disk }}</span>
            </div>
          </div>

          <div class="product-price-row">
            <div class="product-price">
              <span class="price-symbol">¥</span>
              <span class="price-value">{{ product.price.toLocaleString() }}</span>
              <span class="price-unit">/月</span>
            </div>
          </div>

          <div class="card-actions">
            <template v-if="!product.isOutOfStock">
              <el-button size="small" class="add-cart-btn">加入购物车</el-button>
              <el-button type="primary" size="small" class="buy-now-btn">立即购买</el-button>
            </template>
            <template v-else>
              <el-button size="small" class="stockout-btn" disabled>暂无库存</el-button>
              <el-button type="primary" size="small" class="demand-btn">需求登记</el-button>
            </template>
          </div>
        </el-card>

      </div>
    </div>

    <div class="pagination-dots">
      <span 
        v-for="page in 3" 
        :key="page" 
        class="dot" 
        :class="{ active: currentPage === page }"
        @click="currentPage = page"
      ></span>
    </div>

    <div class="view-all-link">
      <span>查看全部产品</span>
    </div>
  </div>

  <div 
    class="provider-section" 
    ref="providerSectionRef"
    :class="{ 'animate-start': isProviderVisible }"
  >
    <h2 class="provider-main-title">供给方入驻</h2>
    
    <div class="provider-content">
      <div class="provider-left-card">
        <h3 class="provider-card-sub-title">供给方入驻</h3>
        
        <div class="provider-timeline-wrapper">
          
          <div class="timeline-node-item node-1">
            <span class="item-blue-dot"></span>
            <div class="dashed-segment line-1"></div>
            <div class="item-text-content">
              <h4>供给方入驻</h4>
              <p>接入平台统一调度系统，提升资源利用率</p>
            </div>
          </div>
          
          <div class="timeline-node-item node-2">
            <span class="item-blue-dot"></span>
            <div class="dashed-segment line-2"></div>
            <div class="item-text-content">
              <h4>资源变现</h4>
              <p>闲置算力快速变现，增加营收渠道</p>
            </div>
          </div>
          
          <div class="timeline-node-item node-3">
            <span class="item-blue-dot"></span>
            <div class="dashed-segment line-3"></div>
            <div class="item-text-content">
              <h4>技术支持</h4>
              <p>提供完善的技术对接和运维支持</p>
            </div>
          </div>
          
          <div class="timeline-node-item node-4">
            <span class="item-blue-dot"></span>
            <div class="item-text-content">
              <h4>市场推广</h4>
              <p>平台流量扶持，快速获取客户</p>
            </div>
          </div>

        </div>
      </div>
      
      <div class="provider-visual">
        <img 
          src="@/views/home/images/供给方入驻.png" 
          alt="供给方入驻" 
          class="provider-main-img" 
        />
      </div>
    </div>
  </div>

  <div class="policy-section">
    <div class="section-header">
      <h2 class="section-title">政策专区</h2>
      <p class="section-desc">了解最新的算力政策与行业规范，获取优惠补贴信息</p>
    </div>
    <div class="policy-content">
      <div class="policy-main">
        <div class="policy-image">
          <img src="https://neeko-copilot.bytedance.net/api/text2image?prompt=GPU%20chip%20technology%20blue%20futuristic%20circuit%20board%20background&width=600&height=300" alt="政策配图">
        </div>
        <h3 class="policy-title">关于组织开展2025年人工智能券（算力券）兑付申报的通知</h3>
        <p class="policy-desc">各有关单位：根据国家相关通知要求，现面向全省开展2025年国家人工智能服务（算力券）兑付申报工作。现将有关事项通知如下：一、人工智能券（算力券）是国家使用超长期特别国债资金，试点推动形成人...</p>
        <div class="policy-meta">
          <span class="meta-item">发布单位：浙江省发展和改革委员会</span>
          <span class="meta-item">2025-05-16</span>
        </div>
      </div>
      <div class="policy-list">
        <el-card v-for="policy in policies" :key="policy.id" class="policy-card">
          <h4 class="policy-item-title">{{ policy.title }}</h4>
          <p class="policy-item-desc">{{ policy.desc }}</p>
          <div class="policy-item-meta">
            <span class="meta-item">发布单位：{{ policy.source }}</span>
            <span class="meta-item">{{ policy.date }}</span>
          </div>
          <span class="policy-link">了解详情 →</span>
        </el-card>
      </div>
    </div>
    <div class="view-all-link">
      <span>查看更多</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SeamlessScroll from '@/components/SeamlessScroll.vue'

interface ComputingProduct {
  id: number
  name: string
  marketTag: string     
  labels: string[]
  gpuType: string
  gpuCount: string
  memory: string
  cpu: string
  ram: string
  disk: string
  price: number
  isOutOfStock?: boolean 
}

const products = ref<ComputingProduct[]>([
  { id: 1, name: '联通裸金属新', marketTag: '市场算力', labels: ['自营算力', '萧山区', '资源充足'], gpuType: 'Huawei Atlas 300', gpuCount: '2 卡', memory: '64 GB', cpu: '128 核', ram: '512 GB', disk: '50 GB', price: 45689 },
  { id: 2, name: '联通裸金属GPU', marketTag: '市场算力', labels: ['自营算力', '拱墅区', '资源充足'], gpuType: 'Huawei Atlas 300', gpuCount: '1 卡', memory: '32 GB', cpu: '128 核', ram: '512 GB', disk: '50 GB', price: 343543 },
  { id: 3, name: '裸金属 昇腾 910B2-64GB', marketTag: '市场算力', labels: ['移动', '萧山区', '资源充足', '算力补贴30%'], gpuType: 'Huawei Ascend 910B2', gpuCount: '8 卡', memory: '64 GB', cpu: '192 核', ram: '2048 GB', disk: '960 GB', price: 60000 },
  { id: 4, name: '裸金属 英伟达T4-16G', marketTag: '市场算力', labels: ['移动', '萧山区', '资源充足', '算力补贴30%'], gpuType: 'NVIDIA T4', gpuCount: '8 卡', memory: '16 GB', cpu: '48 核', ram: '768 GB', disk: '960 GB', price: 16000 },
  { id: 5, name: 'NVIDIA V100S', marketTag: '自营算力', labels: ['自营算力', '萧山区', '资源充足', '算力补贴20%'], gpuType: '-', gpuCount: '-', memory: '-', cpu: '-', ram: '-', disk: '-', price: 4560 },
  { id: 6, name: '裸金属 昇腾 910B4-64GB', marketTag: '自营算力', labels: ['自营算力', '推理', '拱墅区', '暂无库存'], gpuType: 'Huawei Ascend 910B4', gpuCount: '8 卡', memory: '64 GB', cpu: '192 核', ram: '1024 GB', disk: '-', price: 28478, isOutOfStock: true },
  { id: 7, name: '裸金属 昆仑芯 P800-96GB', marketTag: '自营算力', labels: ['自营算力', '推理', '拱墅区', '暂无库存'], gpuType: 'KUNLUNXIN GPU-P800', gpuCount: '8 卡', memory: '96 GB', cpu: '128 核', ram: '1536 GB', disk: '446 GB', price: 29425, isOutOfStock: true },
  { id: 8, name: '裸金属 英伟达 V100S-32GB', marketTag: '市场算力', labels: ['移动', '萧山区', '暂无库存', '算力补贴30%'], gpuType: 'NVIDIA V100S', gpuCount: '8 卡', memory: '32 GB', cpu: '48 核', ram: '768 GB', disk: '960 GB', price: 28000, isOutOfStock: true }
])

const currentPage = ref(1)

const trackTransform = computed(() => {
  let distance = 0
  if (currentPage.value === 1) {
    distance = 0                          
  } else if (currentPage.value === 2) {
    distance = -1626                       
  } else {
    distance = -1626 * 2                   
  }
  return {
    transform: `translate3d(${distance}px, 0, 0)`
  }
})

// 供给方入驻：相交检测
const providerSectionRef = ref<HTMLElement | null>(null)
const isProviderVisible = ref(false)
let providerObserver: IntersectionObserver | null = null

onMounted(() => {
  providerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isProviderVisible.value = true 
      }
    })
  }, {
    threshold: 0.1 
  })

  if (providerSectionRef.value) {
    providerObserver.observe(providerSectionRef.value)
  }
})

onUnmounted(() => {
  if (providerObserver) {
    providerObserver.disconnect()
  }
})

interface Policy {
  id: number
  title: string
  desc: string
  source: string
  date: string
}

const policies = ref<Policy[]>([
  { id: 1, title: '浙江省人民政府印发关于支持人工智能创新发展...', desc: '为抢占人工智能发展制高点，打造全球人工智能创新发展高地，提出如下措施。一、发展目标 坚持创新驱动...', source: '浙江省人民政府', date: '2025-05-26' },
  { id: 2, title: '杭州市经济信息局（市数字经济局）关于组织开展...', desc: '各区、县（市）经信局（发改经信局、经济科技局）：根据《杭州市人民政府办公厅关于加快推进人工智能产...', source: '杭州市经济和信息化局', date: '2025-03-28' },
  { id: 3, title: '杭州市人民政府办公厅关于印发支持人工智能...', desc: '为抢抓人工智能新一轮发展机遇，积极实施"人工智能+"行动，推动杭州人工智能产业全产业链高质量发展...', source: '杭州市人民政府办公厅', date: '2024-07-23' }
])
</script>

<style scoped>
/* ==========================================================================
   模块 1：顶部大 Banner 区域样式（完好保护）
   ========================================================================== */
.banner-container {
  position: relative;
  height: calc(100vh - 60px);
  min-height: 500px;
  overflow: hidden;
}

.banner-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}

.banner-subtitle {
  font-size: 17px;
  color: #0066cc;
  letter-spacing: 2px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.banner-subtitle::before,
.banner-subtitle::after {
  content: '';
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #0066cc, transparent);
}

.banner-content h1.banner-title {
  font-family: BHTitleFont, sans-serif;
  font-weight: 800;
  font-size: 70px !important;
  background: linear-gradient(180deg, #52adff, #1d75ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 30px rgba(37, 140, 255, .18);
  margin-top: 8px;
  margin-bottom: 50px;
  line-height: 1.1;
  letter-spacing: 4px;
}

.banner-desc {
  font-size: 15px;
  color: #666;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

/* ==========================================================================
   模块 2：通栏跑马灯通知条
   ========================================================================== */
.carousel-section {
  background-color: #f0f7ff; 
  margin: 10px auto;         
  width: 1600px; 
  padding: 10px 40px;        
  display: flex;
  align-items: center;
  box-sizing: border-box;    
  border-radius: 8px;        
}

.carousel-section :deep(.seamless-scroll-container) {
  background-color: transparent !important;
  box-shadow: none !important;
  padding: 0;
}

/* ==========================================================================
   模块 3：算力产品主功能区块样式（完好保留）
   ========================================================================== */
.product-section {
  padding-top: 60px;
  padding-bottom: 60px;
  background-color: #ffffff;
  width: 1600px; 
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  color: #333333;
  margin-bottom: 10px;
}

.section-desc {
  font-size: 1rem;
  color: #666666;
}

.product-window-wrapper {
  width: 100%;
  overflow: hidden;
  min-height: 465px;
  padding-top: 4px; 
}

.product-track {
  display: flex;
  justify-content: flex-start;
  gap: 26px;
  width: max-content; 
  transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1); 
  will-change: transform; 
}

.product-card {
  position: relative;
  width: 516px;
  height: 455px;
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #eef2f6;
  box-sizing: border-box;
  flex-shrink: 0; 
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.product-card :deep(.el-card__body) {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: #e0e5eb;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.02) !important;
}

.card-tag {
  position: absolute;
  top: 0;
  right: 24px;
  background-color: #ff4d4f;
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 0 0 6px 6px;
  z-index: 5;
}

.card-header {
  padding-top: 30px;
  padding-bottom: 16px;
  padding-left: 24px;
  padding-right: 24px;
}

.product-name {
  font-size: 20px;
  font-weight: bold;
  color: #222222;
  margin-top: 0;
  margin-bottom: 14px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.product-name:hover {
  color: #1677FF; 
}

.product-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.label {
  font-size: 12px;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 4px;
  font-weight: 500;
}

.product-labels .label:nth-child(1) { color: #0091ff; background-color: #e6f4ff; }
.product-labels .label:nth-child(2) { color: #3366ff; background-color: #eef2ff; }
.product-labels .label:nth-child(3) { color: #00b365; background-color: #e6f9f0; }
.product-labels .label:nth-child(4) { color: #ff6600; background-color: #fff2e6; }

.specs-matrix {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 32px;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 24px;
  padding-right: 24px;
  background-color: #fafbfc;
  border-top: 1px solid #eef2f6;
  border-bottom: 1px solid #eef2f6;
}

.spec-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.spec-label { color: #8c8c8c; }
.spec-value { color: #262626; font-weight: 500; }

.product-price-row {
  padding-top: 16px;
  padding-bottom: 12px;
  padding-left: 24px;
  padding-right: 24px;
}

.product-price {
  display: flex;
  align-items: baseline;
}

.price-symbol { font-size: 1.1rem; color: #ff9900; font-weight: bold; }
.price-value { font-size: 1.8rem; color: #ff9900; font-weight: bold; margin-left: 4px; margin-right: 4px; }
.price-unit { font-size: 0.85rem; color: #8c8c8c; }

.card-actions {
  display: flex;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
  margin-top: auto;
}

.add-cart-btn {
  width: 177px !important;
  height: 46px !important;
  background: #FFFFFF !important;
  border-radius: 6px !important;
  border: 1px solid #1677FF !important;
  color: #1677FF !important;
  font-size: 14px;
  font-weight: 500;
  padding: 0;
  transition: all 0.2s ease;
}

.add-cart-btn:hover {
  background: #FFFFFF !important; 
  border-width: 1.5px !important; 
  border-color: #afafaf !important;  
  color: #000000 !important;         
  box-shadow: none !important;
}

.stockout-btn {
  width: 177px !important;
  height: 46px !important;
  background: #f5f5f5 !important;
  border-radius: 6px !important;
  border: 1px solid #d9d9d9 !important;
  color: #bfbfbf !important;
  font-size: 14px;
  cursor: not-allowed !important;
}

.buy-now-btn {
  width: 258px !important;
  height: 46px !important;
  background: #1677FF !important;
  border: 1px solid #1677FF !important;
  border-radius: 6px !important;
  color: #FFFFFF !important;
  font-size: 14px;
  font-weight: 500;
  padding: 0;
  transition: all 0.25s ease;
}

.buy-now-btn:hover {
  background: #4693ff !important;
  border-color: #4693ff !important;
}

.demand-btn {
  width: 258px !important;
  height: 46px !important;
  background: #1677FF !important;
  border: 1px solid #1677FF !important;
  color: #FFFFFF !important;
  border-radius: 6px !important;
  font-size: 14px;
  font-weight: 500;
  padding: 0;
  transition: all 0.25s ease;
}

.demand-btn:hover {
  background: #4693ff !important;
  border-color: #4693ff !important;
}

.pagination-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 35px;
  margin-bottom: 15px;
}

.pagination-dots .dot {
  width: 10px;
  height: 10px;
  background-color: #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-dots .dot.active {
  width: 30px;
  height: 10px;
  background-color: #1677FF;
  border-radius: 5px;
}

.view-all-link {
  text-align: center;
  margin-top: 25px;
}

.view-all-link span {
  color: #1677FF;
  font-size: 14px;
  cursor: pointer;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 8px;
  padding-right: 8px;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

/* ==========================================================================
   🚀 模块 4：供给方入驻高保真升级版（完美还原级联交错小球和向下延伸虚线连接）
   ========================================================================== */
.provider-section {
  padding-top: 0;
  padding-bottom: 60px; 
  background-color: #ffffff;
  width: 1600px; 
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

.provider-main-title {
  font-size: 2rem;
  color: #222222;
  font-weight: bold;
  text-align: center;
  margin-top: 0;
  margin-bottom: 60px; 
}

.provider-content {
  width: 100%;
  display: flex;
  align-items: center;  
  justify-content: center; 
  box-sizing: border-box;
}

/* 👈 左侧列表聚合面板（固定宽 704px） */
.provider-left-card {
  width: 704px; 
  padding-top: 36px; 
  padding-bottom: 36px; 
  padding-left: 180px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.provider-card-sub-title {
  font-size: 1.5rem;
  color: #111111;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 24px;
}

/* 🚀 核心新增：纯流式语义化时间轴跑道，彻底封锁原本的内边距堆叠错位 */
.provider-timeline-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
}

/* 🚀 每个时间轴节点的包裹外盒容器 */
.timeline-node-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 100%;
}

/* 🚀 独立截断虚线段：通过高度延时增长，完美落实“第2个出现后，第1个与第2个用虚线连接”的时序链 */
.dashed-segment {
  position: absolute;
  top: 24px; /* 从上一个球心的底部切面开始向下挂载 */
  left: 3.5px; /* 绝对对齐小球几何中心线（7px/2） */
  width: 1px;
  height: 0; /* 🚀 默认隐藏：高度为0 */
  border-left: 1px dashed #1677FF; /* 采用高精准品牌蓝色虚线 */
  opacity: 0;
  z-index: 1;
  transform-origin: top center;
  transition: height 0.45s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: height, opacity;
}

/* 🚀 精巧计算的小球：默认透明且缩放为 0，等待级联命令进行弹出 */
.item-blue-dot {
  position: relative;
  width: 7px;
  height: 7px;
  background-color: #1677FF;
  border-radius: 50%;
  margin-top: 21px; /* 完美居中对齐首行 24px 标题的轴线 */
  flex-shrink: 0;
  z-index: 5;
  opacity: 0;
  transform: scale(0); /* 🚀 默认缩放为0，实现极具质感的弹性弹出效果 */
  transition: opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: opacity, transform;
}

/* 🚀 文本条目骨架：默认透明，且带有向右 24px 的微调滑行滑轨，等待与小球同步出现 */
.item-text-content {
  flex: 1;
  padding-top: 14px;
  padding-bottom: 14px;
  padding-left: 24px; /* 精确留出距离左侧时间轴的间隙呼吸 */
  border-bottom: 1px dashed #f0f3f6;
  opacity: 0;
  transform: translate3d(24px, 0, 0); /* 🚀 向右偏移，等小球弹出时带着一起滑出 */
  transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1),
              transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: opacity, transform;
}

/* 🚀 最后一个节点的下划线处理，防止多出一截虚线线段 */
.timeline-node-item:last-child .item-text-content {
  border-bottom: none;
}

/* ==========================================================================
   🚀 时间轴级联时序控制（严格对齐用户：弹出时，球带内容出现；随后虚线向下增长连接）
   ========================================================================== */

/* --- 阶段一：第一组节点闪亮登场 --- */
.animate-start .node-1 .item-blue-dot {
  opacity: 1;
  transform: scale(1);
  transition-delay: 0.1s; /* 🚀 1. 节点一小球弹出 */
}
.animate-start .node-1 .item-text-content {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  transition-delay: 0.15s; /* 🚀 2. 节点一内容随后带着出现 */
}

/* --- 阶段二：虚线 1 向下延伸，连接并激活第二组节点 --- */
.animate-start .node-1 .line-1 {
  opacity: 1;
  height: 64px; /* 🚀 3. 虚线1向下生长延伸 */
  transition-delay: 0.45s; 
}
.animate-start .node-2 .item-blue-dot {
  opacity: 1;
  transform: scale(1);
  transition-delay: 0.75s; /* 🚀 4. 虚线触及后，节点二小球弹出 */
}
.animate-start .node-2 .item-text-content {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  transition-delay: 0.8s; /* 🚀 5. 节点二内容带着出现 */
}

/* --- 阶段三：虚线 2 向下延伸，连接并激活第三组节点 --- */
.animate-start .node-2 .line-2 {
  opacity: 1;
  height: 64px;
  transition-delay: 1.1s; /* 🚀 6. 虚线2向下生长 */
}
.animate-start .node-3 .item-blue-dot {
  opacity: 1;
  transform: scale(1);
  transition-delay: 1.4s; /* 🚀 7. 节点三小球弹出 */
}
.animate-start .node-3 .item-text-content {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  transition-delay: 1.45s; /* 🚀 8. 节点三内容带着出现 */
}

/* --- 阶段四：虚线 3 向下延伸，最终连接完成第四组节点 --- */
.animate-start .node-3 .line-3 {
  opacity: 1;
  height: 64px;
  transition-delay: 1.75s; /* 🚀 9. 虚线3向下生长 */
}
.animate-start .node-4 .item-blue-dot {
  opacity: 1;
  transform: scale(1);
  transition-delay: 2.05s; /* 🚀 10. 最后一个小球完美弹出 */
}
.animate-start .node-4 .item-text-content {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  transition-delay: 2.1s; /* 🚀 11. 最后一个条目带着出现 */
}

/* 条目文本细节纵向展开写法 */
.item-text-content h4 {
  margin-top: 0;
  margin-bottom: 6px;
  color: #1a1a1a;
  font-size: 1.1rem;
  font-weight: 600;
}

.item-text-content p {
  margin: 0;
  color: #666666;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* 👉 右侧大图视觉区保持平衡居中 */
.provider-visual {
  display: flex;
  align-items: center;
  margin-left: 125px; 
  margin-right: 125px;
  box-sizing: border-box;
}

.provider-main-img {
  width: 958.5px; 
  height: 558px; 
  object-fit: cover;
  border-radius: 8px; 
}

/* ==========================================================================
   模块 5：政策专区样式（完好保护）
   ========================================================================== */
.policy-section { 
  padding-top: 60px;
  padding-bottom: 60px;
  padding-left: 40px;
  padding-right: 40px;
  background-color: #f0f7ff; 
}

.policy-content { 
  max-width: 1400px; 
  margin: 0 auto; 
  display: flex; 
  gap: 30px; 
}

.policy-main { 
  flex: 2; 
  background-color: white; 
  border-radius: 12px; 
  overflow: hidden; 
}

.policy-image { 
  width: 100%; 
  height: 200px; 
  overflow: hidden; 
}

.policy-image img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}

.policy-main h3 { 
  padding-top: 20px;
  padding-bottom: 10px;
  padding-left: 24px;
  padding-right: 24px;
  margin: 0; 
  font-size: 1.2rem; 
  color: #333; 
}

.policy-desc { 
  padding-top: 0;
  padding-bottom: 15px;
  padding-left: 24px;
  padding-right: 24px;
  margin: 0; 
  font-size: 0.9rem; 
  color: #666; 
  line-height: 1.6; 
  display: -webkit-box; 
  -webkit-line-clamp: 3; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}

.policy-meta { 
  padding-top: 15px;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  border-top: 1px solid #f0f0f0; 
  display: flex; 
  justify-content: space-between; 
}

.policy-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.policy-card {
  padding: 20px;
  border-radius: 12px;
}

.policy-item-title { 
  margin: 0 0 10px 0; 
  font-size: 0.95rem; 
  color: #333; 
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}

.policy-item-desc { 
  margin: 0 0 12px 0; 
  font-size: 0.85rem; 
  color: #999; 
  line-height: 1.5; 
  display: -webkit-box; 
  -webkit-line-clamp: 3; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}

.policy-item-meta { 
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 12px; 
}

.policy-link { 
  font-size: 0.85rem; 
  color: #409eff; 
  cursor: pointer; 
}
</style>