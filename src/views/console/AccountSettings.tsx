// 账户设置模块：用户个人信息修改与管理
import { useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, Modal, Switch, Table, Tag, Upload, message } from 'antd'
import type { FormRule, UploadProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CameraOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import styles from './AccountSettings.module.css'

interface ProfileFormValues {
  username: string
  nickname: string
  email: string
  phone: string
  company: string
}

interface StoredProfile extends ProfileFormValues {
  avatar?: string
}

interface PasswordFormValues {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

interface DeviceItem {
  deviceName: string
  location: string
  loginTime: string
  isCurrent: boolean
}

interface OperationLogItem {
  time: string
  type: string
  description: string
  ip: string
}

interface NotificationSettings {
  systemNotify: boolean
  orderNotify: boolean
  securityAlert: boolean
  expireAlert: boolean
}

// 平台既有持久化键（登录态/角色/消息），本页仅读取用户资料，不改写这些键
const USER_INFO_KEY = 'platform_user_info'
const NOTIFICATION_KEY = 'platform_notification_settings'
const OPERATION_LOG_KEY = 'platform_operation_logs'

const DEFAULT_PROFILE: ProfileFormValues = {
  username: '测评中心',
  nickname: '',
  email: '',
  phone: '',
  company: ''
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  systemNotify: true,
  orderNotify: true,
  securityAlert: true,
  expireAlert: true
}

const PROFILE_RULES: Record<string, FormRule[]> = {
  username: [{ required: true, message: '请输入用户名' }],
  email: [{ type: 'email', message: '请输入有效的邮箱地址' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }]
}

const DEFAULT_DEVICE_LIST: DeviceItem[] = [
  { deviceName: 'Chrome / Windows', location: '北京', loginTime: '2026-06-12 09:30:00', isCurrent: true },
  { deviceName: 'Safari / macOS', location: '上海', loginTime: '2026-06-10 14:20:00', isCurrent: false },
  { deviceName: 'Chrome / Android', location: '深圳', loginTime: '2026-06-08 18:45:00', isCurrent: false }
]

const DEFAULT_OPERATION_LOGS: OperationLogItem[] = [
  { time: '2026-06-12 09:30:00', type: '登录', description: '用户登录成功', ip: '192.168.1.100' },
  { time: '2026-06-11 16:20:00', type: '修改', description: '修改账户信息', ip: '192.168.1.100' },
  { time: '2026-06-10 14:20:00', type: '登录', description: '用户登录成功', ip: '10.0.0.50' },
  { time: '2026-06-09 11:30:00', type: '订单', description: '创建订单 ORD202606091126404900', ip: '192.168.1.100' },
  { time: '2026-06-08 18:45:00', type: '登录', description: '用户登录成功', ip: '172.16.0.25' },
  { time: '2026-06-07 10:00:00', type: '密码', description: '修改登录密码', ip: '192.168.1.100' }
]

const isOperationLogItem = (value: unknown): value is OperationLogItem => {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.time === 'string' &&
    typeof item.type === 'string' &&
    typeof item.description === 'string' &&
    typeof item.ip === 'string'
  )
}

const readStoredProfile = (): StoredProfile => {
  const raw = localStorage.getItem(USER_INFO_KEY)
  if (!raw) return { ...DEFAULT_PROFILE }
  try {
    const info = JSON.parse(raw) as Partial<StoredProfile>
    return {
      username: info.username || '测评中心',
      nickname: info.nickname || '',
      email: info.email || '',
      phone: info.phone || '',
      company: info.company || '',
      avatar: info.avatar || ''
    }
  } catch {
    return { ...DEFAULT_PROFILE }
  }
}

const readStoredNotifications = (): NotificationSettings => {
  const raw = localStorage.getItem(NOTIFICATION_KEY)
  if (!raw) return { ...DEFAULT_NOTIFICATION_SETTINGS }
  try {
    const parsed = JSON.parse(raw) as Partial<NotificationSettings>
    return {
      systemNotify: parsed.systemNotify ?? DEFAULT_NOTIFICATION_SETTINGS.systemNotify,
      orderNotify: parsed.orderNotify ?? DEFAULT_NOTIFICATION_SETTINGS.orderNotify,
      securityAlert: parsed.securityAlert ?? DEFAULT_NOTIFICATION_SETTINGS.securityAlert,
      expireAlert: parsed.expireAlert ?? DEFAULT_NOTIFICATION_SETTINGS.expireAlert
    }
  } catch {
    return { ...DEFAULT_NOTIFICATION_SETTINGS }
  }
}

const readStoredLogs = (): OperationLogItem[] => {
  const raw = localStorage.getItem(OPERATION_LOG_KEY)
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isOperationLogItem) : []
  } catch {
    return []
  }
}

export default function AccountSettings() {
  // 头像相关
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [tempAvatarUrl, setTempAvatarUrl] = useState('')

  // 个人信息表单
  const [profileForm] = Form.useForm<ProfileFormValues>()
  const [profileSubmitting, setProfileSubmitting] = useState(false)

  // 密码修改表单
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [passwordForm] = Form.useForm<PasswordFormValues>()
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)

  // 设备管理与操作日志
  const [deviceModalOpen, setDeviceModalOpen] = useState(false)
  const [logModalOpen, setLogModalOpen] = useState(false)
  const [deviceList, setDeviceList] = useState<DeviceItem[]>(DEFAULT_DEVICE_LIST)
  const [operationLogs, setOperationLogs] = useState<OperationLogItem[]>(DEFAULT_OPERATION_LOGS)

  // 通知设置
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
    DEFAULT_NOTIFICATION_SETTINGS
  )

  // 页面加载时读取已保存的用户信息与通知设置
  useEffect(() => {
    const storedProfile = readStoredProfile()
    profileForm.setFieldsValue({
      username: storedProfile.username,
      nickname: storedProfile.nickname,
      email: storedProfile.email,
      phone: storedProfile.phone,
      company: storedProfile.company
    })
    setAvatarUrl(storedProfile.avatar || '')
    setNotificationSettings(readStoredNotifications())
  }, [profileForm])

  const passwordRules = useMemo<Record<string, FormRule[]>>(
    () => ({
      oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        {
          validator: (_rule: unknown, value: unknown) => {
            const confirmValue = typeof value === 'string' ? value : ''
            const newPassword = passwordForm.getFieldValue('newPassword') as string | undefined
            if (confirmValue && confirmValue !== newPassword) {
              return Promise.reject(new Error('两次输入的密码不一致'))
            }
            return Promise.resolve()
          },
          trigger: 'blur'
        }
      ]
    }),
    [passwordForm]
  )

  // 记录操作日志
  const addOperationLog = (type: string, description: string) => {
    const newLog: OperationLogItem = {
      time: new Date().toLocaleString(),
      type,
      description,
      ip: '192.168.1.100'
    }
    // 只保留最近100条
    const nextLogs = [newLog, ...readStoredLogs()].slice(0, 100)
    localStorage.setItem(OPERATION_LOG_KEY, JSON.stringify(nextLogs))
    setOperationLogs((prev) => [newLog, ...prev].slice(0, 100))
  }

  // 保存个人信息
  const handleSaveProfile = async () => {
    let values: ProfileFormValues
    try {
      values = await profileForm.validateFields()
    } catch {
      return
    }

    setProfileSubmitting(true)
    try {
      const userInfo: StoredProfile = {
        username: values.username,
        nickname: values.nickname,
        email: values.email,
        phone: values.phone,
        company: values.company,
        avatar: avatarUrl
      }
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))

      // 记录操作日志
      addOperationLog('修改', '修改账户信息')

      message.success('个人信息保存成功')
    } catch {
      message.error('保存失败，请稍后重试')
    } finally {
      setProfileSubmitting(false)
    }
  }

  // 重置个人信息
  const handleResetProfile = () => {
    const storedProfile = readStoredProfile()
    profileForm.resetFields()
    profileForm.setFieldsValue({
      username: storedProfile.username,
      nickname: storedProfile.nickname,
      email: storedProfile.email,
      phone: storedProfile.phone,
      company: storedProfile.company
    })
  }

  // 头像上传
  const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
    const isImage = file.type.startsWith('image/')
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isImage) {
      message.error('只能上传图片文件!')
      return false
    }
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!')
      return false
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setTempAvatarUrl(typeof event.target?.result === 'string' ? event.target.result : '')
    }
    reader.readAsDataURL(file)
    return false
  }

  const confirmAvatar = () => {
    if (tempAvatarUrl) {
      setAvatarUrl(tempAvatarUrl)
      setAvatarModalOpen(false)
      message.success('头像更换成功')

      // 保存头像到用户信息
      const storedProfile = readStoredProfile()
      localStorage.setItem(USER_INFO_KEY, JSON.stringify({ ...storedProfile, avatar: tempAvatarUrl }))
    }
  }

  // 修改密码
  const handleChangePassword = async () => {
    try {
      await passwordForm.validateFields()
    } catch {
      return
    }

    setPasswordSubmitting(true)
    try {
      // 模拟密码修改
      await new Promise((resolve) => setTimeout(resolve, 500))

      addOperationLog('密码', '修改登录密码')

      message.success('密码修改成功')
      setPasswordModalOpen(false)
      passwordForm.resetFields()
    } catch {
      message.error('密码修改失败，请稍后重试')
    } finally {
      setPasswordSubmitting(false)
    }
  }

  // 设备管理
  const removeDevice = (device: DeviceItem) => {
    Modal.confirm({
      title: '确认移除',
      content: `确定要移除设备 "${device.deviceName}" 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setDeviceList((prev) => prev.filter((item) => item.loginTime !== device.loginTime))
        message.success('设备已移除')
      }
    })
  }

  // 通知设置
  const handleNotificationChange = (key: keyof NotificationSettings, checked: boolean) => {
    const nextSettings: NotificationSettings = { ...notificationSettings, [key]: checked }
    setNotificationSettings(nextSettings)
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(nextSettings))
  }

  const deviceColumns: ColumnsType<DeviceItem> = [
    { title: '设备', dataIndex: 'deviceName', key: 'deviceName', width: 150 },
    { title: '登录地点', dataIndex: 'location', key: 'location', width: 150 },
    { title: '登录时间', dataIndex: 'loginTime', key: 'loginTime', width: 180 },
    {
      title: '状态',
      dataIndex: 'isCurrent',
      key: 'isCurrent',
      width: 80,
      render: (isCurrent: boolean) =>
        isCurrent ? <Tag color="success">当前</Tag> : <Tag color="default">历史</Tag>
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_value: unknown, record: DeviceItem) =>
        record.isCurrent ? null : (
          <Button type="link" danger size="small" onClick={() => removeDevice(record)}>
            移除
          </Button>
        )
    }
  ]

  const logColumns: ColumnsType<OperationLogItem> = [
    { title: '时间', dataIndex: 'time', key: 'time', width: 180 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: 'IP地址', dataIndex: 'ip', key: 'ip', width: 150 }
  ]

  return (
    <div className={styles.accountSettingsPage}>
      {/* 个人信息卡片 */}
      <div className={`${styles.settingsCard} ${styles.profileCard}`}>
        <div className={styles.settingsHeader}>
          <h2 className={styles.settingsTitle}>个人信息</h2>
          <p className={styles.settingsDesc}>管理您的基本资料</p>
        </div>

        <div className={styles.profileContent}>
          {/* 头像区域 */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper} onClick={() => setAvatarModalOpen(true)}>
              {avatarUrl ? (
                <img src={avatarUrl} className={styles.avatarImg} alt="头像" />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <UserOutlined style={{ fontSize: 40 }} />
                </div>
              )}
              <div className={styles.avatarOverlay}>
                <CameraOutlined />
                <span>更换头像</span>
              </div>
            </div>
            <p className={styles.avatarTip}>点击头像可更换</p>
          </div>

          {/* 信息表单 */}
          <Form
            form={profileForm}
            initialValues={DEFAULT_PROFILE}
            labelCol={{ flex: '100px' }}
            wrapperCol={{ flex: '1 1 0' }}
            className={styles.profileForm}
          >
            <Form.Item label="用户名" name="username" rules={PROFILE_RULES.username}>
              <Input placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item label="昵称" name="nickname">
              <Input placeholder="请输入昵称" />
            </Form.Item>

            <Form.Item label="邮箱" name="email" rules={PROFILE_RULES.email}>
              <Input placeholder="请输入邮箱地址" />
            </Form.Item>

            <Form.Item label="手机号" name="phone" rules={PROFILE_RULES.phone}>
              <Input placeholder="请输入手机号码" />
            </Form.Item>

            <Form.Item label="公司简介" name="company">
              <Input.TextArea rows={3} placeholder="选填，请输入公司简介" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" loading={profileSubmitting} onClick={handleSaveProfile}>
                保存信息
              </Button>
              <Button onClick={handleResetProfile} className={styles.resetButton}>
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      {/* 安全设置卡片 */}
      <div className={`${styles.settingsCard} ${styles.securityCard}`}>
        <div className={styles.settingsHeader}>
          <h2 className={styles.settingsTitle}>安全设置</h2>
          <p className={styles.settingsDesc}>管理您的账户安全</p>
        </div>

        <div className={styles.securityList}>
          <div className={styles.securityItem}>
            <div className={styles.securityInfo}>
              <div className={styles.securityLabel}>登录密码</div>
              <div className={styles.securityDesc}>定期修改密码可提高账户安全性</div>
            </div>
            <Button
              type="primary"
              className={styles.btnPlainPrimary}
              onClick={() => setPasswordModalOpen(true)}
            >
              修改密码
            </Button>
          </div>

          <div className={styles.securityItem}>
            <div className={styles.securityInfo}>
              <div className={styles.securityLabel}>登录设备管理</div>
              <div className={styles.securityDesc}>查看当前登录的设备，可移除不信任设备</div>
            </div>
            <Button onClick={() => setDeviceModalOpen(true)}>管理设备</Button>
          </div>

          <div className={styles.securityItem}>
            <div className={styles.securityInfo}>
              <div className={styles.securityLabel}>操作日志</div>
              <div className={styles.securityDesc}>查看账户最近的登录和操作记录</div>
            </div>
            <Button onClick={() => setLogModalOpen(true)}>查看日志</Button>
          </div>
        </div>
      </div>

      {/* 通知设置卡片 */}
      <div className={`${styles.settingsCard} ${styles.notificationCard}`}>
        <div className={styles.settingsHeader}>
          <h2 className={styles.settingsTitle}>通知设置</h2>
          <p className={styles.settingsDesc}>管理消息通知偏好</p>
        </div>

        <div className={styles.notificationList}>
          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <div className={styles.notificationLabel}>系统通知</div>
              <div className={styles.notificationDesc}>接收系统升级、维护等通知</div>
            </div>
            <Switch
              checked={notificationSettings.systemNotify}
              onChange={(checked) => handleNotificationChange('systemNotify', checked)}
            />
          </div>

          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <div className={styles.notificationLabel}>订单通知</div>
              <div className={styles.notificationDesc}>接收订单状态变更通知</div>
            </div>
            <Switch
              checked={notificationSettings.orderNotify}
              onChange={(checked) => handleNotificationChange('orderNotify', checked)}
            />
          </div>

          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <div className={styles.notificationLabel}>安全告警</div>
              <div className={styles.notificationDesc}>接收登录异常等安全告警</div>
            </div>
            <Switch
              checked={notificationSettings.securityAlert}
              onChange={(checked) => handleNotificationChange('securityAlert', checked)}
            />
          </div>

          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <div className={styles.notificationLabel}>资源到期提醒</div>
              <div className={styles.notificationDesc}>接收资源到期前提醒通知</div>
            </div>
            <Switch
              checked={notificationSettings.expireAlert}
              onChange={(checked) => handleNotificationChange('expireAlert', checked)}
            />
          </div>
        </div>
      </div>

      {/* 头像上传弹窗 */}
      <Modal
        title="更换头像"
        width={400}
        centered
        open={avatarModalOpen}
        onCancel={() => setAvatarModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setAvatarModalOpen(false)}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={confirmAvatar}>
            确认
          </Button>
        ]}
      >
        <div className={styles.avatarUploadArea}>
          <Upload
            className={styles.avatarUploader}
            showUploadList={false}
            accept="image/jpeg,image/png"
            beforeUpload={beforeAvatarUpload}
          >
            {tempAvatarUrl ? (
              <img src={tempAvatarUrl} className={styles.avatarPreview} alt="头像预览" />
            ) : (
              <div className={styles.avatarUploaderIcon}>
                <PlusOutlined style={{ fontSize: 28 }} />
              </div>
            )}
          </Upload>
          <p className={styles.uploadTip}>支持 JPG、PNG 格式，大小不超过 2MB</p>
        </div>
      </Modal>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        width={450}
        centered
        open={passwordModalOpen}
        onCancel={() => setPasswordModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setPasswordModalOpen(false)}>
            取消
          </Button>,
          <Button
            key="confirm"
            type="primary"
            loading={passwordSubmitting}
            onClick={handleChangePassword}
          >
            确认修改
          </Button>
        ]}
      >
        <Form
          form={passwordForm}
          labelCol={{ flex: '100px' }}
          wrapperCol={{ flex: '1 1 0' }}
        >
          <Form.Item label="当前密码" name="oldPassword" rules={passwordRules.oldPassword}>
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>

          <Form.Item label="新密码" name="newPassword" rules={passwordRules.newPassword}>
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item label="确认密码" name="confirmPassword" rules={passwordRules.confirmPassword}>
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 设备管理弹窗 */}
      <Modal
        title="登录设备管理"
        width={600}
        centered
        open={deviceModalOpen}
        onCancel={() => setDeviceModalOpen(false)}
        footer={null}
      >
        <Table<DeviceItem>
          dataSource={deviceList}
          columns={deviceColumns}
          rowKey="loginTime"
          pagination={false}
          size="small"
        />
      </Modal>

      {/* 操作日志弹窗 */}
      <Modal
        title="操作日志"
        width={700}
        centered
        open={logModalOpen}
        onCancel={() => setLogModalOpen(false)}
        footer={null}
      >
        <Table<OperationLogItem>
          dataSource={operationLogs}
          columns={logColumns}
          rowKey={(record) => `${record.time}-${record.type}-${record.description}`}
          pagination={false}
          size="small"
        />
      </Modal>
    </div>
  )
}
