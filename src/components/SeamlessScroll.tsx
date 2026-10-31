import { useState } from 'react'
import styles from './SeamlessScroll.module.css'

interface OrderNotice {
  date: string
  device: string
}

const rawOrderData: OrderNotice[] = [
  { date: '2026年04月24日', device: 'GPU云主机 英伟达 A100-40G' },
  { date: '2026年04月24日', device: '联通云主机-atlas-300i-pro' },
  { date: '2026年05月19日', device: '阿里云-昆仑200' },
  { date: '2026年05月11日', device: 'GPU云主机-华为T4' }
]

export default function SeamlessScroll() {
  const [isPause, setIsPause] = useState(false)

  return (
    <div className={styles.seamlessScrollContainer}>
      <div className={styles.scrollIcon}>
        <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
          <path d="M576 128v768a32 32 0 0 1-50.048 26.528L292.032 704H128a64 64 0 0 1-64-64V384a64 64 0 0 1 64-64h164.032l233.92-218.528A32 32 0 0 1 576 128z m288 384c0-104.96-50.624-197.824-128-257.152v64.448C760.384 366.528 800 434.304 800 512s-39.616 145.472-104 192.704v64.448c77.376-59.328 128-152.192 128-257.152z m128 0c0-164.8-85.312-309.248-213.312-393.152v66.432C873.92 258.112 928 378.432 928 512s-54.08 253.888-141.312 326.72v66.432C914.688 821.248 1000 676.8 1000 512z" />
        </svg>
      </div>

      <div
        className={styles.scrollWrapper}
        onMouseEnter={() => setIsPause(true)}
        onMouseLeave={() => setIsPause(false)}
      >
        <div
          className={styles.scrollTrack}
          style={{ animationPlayState: isPause ? 'paused' : 'running' }}
        >
          {[0, 1].map((group) => (
            <div className={styles.scrollGroup} key={group} aria-hidden={group === 1}>
              {rawOrderData.map((item, idx) => (
                <span className={styles.scrollItem} key={idx}>
                  <span className={styles.itemDate}>{item.date}</span>
                  <span className={styles.itemTag}>测评**</span>
                  <span className={styles.itemText}>
                    通过算力调度运营平台成功下单了{item.device}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
