<template>
  <div class="console-ticket-create-container">
    <div class="form-main-card-wrapper">

      <div class="form-back-navigation-bar" @click="handleCancel">
        <el-icon class="back-arrow-icon"><ArrowLeft /></el-icon>
        <span class="navigation-title-lbl">{{ isFromTemplate ? '使用模板创建工单' : '创建工单' }}</span>
      </div>

      <!-- 模板反填提示 -->
      <div v-if="isFromTemplate" class="template-fill-hint-banner">
        <el-icon class="hint-icon"><InfoFilled /></el-icon>
        <span class="hint-text">已应用模板：<strong>{{ templateName }}</strong>，请补充具体的工单信息</span>
        <el-button size="small" text @click="clearTemplate">清除模板</el-button>
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

        <el-form-item label="优先级" prop="priority" required>
          <el-radio-group v-model="ticketForm.priority" class="priority-radio-group-row">
            <el-radio-button label="高" class="priority-high-radio">
              <el-icon><WarningFilled /></el-icon> 高
            </el-radio-button>
            <el-radio-button label="中" class="priority-medium-radio">中</el-radio-button>
            <el-radio-button label="低" class="priority-low-radio">低</el-radio-button>
          </el-radio-group>
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
            :file-list="fileList"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :on-exceed="handleExceed"
            :limit="3"
            accept=".jpg,.jpeg,.png,.pdf"
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
            :loading="submitting"
            @click="handleSubmit(ticketFormRef)"
          >
            {{ submitting ? '提交中...' : '提交工单' }}
          </el-button>

          <el-button
            class="form-plain-cancel-btn"
            @click="handleCancel"
          >
            取消
          </el-button>

          <el-button
            class="form-save-draft-btn"
            @click="handleSaveDraft"
          >
            <el-icon><Document /></el-icon> 保存为草稿
          </el-button>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, UploadFilled, InfoFilled, Document, WarningFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadFile, UploadFiles } from 'element-plus'

const router = useRouter()
const route = useRoute()
const ticketFormRef = ref<FormInstance>()

// 模板反填
const isFromTemplate = ref(false)
const templateName = ref('')

const ticketForm = ref({
  title: '',
  type: '',
  priority: '中',
  description: '',
  phone: '18215684930',
  email: ''
})

const fileList = ref<UploadFile[]>([])
const submitting = ref(false)

const formRules = ref<FormRules>({
  title: [
    { required: true, message: '工单标题不能为空', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择工单类型', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  description: [
    { required: true, message: '问题描述不能为空', trigger: 'blur' },
    { min: 10, message: '问题描述不能少于 10 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '联系电话不能为空', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '联系邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
})

onMounted(() => {
  // 模板反填
  if (route.query.templateType) {
    isFromTemplate.value = true
    templateName.value = route.query.templateName as string
    ticketForm.value.type = route.query.templateType as string
    if (route.query.templateDesc) {
      ticketForm.value.description = `[来自模板：${route.query.templateName}]\n\n${route.query.templateDesc}\n\n`
    }
  }
})

const clearTemplate = () => {
  isFromTemplate.value = false
  templateName.value = ''
  ticketForm.value.type = ''
  ticketForm.value.description = ''
  // 清理 URL 参数
  router.replace({ path: '/console/ticket-create' })
}

const handleFileChange = (file: UploadFile, files: UploadFiles) => {
  // 限制文件大小
  if (file.size && file.size > 10 * 1024 * 1024) {
    ElMessage.error(`文件 ${file.name} 超过 10MB 限制`)
    fileList.value = fileList.value.filter(f => f.uid !== file.uid)
    return
  }
  fileList.value = files
}

const handleFileRemove = (_file: UploadFile, files: UploadFiles) => {
  fileList.value = files
}

const handleExceed = () => {
  ElMessage.warning('最多只能上传 3 个文件')
}

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      submitting.value = true
      // 模拟提交
      setTimeout(() => {
        submitting.value = false
        ElMessageBox.alert('工单已成功提交，平台将尽快为您处理', '提交成功', {
          confirmButtonText: '查看我的工单',
          callback: () => {
            router.push('/console/ticket-list')
          }
        })
      }, 800)
    } else {
      ElMessage.error('请检查表单必填项是否填写完整')
    }
  })
}

const handleSaveDraft = () => {
  localStorage.setItem('ticket_draft', JSON.stringify(ticketForm.value))
  ElMessage.success('草稿已保存')
}

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

.form-back-navigation-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #1D2129;
  cursor: pointer;
  margin-bottom: 16px;
  width: max-content;
  user-select: none;
}

.form-back-navigation-bar:hover { color: #1677FF; }
.back-arrow-icon { font-size: 16px; }

/* 模板反填提示横幅 */
.template-fill-hint-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #E6F7FF;
  border: 1px solid #91D5FF;
  border-radius: 4px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #1D5BFF;
}

.hint-icon { font-size: 16px; }
.hint-text { flex: 1; }
.template-fill-hint-banner strong { color: #1677FF; font-weight: 600; }

.standard-vertical-form-body {
  max-width: 760px;
  margin-left: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500 !important;
  color: #1D2129 !important;
  padding-bottom: 8px !important;
  font-size: 14px !important;
}

.custom-form-input-node { width: 100%; }

/* 优先级单选按钮 */
.priority-radio-group-row { display: flex; gap: 12px; }
:deep(.priority-radio-group-row .el-radio-button__inner) { padding: 8px 20px; }
.priority-high-radio :deep(.el-radio-button__inner) { color: #F5222D !important; }
.priority-medium-radio :deep(.el-radio-button__inner) { color: #D46B08 !important; }
.priority-low-radio :deep(.el-radio-button__inner) { color: #52C41A !important; }

.uploader-form-item-box { margin-bottom: 24px !important; }
.ticket-drag-uploader-component { width: 100%; }
:deep(.el-upload-dragger) {
  background-color: #FAFAFA !important;
  border: 1px dashed #E5E6EB !important;
  border-radius: 4px !important;
  padding: 32px 16px !important;
  transition: border-color 0.2s ease;
}
:deep(.el-upload-dragger:hover) { border-color: #1677FF !important; }
:deep(.el-upload-dragger .el-icon--upload) { font-size: 40px !important; color: #C9CDD4 !important; margin-bottom: 12px; }
.el-upload__text { font-size: 14px; color: #4E5969; }
.el-upload__tip-hint-lbl { font-size: 13px; color: #86909C; margin-top: 8px; line-height: 1.4; }

.form-submit-actions-row {
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
}

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

.form-save-draft-btn {
  background-color: #ffffff !important;
  border: 1px solid #1677FF !important;
  color: #1677FF !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  padding: 10px 24px !important;
  height: 38px;
  border-radius: 4px !important;
}
</style>