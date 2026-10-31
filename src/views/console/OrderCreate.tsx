import { useMemo, useState } from 'react'
import { Button, Card, Divider, Empty, Form, Input, Select, Switch, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/cart'
import styles from './OrderCreate.module.css'

interface OrderFormState {
  duration: number
  autoRenew: boolean
  couponCode: string
  couponDiscount: number
  remark: string
}

export default function OrderCreate() {
  const navigate = useNavigate()

  const cartItems = useCartStore((state) => state.cartItems)
  const removeSelected = useCartStore((state) => state.removeSelected)

  const [submitting, setSubmitting] = useState(false)
  const [orderForm, setOrderForm] = useState<OrderFormState>({
    duration: 1,
    autoRenew: false,
    couponCode: '',
    couponDiscount: 0,
    remark: ''
  })

  const selectedItems = useMemo(() => cartItems.filter((item) => item.selected), [cartItems])

  const totalPrice = useMemo(
    () => selectedItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [selectedItems]
  )

  const finalPrice = totalPrice - orderForm.couponDiscount

  const patchOrderForm = (patch: Partial<OrderFormState>) => {
    setOrderForm((prev) => ({ ...prev, ...patch }))
  }

  const handleApplyCoupon = () => {
    if (!orderForm.couponCode.trim()) {
      message.warning('请输入优惠券码')
      return
    }

    // 模拟优惠券验证
    if (orderForm.couponCode === 'SAVE100') {
      patchOrderForm({ couponDiscount: 100 })
      message.success('优惠券使用成功，已优惠 ¥100')
    } else if (orderForm.couponCode === 'SAVE200') {
      patchOrderForm({ couponDiscount: 200 })
      message.success('优惠券使用成功，已优惠 ¥200')
    } else {
      message.error('无效的优惠券码')
    }
  }

  const handleSubmitOrder = async () => {
    if (selectedItems.length === 0) {
      message.warning('请选择要购买的商品')
      return
    }

    setSubmitting(true)

    try {
      // 模拟订单提交
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 生成订单号
      const orderId = 'ORD' + Date.now()

      message.success(`订单提交成功！订单号：${orderId}`)

      // 清空已购买的商品
      removeSelected()

      // 跳转到订单详情页面
      setTimeout(() => {
        navigate(`/console/order-detail?orderId=${orderId}`)
      }, 1500)
    } catch {
      message.error('订单提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.orderCreatePage}>
      <div className={styles.pageHeader}>
        <h2>确认订单</h2>
        <p>请确认您要购买的资源信息</p>
      </div>

      {cartItems.length === 0 ? (
        <div className={styles.emptyBox}>
          <Empty description="购物车为空，请先添加资源到购物车" />
          <Button type="primary" onClick={() => navigate('/main/market')}>
            去选购
          </Button>
        </div>
      ) : (
        <div className={styles.orderContent}>
          {/* 订单商品列表 */}
          <Card
            className={styles.orderCard}
            title={
              <div className={styles.cardHeader}>
                <span>订单商品</span>
                <span className={styles.itemCount}>共 {selectedItems.length} 件</span>
              </div>
            }
          >
            <div className={styles.orderItems}>
              {selectedItems.map((item) => (
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
            <Form
              className={styles.orderForm}
              labelCol={{ style: { width: 100 } }}
              wrapperCol={{ style: { flex: 1 } }}
            >
              <Form.Item label="购买时长">
                <Select
                  style={{ width: 200 }}
                  value={orderForm.duration}
                  onChange={(value) => patchOrderForm({ duration: value })}
                  options={[
                    { label: '1个月', value: 1 },
                    { label: '3个月', value: 3 },
                    { label: '6个月', value: 6 },
                    { label: '1年', value: 12 }
                  ]}
                />
              </Form.Item>

              <Form.Item label="自动续费">
                <Switch
                  checked={orderForm.autoRenew}
                  onChange={(checked) => patchOrderForm({ autoRenew: checked })}
                />
              </Form.Item>

              <Form.Item label="优惠券">
                <div className={styles.couponBox}>
                  <Input
                    value={orderForm.couponCode}
                    placeholder="请输入优惠券码"
                    style={{ width: 200 }}
                    onChange={(e) => patchOrderForm({ couponCode: e.target.value })}
                  />
                  <Button type="primary" onClick={handleApplyCoupon}>
                    使用
                  </Button>
                </div>
                {orderForm.couponDiscount > 0 && (
                  <div className={styles.couponInfo}>
                    已优惠 ¥{orderForm.couponDiscount.toLocaleString()}
                  </div>
                )}
              </Form.Item>

              <Form.Item label="备注">
                <Input.TextArea
                  rows={3}
                  value={orderForm.remark}
                  placeholder="选填，如有特殊需求请备注"
                  onChange={(e) => patchOrderForm({ remark: e.target.value })}
                />
              </Form.Item>
            </Form>
          </Card>

          {/* 订单金额 */}
          <Card className={styles.orderSummaryCard}>
            <div className={styles.summaryRow}>
              <span>商品总额</span>
              <span>¥{totalPrice.toLocaleString()}</span>
            </div>
            {orderForm.couponDiscount > 0 && (
              <div className={`${styles.summaryRow} ${styles.discount}`}>
                <span>优惠券折扣</span>
                <span>-¥{orderForm.couponDiscount.toLocaleString()}</span>
              </div>
            )}
            <Divider />
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>应付金额</span>
              <span className={styles.totalPrice}>¥{finalPrice.toLocaleString()}</span>
            </div>

            <div className={styles.summaryActions}>
              <Button onClick={() => navigate(-1)}>返回购物车</Button>
              <Button
                type="primary"
                size="large"
                loading={submitting}
                onClick={handleSubmitOrder}
              >
                提交订单
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
