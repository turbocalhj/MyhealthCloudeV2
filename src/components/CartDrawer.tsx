import { useNavigate } from 'react-router-dom'
import { Button, Checkbox, Drawer, Empty, Modal, message } from 'antd'
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { useCartStore } from '@/store/cart'
import styles from './CartDrawer.module.css'

const isLoggedNow = (): boolean =>
  !!localStorage.getItem('accessToken') || localStorage.getItem('isPlatformLogged') === 'true'

export default function CartDrawer() {
  const navigate = useNavigate()

  const cartItems = useCartStore((state) => state.cartItems)
  const cartDrawerVisible = useCartStore((state) => state.cartDrawerVisible)
  const selectedTotalPrice = useCartStore((state) => state.selectedTotalPrice)
  const selectedCount = useCartStore((state) => state.selectedCount)
  const isAllSelected = useCartStore((state) => state.isAllSelected)
  const closeCartDrawer = useCartStore((state) => state.closeCartDrawer)
  const toggleSelectAll = useCartStore((state) => state.toggleSelectAll)
  const toggleSelect = useCartStore((state) => state.toggleSelect)
  const removeSelected = useCartStore((state) => state.removeSelected)
  const clearCart = useCartStore((state) => state.clearCart)
  const removeCartItem = useCartStore((state) => state.removeCartItem)
  const increaseQuantity = useCartStore((state) => state.increaseQuantity)
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity)

  const handleClearCart = () => {
    Modal.confirm({
      title: '提示',
      content: '确定要清空购物车吗？',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      onOk: () => {
        clearCart()
        message.success('购物车已清空')
      }
    })
  }

  const handleCheckout = () => {
    if (!isLoggedNow()) {
      closeCartDrawer()
      Modal.confirm({
        title: '提示',
        content: '登录已过期，请重新登录',
        okText: '立即登录',
        cancelText: '取消',
        onOk: () => navigate('/login')
      })
      return
    }

    if (selectedCount === 0) {
      message.warning('请先选择要结算的商品')
      return
    }

    closeCartDrawer()
    navigate('/console/order-create')
  }

  const footer =
    cartItems.length > 0 ? (
      <div className={styles.cartFooterActions}>
        <div className={styles.cartTotal}>
          <span className={styles.totalLabel}>已选 {selectedCount} 件</span>
          <span className={styles.totalPrice}>¥{selectedTotalPrice.toLocaleString()}</span>
        </div>
        <div className={styles.footerButtons}>
          <Button onClick={closeCartDrawer}>关闭</Button>
          <Button type="primary" onClick={handleCheckout} disabled={selectedCount === 0}>
            去结算
          </Button>
        </div>
      </div>
    ) : null

  return (
    <Drawer
      title="购物车与资源申请列表"
      placement="right"
      width={480}
      open={cartDrawerVisible}
      onClose={closeCartDrawer}
      destroyOnClose
      footer={footer}
      className={styles.cartDrawer}
    >
      {cartItems.length > 0 ? (
        <>
          <div className={styles.cartToolbar}>
            <Checkbox checked={isAllSelected} onChange={() => toggleSelectAll()}>
              全选
            </Checkbox>
            <div className={styles.toolbarActions}>
              <Button size="small" onClick={removeSelected} disabled={selectedCount === 0}>
                删除选中
              </Button>
              <Button size="small" danger onClick={handleClearCart}>
                清空购物车
              </Button>
            </div>
          </div>

          <div className={styles.cartDrawerContent}>
            <div className={styles.cartList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartCard}>
                  <Checkbox
                    className={styles.cartCheckbox}
                    checked={item.selected}
                    onChange={() => toggleSelect(item.id)}
                  />

                  <div className={styles.cartItemContent}>
                    <div className={styles.cartItemHeader}>
                      <div className={styles.cartItemTitle}>{item.name}</div>
                      <CloseOutlined
                        className={styles.cartDeleteBtn}
                        onClick={() => removeCartItem(item.id)}
                      />
                    </div>

                    <div className={styles.cartItemSpecs}>
                      <span>{item.gpuType}</span> | <span>{item.gpuCount}</span>
                    </div>

                    <div className={styles.cartItemBottom}>
                      <span className={styles.providerTag}>{item.marketTag}</span>

                      <div className={styles.quantityControl}>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          <MinusOutlined />
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() => increaseQuantity(item.id)}
                        >
                          <PlusOutlined />
                        </button>
                      </div>
                    </div>

                    <div className={styles.cartItemPriceRow}>
                      <span className={styles.cartItemPrice}>
                        ¥{(item.price * item.quantity).toLocaleString()}
                        <span className={styles.unit}>/{item.priceUnit}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.emptyCartBox}>
          <Empty description="您的购物车空空如也，快去选购吧" />
        </div>
      )}
    </Drawer>
  )
}
