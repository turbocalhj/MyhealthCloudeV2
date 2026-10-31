import { useEffect, type ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { message } from 'antd'
import { useUserStore } from '@/store/user'

/** 用户角色与路由角色有交集即可访问 */
export const hasPermission = (roles: string[], routeRoles?: string[]): boolean => {
  if (!routeRoles || routeRoles.length === 0) return true
  return roles.some((role) => routeRoles.includes(role))
}

interface AuthGuardProps {
  children: ReactElement
  /** 是否要求登录（控制台、费用中心） */
  requireAuth?: boolean
  /** 路由角色限制 */
  roles?: string[]
}

/**
 * 路由守卫：登录态校验 + 角色权限校验 + 已登录访问登录页拦截
 */
export default function AuthGuard({ children, requireAuth = false, roles }: AuthGuardProps) {
  const location = useLocation()
  const token = useUserStore((state) => state.token)
  const userRoles = useUserStore((state) => state.roles)

  const isLoginPage = location.pathname === '/login'
  const hasRedirect = new URLSearchParams(location.search).has('redirect')
  const needLogin = !token && requireAuth
  const noRoleAccess = !!token && !hasPermission(userRoles, roles)

  useEffect(() => {
    if (needLogin) {
      message.error({
        content: '登录已过期或无权限，请重新登录',
        duration: 3
      })
    }
  }, [needLogin])

  useEffect(() => {
    if (noRoleAccess) {
      message.error({ content: '您当前角色无权访问该页面', duration: 3 })
    }
  }, [noRoleAccess, location.pathname])

  // 登录页带 redirect 参数时交由登录表单完成跳转，避免令牌写入瞬间抢先回首页
  if (token && isLoginPage && !hasRedirect) {
    return <Navigate to="/main/home" replace />
  }

  if (needLogin) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  if (noRoleAccess) {
    return <Navigate to="/main/home" replace />
  }

  return children
}
