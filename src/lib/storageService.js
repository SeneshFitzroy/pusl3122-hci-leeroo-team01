/**
 * Firebase Storage helpers for product image uploads.
 */
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

/**
 * Upload a file to Firebase Storage and return the public URL.
 * @param {File} file - Image file to upload
 * @param {string} path - Storage path (e.g. 'products/sp-123-main.jpg')
 * @returns {Promise<string|null>} Download URL or null on failure
 */
export async function uploadProductImage(file, path) {
  if (!file || !path) return null
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type || 'image/jpeg',
      cacheControl: 'public, max-age=31536000',
    })
    return await getDownloadURL(snapshot.ref)
  } catch (err) {
    console.error('[Storage] Upload failed:', err)
    return null
  }
}

/**
 * Generate a unique storage path for a product image.
 */
export function productImagePath(productId, index = 0, ext = 'jpg') {
  const safeId = (productId || 'new').replace(/[^a-zA-Z0-9-_]/g, '_')
  return `products/${safeId}-${index}-${Date.now()}.${ext}`
}
