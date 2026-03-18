import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, UserPlus, Users, Mail, Lock, Shield, Loader2, CheckCircle, Trash2, Ban, UserCheck, Palette } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import useAuthStore from '@/store/useAuthStore'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, setDoc, getDoc, getDocs, collection, updateDoc, deleteDoc } from 'firebase/firestore'

export default function AdminUsers() {
  const { user } = useAuthStore()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [roleType, setRoleType] = useState('designer')
  const [loading, setLoading] = useState(false)
  const [designers, setDesigners] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('add')

  const loadUsers = async () => {
    try {
      const snap = await getDocs(collection(db, 'users'))
      const all = snap.docs.map((d) => ({ id: d.id, uid: d.id, ...d.data() }))
      setDesigners(all.filter((u) => u.role === 'designer'))
      setUsers(all.filter((u) => u.role === 'user' || !u.role || u.role === undefined))
    } catch (e) {
      toast.error('Failed to load users')
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleAddUser = async (e) => {
    e.preventDefault()
    if (!email || !password || !adminPassword) {
      toast.error('Please fill all required fields')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    const adminEmail = user?.email
    if (!adminEmail) {
      toast.error('Admin session lost')
      return
    }
    setLoading(true)
    try {
      await signOut(auth)
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', credential.user.uid), {
        uid: credential.user.uid,
        email,
        displayName: displayName || (roleType === 'designer' ? 'Designer' : 'User'),
        name: displayName || (roleType === 'designer' ? 'Designer' : 'User'),
        role: roleType,
        createdAt: new Date().toISOString(),
        designs: [],
        wishlist: [],
      }, { merge: true })
      await signOut(auth)
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
      toast.success(`${roleType === 'designer' ? 'Designer' : 'User'} ${email} added successfully`)
      setEmail('')
      setPassword('')
      setDisplayName('')
      setAdminPassword('')
      loadUsers()
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'Email already in use.'
        : err.message
      toast.error(msg)
      try {
        if (adminEmail) await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
      } catch (_) {}
    } finally {
      setLoading(false)
    }
  }

  const handleBlock = async (uid, currentlyBlocked) => {
    if (!uid || uid === user?.uid) return
    try {
      await updateDoc(doc(db, 'users', uid), { blocked: !currentlyBlocked })
      toast.success(currentlyBlocked ? 'User unblocked' : 'User blocked')
      loadUsers()
    } catch (e) {
      toast.error('Failed to update')
    }
  }

  const handleDeleteUser = async (uid) => {
    if (!uid || uid === user?.uid) return
    if (!confirm('Remove this user record? They can still log in until deleted from Firebase Console.')) return
    try {
      await deleteDoc(doc(db, 'users', uid))
      toast.success('User record removed')
      loadUsers()
    } catch (e) {
      toast.error('Failed to remove')
    }
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      <div className="bg-white dark:bg-dark-card border-b border-warm-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 rounded-xl bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-white hover:bg-warm-200 dark:hover:bg-dark-border transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-darkwood dark:text-white font-display flex items-center gap-2">
                <Users className="h-7 w-7 text-clay" />
                {t('admin.team') || 'Team & Users'}
              </h1>
              <p className="text-darkwood/50 dark:text-white text-sm">Add designers, manage users, block accounts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['add', 'designers', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm capitalize transition-colors ${activeTab === tab ? 'bg-clay text-white' : 'bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-white hover:bg-warm-200 dark:hover:bg-dark-border'}`}
            >
              {tab === 'add' ? 'Add User' : tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'add' && (
            <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border p-6">
                <h2 className="text-lg font-bold text-darkwood dark:text-white mb-4 flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-clay" />
                  {t('admin.addDesigner') || 'Add New User / Designer'}
                </h2>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">Role</label>
                    <select value={roleType} onChange={(e) => setRoleType(e.target.value)} className="input-field">
                      <option value="designer">Designer</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('auth.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@leeroo.com" required className="input-field pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">Password (min 6 chars)</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="input-field pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">Display name (optional)</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                      <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Name" className="input-field pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">Your admin password (to verify)</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                      <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••••" required className="input-field pl-10" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-clay text-white px-6 py-3 rounded-xl font-semibold hover:bg-clay-dark disabled:opacity-50 transition-all">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                    {loading ? 'Adding...' : `Add ${roleType === 'designer' ? 'Designer' : 'User'}`}
                  </button>
                </form>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-semibold mb-1">Admin credentials</p>
                  <p className="text-amber-700 dark:text-amber-300">Use admin@leeroo.com with your .env VITE_DEMO_ADMIN_PASSWORD.</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'designers' && (
            <motion.div key="designers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border overflow-hidden">
              <div className="p-4 border-b border-warm-100 dark:border-dark-border flex items-center gap-2">
                <Palette className="h-5 w-5 text-clay" />
                <h2 className="font-semibold text-darkwood dark:text-white">Designers List</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-warm-100 dark:border-dark-border bg-warm-50 dark:bg-dark-surface">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase">Email</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-100 dark:divide-dark-border">
                    {designers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-darkwood/50 dark:text-white text-sm">No designers yet</td>
                      </tr>
                    ) : (
                      designers.map((d) => (
                        <tr key={d.uid} className="hover:bg-warm-50 dark:hover:bg-dark-surface/50">
                          <td className="px-4 py-3 text-sm font-medium text-darkwood dark:text-white">{d.name || d.displayName || '—'}</td>
                          <td className="px-4 py-3 text-sm text-darkwood/70 dark:text-white">{d.email || '—'}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleBlock(d.uid, d.blocked)} className={`p-2 rounded-lg transition-colors ${d.blocked ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:opacity-80'}`} title={d.blocked ? 'Unblock' : 'Block'}>
                                {d.blocked ? <UserCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                              </button>
                              {d.uid !== user?.uid && (
                                <button onClick={() => handleDeleteUser(d.uid)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border overflow-hidden">
              <div className="p-4 border-b border-warm-100 dark:border-dark-border flex items-center gap-2">
                <Users className="h-5 w-5 text-forest" />
                <h2 className="font-semibold text-darkwood dark:text-white">Users List</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-warm-100 dark:border-dark-border bg-warm-50 dark:bg-dark-surface">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase">Email</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase">Status</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-100 dark:divide-dark-border">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-darkwood/50 dark:text-white text-sm">No users yet</td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.uid} className="hover:bg-warm-50 dark:hover:bg-dark-surface/50">
                          <td className="px-4 py-3 text-sm font-medium text-darkwood dark:text-white">{u.name || u.displayName || '—'}</td>
                          <td className="px-4 py-3 text-sm text-darkwood/70 dark:text-white">{u.email || '—'}</td>
                          <td className="px-4 py-3">
                            {u.blocked ? (
                              <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Blocked</span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleBlock(u.uid, u.blocked)} className={`p-2 rounded-lg transition-colors ${u.blocked ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:opacity-80'}`} title={u.blocked ? 'Unblock' : 'Block'}>
                                {u.blocked ? <UserCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                              </button>
                              {u.uid !== user?.uid && (
                                <button onClick={() => handleDeleteUser(u.uid)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Remove record">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
