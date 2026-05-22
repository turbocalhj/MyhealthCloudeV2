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
      <div class="policy-hover-card policy-main-hero" @click="handlePolicyLink(1)">
        <div class="policy-image-box">
          <img 
            src="@/views/home/images/位图.png" 
            alt="政策主图" 
            class="hero-img"
          />
        </div>
        
        <div class="hero-card-body">
          <h3 class="policy-card-title">关于组织开展2025年人工智能券（算力券）兑付申报的通知</h3>
          <p class="policy-desc">各有关单位：根据国家相关通知要求，现面向全省开展2025年国家人工智能服务（算力券）兑付申报工作。现将有关事项通知如下：一、人工智能券（算力券）是国家使用超长期特别国债资金，试点推动形成人...</p>
          <div class="policy-meta-row">
            <span class="meta-source">发布单位：浙江省发展和改革委员会</span>
            <span class="meta-date">2025-05-16</span>
          </div>
        </div>
      </div>

      <div class="policy-grid-box">
        <div 
          v-for="policy in policies" 
          :key="policy.id" 
          class="policy-hover-card policy-sub-grid-item"
          @click="handlePolicyLink(policy.id)"
        >
          <h4 class="policy-card-title">{{ policy.title }}</h4>
          <p class="policy-grid-desc">{{ policy.desc }}</p>
          
          <div class="grid-item-footer">
            <div class="policy-meta-row">
              <span class="meta-source">发布单位：{{ policy.source }}</span>
              <span class="meta-date">{{ policy.date }}</span>
            </div>
            <span class="details-link-arrow">了解详情 →</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="view-all-link">
      <span>查看更多</span>
    </div>
  </div>

  <footer class="global-platform-footer">
    <div class="footer-main-content">
      
      <div class="footer-column column-left">
        <h2 class="footer-brand-title">算力调度运营平台</h2>
      </div>

      <div class="footer-column column-center">
        <h3 class="footer-column-title">基本信息</h3>
        <ul class="footer-info-list">
          <li>
            <span class="info-label">联系邮箱：</span>
            <span class="info-value">service@cs-xxxxxxxxxx-platform.com</span>
          </li>
          <li>
            <span class="info-label">联系地址：</span>
            <span class="info-value">XX省XX市XX区智慧科创园区A栋商务中心</span>
          </li>
        </ul>
      </div>

      <div class="footer-column column-right">
        <h3 class="footer-column-title">联系我们</h3>
        <el-button type="primary" class="footer-consult-btn">
          立即咨询
        </el-button>
      </div>

    </div>

    <div class="footer-divider-line"></div>

    <div class="footer-bottom-bar">
      <p class="icp-record-text">ICP备案编号：浙ICP备2024132127-3号</p>
      <p class="copyright-text">国家人工智能应用中试基地(医疗)-浙江版权所有 技术支持:国家人工智能应用中试基地(医疗)-浙江</p>
    </div>
  </footer>
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

// 供给方入驻检测
const providerSectionRef = ref<HTMLElement | null>(null)
const isProviderVisible = ref(false)
let providerObserver: IntersectionObserver | null = null

// 🚀 核心强效动态吸顶机制：挂载时强制抓取顶层 Header 节点并强行注入 CSS
onMounted(() => {
  // 兼容抓取大厂通用的顶置布局容器（el-header 或带有头部标识的 div）
  const globalHeader = document.querySelector('.el-header') || document.querySelector('header') || document.querySelector('.header-container')
  if (globalHeader) {
    const headerStyle = (globalHeader as HTMLElement).style
    headerStyle.position = 'fixed'
    headerStyle.top = '0'
    headerStyle.left = '0'
    headerStyle.width = '100%'
    headerStyle.zIndex = '9999'
    headerStyle.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.05)'
    headerStyle.backgroundColor = '#ffffff'
  }

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

// 🚀 销毁时优雅解除，防止对项目的系统设置产生副作用污染
onUnmounted(() => {
  if (providerObserver) {
    providerObserver.disconnect()
  }
  const globalHeader = document.querySelector('.el-header') || document.querySelector('header') || document.querySelector('.header-container')
  if (globalHeader) {
    const headerStyle = (globalHeader as HTMLElement).style
    headerStyle.position = ''
    headerStyle.top = ''
    headerStyle.left = ''
    headerStyle.width = ''
    headerStyle.zIndex = ''
    headerStyle.boxShadow = ''
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
  { id: 2, title: '浙江省人民政府印发关于支持人工智能创新发展...', desc: '为抢占人工智能发展制高点，打造全球人工智能创新发展高地，提出如下措施。一、发展目标 坚持创新驱动发展战略...', source: '浙江省人民政府', date: '2025-05-26' },
  { id: 3, title: '杭州市经济信息局（市数字经济局）关于组织开展...', desc: '各区、县（市）经信局（发改经信局、经济科技局）：根据《杭州市人民政府办公厅关于加快推进人工智能产业高质量发展的通知》...', source: '杭州市经济和信息化局', date: '2025-03-28' },
  { id: 4, title: '杭州市人民政府办公厅关于印发支持人工智能...', desc: '为抢抓人工智能新一轮发展机遇，积极实施"人工智能+"行动，推动杭州人工智能产业全产业链高质量发展特此...', source: '杭州市人民政府办公厅', date: '2024-07-23' }
])

const handlePolicyLink = (id: number) => {
  console.log('正在准备去往外部站点，政策条目ID:', id)
}
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
  margin-top: 60px; /* 🚀 为固定的吸顶导航栏精准腾出上外边距高度，防止首屏被吞位 */
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
   模块 4：供给方入驻区域样式（完好保护）
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

.provider-timeline-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
}

.timeline-node-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.dashed-segment {
  position: absolute;
  top: 24px; 
  left: 3.5px; 
  width: 1px;
  height: 0; 
  border-left: 1px dashed #1677FF; 
  opacity: 0;
  z-index: 1;
  transform-origin: top center;
  transition: height 0.45s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: height, opacity;
}

.item-blue-dot {
  position: relative;
  width: 7px;
  height: 7px;
  background-color: #1677FF;
  border-radius: 50%;
  margin-top: 21px; 
  flex-shrink: 0;
  z-index: 5;
  opacity: 0;
  transform: scale(0); 
  transition: opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: opacity, transform;
}

.item-text-content {
  flex: 1;
  padding-top: 14px;
  padding-bottom: 14px;
  padding-left: 24px; 
  border-bottom: 1px dashed #f0f3f6;
  opacity: 0;
  transform: translate3d(24px, 0, 0); 
  transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1),
              transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: opacity, transform;
}

.timeline-node-item:last-child .item-text-content {
  border-bottom: none;
}

.animate-start .node-1 .item-blue-dot { opacity: 1; transform: scale(1); transition-delay: 0.1s; }
.animate-start .node-1 .item-text-content { opacity: 1; transform: translate3d(0, 0, 0); transition-delay: 0.15s; }
.animate-start .node-1 .line-1 { opacity: 1; height: 64px; transition-delay: 0.45s; }
.animate-start .node-2 .item-blue-dot { opacity: 1; transform: scale(1); transition-delay: 0.75s; }
.animate-start .node-2 .item-text-content { opacity: 1; transform: translate3d(0, 0, 0); transition-delay: 0.8s; }
.animate-start .node-2 .line-2 { opacity: 1; height: 64px; transition-delay: 1.1s; }
.animate-start .node-3 .item-blue-dot { opacity: 1; transform: scale(1); transition-delay: 1.4s; }
.animate-start .node-3 .item-text-content { opacity: 1; transform: translate3d(0, 0, 0); transition-delay: 1.45s; }
.animate-start .node-3 .line-3 { opacity: 1; height: 64px; transition-delay: 1.75s; }
.animate-start .node-4 .item-blue-dot { opacity: 1; transform: scale(1); transition-delay: 2.05s; }
.animate-start .node-4 .item-text-content { opacity: 1; transform: translate3d(0, 0, 0); transition-delay: 2.1s; }

.item-text-content h4 { margin-top: 0; margin-bottom: 6px; color: #1a1a1a; font-size: 1.1rem; font-weight: 600; }
.item-text-content p { margin: 0; color: #666666; font-size: 0.95rem; line-height: 1.5; }

.provider-visual { display: flex; align-items: center; margin-left: 125px; margin-right: 125px; box-sizing: border-box; }
.provider-main-img { width: 958.5px; height: 558px; object-fit: cover; border-radius: 8px; }

/* ==========================================================================
   模块 5：政策专区样式（完好保护）
   ========================================================================== */
.policy-section { 
  padding-top: 60px;
  padding-bottom: 60px;
  background-color: #f5f8ff; 
}

.policy-content { 
  max-width: 1600px; 
  margin: 0 auto; 
  display: flex; 
  gap: 24px; 
  box-sizing: border-box;
  padding-left: 100px;
  padding-right: 100px;
}

.policy-hover-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef2f6;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
              box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
              border-color 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform, box-shadow;
}

.policy-hover-card:hover {
  transform: translateY(-5px);
  border-color: #e0e5eb;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.01) !important;
}

.policy-hover-card:hover .policy-card-title {
  color: #1677FF;
}

.policy-hover-card:hover img {
  transform: scale(1.025);
}

.policy-main-hero {
  flex: 1.1; 
  display: flex;
  flex-direction: column;
}

.policy-image-box {
  width: 100%;
  height: 340px; 
  overflow: hidden;
  background-color: #f7fafc;
}

.policy-image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform;
}

.hero-card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.policy-card-title {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.25rem;
  font-weight: bold;
  color: #262626;
  line-height: 1.5;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.policy-desc { 
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 0.9rem; 
  color: #666666; 
  line-height: 1.6; 
  display: -webkit-box; 
  -webkit-line-clamp: 3; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}

.policy-meta-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: auto; 
}

.meta-source,
.meta-date {
  font-size: 0.85rem;
  color: #8c8c8c;
}

.policy-grid-box {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 20px; 
}

.policy-sub-grid-item {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.policy-sub-grid-item .policy-card-title {
  font-size: 1.1rem;
  -webkit-line-clamp: 2;
}

.policy-grid-desc {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 0.88rem;
  color: #8c8c8c;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.grid-item-footer {
  margin-top: auto; 
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.grid-item-footer .policy-meta-row {
  flex-direction: column; 
  align-items: flex-start;
  gap: 4px;
}

.details-link-arrow {
  font-size: 0.88rem;
  color: #1677FF;
  font-weight: 500;
  transition: transform 0.2s ease;
}

.policy-hover-card:hover .details-link-arrow {
  transform: translateX(3px); 
}

/* ==========================================================================
   模块 6：追加大暗色全局 Footer 尾栏（完全还原 image_ee205f 的三列间距排版）
   ========================================================================== */
.global-platform-footer {
  background-color: #212529; 
  padding-top: 80px;
  padding-bottom: 40px;
  width: 100%;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.footer-main-content {
  max-width: 1600px; 
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-left: 100px; 
  padding-right: 100px;
  box-sizing: border-box;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.column-left .footer-brand-title {
  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0;
  letter-spacing: 1px;
}

.column-center {
  flex-grow: 0.5; 
}

.footer-column-title {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 24px;
  letter-spacing: 0.5px;
}

.footer-info-list {
  list-style: none;
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 12px; 
}

.footer-info-list li {
  display: flex;
  align-items: flex-start;
  line-height: 1.6;
  font-size: 0.95rem;
}

.info-label {
  color: #999999;
  flex-shrink: 0;
}

.info-value {
  color: #cccccc;
  word-break: break-all;
}

.column-right {
  align-items: flex-start;
}

.footer-consult-btn {
  width: 120px !important;
  height: 40px !important;
  background-color: #1677FF !important; 
  border-color: #1677FF !important;
  color: #ffffff !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  border-radius: 6px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s ease !important;
}

.footer-consult-btn:hover {
  background-color: #4693ff !important;
  border-color: #4693ff !important;
  opacity: 0.95;
}

.footer-divider-line {
  max-width: 1600px;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.08); 
  margin-top: 60px;
  margin-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
}

.footer-bottom-bar {
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 100px;
  padding-right: 100px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px; 
}

.icp-record-text,
.copyright-text {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 0.85rem;
  color: #666666; 
  line-height: 1.5;
  letter-spacing: 0.3px;
}
</style>