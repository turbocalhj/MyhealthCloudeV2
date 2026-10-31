import { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import styles from './auth.module.css'

interface RegisterFormValues {
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleFinish = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      message.success('注册成功，请登录')
      navigate('/login')
    } catch {
      message.error('注册失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authBox}>
        <div className={styles.authHeader}>
          <h2>算力调度运营平台</h2>
          <p>创建您的账户</p>
        </div>

        <Form<RegisterFormValues>
          size="large"
          onFinish={handleFinish}
          onFinishFailed={() => message.error('请完整填写注册信息')}
          validateTrigger="onBlur"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 2, max: 20, message: '用户名长度为2-20个字符' }
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号码' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
            ]}
          >
            <Input placeholder="请输入手机号码" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度不能少于6位' }
            ]}
          >
            <Input.Password placeholder="请输入密码（至少6位）" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请再次输入密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value === getFieldValue('password')) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                }
              })
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.submitBtn} loading={loading}>
              立即注册
            </Button>
          </Form.Item>

          <Form.Item>
            <div className={styles.loginLink}>
              已有账户？
              <Link className={styles.authLink} to="/login">
                立即登录
              </Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
