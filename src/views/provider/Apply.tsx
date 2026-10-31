import { Button, Checkbox, Col, Divider, Form, Input, Row, Select, Steps, message } from 'antd'
import type { FormRule } from 'antd'
import { useNavigate } from 'react-router-dom'
import styles from './ProviderApply.module.css'

interface ProviderFormValues {
  companyName: string
  creditCode: string
  contactName: string
  contactPhone: string
  computeType: string[]
  deviceModel?: string
  scale: string
  description?: string
}

const formRules: Record<string, FormRule[]> = {
  companyName: [{ required: true, message: '请输入企业名称' }],
  creditCode: [{ required: true, message: '请输入统一社会信用代码' }],
  contactName: [{ required: true, message: '请输入联系人姓名' }],
  contactPhone: [
    { required: true, message: '请输入联系电话' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
  ],
  computeType: [{ type: 'array', required: true, message: '请至少选择一项算力资源类型' }],
  scale: [{ required: true, message: '请选择预计入驻规模' }]
}

const computeTypeOptions = ['GPU 智算', 'CPU 通算', '超算', '边缘计算'].map((value) => ({
  label: value,
  value
}))

const scaleOptions = [
  { label: '小于 100 P', value: '<100' },
  { label: '100 P - 500 P', value: '100-500' },
  { label: '500 P - 1000 P', value: '500-1000' },
  { label: '1000 P 以上', value: '>1000' }
]

const stepItems = [
  { title: '提交申请资料', description: '填写企业及算力资质' },
  { title: '平台资格审核', description: '1-3个工作日反馈' },
  { title: '签署合作协议', description: '商务沟通并确认权责' },
  { title: '算力上架联调', description: '技术对接与资源上线' }
]

export default function ProviderApply() {
  const navigate = useNavigate()

  const submitForm = (_values: ProviderFormValues) => {
    message.success('申请提交成功！我们将会在1-3个工作日内与您联系。')
    window.setTimeout(() => {
      navigate(-1)
    }, 1500)
  }

  const handleSubmitFailed = () => {
    message.error('请完善表单必填信息')
  }

  const goBack = () => {
    navigate(-1)
  }

  const handleConsult = () => {
    console.log('触发页脚咨询')
  }

  return (
    <div className={styles.applyPageGlobalContainer}>
      <div className={styles.applyHeaderBanner}>
        <h1 className={styles.headerTitle}>算力资源入驻申请</h1>
        <p className={styles.headerSubtitle}>完善信息并提交审核，共建全国一体化算力网络</p>
      </div>

      <div className={styles.applyContentWrapper}>
        <div className={styles.applyPaperCard}>
          <div className={styles.applyStepsContainer}>
            <Steps current={1} items={stepItems} />
          </div>

          <Divider dashed />

          <div className={styles.applyFormContainer}>
            <div className={styles.formSectionTitle}>
              <span className={styles.blueBar}></span>
              <h3>填写主体信息</h3>
            </div>

            <Form<ProviderFormValues>
              labelCol={{ style: { width: 120 } }}
              labelAlign="right"
              initialValues={{ computeType: [] }}
              onFinish={submitForm}
              onFinishFailed={handleSubmitFailed}
            >
              <Row gutter={40}>
                <Col span={12}>
                  <Form.Item label="企业名称" name="companyName" rules={formRules.companyName}>
                    <Input placeholder="请输入完整企业名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="统一信用代码" name="creditCode" rules={formRules.creditCode}>
                    <Input placeholder="请输入统一社会信用代码" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={40}>
                <Col span={12}>
                  <Form.Item label="联系人姓名" name="contactName" rules={formRules.contactName}>
                    <Input placeholder="请输入项目负责人姓名" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="联系电话" name="contactPhone" rules={formRules.contactPhone}>
                    <Input placeholder="请输入有效手机号" />
                  </Form.Item>
                </Col>
              </Row>

              <div className={styles.formSectionTitle} style={{ marginTop: 20 }}>
                <span className={styles.blueBar}></span>
                <h3>填写算力信息</h3>
              </div>

              <Form.Item label="算力资源类型" name="computeType" rules={formRules.computeType}>
                <Checkbox.Group options={computeTypeOptions} />
              </Form.Item>

              <Form.Item label="主要设备型号" name="deviceModel">
                <Input placeholder="例如：NVIDIA A800 / Ascend 910B" />
              </Form.Item>

              <Form.Item label="预计入驻规模" name="scale" rules={formRules.scale}>
                <Select placeholder="请选择资源规模" style={{ width: '100%' }} options={scaleOptions} />
              </Form.Item>

              <Form.Item label="资源优势及说明" name="description">
                <Input.TextArea
                  rows={4}
                  placeholder="请简单描述您的机房位置、带宽网络条件或其他技术优势..."
                />
              </Form.Item>

              <Form.Item className={styles.formSubmitRow}>
                <Button type="primary" htmlType="submit" className={styles.submitActionBtn}>
                  提交入驻申请
                </Button>
                <Button className={styles.cancelActionBtn} onClick={goBack}>
                  返回上一页
                </Button>
              </Form.Item>
            </Form>
          </div>
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
