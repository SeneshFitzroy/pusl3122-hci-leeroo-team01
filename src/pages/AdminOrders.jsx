import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function AdminOrders() {
  const { t } = useTranslation()
  const recentOrders = [
    { id: '#ORD-001', customer: 'Sarah Johnson', amount: '$1,234', status: 'completed', date: '2024-02-27' },
    { id: '#ORD-002', customer: 'Michael Chen', amount: '$856', status: 'pending', date: '2024-02-27' },
    { id: '#ORD-003', customer: 'Emma Davis', amount: '$2,341', status: 'processing', date: '2024-02-26' },
  ]

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin" className="p-2 rounded-xl bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-white hover:bg-warm-200 dark:hover:bg-dark-border transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-darkwood dark:text-white font-display">{t('admin.recentOrders') || 'Order Management'}</h1>
            <p className="text-darkwood/50 dark:text-white text-sm">{recentOrders.length} orders</p>
          </div>
        </div>
        <motion.div
          className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="divide-y divide-warm-100 dark:divide-dark-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-warm-50 dark:hover:bg-dark-surface/50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-clay/10 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-clay" />
                  </div>
                  <div>
                    <p className="font-semibold text-darkwood dark:text-white">{order.customer}</p>
                    <p className="text-sm text-darkwood/50 dark:text-white">{order.id} · {order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-darkwood dark:text-white">{order.amount}</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
