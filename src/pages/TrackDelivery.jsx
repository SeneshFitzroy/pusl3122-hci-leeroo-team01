import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Truck, ArrowLeft, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function TrackDelivery() {
  const { t } = useTranslation()
  const [orderId, setOrderId] = useState('')

  const handleTrack = (e) => {
    e.preventDefault()
    if (!orderId.trim()) return
    // In a full implementation, this would call an API to fetch tracking info
    alert(t('trackDelivery.comingSoon') || 'Tracking lookup coming soon. Contact us with your order ID for delivery status.')
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      <div className="max-w-xl mx-auto px-4 py-12">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-darkwood dark:text-white hover:text-clay dark:hover:text-clay mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('product.back')}
        </Link>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-warm-100 dark:border-dark-border p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-forest/10 dark:bg-forest/20 flex items-center justify-center">
              <Truck className="h-7 w-7 text-forest dark:text-forest-light" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-darkwood dark:text-white">
                {t('trackDelivery.title') || 'Track Your Delivery'}
              </h1>
              <p className="text-sm text-darkwood/60 dark:text-white/70">
                {t('trackDelivery.subtitle') || 'Enter your order ID to see delivery status'}
              </p>
            </div>
          </div>

          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label htmlFor="order-id" className="block text-sm font-medium text-darkwood dark:text-white mb-2">
                {t('trackDelivery.orderId') || 'Order ID'}
              </label>
              <input
                id="order-id"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ORD-12345"
                className="w-full px-4 py-3 rounded-xl border border-warm-200 dark:border-dark-border bg-warm-50 dark:bg-dark-surface text-darkwood dark:text-white placeholder:text-darkwood/40 focus:outline-none focus:ring-2 focus:ring-clay/30 focus:border-clay"
                aria-label="Order ID"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-clay hover:bg-clay-dark text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              {t('trackDelivery.track') || 'Track Order'}
            </button>
          </form>

          <p className="mt-6 text-xs text-darkwood/50 dark:text-white/70">
            {t('trackDelivery.contactNote') || 'Need help? Call our hotline: '}
            <a href="tel:+94761120457" className="text-clay hover:underline">076 112 0457</a>
          </p>
        </div>
      </div>
    </div>
  )
}
