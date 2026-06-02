<template>
  <div class="console-ticket-create-container">
    <div class="form-main-card-wrapper">
      
      <div class="form-back-navigation-bar" @click="handleCancel">
        <el-icon class="back-arrow-icon"><ArrowLeft /></el-icon>
        <span class="navigation-title-lbl">创建工单</span>
      </div>

      <el-form 
        :model="ticketForm" 
        :rules="formRules"
        ref="ticketFormRef"
        label-position="top" 
        class="standard-vertical-form-body"
      >
        <el-form-item label="工单标题" prop="title" required>
          <el-input 
            v-model="ticketForm.title" 
            placeholder="请输入工单标题" 
            maxlength="100" 
            show-word-limit 
            class="custom-form-input-node"
          />
        </el-form-item>

        <el-form-item label="工单类型" prop="type" required>
          <el-select 
            v-model="ticketForm.type" 
            placeholder="请选择工单类型" 
            style="width: 100%"
            class="custom-form-input-node"
          >
            <el-option label="咨询工单" value="咨询工单" />
            <el-option label="运维工单" value="运维工单" />
            <el-option label="故障工单" value="故障工单" />
          </el-select>
        </el-form-item>

        <el-form-item label="问题描述" prop="description" required>
          <el-input 
            v-model="ticketForm.description" 
            type="textarea" 
            :rows="5" 
            placeholder="请详细描述您遇到的问题或需求" 
            maxlength="1000" 
            show-word-limit 
            class="custom-form-input-node"
          />
        </el-form-item>

        <el-form-item label="附件" class="uploader-form-item-box">
          <el-upload 
            class="ticket-drag-uploader-component" 
            drag 
            action="#" 
            multiple 
            :auto-upload="false"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">点击或拖拽文件到此区域上传</div>
            <template #tip>
              <div class="el-upload__tip-hint-lbl">
                支持 JPG、PNG、PDF 格式，单个文件不超过 10MB，最多 3 个
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="联系电话" prop="phone" required>
          <el-input 
            v-model="ticketForm.phone" 
            placeholder="请输入联系电话" 
            class="custom-form-input-node"
          />
        </el-form-item>

        <el-form-item label="联系邮箱" prop="email" required>
          <el-input 
            v-model="ticketForm.email" 
            placeholder="请输入联系邮箱" 
            class="custom-form-input-node"
          />
        </el-form-item>

        <div class="form-submit-actions-row">
          <el-button 
            type="primary" 
            class="form-primary-submit-btn" 
            @click="handleSubmit(ticketFormRef)"
          >
            提交工单
          </el-button>
          
          <el-button 
            class="form-plain-cancel-btn" 
            @click="handleCancel"
          >
            取消
          </el-button>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const ticketFormRef = ref<FormInstance>()

// 100% 对应图一、图二所需的核心字段模型
const ticketForm = ref({
  title: '',
  type: '',
  description: '',
  phone: '18215684930', // 完美反填图二截图中的初始手机号
  email: ''
})

// 严谨的前端红星必填校验规则矩阵
const formRules = ref<FormRules>({
  title: [{ required: true, message: '工单标题不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '请选择工单类型', trigger: 'change' }],
  description: [{ required: true, message: '问题描述不能为空', trigger: 'blur' }],
  phone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '联系邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
})

// 提交核心表单数据逻辑
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      ElMessage.success('工单及需求登记提交成功！平台将火速为您处理。')
      // 提交成功后返回工单列表页
      router.push('/console/ticket-list')
    } else {
      ElMessage.error('请检查表单必填项是否填写完整')
    }
  })
}

// 点击取消或返回按钮，直接切回工单中心列表页
const handleCancel = () => {
  router.push('/console/ticket-list')
}
</script>

<style scoped>
/* ==========================================================================
   页面底层画布基础板式
   ========================================================================== */
.console-ticket-create-container {
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.form-main-card-wrapper {
  width: 100%;
  background-color: #ffffff;
  padding: 24px 32px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03);
}

/* 面包屑返回头部指示栏 */
.form-back-navigation-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #1D2129;
  cursor: pointer;
  margin-bottom: 32px;
  width: max-content;
  user-select: none;
}

.form-back-navigation-bar:hover {
  color: #1677FF;
}

.back-arrow-icon {
  font-size: 16px;
}

/* 垂直流式表单尺寸限定机制 */
.standard-vertical-form-body {
  max-width: 760px; /* 限制宽度，防止大屏下输入框过长拉伸变形 */
  margin-left: 0;   /* 左侧自然对齐 */
}

/* 覆盖 Element Plus 核心标签样式，100% 还原截图字体粗细 */
:deep(.el-form-item__label) {
  font-weight: 500 !important;
  color: #1D2129 !important;
  padding-bottom: 8px !important;
  font-size: 14px !important;
}

.custom-form-input-node {
  width: 100%;
}

/* --------------------------------------------------------------------------
   附件拖拽区域高级质感重写
   -------------------------------------------------------------------------- */
.uploader-form-item-box {
  margin-bottom: 24px !important;
}

.ticket-drag-uploader-component {
  width: 100%;
}

:deep(.el-upload-dragger) {
  background-color: #FAFAFA !important;
  border: 1px dashed #E5E6EB !important;
  border-radius: 4px !important;
  padding: 32px 16px !important;
  transition: border-color 0.2s ease;
}

:deep(.el-upload-dragger:hover) {
  border-color: #1677FF !important;
}

:deep(.el-upload-dragger .el-icon--upload) {
  font-size: 40px !important;
  color: #C9CDD4 !important;
  margin-bottom: 12px;
}

.el-upload__text {
  font-size: 14px;
  color: #4E5969;
}

.el-upload__tip-hint-lbl {
  font-size: 13px;
  color: #86909C;
  margin-top: 8px;
  line-height: 1.4;
}

/* --------------------------------------------------------------------------
   底端双控操作动作条区域（完美还原图二按钮质感）
   -------------------------------------------------------------------------- */
.form-submit-actions-row {
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 提交工单（实色深蓝） */
.form-primary-submit-btn {
  background-color: #1677FF !important;
  border-color: #1677FF !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  padding: 10px 24px !important;
  height: 38px;
  border-radius: 4px !important;
}

.form-primary-submit-btn:hover {
  background-color: #4096ff !important;
  border-color: #4096ff !important;
}

/* 取消按钮（经典灰白边框） */
.form-plain-cancel-btn {
  background-color: #ffffff !important;
  border: 1px solid #E5E6EB !important;
  color: #1D2129 !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  padding: 10px 24px !important;
  height: 38px;
  border-radius: 4px !important;
}

.form-plain-cancel-btn:hover {
  background-color: #F2F3F5 !important;
  border-color: #C9CDD4 !important;
}
</style>