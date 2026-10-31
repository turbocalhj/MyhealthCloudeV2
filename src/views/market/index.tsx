import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Checkbox, InputNumber, Select, message } from 'antd'
import {
  ArrowUpOutlined,
  FilterOutlined,
  LoadingOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { fetchMarketProducts } from '@/api/market'
import { useCartStore } from '@/store/cart'
import type { ComputingProduct } from '@/types'
import styles from './Market.module.css'

interface FilterForm {
  sourceSelf: string[]
  sourceMarket: string[]
  provinces: string[]
  cities: string[]
  gpuBrands: string[]
  gpuCounts: string[]
  subsidies: string[]
}

const SOURCE_SELF_OPTIONS = ['推理', '训练']
const SOURCE_MARKET_OPTIONS = ['健康云', '电信', '移动', '联通', '华数', '阿里云']
const PROVINCE_OPTIONS = [
  { label: '浙江省', value: '浙江省', disabled: false },
  { label: '内蒙古自治区', value: '内蒙古自治区', disabled: true },
  { label: '北京市', value: '北京市', disabled: false },
  { label: '上海市', value: '上海市', disabled: true },
  { label: '湖北省', value: '湖北省', disabled: true },
  { label: '安徽省', value: '安徽省', disabled: true },
  { label: '贵州省', value: '贵州省', disabled: true },
  { label: '江苏省', value: '江苏省', disabled: true }
]
const CITY_OPTIONS = [
  { label: '杭州市', value: '杭州市', disabled: false },
  { label: '北京市', value: '北京市', disabled: false },
  { label: '宁波市', value: '宁波市', disabled: false },
  { label: '温州市', value: '温州市', disabled: true },
  { label: '嘉兴市', value: '嘉兴市', disabled: false },
  { label: '湖州市', value: '湖州市', disabled: true },
  { label: '绍兴市', value: '绍兴市', disabled: false },
  { label: '金华市', value: '金华市', disabled: false },
  { label: '衢州市', value: '衢州市', disabled: false },
  { label: '舟山市', value: '舟山市', disabled: true },
  { label: '台州市', value: '台州市', disabled: true },
  { label: '丽水市', value: '丽水市', disabled: true }
]
const GPU_BRAND_OPTIONS = ['华为', '昆仑芯', '平头哥', '英伟达']
const GPU_COUNT_OPTIONS = ['8卡', '4卡', '2卡', '1卡']
const SUBSIDY_OPTIONS = ['50%', '30%', '20%', '无补贴']

const pageSize = 12

const initialFilter: FilterForm = {
  sourceSelf: [...SOURCE_SELF_OPTIONS],
  sourceMarket: [...SOURCE_MARKET_OPTIONS],
  provinces: ['浙江省', '北京市'],
  cities: ['杭州市', '北京市', '宁波市', '嘉兴市', '绍兴市', '金华市', '衢州市'],
  gpuBrands: [...GPU_BRAND_OPTIONS],
  gpuCounts: [...GPU_COUNT_OPTIONS],
  subsidies: [...SUBSIDY_OPTIONS]
}

export default function Market() {
  const navigate = useNavigate()
  const cartStore = useCartStore()

  const [allProducts, setAllProducts] = useState<ComputingProduct[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isFixedTop, setIsFixedTop] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const [filterForm, setFilterForm] = useState<FilterForm>(initialFilter)
  const [sortValue, setSortValue] = useState('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearchQuery, setActiveSearchQuery] = useState('')
  const [priceMin, setPriceMin] = useState<number | null>(null)
  const [priceMax, setPriceMax] = useState<number | null>(null)
  const [activePriceMin, setActivePriceMin] = useState<number | null>(null)
  const [activePriceMax, setActivePriceMax] = useState<number | null>(null)

  const [pagedCount, setPagedCount] = useState(pageSize)
  const [loadingMore, setLoadingMore] = useState(false)
  const loadingMoreRef = useRef(false)
  const firstRenderRef = useRef(true)

  const [btnLoadingMap, setBtnLoadingMap] = useState<Record<string, boolean>>({})
  const loadMoreAnchor = useRef<HTMLDivElement | null>(null)

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        if (product.metaSourceType === '自营') {
          if (filterForm.sourceSelf.length === 0) return false
        } else if (!filterForm.sourceMarket.includes(product.metaSubSource)) {
          return false
        }
        if (!filterForm.provinces.includes(product.metaProvince)) return false
        if (!filterForm.cities.includes(product.metaCity)) return false
        if (!filterForm.gpuBrands.includes(product.metaGpuBrand)) return false
        if (!filterForm.gpuCounts.includes(product.metaGpuCount)) return false
        if (!filterForm.subsidies.includes(product.metaSubsidy)) return false

        if (activePriceMin !== null && product.price < activePriceMin) return false
        if (activePriceMax !== null && product.price > activePriceMax) return false

        if (activeSearchQuery.trim()) {
          const q = activeSearchQuery.toLowerCase()
          const matchName = product.name.toLowerCase().includes(q)
          const matchGpu = product.gpuType.toLowerCase().includes(q)
          if (!matchName && !matchGpu) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortValue === 'priceAsc') return a.price - b.price
        if (sortValue === 'priceDesc') return b.price - a.price
        const getSubsidy = (s: string) => (s === '无补贴' ? 0 : parseInt(s, 10))
        if (sortValue === 'subsidyAsc') return getSubsidy(a.metaSubsidy) - getSubsidy(b.metaSubsidy)
        if (sortValue === 'subsidyDesc') return getSubsidy(b.metaSubsidy) - getSubsidy(a.metaSubsidy)
        return 0
      })
  }, [allProducts, filterForm, sortValue, activeSearchQuery, activePriceMin, activePriceMax])

  const displayProducts = filteredProducts.slice(0, pagedCount)
  const hasMore = pagedCount < filteredProducts.length

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchMarketProducts()
        setAllProducts(res)
      } catch {
        message.error('拉取算力资源失败')
      } finally {
        setPageLoading(false)
        window.setTimeout(() => {
          setIsFirstRender(false)
          firstRenderRef.current = false
        }, 600)
      }
    }
    load()
  }, [])

  useEffect(() => {
    setPagedCount(pageSize)
  }, [filteredProducts, sortValue])

  useEffect(() => {
    const handleScroll = () => {
      if (firstRenderRef.current) return
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      if (scrollTop > 100) {
        setIsFixedTop(true)
        setIsCollapsed(true)
      } else {
        setIsFixedTop(false)
        setIsCollapsed(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (pageLoading) return
    let observer: IntersectionObserver | null = null
    const timer = window.setTimeout(() => {
      const node = loadMoreAnchor.current
      if (!node) return
      observer = new IntersectionObserver(
        (entries) => {
          const target = entries[0]
          if (target.isIntersecting && !loadingMoreRef.current && pagedCount < filteredProducts.length) {
            loadingMoreRef.current = true
            setLoadingMore(true)
            window.setTimeout(() => {
              setPagedCount((count) => count + pageSize)
              setLoadingMore(false)
              loadingMoreRef.current = false
            }, 800)
          }
        },
        { rootMargin: '100px' }
      )
      observer.observe(node)
    }, 100)
    return () => {
      window.clearTimeout(timer)
      observer?.disconnect()
    }
  }, [pageLoading, pagedCount, filteredProducts.length])

  const updateFilter = (patch: Partial<FilterForm>) => {
    setFilterForm((prev) => ({ ...prev, ...patch }))
  }

  const handleAddToCart = (product: ComputingProduct) => {
    const key = `cart-${product.id}`
    if (btnLoadingMap[key]) return
    setBtnLoadingMap((prev) => ({ ...prev, [key]: true }))

    window.setTimeout(() => {
      if (cartStore.addCartItem(product)) {
        message.success('成功加入购物车！')
      }
      setBtnLoadingMap((prev) => ({ ...prev, [key]: false }))
    }, 400)
  }

  const handleBuyNow = (product: ComputingProduct) => {
    const key = `buy-${product.id}`
    if (btnLoadingMap[key]) return
    setBtnLoadingMap((prev) => ({ ...prev, [key]: true }))

    window.setTimeout(() => {
      cartStore.addCartItem(product)
      cartStore.openCartDrawer()
      setBtnLoadingMap((prev) => ({ ...prev, [key]: false }))
    }, 400)
  }

  const goToDetail = useCallback(
    (product: ComputingProduct) => {
      navigate(`/main/market-detail?id=${product.id}`)
    },
    [navigate]
  )

  const triggerSearch = () => setActiveSearchQuery(searchQuery)

  const renderFilterGroup = (
    label: string,
    allValues: string[],
    selected: string[],
    onChange: (values: string[]) => void,
    options: { label: string; value: string; disabled?: boolean }[] = allValues.map((value) => ({
      label: value,
      value
    }))
  ) => (
    <div className={styles.subGroup}>
      <span className={styles.subLabel}>{label}</span>
      <Checkbox
        className={styles.filterCheckbox}
        checked={selected.length === allValues.length && allValues.length > 0}
        onChange={(e) => onChange(e.target.checked ? [...allValues] : [])}
      >
        全选
      </Checkbox>
      <Checkbox.Group
        value={selected}
        onChange={(values) => onChange(values as string[])}
        options={options}
        className={styles.checkboxGroup}
      />
    </div>
  )

  return (
    <div className={styles.marketPageWrapper}>
      {isFixedTop && <div className={styles.filterPlaceholderBar} />}

      <div
        className={`${styles.filterWrapper} ${isFirstRender ? styles.filterSlideIn : ''} ${
          isFixedTop ? styles.filterFixedTop : ''
        }`}
      >
        <div className={styles.filterContainer}>
          <div className={styles.filterHeader} onClick={() => setIsCollapsed((v) => !v)}>
            <div className={styles.filterHeaderLeft}>
              <FilterOutlined className={styles.filterIcon} />
              <span className={styles.filterTitleText}>筛选</span>
            </div>
            <ArrowUpOutlined
              className={isCollapsed ? styles.arrowRotate : undefined}
              style={{ transition: 'transform 0.3s ease' }}
            />
          </div>

          <div className={styles.filterBody} style={{ display: isCollapsed ? 'none' : 'flex' }}>
            <div className={styles.filterRow}>
              <div className={styles.rowLabel}>算力来源</div>
              <div className={styles.rowContent}>
                {renderFilterGroup(
                  '自营算力',
                  SOURCE_SELF_OPTIONS,
                  filterForm.sourceSelf,
                  (values) => updateFilter({ sourceSelf: values })
                )}
                {renderFilterGroup(
                  '市场算力',
                  SOURCE_MARKET_OPTIONS,
                  filterForm.sourceMarket,
                  (values) => updateFilter({ sourceMarket: values })
                )}
              </div>
            </div>

            <div className={styles.filterRow}>
              <div className={styles.rowLabel}>选择地域</div>
              <div className={styles.rowContent}>
                {renderFilterGroup(
                  '省份',
                  ['浙江省', '北京市'],
                  filterForm.provinces,
                  (values) => updateFilter({ provinces: values }),
                  PROVINCE_OPTIONS
                )}
                {renderFilterGroup(
                  '城市',
                  ['杭州市', '北京市', '宁波市', '嘉兴市', '绍兴市', '金华市', '衢州市'],
                  filterForm.cities,
                  (values) => updateFilter({ cities: values }),
                  CITY_OPTIONS
                )}
              </div>
            </div>

            <div className={styles.filterRow}>
              <div className={styles.rowLabel}>GPU品牌</div>
              <div className={styles.rowContent}>
                {renderFilterGroup(
                  '品牌',
                  GPU_BRAND_OPTIONS,
                  filterForm.gpuBrands,
                  (values) => updateFilter({ gpuBrands: values })
                )}
              </div>
            </div>

            <div className={styles.filterRow}>
              <div className={styles.rowLabel}>显卡数量</div>
              <div className={styles.rowContent}>
                {renderFilterGroup(
                  '数量',
                  GPU_COUNT_OPTIONS,
                  filterForm.gpuCounts,
                  (values) => updateFilter({ gpuCounts: values })
                )}
              </div>
            </div>

            <div className={styles.filterRow}>
              <div className={styles.rowLabel}>算力补贴</div>
              <div className={styles.rowContent}>
                {renderFilterGroup(
                  '补贴',
                  SUBSIDY_OPTIONS,
                  filterForm.subsidies,
                  (values) => updateFilter({ subsidies: values })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.marketToolbar}>
        <div className={styles.toolbarLeft}>
          <span className={styles.totalCountText}>
            共 <span className={styles.countHighlight}>{filteredProducts.length}</span> 个算力产品
          </span>
        </div>
        <div className={styles.toolbarRight}>
          <div className={styles.priceFilterBox}>
            <span className={styles.priceFilterLabel}>价格</span>
            <InputNumber
              size="small"
              min={0}
              precision={0}
              placeholder="最低"
              className={styles.priceInput}
              value={priceMin}
              onChange={(value) => {
                setPriceMin(value ?? null)
                setActivePriceMin(value ?? null)
              }}
              controls={false}
            />
            <span className={styles.priceSeparator}>-</span>
            <InputNumber
              size="small"
              min={0}
              precision={0}
              placeholder="最高"
              className={styles.priceInput}
              value={priceMax}
              onChange={(value) => {
                setPriceMax(value ?? null)
                setActivePriceMax(value ?? null)
              }}
              controls={false}
            />
          </div>

          <Select
            value={sortValue}
            className={styles.sortSelector}
            onChange={(value) => setSortValue(value)}
            options={[
              { label: '默认排序', value: 'default' },
              { label: '价格从低到高', value: 'priceAsc' },
              { label: '价格从高到低', value: 'priceDesc' },
              { label: '补贴比例从低到高', value: 'subsidyAsc' },
              { label: '补贴比例从高到低', value: 'subsidyDesc' }
            ]}
          />

          <div className={styles.searchInputBox}>
            <input
              className={styles.nativeSearchInput}
              type="text"
              placeholder="输入内容查询"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') triggerSearch()
              }}
            />
            <button type="button" className={styles.searchActionBtn} onClick={triggerSearch}>
              <SearchOutlined />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.marketGridContainer}>
        {pageLoading ? (
          <div className={styles.loadingStatusBox} style={{ padding: '100px 0', justifyContent: 'center' }}>
            <LoadingOutlined spin style={{ fontSize: 24 }} />
            <span className={styles.loadingText} style={{ fontSize: 16 }}>
              正在拉取算力资源...
            </span>
          </div>
        ) : (
          <>
            {displayProducts.length === 0 ? (
              <div className={styles.emptyPlaceholder}>暂无符合筛选条件的算力产品</div>
            ) : (
              <div className={styles.marketCardGrid}>
                {displayProducts.map((product) => (
                  <div
                    className={styles.productCard}
                    key={product.id}
                    onClick={() => goToDetail(product)}
                  >
                    <div className={styles.cardTag}>{product.marketTag}</div>

                    <div className={styles.cardHeader}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <div className={styles.productLabels}>
                        {product.labels.map((label, idx) => (
                          <span className={styles.label} key={idx}>
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.specsMatrix}>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>显卡型号</span>
                        <span className={styles.specValue}>{product.gpuType}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>显卡数量</span>
                        <span className={styles.specValue}>{product.gpuCount}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>显存容量</span>
                        <span className={styles.specValue}>{product.memory}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>CPU</span>
                        <span className={styles.specValue}>{product.cpu}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>内存</span>
                        <span className={styles.specValue}>{product.ram}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>系统盘</span>
                        <span className={styles.specValue}>{product.disk}</span>
                      </div>
                    </div>

                    <div className={styles.productPriceRow}>
                      <div className={styles.productPrice}>
                        <span className={styles.priceSymbol}>¥</span>
                        <span className={styles.priceValue}>{product.price.toLocaleString()}</span>
                        <span className={styles.priceUnit}>{product.priceUnit}</span>
                      </div>
                    </div>

                    <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                      {!product.isOutOfStock ? (
                        <>
                          <Button
                            size="small"
                            className={styles.addCartBtn}
                            loading={!!btnLoadingMap[`cart-${product.id}`]}
                            onClick={() => handleAddToCart(product)}
                          >
                            加入购物车
                          </Button>
                          <Button
                            type="primary"
                            size="small"
                            className={styles.buyNowBtn}
                            loading={!!btnLoadingMap[`buy-${product.id}`]}
                            onClick={() => handleBuyNow(product)}
                          >
                            立即购买
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="small" className={styles.stockoutBtn} disabled>
                            暂无库存
                          </Button>
                          <Button type="primary" size="small" className={styles.demandBtn}>
                            需求登记
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div ref={loadMoreAnchor} className={styles.infiniteLoadTrigger}>
              {loadingMore && hasMore && (
                <div className={styles.loadingStatusBox}>
                  <LoadingOutlined spin />
                  <span className={styles.loadingText}>正在加载更多产品...</span>
                </div>
              )}
              {!hasMore && displayProducts.length > 0 && (
                <div className={styles.noMoreStatus}>已加载全部产品</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
