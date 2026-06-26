/**
 * server/db.js
 *
 * 极简 JSON 文件持久化层
 * 适合本地开发 / 演示 / 学习用，生产环境请替换为 MySQL / PostgreSQL / MongoDB 等
 *
 * 设计：
 *  - 启动时读 db.json 到内存
 *  - 每次写操作后异步写回文件
 *  - 写入用 Promise 串行，避免并发覆盖
 */
const fs = require('fs')
const path = require('path')

const DB_FILE = path.join(__dirname, 'db.json')

/** 初始数据（首次启动写入 db.json） */
const initialData = {
  resources: [
    // BMS 裸金属
    { id: '8731370905908269056', name: 'yintestLiantong', type: 'BMS', region: '萧山区', gpuModel: 'Huawei Atlas 300', gpuNum: 2, vram: '64GB', cpu: '104核', memory: '256GB', systemDisk: '--', powerStatus: 'on', createdAt: '2026-01-15 09:00:00' },
    { id: '825416335817216000', name: 'sherrytestalam1', type: 'BMS', region: '拱墅区', gpuModel: 'Ascend 910B2', gpuNum: 8, vram: '64GB', cpu: '128核', memory: '1536GB', systemDisk: '894GB', powerStatus: 'rebooting', createdAt: '2026-01-16 10:00:00' },
    { id: '818855540908134400', name: 'work-910b-eekzk1', type: 'BMS', region: '--', gpuModel: '--', gpuNum: '--', vram: '--', cpu: '192核', memory: '1024GB', systemDisk: '894GB', powerStatus: 'on', createdAt: '2026-01-17 11:00:00' },
    { id: '8716cee3-743b-4a72-a831', name: 'sssss', type: 'BMS', region: '--', gpuModel: '--', gpuNum: '--', vram: '--', cpu: '40核', memory: '384GB', systemDisk: '480GB', powerStatus: 'off', createdAt: '2026-01-18 12:00:00' },

    // ECS 云主机
    { id: 'i-2zef1oxtc4jymmbr4lk0', name: 'jky0529', type: 'ECS', region: '西湖区', gpuModel: '昆仑芯GPU-X3', gpuNum: 1, vram: '32GB', cpu: '12核', memory: '96GB', intranetIp: '172.16.0.97', powerStatus: 'on', createdAt: '2026-02-01 09:00:00' },
    { id: 'i-2ze654pbbvejm9to6ivi', name: '测试0522', type: 'ECS', region: '西湖区', gpuModel: '昆仑芯GPU-X3', gpuNum: 1, vram: '32GB', cpu: '12核', memory: '96GB', intranetIp: '172.27.73.2', powerStatus: 'off', createdAt: '2026-02-02 10:00:00' },

    // CONTAINER 容器
    { id: '7bfa46bf-94eb-42e1-827b-01', name: 'event-exporter', type: 'CONTAINER', region: '拱墅区', cpu: '1核', memory: '0.39GB', namespace: 'kube-ops', powerStatus: 'on', createdAt: '2026-03-01 09:00:00' },
    { id: '7bfa46bf-94eb-42e1-827b-02', name: 'metrics-server', type: 'CONTAINER', region: '拱墅区', cpu: '2核', memory: '0.5GB', namespace: 'kube-ops', powerStatus: 'on', createdAt: '2026-03-01 09:30:00' }
  ]
}

/** 内存数据库 */
let db = null

/** 写入锁，避免并发写 */
let writing = Promise.resolve()

/** 读取 db.json，不存在则用 initialData */
const load = () => {
  if (db) return db
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8')
      db = JSON.parse(raw)
      // 兜底：表缺失则补
      for (const key of Object.keys(initialData)) {
        if (!Array.isArray(db[key])) db[key] = initialData[key]
      }
    } catch (err) {
      console.error('[db] 读取失败，使用初始数据：', err.message)
      db = JSON.parse(JSON.stringify(initialData))
    }
  } else {
    db = JSON.parse(JSON.stringify(initialData))
    save()
  }
  return db
}

/** 写回 db.json（串行排队） */
const save = () => {
  writing = writing.then(() => fs.promises.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8'))
  return writing
}

// ==================== 暴露方法 ====================

/** 全表读 */
const readTable = (table) => {
  load()
  return db[table] || []
}

/** 写整张表 */
const writeTable = async (table, rows) => {
  load()
  db[table] = rows
  await save()
}

/** 追加一条（自动补 createdAt） */
const insert = async (table, row) => {
  const rows = readTable(table)
  const newRow = { ...row, createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19) }
  rows.unshift(newRow)
  await writeTable(table, rows)
  return newRow
}

/** 按 id 查一条 */
const findById = (table, id) => {
  return readTable(table).find((r) => r.id === id)
}

/** 按 id 更新（patch 合并） */
const updateById = async (table, id, patch) => {
  const rows = readTable(table)
  const idx = rows.findIndex((r) => r.id === id)
  if (idx === -1) return null
  rows[idx] = { ...rows[idx], ...patch, id: rows[idx].id }
  await writeTable(table, rows)
  return rows[idx]
}

/** 按 id 删除 */
const deleteById = async (table, id) => {
  const rows = readTable(table)
  const next = rows.filter((r) => r.id !== id)
  const removed = rows.length !== next.length
  await writeTable(table, next)
  return removed
}

module.exports = { load, readTable, writeTable, insert, findById, updateById, deleteById }
