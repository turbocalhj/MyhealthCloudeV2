import { useState } from 'react'
import { Button, Form, Input, Modal, Radio, Select, Upload, message } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import {
  ArrowLeftOutlined,
  CloudUploadOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  WarningFilled
} from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './TicketCreate.module.css'

interface TicketFormValues {
  title: string
  type: string
  priority: string
  description: string
  phone: string
  email: string
}

const TICKET_TYPE_OPTIONS = [
  { label: '咨询工单', value: '咨询工单' },
  { label: '运维工单', value: '运维工单' },
  { label: '故障工单', value: '故障工单' }
]

const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_FILE_COUNT = 3

export default function TicketCreate() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form] = Form.useForm<TicketFormValues>()

  // 模板反填
  const templateType = searchParams.get('templateType') ?? ''
  const templateNameParam = searchParams.get('templateName') ?? ''
  const templateDesc = searchParams.get('templateDesc') ?? ''

  const [isFromTemplate, setIsFromTemplate] = useState(Boolean(templateType))
  const [templateName, setTemplateName] = useState(templateNameParam)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [submitting, setSubmitting] = useState(false)

  const initialValues: TicketFormValues = {
    title: '',
    type: templateType,
    priority: '中',
    description: templateDesc ? `[来自模板：${templateNameParam}]\n\n${templateDesc}\n\n` : '',
    phone: '18215684930',
    email: ''
  }

  const handleFileChange: UploadProps['onChange'] = (info) => {
    if (info.fileList.length > MAX_FILE_COUNT) {
      message.warning('最多只能上传 3 个文件')
      setFileList(info.fileList.slice(0, MAX_FILE_COUNT))
      return
    }
    setFileList(info.fileList)
  }

  const handleFileRemove: UploadProps['onRemove'] = (file) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid))
    return true
  }

  const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
    // 限制文件大小
    if (file.size > MAX_FILE_SIZE) {
      message.error(`文件 ${file.name} 超过 10MB 限制`)
      return Upload.LIST_IGNORE
    }
    return false
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
    } catch {
      message.error('请检查表单必填项是否填写完整')
      return
    }

    setSubmitting(true)
    // 模拟提交
    window.setTimeout(() => {
      setSubmitting(false)
      Modal.success({
        title: '提交成功',
        content: '工单已成功提交，平台将尽快为您处理',
        okText: '查看我的工单',
        onOk: () => {
          navigate('/console/ticket-list')
        }
      })
    }, 800)
  }

  const handleSaveDraft = () => {
    localStorage.setItem('ticket_draft', JSON.stringify(form.getFieldsValue()))
    message.success('草稿已保存')
  }

  const handleCancel = () => {
    navigate('/console/ticket-list')
  }

  const clearTemplate = () => {
    setIsFromTemplate(false)
    setTemplateName('')
    form.setFieldsValue({ type: '', description: '' })
    // 清理 URL 参数
    navigate('/console/ticket-create', { replace: true })
  }

  return (
    <div className={styles.consoleTicketCreateContainer}>
      <div className={styles.formMainCardWrapper}>
        <div className={styles.formBackNavigationBar} onClick={handleCancel}>
          <ArrowLeftOutlined className={styles.backArrowIcon} />
          <span className={styles.navigationTitleLbl}>
            {isFromTemplate ? '使用模板创建工单' : '创建工单'}
          </span>
        </div>

        {/* 模板反填提示 */}
        {isFromTemplate && (
          <div className={styles.templateFillHintBanner}>
            <InfoCircleOutlined className={styles.hintIcon} />
            <span className={styles.hintText}>
              已应用模板：<strong>{templateName}</strong>，请补充具体的工单信息
            </span>
            <Button size="small" type="text" onClick={clearTemplate}>
              清除模板
            </Button>
          </div>
        )}

        <Form<TicketFormValues>
          form={form}
          initialValues={initialValues}
          layout="vertical"
          className={styles.standardVerticalFormBody}
        >
          <Form.Item
            label="工单标题"
            name="title"
            required
            rules={[
              { required: true, message: '工单标题不能为空' },
              { min: 5, max: 100, message: '标题长度在 5 到 100 个字符' }
            ]}
          >
            <Input
              placeholder="请输入工单标题"
              maxLength={100}
              showCount
              className={styles.customFormInputNode}
            />
          </Form.Item>

          <Form.Item
            label="工单类型"
            name="type"
            required
            rules={[{ required: true, message: '请选择工单类型' }]}
          >
            <Select
              placeholder="请选择工单类型"
              style={{ width: '100%' }}
              className={styles.customFormInputNode}
              options={TICKET_TYPE_OPTIONS}
            />
          </Form.Item>

          <Form.Item
            label="优先级"
            name="priority"
            required
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Radio.Group className={styles.priorityRadioGroupRow}>
              <Radio.Button value="高" className={styles.priorityHighRadio}>
                <WarningFilled /> 高
              </Radio.Button>
              <Radio.Button value="中" className={styles.priorityMediumRadio}>
                中
              </Radio.Button>
              <Radio.Button value="低" className={styles.priorityLowRadio}>
                低
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="问题描述"
            name="description"
            required
            rules={[
              { required: true, message: '问题描述不能为空' },
              { min: 10, message: '问题描述不能少于 10 个字符' }
            ]}
          >
            <Input.TextArea
              rows={5}
              placeholder="请详细描述您遇到的问题或需求"
              maxLength={1000}
              showCount
              className={styles.customFormInputNode}
            />
          </Form.Item>

          <Form.Item label="附件" className={styles.uploaderFormItemBox}>
            <Upload.Dragger
              className={styles.ticketDragUploaderComponent}
              multiple
              action="#"
              accept=".jpg,.jpeg,.png,.pdf"
              fileList={fileList}
              beforeUpload={handleBeforeUpload}
              onChange={handleFileChange}
              onRemove={handleFileRemove}
            >
              <p className={styles.uploadIconWrap}>
                <CloudUploadOutlined className={styles.uploadIcon} />
              </p>
              <p className={styles.uploadText}>点击或拖拽文件到此区域上传</p>
            </Upload.Dragger>
            <div className={styles.uploadTipHintLbl}>
              支持 JPG、PNG、PDF 格式，单个文件不超过 10MB，最多 3 个
            </div>
          </Form.Item>

          <Form.Item
            label="联系电话"
            name="phone"
            required
            rules={[
              { required: true, message: '联系电话不能为空' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
            ]}
          >
            <Input placeholder="请输入联系电话" className={styles.customFormInputNode} />
          </Form.Item>

          <Form.Item
            label="联系邮箱"
            name="email"
            required
            rules={[
              { required: true, message: '联系邮箱不能为空' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input placeholder="请输入联系邮箱" className={styles.customFormInputNode} />
          </Form.Item>

          <div className={styles.formSubmitActionsRow}>
            <Button
              type="primary"
              className={styles.formPrimarySubmitBtn}
              loading={submitting}
              onClick={handleSubmit}
            >
              {submitting ? '提交中...' : '提交工单'}
            </Button>

            <Button className={styles.formPlainCancelBtn} onClick={handleCancel}>
              取消
            </Button>

            <Button className={styles.formSaveDraftBtn} onClick={handleSaveDraft}>
              <FileTextOutlined /> 保存为草稿
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
