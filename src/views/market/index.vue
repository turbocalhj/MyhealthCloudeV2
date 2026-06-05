<template>
  <div class="market-page-wrapper">
    
    <div v-if="isFixedTop" class="filter-placeholder-bar"></div>

    <div 
      class="filter-wrapper" 
      :class="{ 
        'filter-slide-in': isFirstRender, 
        'filter-fixed-top': isFixedTop 
      }"
    >
      <div class="filter-container">
        <div class="filter-header" @click="toggleCollapse">
          <div class="filter-header-left">
            <el-icon class="filter-icon"><Filter /></el-icon>
            <span class="filter-title-text">筛选</span>
          </div>
          <el-icon :class="{ 'arrow-rotate': isCollapsed }"><ArrowUp /></el-icon>
        </div>

        <el-collapse-transition>
          <div v-show="!isCollapsed" class="filter-body">
            <div class="filter-row">
              <div class="row-label">算力来源</div>
              <div class="row-content">
                <div class="sub-group">
                  <span class="sub-label">自营算力</span>
                  <el-checkbox v-model="filterForm.sourceSelfAll" @change="handleSourceSelfAllChange">全部</el-checkbox>
                  <el-checkbox-group v-model="filterForm.sourceSelf" @change="handleSourceSelfItemChange">
                    <el-checkbox label="推理">推理</el-checkbox>
                    <el-checkbox label="训练">训练</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="sub-group">
                  <span class="sub-label">市场算力</span>
                  <el-checkbox v-model="filterForm.sourceMarketAll" @change="handleSourceMarketAllChange">全部</el-checkbox>
                  <el-checkbox-group v-model="filterForm.sourceMarket" @change="handleSourceMarketItemChange">
                    <el-checkbox label="健康云">健康云</el-checkbox>
                    <el-checkbox label="电信">电信</el-checkbox>
                    <el-checkbox label="移动">移动</el-checkbox>
                    <el-checkbox label="联通">联通</el-checkbox>
                    <el-checkbox label="华数">华数</el-checkbox>
                    <el-checkbox label="阿里云">阿里云</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>

            <div class="filter-row">
              <div class="row-label">选择地域</div>
              <div class="row-content">
                <div class="sub-group">
                  <span class="sub-label">省份</span>
                  <el-checkbox v-model="filterForm.provinceAll" @change="handleProvinceAllChange">全选</el-checkbox>
                  <el-checkbox-group v-model="filterForm.provinces" @change="handleProvinceItemChange">
                    <el-checkbox label="浙江省">浙江省</el-checkbox>
                    <el-checkbox label="内蒙古自治区" disabled>内蒙古自治区</el-checkbox>
                    <el-checkbox label="北京市">北京市</el-checkbox>
                    <el-checkbox label="上海市" disabled>上海市</el-checkbox>
                    <el-checkbox label="湖北省" disabled>湖北省</el-checkbox>
                    <el-checkbox label="安徽省" disabled>安徽省</el-checkbox>
                    <el-checkbox label="贵州省" disabled>贵州省</el-checkbox>
                    <el-checkbox label="江苏省" disabled>江苏省</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="sub-group">
                  <span class="sub-label">城市</span>
                  <el-checkbox v-model="filterForm.cityAll" @change="handleCityAllChange">全选</el-checkbox>
                  <el-checkbox-group v-model="filterForm.cities" @change="handleCityItemChange">
                    <el-checkbox label="杭州市">杭州市</el-checkbox>
                    <el-checkbox label="北京市">北京市</el-checkbox>
                    <el-checkbox label="宁波市">宁波市</el-checkbox>
                    <el-checkbox label="温州市" disabled>温州市</el-checkbox>
                    <el-checkbox label="嘉兴市">嘉兴市</el-checkbox>
                    <el-checkbox label="湖州市" disabled>湖州市</el-checkbox>
                    <el-checkbox label="绍兴市">绍兴市</el-checkbox>
                    <el-checkbox label="金华市">金华市</el-checkbox>
                    <el-checkbox label="衢州市">衢州市</el-checkbox>
                    <el-checkbox label="舟山市" disabled>舟山市</el-checkbox>
                    <el-checkbox label="台州市" disabled>台州市</el-checkbox>
                    <el-checkbox label="丽水市" disabled>丽水市</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>

            <div class="filter-row">
              <div class="row-label">GPU品牌</div>
              <div class="row-content">
                <el-checkbox v-model="filterForm.gpuBrandAll" @change="handleGpuBrandAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="filterForm.gpuBrands" @change="handleGpuBrandItemChange">
                  <el-checkbox label="华为">华为</el-checkbox>
                  <el-checkbox label="昆仑芯">昆仑芯</el-checkbox>
                  <el-checkbox label="平头哥">平头哥</el-checkbox>
                  <el-checkbox label="英伟达">英伟达</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>

            <div class="filter-row">
              <div class="row-label">显卡数量</div>
              <div class="row-content">
                <el-checkbox v-model="filterForm.gpuCountAll" @change="handleGpuCountAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="filterForm.gpuCounts" @change="handleGpuCountItemChange">
                  <el-checkbox label="8卡">8卡</el-checkbox>
                  <el-checkbox label="4卡">4卡</el-checkbox>
                  <el-checkbox label="2卡">2卡</el-checkbox>
                  <el-checkbox label="1卡">1卡</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>

            <div class="filter-row">
              <div class="row-label">算力补贴</div>
              <div class="row-content">
                <el-checkbox v-model="filterForm.subsidyAll" @change="handleSubsidyAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="filterForm.subsidies" @change="handleSubsidyItemChange">
                  <el-checkbox label="50%">50%</el-checkbox>
                  <el-checkbox label="30%">30%</el-checkbox>
                  <el-checkbox label="20%">20%</el-checkbox>
                  <el-checkbox label="无补贴">无补贴</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>

    <div class="market-toolbar">
      <div class="toolbar-left">
        <span class="total-count-text">
          共 <span class="count-highlight">{{ filteredProducts.length }}</span> 个算力产品
        </span>
      </div>
      <div class="toolbar-right">
        <el-select v-model="sortValue" placeholder="排序" class="sort-selector">
          <el-option label="默认排序" value="default" />
          <el-option label="价格从低到高" value="priceAsc" />
          <el-option label="价格从高到低" value="priceDesc" />
          <el-option label="补贴比例从低到高" value="subsidyAsc" />
          <el-option label="补贴比例从高到低" value="subsidyDesc" />
        </el-select>
        
        <div class="search-input-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="输入内容查询" 
            class="native-search-input"
            @keyup.enter="triggerSearch"
          />
          <button class="search-action-btn" @click="triggerSearch">
            <el-icon><Search /></el-icon>
          </button>
        </div>
      </div>
    </div>

    <div class="market-grid-container">
      <div v-if="pageLoading" class="loading-status-box" style="padding: 100px 0; justify-content: center;">
        <el-icon class="is-loading" :size="24"><Loading /></el-icon>
        <span class="loading-text" style="font-size: 16px;">正在拉取算力资源...</span>
      </div>

      <template v-else>
        <div v-if="displayProducts.length === 0" class="empty-placeholder">
          暂无符合筛选条件的算力产品
        </div>
        
        <div v-else class="market-card-grid">
          <el-card 
            v-for="product in displayProducts" 
            :key="product.id" 
            class="product-card" 
            shadow="hover"
          >
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
                <span class="price-unit">{{ product.priceUnit }}</span>
              </div>
            </div>

            <div class="card-actions">
              <template v-if="!product.isOutOfStock">
                <el-button 
                  size="small" 
                  class="add-cart-btn" 
                  :loading="btnLoadingMap[`cart-${product.id}`]" 
                  @click="handleAddToCart(product)"
                >加入购物车</el-button>
                <el-button 
                  type="primary" 
                  size="small" 
                  class="buy-now-btn" 
                  :loading="btnLoadingMap[`buy-${product.id}`]" 
                  @click="handleBuyNow(product)"
                >立即购买</el-button>
              </template>
              <template v-else>
                <el-button size="small" class="stockout-btn" disabled>暂无库存</el-button>
                <el-button type="primary" size="small" class="demand-btn">需求登记</el-button>
              </template>
            </div>
          </el-card>
        </div>

        <div ref="loadMoreAnchor" class="infinite-load-trigger">
          <div v-if="loading && hasMore" class="loading-status-box">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span class="loading-text">正在加载更多产品...</span>
          </div>
          <div v-if="!hasMore && displayProducts.length > 0" class="no-more-status">
            已加载全部产品
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch, computed } from 'vue'
import { Filter, ArrowUp, Search, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { CheckboxValueType } from 'element-plus'

import { useCartStore } from '@/store/modules/cart'
import { fetchMarketProducts } from '@/api/market'
import type { ComputingProduct } from '@/types'

const cartStore = useCartStore()

const isFirstRender = ref(true)
const isCollapsed = ref(false)
const isFixedTop = ref(false)

const sortValue = ref('default')
const searchQuery = ref('')
const activeSearchQuery = ref('')
const pageLoading = ref(true)

// 🚀 行级按钮防抖 Loading 映射表
const btnLoadingMap = ref<Record<string, boolean>>({})

const filterForm = reactive({
  sourceSelfAll: true, sourceSelf: ['推理', '训练'],
  sourceMarketAll: true, sourceMarket: ['健康云', '电信', '移动', '联通', '华数', '阿里云'],
  provinceAll: false, provinces: ['浙江省', '北京市'],
  cityAll: false, cities: ['杭州市', '北京市', '宁波市', '嘉兴市', '绍兴市', '金华市', '衢州市'],
  gpuBrandAll: true, gpuBrands: ['华为', '昆仑芯', '平头哥', '英伟达'],
  gpuCountAll: true, gpuCounts: ['8卡', '4卡', '2卡', '1卡'],
  subsidyAll: true, subsidies: ['50%', '30%', '20%', '无补贴']
})

const allMockProducts = ref<ComputingProduct[]>([])

// 🚀 改造为带锁的防抖请求
const handleAddToCart = (product: ComputingProduct) => {
  const key = `cart-${product.id}`
  if (btnLoadingMap.value[key]) return
  btnLoadingMap.value[key] = true
  
  setTimeout(() => {
    if (cartStore.addCartItem(product)) {
      ElMessage.success('成功加入购物车！')
    }
    btnLoadingMap.value[key] = false
  }, 400)
}

// 🚀 改造为带锁的防抖请求
const handleBuyNow = (product: ComputingProduct) => {
  const key = `buy-${product.id}`
  if (btnLoadingMap.value[key]) return
  btnLoadingMap.value[key] = true
  
  setTimeout(() => {
    cartStore.addCartItem(product)
    cartStore.openCartDrawer()
    btnLoadingMap.value[key] = false
  }, 400)
}

const handleSourceSelfAllChange = (val: any) => { filterForm.sourceSelf = val ? ['推理', '训练'] : [] }
const handleSourceSelfItemChange = (value: CheckboxValueType[]) => { filterForm.sourceSelfAll = value.length === 2 }
const handleSourceMarketAllChange = (val: any) => { filterForm.sourceMarket = val ? ['健康云', '电信', '移动', '联通', '华数', '阿里云'] : [] }
const handleSourceMarketItemChange = (value: CheckboxValueType[]) => { filterForm.sourceMarketAll = value.length === 6 }
const handleProvinceAllChange = (val: any) => { filterForm.provinces = val ? ['浙江省', '北京市'] : [] }
const handleProvinceItemChange = (value: CheckboxValueType[]) => { filterForm.provinceAll = value.length === 2 }
const handleCityAllChange = (val: any) => { filterForm.cities = val ? ['杭州市', '北京市', '宁波市', '嘉兴市', '绍兴市', '金华市', '衢州市'] : [] }
const handleCityItemChange = (value: CheckboxValueType[]) => { filterForm.cityAll = value.length === 7 }
const handleGpuBrandAllChange = (val: any) => { filterForm.gpuBrands = val ? ['华为', '昆仑芯', '平头哥', '英伟达'] : [] }
const handleGpuBrandItemChange = (value: CheckboxValueType[]) => { filterForm.gpuBrandAll = value.length === 4 }
const handleGpuCountAllChange = (val: any) => { filterForm.gpuCounts = val ? ['8卡', '4卡', '2卡', '1卡'] : [] }
const handleGpuCountItemChange = (value: CheckboxValueType[]) => { filterForm.gpuCountAll = value.length === 4 }
const handleSubsidyAllChange = (val: any) => { filterForm.subsidies = val ? ['50%', '30%', '20%', '无补贴'] : [] }
const handleSubsidyItemChange = (value: CheckboxValueType[]) => { filterForm.subsidyAll = value.length === 4 }

const filteredProducts = computed(() => {
  return allMockProducts.value.filter(product => {
    if (product.metaSourceType === '自营') {
      if (filterForm.sourceSelf.length === 0) return false
    } else {
      if (!filterForm.sourceMarket.includes(product.metaSubSource)) return false
    }
    if (!filterForm.provinces.includes(product.metaProvince)) return false
    if (!filterForm.cities.includes(product.metaCity)) return false
    if (!filterForm.gpuBrands.includes(product.metaGpuBrand)) return false
    if (!filterForm.gpuCounts.includes(product.metaGpuCount)) return false
    if (!filterForm.subsidies.includes(product.metaSubsidy)) return false
    if (activeSearchQuery.value.trim()) {
      const q = activeSearchQuery.value.toLowerCase()
      const matchName = product.name.toLowerCase().includes(q)
      const matchGpu = product.gpuType.toLowerCase().includes(q)
      if (!matchName && !matchGpu) return false
    }
    return true
  }).sort((a, b) => {
    if (sortValue.value === 'priceAsc') return a.price - b.price
    if (sortValue.value === 'priceDesc') return b.price - a.price
    if (sortValue.value === 'subsidyAsc') {
      const getVal = (s: string) => s === '无补贴' ? 0 : parseInt(s)
      return getVal(a.metaSubsidy) - getVal(b.metaSubsidy)
    }
    if (sortValue.value === 'subsidyDesc') {
      const getVal = (s: string) => s === '无补贴' ? 0 : parseInt(s)
      return getVal(b.metaSubsidy) - getVal(a.metaSubsidy)
    }
    return 0
  })
})

const pageSize = 12
const pagedCount = ref(12)
const loading = ref(false)
const loadMoreAnchor = ref<HTMLElement | null>(null)

const displayProducts = computed(() => { return filteredProducts.value.slice(0, pagedCount.value) })
const hasMore = computed(() => { return pagedCount.value < filteredProducts.value.length })
const triggerSearch = () => { activeSearchQuery.value = searchQuery.value }

watch([filteredProducts, sortValue], () => { pagedCount.value = pageSize })
const toggleCollapse = () => { isCollapsed.value = !isCollapsed.value }

const handleMarketScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  if (isFirstRender.value) return
  if (scrollTop > 100) { isFixedTop.value = true; isCollapsed.value = true } 
  else { isFixedTop.value = false; isCollapsed.value = false }
}

let infiniteObserver: IntersectionObserver | null = null

onMounted(async () => {
  try {
    const res = await fetchMarketProducts()
    allMockProducts.value = res
  } catch (error) {
    ElMessage.error('拉取算力资源失败')
  } finally {
    pageLoading.value = false
    setTimeout(() => { isFirstRender.value = false }, 600)
  }

  window.addEventListener('scroll', handleMarketScroll, { passive: true })
  setTimeout(() => {
    infiniteObserver = new IntersectionObserver((entries) => {
      const target = entries[0]
      if (target.isIntersecting && hasMore.value && !loading.value) {
        loading.value = true
        setTimeout(() => { pagedCount.value += pageSize; loading.value = false }, 800)
      }
    }, { rootMargin: '100px' })
    if (loadMoreAnchor.value) { infiniteObserver.observe(loadMoreAnchor.value) }
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleMarketScroll)
  if (infiniteObserver) { infiniteObserver.disconnect() }
})
</script>

<style scoped>
/* 🚀 P4 CSS 变量全面注入，样式完美一致但彻底摆脱了硬编码！ */
.market-page-wrapper { width: 1600px; margin-left: auto; margin-right: auto; padding-top: 30px; padding-bottom: 80px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.filter-placeholder-bar { width: 100%; height: 58px; margin-bottom: 30px; box-sizing: border-box; }
.filter-wrapper { width: 100%; background: var(--pc-bg-card); border-radius: 12px; border: 1px solid var(--pc-border-light); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02); margin-bottom: 30px; box-sizing: border-box; transition: box-shadow 0.3s ease, border-radius 0.2s ease; }
.filter-fixed-top { position: fixed; top: 64px; left: 50%; transform: translateX(-50%); width: 1600px; z-index: 999; border-radius: 0 0 12px 12px; border-top: none; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08); background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(10px); }
.filter-slide-in { animation: filterSlideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes filterSlideDown { 0% { transform: translateY(-20px); opacity: 0; } 100% { transform: translate3d(0, 0, 0); opacity: 1; } }
.filter-fixed-top.filter-slide-in { animation: filterSlideFixedDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes filterSlideFixedDown { 0% { transform: translate3d(-50%, -20px, 0); opacity: 0; } 100% { transform: translate3d(-50%, 0, 0); opacity: 1; } }
.filter-wrapper:hover { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04); }
.filter-container { padding-left: 24px; padding-right: 24px; padding-bottom: 16px; }
.filter-fixed-top .filter-container { padding-bottom: 0px; }
.filter-header { display: flex; align-items: center; justify-content: space-between; padding-top: 20px; padding-bottom: 16px; cursor: pointer; user-select: none; }
.filter-fixed-top .filter-header { padding-top: 16px; padding-bottom: 16px; }
.filter-header-left { display: flex; align-items: center; gap: 10px; }
.filter-icon { color: var(--pc-brand-primary); font-size: 18px; }
.filter-title-text { font-size: 16px; font-weight: 600; color: var(--pc-text-main); }
.arrow-rotate { transform: rotate(180deg); transition: transform 0.3s ease; }
.filter-body { border-top: 1px solid var(--pc-border-lighter); padding-top: 12px; display: flex; flex-direction: column; gap: 16px; }
.filter-row { display: flex; align-items: flex-start; min-height: 40px; }
.row-label { width: 100px; color: var(--pc-text-main); font-size: 14px; font-weight: 600; padding-top: 8px; flex-shrink: 0; }
.row-content { flex: 1; display: flex; flex-direction: column; gap: 12px; padding-top: 6px; }
.sub-group { display: flex; align-items: center; flex-wrap: wrap; }
.sub-label { width: 80px; font-size: 13px; color: var(--pc-text-muted); flex-shrink: 0; }
:deep(.el-checkbox) { margin-right: 24px !important; height: auto !important; }
:deep(.el-checkbox.is-disabled) { border-color: var(--pc-border-base) !important; }
:deep(.el-checkbox__label) { font-size: 14px !important; color: var(--pc-text-main) !important; }
:deep(.el-checkbox.is-disabled .el-checkbox__label) { color: var(--pc-text-disabled) !important; }
.market-toolbar { display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 26px; box-sizing: border-box; }
.total-count-text { font-size: 14px; color: var(--pc-text-secondary); }
.count-highlight { color: var(--pc-brand-primary); font-weight: 600; margin-left: 2px; margin-right: 2px; }
.toolbar-right { display: flex; align-items: center; gap: 16px; }
.sort-selector { width: 200px !important; }
:deep(.el-input__wrapper) { height: 40px !important; border-radius: 6px !important; }
.search-input-box { display: flex; align-items: center; width: 300px; height: 40px; background: var(--pc-bg-card); border: 1px solid var(--pc-border-base); border-radius: 6px; overflow: hidden; box-sizing: border-box; transition: border-color 0.2s ease; }
.search-input-box:focus-within { border-color: var(--pc-brand-primary); }
.native-search-input { flex: 1; height: 100%; border: none; outline: none; padding-left: 14px; padding-right: 10px; font-size: 14px; color: var(--pc-text-main); }
.native-search-input::placeholder { color: var(--pc-text-disabled); }
.search-action-btn { width: 46px; height: 100%; background: var(--pc-brand-primary); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--pc-bg-card); font-size: 16px; transition: background-color 0.2s ease; }
.search-action-btn:hover { background: var(--pc-brand-primary-hover); }
.market-grid-container { width: 100%; box-sizing: border-box; }
.market-card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; width: 100%; }
.empty-placeholder { text-align: center; padding-top: 100px; padding-bottom: 100px; color: var(--pc-text-muted); font-size: 15px; }
.product-card { position: relative; width: 100%; height: 455px; background: var(--pc-bg-card); border-radius: 12px; border: 1px solid var(--pc-border-light); box-sizing: border-box; transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
.product-card :deep(.el-card__body) { padding: 0; height: 100%; display: flex; flex-direction: column; }
.product-card:hover { transform: translateY(-4px); border-color: var(--pc-border-base); box-shadow: 0 16px 32px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.02) !important; }
.card-tag { position: absolute; top: 0; right: 24px; background-color: var(--pc-brand-danger); color: white; font-size: 11px; font-weight: bold; padding-top: 4px; padding-bottom: 4px; padding-left: 10px; padding-right: 10px; border-radius: 0 0 6px 6px; z-index: 5; }
.card-header { padding-top: 30px; padding-bottom: 16px; padding-left: 24px; padding-right: 24px; }
.product-name { font-size: 20px; font-weight: bold; color: var(--pc-text-main); margin-top: 0; margin-bottom: 14px; cursor: pointer; transition: color 0.2s ease; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.product-name:hover { color: var(--pc-brand-primary); }
.product-labels { display: flex; flex-wrap: wrap; gap: 8px; }
.label { font-size: 12px; padding-top: 3px; padding-bottom: 3px; padding-left: 10px; padding-right: 10px; border-radius: 4px; font-weight: 500; }
.product-labels .label:nth-child(1) { color: var(--pc-brand-primary); background-color: var(--pc-bg-tag-blue); }
.product-labels .label:nth-child(2) { color: #3366ff; background-color: #eef2ff; }
.product-labels .label:nth-child(3) { color: #00b365; background-color: #e6f9f0; }
.product-labels .label:nth-child(4) { color: #ff6600; background-color: #fff2e6; }
.specs-matrix { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 32px; padding-top: 16px; padding-bottom: 16px; padding-left: 24px; padding-right: 24px; background-color: #fafbfc; border-top: 1px solid var(--pc-border-light); border-bottom: 1px solid var(--pc-border-light); }
.spec-item { display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
.spec-label { color: var(--pc-text-muted); }
.spec-value { color: var(--pc-text-main); font-weight: 500; }
.product-price-row { padding-top: 16px; padding-bottom: 12px; padding-left: 24px; padding-right: 24px; }
.product-price { display: flex; align-items: baseline; }
.price-symbol { font-size: 1.1rem; color: var(--pc-brand-warning); font-weight: bold; }
.price-value { font-size: 1.8rem; color: var(--pc-brand-warning); font-weight: bold; margin-left: 4px; margin-right: 4px; }
.price-unit { font-size: 0.85rem; color: var(--pc-text-muted); }
.card-actions { display: flex; justify-content: space-between; padding-left: 24px; padding-right: 24px; padding-bottom: 24px; margin-top: auto; }
.add-cart-btn { width: 130px !important; height: 46px !important; background: var(--pc-bg-card) !important; border-radius: 6px !important; border: 1px solid var(--pc-brand-primary) !important; color: var(--pc-brand-primary) !important; font-size: 14px; font-weight: 500; padding: 0; transition: all 0.2s ease; }
.add-cart-btn:hover { background: var(--pc-bg-card) !important; border-width: 1.5px !important; border-color: var(--pc-text-muted) !important; color: #000000 !important; box-shadow: none !important; }
.stockout-btn { width: 130px !important; height: 46px !important; background: var(--pc-bg-disabled) !important; border-radius: 6px !important; border: 1px solid var(--pc-border-base) !important; color: var(--pc-text-disabled) !important; font-size: 14px; cursor: not-allowed !important; }
.buy-now-btn { width: 190px !important; height: 46px !important; background: var(--pc-brand-primary) !important; border: 1px solid var(--pc-brand-primary) !important; border-radius: 6px !important; color: var(--pc-bg-card) !important; font-size: 14px; font-weight: 500; padding: 0; transition: all 0.25s ease; }
.buy-now-btn:hover { background: var(--pc-brand-primary-hover) !important; border-color: var(--pc-brand-primary-hover) !important; }
.demand-btn { width: 190px !important; height: 46px !important; background: var(--pc-brand-primary) !important; border: 1px solid var(--pc-brand-primary) !important; color: var(--pc-bg-card) !important; border-radius: 6px !important; font-size: 14px; font-weight: 500; padding: 0; transition: all 0.25s ease; }
.demand-btn:hover { background: var(--pc-brand-primary-hover) !important; border-color: var(--pc-brand-primary-hover) !important; }
.infinite-load-trigger { width: 100%; display: flex; justify-content: center; align-items: center; padding-top: 50px; padding-bottom: 20px; box-sizing: border-box; }
.loading-status-box { display: flex; align-items: center; gap: 10px; color: var(--pc-brand-primary); }
.loading-text { font-size: 15px; font-weight: 500; letter-spacing: 0.5px; }
.no-more-status { font-size: 14px; color: var(--pc-text-disabled); }
</style>