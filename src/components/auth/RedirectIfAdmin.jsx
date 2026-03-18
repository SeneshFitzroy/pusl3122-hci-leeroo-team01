import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'

/**
 * When an admin visits any non-admin page, redirect to /admin.
 * Admins should only access admin routes (Dashboard, Products, Orders, Add Designer).
 * Waits for auth to finish loading to avoid redirect loops.
 */
export default function RedirectIfAdmin({ children }) {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const isAdmin = useAuthStore((s) => s.isAdmin)

  const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/')

  if (!loading && user && isAdmin() && !isAdminRoute) {
    return <Navigate to="/admin" replace />
  }

  return children
}
