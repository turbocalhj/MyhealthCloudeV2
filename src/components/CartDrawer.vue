<template>
  <!-- 购物车抽屉模块：展示用户已加入购物车的算力资源的列表 -->
  <el-drawer
    v-model="cartStore.cartDrawerVisible"
    title="购物车与资源申请列表"
    direction="rtl"
    size="480px"
    :destroy-on-close="true"
    class="cart-drawer"
  >
    <!-- 顶部操作栏 -->
    <div class="cart-toolbar" v-if="cartStore.cartItems.length > 0">
      <el-checkbox 
        :model-value="cartStore.isAllSelected" 
        @change="cartStore.toggleSelectAll"
        class="select-all-checkbox"
      >
        全选
      </el-checkbox>
      <div class="toolbar-actions">
        <el-button size="small" @click="cartStore.removeSelected" :disabled="cartStore.selectedCount === 0">
          删除选中
        </el-button>
        <el-button size="small" type="danger" @click="handleClearCart">
          清空购物车
        </el-button>
      </div>
    </div>

    <div class="cart-drawer-content">
      <template v-if="cartStore.cartItems.length > 0">
        <div class="cart-list">
          <div v-for="item in cartStore.cartItems" :key="item.id" class="cart-card">
            <!-- 选中复选框 -->
            <el-checkbox 
              :model-value="item.selected" 
              @change="cartStore.toggleSelect(item.id)"
              class="cart-checkbox"
            />
            
            <div class="cart-item-content">
              <div class="cart-item-header">
                <div class="cart-item-title">{{ item.name }}</div>
                <el-icon class="cart-delete-btn" @click="cartStore.removeCartItem(item.id)">
                  <Close />
                </el-icon>
              </div>
              
              <div class="cart-item-specs">
                <span>{{ item.gpuType }}</span> | <span>{{ item.gpuCount }}</span>
              </div>
              
              <div class="cart-item-bottom">
                <span class="provider-tag">{{ item.marketTag }}</span>
                
                <!-- 数量控制器 -->
                <div class="quantity-control">
                  <button class="qty-btn" @click="cartStore.decreaseQuantity(item.id)">
                    <el-icon><Minus /></el-icon>
                  </button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="cartStore.increaseQuantity(item.id)">
                    <el-icon><Plus /></el-icon>
                  </button>
                </div>
              </div>
              
              <div class="cart-item-price-row">
                <span class="cart-item-price">
                  ¥{{ (item.price * item.quantity).toLocaleString() }}
                  <span class="unit">/{{ item.priceUnit }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="empty-cart-box">
        <el-empty description="您的购物车空空如也，快去选购吧" />
      </div>
    </div>
    
    <template #footer>
      <div class="cart-footer-actions">
        <div class="cart-total" v-if="cartStore.cartItems.length > 0">
          <span class="total-label">已选 {{ cartStore.selectedCount }} 件</span>
          <span class="total-price">¥{{ cartStore.selectedTotalPrice.toLocaleString() }}</span>
        </div>
        <el-button @click="cartStore.closeCartDrawer">关闭</el-button>
        <el-button 
          type="primary" 
          @click="handleCheckout" 
          :disabled="cartStore.selectedCount === 0" 
          :loading="checkoutLoading"
        >
          去结算
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
// 购物车模块：管理算力资源的暂存、结算流程
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Close, Minus, Plus } from '@element-plus/icons-vue'
import { useCartStore } from '@/store/modules/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()
const checkoutLoading = ref(false)

const handleClearCart = () => {
  ElMessageBox.confirm(
    '确定要清空购物车吗？',
    '提示',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true }
  ).then(() => {
    cartStore.clearCart()
    ElMessage.success('购物车已清空')
  }).catch(() => {})
}

const handleCheckout = () => {
  const isLoggedNow = !!localStorage.getItem('accessToken') || localStorage.getItem('isPlatformLogged') === 'true'
  if (!isLoggedNow) {
    cartStore.closeCartDrawer()
    ElMessageBox.confirm(
      '登录已过期，请重新登录',
      '提示',
      { confirmButtonText: '立即登录', cancelButtonText: '取消', type: 'error', center: false }
    ).then(() => {
      router.push('/login')
    }).catch(() => {})
    return
  }

  if (cartStore.selectedCount === 0) {
    ElMessage.warning('请先选择要结算的商品')
    return
  }

  // 防抖与Loading交互优化
  if (checkoutLoading.value) return
  checkoutLoading.value = true
  
  setTimeout(() => {
    ElMessage.success('订单结算功能正在建设中...')
    checkoutLoading.value = false
  }, 800)
}
</script>

<style scoped>
/* 顶部操作栏 */
.cart-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid var(--pc-border-light);
  background: var(--pc-bg-card);
}

.select-all-checkbox {
  font-size: 14px;
  color: var(--pc-text-main);
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

/* 内容区域 */
:deep(.el-drawer__body) {
  padding: 0 !important;
  background-color: var(--pc-bg-page);
}

.cart-drawer-content {
  height: 100%;
  overflow-y: auto;
}

.cart-list {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: var(--pc-bg-card);
  border-radius: 8px;
  border: 1px solid var(--pc-border-light);
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  transition: all 0.2s ease;
}

.cart-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.cart-checkbox {
  flex-shrink: 0;
  margin-top: 4px;
}

.cart-item-content {
  flex: 1;
  min-width: 0;
}

.cart-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.cart-item-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--pc-text-main);
  line-height: 1.4;
  flex: 1;
  padding-right: 12px;
}

.cart-delete-btn {
  color: var(--pc-text-disabled);
  cursor: pointer;
  font-size: 16px;
  transition: color 0.2s;
  flex-shrink: 0;
}

.cart-delete-btn:hover {
  color: var(--pc-brand-danger);
}

.cart-item-specs {
  font-size: 13px;
  color: var(--pc-text-muted);
  margin-bottom: 12px;
}

.cart-item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.provider-tag {
  background: var(--pc-bg-tag-blue);
  color: var(--pc-brand-primary);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}

/* 数量控制器 */
.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--pc-bg-page);
  border-radius: 6px;
  padding: 4px;
}

.qty-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  color: var(--pc-text-secondary);
  transition: all 0.2s;
}

.qty-btn:hover {
  background: var(--pc-brand-primary);
  color: #fff;
}

.qty-value {
  min-width: 24px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--pc-text-main);
}

.cart-item-price-row {
  display: flex;
  justify-content: flex-end;
}

.cart-item-price {
  color: var(--pc-brand-warning);
  font-weight: bold;
  font-size: 16px;
}

.cart-item-price .unit {
  font-size: 12px;
  color: var(--pc-text-muted);
  font-weight: normal;
}

.empty-cart-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* 底部操作栏 */
.cart-footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-total {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.total-label {
  font-size: 12px;
  color: var(--pc-text-muted);
}

.total-price {
  color: var(--pc-brand-warning);
  font-size: 20px;
  font-weight: bold;
}
</style>