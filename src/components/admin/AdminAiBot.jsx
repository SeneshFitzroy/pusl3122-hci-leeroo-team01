import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, X, Bot, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useProductsStore from '@/store/useProductsStore'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const COMMANDS = [
  { pattern: /how many products|product count|total products/i, type: 'products' },
  { pattern: /orders|order count|how many orders/i, type: 'orders' },
  { pattern: /designers|designer list|how many designers/i, type: 'designers' },
  { pattern: /users|user count|how many users/i, type: 'users' },
  { pattern: /export|pdf|download report/i, type: 'export' },
  { pattern: /add product|new product|create product/i, type: 'nav', path: '/admin/products' },
  { pattern: /add designer|new designer|create designer/i, type: 'nav', path: '/admin/team' },
  { pattern: /analytics|charts|stats|dashboard/i, type: 'nav', path: '/admin' },
  { pattern: /hello|hi|hey|help/i, type: 'help' },
]

export default function AdminAiBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your admin assistant. Ask me things like: \"How many products?\", \"Show orders\", \"Export PDF\", or \"Add product\"." },
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

    // Simulate short delay
    await new Promise((r) => setTimeout(r, 400))

    let reply = ''
    let matched = false

    for (const cmd of COMMANDS) {
      if (cmd.pattern.test(text)) {
        matched = true
        if (cmd.type === 'nav' && cmd.path) {
          reply = `Taking you to ${cmd.path === '/admin/products' ? 'Products' : cmd.path === '/admin/team' ? 'Add Designer' : 'Dashboard'}.`
          setTimeout(() => navigate(cmd.path), 600)
        } else if (cmd.type === 'help') {
          reply = "I can help with: product counts, order stats, designer/user lists, PDF export, and navigating to Add Product or Add Designer. Try: \"How many products?\" or \"Export PDF\"."
        } else if (cmd.type === 'products') {
          const count = products?.length ?? 0
          const total = products?.reduce((s, p) => s + (p.price || 0), 0)
          reply = `You have **${count}** products. Total inventory value: **$${total.toLocaleString()}**.`
        } else if (cmd.type === 'orders') {
          try {
            const snap = await getDocs(collection(db, 'orders'))
            reply = `You have **${snap.size}** orders.`
          } catch {
            reply = 'Could not fetch orders. Try again.'
          }
        } else if (cmd.type === 'designers') {
          try {
            const snap = await getDocs(collection(db, 'users'))
            const designers = snap.docs.filter((d) => d.data().role === 'designer')
            reply = `You have **${designers.length}** designers${designers.length ? ': ' + designers.map((d) => d.data().email || d.id).join(', ') : ''}.`
          } catch {
            reply = 'Could not fetch designers.'
          }
        } else if (cmd.type === 'users') {
          try {
            const snap = await getDocs(collection(db, 'users'))
            const users = snap.docs.filter((d) => d.data().role === 'user' || !d.data().role)
            reply = `You have **${users.length}** users.`
          } catch {
            reply = 'Could not fetch users.'
          }
        } else if (cmd.type === 'export') {
          reply = 'Use the **Export PDF** or **CSV** button in the header. I can guide you there — go to Dashboard for the export buttons.'
          setTimeout(() => navigate('/admin'), 600)
        }
        break
      }
    }

    if (!matched) {
      reply = "I didn't quite get that. Try: \"How many products?\", \"Show orders\", \"Export PDF\", or \"Add product\"."
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
                placeholder="Ask me anything..."
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
