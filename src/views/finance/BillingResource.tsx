import { useState } from 'react'
import { Empty, Input } from 'antd'
import styles from './BillingResource.module.css'

export default function BillingResource() {
  const [resName, setResName] = useState('')

  return (
    <div className={styles.standaloneBillingResourceWorkspace}>
      <div className={styles.filterPanelFrame}>
        <div className={styles.filterLayoutJustifyRow}>
          <div className={styles.inputsBundleThreecols}>
            <div className={styles.itemCell}>
              <span className={styles.labelTxt}>资源名称</span>
              <Input
                allowClear
                placeholder="请输入资源名称"
                style={{ width: 200 }}
                value={resName}
                onChange={(e) => setResName(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tableCardContainer}>
        <Empty description="暂无数据" styles={{ image: { width: 120, height: 120 } }} />
      </div>
    </div>
  )
}
