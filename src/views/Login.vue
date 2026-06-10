<template>
  <!-- 登录模块：用户身份认证入口 -->
  <div class="login-wrapper">
    <div class="login-box">
      <div class="login-header">
        <h2>算力调度运营平台</h2>
      </div>

      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" size="large">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="submit-btn" :loading="loading" @click="handleLogin">
            立即登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 登录逻辑：表单验证、调用认证API、存储Token、路由跳转
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { LoginRequest, LoginResponse } from '@/types'
import { loginApi } from '@/api/auth'
import { useUserStore } from '@/store/modules/user'

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const userStore = useUserStore()

const nativeRouter = useRouter()
const currentRoute = useRoute()

const loginForm = reactive<LoginRequest>({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      
      try {
        // 调用登录API，获取Token和用户角色
        const res: LoginResponse = await loginApi(loginForm)
        
        // 通过 store 统一管理认证信息
        userStore.setAuth({ token: res.token, roles: res.roles })
        
        ElMessage({
          message: '登录成功，正在进入系统...',
          type: 'success',
          duration: 1500
        })
        
        const redirectUrl = (currentRoute.query.redirect as string) || '/main/home'
        
        if (nativeRouter && typeof nativeRouter.push === 'function') {
          nativeRouter.replace(redirectUrl)
        } else {
          window.location.hash = `#${redirectUrl}`
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : '登录失败，请检查网络或账号信息'
        ElMessage.error(message)
      } finally {
        loading.value = false
      }

    } else {
      ElMessage.error('请完整填写登录表单项！')
    }
  })
}
</script>

<style scoped>
/* 原有布局样式保持 100% 不变 */
.login-wrapper {
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/images/login/log.png');
  background-size: cover;          /* 覆盖整个区域，保持比例 */
  background-position: center;     /* 居中显示 */
  background-repeat: no-repeat;    /* 不平铺 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 400px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  box-sizing: border-box;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin: 0 0 10px 0;
  color: #333333;
}

.login-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
}
</style>