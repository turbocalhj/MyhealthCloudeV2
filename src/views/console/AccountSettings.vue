<template>
  <!-- 账户设置模块：用户个人信息修改与管理 -->
  <div class="account-settings-page">
    <div class="settings-card">
      <div class="settings-header">
        <h2 class="settings-title">账户信息</h2>
        <p class="settings-desc">修改您的个人账户信息</p>
      </div>

      <el-form
        ref="formRef"
        :model="accountForm"
        :rules="rules"
        label-width="100px"
        class="account-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="accountForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="accountForm.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="accountForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="accountForm.phone" placeholder="请输入手机号码" />
        </el-form-item>

        <el-divider />

        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            v-model="accountForm.currentPassword"
            type="password"
            show-password
            placeholder="请输入当前密码"
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="accountForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码（选填）"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="accountForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            保存修改
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const submitting = ref(false)

const accountForm = reactive({
  username: '测评中心',
  nickname: '',
  email: '',
  phone: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 页面加载时读取已保存的用户信息
onMounted(() => {
  const savedInfo = localStorage.getItem('platform_user_info')
  if (savedInfo) {
    try {
      const info = JSON.parse(savedInfo)
      accountForm.username = info.username || '测评中心'
      accountForm.nickname = info.nickname || ''
      accountForm.email = info.email || ''
      accountForm.phone = info.phone || ''
    } catch {
      // 忽略解析错误
    }
  }
})

const validateConfirmPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value && value !== accountForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ],
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        // 保存用户信息到 localStorage
        const userInfo = {
          username: accountForm.username,
          nickname: accountForm.nickname,
          email: accountForm.email,
          phone: accountForm.phone
        }
        localStorage.setItem('platform_user_info', JSON.stringify(userInfo))
        
        ElMessage.success('账户信息修改成功')
      } catch {
        ElMessage.error('修改失败，请稍后重试')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleReset = () => {
  // 重置为已保存的值或默认值
  const savedInfo = localStorage.getItem('platform_user_info')
  if (savedInfo) {
    try {
      const info = JSON.parse(savedInfo)
      accountForm.username = info.username || '测评中心'
      accountForm.nickname = info.nickname || ''
      accountForm.email = info.email || ''
      accountForm.phone = info.phone || ''
    } catch {
      accountForm.username = '测评中心'
      accountForm.nickname = ''
      accountForm.email = ''
      accountForm.phone = ''
    }
  } else {
    accountForm.username = '测评中心'
    accountForm.nickname = ''
    accountForm.email = ''
    accountForm.phone = ''
  }
  
  accountForm.currentPassword = ''
  accountForm.newPassword = ''
  accountForm.confirmPassword = ''
  formRef.value?.clearValidate()
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

.account-form {
  max-width: 600px;
}
</style>
