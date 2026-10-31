import { useState } from 'react'
import { Empty } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './ApplyDetail.module.css'

interface ApplyInfo {
  applyId: string
  demander: string
  provider: string
  applicant: string
  applyTime: string
  price: string
}

interface ApplyTab {
  label: string
  key: string
}

interface ProductProperty {
  label: string
  value: string
  mono?: boolean
}

const DEFAULT_APPLY_INFO: ApplyInfo = {
  applyId: 'RA202606021006536985',
  demander: '测评中心',
  provider: '健康云',
  applicant: '张海洋',
  applyTime: '2026-06-02 10:06:53',
  price: '0.00'
}

const TAB_OPTIONS: ApplyTab[] = [
  { label: '产品清单', key: 'product' },
  { label: '审批记录', key: 'record' },
  { label: '资源列表', key: 'resource' }
]

const PRODUCT_PROPERTIES: ProductProperty[] = [
  { label: '实例名称', value: 'r43r', mono: true },
  { label: '登录名', value: 'root', mono: true },
  { label: '实例镜像', value: 'win2025_24H2_x64_dtc_en-us_40G_uefi...', mono: true },
  { label: '显卡型号', value: 'KUNLUNXIN GPU-R200' },
  { label: '显卡数量', value: '1 卡' },
  { label: '显存容量', value: '32GB' },
  { label: 'CPU', value: '1核' },
  { label: '内存', value: '1GB' },
  { label: '系统盘', value: 'cloud_efficiency / 40GB' },
  { label: 'VPC', value: 'default', mono: true },
  { label: '子网', value: 'test223', mono: true },
  { label: '安全组', value: 'sg-2zebbdw1401t5pt5cebm', mono: true }
]

export default function ApplyDetail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('product')

  const hasQuery = Array.from(searchParams.keys()).length > 0

  // 如果从列表携带了动态 query 矩阵则覆盖初始快照
  const applyInfo: ApplyInfo = hasQuery
    ? {
        applyId: searchParams.get('applyId') || DEFAULT_APPLY_INFO.applyId,
        demander: '测评中心',
        provider: '健康云',
        applicant: searchParams.get('applicant') || DEFAULT_APPLY_INFO.applicant,
        applyTime: searchParams.get('applyTime') || DEFAULT_APPLY_INFO.applyTime,
        price: searchParams.get('price') || DEFAULT_APPLY_INFO.price
      }
    : DEFAULT_APPLY_INFO

  return (
    <div className={styles.applyDetailContainer}>
      <div className={styles.detailNavigationHeader}>
        <ArrowLeftOutlined className={styles.backArrowBtn} onClick={() => navigate(-1)} />
        <span className={styles.applyIdText}>{applyInfo.applyId}</span>
        <span className={styles.statusBadgePending}>待审批</span>
      </div>

      <div className={styles.metadataSummaryInfobar}>
        <div className={styles.metaCell}>
          <span className={styles.lbl}>需求方：</span>
          <span className={styles.val}>{applyInfo.demander}</span>
        </div>
        <div className={styles.metaCell}>
          <span className={styles.lbl}>供给方：</span>
          <span className={styles.val}>{applyInfo.provider}</span>
        </div>
        <div className={styles.metaCell}>
          <span className={styles.lbl}>申请人：</span>
          <span className={styles.val}>{applyInfo.applicant}</span>
        </div>
        <div className={styles.metaCell}>
          <span className={styles.lbl}>申请时间：</span>
          <span className={styles.val}>{applyInfo.applyTime}</span>
        </div>
        <div className={styles.metaCell}>
          <span className={styles.lbl}>金额：</span>
          <span className={`${styles.val} ${styles.priceBlue}`}>¥{applyInfo.price}</span>
        </div>
      </div>

      <div className={styles.detailTabsNavigationStrip}>
        {TAB_OPTIONS.map((tab) => (
          <span
            key={tab.key}
            className={`${styles.stripItem} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </span>
        ))}
      </div>

      <div className={styles.tabContentBlockCanvas}>
        {activeTab === 'product' ? (
          <div className={styles.productSpecProfileCard}>
            <div className={styles.productMainHeaderRow}>
              <div className={styles.productTitleGroup}>
                <h3 className={styles.productMainTitle}>阿里公云-昆仑200</h3>
                <span className={styles.productSubLeaseLbl}>包年包月 | 1个月 | 1台</span>
              </div>
              <div className={styles.productPriceSummaryBox}>
                <div className={styles.discountPrice}>
                  <span className={styles.lblTxt}>优惠后金额</span>{' '}
                  <span className={styles.valNum}>¥0.00</span>
                </div>
                <div className={styles.originalPrice}>原价 ¥2,000.00</div>
              </div>
            </div>

            <div className={styles.hardwarePropertiesMatrixGrid}>
              {PRODUCT_PROPERTIES.map((prop) => (
                <div key={prop.label} className={styles.propCell}>
                  <span className={styles.pLbl}>{prop.label}</span>
                  <span className={`${styles.pVal} ${prop.mono ? styles.fontMono : ''}`}>
                    {prop.value}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.totalAggregateAmountBar}>
              <span className={styles.totalLbl}>合计金额</span>
              <span className={styles.totalVal}>¥0.00</span>
            </div>
          </div>
        ) : (
          <div className={styles.emptyPlaceholderBlock}>
            <Empty description="暂无历史流转记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
      </div>
    </div>
  )
}
