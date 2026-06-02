<template>
  <div class="ticket-detail-page-container">
    <div class="detail-back-navigation-bar" @click="$router.back()">
      <el-icon class="back-arrow-icon"><ArrowLeft /></el-icon>
      <span class="navigation-title-text">工单详情</span>
    </div>

    <div class="ticket-info-summary-card">
      <div class="card-inner-block-title">工单信息</div>
      
      <div class="three-column-metadata-grid">
        <div class="meta-cell"><span class="lbl">工单编号：</span><span class="val font-mono">{{ ticketInfo.ticketId }}</span></div>
        <div class="meta-cell"><span class="lbl">工单类型：</span><span class="val">{{ ticketInfo.ticketType }}</span></div>
        <div class="meta-cell">
          <span class="lbl">工单状态：</span>
          <span class="status-tag-pill-node status-transfer-wait">
            <span class="status-dot-inner">●</span> {{ ticketInfo.status }}
          </span>
        </div>

        <div class="meta-cell"><span class="lbl">创建时间：</span><span class="val">{{ ticketInfo.createTime }}</span></div>
        <div class="meta-cell"><span class="lbl">联系邮箱：</span><span class="val">163@163.com</span></div>
        <div class="meta-cell"><span class="lbl">联系电话：</span><span class="val">18215684930</span></div>
        
        <div class="meta-cell full-width-cell"><span class="lbl">工单标题：</span><span class="val bold-title">{{ ticketInfo.title }}</span></div>
      </div>

      <div class="problem-description-paragraph-box">
        <div class="desc-lbl">问题描述</div>
        <div class="desc-content-text">云主机内存异常</div>
      </div>
    </div>

    <div class="ticket-reply-workspace-card margin-top-16">
      <div class="card-inner-block-title">回复</div>
      
      <div class="reply-input-wrapper">
        <el-input
          v-model="replyText"
          type="textarea"
          :rows="6"
          placeholder="请输入回复内容..."
          maxlength="1000"
          show-word-limit
          class="custom-reply-textarea"
        />
        
        <div class="reply-bottom-action-bar">
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="true"
            multiple
          >
            <el-button size="default" class="btn-plain-upload">
              <el-icon class="icon-margin"><Upload /></el-icon>添加附件
            </el-button>
          </el-upload>
          
          <el-button type="primary" class="btn-primary-submit-reply" @click="submitReplyAction">
            提交回复
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const replyText = ref('')

const ticketInfo = ref({
  ticketId: 'WA202604180043013110',
  title: '故障咨询',
  ticketType: '故障工单',
  status: '转派待接收',
  createTime: '2026-04-18 00:43:01'
})

onMounted(() => {
  if (route.query && Object.keys(route.query).length > 0) {
    ticketInfo.value = {
      ticketId: (route.query.ticketId as string) || ticketInfo.value.ticketId,
      title: (route.query.title as string) || ticketInfo.value.title,
      ticketType: (route.query.ticketType as string) || ticketInfo.value.ticketType,
      status: (route.query.status as string) || ticketInfo.value.status,
      createTime: (route.query.createTime as string) || ticketInfo.value.createTime
    }
  }
})

const submitReplyAction = () => {
  if (!replyText.value.trim()) {
    ElMessage.warning('请输入回复正文后再提交')
    return
  }
  ElMessage.success('回复提交成功，运维专家正在全力为您加急排查')
  replyText.value = ''
}
</script>

<style scoped>
.ticket-detail-page-container { width: 100%; display: flex; flex-direction: column; }
.detail-back-navigation-bar { display: flex; align-items: center; cursor: pointer; padding: 8px 0; margin-bottom: 16px; user-select: none; width: max-content; }
.back-arrow-icon { font-size: 16px; color: #4E5969; margin-right: 8px; }
.navigation-title-text { font-size: 16px; font-weight: 600; color: #1D2129; }

/* 基础卡片框架样式 */
.ticket-info-summary-card, .ticket-reply-workspace-card { background-color: #ffffff; border-radius: 4px; padding: 24px; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03); border: 1px solid #E5E6EB; }
.margin-top-16 { margin-top: 16px; }
.card-inner-block-title { font-size: 14px; font-weight: 600; color: #1D2129; margin-bottom: 20px; }

/* 完美还原图二表单三列排版 */
.three-column-metadata-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px 40px; margin-bottom: 24px; }
.meta-cell { font-size: 13px; display: flex; align-items: center; }
.meta-cell .lbl { color: #86909C; width: 75px; flex-shrink: 0; }
.meta-cell .val { color: #1D2129; }
.full-width-cell { grid-column: span 3; }
.bold-title { font-weight: 500; }

/* 问题描述区块 */
.problem-description-paragraph-box { border-top: 1px dashed #E5E6EB; padding-top: 16px; font-size: 13px; }
.problem-description-paragraph-box .desc-lbl { color: #86909C; margin-bottom: 8px; }
.problem-description-paragraph-box .desc-content-text { color: #1D2129; line-height: 1.6; }

/* 工单状态标签规格 */
.status-tag-pill-node { display: inline-flex; align-items: center; gap: 6px; padding: 2px 10px; border-radius: 12px; font-size: 12px; }
.status-dot-inner { font-size: 8px; }
.status-transfer-wait { background-color: #F5EEFF; color: #722ED1; border: 1px solid #D3ADF7; }

/* 回复区域样式排版 */
.reply-input-wrapper { display: flex; flex-direction: column; gap: 16px; }
.reply-bottom-action-bar { display: flex; justify-content: space-between; align-items: flex-start; }
.btn-plain-upload { background-color: #ffffff !important; border: 1px solid #E5E6EB !important; color: #4E5969 !important; font-size: 14px !important; }
.btn-plain-upload:hover { background-color: #FAFAFA !important; border-color: #C9CDD4 !important; }
.btn-primary-submit-reply { background-color: #1677FF !important; border-color: #1677FF !important; font-size: 14px !important; padding: 8px 20px !important; }
.btn-primary-submit-reply:hover { background-color: #4096ff !important; }
.icon-margin { margin-right: 4px; }
.font-mono { font-family: Consolas, Monaco, monospace; }
</style>