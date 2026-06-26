/**
 * server/app.js
 *
 * Express 后端入口
 *
 * 启动：node server/app.js
 * 默认端口：3001
 *
 * 可通过环境变量 PORT 修改
 */
const express = require('express')
const cors = require('cors')
const path = require('path')
const db = require('./db')
const resourcesRouter = require('./routes/resources')

const app = express()
const PORT = process.env.PORT || 3001

// ==================== 中间件 ====================
app.use(cors())
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

// 简易请求日志
app.use((req, _res, next) => {
  const time = new Date().toISOString().replace('T', ' ').slice(0, 19)
  console.log(`[${time}] ${req.method} ${req.url}`)
  next()
})

// ==================== 健康检查 ====================
app.get('/api/health', (_req, res) => {
  res.json({ code: 200, message: 'ok', data: { status: 'up', time: new Date().toISOString() } })
})

// ==================== 业务路由 ====================
app.use('/api/resources', resourcesRouter)

// ==================== 404 兜底 ====================
app.use((req, res) => {
  res.status(404).json({ code: 404, message: `路由不存在：${req.method} ${req.url}`, data: null })
})

// ==================== 错误处理 ====================
app.use((err, _req, res, _next) => {
  console.error('[server error]', err)
  res.status(500).json({ code: 500, message: err.message || 'Internal Server Error', data: null })
})

// ==================== 启动 ====================
db.load() // 预加载 db.json
app.listen(PORT, () => {
  console.log('\n========================================')
  console.log(`  算力平台后端已启动`)
  console.log(`  http://localhost:${PORT}`)
  console.log(`  健康检查: http://localhost:${PORT}/api/health`)
  console.log(`  资源列表: http://localhost:${PORT}/api/resources`)
  console.log('========================================\n')
})
