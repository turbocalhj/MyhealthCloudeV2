import { useState } from 'react'
import { Button, Empty, Input } from 'antd'
import styles from './BillingPersonal.module.css'

export default function BillingPersonal() {
  const [billName, setBillName] = useState('')

  return (
    <div className={styles.standaloneBillingPersonalWorkspace}>
      <div className={styles.filterPanelFrame}>
        <div className={styles.filterLayoutJustifyRow}>
          <div className={styles.inputsBundleFlex}>
            <div className={styles.itemCell}>
              <span className={styles.labelTxt}>名称</span>
              <Input
                allowClear
                placeholder="搜索名称"
                style={{ width: 220 }}
                value={billName}
                onChange={(e) => setBillName(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.actionsBundleFlex}>
            <Button type="primary">搜索</Button>
          </div>
        </div>
      </div>

      <div className={styles.tableCardContainer}>
        <Empty description="暂无数据" styles={{ image: { width: 120, height: 120 } }} />
      </div>
    </div>
  )
}
