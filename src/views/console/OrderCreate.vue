<template>
  <!-- 订单创建模块：从购物车结算生成订单 -->
  <div class="order-create-page">
    <div class="page-header">
      <h2>确认订单</h2>
      <p>请确认您要购买的资源信息</p>
    </div>

    <div v-if="cartItems.length === 0" class="empty-box">
      <el-empty description="购物车为空，请先添加资源到购物车" />
      <el-button type="primary" @click="router.push('/main/market')">去选购</el-button>
    </div>

    <div v-else class="order-content">
      <!-- 订单商品列表 -->
      <el-card class="order-card">
        <template #header>
          <div class="card-header">
            <span>订单商品</span>
            <span class="item-count">共 {{ selectedItems.length }} 件</span>
          </div>
        </template>

        <div class="order-items">
          <div v-for="item in selectedItems" :key="item.id" class="order-item">
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-specs">{{ item.gpuType }} | {{ item.gpuCount }} | {{ item.memory }}</div>
              <div class="item-meta">
                <span class="meta-tag">{{ item.marketTag }}</span>
                <span class="meta-source">{{ item.metaSubSource }}</span>
              </div>
            </div>
            <div class="item-right">
              <div class="item-quantity">x{{ item.quantity }}</div>
              <div class="item-price">¥{{ (item.price * item.quantity).toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 订单信息 -->
      <el-card class="order-card">
        <template #header>
          <span>订单信息</span>
        </template>

        <el-form :model="orderForm" label-width="100px" class="order-form">
          <el-form-item label="购买时长">
            <el-select v-model="orderForm.duration" style="width: 200px">
              <el-option label="1个月" :value="1" />
              <el-option label="3个月" :value="3" />
              <el-option label="6个月" :value="6" />
              <el-option label="1年" :value="12" />
            </el-select>
          </el-form-item>

          <el-form-item label="自动续费">
            <el-switch v-model="orderForm.autoRenew" />
          </el-form-item>

          <el-form-item label="优惠券">
            <div class="coupon-box">
              <el-input v-model="orderForm.couponCode" placeholder="请输入优惠券码" style="width: 200px" />
              <el-button type="primary" @click="handleApplyCoupon">使用</el-button>
            </div>
            <div v-if="orderForm.couponDiscount > 0" class="coupon-info">
              已优惠 ¥{{ orderForm.couponDiscount.toLocaleString() }}
            </div>
          </el-form-item>

          <el-form-item label="备注">
            <el-input 
              v-model="orderForm.remark" 
              type="textarea" 
              :rows="3" 
              placeholder="选填，如有特殊需求请备注"
            />
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 订单金额 -->
      <el-card class="order-summary-card">
        <div class="summary-row">
          <span>商品总额</span>
          <span>¥{{ totalPrice.toLocaleString() }}</span>
        </div>
        <div v-if="orderForm.couponDiscount > 0" class="summary-row discount">
          <span>优惠券折扣</span>
          <span>-¥{{ orderForm.couponDiscount.toLocaleString() }}</span>
        </div>
        <el-divider />
        <div class="summary-row total">
          <span>应付金额</span>
          <span class="total-price">¥{{ finalPrice.toLocaleString() }}</span>
        </div>

        <div class="summary-actions">
          <el-button @click="router.back()">返回购物车</el-button>
          <el-button type="primary" size="large" :loading="submitting" @click="handleSubmitOrder">
            提交订单
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/store/modules/cart'

const router = useRouter()
const cartStore = useCartStore()
const submitting = ref(false)

const cartItems = computed(() => cartStore.cartItems)
const selectedItems = computed(() => cartItems.value.filter(item => item.selected))

const totalPrice = computed(() => {
  return selectedItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
})

const orderForm = reactive({
  duration: 1,
  autoRenew: false,
  couponCode: '',
  couponDiscount: 0,
  remark: ''
})

const finalPrice = computed(() => {
  return totalPrice.value - orderForm.couponDiscount
})

const handleApplyCoupon = () => {
  if (!orderForm.couponCode.trim()) {
    ElMessage.warning('请输入优惠券码')
    return
  }
  
  // 模拟优惠券验证
  if (orderForm.couponCode === 'SAVE100') {
    orderForm.couponDiscount = 100
    ElMessage.success('优惠券使用成功，已优惠 ¥100')
  } else if (orderForm.couponCode === 'SAVE200') {
    orderForm.couponDiscount = 200
    ElMessage.success('优惠券使用成功，已优惠 ¥200')
  } else {
    ElMessage.error('无效的优惠券码')
  }
}

const handleSubmitOrder = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要购买的商品')
    return
  }

  submitting.value = true
  
  try {
    // 模拟订单提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 生成订单号
    const orderId = 'ORD' + Date.now()
    
    ElMessage.success(`订单提交成功！订单号：${orderId}`)
    
    // 清空已购买的商品
    cartStore.removeSelected()
    
    // 跳转到订单详情页面
    setTimeout(() => {
      router.push({
        path: '/console/order-detail',
        query: { orderId }
      })
    }, 1500)
  } catch {
    ElMessage.error('订单提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.order-create-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #222;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0;
  gap: 20px;
}

.order-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.item-count {
  font-size: 14px;
  color: #909399;
  font-weight: normal;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}

.item-specs {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.item-meta {
  display: flex;
  gap: 8px;
}

.meta-tag {
  background: #e6f7ff;
  color: #1677ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.meta-source {
  background: #f5f5f5;
  color: #666;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.item-quantity {
  font-size: 14px;
  color: #909399;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff4d4f;
}

.order-form {
  max-width: 500px;
}

.coupon-box {
  display: flex;
  gap: 12px;
}

.coupon-info {
  font-size: 13px;
  color: #52c41a;
  margin-top: 4px;
}

.order-summary-card {
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 14px;
  color: #666;
}

.summary-row.discount {
  color: #52c41a;
}

.summary-row.total {
  font-size: 16px;
  font-weight: 600;
  color: #222;
}

.total-price {
  font-size: 24px;
  color: #ff4d4f;
  font-weight: 700;
}

.summary-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
</style>
