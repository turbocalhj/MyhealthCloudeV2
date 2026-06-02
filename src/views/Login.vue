<template>
  <div class="login-wrapper">
    <div class="login-box">
      <div class="login-header">
        <h2>算力调度运营平台</h2>
        <p>用户登录认证中心</p>
      </div>

      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" size="large">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名">
            <template #prefix>👤</template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" show-password placeholder="请输入密码">
            <template #prefix>🔒</template>
          </el-input>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

// 显式接收路由实例，防止自动导入插件在异步回调中丢失上下文
const nativeRouter = useRouter()

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      
      // 1. 先将登录标记存入本地缓存，确保前置路由守卫安全放行
      localStorage.setItem('isPlatformLogged', 'true')
      
      setTimeout(() => {
        loading.value = false
        
        ElMessage({
          message: '登录成功，正在为您返回系统首页...',
          type: 'success',
          duration: 1500
        })
        
        // 🌟 核心微调点：同步更新跳转路径为前台大厅的专属物理隔离地址 /main/home
        // 这样可以确保登录成功后，页面绝对不会错误地串进后台控制台的菜单里渲染
        if (nativeRouter && typeof nativeRouter.push === 'function') {
          nativeRouter.push('/main/home')
        } else {
          window.location.hash = '#/main/home'
        }
      }, 800)
    } else {
      ElMessage.error('请完整填写登录表单项！')
    }
  })
}
</script>

<style scoped>
.login-wrapper {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
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