<template>
  <div class="console-general-resource-workspace-page notranslate" translate="no">
    <div class="search-filter-card-box">
      <div class="filter-layout-inline-row">
        <div class="filter-input-cell">
          <span class="filter-field-lbl">资源名称</span>
          <el-input 
            v-model="resourceSearchQuery" 
            placeholder="输入资源名称或ID" 
            style="width: 240px" 
            clearable 
          />
        </div>
        
        <div class="filter-action-btns-group">
          <el-button type="primary" class="action-search-primary-blue-btn" @click="handleSearch">
            <el-icon class="icon-margin-right"><Search /></el-icon> 搜索
          </el-button>
          <el-button class="action-reset-plain-btn" @click="handleReset">
            <el-icon class="icon-margin-right"><Refresh /></el-icon> 重置
          </el-button>
        </div>
      </div>
    </div>

    <div class="data-table-container-card">
      <el-table 
        :data="filteredTableData" 
        style="width: 100%" 
        size="default"
        :header-cell-style="{ background: '#F7F8FA', color: '#1D2129', fontWeight: '500', height: '44px' }"
      >
        <el-table-column prop="id" label="资源ID" width="180" show-overflow-tooltip />
        
        <el-table-column prop="name" label="资源名称" min-width="160">
          <template #default="scope">
            <span class="interactive-blue-link-lbl" @click="goToDetailPage(scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="region" label="区域" width="100" />
        <el-table-column prop="cpu" label="CPU" width="90" />
        <el-table-column prop="memory" label="内存" width="90" />
        <el-table-column prop="intranetIp" label="内网IP" width="140" />
        
        <el-table-column prop="isContract" label="是否合同资源" width="120" align="center">
          <template #default="scope">
            <span class="pink-contract-status-tag-no">{{ scope.row.isContract }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="demandUser" label="需求方" width="120" />
        
        <el-table-column label="操作" fixed="right" width="130">
          <template #default="scope">
            <div class="table-inline-actions-flex">
              <span class="action-blue-link" @click="goToDetailPage(scope.row)">详情</span>
              <span class="action-blue-link" @click="handleAction('restart', scope.row)">重启</span>
              
              <el-dropdown trigger="click" @command="(cmd: string) => handleMoreCommand(cmd, scope.row)">
                <span class="more-action-trigger-dots">
                  <el-icon><MoreFilled /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="stop">停止实例</el-dropdown-item>
                    <el-dropdown-item command="destroy">销毁资源</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pagination-footer-row">
        <el-pagination 
          :total="filteredTableData.length" 
          :current-page="1" 
          :page-size="10" 
          layout="total, prev, pager, next, sizes" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Refresh, MoreFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const resourceSearchQuery = ref('')

const tableRawDataset = ref([
  { id: '1-2ze2awf50fszzvp7qq1z', name: 'FT_AUTO_ALI_20260531...', region: '--', cpu: '1核', memory: '1GB', intranetIp: '172.16.0.94', isContract: '否', demandUser: '测评中心', status: '运行中', systemDisk: '40GB' },
  { id: 'i-2zehnnuzmb2te7mbo0rn', name: 'test-jacky', region: '--', cpu: '1核', memory: '2GB', intranetIp: '172.16.156.163', isContract: '否', demandUser: '测评中心', status: '运行中', systemDisk: '40GB' },
  { id: '1-2zef1oxtc4jymmbr4lk8', name: 'jky0529', region: '--', cpu: '12核', memory: '96GB', intranetIp: '172.16.0.97', isContract: '否', demandUser: '测评中心', status: '已停止', systemDisk: '100GB' },
  { id: 'i-2zehlr7vlhb57jisetavp', name: 'jacky-5-29-1', region: '--', cpu: '1核', memory: '1GB', intranetIp: '172.27.73.245', isContract: '否', demandUser: '测评中心', status: '运行中', systemDisk: '40GB' }
])

const filteredTableData = computed(() => {
  return tableRawDataset.value.filter(item => {
    return !resourceSearchQuery.value || 
           item.name.toLowerCase().includes(resourceSearchQuery.value.toLowerCase()) ||
           item.id.toLowerCase().includes(resourceSearchQuery.value.toLowerCase())
  })
})

// 🚀 核心：赋予通算资源详情跳转与数据完美映射
const goToDetailPage = (row: any) => {
  router.push({
    path: '/console/resource-detail',
    query: {
      id: row.id,
      name: row.name,
      status: row.status || '运行中',
      intranetIp: row.intranetIp,
      cpu: row.cpu,
      memory: row.memory,
      systemDisk: row.systemDisk || '--',
      region: row.region || '--',
      demander: row.demandUser || '测评中心',
      provider: '阿里云' // 区分通算供给方
    }
  })
}

const handleSearch = () => { ElMessage.success('通算资产数据检索完毕') }
const handleReset = () => { resourceSearchQuery.value = '' }
const handleAction = (type: string, _row: any) => { ElMessage.info(`触发 [${type}] 操作`) }
const handleMoreCommand = (cmd: string, _row: any) => { ElMessage.success(`快捷指令: ${cmd}`) }
</script>

<style scoped>
.search-filter-card-box { background-color: #ffffff; padding: 18px 24px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03); margin-bottom: 16px; }
.filter-layout-inline-row { display: flex; justify-content: space-between; align-items: center; }
.filter-input-cell { display: flex; align-items: center; gap: 12px; }
.filter-field-lbl { font-size: 14px; color: #4E5969; }
.filter-action-btns-group { display: flex; gap: 12px; }
.action-search-primary-blue-btn { background-color: #1677FF !important; border-color: #1677FF !important; }
.data-table-container-card { background-color: #ffffff; padding: 20px 24px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.03); }
.interactive-blue-link-lbl { color: #1677FF; cursor: pointer; }
.interactive-blue-link-lbl:hover { text-decoration: underline; }
.pink-contract-status-tag-no { background-color: #FFF0F6; color: #EB2F96; border: 1px solid #FFADD2; padding: 1px 8px; border-radius: 2px; font-size: 12px; }
.table-inline-actions-flex { display: flex; align-items: center; gap: 12px; }
.action-blue-link { color: #1677FF; cursor: pointer; font-size: 14px; }
.more-action-trigger-dots { color: #86909C; cursor: pointer; display: flex; align-items: center; outline: none; }
.table-pagination-footer-row { display: flex; justify-content: flex-end; padding-top: 20px; }
.icon-margin-right { margin-right: 4px; }
</style>