<template>
  <div class="console-dynamic-asset-workspace-wrapper notranslate" translate="no">
    
    <div class="asset-search-card">
      <div class="search-layout-row">
        <div class="search-input-box">
          <span class="lbl">资源名称</span>
          <el-input v-model="localQueryText" placeholder="输入资源名称或ID" style="width: 240px" clearable />
        </div>
        <div class="search-buttons-box">
          <el-button type="primary" class="btn-primary-blue" icon="Search" @click="handleFilterSearch">搜索</el-button>
          <el-button icon="Refresh" @click="handleFilterReset">重置</el-button>
        </div>
      </div>
    </div>

    <div class="asset-table-card">
      <el-table 
        :data="resourceList" 
        v-loading="loading"
        style="width: 100%"
        size="default"
        :header-cell-style="{ background: '#F7F8FA', color: '#1D2129', fontWeight: '500', height: '44px' }"
      >
        <el-table-column prop="id" label="资源ID" width="180" show-overflow-tooltip />
        <el-table-column prop="name" label="资源名称" min-width="150">
          <template #default="scope">
            <span class="interactive-blue-lbl" @click="navigateToDetailPage(scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="region" label="区域" width="100" />
        
        <template v-if="activeType === 'BMS' || activeType === 'ECS'">
          <el-table-column prop="gpuModel" label="显卡型号" min-width="160" />
          <el-table-column prop="gpuNum" label="显卡数量" width="100" align="center" />
          <el-table-column prop="vram" label="显存" width="100" />
        </template>

        <el-table-column prop="cpu" label="CPU" width="100" />
        <el-table-column prop="memory" label="内存" width="100" />
        
        <el-table-column v-if="activeType === 'BMS'" prop="systemDisk" label="系统盘" width="100" />
        <el-table-column v-if="activeType === 'ECS'" prop="intranetIp" label="内网IP" width="130" />
        
        <el-table-column v-slot="scope" v-if="activeType === 'CONTAINER'" prop="namespace" label="命名空间" width="130">
          <span class="purple-namespace-pill-badge">{{ scope.row.namespace }}</span>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="160">
          <template #default="scope">
            <div class="table-op-links-flex-box">
              <span class="op-btn-action-link" @click="navigateToDetailPage(scope.row)">详情</span>
              
              <el-tooltip v-if="scope.row.powerStatus === 'off'" content="开机" placement="top" effect="dark">
                <span class="op-btn-action-link" @click="togglePowerOn(scope.row)">开机</span>
              </el-tooltip>
              
              <el-tooltip v-else-if="scope.row.powerStatus === 'rebooting'" content="开机" placement="top" effect="dark">
                <span class="op-btn-action-link warning-amber-lbl" @click="togglePowerOn(scope.row)">启动</span>
              </el-tooltip>
              
              <el-tooltip v-else content="重启实例" placement="top" effect="dark">
                <span class="op-btn-action-link" @click="handleTriggerReboot(scope.row)">重启</span>
              </el-tooltip>

              <el-dropdown trigger="hover" placement="bottom-end" @command="(cmd: string) => handleMoreActionCommand(cmd, scope.row)">
                <span class="more-action-trigger-dots-icon">
                  <el-icon><MoreFilled /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="custom-console-dropdown-menu">
                    <el-dropdown-item command="connect">远程连接</el-dropdown-item>
                    <el-dropdown-item command="poweroff" :disabled="scope.row.powerStatus === 'off'">安全关机</el-dropdown-item>
                    <el-dropdown-item command="destroy" class="danger-dropdown-item">销毁</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </div>

    <el-dialog v-model="destroyDialogVisible" title="安全风险提示" width="460px" :align-center="true">
      <div class="destroy-alert-body-content">
        <el-icon class="warning-large-icon"><WarningFilled /></el-icon>
        <div class="alert-texts">
          <h4>确定要销毁该算力资源实例吗？</h4>
          <p>此操作不可逆！实例物理注销后，磁盘存储以及运行环境都将被清空，且数据绝对无法恢复。</p>
        </div>
      </div>
      <template #footer>
        <div class="dialog-custom-actions-footer">
          <el-button @click="destroyDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="executeMockDestroy">确认销毁</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  listResourcesApi,
  powerOnApi,
  rebootApi,
  powerOffApi,
  deleteResourceApi,
  type ResourceItem,
  type ResourceType
} from '@/api/resource'

const route = useRoute()
const router = useRouter()
const localQueryText = ref('')
const destroyDialogVisible = ref(false)
const selectedRowData = ref<ResourceItem | null>(null)

// 数据状态
const resourceList = ref<ResourceItem[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)

const activeType = computed(() => (route.meta.type as ResourceType) || 'BMS')

// 加载数据（前后端联动）
const loadData = async () => {
  loading.value = true
  try {
    const data = await listResourcesApi({
      type: activeType.value,
      keyword: localQueryText.value,
      page: page.value,
      pageSize: pageSize.value
    })
    resourceList.value = data.list
    total.value = data.total
  } catch (err: any) {
    // 拦截器已弹错误，这里不再重复
    resourceList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 切换 tab 类型时重置 + 重新加载
watch(activeType, () => {
  page.value = 1
  localQueryText.value = ''
  loadData()
})

// 初次挂载
onMounted(() => {
  loadData()
})

const handleFilterSearch = () => {
  page.value = 1
  loadData()
}
const handleFilterReset = () => {
  localQueryText.value = ''
  page.value = 1
  loadData()
}

const navigateToDetailPage = (row: ResourceItem) => {
  router.push({
    path: '/console/resource-detail',
    query: { ...row }
  })
}

// 开机
const togglePowerOn = async (row: ResourceItem) => {
  if (row.powerStatus === 'rebooting') {
    // 启动中状态：实际是开机动作
    try {
      const data = await powerOnApi(row.id)
      Object.assign(row, data)
      ElMessage.success(`物理实例 [${row.name}] 上电引导开机成功。`)
    } catch (e) {/* 已提示 */}
    return
  }
  // 关机状态：直接开机
  try {
    const data = await powerOnApi(row.id)
    Object.assign(row, data)
    ElMessage.success(`物理实例 [${row.name}] 上电引导开机成功。`)
  } catch (e) {/* 已提示 */}
}

// 重启
const handleTriggerReboot = async (row: ResourceItem) => {
  try {
    const data = await rebootApi(row.id)
    Object.assign(row, data)
    ElMessage.warning(`实例 [${row.name}] 正在执行重启流转。`)
  } catch (e) {/* 已提示 */}
}

const handleMoreActionCommand = async (command: string, row: ResourceItem) => {
  selectedRowData.value = row
  if (command === 'destroy') {
    destroyDialogVisible.value = true
  } else if (command === 'poweroff') {
    try {
      const data = await powerOffApi(row.id)
      Object.assign(row, data)
      ElMessage.info(`安全关机指令传递就绪。`)
    } catch (e) {/* 已提示 */}
  } else if (command === 'connect') {
    ElMessage.success(`正在连接安全远程终端隧道...`)
  }
}

const executeMockDestroy = async () => {
  destroyDialogVisible.value = false
  if (!selectedRowData.value) return
  const row = selectedRowData.value
  try {
    await ElMessageBox.confirm(
      `算力实例 [${row.name}] 一旦销毁将不可恢复，确认继续？`,
      '二次确认',
      { confirmButtonText: '确认销毁', cancelButtonText: '取消', type: 'error' }
    )
  } catch {
    return
  }
  try {
    await deleteResourceApi(row.id)
    ElMessage.error(`算力实例已从主集群物理摘除。`)
    loadData()
  } catch (e) {/* 已提示 */}
}
</script>

<style scoped>
.console-dynamic-asset-workspace-wrapper { display: flex; flex-direction: column; gap: 16px; width: 100%; }
.asset-search-card { background: #ffffff; padding: 18px 24px; border-radius: 4px; }
.pagination-wrapper { display: flex; justify-content: flex-end; padding: 16px 0 4px; }
.search-layout-row { display: flex; justify-content: space-between; align-items: center; }
.search-input-box { display: flex; align-items: center; gap: 12px; }
.search-input-box .lbl { font-size: 14px; color: #4E5969; }
.search-buttons-box { display: flex; gap: 12px; }
.btn-primary-blue { background-color: #1677FF !important; border-color: #1677FF !important; }

.asset-table-card { background: #ffffff; padding: 20px 24px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.01); }
.interactive-blue-lbl { color: #1677FF; cursor: pointer; font-weight: 500; }
.interactive-blue-lbl:hover { text-decoration: underline; }
.purple-namespace-pill-badge { background-color: #F5EEFF; color: #722ED1; border: 1px solid #D3ADF7; padding: 2px 6px; border-radius: 2px; font-size: 12px; }

/* 操作面板样式还原（图四至图七） */
.table-op-links-flex-box { display: flex; align-items: center; gap: 14px; }
.op-btn-action-link { color: #1677FF; cursor: pointer; font-size: 14px; user-select: none; }
.op-btn-action-link:hover { color: #4096ff; }

/* 启动中/重启中的黄色高亮标识颜色（严格对齐图六/图七） */
.warning-amber-lbl { color: #FAAD14 !important; }
.warning-amber-lbl:hover { color: #ffc04d !important; }

.more-action-trigger-dots-icon { color: #86909C; cursor: pointer; display: flex; align-items: center; outline: none; }
.more-action-trigger-dots-icon:hover { color: #1677FF; }

:deep(.custom-console-dropdown-menu .danger-dropdown-item) { color: #F53F3F !important; }
:deep(.custom-console-dropdown-menu .danger-dropdown-item:hover) { background-color: #FFECE8 !important; }

.destroy-alert-body-content { display: flex; gap: 16px; padding: 12px 4px 4px 4px; }
.warning-large-icon { font-size: 36px; color: #F53F3F; flex-shrink: 0; }
.alert-texts h4 { margin: 0 0 8px 0; font-size: 15px; color: #1D2129; font-weight: bold; }
.alert-texts p { margin: 0; font-size: 13px; color: #86909C; line-height: 1.6; }
.dialog-custom-actions-footer { display: flex; justify-content: flex-end; gap: 12px; }
</style>