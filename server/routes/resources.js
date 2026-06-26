/**
 * server/routes/resources.js
 *
 * 资源管理 API - RESTful 风格
 *
 * 路由列表：
 *   GET    /api/resources              列表（支持 type/keyword/page/pageSize）
 *   GET    /api/resources/:id          详情
 *   POST   /api/resources              新建
 *   PUT    /api/resources/:id          更新
 *   DELETE /api/resources/:id          销毁
 *   PATCH  /api/resources/:id/power    开机（powerStatus=on）
 *   PATCH  /api/resources/:id/reboot   重启（powerStatus=rebooting → 5s 后 on）
 *   PATCH  /api/resources/:id/poweroff 关机（powerStatus=off）
 *
 * 统一响应：{ code, data, message }
 *  成功：code=200
 *  失败：code=400/404/500 + message
 */
const express = require('express')
const router = express.Router()
const db = require('../db')

const TABLE = 'resources'

/** 生成新 ID（按 type 风格区分） */
const genId = (type) => {
  if (type === 'CONTAINER') return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  if (type === 'ECS') return `i-${Math.random().toString(36).slice(2, 20)}`
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`
}

// ==================== 列表 ====================
router.get('/', async (req, res) => {
  try {
    const { type, keyword = '', page = 1, pageSize = 10 } = req.query
    let rows = db.readTable(TABLE)

    if (type) rows = rows.filter((r) => r.type === type)
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase()
      rows = rows.filter(
        (r) => r.name.toLowerCase().includes(kw) || r.id.toLowerCase().includes(kw)
      )
    }

    // 倒序：最新创建在前面
    rows = [...rows].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

    const p = Number(page) || 1
    const ps = Number(pageSize) || 10
    const start = (p - 1) * ps
    const list = rows.slice(start, start + ps)

    res.json({ code: 200, message: 'ok', data: { list, total: rows.length, page: p, pageSize: ps } })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message, data: null })
  }
})

// ==================== 详情 ====================
router.get('/:id', (req, res) => {
  const row = db.findById(TABLE, req.params.id)
  if (!row) return res.status(404).json({ code: 404, message: '资源不存在', data: null })
  res.json({ code: 200, message: 'ok', data: row })
})

// ==================== 新建 ====================
router.post('/', async (req, res) => {
  try {
    const body = req.body || {}
    if (!body.name || !body.type) {
      return res.status(400).json({ code: 400, message: 'name 和 type 不能为空', data: null })
    }
    const validTypes = ['BMS', 'ECS', 'CONTAINER']
    if (!validTypes.includes(body.type)) {
      return res.status(400).json({ code: 400, message: `type 必须是 ${validTypes.join('/')}`, data: null })
    }
    const row = { ...body, id: genId(body.type) }
    const created = await db.insert(TABLE, row)
    res.json({ code: 200, message: '创建成功', data: created })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message, data: null })
  }
})

// ==================== 更新 ====================
router.put('/:id', async (req, res) => {
  try {
    const updated = await db.updateById(TABLE, req.params.id, req.body || {})
    if (!updated) return res.status(404).json({ code: 404, message: '资源不存在', data: null })
    res.json({ code: 200, message: '更新成功', data: updated })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message, data: null })
  }
})

// ==================== 删除 ====================
router.delete('/:id', async (req, res) => {
  try {
    const removed = await db.deleteById(TABLE, req.params.id)
    if (!removed) return res.status(404).json({ code: 404, message: '资源不存在', data: null })
    res.json({ code: 200, message: '销毁成功', data: { id: req.params.id } })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message, data: null })
  }
})

// ==================== 开机 ====================
router.patch('/:id/power', async (req, res) => {
  const updated = await db.updateById(TABLE, req.params.id, { powerStatus: 'on' })
  if (!updated) return res.status(404).json({ code: 404, message: '资源不存在', data: null })
  res.json({ code: 200, message: '已开机', data: updated })
})

// ==================== 重启 ====================
router.patch('/:id/reboot', async (req, res) => {
  const updated = await db.updateById(TABLE, req.params.id, { powerStatus: 'rebooting' })
  if (!updated) return res.status(404).json({ code: 404, message: '资源不存在', data: null })
  // 5s 后自动切到 on
  setTimeout(() => {
    db.updateById(TABLE, req.params.id, { powerStatus: 'on' }).catch(() => {})
  }, 5000)
  res.json({ code: 200, message: '正在重启', data: updated })
})

// ==================== 关机 ====================
router.patch('/:id/poweroff', async (req, res) => {
  const updated = await db.updateById(TABLE, req.params.id, { powerStatus: 'off' })
  if (!updated) return res.status(404).json({ code: 404, message: '资源不存在', data: null })
  res.json({ code: 200, message: '已安全关机', data: updated })
})

module.exports = router
