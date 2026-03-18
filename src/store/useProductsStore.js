import { create } from 'zustand'
import { SHOP_PRODUCTS } from '@/lib/constants'
import { getProductsFromFirestore, saveProductToFirestore, deleteProductFromFirestore } from '@/lib/seedProducts'

/**
 * Shared products store for Admin (CRUD) and Shop (read).
 * Loads from Firestore on init; falls back to SHOP_PRODUCTS if empty.
 * Admin changes sync to Firestore and update store; Shop reads from store.
 */
const useProductsStore = create((set, get) => ({
  products: [],
  loaded: false,

  loadProducts: async () => {
    try {
      const fromFirestore = await getProductsFromFirestore()
      if (fromFirestore && fromFirestore.length > 0) {
        set({ products: fromFirestore, loaded: true })
        return
      }
      set({ products: [...SHOP_PRODUCTS], loaded: true })
    } catch (err) {
      console.warn('[Products] Load failed, using constants:', err)
      set({ products: [...SHOP_PRODUCTS], loaded: true })
    }
  },

  setProducts: (products) => set({ products }),

  addProduct: async (product) => {
    const id = product.id?.startsWith('new-') ? `sp-${Date.now()}` : product.id
    const toSave = { ...product, id }
    const ok = await saveProductToFirestore(toSave)
    if (ok) {
      set((s) => ({ products: [...s.products.filter(p => p.id !== id), toSave] }))
      return toSave
    }
    return null
  },

  updateProduct: async (product) => {
    const ok = await saveProductToFirestore(product)
    if (ok) {
      set((s) => ({
        products: s.products.map(p => p.id === product.id ? product : p)
      }))
      return product
    }
    return null
  },

  deleteProduct: async (productId) => {
    const ok = await deleteProductFromFirestore(productId)
    if (ok) {
      set((s) => ({ products: s.products.filter(p => p.id !== productId) }))
      return true
    }
    return false
  },

  getProducts: () => get().products,
}))

export default useProductsStore
