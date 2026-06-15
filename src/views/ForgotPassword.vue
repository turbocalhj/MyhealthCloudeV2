<template>
  <!-- 忘记密码模块 -->
  <div class="forgot-wrapper">
    <div class="forgot-box">
      <div class="forgot-header">
        <h2>算力调度运营平台</h2>
        <p>重置您的密码</p>
      </div>

      <!-- 步骤1：验证身份 -->
      <div v-if="step === 1">
        <el-form :model="verifyForm" :rules="verifyRules" ref="verifyFormRef" size="large">
          <el-form-item prop="email">
            <el-input v-model="verifyForm.email" placeholder="请输入注册邮箱" />
          </el-form-item>

          <el-form-item prop="phone">
            <el-input v-model="verifyForm.phone" placeholder="请输入注册手机号" />
          </el-form-item>

          <el-form-item prop="code">
            <div class="code-input">
              <el-input v-model="verifyForm.code" placeholder="请输入验证码" />
              <el-button 
                type="primary" 
                :disabled="countdown > 0" 
                @click="handleSendCode"
                class="code-btn"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="submit-btn" :loading="loading" @click="handleVerify">
              下一步
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤2：设置新密码 -->
      <div v-else>
        <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" size="large">
          <el-form-item prop="newPassword">
            <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码（至少6位）" />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="submit-btn" :loading="loading" @click="handleResetPassword">
              重置密码
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="back-link">
        <el-link @click="router.push('/login')">返回登录</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const step = ref(1)
const loading = ref(false)
const countdown = ref(0)
let timer: number | null = null

const verifyFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

const verifyForm = reactive({
  email: '',
  phone: '',
  code: ''
})

const passwordForm = reactive({
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

const verifyRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

const passwordRules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleSendCode = () => {
  if (!verifyForm.email || !verifyForm.phone) {
    ElMessage.warning('请先填写邮箱和手机号')
    return
  }
  
  countdown.value = 60
  timer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
  
  ElMessage.success('验证码已发送')
}

const handleVerify = async () => {
  if (!verifyFormRef.value) return
  
  await verifyFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        step.value = 2
        ElMessage.success('验证成功，请设置新密码')
      } catch {
        ElMessage.error('验证失败，请检查信息')
      } finally {
        loading.value = false
      }
    }
  })
}

const handleResetPassword = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        ElMessage.success('密码重置成功，请登录')
        router.push('/login')
      } catch {
        ElMessage.error('密码重置失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.forgot-wrapper {
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/images/login/log.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

.forgot-box {
  width: 400px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  box-sizing: border-box;
}

.forgot-header {
  text-align: center;
  margin-bottom: 30px;
}

.forgot-header h2 {
  margin: 0 0 10px 0;
  color: #333333;
}

.forgot-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
}

.code-input {
  display: flex;
  gap: 12px;
}

.code-btn {
  white-space: nowrap;
  min-width: 110px;
}

.back-link {
  text-align: center;
  margin-top: 16px;
}
</style>
