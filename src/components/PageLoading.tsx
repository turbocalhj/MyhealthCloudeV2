import { useEffect } from 'react'
import NProgress from 'nprogress'

/** 懒加载页面的占位：挂载时开启顶部进度条，加载完成后关闭 */
export default function PageLoading() {
  useEffect(() => {
    NProgress.start()
    return () => {
      NProgress.done()
    }
  }, [])

  return <div style={{ minHeight: 240 }} />
}
