import { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import SeamlessScroll from '@/components/SeamlessScroll'
import bannerImage from '@/assets/images/home/Banner.png'
import providerImage from '@/assets/images/home/provider.png'
import policyImage from '@/assets/images/home/position.png'
import styles from './Home.module.css'

interface HomeProduct {
  id: number
  name: string
  marketTag: string
  labels: string[]
  gpuType: string
  gpuCount: string
  memory: string
  cpu: string
  ram: string
  disk: string
  price: number
  isOutOfStock?: boolean
}

interface Policy {
  id: number
  title: string
  desc: string
  source: string
  date: string
  url: string
}

const products: HomeProduct[] = [
  { id: 1, name: '联通裸金属新', marketTag: '市场算力', labels: ['自营算力', '萧山区', '资源充足'], gpuType: 'Huawei Atlas 300', gpuCount: '2 卡', memory: '64 GB', cpu: '128 核', ram: '512 GB', disk: '50 GB', price: 45689 },
  { id: 2, name: '联通裸金属GPU', marketTag: '市场算力', labels: ['自营算力', '拱墅区', '资源充足'], gpuType: 'Huawei Atlas 300', gpuCount: '1 卡', memory: '32 GB', cpu: '128 核', ram: '512 GB', disk: '50 GB', price: 343543 },
  { id: 3, name: '裸金属 昇腾 910B2-64GB', marketTag: '市场算力', labels: ['移动', '萧山区', '资源充足', '算力补贴30%'], gpuType: 'Huawei Ascend 910B2', gpuCount: '8 卡', memory: '64 GB', cpu: '192 核', ram: '2048 GB', disk: '960 GB', price: 60000 },
  { id: 4, name: '裸金属 英伟达T4-16G', marketTag: '市场算力', labels: ['移动', '萧山区', '资源充足', '算力补贴30%'], gpuType: 'NVIDIA T4', gpuCount: '8 卡', memory: '16 GB', cpu: '48 核', ram: '768 GB', disk: '960 GB', price: 16000 },
  { id: 5, name: 'NVIDIA V100S', marketTag: '自营算力', labels: ['自营算力', '萧山区', '资源充足', '算力补贴20%'], gpuType: '-', gpuCount: '-', memory: '-', cpu: '-', ram: '-', disk: '-', price: 4560 },
  { id: 6, name: '裸金属 昇腾 910B4-64GB', marketTag: '自营算力', labels: ['自营算力', '推理', '拱墅区', '暂无库存'], gpuType: 'Huawei Ascend 910B4', gpuCount: '8 卡', memory: '64 GB', cpu: '192 核', ram: '1024 GB', disk: '-', price: 28478, isOutOfStock: true },
  { id: 7, name: '裸金属 昆仑芯 P800-96GB', marketTag: '自营算力', labels: ['自营算力', '推理', '拱墅区', '暂无库存'], gpuType: 'KUNLUNXIN GPU-P800', gpuCount: '8 卡', memory: '96 GB', cpu: '128 核', ram: '1536 GB', disk: '446 GB', price: 29425, isOutOfStock: true },
  { id: 8, name: '裸金属 英伟达 V100S-32GB', marketTag: '市场算力', labels: ['移动', '萧山区', '暂无库存', '算力补贴30%'], gpuType: 'NVIDIA V100S', gpuCount: '8 卡', memory: '32 GB', cpu: '48 核', ram: '768 GB', disk: '960 GB', price: 28000, isOutOfStock: true }
]

const policies: Policy[] = [
  {
    id: 2,
    title: '浙江省人民政府印发关于支持人工智能创新发展...',
    desc: '为抢占人工智能发展制高点，打造全球人工智能创新发展高地，提出如下措施。一、发展目标 坚持创新驱动发展战略...',
    source: '浙江省人民政府',
    date: '2025-05-26',
    url: 'https://www.zj.gov.cn/art/2025/5/16/art_1229017138_2555159.html'
  },
  {
    id: 3,
    title: '杭州市经济信息局（市数字经济局）关于组织开展...',
    desc: '各区、县（市）经信局（发改经信局、经济科技局）：根据《杭州市人民政府办公厅关于加快推进人工智能产业高质量发展的通知》...',
    source: '杭州市经济和信息化局',
    date: '2025-03-28',
    url: 'https://jxj.hangzhou.gov.cn/art/2025/3/28/art_1229252271_4342196.html'
  },
  {
    id: 4,
    title: '杭州市人民政府办公厅关于印发支持人工智能...',
    desc: '为抢抓人工智能新一轮发展机遇，积极实施"人工智能+"行动，推动杭州人工智能产业全产业链高质量发展特此...',
    source: '杭州市人民政府办公厅',
    date: '2024-07-23',
    url: 'https://www.hangzhou.gov.cn/art/2024/7/23/art_1229063382_1844867.html'
  },
  {
    id: 5,
    title: '关于组织开展2025年人工智能券（算力券）',
    desc: '各有关单位：根据国家相关通知要求，现面向全省开展2025年国家人工智能服务（算力券）兑付申报工作...',
    source: '浙江省发展和改革委员会',
    date: '2025-05-16',
    url: 'https://fzggw.zj.gov.cn/art/2025/5/16/art_1229629046_5509892.html'
  }
]

const POLICY_HERO_URL =
  'https://fzggw.zj.gov.cn/art/2025/5/16/art_1229629046_5509892.html'

export default function Home() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const providerSectionRef = useRef<HTMLDivElement | null>(null)
  const [isProviderVisible, setIsProviderVisible] = useState(false)

  useEffect(() => {
    const node = providerSectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsProviderVisible(true)
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const distance = currentPage === 1 ? 0 : currentPage === 2 ? -1626 : -1626 * 2
  const openPolicyLink = (url: string) => window.open(url, '_blank')

  return (
    <>
      <div className={styles.bannerContainer}>
        <div className={styles.bannerBackground}>
          <img src={bannerImage} alt="Banner图" className={styles.bannerImage} />
        </div>
        <div className={styles.bannerContent}>
          <div className={styles.bannerSubtitle}>算力普惠民生 · 智算赋能产业</div>
          <h1 className={styles.bannerTitle}>一体化算力服务平台</h1>
          <p className={styles.bannerDesc}>为全行业提供高性能算力、AI模型 service 及配套解决方案</p>
        </div>
      </div>

      <div className={styles.carouselSection}>
        <SeamlessScroll />
      </div>

      <div className={styles.productSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>算力产品</h2>
          <p className={styles.sectionDesc}>为不同场景提供专业的算力解决方案</p>
        </div>

        <div className={styles.productWindowWrapper}>
          <div
            className={styles.productTrack}
            style={{ transform: `translate3d(${distance}px, 0, 0)` }}
          >
            {products.map((product) => (
              <div className={styles.productCard} key={product.id}>
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
                    <span className={styles.priceUnit}>/月</span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  {!product.isOutOfStock ? (
                    <>
                      <Button size="small" className={styles.addCartBtn}>
                        加入购物车
                      </Button>
                      <Button type="primary" size="small" className={styles.buyNowBtn}>
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
        </div>

        <div className={styles.paginationDots}>
          {[1, 2, 3].map((page) => (
            <span
              key={page}
              className={`${styles.dot} ${currentPage === page ? styles.dotActive : ''}`}
              onClick={() => setCurrentPage(page)}
            />
          ))}
        </div>

        <div className={styles.viewAllLink}>
          <span onClick={() => navigate('/main/market')}>查看全部产品</span>
        </div>
      </div>

      <div
        className={`${styles.providerSection} ${isProviderVisible ? styles.animateStart : ''}`}
        ref={providerSectionRef}
      >
        <h2 className={styles.providerMainTitle}>供给方入驻</h2>

        <div className={styles.providerContent}>
          <div className={styles.providerLeftCard}>
            <h3 className={styles.providerCardSubTitle}>供给方入驻</h3>

            <div className={styles.providerTimelineWrapper}>
              <div className={`${styles.timelineNodeItem} ${styles.node1}`}>
                <span className={styles.itemBlueDot} />
                <div className={`${styles.dashedSegment} ${styles.line1}`} />
                <div className={styles.itemTextContent}>
                  <h4>供给方入驻</h4>
                  <p>接入平台统一调度系统，提升资源利用率</p>
                </div>
              </div>

              <div className={`${styles.timelineNodeItem} ${styles.node2}`}>
                <span className={styles.itemBlueDot} />
                <div className={`${styles.dashedSegment} ${styles.line2}`} />
                <div className={styles.itemTextContent}>
                  <h4>资源变现</h4>
                  <p>闲置算力快速变现，增加营收渠道</p>
                </div>
              </div>

              <div className={`${styles.timelineNodeItem} ${styles.node3}`}>
                <span className={styles.itemBlueDot} />
                <div className={`${styles.dashedSegment} ${styles.line3}`} />
                <div className={styles.itemTextContent}>
                  <h4>技术支持</h4>
                  <p>提供完善的技术对接和运维支持</p>
                </div>
              </div>

              <div className={`${styles.timelineNodeItem} ${styles.node4}`}>
                <span className={styles.itemBlueDot} />
                <div className={styles.itemTextContent}>
                  <h4>市场推广</h4>
                  <p>平台流量扶持，快速获取客户</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.providerVisual}>
            <img src={providerImage} alt="供给方入驻" className={styles.providerMainImg} />
          </div>
        </div>
      </div>

      <div className={styles.policySection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>政策专区</h2>
          <p className={styles.sectionDesc}>了解最新的算力政策与行业规范，获取优惠补贴信息</p>
        </div>

        <div className={styles.policyContent}>
          <div className={`${styles.policyHoverCard} ${styles.policyMainHero}`}>
            <div className={styles.policyImageBox}>
              <img src={policyImage} alt="政策主图" className={styles.heroImg} />
            </div>

            <div
              className={styles.heroCardBody}
              style={{ cursor: 'pointer' }}
              onClick={() => openPolicyLink(POLICY_HERO_URL)}
            >
              <h3 className={styles.policyCardTitle}>
                关于组织开展2025年人工智能券（算力券）兑付申报的通知
              </h3>
              <p className={styles.policyDesc}>
                各有关单位：根据国家相关通知要求，现面向全省开展2025年国家人工智能服务（算力券）兑付申报工作。现将有关事项通知如下：一、人工智能券（算力券）是国家使用超长期特别国债资金，试点推动形成人...
              </p>
              <div className={styles.policyMetaRow}>
                <span className={styles.metaSource}>发布单位：浙江省发展和改革委员会</span>
                <span className={styles.metaDate}>2025-05-16</span>
              </div>
            </div>
          </div>

          <div className={styles.policyGridBox}>
            {policies.map((policy) => (
              <div
                key={policy.id}
                className={`${styles.policyHoverCard} ${styles.policySubGridItem}`}
                onClick={() => openPolicyLink(policy.url)}
              >
                <h4 className={styles.policyCardTitle}>{policy.title}</h4>
                <p className={styles.policyGridDesc}>{policy.desc}</p>

                <div className={styles.gridItemFooter}>
                  <div className={styles.policyMetaRow}>
                    <span className={styles.metaSource}>发布单位：{policy.source}</span>
                    <span className={styles.metaDate}>{policy.date}</span>
                  </div>
                  <span className={styles.detailsLinkArrow}>了解详情 →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.viewAllLink}>
          <span>查看更多</span>
        </div>
      </div>

      <footer className={styles.globalPlatformFooter}>
        <div className={styles.footerMainContent}>
          <div className={`${styles.footerColumn} ${styles.columnLeft}`}>
            <h2 className={styles.footerBrandTitle}>算力调度运营平台</h2>
          </div>

          <div className={`${styles.footerColumn} ${styles.columnCenter}`}>
            <h3 className={styles.footerColumnTitle}>基本信息</h3>
            <ul className={styles.footerInfoList}>
              <li>
                <span className={styles.infoLabel}>联系邮箱：</span>
                <span className={styles.infoValue}>service@cs-xxxxxxxxxx-platform.com</span>
              </li>
              <li>
                <span className={styles.infoLabel}>联系地址：</span>
                <span className={styles.infoValue}>XX省XX市XX区智慧科创园区A栋商务中心</span>
              </li>
            </ul>
          </div>

          <div className={`${styles.footerColumn} ${styles.columnRight}`}>
            <h3 className={styles.footerColumnTitle}>联系我们</h3>
            <Button type="primary" className={styles.footerConsultBtn}>
              立即咨询
            </Button>
          </div>
        </div>

        <div className={styles.footerDividerLine} />

        <div className={styles.footerBottomBar}>
          <p className={styles.icpRecordText}>ICP备案编号：浙ICP备2024132127-3号</p>
          <p className={styles.copyrightText}>
            国家人工智能应用中试基地(医疗)-浙江版权所有 技术支持:国家人工智能应用中试基地(医疗)-浙江
          </p>
        </div>
      </footer>
    </>
  )
}
