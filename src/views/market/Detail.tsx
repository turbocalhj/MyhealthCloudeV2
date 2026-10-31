import { useEffect, useState } from 'react'
import { Breadcrumb, Button, Card, Empty, message } from 'antd'
import { LoadingOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchMarketProducts } from '@/api/market'
import { useCartStore } from '@/store/cart'
import type { ComputingProduct } from '@/types'
import styles from './Detail.module.css'

const specRows = [
  { label: '显卡型号', key: 'gpuType' },
  { label: '显卡数量', key: 'gpuCount' },
  { label: '显存容量', key: 'memory' },
  { label: 'CPU', key: 'cpu' },
  { label: '内存', key: 'ram' },
  { label: '系统盘', key: 'disk' }
] as const

export default function MarketDetail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const cartStore = useCartStore()

  const [product, setProduct] = useState<ComputingProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const products = await fetchMarketProducts()
        const id = Number(searchParams.get('id'))
        setProduct(products.find((item) => item.id === id) || null)
      } catch {
        message.error('加载商品信息失败')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [searchParams])

  const handleAddToCart = () => {
    if (!product) return
    setBtnLoading(true)
    window.setTimeout(() => {
      if (cartStore.addCartItem(product)) {
        message.success('成功加入购物车！')
      }
      setBtnLoading(false)
    }, 400)
  }

  const handleBuyNow = () => {
    if (!product) return
    setBtnLoading(true)
    window.setTimeout(() => {
      cartStore.addCartItem(product)
      cartStore.openCartDrawer()
      setBtnLoading(false)
    }, 400)
  }

  return (
    <div className={styles.productDetailPage}>
      <div className={styles.detailBreadcrumb}>
        <Breadcrumb
          separator="/"
          items={[
            { title: <a onClick={() => navigate('/main/market')}>智算超市</a> },
            { title: '商品详情' }
          ]}
        />
      </div>

      {loading ? (
        <div className={styles.loadingBox}>
          <LoadingOutlined spin style={{ fontSize: 32 }} />
          <p>正在加载商品信息...</p>
        </div>
      ) : !product ? (
        <div className={styles.notFoundBox}>
          <Empty description="未找到该商品" />
          <Button type="primary" onClick={() => navigate('/main/market')}>
            返回智算超市
          </Button>
        </div>
      ) : (
        <div className={styles.detailContent}>
          <Card className={styles.infoCard} variant="borderless">
            <div className={styles.productHeader}>
              <div className={styles.productTag}>{product.marketTag}</div>
              <h1 className={styles.productTitle}>{product.name}</h1>
              <div className={styles.productLabels}>
                {product.labels.map((label, idx) => (
                  <span className={styles.labelTag} key={idx}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.productPriceSection}>
              <div className={styles.priceDisplay}>
                <span className={styles.priceSymbol}>¥</span>
                <span className={styles.priceNumber}>{product.price.toLocaleString()}</span>
                <span className={styles.priceUnit}>{product.priceUnit}</span>
              </div>
              {product.metaSubsidy !== '无补贴' && (
                <div className={styles.subsidyBadge}>算力补贴 {product.metaSubsidy}</div>
              )}
            </div>
          </Card>

          <Card className={styles.infoCard} variant="borderless">
            <h3 className={styles.cardTitle}>配置详情</h3>
            <div className={styles.specsTable}>
              {specRows.map((row) => (
                <div className={styles.specRow} key={row.key}>
                  <span className={styles.specLabel}>{row.label}</span>
                  <span className={styles.specValue}>{product[row.key]}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className={styles.infoCard} variant="borderless">
            <h3 className={styles.cardTitle}>供给方信息</h3>
            <div className={styles.providerInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>来源类型</span>
                <span className={styles.infoValue}>{product.metaSourceType}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>供给方</span>
                <span className={styles.infoValue}>{product.metaSubSource}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>所在地</span>
                <span className={styles.infoValue}>
                  {product.metaProvince} {product.metaCity}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>GPU品牌</span>
                <span className={styles.infoValue}>{product.metaGpuBrand}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>显卡数量</span>
                <span className={styles.infoValue}>{product.metaGpuCount}</span>
              </div>
            </div>
          </Card>

          <div className={styles.actionBar}>
            <Button
              size="large"
              className={styles.addCartBtn}
              loading={btnLoading}
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
            >
              加入购物车
            </Button>
            <Button
              type="primary"
              size="large"
              className={styles.buyNowBtn}
              loading={btnLoading}
              onClick={handleBuyNow}
            >
              立即购买
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
