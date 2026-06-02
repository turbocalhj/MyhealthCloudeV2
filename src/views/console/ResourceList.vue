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
        :data="computedActiveDataset" 
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

interface ResourceItem {
  id: string
  name: string
  region: string
  cpu: string
  memory: string
  powerStatus: string
  gpuModel?: string
  gpuNum?: string | number
  vram?: string
  systemDisk?: string
  intranetIp?: string
  namespace?: string
}

const route = useRoute()
const router = useRouter()
const localQueryText = ref('')
const destroyDialogVisible = ref(false)
const selectedRowData = ref<any>(null)

const activeType = computed(() => (route.meta.type as string) || 'BMS')

// 多态状态机数据集（内置 off、on、rebooting 形态以供验证样式流转）
const bmsDataset = ref<ResourceItem[]>([
  { id: '8716cee3-743b-4a72-a83...', name: 'sssss', region: '--', gpuModel: '--', gpuNum: '--', vram: '--', cpu: '40核', memory: '384GB', systemDisk: '480GB', powerStatus: 'off' }, 
  { id: '8731370905908269056', name: 'yintestLiantong', region: '萧山区', gpuModel: 'Huawei Atlas 300', gpuNum: 2, vram: '64GB', cpu: '104核', memory: '256GB', systemDisk: '--', powerStatus: 'on' },
  { id: '825416335817216000', name: 'sherrytestalam1', region: '拱墅区', gpuModel: 'Ascend 910B2', gpuNum: 8, vram: '64GB', cpu: '128核', memory: '1536GB', systemDisk: '894GB', powerStatus: 'rebooting' }, // 对应图六“启动”
  { id: '818855540908134400', name: 'work-910b-eekzk1', region: '--', gpuModel: '--', gpuNum: '--', vram: '--', cpu: '192核', memory: '1024GB', systemDisk: '894GB', powerStatus: 'on' }
])

const ecsDataset = ref<ResourceItem[]>([
  { id: 'i-2zef1oxtc4jymmbr4lk0', name: 'jky0529', region: '西湖区', gpuModel: '昆仑芯GPU-...', gpuNum: 1, vram: '32GB', cpu: '12核', memory: '96GB', intranetIp: '172.16.0.97', powerStatus: 'on' },
  { id: 'i-2ze654pbbvejm9to6ivi', name: '测试0522', region: '西湖区', gpuModel: '昆仑芯GPU-...', gpuNum: 1, vram: '32GB', cpu: '12核', memory: '96GB', intranetIp: '172.27.73.2', powerStatus: 'off' }
])

const containerDataset = ref<ResourceItem[]>([
  { id: '7bfa46bf-94eb-42e1-827b-9864307f6...', name: 'event-exporter', region: '拱墅区', cpu: '1核', memory: '0.39GB', namespace: 'kube-ops', powerStatus: 'on' }
])

const computedActiveDataset = computed(() => {
  let source: ResourceItem[] = bmsDataset.value
  if (activeType.value === 'ECS') source = ecsDataset.value
  if (activeType.value === 'CONTAINER') source = containerDataset.value
  if (!localQueryText.value) return source
  return source.filter(item => item.name.includes(localQueryText.value) || item.id.includes(localQueryText.value))
})

const handleFilterSearch = () => { ElMessage.success('计算视图已同步更新') }
const handleFilterReset = () => { localQueryText.value = '' }

const navigateToDetailPage = (row: any) => {
  router.push({
    path: '/console/resource-detail',
    query: { ...row }
  })
}

const togglePowerOn = (row: any) => {
  row.powerStatus = 'on'
  ElMessage.success(`物理实例 [${row.name}] 上电引导开机成功。`)
}

const handleTriggerReboot = (row: any) => {
  row.powerStatus = 'rebooting'
  ElMessage.warning(`实例 [${row.name}] 正在执行重启流转。`)
}

const handleMoreActionCommand = (command: string, row: any) => {
  selectedRowData.value = row
  if (command === 'destroy') {
    destroyDialogVisible.value = true
  } else if (command === 'poweroff') {
    row.powerStatus = 'off'
    ElMessage.info(`安全关机指令传递就绪。`)
  } else if (command === 'connect') {
    ElMessage.success(`正在连接安全远程终端隧道...`)
  }
}

const executeMockDestroy = () => {
  destroyDialogVisible.value = false
  const id = selectedRowData.value?.id
  if (activeType.value === 'ECS') ecsDataset.value = ecsDataset.value.filter(item => item.id !== id)
  else if (activeType.value === 'CONTAINER') containerDataset.value = containerDataset.value.filter(item => item.id !== id)
  else bmsDataset.value = bmsDataset.value.filter(item => item.id !== id)
  ElMessage.error(`算力实例已从主集群物理摘除。`)
}
</script>

<style scoped>
.console-dynamic-asset-workspace-wrapper { display: flex; flex-direction: column; gap: 16px; width: 100%; }
.asset-search-card { background: #ffffff; padding: 18px 24px; border-radius: 4px; }
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