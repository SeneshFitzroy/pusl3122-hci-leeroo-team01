import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, X, Bot, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useProductsStore from '@/store/useProductsStore'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { exportAdminReportPDF } from '@/lib/pdfExport'
import { toast } from 'sonner'

/** Fix common typos so "export pfd" etc. are understood */
function normalizeInput(text) {
  if (!text || typeof text !== 'string') return ''
  let t = text.toLowerCase().trim()
  const fixes = [
    [/\bpfd\b/g, 'pdf'],
    [/\bprodcuts?\b/g, 'products'],
    [/\bordres?\b/g, 'orders'],
    [/\bdesiners?\b/g, 'designers'],
    [/\bdesingers?\b/g, 'designers'],
    [/\bexporte?\b/g, 'export'],
    [/\bdownlaod\b/g, 'download'],
    [/\bdashbord\b/g, 'dashboard'],
    [/\bmaney\b/g, 'many'],
    [/\bhow manay\b/g, 'how many'],
  ]
  fixes.forEach(([regex, repl]) => { t = t.replace(regex, repl) })
  return t
}

/** Intent matchers with priority; returns { type, score } or null */
function matchIntent(normalized) {
  const intents = [
    { type: 'export_pdf', score: 0, patterns: [/export\s*(pdf|pfd|report)?|download\s*(pdf|pfd|report)?|pdf\s*export|get\s*pdf|generate\s*pdf|create\s*pdf/i] },
    { type: 'products', score: 1, patterns: [/how\s*many\s*products?|product\s*count|total\s*products?|number\s*of\s*products?|products?\s*in\s*stock|list\s*products?/i] },
    { type: 'orders', score: 2, patterns: [/how\s*many\s*orders?|order\s*count|total\s*orders?|number\s*of\s*orders?|show\s*orders?|list\s*orders?|recent\s*orders?/i] },
    { type: 'designers', score: 3, patterns: [/how\s*many\s*designers?|designer\s*count|designer\s*list|list\s*designers?|who\s*are\s*designers?/i] },
    { type: 'users', score: 4, patterns: [/how\s*many\s*users?|user\s*count|total\s*users?|number\s*of\s*users?|list\s*users?/i] },
    { type: 'nav_products', score: 5, patterns: [/add\s*product|new\s*product|create\s*product|go\s*to\s*products?|open\s*products?/i] },
    { type: 'nav_team', score: 6, patterns: [/add\s*designer|new\s*designer|create\s*designer|go\s*to\s*team|add\s*user/i] },
    { type: 'nav_analytics', score: 7, patterns: [/analytics?|charts?|stats?|dashboard|go\s*to\s*dashboard/i] },
    { type: 'nav_orders', score: 8, patterns: [/go\s*to\s*orders?|open\s*orders?|view\s*orders?/i] },
    { type: 'summary', score: 9, patterns: [/summary|overview|give\s*me\s*everything|all\s*stats?|full\s*report/i] },
    { type: 'help', score: 10, patterns: [/hello|hi|hey|help|what\s*can\s*you\s*do|how\s*to|support/i] },
  ]
  for (const { type, patterns } of intents) {
    if (patterns.some((p) => p.test(normalized))) return { type }
  }
  return null
}

/** Fallback: guess intent from keywords */
function guessIntent(normalized) {
  if (/export|pdf|download|report/.test(normalized)) return { type: 'export_pdf' }
  if (/product/.test(normalized)) return { type: 'products' }
  if (/order/.test(normalized)) return { type: 'orders' }
  if (/designer/.test(normalized)) return { type: 'designers' }
  if (/user/.test(normalized)) return { type: 'users' }
  return null
}

export default function AdminAiBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your admin assistant. Ask me anything — for example: \"How many products?\", \"Export PDF\", \"Show orders\", or \"Add product\". I understand natural language and typos." },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const messagesEndRef = useRef(null)
  const products = useProductsStore((s) => s.products)
  const navigate = useNavigate()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])
    setThinking(true)

    await new Promise((r) => setTimeout(r, 300))

    const normalized = normalizeInput(text)
    let intent = matchIntent(normalized) || guessIntent(normalized)
    let reply = ''

    if (intent?.type === 'export_pdf') {
      try {
        const [ordersSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'users')),
        ])
        const orders = ordersSnap.docs.map((d) => {
          const data = d.data()
          const ts = data?.createdAt?.toDate?.()
          return {
            id: d.id,
            ...data,
            customer: data?.shipping?.fullName || data?.userEmail || 'Customer',
            amount: data?.total != null ? `$${Number(data.total).toFixed(2)}` : '$0',
            status: data?.status || 'pending',
          }
        })
        const allUsers = usersSnap.docs.map((d) => ({ id: d.id, uid: d.id, ...d.data() }))
        const designers = allUsers.filter((u) => u.role === 'designer')
        const users = allUsers.filter((u) => u.role === 'user' || !u.role)
        exportAdminReportPDF({
          products: products || [],
          orders,
          designers,
          users,
          stats: {
            products: products?.length ?? 0,
            orders: orders.length,
            designers: designers.length,
            users: users.length,
          },
        })
        toast.success('PDF exported!')
        reply = 'Done! Your admin report PDF has been downloaded.'
      } catch (err) {
        console.error('[AdminBot] PDF export failed:', err)
        reply = "I couldn't export the PDF. Please try the Export PDF button in the Dashboard header."
      }
    } else if (intent?.type === 'products') {
      const count = products?.length ?? 0
      const total = products?.reduce((s, p) => s + (p.price || 0), 0)
      const avg = count ? Math.round(total / count) : 0
      reply = `You have ${count} products. Total inventory value: $${total.toLocaleString()}. Average price: $${avg}.`
    } else if (intent?.type === 'orders') {
      try {
        const snap = await getDocs(collection(db, 'orders'))
        const total = snap.docs.reduce((s, d) => s + (d.data()?.total ?? 0), 0)
        reply = `You have ${snap.size} orders. Total revenue: $${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`
      } catch {
        reply = "Couldn't fetch orders. Try again in a moment."
      }
    } else if (intent?.type === 'designers') {
      try {
        const snap = await getDocs(collection(db, 'users'))
        const designers = snap.docs.filter((d) => d.data().role === 'designer')
        const names = designers.map((d) => d.data().name || d.data().email || d.id).slice(0, 5)
        reply = `You have ${designers.length} designer(s)${names.length ? ': ' + names.join(', ') + (designers.length > 5 ? '...' : '') : '.'}`
      } catch {
        reply = "Couldn't fetch designers."
      }
    } else if (intent?.type === 'users') {
      try {
        const snap = await getDocs(collection(db, 'users'))
        const users = snap.docs.filter((d) => d.data().role === 'user' || !d.data().role)
        reply = `You have ${users.length} user(s).`
      } catch {
        reply = "Couldn't fetch users."
      }
    } else if (intent?.type === 'nav_products') {
      reply = 'Taking you to Products.'
      setTimeout(() => navigate('/admin/products'), 400)
    } else if (intent?.type === 'nav_team') {
      reply = 'Taking you to Add Designer / Team.'
      setTimeout(() => navigate('/admin/team'), 400)
    } else if (intent?.type === 'nav_analytics') {
      reply = 'Taking you to Analytics.'
      setTimeout(() => navigate('/admin/analytics'), 400)
    } else if (intent?.type === 'nav_orders') {
      reply = 'Taking you to Orders.'
      setTimeout(() => navigate('/admin/orders'), 400)
    } else if (intent?.type === 'summary') {
      try {
        const [ordersSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'users')),
        ])
        const orders = ordersSnap.docs
        const allUsers = usersSnap.docs.map((d) => d.data())
        const designers = allUsers.filter((u) => u.role === 'designer')
        const users = allUsers.filter((u) => u.role === 'user' || !u.role)
        const totalValue = (products || []).reduce((s, p) => s + (p.price || 0), 0)
        const totalRevenue = orders.reduce((s, d) => s + (d.data()?.total ?? 0), 0)
        reply = `Summary: ${products?.length ?? 0} products ($${totalValue.toLocaleString()} value), ${orders.length} orders ($${totalRevenue.toFixed(2)} revenue), ${designers.length} designers, ${users.length} users.`
      } catch {
        reply = 'Here’s what I have: ' + ((products?.length ?? 0)) + ' products. For the full summary, go to Analytics.'
      }
    } else if (intent?.type === 'help') {
      reply = "I can: show product/order/designer/user counts, export a PDF report, open Products/Orders/Analytics/Team, or give a full summary. Examples: \"Export PDF\", \"How many products?\", \"Summary\"."
    } else {
      reply = "I'm not sure what you meant. Try \"Export PDF\", \"How many products?\", \"Summary\", or \"Add product\". I understand typos like \"pfd\" for PDF."
    }

    setMessages((m) => [...m, { role: 'bot', text: reply }])
    setThinking(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-clay hover:bg-clay-dark text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Open AI assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[420px] bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-warm-200 dark:border-dark-border flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="p-3 border-b border-warm-100 dark:border-dark-border flex items-center justify-between bg-gradient-to-r from-clay/10 to-transparent">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-clay" />
                <span className="font-semibold text-darkwood dark:text-white">Admin Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-clay text-white'
                        : 'bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-white'
                    }`}
                  >
                    <span className="whitespace-pre-wrap">{msg.text.replace(/\*\*(.+?)\*\*/g, '$1')}</span>
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start">
                  <div className="bg-warm-100 dark:bg-dark-surface px-4 py-2 rounded-2xl">
                    <Loader2 className="h-4 w-4 animate-spin text-clay" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-warm-100 dark:border-dark-border flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="e.g. Export PDF, How many products?"
                className="flex-1 input-field text-sm"
              />
              <button onClick={handleSend} className="p-2.5 rounded-xl bg-clay text-white hover:bg-clay-dark transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
