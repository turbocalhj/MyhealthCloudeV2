import { useEffect, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { LoginRequest } from '@/types'
import { loginApi } from '@/api/auth'
import { useUserStore } from '@/store/user'
import styles from './auth.module.css'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const setAuth = useUserStore((state) => state.setAuth)
  const token = useUserStore((state) => state.token)
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTarget = new URLSearchParams(location.search).get('redirect') || '/main/home'

  // 已登录用户带着 redirect 参数访问登录页时，直接回到目标页
  useEffect(() => {
    if (token) {
      navigate(redirectTarget, { replace: true })
    }
  }, [token, redirectTarget, navigate])

  const handleFinish = async (values: LoginRequest) => {
    setLoading(true)
    try {
      const res = await loginApi(values)
      setAuth({ token: res.token, roles: res.roles })
      message.success('登录成功，正在进入系统...')
      navigate(redirectTarget, { replace: true })
    } catch (error) {
      message.error(error instanceof Error ? error.message : '登录失败，请检查网络或账号信息')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authBox}>
        <div className={styles.authHeader}>
          <h2>算力调度运营平台</h2>
        </div>

        <Form<LoginRequest>
          size="large"
          onFinish={handleFinish}
          onFinishFailed={() => message.error('请完整填写登录表单项！')}
          validateTrigger="onBlur"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.submitBtn} loading={loading}>
              立即登录
            </Button>
          </Form.Item>

          <Form.Item>
            <div className={styles.extraLinks}>
              <Link className={styles.authLink} to="/register">
                注册新账户
              </Link>
              <span className={styles.divider}>|</span>
              <Link className={styles.authLinkMuted} to="/forgot-password">
                忘记密码？
              </Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
