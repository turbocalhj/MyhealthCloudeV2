import { useState } from 'react'
import { Button, Input, Upload, message } from 'antd'
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './TicketDetail.module.css'

interface TicketInfo {
  ticketId: string
  title: string
  ticketType: string
  status: string
  createTime: string
}

const DEFAULT_TICKET_INFO: TicketInfo = {
  ticketId: 'WA202604180043013110',
  title: '故障咨询',
  ticketType: '故障工单',
  status: '转派待接收',
  createTime: '2026-04-18 00:43:01'
}

export default function TicketDetail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [replyText, setReplyText] = useState('')

  const hasQuery = Array.from(searchParams.keys()).length > 0

  const ticketInfo: TicketInfo = hasQuery
    ? {
        ticketId: searchParams.get('ticketId') || DEFAULT_TICKET_INFO.ticketId,
        title: searchParams.get('title') || DEFAULT_TICKET_INFO.title,
        ticketType: searchParams.get('ticketType') || DEFAULT_TICKET_INFO.ticketType,
        status: searchParams.get('status') || DEFAULT_TICKET_INFO.status,
        createTime: searchParams.get('createTime') || DEFAULT_TICKET_INFO.createTime
      }
    : DEFAULT_TICKET_INFO

  const submitReplyAction = () => {
    if (!replyText.trim()) {
      message.warning('请输入回复正文后再提交')
      return
    }
    message.success('回复提交成功，运维专家正在全力为您加急排查')
    setReplyText('')
  }

  return (
    <div className={styles.ticketDetailPageContainer}>
      <div className={styles.detailBackNavigationBar} onClick={() => navigate(-1)}>
        <ArrowLeftOutlined className={styles.backArrowIcon} />
        <span className={styles.navigationTitleText}>工单详情</span>
      </div>

      <div className={styles.ticketInfoSummaryCard}>
        <div className={styles.cardInnerBlockTitle}>工单信息</div>

        <div className={styles.threeColumnMetadataGrid}>
          <div className={styles.metaCell}>
            <span className={styles.lbl}>工单编号：</span>
            <span className={`${styles.val} ${styles.fontMono}`}>{ticketInfo.ticketId}</span>
          </div>
          <div className={styles.metaCell}>
            <span className={styles.lbl}>工单类型：</span>
            <span className={styles.val}>{ticketInfo.ticketType}</span>
          </div>
          <div className={styles.metaCell}>
            <span className={styles.lbl}>工单状态：</span>
            <span className={`${styles.statusTagPillNode} ${styles.statusTransferWait}`}>
              <span className={styles.statusDotInner}>●</span> {ticketInfo.status}
            </span>
          </div>

          <div className={styles.metaCell}>
            <span className={styles.lbl}>创建时间：</span>
            <span className={styles.val}>{ticketInfo.createTime}</span>
          </div>
          <div className={styles.metaCell}>
            <span className={styles.lbl}>联系邮箱：</span>
            <span className={styles.val}>163@163.com</span>
          </div>
          <div className={styles.metaCell}>
            <span className={styles.lbl}>联系电话：</span>
            <span className={styles.val}>18215684930</span>
          </div>

          <div className={`${styles.metaCell} ${styles.fullWidthCell}`}>
            <span className={styles.lbl}>工单标题：</span>
            <span className={`${styles.val} ${styles.boldTitle}`}>{ticketInfo.title}</span>
          </div>
        </div>

        <div className={styles.problemDescriptionParagraphBox}>
          <div className={styles.descLbl}>问题描述</div>
          <div className={styles.descContentText}>云主机内存异常</div>
        </div>
      </div>

      <div className={`${styles.ticketReplyWorkspaceCard} ${styles.marginTop16}`}>
        <div className={styles.cardInnerBlockTitle}>回复</div>

        <div className={styles.replyInputWrapper}>
          <Input.TextArea
            rows={6}
            placeholder="请输入回复内容..."
            maxLength={1000}
            showCount
            className={styles.customReplyTextarea}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />

          <div className={styles.replyBottomActionBar}>
            <Upload action="#" multiple beforeUpload={() => false}>
              <Button className={styles.btnPlainUpload}>
                <UploadOutlined className={styles.iconMargin} />添加附件
              </Button>
            </Upload>

            <Button
              type="primary"
              className={styles.btnPrimarySubmitReply}
              onClick={submitReplyAction}
            >
              提交回复
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
