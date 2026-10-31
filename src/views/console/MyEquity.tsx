import { Fragment } from 'react'
import { Button, Progress, message } from 'antd'
import { BulbOutlined } from '@ant-design/icons'
import styles from './MyEquity.module.css'

type TrialStatus = 'expired' | 'pending' | 'rejected' | 'approved'

type TrialProgressStatus = 'normal' | 'exception'

interface TrialApplication {
  id: string
  name: string
  status: TrialStatus
  statusLabel: string
  gpuModel: string
  spec: string
  duration: string
  applyTime: string
  auditTime: string
  expireTime: string
  expireHighlight: boolean
  progressLabel: string
  progressPercent: number
  progressStatus: TrialProgressStatus
}

// 顶部流程节点
const PROCESS_STEPS: string[] = ['提交申请', '运营审核', '开通试用', '转正或释放']

// 试用申请列表（模拟数据）
const TRIAL_APPLICATIONS: TrialApplication[] = [
  {
    id: 't-001',
    name: '移动端裸金属服务01',
    status: 'expired',
    statusLabel: '已过期',
    gpuModel: 'NVIDIA-H800',
    spec: '96核CPU + 2048GB内存 + 8卡',
    duration: '7天',
    applyTime: '2026-03-10 10:30:00',
    auditTime: '2026-03-11 14:20:00',
    expireTime: '2026-03-18 14:20:00',
    expireHighlight: true,
    progressLabel: '已过期',
    progressPercent: 100,
    progressStatus: 'exception'
  },
  {
    id: 't-002',
    name: '高性能计算集群',
    status: 'pending',
    statusLabel: '审核中',
    gpuModel: 'NVIDIA-H100',
    spec: '128核CPU + 1024GB内存 + 8卡',
    duration: '7天',
    applyTime: '2026-03-25 14:20:00',
    auditTime: '-',
    expireTime: '-',
    expireHighlight: false,
    progressLabel: '待审核',
    progressPercent: 0,
    progressStatus: 'normal'
  },
  {
    id: 't-003',
    name: 'AI推理服务器',
    status: 'rejected',
    statusLabel: '已拒绝',
    gpuModel: 'NVIDIA-A40',
    spec: '32核CPU + 256GB内存 + 2卡',
    duration: '7天',
    applyTime: '2026-03-15 11:00:00',
    auditTime: '2026-03-16 10:30:00',
    expireTime: '-',
    expireHighlight: false,
    progressLabel: '已拒绝',
    progressPercent: 0,
    progressStatus: 'exception'
  },
  {
    id: 't-004',
    name: '图像处理工作站',
    status: 'approved',
    statusLabel: '已通过',
    gpuModel: 'NVIDIA-RTX-4090',
    spec: '48核CPU + 256GB内存 + 2卡',
    duration: '10天',
    applyTime: '2026-03-22 16:45:00',
    auditTime: '2026-03-23 09:20:00',
    expireTime: '2026-04-02 09:20:00',
    expireHighlight: false,
    progressLabel: '试用进度 30%',
    progressPercent: 30,
    progressStatus: 'normal'
  }
]

const STATUS_BADGE_CLASS: Record<TrialStatus, string> = {
  expired: styles.expiredTag,
  pending: styles.pendingTag,
  rejected: styles.rejectedTag,
  approved: styles.approvedTag
}

export default function MyEquity() {
  const handleNewTrial = () => {
    message.success('正在为您调取新型高配置算力资源试用表单...')
  }

  const handleCheckPolicy = () => {
    message.info('正在读取最新版《云平台算力资源免费试用合规及准入政策细则》')
  }

  return (
    <div className={styles.consoleMyEquityWorkspacePage}>
      <div className={styles.trialProcessInstructionCard}>
        <div className={styles.instructionHeaderRow}>
          <div className={styles.lightbulbIconBox}>
            <BulbOutlined className={styles.bulbIcon} />
          </div>
          <div>
            <h3 className={styles.instructionMainTitle}>试用流程说明</h3>
            <p className={styles.instructionSubDesc}>了解资源试用的完整流程</p>
          </div>
        </div>

        <div className={styles.processStepsTimelineRow}>
          {PROCESS_STEPS.map((stepName, index) => (
            <Fragment key={stepName}>
              <div className={styles.stepNodeItem}>
                <span className={styles.stepNumberCircle}>{index + 1}</span>
                <span className={styles.stepNodeName}>{stepName}</span>
              </div>
              {index < PROCESS_STEPS.length - 1 && (
                <span className={styles.stepConnectingLine}></span>
              )}
            </Fragment>
          ))}
        </div>

        <div className={styles.instructionActionsRow}>
          <Button type="primary" className={styles.btnApplyNewTrial} onClick={handleNewTrial}>
            申请新试用
          </Button>
          <Button className={styles.btnCheckPolicyPlain} onClick={handleCheckPolicy}>
            查看试用政策
          </Button>
        </div>
      </div>

      <div className={styles.myTrialApplicationsSection}>
        <h3 className={styles.sectionBlockTitle}>我的试用申请</h3>

        <div className={styles.trialCardsVerticalList}>
          {TRIAL_APPLICATIONS.map((item) => (
            <div key={item.id} className={styles.trialAssetSpecCard}>
              <div className={styles.cardTopHeadlineMeta}>
                <h4 className={styles.assetDisplayName}>{item.name}</h4>
                <span className={`${styles.statusPillBadge} ${STATUS_BADGE_CLASS[item.status]}`}>
                  {item.statusLabel}
                </span>
              </div>

              <div className={styles.cardHardwareSpecGrid}>
                <div className={styles.specGridItem}>
                  <span className={styles.lbl}>GPU型号</span>
                  <span className={`${styles.val} ${styles.fontSemibold}`}>{item.gpuModel}</span>
                </div>
                <div className={styles.specGridItem}>
                  <span className={styles.lbl}>规格</span>
                  <span className={`${styles.val} ${styles.fontSemibold}`}>{item.spec}</span>
                </div>
                <div className={styles.specGridItem}>
                  <span className={styles.lbl}>试用时长</span>
                  <span className={`${styles.val} ${styles.fontSemibold}`}>{item.duration}</span>
                </div>
              </div>

              <div className={styles.cardTimestampsDoubleRow}>
                <div className={styles.timeItem}>
                  <span className={styles.lbl}>申请时间</span>
                  <span className={styles.val}>{item.applyTime}</span>
                </div>
                <div className={styles.timeItem}>
                  <span className={styles.lbl}>审核时间</span>
                  <span className={styles.val}>{item.auditTime}</span>
                </div>
                <div className={styles.timeItem}>
                  <span className={styles.lbl}>到期时间</span>
                  <span
                    className={`${styles.val} ${item.expireHighlight ? styles.orangeHighlightText : ''}`}
                  >
                    {item.expireTime}
                  </span>
                </div>
              </div>

              <div className={styles.progressContainerBar}>
                <div className={styles.statusTextHintLine}>{item.progressLabel}</div>
                <Progress
                  className={styles.customProgress}
                  percent={item.progressPercent}
                  status={item.progressStatus}
                  showInfo={false}
                  size={['100%', 8]}
                  strokeLinecap="butt"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
