/**
 * Firestore design service — save/fetch designs for sharing and persistence.
 * Designs are stored in the 'designs' collection with createdBy for ownership.
 */
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/* ── Normalize design for Firestore (strip non-persisted fields) ── */
export function toFirestoreDesign(design, userId) {
  const base = {
    name: design.name || 'Untitled Design',
    rooms: design.rooms ? JSON.parse(JSON.stringify(design.rooms)) : [],
    activeRoomIndex: design.activeRoomIndex ?? 0,
    roomWidth: design.roomWidth,
    roomDepth: design.roomDepth,
    roomHeight: design.roomHeight,
    wallColor: design.wallColor,
    floorColor: design.floorColor,
    updatedAt: serverTimestamp(),
  }
  if (userId) {
    base.createdBy = userId
  }
  if (design.createdAt) {
    base.createdAt = design.createdAt
  }
  // Preserve Designer Panel fields if present
  if (design.status != null) base.status = design.status
  if (design.userName != null) base.userName = design.userName
  if (design.userEmail != null) base.userEmail = design.userEmail
  if (design.comments != null) base.comments = design.comments
  if (design.designerNotes != null) base.designerNotes = design.designerNotes
  return base
}

/* ── Save design to Firestore (create or update) ── */
export async function saveDesignToFirestore(design, userId) {
  if (!design?.id || !userId) {
    throw new Error('Design ID and user ID required')
  }
  const ref = doc(db, 'designs', design.id)
  const existing = await getDoc(ref)
  const payload = toFirestoreDesign(design, userId)
  if (!existing.exists()) {
    payload.createdAt = design.createdAt || serverTimestamp()
  }
  await setDoc(ref, payload, { merge: true })
  return design.id
}

/* ── Fetch design by ID (for shared view and editor load) ── */
export async function fetchDesignById(designId) {
  if (!designId) return null
  const ref = doc(db, 'designs', designId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    id: snap.id,
    name: data.name,
    rooms: data.rooms,
    activeRoomIndex: data.activeRoomIndex ?? 0,
    roomWidth: data.roomWidth,
    roomDepth: data.roomDepth,
    roomHeight: data.roomHeight,
    wallColor: data.wallColor,
    floorColor: data.floorColor,
    createdBy: data.createdBy,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt,
    status: data.status,
    userName: data.userName,
    userEmail: data.userEmail,
    comments: data.comments,
    designerNotes: data.designerNotes,
  }
}

/* ── Fetch all designs created by user ── */
export async function fetchDesignsByUser(userId) {
  if (!userId) return []
  const q = query(collection(db, 'designs'), where('createdBy', '==', userId))
  const snap = await getDocs(q)
  const list = snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
    updatedAt: d.data().updatedAt?.toDate?.()?.toISOString?.() || d.data().updatedAt,
    createdAt: d.data().createdAt?.toDate?.()?.toISOString?.() || d.data().createdAt,
  }))
  list.sort((a, b) => (new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)))
  return list
}
