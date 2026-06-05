<template>
  <!-- 购物车抽屉模块：展示用户已加入购物车的算力资源的列表 -->
  <el-drawer
    v-model="cartStore.cartDrawerVisible"
    title="购物车与资源申请列表"
    direction="rtl"
    size="420px"
    :destroy-on-close="true"
    class="cart-drawer"
  >
    <div class="cart-drawer-content">
      <template v-if="cartStore.cartItems.length > 0">
        <div class="cart-list">
          <div v-for="(item, index) in cartStore.cartItems" :key="item.id + '-' + index" class="cart-card">
            <el-icon class="cart-delete-btn" @click="cartStore.removeCartItem(index)"><Close /></el-icon>
            <div class="cart-item-title">{{ item.name }}</div>
            <div class="cart-item-specs">
              <span>{{ item.gpuType }}</span> | <span>{{ item.gpuCount }}</span>
            </div>
            <div class="cart-item-bottom">
              <span class="provider-tag">{{ item.marketTag }}</span>
              <span class="cart-item-price">¥{{ item.price.toLocaleString() }}<span class="unit">{{ item.priceUnit }}</span></span>
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
          预估总计: <span class="total-price">¥{{ cartStore.totalPrice.toLocaleString() }}</span>
        </div>
        <el-button @click="cartStore.closeCartDrawer">关闭</el-button>
        <el-button type="primary" @click="handleCheckout" :disabled="cartStore.cartItems.length === 0" :loading="checkoutLoading">去结算</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
// 购物车模块：管理算力资源的暂存、结算流程
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { useCartStore } from '@/store/modules/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()
const checkoutLoading = ref(false)

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
/* P4 CSS 变量全面替换，不改变任何视觉呈现 */
:deep(.el-drawer__body) {
  padding: 0 !important;
  background-color: var(--pc-bg-page);
}
.cart-drawer-content {
  height: 100%;
  overflow-y: auto;
}
.cart-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cart-card {
  position: relative;
  background: var(--pc-bg-card);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid var(--pc-border-light);
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  transition: transform 0.2s ease;
}
.cart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.cart-delete-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  color: var(--pc-text-disabled);
  cursor: pointer;
  font-size: 16px;
  transition: color 0.2s;
}
.cart-delete-btn:hover {
  color: var(--pc-brand-danger);
}
.cart-item-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--pc-text-main);
  margin-bottom: 8px;
  padding-right: 24px;
  line-height: 1.4;
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
}
.provider-tag {
  background: var(--pc-bg-tag-blue);
  color: var(--pc-brand-primary);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
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
.cart-footer-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}
.cart-total {
  position: absolute;
  left: 0;
  font-size: 14px;
  color: var(--pc-text-secondary);
}
.cart-total .total-price {
  color: var(--pc-brand-warning);
  font-size: 18px;
  font-weight: bold;
  margin-left: 4px;
}
</style>