<template>
  <div class="apply-page-global-container">
    
    <div class="apply-header-banner">
      <h1 class="header-title">算力资源入驻申请</h1>
      <p class="header-subtitle">完善信息并提交审核，共建全国一体化算力网络</p>
    </div>

    <div class="apply-content-wrapper">
      <div class="apply-paper-card">
        
        <div class="apply-steps-container">
          <el-steps :active="1" align-center finish-status="success">
            <el-step title="提交申请资料" description="填写企业及算力资质" />
            <el-step title="平台资格审核" description="1-3个工作日反馈" />
            <el-step title="签署合作协议" description="商务沟通并确认权责" />
            <el-step title="算力上架联调" description="技术对接与资源上线" />
          </el-steps>
        </div>

        <el-divider border-style="dashed" />

        <div class="apply-form-container">
          <div class="form-section-title">
            <span class="blue-bar"></span>
            <h3>填写主体信息</h3>
          </div>

          <el-form 
            :model="formData" 
            :rules="rules" 
            ref="formRef" 
            label-width="120px" 
            class="provider-form"
            label-position="right"
          >
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="企业名称" prop="companyName">
                  <el-input v-model="formData.companyName" placeholder="请输入完整企业名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="统一信用代码" prop="creditCode">
                  <el-input v-model="formData.creditCode" placeholder="请输入统一社会信用代码" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="联系人姓名" prop="contactName">
                  <el-input v-model="formData.contactName" placeholder="请输入项目负责人姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="contactPhone">
                  <el-input v-model="formData.contactPhone" placeholder="请输入有效手机号" />
                </el-form-item>
              </el-col>
            </el-row>

            <div class="form-section-title" style="margin-top: 20px;">
              <span class="blue-bar"></span>
              <h3>填写算力信息</h3>
            </div>

            <el-form-item label="算力资源类型" prop="computeType">
              <el-checkbox-group v-model="formData.computeType">
                <el-checkbox label="GPU 智算" name="type" />
                <el-checkbox label="CPU 通算" name="type" />
                <el-checkbox label="超算" name="type" />
                <el-checkbox label="边缘计算" name="type" />
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="主要设备型号" prop="deviceModel">
              <el-input v-model="formData.deviceModel" placeholder="例如：NVIDIA A800 / Ascend 910B" />
            </el-form-item>

            <el-form-item label="预计入驻规模" prop="scale">
              <el-select v-model="formData.scale" placeholder="请选择资源规模" style="width: 100%;">
                <el-option label="小于 100 P" value="<100" />
                <el-option label="100 P - 500 P" value="100-500" />
                <el-option label="500 P - 1000 P" value="500-1000" />
                <el-option label="1000 P 以上" value=">1000" />
              </el-select>
            </el-form-item>

            <el-form-item label="资源优势及说明" prop="description">
              <el-input 
                v-model="formData.description" 
                type="textarea" 
                :rows="4" 
                placeholder="请简单描述您的机房位置、带宽网络条件或其他技术优势..." 
              />
            </el-form-item>

            <el-form-item class="form-submit-row">
              <el-button type="primary" class="submit-action-btn" @click="submitForm">提交入驻申请</el-button>
              <el-button class="cancel-action-btn" @click="goBack">返回上一页</el-button>
            </el-form-item>

          </el-form>
        </div>

      </div>
    </div>

    <footer class="global-dark-footer-block">
      <div class="footer-inner-1600-container">
        <div class="footer-top-columns-row">
          <div class="footer-brand-logo-col">
            <h2 class="footer-brand-main-title">算力调度运营平台</h2>
          </div>
          
          <div class="footer-info-details-col">
            <h4 class="column-header-title-lbl">基本信息</h4>
            <p class="info-text-line-item">联系邮箱：service@cs-xxxxxxxxxx-platform.com</p>
            <p class="info-text-line-item">联系地址：XX省XX市XX区智慧科创园区A栋商务中心</p>
          </div>
          
          <div class="footer-contact-action-col">
            <h4 class="column-header-title-lbl">联系我们</h4>
            <el-button type="primary" class="footer-consult-action-btn" @click="handleConsult">
              立即咨询
            </el-button>
          </div>
        </div>
        
        <div class="footer-bottom-compliance-bar">
          <p class="compliance-text-line-row">ICP备案编号：浙ICP备2024132127-3号</p>
          <p class="compliance-text-line-row">国家人工智能应用中试基地(医疗)-浙江版权所有 技术支持:国家人工智能应用中试基地(医疗)-浙江</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  companyName: '',
  creditCode: '',
  contactName: '',
  contactPhone: '',
  computeType: [],
  deviceModel: '',
  scale: '',
  description: ''
})

// 表单验证规则
const rules = reactive<FormRules>({
  companyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  creditCode: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
  contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  computeType: [{ type: 'array', required: true, message: '请至少选择一项算力资源类型', trigger: 'change' }],
  scale: [{ required: true, message: '请选择预计入驻规模', trigger: 'change' }]
})

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('申请提交成功！我们将会在1-3个工作日内与您联系。')
      // 提交完毕后返回上页
      setTimeout(() => {
        router.back()
      }, 1500)
    } else {
      ElMessage.error('请完善表单必填信息')
    }
  })
}

// 返回
const goBack = () => {
  router.back()
}

const handleConsult = () => {
  console.log('触发页脚咨询')
}
</script>

<style scoped>
/* ==========================================================================
   全局容器
   ========================================================================== */
.apply-page-global-container {
  width: 100%;
  min-height: 100vh;
  background-color: #F7F9FC; /* 沿用主项目的灰蓝底色 */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* ==========================================================================
   顶部标题横幅
   ========================================================================== */
.apply-header-banner {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #1055e8 0%, #1677FF 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
}

.header-title {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 12px 0;
  letter-spacing: 2px;
}

.header-subtitle {
  font-size: 16px;
  opacity: 0.85;
  margin: 0;
}

/* ==========================================================================
   主体卡片容器
   ========================================================================== */
.apply-content-wrapper {
  flex: 1;
  width: 1185px; /* 对齐全站版心 */
  margin: -40px auto 60px auto; /* 负边距实现向上托举悬浮感 */
  z-index: 10;
  position: relative;
}

.apply-paper-card {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 50px 60px;
  box-shadow: 0 8px 24px rgba(22, 119, 255, 0.08);
  border: 1px solid #E3EBF7;
}

/* ==========================================================================
   步骤条样式
   ========================================================================== */
.apply-steps-container {
  margin-bottom: 30px;
  padding: 0 20px;
}

:deep(.el-step__title.is-process) {
  font-weight: bold;
  color: #1677FF;
}

:deep(.el-step__head.is-process) {
  color: #1677FF;
  border-color: #1677FF;
}

/* ==========================================================================
   表单区域样式
   ========================================================================== */
.apply-form-container {
  padding-top: 20px;
  max-width: 900px;
  margin: 0 auto; /* 表单居中 */
}

.form-section-title {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.blue-bar {
  display: inline-block;
  width: 4px;
  height: 18px;
  background-color: #1677FF;
  border-radius: 2px;
  margin-right: 12px;
}

.form-section-title h3 {
  font-size: 16px;
  color: #222222;
  font-weight: bold;
  margin: 0;
}

/* 按钮居中处理 */
.form-submit-row {
  margin-top: 40px;
}

:deep(.form-submit-row .el-form-item__content) {
  justify-content: center;
}

.submit-action-btn {
  width: 140px !important;
  height: 40px !important;
  background: #1677FF !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  border-radius: 4px !important;
}

.submit-action-btn:hover {
  background: #4096ff !important;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.2);
}

.cancel-action-btn {
  width: 120px !important;
  height: 40px !important;
  font-size: 14px !important;
  border-radius: 4px !important;
}

/* ==========================================================================
   底部 Footer (完整复刻原样式)
   ========================================================================== */
.global-dark-footer-block {
  width: 100%;
  background-color: #1e1e1e;
  padding-top: 60px;
  padding-bottom: 30px;
  box-sizing: border-box;
}

.footer-inner-1600-container {
  width: 1600px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  padding-left: 24px;
  padding-right: 24px;
}

.footer-top-columns-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 40px;
  border-bottom: 1px solid #333333;
}

.footer-brand-logo-col {
  color: #FFFFFF;
}

.footer-brand-main-title {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
}

.footer-info-details-col {
  max-width: 500px;
}

.column-header-title-lbl {
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  margin-top: 0;
  margin-bottom: 18px;
}

.info-text-line-item {
  font-size: 14px;
  color: #a6a6a6;
  line-height: 1.8;
  margin-top: 0;
  margin-bottom: 8px;
}

.footer-contact-action-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-consult-action-btn {
  width: 110px !important;
  height: 40px !important;
  background: #1677FF !important;
  border: 1px solid #1677FF !important;
  border-radius: 4px !important;
  color: #FFFFFF !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  padding: 0 !important;
}

.footer-consult-action-btn:hover {
  background: #4693ff !important;
  border-color: #4693ff !important;
}

.footer-bottom-compliance-bar {
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.compliance-text-line-row {
  font-size: 13px;
  color: #777777;
  margin-top: 0;
  margin-bottom: 0;
  line-height: 1.5;
}
</style>