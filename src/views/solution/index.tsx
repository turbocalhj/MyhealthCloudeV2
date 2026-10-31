import { useState } from 'react'
import { Button } from 'antd'
import maskImg from '@/assets/images/solution/Mask.png'
import jiegouImg from '@/assets/images/solution/Jiegou.png'
import styles from './Solution.module.css'

export default function Solution() {
  const [showDetail, setShowDetail] = useState(false)

  const handleSolutionLink = (_type: string) => {
    setShowDetail(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConsult = () => {
    console.log('触发页脚咨询')
  }

  return (
    <div className={styles.solutionPageGlobalContainer}>
      {!showDetail ? (
        <div>
          <div className={styles.solutionBannerBlock}>
            <div className={styles.bannerBackgroundLayer}>
              <img src={maskImg} alt="解决方案大图背景" className={styles.bannerMaskNativeImg} />
            </div>

            <div className={styles.bannerTextInner}>
              <h1 className={styles.bannerMainHeadline}>全栈 AI 解决方案</h1>
              <p className={styles.bannerSubParagraphText}>
                面向多领域业务场景，提供充足算力服务解决方案，助力客户安全高效使用智算与通算产品。
              </p>
            </div>
          </div>

          <div className={styles.featuredSolutionsWrapper}>
            <div className={styles.featuredSolutionsInside1600}>
              <h2 className={styles.sectionBlockMainTitle}>精选方案</h2>

              <div className={styles.solutionsGridLayoutMatrix}>
                <div
                  className={styles.solutionMegaInteractiveCard}
                  onClick={() => handleSolutionLink('medical')}
                >
                  <div className={styles.cardInnerPaddedBox}>
                    <h3 className={styles.cardHeadlineMainTitle}>AI+医疗算力解决方案</h3>
                    <p className={styles.cardSummaryParagraph}>
                      基于算力中心的多元算力服务体系与 AI 医学大模型技术深度融合，构建覆盖医学影像分析、智慧诊疗、临床数据挖掘及病历智能生成的全场景解决方案，为医疗服务方案提供实时精准的计算赋能，实现诊断效率跃升与医疗流程再造。
                    </p>

                    <div className={styles.painPointsThreeCols}>
                      <div className={styles.painPointColItem}>
                        <span className={styles.painBadgeLbl}>痛点一</span>
                        <h4 className={styles.painSubTitle}>算力资源不足</h4>
                        <p className={styles.painDetailDesc}>业务高峰期算力缺口大，闲时利用率不足。</p>
                      </div>
                      <div className={styles.painPointColItem}>
                        <span className={styles.painBadgeLbl}>痛点二</span>
                        <h4 className={styles.painSubTitle}>存储成本高</h4>
                        <p className={styles.painDetailDesc}>
                          病理数据年增长1~2PB，数据总量达10PB级，机房空间占用多，15~30年长期留存成本高。
                        </p>
                      </div>
                      <div className={styles.painPointColItem}>
                        <span className={styles.painBadgeLbl}>痛点三</span>
                        <h4 className={styles.painSubTitle}>数据共享难</h4>
                        <p className={styles.painDetailDesc}>切片文件大，传输慢，多业务多院区间数据共享难。</p>
                      </div>
                    </div>

                    <div className={styles.cardActionFooterBar}>
                      <Button type="primary" className={styles.goDetailActionBtn}>
                        查看详情
                      </Button>
                    </div>
                  </div>
                </div>

                <div className={styles.solutionsRightVerticalColumn}>
                  <div
                    className={styles.solutionMiniInteractiveCard}
                    onClick={() => handleSolutionLink('health')}
                  >
                    <div className={styles.cardInnerPaddedBox}>
                      <h3 className={styles.cardHeadlineMainTitle}>AI+健康管理算力解决方案</h3>
                      <p className={styles.cardSummaryParagraph}>
                        依托算力中心的多元算力智能调度引擎平台，通过对跨机构多模态医疗数据的处理与深度挖掘，助力动态生成。
                      </p>
                      <div className={styles.cardActionFooterBar}>
                        <Button type="primary" className={styles.goDetailActionBtn}>
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div
                    className={styles.solutionMiniInteractiveCard}
                    onClick={() => handleSolutionLink('research')}
                  >
                    <div className={styles.cardInnerPaddedBox}>
                      <h3 className={styles.cardHeadlineMainTitle}>AI+科研算力解决方案</h3>
                      <p className={styles.cardSummaryParagraph}>
                        人工智能算力中心集成了国产高性能算力集群、高速网络及分布式存储系统，构建按需伸缩的科研算力池，为相关学科研究提供支撑。
                      </p>
                      <div className={styles.cardActionFooterBar}>
                        <Button type="primary" className={styles.goDetailActionBtn}>
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.detailViewContainer}>
          <div className={styles.detailBackNav} onClick={() => setShowDetail(false)}>
            <span>&lt; 返回精选方案</span>
          </div>

          <div className={styles.detailBannerSection}>
            <h1 className={styles.detailBannerTitle}>通用算力解决方案</h1>
            <p className={styles.detailBannerDesc}>
              基于算力中心的多元算力服务体系与 AI 大模型技术深度融合，构建覆盖多场景的全链路解决方案，
              <br />
              为各类服务提供实时精准的计算赋能，实现效率跃升与流程再造。
            </p>
          </div>

          <div className={styles.detailContentWrapper1600}>
            <div className={styles.detailSectionBlock}>
              <h2 className={styles.detailSectionTitle}>业务痛点</h2>
              <div className={styles.detailPainGrid}>
                <div className={styles.detailPainCard}>
                  <div className={styles.detailPainNum}>1</div>
                  <h4 className={styles.detailPainCardTitle}>算力资源不足</h4>
                  <p className={styles.detailPainCardDesc}>业务高峰期算力缺口大，闲时利用率不足。</p>
                </div>
                <div className={styles.detailPainCard}>
                  <div className={styles.detailPainNum}>2</div>
                  <h4 className={styles.detailPainCardTitle}>存储成本高</h4>
                  <p className={styles.detailPainCardDesc}>行业数据年增长规模大，长期留存成本高。</p>
                </div>
                <div className={styles.detailPainCard}>
                  <div className={styles.detailPainNum}>3</div>
                  <h4 className={styles.detailPainCardTitle}>数据共享难</h4>
                  <p className={styles.detailPainCardDesc}>大文件传输慢，多业务多部门间数据共享困难。</p>
                </div>
              </div>
            </div>

            <div className={`${styles.detailSectionBlock} ${styles.dividerTop}`}>
              <h2 className={styles.detailSectionTitle}>方案架构</h2>
              <div className={styles.detailArchLayout}>
                <div className={styles.archDiagramBox}>
                  <img src={jiegouImg} alt="方案架构图" />
                </div>

                <div className={styles.archTextBox}>
                  <div className={styles.archTextItem}>
                    <h4 className={styles.archTextTitle}>● 分层协同的全链路架构</h4>
                    <p className={styles.archTextDesc}>
                      采用“门户层 - 基础模块层 - 业务中台层 - 基础支持层”四层架构，配合应用集成、数据集成板块，实现从 PC / 移动门户的用户交互，到基础功能配置、资源管理，再到业务中台的应用/流程/AI 服务支撑，以及底层数据库、消息队列等技术支持的全链路贯通，各层级分工明确且协同高效。
                    </p>
                  </div>
                  <div className={styles.archTextItem}>
                    <h4 className={styles.archTextTitle}>● “通算+智算”的资源服务体系</h4>
                    <p className={styles.archTextDesc}>
                      基础模块层中，“计算资源”（计算、存储、网络服务）覆盖通用算力需求，“智算资源”（GPU主机、模型服务、算法服务）聚焦 AI 类智能化场景。结合内容管理、个人中心等模块，既能满足企业日常业务的基础算力供给，也能为 AI 模型训练、算法创新等场景提供专属算力与服务支持。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.detailSectionBlock} ${styles.dividerTop}`}>
              <h2 className={styles.detailSectionTitle}>方案优势</h2>
              <div className={styles.detailAdvGrid}>
                <div className={styles.detailAdvCard}>
                  <div className={styles.detailAdvIcon}></div>
                  <h4 className={styles.detailAdvTitle}>高性能算存网基础设施</h4>
                  <p className={styles.detailAdvDesc}>
                    算-存-网采用100G大带宽组网，时延低至1s，满足AI场景对数据处理高性能需求。
                  </p>
                </div>
                <div className={styles.detailAdvCard}>
                  <div className={styles.detailAdvIcon}></div>
                  <h4 className={styles.detailAdvTitle}>热-冷数据自动分级</h4>
                  <p className={styles.detailAdvDesc}>
                    热数据采用全闪存，温冷数据采用混闪，数据按需流动，满足高性能需求的同时降低存储成本。
                  </p>
                </div>
                <div className={styles.detailAdvCard}>
                  <div className={styles.detailAdvIcon}></div>
                  <h4 className={styles.detailAdvTitle}>减少运维成本</h4>
                  <p className={styles.detailAdvDesc}>
                    采用全局文件系统，不管数据在哪里，数据全局可视、可管、可用、可享。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
