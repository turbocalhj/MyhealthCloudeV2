<template>
  <div class="order-detail-page">
    <div class="page-header">
      <el-button @click="router.back()" class="back-btn">
        <el-icon><ArrowLeft /></el-icon> 返回
      </el-button>
      <h2>订单详情</h2>
      <p>订单号：{{ orderInfo.orderId }}</p>
    </div>

    <div class="order-content">
      <!-- 订单状态 -->
      <el-card class="order-card">
        <template #header>
          <div class="card-header">
            <span>订单状态</span>
            <span :class="['status-badge', getStatusClass(orderInfo.status)]">
              {{ orderInfo.status }}
            </span>
          </div>
        </template>

        <div class="status-timeline">
          <div v-for="(step, index) in statusSteps" :key="index" 
               :class="['timeline-step', { active: step.active, completed: step.completed }]">
            <div class="step-dot"></div>
            <div class="step-label">{{ step.label }}</div>
            <div class="step-time">{{ step.time }}</div>
          </div>
        </div>
      </el-card>

      <!-- 订单商品 -->
      <el-card class="order-card">
        <template #header>
          <span>订单商品</span>
        </template>

        <div class="order-items">
          <div v-for="item in orderInfo.items" :key="item.id" class="order-item">
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

        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">订单号</span>
            <span class="info-value">{{ orderInfo.orderId }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">创建时间</span>
            <span class="info-value">{{ orderInfo.createTime }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">支付时间</span>
            <span class="info-value">{{ orderInfo.payTime || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">购买时长</span>
            <span class="info-value">{{ orderInfo.duration }}个月</span>
          </div>
          <div class="info-row">
            <span class="info-label">自动续费</span>
            <span class="info-value">{{ orderInfo.autoRenew ? '已开启' : '未开启' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">优惠券</span>
            <span class="info-value">{{ orderInfo.couponCode || '未使用' }}</span>
          </div>
          <div class="info-row" v-if="orderInfo.remark">
            <span class="info-label">备注</span>
            <span class="info-value">{{ orderInfo.remark }}</span>
          </div>
        </div>
      </el-card>

      <!-- 订单金额 -->
      <el-card class="order-summary-card">
        <div class="summary-row">
          <span>商品总额</span>
          <span>¥{{ orderInfo.totalPrice.toLocaleString() }}</span>
        </div>
        <div v-if="orderInfo.couponDiscount > 0" class="summary-row discount">
          <span>优惠券折扣</span>
          <span>-¥{{ orderInfo.couponDiscount.toLocaleString() }}</span>
        </div>
        <el-divider />
        <div class="summary-row total">
          <span>实付金额</span>
          <span class="total-price">¥{{ orderInfo.finalPrice.toLocaleString() }}</span>
        </div>

        <div class="summary-actions">
          <el-button v-if="orderInfo.status === '待支付'" type="primary" size="large" @click="handlePay">
            立即支付
          </el-button>
          <el-button v-if="orderInfo.status === '待支付'" @click="handleCancel">
            取消订单
          </el-button>
          <el-button v-if="orderInfo.status === '已完成'" type="primary" @click="handleUse">
            立即使用
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 从路由参数获取订单ID
const orderId = computed(() => route.query.orderId as string || '')

// 模拟订单数据
const orderInfo = ref({
  orderId: orderId.value || 'ORD202606101246282536',
  status: '待支付',
  createTime: '2026-06-10 12:46:28',
  payTime: '',
  duration: 3,
  autoRenew: false,
  couponCode: '',
  couponDiscount: 0,
  remark: '',
  totalPrice: 2400,
  finalPrice: 2400,
  items: [
    {
      id: '1',
      name: '高性能GPU计算实例',
      gpuType: 'NVIDIA A100',
      gpuCount: '8卡',
      memory: '512GB',
      marketTag: '补贴商品',
      metaSubSource: '健康云',
      price: 800,
      quantity: 1
    }
  ]
})

// 状态步骤
const statusSteps = computed(() => {
  const steps = [
    { label: '提交订单', time: orderInfo.value.createTime, active: true, completed: true }
  ]

  if (['已支付', '处理中', '已完成'].includes(orderInfo.value.status)) {
    steps.push({
      label: '支付成功',
      time: orderInfo.value.payTime || '2026-06-10 13:00:00',
      active: orderInfo.value.status === '已支付',
      completed: ['处理中', '已完成'].includes(orderInfo.value.status)
    })
  }

  if (['处理中', '已完成'].includes(orderInfo.value.status)) {
    steps.push({
      label: '资源准备中',
      time: '2026-06-10 14:00:00',
      active: orderInfo.value.status === '处理中',
      completed: orderInfo.value.status === '已完成'
    })
  }

  if (orderInfo.value.status === '已完成') {
    steps.push({
      label: '资源就绪',
      time: '2026-06-10 16:00:00',
      active: true,
      completed: true
    })
  }

  if (orderInfo.value.status === '已取消') {
    steps.push({
      label: '订单已取消',
      time: '2026-06-10 13:00:00',
      active: true,
      completed: true
    })
  }

  return steps
})

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    '待支付': 'status-pending-pay',
    '已支付': 'status-paid',
    '处理中': 'status-processing',
    '已完成': 'status-completed',
    '已取消': 'status-cancelled'
  }
  return classMap[status] || ''
}

const handlePay = async () => {
  ElMessageBox.confirm('确认支付该订单？', '支付确认', {
    confirmButtonText: '确认支付',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 模拟支付
    await new Promise(resolve => setTimeout(resolve, 1000))
    orderInfo.value.status = '已支付'
    orderInfo.value.payTime = new Date().toLocaleString()
    ElMessage.success('支付成功！')
  }).catch(() => {})
}

const handleCancel = () => {
  ElMessageBox.confirm('确认取消该订单？取消后无法恢复。', '取消确认', {
    confirmButtonText: '确认取消',
    cancelButtonText: '返回',
    type: 'warning'
  }).then(() => {
    orderInfo.value.status = '已取消'
    ElMessage.success('订单已取消')
  }).catch(() => {})
}

const handleUse = () => {
  router.push('/console/dashboard')
  ElMessage.success('正在跳转到控制台...')
}
</script>

<style scoped>
.order-detail-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 20px;
  color: #1D2129;
  margin: 8px 0 4px;
}

.page-header p {
  font-size: 14px;
  color: #86909C;
  margin: 0;
}

.back-btn {
  border: none;
  background: transparent;
  color: #4E5969;
  padding: 0;
  font-size: 14px;
}

.back-btn:hover {
  color: #1677FF;
}

.order-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
}

.status-pending-pay {
  background-color: #FFF7E8;
  color: #FAAD14;
}

.status-paid {
  background-color: #E8F3FF;
  color: #1677FF;
}

.status-processing {
  background-color: #F3E8FF;
  color: #722ED1;
}

.status-completed {
  background-color: #E8FFE8;
  color: #52C41A;
}

.status-cancelled {
  background-color: #F0F0F0;
  color: #999;
}

/* 状态时间线 */
.status-timeline {
  display: flex;
  gap: 0;
  padding: 20px 0;
}

.timeline-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.timeline-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 12px;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: #E5E6EB;
  z-index: 0;
}

.timeline-step.completed:not(:last-child)::after {
  background-color: #1677FF;
}

.step-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #E5E6EB;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.timeline-step.active .step-dot {
  background-color: #1677FF;
  box-shadow: 0 0 0 4px rgba(22, 119, 255, 0.2);
}

.timeline-step.completed .step-dot {
  background-color: #1677FF;
}

.step-label {
  font-size: 14px;
  color: #86909C;
  margin-bottom: 4px;
}

.timeline-step.active .step-label,
.timeline-step.completed .step-label {
  color: #1D2129;
  font-weight: 500;
}

.step-time {
  font-size: 12px;
  color: #C0C4CC;
}

/* 订单商品 */
.order-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 4px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #1D2129;
  margin-bottom: 4px;
}

.item-specs {
  font-size: 13px;
  color: #86909C;
  margin-bottom: 8px;
}

.item-meta {
  display: flex;
  gap: 8px;
}

.meta-tag {
  font-size: 12px;
  padding: 2px 8px;
  background: #E8F3FF;
  color: #1677FF;
  border-radius: 2px;
}

.meta-source {
  font-size: 12px;
  color: #86909C;
}

.item-right {
  text-align: right;
}

.item-quantity {
  font-size: 14px;
  color: #86909C;
  margin-bottom: 4px;
}

.item-price {
  font-size: 16px;
  font-weight: 500;
  color: #1D2129;
}

/* 订单信息 */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #F0F0F0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  width: 100px;
  font-size: 14px;
  color: #86909C;
}

.info-value {
  flex: 1;
  font-size: 14px;
  color: #1D2129;
}

/* 订单金额 */
.order-summary-card {
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03);
  padding: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: #4E5969;
}

.summary-row.discount {
  color: #F53F3F;
}

.summary-row.total {
  font-size: 16px;
  font-weight: 500;
  color: #1D2129;
}

.total-price {
  font-size: 20px;
  color: #F53F3F;
  font-weight: 600;
}

.summary-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #F0F0F0;
}
</style>
