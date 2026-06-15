<template>
  <!-- 账户设置模块：用户个人信息修改与管理 -->
  <div class="account-settings-page">
    <!-- 个人信息卡片 -->
    <div class="settings-card profile-card">
      <div class="settings-header">
        <h2 class="settings-title">个人信息</h2>
        <p class="settings-desc">管理您的基本资料</p>
      </div>

      <div class="profile-content">
        <!-- 头像区域 -->
        <div class="avatar-section">
          <div class="avatar-wrapper" @click="showAvatarDialog = true">
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar-img" alt="头像" />
            <div v-else class="avatar-placeholder">
              <el-icon :size="40"><User /></el-icon>
            </div>
            <div class="avatar-overlay">
              <el-icon><Camera /></el-icon>
              <span>更换头像</span>
            </div>
          </div>
          <p class="avatar-tip">点击头像可更换</p>
        </div>

        <!-- 信息表单 -->
        <el-form
          ref="profileFormRef"
          :model="profileForm"
          :rules="profileRules"
          label-width="100px"
          class="profile-form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="profileForm.username" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="profileForm.nickname" placeholder="请输入昵称" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="profileForm.email" placeholder="请输入邮箱地址" />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="profileForm.phone" placeholder="请输入手机号码" />
          </el-form-item>

          <el-form-item label="公司简介">
            <el-input
              v-model="profileForm.company"
              type="textarea"
              :rows="3"
              placeholder="选填，请输入公司简介"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSaveProfile" :loading="profileSubmitting">
              保存信息
            </el-button>
            <el-button @click="handleResetProfile">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 安全设置卡片 -->
    <div class="settings-card security-card">
      <div class="settings-header">
        <h2 class="settings-title">安全设置</h2>
        <p class="settings-desc">管理您的账户安全</p>
      </div>

      <div class="security-list">
        <div class="security-item">
          <div class="security-info">
            <div class="security-label">登录密码</div>
            <div class="security-desc">定期修改密码可提高账户安全性</div>
          </div>
          <el-button type="primary" plain @click="showPasswordDialog = true">修改密码</el-button>
        </div>

        <div class="security-item">
          <div class="security-info">
            <div class="security-label">登录设备管理</div>
            <div class="security-desc">查看当前登录的设备，可移除不信任设备</div>
          </div>
          <el-button @click="showDeviceDialog = true">管理设备</el-button>
        </div>

        <div class="security-item">
          <div class="security-info">
            <div class="security-label">操作日志</div>
            <div class="security-desc">查看账户最近的登录和操作记录</div>
          </div>
          <el-button @click="showLogDialog = true">查看日志</el-button>
        </div>
      </div>
    </div>

    <!-- 通知设置卡片 -->
    <div class="settings-card notification-card">
      <div class="settings-header">
        <h2 class="settings-title">通知设置</h2>
        <p class="settings-desc">管理消息通知偏好</p>
      </div>

      <div class="notification-list">
        <div class="notification-item">
          <div class="notification-info">
            <div class="notification-label">系统通知</div>
            <div class="notification-desc">接收系统升级、维护等通知</div>
          </div>
          <el-switch v-model="notificationSettings.systemNotify" />
        </div>

        <div class="notification-item">
          <div class="notification-info">
            <div class="notification-label">订单通知</div>
            <div class="notification-desc">接收订单状态变更通知</div>
          </div>
          <el-switch v-model="notificationSettings.orderNotify" />
        </div>

        <div class="notification-item">
          <div class="notification-info">
            <div class="notification-label">安全告警</div>
            <div class="notification-desc">接收登录异常等安全告警</div>
          </div>
          <el-switch v-model="notificationSettings.securityAlert" />
        </div>

        <div class="notification-item">
          <div class="notification-info">
            <div class="notification-label">资源到期提醒</div>
            <div class="notification-desc">接收资源到期前提醒通知</div>
          </div>
          <el-switch v-model="notificationSettings.expireAlert" />
        </div>
      </div>
    </div>

    <!-- 头像上传弹窗 -->
    <el-dialog v-model="showAvatarDialog" title="更换头像" width="400px" :align-center="true">
      <div class="avatar-upload-area">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="handleAvatarUpload"
        >
          <img v-if="tempAvatarUrl" :src="tempAvatarUrl" class="avatar-preview" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <p class="upload-tip">支持 JPG、PNG 格式，大小不超过 2MB</p>
      </div>
      <template #footer>
        <el-button @click="showAvatarDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAvatar">确认</el-button>
      </template>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="450px" :align-center="true">
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
            placeholder="请输入当前密码"
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword" :loading="passwordSubmitting">
          确认修改
        </el-button>
      </template>
    </el-dialog>

    <!-- 设备管理弹窗 -->
    <el-dialog v-model="showDeviceDialog" title="登录设备管理" width="600px" :align-center="true">
      <el-table :data="deviceList" style="width: 100%">
        <el-table-column prop="deviceName" label="设备" min-width="150" />
        <el-table-column prop="location" label="登录地点" width="150" />
        <el-table-column prop="loginTime" label="登录时间" width="180" />
        <el-table-column prop="isCurrent" label="状态" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.isCurrent" type="success" size="small">当前</el-tag>
            <el-tag v-else type="info" size="small">历史</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="scope">
            <el-button
              v-if="!scope.row.isCurrent"
              type="danger"
              link
              size="small"
              @click="removeDevice(scope.row)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 操作日志弹窗 -->
    <el-dialog v-model="showLogDialog" title="操作日志" width="700px" :align-center="true">
      <el-table :data="operationLogs" style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="ip" label="IP地址" width="150" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Camera, Plus } from '@element-plus/icons-vue'
import type { FormInstance, UploadRequestOptions } from 'element-plus'

// 头像相关
const showAvatarDialog = ref(false)
const avatarUrl = ref('')
const tempAvatarUrl = ref('')

// 个人信息表单
const profileFormRef = ref<FormInstance>()
const profileSubmitting = ref(false)

const profileForm = reactive({
  username: '测评中心',
  nickname: '',
  email: '',
  phone: '',
  company: ''
})

const profileRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ type: 'email' as const, message: '请输入有效的邮箱地址', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }]
}

// 密码修改表单
const showPasswordDialog = ref(false)
const passwordFormRef = ref<FormInstance>()
const passwordSubmitting = ref(false)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value && value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 设备管理
const showDeviceDialog = ref(false)
const deviceList = ref([
  { deviceName: 'Chrome / Windows', location: '北京', loginTime: '2026-06-12 09:30:00', isCurrent: true },
  { deviceName: 'Safari / macOS', location: '上海', loginTime: '2026-06-10 14:20:00', isCurrent: false },
  { deviceName: 'Chrome / Android', location: '深圳', loginTime: '2026-06-08 18:45:00', isCurrent: false }
])

// 操作日志
const showLogDialog = ref(false)
const operationLogs = ref([
  { time: '2026-06-12 09:30:00', type: '登录', description: '用户登录成功', ip: '192.168.1.100' },
  { time: '2026-06-11 16:20:00', type: '修改', description: '修改账户信息', ip: '192.168.1.100' },
  { time: '2026-06-10 14:20:00', type: '登录', description: '用户登录成功', ip: '10.0.0.50' },
  { time: '2026-06-09 11:30:00', type: '订单', description: '创建订单 ORD202606091126404900', ip: '192.168.1.100' },
  { time: '2026-06-08 18:45:00', type: '登录', description: '用户登录成功', ip: '172.16.0.25' },
  { time: '2026-06-07 10:00:00', type: '密码', description: '修改登录密码', ip: '192.168.1.100' }
])

// 通知设置
const notificationSettings = reactive({
  systemNotify: true,
  orderNotify: true,
  securityAlert: true,
  expireAlert: true
})

// 页面加载时读取已保存的用户信息
onMounted(() => {
  const savedInfo = localStorage.getItem('platform_user_info')
  if (savedInfo) {
    try {
      const info = JSON.parse(savedInfo)
      profileForm.username = info.username || '测评中心'
      profileForm.nickname = info.nickname || ''
      profileForm.email = info.email || ''
      profileForm.phone = info.phone || ''
      profileForm.company = info.company || ''
      avatarUrl.value = info.avatar || ''
    } catch {
      // 忽略解析错误
    }
  }

  // 读取通知设置
  const savedNotify = localStorage.getItem('platform_notification_settings')
  if (savedNotify) {
    try {
      const settings = JSON.parse(savedNotify)
      Object.assign(notificationSettings, settings)
    } catch {
      // 忽略解析错误
    }
  }
})

// 保存个人信息
const handleSaveProfile = async () => {
  if (!profileFormRef.value) return

  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      profileSubmitting.value = true
      try {
        const userInfo = {
          username: profileForm.username,
          nickname: profileForm.nickname,
          email: profileForm.email,
          phone: profileForm.phone,
          company: profileForm.company,
          avatar: avatarUrl.value
        }
        localStorage.setItem('platform_user_info', JSON.stringify(userInfo))
        
        // 记录操作日志
        addOperationLog('修改', '修改账户信息')
        
        ElMessage.success('个人信息保存成功')
      } catch {
        ElMessage.error('保存失败，请稍后重试')
      } finally {
        profileSubmitting.value = false
      }
    }
  })
}

// 重置个人信息
const handleResetProfile = () => {
  const savedInfo = localStorage.getItem('platform_user_info')
  if (savedInfo) {
    try {
      const info = JSON.parse(savedInfo)
      profileForm.username = info.username || '测评中心'
      profileForm.nickname = info.nickname || ''
      profileForm.email = info.email || ''
      profileForm.phone = info.phone || ''
      profileForm.company = info.company || ''
    } catch {
      resetProfileToDefault()
    }
  } else {
    resetProfileToDefault()
  }
  
  profileFormRef.value?.clearValidate()
}

const resetProfileToDefault = () => {
  profileForm.username = '测评中心'
  profileForm.nickname = ''
  profileForm.email = ''
  profileForm.phone = ''
  profileForm.company = ''
}

// 头像上传
const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleAvatarUpload = (options: UploadRequestOptions) => {
  const file = options.file as File
  const reader = new FileReader()
  reader.onload = (e) => {
    tempAvatarUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  return Promise.resolve()
}

const confirmAvatar = () => {
  if (tempAvatarUrl.value) {
    avatarUrl.value = tempAvatarUrl.value
    showAvatarDialog.value = false
    ElMessage.success('头像更换成功')
    
    // 保存头像到用户信息
    const savedInfo = localStorage.getItem('platform_user_info')
    const info = savedInfo ? JSON.parse(savedInfo) : {}
    info.avatar = avatarUrl.value
    localStorage.setItem('platform_user_info', JSON.stringify(info))
  }
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      passwordSubmitting.value = true
      try {
        // 模拟密码修改
        await new Promise(resolve => setTimeout(resolve, 500))
        
        addOperationLog('密码', '修改登录密码')
        
        ElMessage.success('密码修改成功')
        showPasswordDialog.value = false
        passwordForm.oldPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
        passwordFormRef.value?.resetFields()
      } catch {
        ElMessage.error('密码修改失败，请稍后重试')
      } finally {
        passwordSubmitting.value = false
      }
    }
  })
}

// 设备管理
const removeDevice = (device: any) => {
  ElMessageBox.confirm(`确定要移除设备 "${device.deviceName}" 吗？`, '确认移除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = deviceList.value.findIndex(d => d.loginTime === device.loginTime)
    if (index > -1) {
      deviceList.value.splice(index, 1)
      ElMessage.success('设备已移除')
    }
  }).catch(() => {})
}

// 操作日志
const addOperationLog = (type: string, description: string) => {
  const logs = localStorage.getItem('platform_operation_logs')
  let logList: any[] = []
  if (logs) {
    try {
      logList = JSON.parse(logs)
    } catch {
      // 忽略解析错误
    }
  }
  
  logList.unshift({
    time: new Date().toLocaleString(),
    type,
    description,
    ip: '192.168.1.100'
  })
  
  // 只保留最近100条
  if (logList.length > 100) {
    logList = logList.slice(0, 100)
  }
  
  localStorage.setItem('platform_operation_logs', JSON.stringify(logList))
}
</script>

<style scoped>
.account-settings-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.settings-card {
  background: #ffffff;
  padding: 24px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.04);
}

.settings-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.settings-title {
  font-size: 18px;
  font-weight: 600;
  color: #222222;
  margin: 0 0 8px 0;
}

.settings-desc {
  font-size: 14px;
  color: #666666;
  margin: 0;
}

/* 个人信息布局 */
.profile-content {
  display: flex;
  gap: 40px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 2px solid #e5e6eb;
  transition: border-color 0.3s;
}

.avatar-wrapper:hover {
  border-color: #1677FF;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #999;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s;
  color: #fff;
  font-size: 12px;
}

.avatar-tip {
  font-size: 12px;
  color: #86909C;
  margin: 0;
}

.profile-form {
  flex: 1;
  max-width: 500px;
}

/* 安全设置列表 */
.security-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 4px;
}

.security-info {
  flex: 1;
}

.security-label {
  font-size: 14px;
  font-weight: 500;
  color: #1D2129;
  margin-bottom: 4px;
}

.security-desc {
  font-size: 13px;
  color: #86909C;
}

/* 通知设置列表 */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 4px;
}

.notification-info {
  flex: 1;
}

.notification-label {
  font-size: 14px;
  font-weight: 500;
  color: #1D2129;
  margin-bottom: 4px;
}

.notification-desc {
  font-size: 13px;
  color: #86909C;
}

/* 头像上传 */
.avatar-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.avatar-uploader:hover {
  border-color: #1677FF;
}

.avatar-preview {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-tip {
  font-size: 12px;
  color: #86909C;
  margin: 0;
}
</style>
