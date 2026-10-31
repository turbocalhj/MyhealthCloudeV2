import { useMemo } from 'react'
import { ArrowLeftOutlined, FilePdfOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './ContractManager.module.css'

interface ContractInfo {
  id?: string
  name?: string
  provider?: string
}

const DEFAULT_CONTRACT_INFO: ContractInfo = {
  id: 'HT20260529001',
  name: '阿里合同',
  provider: '健康云'
}

const TAB_LABELS = ['合同信息', '产品清单', '审批记录', '资源列表']

export default function ContractManager() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const currentContractInfo = useMemo<ContractInfo>(() => {
    const entries = Array.from(searchParams.entries())
    if (entries.length === 0) return DEFAULT_CONTRACT_INFO
    const query: Record<string, string> = {}
    entries.forEach(([key, value]) => {
      query[key] = value
    })
    return { id: query.id, name: query.name, provider: query.provider }
  }, [searchParams])

  return (
    <div className={styles.standaloneContractDetailContainer}>
      <div className={styles.financeDetailNavigationBar}>
        <span className={styles.backArrowClickableBtn} onClick={() => navigate(-1)}>
          <ArrowLeftOutlined /> Back
        </span>
        <span className={styles.contractHeadlineTitle}>{currentContractInfo.name || '阿里合同'}</span>
        <span className={styles.statusBadgeFulfillment}>履约中</span>
      </div>

      <div className={styles.contractMetadataInfobarPanel}>
        <div className={styles.metaCellItem}>
          <span className={styles.lbl}>合同编号：</span>
          <span className={`${styles.val} ${styles.fontMono}`}>
            {currentContractInfo.id || 'HT20260529001'}
          </span>
        </div>
        <div className={styles.metaCellItem}>
          <span className={styles.lbl}>云上合同ID：</span>
          <span className={`${styles.val} ${styles.fontMono}`}>HT20260529001</span>
        </div>
        <div className={styles.metaCellItem}>
          <span className={styles.lbl}>合同期限：</span>
          <span className={styles.val}>2026-05-29 ~ 2026-05-31</span>
        </div>
        <div className={styles.metaCellItem}>
          <span className={styles.lbl}>合同类型：</span>
          <span className={styles.val}>折扣合同</span>
        </div>
        <div className={styles.metaCellItem}>
          <span className={styles.lbl}>折扣比例：</span>
          <span className={styles.val}>50%</span>
        </div>
        <div className={styles.metaCellItem}>
          <span className={styles.lbl}>提交人：</span>
          <span className={styles.val}>张海洋</span>
        </div>
        <div className={styles.metaCellItem}>
          <span className={styles.lbl}>合同提交时间：</span>
          <span className={styles.val}>2026-05-29 14:36:14</span>
        </div>
      </div>

      <div className={styles.contractTabsNavigationStrip}>
        {TAB_LABELS.map((label, index) => (
          <span
            key={label}
            className={`${styles.stripItem} ${index === 0 ? styles.active : ''}`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className={`${styles.whiteCardContentBlock} ${styles.marginTop20}`}>
        <div className={styles.blockInnerTitle}>签署方信息</div>
        <div className={styles.quadGridPropertiesLayout}>
          <div className={styles.gridCell}>
            <span className={styles.pLbl}>需求方</span>
            <span className={styles.pVal}>测评中心</span>
          </div>
          <div className={styles.gridCell}>
            <span className={styles.pLbl}>联系人</span>
            <span className={styles.pVal}>张海洋</span>
          </div>
          <div className={styles.gridCell}>
            <span className={styles.pLbl}>联系电话</span>
            <span className={styles.pVal}>18215684930</span>
          </div>
          <div className={styles.gridCell}>
            <span className={styles.pLbl}>邮箱</span>
            <span className={styles.pVal}>--</span>
          </div>

          <div className={styles.gridCell}>
            <span className={styles.pLbl}>供给方</span>
            <span className={styles.pVal}>{currentContractInfo.provider || '健康云'}</span>
          </div>
          <div className={styles.gridCell}>
            <span className={styles.pLbl}>联系人</span>
            <span className={styles.pVal}>常玉林</span>
          </div>
          <div className={styles.gridCell}>
            <span className={styles.pLbl}>联系电话</span>
            <span className={styles.pVal}>13810565403</span>
          </div>
          <div className={styles.gridCell}>
            <span className={styles.pLbl}>邮箱</span>
            <span className={styles.pVal}>changyulin@163.com</span>
          </div>
        </div>
      </div>

      <div className={`${styles.whiteCardContentBlock} ${styles.marginTop20}`}>
        <div className={styles.blockInnerTitle}>合同说明</div>
        <div className={styles.placeholderNullText}>--</div>
      </div>

      <div className={`${styles.whiteCardContentBlock} ${styles.marginTop20}`}>
        <div className={styles.blockInnerTitle}>合同附件</div>
        <div className={styles.fileDownloadWrapperCapsule}>
          <FilePdfOutlined style={{ fontSize: 24, marginRight: 12 }} />
          <div className={styles.fileMetadataInfoFlex}>
            <span className={styles.fileMainName}>Hermes-Agent-从入门到精通-v260407.pdf</span>
            <span className={styles.fileSubInfo}>7.23 MB · 张海洋 · 上传于 2026-05-29 14:36:14</span>
          </div>
        </div>
      </div>
    </div>
  )
}
