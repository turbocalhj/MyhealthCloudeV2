import { useMemo, useState } from 'react'
import { Button, Card, Divider, Modal, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './OrderDetail.module.css'

interface OrderItemRow {
  id: string
  name: string
  gpuType: string
  gpuCount: string
  memory: string
  marketTag: string
  metaSubSource: string
  price: number
  quantity: number
}

interface OrderInfo {
  orderId: string
  status: string
  createTime: string
  payTime: string
  duration: number
  autoRenew: boolean
  couponCode: string
  couponDiscount: number
  remark: string
  totalPrice: number
  finalPrice: number
  items: OrderItemRow[]
}

interface StatusStep {
  label: string
  time: string
  active: boolean
  completed: boolean
}

export default function OrderDetail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 从路由参数获取订单ID
  const routeOrderId = searchParams.get('orderId') || ''

  // 模拟订单数据
  const [orderInfo, setOrderInfo] = useState<OrderInfo>(() => ({
    orderId: routeOrderId || 'ORD202606101246282536',
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
  }))

  const patchOrderInfo = (patch: Partial<OrderInfo>) => {
    setOrderInfo((prev) => ({ ...prev, ...patch }))
  }

  // 状态步骤
  const statusSteps = useMemo<StatusStep[]>(() => {
    const steps: StatusStep[] = [
      { label: '提交订单', time: orderInfo.createTime, active: true, completed: true }
    ]

    if (['已支付', '处理中', '已完成'].includes(orderInfo.status)) {
      steps.push({
        label: '支付成功',
        time: orderInfo.payTime || '2026-06-10 13:00:00',
        active: orderInfo.status === '已支付',
        completed: ['处理中', '已完成'].includes(orderInfo.status)
      })
    }

    if (['处理中', '已完成'].includes(orderInfo.status)) {
      steps.push({
        label: '资源准备中',
        time: '2026-06-10 14:00:00',
        active: orderInfo.status === '处理中',
        completed: orderInfo.status === '已完成'
      })
    }

    if (orderInfo.status === '已完成') {
      steps.push({
        label: '资源就绪',
        time: '2026-06-10 16:00:00',
        active: true,
        completed: true
      })
    }

    if (orderInfo.status === '已取消') {
      steps.push({
        label: '订单已取消',
        time: '2026-06-10 13:00:00',
        active: true,
        completed: true
      })
    }

    return steps
  }, [orderInfo.status, orderInfo.createTime, orderInfo.payTime])

  const getStatusClass = (status: string): string => {
    const classMap: Record<string, string> = {
      待支付: styles.statusPendingPay,
      已支付: styles.statusPaid,
      处理中: styles.statusProcessing,
      已完成: styles.statusCompleted,
      已取消: styles.statusCancelled
    }
    return classMap[status] || ''
  }

  const handlePay = () => {
    Modal.confirm({
      title: '支付确认',
      content: '确认支付该订单？',
      okText: '确认支付',
      cancelText: '取消',
      onOk: async () => {
        // 模拟支付
        await new Promise((resolve) => setTimeout(resolve, 1000))
        patchOrderInfo({
          status: '已支付',
          payTime: new Date().toLocaleString()
        })
        message.success('支付成功！')
      }
    })
  }

  const handleCancel = () => {
    Modal.confirm({
      title: '取消确认',
      content: '确认取消该订单？取消后无法恢复。',
      okText: '确认取消',
      cancelText: '返回',
      okButtonProps: { danger: true },
      onOk: () => {
        patchOrderInfo({ status: '已取消' })
        message.success('订单已取消')
      }
    })
  }

  const handleUse = () => {
    navigate('/console/dashboard')
    message.success('正在跳转到控制台...')
  }

  return (
    <div className={styles.orderDetailPage}>
      <div className={styles.pageHeader}>
        <Button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeftOutlined /> 返回
        </Button>
        <h2>订单详情</h2>
        <p>订单号：{orderInfo.orderId}</p>
      </div>

      <div className={styles.orderContent}>
        {/* 订单状态 */}
        <Card
          className={styles.orderCard}
          title={
            <div className={styles.cardHeader}>
              <span>订单状态</span>
              <span className={`${styles.statusBadge} ${getStatusClass(orderInfo.status)}`}>
                {orderInfo.status}
              </span>
            </div>
          }
        >
          <div className={styles.statusTimeline}>
            {statusSteps.map((step, index) => (
              <div
                className={[
                  styles.timelineStep,
                  step.active ? styles.active : '',
                  step.completed ? styles.completed : ''
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={index}
              >
                <div className={styles.stepDot}></div>
                <div className={styles.stepLabel}>{step.label}</div>
                <div className={styles.stepTime}>{step.time}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 订单商品 */}
        <Card className={styles.orderCard} title={<span>订单商品</span>}>
          <div className={styles.orderItems}>
            {orderInfo.items.map((item) => (
              <div className={styles.orderItem} key={item.id}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemSpecs}>
                    {item.gpuType} | {item.gpuCount} | {item.memory}
                  </div>
                  <div className={styles.itemMeta}>
                    <span className={styles.metaTag}>{item.marketTag}</span>
                    <span className={styles.metaSource}>{item.metaSubSource}</span>
                  </div>
                </div>
                <div className={styles.itemRight}>
                  <div className={styles.itemQuantity}>x{item.quantity}</div>
                  <div className={styles.itemPrice}>
                    ¥{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 订单信息 */}
        <Card className={styles.orderCard} title={<span>订单信息</span>}>
          <div className={styles.infoGrid}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>订单号</span>
              <span className={styles.infoValue}>{orderInfo.orderId}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>创建时间</span>
              <span className={styles.infoValue}>{orderInfo.createTime}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>支付时间</span>
              <span className={styles.infoValue}>{orderInfo.payTime || '-'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>购买时长</span>
              <span className={styles.infoValue}>{orderInfo.duration}个月</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>自动续费</span>
              <span className={styles.infoValue}>{orderInfo.autoRenew ? '已开启' : '未开启'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>优惠券</span>
              <span className={styles.infoValue}>{orderInfo.couponCode || '未使用'}</span>
            </div>
            {orderInfo.remark && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>备注</span>
                <span className={styles.infoValue}>{orderInfo.remark}</span>
              </div>
            )}
          </div>
        </Card>

        {/* 订单金额 */}
        <Card className={styles.orderSummaryCard}>
          <div className={styles.summaryRow}>
            <span>商品总额</span>
            <span>¥{orderInfo.totalPrice.toLocaleString()}</span>
          </div>
          {orderInfo.couponDiscount > 0 && (
            <div className={`${styles.summaryRow} ${styles.discount}`}>
              <span>优惠券折扣</span>
              <span>-¥{orderInfo.couponDiscount.toLocaleString()}</span>
            </div>
          )}
          <Divider />
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>实付金额</span>
            <span className={styles.totalPrice}>¥{orderInfo.finalPrice.toLocaleString()}</span>
          </div>

          <div className={styles.summaryActions}>
            {orderInfo.status === '待支付' && (
              <Button type="primary" size="large" onClick={handlePay}>
                立即支付
              </Button>
            )}
            {orderInfo.status === '待支付' && <Button onClick={handleCancel}>取消订单</Button>}
            {orderInfo.status === '已完成' && (
              <Button type="primary" onClick={handleUse}>
                立即使用
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
