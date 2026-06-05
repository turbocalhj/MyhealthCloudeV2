<template>
  <div class="policy-page-global-container">
    <div class="policy-banner-block">
      <div class="banner-background-layer">
        <img 
          src="@/assets/images/policy/banner.png" 
          alt="政策专区背景" 
          class="banner-mask-native-img" 
        />
      </div>
      
      <div class="banner-text-inner">
        <h1 class="banner-main-headline">算力政策展示专区</h1>
        <p class="banner-sub-paragraph-text">
          汇聚全国省市区算力产业政策，助力企业获取政策红利
        </p>
        <div class="banner-badge-hint">实时更新 · 一站查询</div><br>
        <el-button type="primary" class="banner-apply-btn" @click="handleApply">
          算力券申报
        </el-button>
      </div>
    </div>

    <div class="policy-content-wrapper">
      <div class="policy-content-inside">
        
        <div class="policy-tabs-row">
          <div 
            v-for="tab in tabsOptions" 
            :key="tab.key"
            :class="['policy-tab-item', { 'active-tab': activeTab === tab.key }]"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </div>
        </div>

        <div class="policy-list-container">
          <div 
            v-for="(item, index) in currentPolicyList" 
            :key="index"
            class="policy-info-card"
          >
            <h3 class="policy-card-title">{{ item.title }}</h3>
            
            <div class="policy-card-meta">
              <span class="meta-label">发布单位：<span class="meta-value">{{ item.department }}</span></span>
              <span class="meta-date">
                <el-icon class="date-icon"><Clock /></el-icon>
                {{ item.date }}
              </span>
            </div>
            
            <p class="policy-card-summary">{{ item.summary }}</p>
            
            <div class="policy-card-footer">
              <span class="go-detail-link" @click="handlePolicyDetail(item)">
                查看详情 <span class="arrow-right">&gt;</span>
              </span>
            </div>
          </div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router' // 👇 新增引入路由
import { Clock } from '@element-plus/icons-vue' // 需要引入 Element Plus 的图标库

const router = useRouter() // 👇 实例化路由

// Tab 选项定义
const tabsOptions = [
  { label: '省级政策', key: 'province' },
  { label: '市级政策', key: 'city' },
  { label: '区级政策', key: 'district' },
  { label: '算力券', key: 'coupon' }
]

const activeTab = ref('province')

// 完全还原图三至图五的数据矩阵
const policyDataMatrix = {
  province: [
    {
      title: '关于组织开展2025年人工智能券（算力券）兑付申报的通知',
      department: '浙江省发展和改革委员会',
      date: '2025-05-16',
      summary: '各有关单位：根据国家相关通知要求，现面向全省开展2025年国家人工智能券（算力券）兑付申报工作。现将有关事项通知如下：一、人工智能券（算力券）是国家使用超长期特别国债资金，试点推动形成人工智能服务资源（算力）供给和需求侧良性循环，降低...'
    },
    {
      title: '浙江省人民政府印发关于支持人工智能创新发展若干措施的通知',
      department: '浙江省人民政府',
      date: '2025-05-16',
      summary: '为抢占人工智能发展制高点，打造全球人工智能创新发展高地，提出如下措施。一、发展目标 坚持创新驱动、企业主导、政府引导、生态共建，统筹布局算力、数据、模型基础设施，打造人工智能创新发展高地。到2027年，初步形成可持续发展、领跑发展格局，通用人工智能核心技术和...'
    }
  ],
  city: [
    {
      title: '杭州市经信局（市数字经济局）关于组织开展2025年算力券兑付申报的通知',
      department: '杭州市经济和信息化局',
      date: '2025-03-28',
      summary: '各区、县（市）经信局（发改经信局、经科技局）：根据《杭州市人民政府办公厅关于加快推进人工智能产业创新发展的实施意见》（杭政办函〔2023〕55号）和《支持人工智能全产业链高质量发展的若干措施》（杭政办函〔2024〕40号）等有关文件精神，经研究，决定开展2025年...'
    },
    {
      title: '杭州市人民政府办公厅关于印发支持人工智能全产业链高质量发展若干措施的通知',
      department: '杭州市人民政府办公厅',
      date: '2024-07-23',
      summary: '为抢抓人工智能新一轮发展机遇，积极实施“人工智能+”行动，推动杭州人工智能产业全产业链高质量发展，打造全国人工智能产业发展高地，特制定本措施。一、加快算力设施建设 （一）支持算力技术攻关。鼓励企业开展算力关键技术研发攻关，市级按照有关政策给予支持。鼓励企业承...'
    }
  ],
  district: [
    {
      title: '关于促进人工智能产业创新发展的若干政策（试行）',
      department: '萧山区人民政府',
      date: '2025-07-14',
      summary: '为全面贯彻落实中央、省、市关于发展新一代人工智能的重大决策部署，支持人工智能产业创新发展，构建人工智能产业生态，进一步助力萧山打造人工智能产业创新发展高地，特制定以下政策...'
    },
    {
      title: '杭州今年首批“算力券”发放 余航加快推进“两个5000万”政策落地',
      department: '余杭区人民政府',
      date: '2025-05-16',
      summary: '本报讯（记者 徐翘楚）记者从市经信局（市数字经济局）获悉，2025年杭州市“算力券”首批兑付开始，有3家企业获财政补贴的“算力券”，其中包括余航企业杭州核新软件技术有限公司。根据杭州市人民政府办公厅印发的《支持人工智能全产业链高质量发展的若干措施》，“算力券”支持企...'
    }
  ],
  coupon: [
    {
      title: '关于组织开展2025年人工智能券（算力券）兑付申报的通知',
      department: '浙江省发展和改革委员会',
      date: '2025-05-16',
      summary: '各有关单位：根据国家相关通知要求，现面向全省开展2025年国家人工智能券（算力券）兑付申报工作。现将有关事项通知如下：一、人工智能券（算力券）是国家使用超长期特别国债资金...'
    },
    {
      title: '杭州今年首批“算力券”发放 余航加快推进“两个5000万”政策落地',
      department: '余杭区人民政府',
      date: '2025-05-16',
      summary: '本报讯（记者 徐翘楚）记者从市经信局（市数字经济局）获悉，2025年杭州市“算力券”首批兑付开始，有3家企业获财政补贴的“算力券”，其中包括余航企业杭州核新软件技术有限公司...'
    }
  ]
}

// 动态计算当前选中的数据列表
const currentPolicyList = computed(() => {
  return policyDataMatrix[activeTab.value as keyof typeof policyDataMatrix] || []
})

// 业务方法留空待挂载
const handleApply = () => {
  console.log('触发Banner算力券申报')
}

// 👇 修改后的跳转方法
const handlePolicyDetail = (policy: any) => {
  router.push({
    name: 'PolicyDetail',
    query: { title: policy.title }
  })
}

const handleConsult = () => {
  console.log('触发页脚咨询')
}
</script>

<style scoped>
/* ==========================================================================
   全局容器
   ========================================================================== */
.policy-page-global-container {
  width: 100%;
  background-color: #F7F9FC; /* 页面底色采用轻微浅灰蓝，衬托纯白卡片 */
  box-sizing: border-box;
}

/* ==========================================================================
   第一部分：Banner 样式还原（图一图二混排效果）
   ========================================================================== */
.policy-banner-block {
  position: relative;
  width: 100%;
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
}

.banner-background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.banner-mask-native-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-text-inner {
  position: relative;
  z-index: 5;
  text-align: center;
  max-width: 900px;
}

.banner-main-headline {
  font-size: 45px;
  font-weight: bold;
  color: #1677FF;
  margin-top: 0;
  margin-bottom: 16px;
  letter-spacing: 4px;
  width: 416px;
  height: 58px;
}

.banner-sub-paragraph-text {
  font-size: 18px;
  color: #555555;
  margin-top: 0;
  margin-bottom: 12px;
  width: 416px;
  height: 12px;
  white-space: nowrap
}

.banner-badge-hint {
  font-size: 13px;
  color: #1677FF;
  background: rgba(22, 119, 255, 0.06);
  display: inline-block;
  padding: 4px 16px;
  border-radius: 20px;
  margin-bottom: 24px;
  margin-top:16px ;
}

.banner-apply-btn {
  width: 120px !important;
  height: 40px !important;
  background: #1677FF !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
}

/* ==========================================================================
   第二部分：筛选 Tabs 与卡片列表
   ========================================================================== */
.policy-content-wrapper {
  width: 100%;
  box-sizing: border-box;
}

.policy-content-inside {
  width: 1185px; /* 宽度调整与解决方案卡片对齐，保持页面整体结构比例 */
  margin-left: auto;
  margin-right: auto;
  padding-top: 48px;
  padding-bottom: 80px;
  box-sizing: border-box;
}

/* 四个筛选栏横向队列 */
.policy-tabs-row {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.policy-tab-item {
  padding: 10px 24px;
  background: #FFFFFF;
  border: 1px solid #E3EBF7;
  border-radius: 6px;
  font-size: 14px;
  color: #555555;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.policy-tab-item:hover {
  color: #1677FF;
  border-color: #1677FF;
}

/* 激活态 Tab 还原图二样式 */
.active-tab {
  background: #1677FF !important;
  color: #FFFFFF !important;
  border-color: #1677FF !important;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.2);
}

/* 政策列表与卡片 */
.policy-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.policy-info-card {
  background: #FFFFFF;
  border: 1px solid #E3EBF7;
  border-radius: 8px;
  padding: 28px 32px;
  box-sizing: border-box;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.policy-info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(22, 119, 255, 0.05);
}

.policy-card-title {
  font-size: 18px;
  font-weight: bold;
  color: #222222;
  margin-top: 0;
  margin-bottom: 14px;
  line-height: 1.4;
}

.policy-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 16px;
}

.meta-value {
  color: #444444;
}

.meta-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-icon {
  font-size: 14px;
}

.policy-card-summary {
  font-size: 14px;
  color: #666666;
  line-height: 1.7;
  margin-top: 0;
  margin-bottom: 16px;
  text-align: justify;
}

.policy-card-footer {
  display: flex;
  justify-content: flex-start;
}

.go-detail-link {
  font-size: 13px;
  color: #1677FF;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.go-detail-link:hover {
  color: #4693ff;
}

.arrow-right {
  margin-left: 4px;
  font-family: simsun; /* 还原尖角箭头 */
}

/* ==========================================================================
   第三部分：工业级暗色 Footer 页脚区样式（完美沿用前置规格）
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
  font-size: 22px;
  font-weight: bold;
  color: #FFFFFF;
  margin-top: 0;
  margin-bottom: 0;
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