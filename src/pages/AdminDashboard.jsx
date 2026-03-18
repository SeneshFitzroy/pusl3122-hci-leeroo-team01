import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Plus,
  Download,
  Shield,
  Zap,
  UserPlus,
  Settings,
  Award,
} from 'lucide-react'
import useAuthStore from '@/store/useAuthStore'
import useProductsStore from '@/store/useProductsStore'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const { userProfile } = useAuthStore()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ products: 0, orders: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const products = useProductsStore((s) => s.products)
  const loaded = useProductsStore((s) => s.loaded)

  useEffect(() => {
    const load = async () => {
      try {
        const ordersSnap = await getDocs(collection(db, 'orders'))
        const orders = ordersSnap.docs.map((d) => {
          const data = d.data()
          const ts = data?.createdAt?.toDate?.()
          return {
            id: d.id,
            ...data,
            customer: data?.shipping?.fullName || data?.userEmail || 'Customer',
            amount: data?.total != null ? `$${Number(data.total).toFixed(2)}` : '$0',
            status: data?.status || 'pending',
            date: ts ? ts.toLocaleDateString() : '',
          }
        })
        setRecentOrders(orders.slice(0, 5))
        setStats({
          products: products?.length ?? 0,
          orders: ordersSnap.size ?? 0,
        })
      } catch (_) {
        setStats({ products: products?.length ?? 0, orders: 0 })
        setRecentOrders([])
      }
      setTimeout(() => setIsLoading(false), 600)
    }
    if (loaded) load()
    else setTimeout(() => setIsLoading(false), 800)
  }, [loaded, products?.length])

  const handleExportData = () => {
    const data = [
      ['Metric', 'Value'],
      ['Total Products', stats.products],
      ['Total Orders', stats.orders],
      ['Exported', new Date().toLocaleString()],
    ]
    const csv = data.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lee-roo-admin-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(t('admin.exportSuccess') || 'Data exported')
  }

  const handleQuickAdd = () => navigate('/admin/products')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 bg-clay rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <p className="text-darkwood/60 dark:text-white text-sm">{t('admin.preparingDashboard')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card border-b border-warm-100 dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-clay rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-darkwood dark:text-white font-display">
                  {t('admin.dashboard')}
                </h1>
                <p className="text-darkwood/50 dark:text-white text-sm">
                  {t('admin.welcomeBack', { name: userProfile?.name || t('admin.administrator') })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportData}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-warm-100 dark:bg-dark-surface hover:bg-warm-200 dark:hover:bg-dark-border text-darkwood dark:text-white font-medium rounded-xl transition-colors text-sm"
              >
                <Download className="h-4 w-4" />
                {t('admin.exportData')}
              </button>
              <button
                onClick={handleQuickAdd}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-clay hover:bg-clay-dark text-white font-semibold rounded-xl transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                {t('admin.quickAdd')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/admin/products"
            className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-5 hover:border-clay/30 dark:hover:border-clay/30 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-darkwood/50 dark:text-white text-xs font-medium uppercase tracking-wide">
                  {t('admin.products')}
                </p>
                <p className="text-2xl font-bold text-darkwood dark:text-white mt-0.5">
                  {stats.products}
                </p>
              </div>
              <div className="w-10 h-10 bg-clay/10 dark:bg-clay/20 rounded-lg flex items-center justify-center group-hover:bg-clay/20 transition-colors">
                <Package className="h-5 w-5 text-clay" />
              </div>
            </div>
          </Link>
          <Link
            to="/admin/orders"
            className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-5 hover:border-clay/30 dark:hover:border-clay/30 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-darkwood/50 dark:text-white text-xs font-medium uppercase tracking-wide">
                  {t('admin.recentOrders')}
                </p>
                <p className="text-2xl font-bold text-darkwood dark:text-white mt-0.5">
                  {stats.orders}
                </p>
              </div>
              <div className="w-10 h-10 bg-forest/10 dark:bg-forest/20 rounded-lg flex items-center justify-center group-hover:bg-forest/20 transition-colors">
                <ShoppingCart className="h-5 w-5 text-forest" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Quick Actions — clean, working links only */}
        <motion.div
          className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <h3 className="text-base font-bold text-darkwood dark:text-white mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-clay" />
            {t('admin.quickActions')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t('admin.addProduct'), icon: Plus, to: '/admin/products', color: 'clay' },
              { label: t('admin.addDesigner') || 'Add Designer', icon: UserPlus, to: '/admin/team', color: 'forest' },
              { label: t('admin.viewOrders'), icon: ShoppingCart, to: '/admin/orders', color: 'darkwood' },
              { label: t('admin.settings'), icon: Settings, to: '/settings', color: 'warm' },
            ].map((action) => (
              <Link key={action.to} to={action.to}>
                <div
                  className={`flex flex-col items-center p-4 rounded-xl border transition-all hover:shadow-md ${
                    action.color === 'clay'
                      ? 'bg-clay/5 border-clay/20 hover:border-clay/40'
                      : action.color === 'forest'
                        ? 'bg-forest/5 border-forest/20 hover:border-forest/40'
                        : action.color === 'darkwood'
                          ? 'bg-darkwood/5 border-darkwood/20 dark:border-dark-border hover:border-darkwood/40'
                          : 'bg-warm-50 dark:bg-dark-surface border-warm-100 dark:border-dark-border hover:border-warm-200'
                  }`}
                >
                  <action.icon
                    className={`h-6 w-6 mb-2 ${
                      action.color === 'clay' ? 'text-clay' : action.color === 'forest' ? 'text-forest' : 'text-darkwood dark:text-white'
                    }`}
                  />
                  <span className="text-xs font-medium text-darkwood dark:text-white text-center">
                    {action.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders + Top Products — compact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <motion.div
            className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border overflow-hidden"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="p-4 border-b border-warm-100 dark:border-dark-border flex items-center justify-between">
              <h3 className="font-bold text-darkwood dark:text-white text-sm">{t('admin.recentOrders')}</h3>
              <Link to="/admin/orders" className="text-clay hover:text-clay-dark text-xs font-medium">
                {t('admin.viewAll')}
              </Link>
            </div>
            <div className="divide-y divide-warm-100 dark:divide-dark-border max-h-64 overflow-y-auto">
              {recentOrders.length === 0 ? (
                <div className="p-6 text-center text-darkwood/50 dark:text-white text-sm">
                  {t('admin.noOrders') || 'No orders yet'}
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-warm-50 dark:hover:bg-dark-surface/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium text-darkwood dark:text-white block">{order.customer}</span>
                        <span className="text-xs text-darkwood/50 dark:text-white">{order.id?.slice(0, 12)} · {order.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-darkwood dark:text-white block">{order.amount}</span>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{order.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border overflow-hidden"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <div className="p-4 border-b border-warm-100 dark:border-dark-border flex items-center justify-between">
              <h3 className="font-bold text-darkwood dark:text-white text-sm">{t('admin.topProducts')}</h3>
              <Link to="/admin/products" className="text-clay hover:text-clay-dark text-xs font-medium">
                {t('admin.viewAll')}
              </Link>
            </div>
            <div className="divide-y divide-warm-100 dark:divide-dark-border max-h-64 overflow-y-auto">
              {products?.slice(0, 5).map((p) => (
                <div key={p.id} className="p-4 hover:bg-warm-50 dark:hover:bg-dark-surface/50 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden bg-warm-100 dark:bg-dark-surface"
                    style={{ backgroundColor: p.color || p.colors?.[0] || '#8B6F47' }}
                  >
                    {p.image && (
                      <img src={p.image} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-darkwood dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-darkwood/50 dark:text-white">${p.price}</p>
                  </div>
                  <Award className="h-4 w-4 text-clay/60 flex-shrink-0" />
                </div>
              ))}
              {(!products || products.length === 0) && (
                <div className="p-6 text-center text-darkwood/50 dark:text-white text-sm">
                  {t('admin.noProducts') || 'No products yet'}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
