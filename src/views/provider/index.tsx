import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import processImg from '@/assets/images/provider/banner2.png'
import styles from './Provider.module.css'

export default function Provider() {
  const navigate = useNavigate()

  const handleProviderApply = () => {
    navigate('/main/provider-apply')
  }

  const handleConsult = () => {
    console.log('触发页脚咨询')
  }

  return (
    <div className={styles.providerPageGlobalContainer}>
      <div className={styles.providerFirstBanner}>
        <div className={styles.bannerTextInner}>
          <h1 className={styles.bannerMainHeadline}>算力供给方入驻</h1>
          <p className={styles.bannerSubParagraphText}>
            共同构建全国一体化算力网络。我们提供专业的技术支持和运营服务，帮助您的算力资源实现最大价值，共同构建安全、高效、合规的算力生态。
          </p>

          <div className={styles.bannerBadgesRow}>
            <span className={styles.badgeTagItem}>资源变现</span>
            <span className={styles.badgeTagItem}>安全合规</span>
            <span className={styles.badgeTagItem}>生态共建</span>
            <span className={styles.badgeTagItem}>专业标准</span>
          </div>

          <Button type="primary" className={styles.bannerActionApplyBtn} onClick={handleProviderApply}>
            入驻申请
          </Button>
        </div>
      </div>

      <div className={styles.providerProcessStandardSection}>
        <div className={styles.processSectionHeader}>
          <h2 className={styles.processMainTitle}>合作入驻流程</h2>
        </div>

        <div className={styles.processImageNativeBox}>
          <img src={processImg} alt="合作入驻流程图" className={styles.processEmbedImg} />
        </div>
      </div>

      <footer className={styles.globalDarkFooterBlock}>
        <div className={styles.footerInner1600Container}>
          <div className={styles.footerTopColumnsRow}>
            <div className={styles.footerBrandLogoCol}>
              <h2 className={styles.footerBrandMainTitle}>算力调度运营平台</h2>
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
