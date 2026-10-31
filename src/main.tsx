import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/reset.css'
import 'nprogress/nprogress.css'
import '@/assets/styles/theme.css'
import './style.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
