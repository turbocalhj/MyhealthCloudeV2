import { Outlet } from 'react-router-dom'
import FrontHeader from '@/components/FrontHeader'
import CartDrawer from '@/components/CartDrawer'
import styles from './FrontLayout.module.css'

export default function FrontLayout() {
  return (
    <div className={styles.layoutWrapper}>
      <FrontHeader />
      <main className={styles.customMain}>
        <Outlet />
      </main>
      <CartDrawer />
    </div>
  )
}
