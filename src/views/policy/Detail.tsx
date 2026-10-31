import { Button, Empty } from 'antd'
import { useSearchParams } from 'react-router-dom'
import bannerImg from '@/assets/images/policy/banner.png'
import styles from './PolicyDetail.module.css'

export default function PolicyDetail() {
  const [searchParams] = useSearchParams()
  const policyTitle = searchParams.get('title') || '政策详情'

  const handleConsult = () => {
    console.log('触发页脚咨询')
  }

  return (
    <div className={styles.policyDetailGlobalContainer}>
      <div className={styles.policyDetailBannerBlock}>
        <div className={styles.bannerBackgroundLayer}>
          <img src={bannerImg} alt="政策详情背景" className={styles.bannerMaskNativeImg} />
        </div>
        <div className={styles.bannerTextInner}>
          <h1 className={styles.bannerMainHeadline}>{policyTitle}</h1>
        </div>
      </div>

      <div className={styles.policyDetailContentWrapper}>
        <div className={styles.detailPaperCard}>
          <div className={styles.sectionTitleRow}>
            <span className={styles.blueVerticalBar}></span>
            <h3 className={styles.sectionTitleText}>政策正文</h3>
          </div>

          <div className={styles.policyGreyBox}>
            <Empty description="该政策的具体内容正在整理中..." />
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
