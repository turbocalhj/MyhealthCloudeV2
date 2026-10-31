import { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import styles from './auth.module.css'

interface VerifyFormValues {
  email: string
  phone: string
  code: string
}

interface PasswordFormValues {
  newPassword: string
  confirmPassword: string
}

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [verifyForm] = Form.useForm<VerifyFormValues>()
  const timerRef = useRef<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  const handleSendCode = () => {
    const { email, phone } = verifyForm.getFieldsValue()
    if (!email || !phone) {
      message.warning('请先填写邮箱和手机号')
      return
    }

    setCountdown(60)
    timerRef.current = window.setInterval(() => {
      setCountdown((value) => {
        if (value <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current)
          timerRef.current = null
          return 0
        }
        return value - 1
      })
    }, 1000)

    message.success('验证码已发送')
  }

  const handleVerify = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setStep(2)
      message.success('验证成功，请设置新密码')
    } catch {
      message.error('验证失败，请检查信息')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      message.success('密码重置成功，请登录')
      navigate('/login')
    } catch {
      message.error('密码重置失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authBox}>
        <div className={styles.authHeader}>
          <h2>算力调度运营平台</h2>
          <p>重置您的密码</p>
        </div>

        {step === 1 ? (
          <Form<VerifyFormValues>
            form={verifyForm}
            size="large"
            onFinish={handleVerify}
            validateTrigger="onBlur"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入注册邮箱" />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: '请输入手机号码' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
              ]}
            >
              <Input placeholder="请输入注册手机号" />
            </Form.Item>

            <Form.Item
              name="code"
              rules={[
                { required: true, message: '请输入验证码' },
                { len: 6, message: '验证码为6位数字' }
              ]}
            >
              <div className={styles.codeInput}>
                <Input placeholder="请输入验证码" />
                <Button
                  type="primary"
                  disabled={countdown > 0}
                  onClick={handleSendCode}
                  className={styles.codeBtn}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Button>
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles.submitBtn} loading={loading}>
                下一步
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form<PasswordFormValues>
            size="large"
            onFinish={handleResetPassword}
            validateTrigger="onBlur"
          >
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码长度不能少于6位' }
              ]}
            >
              <Input.Password placeholder="请输入新密码（至少6位）" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请再次输入密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value === getFieldValue('newPassword')) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  }
                })
              ]}
            >
              <Input.Password placeholder="请再次输入新密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles.submitBtn} loading={loading}>
                重置密码
              </Button>
            </Form.Item>
          </Form>
        )}

        <div className={styles.backLink}>
          <Link className={styles.authLinkMuted} to="/login">
            返回登录
          </Link>
        </div>
      </div>
    </div>
  )
}
