import { useState } from 'react'
import { Button } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import bannerImg from '@/assets/images/policy/banner.png'
import styles from './PolicyList.module.css'

type TabKey = 'province' | 'city' | 'district' | 'coupon'

interface PolicyTabOption {
  label: string
  key: TabKey
}

interface PolicyItem {
  title: string
  department: string
  date: string
  summary: string
}

const tabsOptions: PolicyTabOption[] = [
  { label: '省级政策', key: 'province' },
  { label: '市级政策', key: 'city' },
  { label: '区级政策', key: 'district' },
  { label: '算力券', key: 'coupon' }
]

const policyDataMatrix: Record<TabKey, PolicyItem[]> = {
  province: [
    {
      title: '关于组织开展2025年人工智能券（算力券）兑付申报的通知',
      department: '浙江省发展和改革委员会',
      date: '2025-05-16',
      summary:
        '各有关单位：根据国家相关通知要求，现面向全省开展2025年国家人工智能券（算力券）兑付申报工作。现将有关事项通知如下：一、人工智能券（算力券）是国家使用超长期特别国债资金，试点推动形成人工智能服务资源（算力）供给和需求侧良性循环，降低...'
    },
    {
      title: '浙江省人民政府印发关于支持人工智能创新发展若干措施的通知',
      department: '浙江省人民政府',
      date: '2025-05-16',
      summary:
        '为抢占人工智能发展制高点，打造全球人工智能创新发展高地，提出如下措施。一、发展目标 坚持创新驱动、企业主导、政府引导、生态共建，统筹布局算力、数据、模型基础设施，打造人工智能创新发展高地。到2027年，初步形成可持续发展、领跑发展格局，通用人工智能核心技术和...'
    }
  ],
  city: [
    {
      title: '杭州市经信局（市数字经济局）关于组织开展2025年算力券兑付申报的通知',
      department: '杭州市经济和信息化局',
      date: '2025-03-28',
      summary:
        '各区、县（市）经信局（发改经信局、经科技局）：根据《杭州市人民政府办公厅关于加快推进人工智能产业创新发展的实施意见》（杭政办函〔2023〕55号）和《支持人工智能全产业链高质量发展的若干措施》（杭政办函〔2024〕40号）等有关文件精神，经研究，决定开展2025年...'
    },
    {
      title: '杭州市人民政府办公厅关于印发支持人工智能全产业链高质量发展若干措施的通知',
      department: '杭州市人民政府办公厅',
      date: '2024-07-23',
      summary:
        '为抢抓人工智能新一轮发展机遇，积极实施“人工智能+”行动，推动杭州人工智能产业全产业链高质量发展，打造全国人工智能产业发展高地，特制定本措施。一、加快算力设施建设 （一）支持算力技术攻关。鼓励企业开展算力关键技术研发攻关，市级按照有关政策给予支持。鼓励企业承...'
    }
  ],
  district: [
    {
      title: '关于促进人工智能产业创新发展的若干政策（试行）',
      department: '萧山区人民政府',
      date: '2025-07-14',
      summary:
        '为全面贯彻落实中央、省、市关于发展新一代人工智能的重大决策部署，支持人工智能产业创新发展，构建人工智能产业生态，进一步助力萧山打造人工智能产业创新发展高地，特制定以下政策...'
    },
    {
      title: '杭州今年首批“算力券”发放 余航加快推进“两个5000万”政策落地',
      department: '余杭区人民政府',
      date: '2025-05-16',
      summary:
        '本报讯（记者 徐翘楚）记者从市经信局（市数字经济局）获悉，2025年杭州市“算力券”首批兑付开始，有3家企业获财政补贴的“算力券”，其中包括余航企业杭州核新软件技术有限公司。根据杭州市人民政府办公厅印发的《支持人工智能全产业链高质量发展的若干措施》，“算力券”支持企...'
    }
  ],
  coupon: [
    {
      title: '关于组织开展2025年人工智能券（算力券）兑付申报的通知',
      department: '浙江省发展和改革委员会',
      date: '2025-05-16',
      summary:
        '各有关单位：根据国家相关通知要求，现面向全省开展2025年国家人工智能券（算力券）兑付申报工作。现将有关事项通知如下：一、人工智能券（算力券）是国家使用超长期特别国债资金...'
    },
    {
      title: '杭州今年首批“算力券”发放 余航加快推进“两个5000万”政策落地',
      department: '余杭区人民政府',
      date: '2025-05-16',
      summary:
        '本报讯（记者 徐翘楚）记者从市经信局（市数字经济局）获悉，2025年杭州市“算力券”首批兑付开始，有3家企业获财政补贴的“算力券”，其中包括余航企业杭州核新软件技术有限公司...'
    }
  ]
}

export default function PolicyList() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('province')

  const currentPolicyList = policyDataMatrix[activeTab] || []

  const handleApply = () => {
    console.log('触发Banner算力券申报')
  }

  const handlePolicyDetail = (policy: PolicyItem) => {
    navigate(`/main/policy-detail?title=${encodeURIComponent(policy.title)}`)
  }

  const handleConsult = () => {
    console.log('触发页脚咨询')
  }

  return (
    <div className={styles.policyPageGlobalContainer}>
      <div className={styles.policyBannerBlock}>
        <div className={styles.bannerBackgroundLayer}>
          <img src={bannerImg} alt="政策专区背景" className={styles.bannerMaskNativeImg} />
        </div>

        <div className={styles.bannerTextInner}>
          <h1 className={styles.bannerMainHeadline}>算力政策展示专区</h1>
          <p className={styles.bannerSubParagraphText}>汇聚全国省市区算力产业政策，助力企业获取政策红利</p>
          <div className={styles.bannerBadgeHint}>实时更新 · 一站查询</div>
          <br />
          <Button type="primary" className={styles.bannerApplyBtn} onClick={handleApply}>
            算力券申报
          </Button>
        </div>
      </div>

      <div className={styles.policyContentWrapper}>
        <div className={styles.policyContentInside}>
          <div className={styles.policyTabsRow}>
            {tabsOptions.map((tab) => (
              <div
                key={tab.key}
                className={`${styles.policyTabItem} ${activeTab === tab.key ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </div>
            ))}
          </div>

          <div className={styles.policyListContainer}>
            {currentPolicyList.map((item, index) => (
              <div key={index} className={styles.policyInfoCard}>
                <h3 className={styles.policyCardTitle}>{item.title}</h3>

                <div className={styles.policyCardMeta}>
                  <span>
                    发布单位：<span className={styles.metaValue}>{item.department}</span>
                  </span>
                  <span className={styles.metaDate}>
                    <ClockCircleOutlined className={styles.dateIcon} />
                    {item.date}
                  </span>
                </div>

                <p className={styles.policyCardSummary}>{item.summary}</p>

                <div className={styles.policyCardFooter}>
                  <span className={styles.goDetailLink} onClick={() => handlePolicyDetail(item)}>
                    查看详情 <span className={styles.arrowRight}>&gt;</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className={styles.globalDarkFooterBlock}>
        <div className={styles.footerInner1600Container}>
          <div className={styles.footerTopColumnsRow}>
            <div className={styles.footerBrandLogoCol}>
              <h2>算力调度运营平台</h2>
            </div>

            <div className={styles.footerInfoDetailsCol}>
              <h4 className={styles.columnHeaderTitleLbl}>基本信息</h4>
              <p className={styles.infoTextLineItem}>联系邮箱：service@cs-xxxxxxxxxx-platform.com</p>
              <p className={styles.infoTextLineItem}>联系地址：XX省XX市XX区智慧科创园区A栋商务中心</p>
            </div>

            <div className={styles.footerContactActionCol}>
              <h4 className={styles.columnHeaderTitleLbl}>联系我们</h4>
              <Button type="primary" className={styles.footerConsultActionBtn} onClick={handleConsult}>
                立即咨询
              </Button>
            </div>
          </div>

          <div className={styles.footerBottomComplianceBar}>
            <p className={styles.complianceTextLineRow}>ICP备案编号：浙ICP备2024132127-3号</p>
            <p className={styles.complianceTextLineRow}>
              国家人工智能应用中试基地(医疗)-浙江版权所有 技术支持:国家人工智能应用中试基地(医疗)-浙江
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
