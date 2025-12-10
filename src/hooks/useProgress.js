import { useEffect, useState } from 'react'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { packGridToBase64 } from '../utils/compress'

export const useProgress = ({ user }) => {
  const [loadingProgress, setLoadingProgress] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [lastSavedAt, setLastSavedAt] = useState(null)

  const compressSquare = (sq) => {
    if (!sq || !sq.grid || !Array.isArray(sq.grid) || !sq.grid.length || !sq.size) return null
    return {
      size: sq.size,
      grid: packGridToBase64(sq.grid),
      colors: sq.colors ?? [],
      shiny: Boolean(sq.shiny),
      favorite: Boolean(sq.favorite),
      id: sq.id,
    }
  }

  const loadProgress = async () => {
    if (!user) return null
    setLoadingProgress(true)
    try {
      const ref = doc(db, 'progress', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data()
        const iso =
          data.updatedAt && typeof data.updatedAt.toDate === 'function'
            ? data.updatedAt.toDate().toISOString()
            : null
        setLastSavedAt(iso)
        return data
      }
    } catch (err) {
      // silent; caller can ignore
    } finally {
      setLoadingProgress(false)
    }
    return null
  }

  const saveProgress = async ({ squares, unlockedSizes, currentSize, featured }) => {
    if (!user) return
    setSaveStatus('saving')
    const sizes = {}
    squares
      .filter((s) => s.isSolid)
      .forEach((sq) => {
        const entry = sizes[sq.size] ?? { colors: {} }
        sq.colors?.forEach((c) => {
          entry.colors[c] = (entry.colors[c] ?? 0) + 1
        })
        sizes[sq.size] = entry
      })

    const favorites = squares.filter(
      (s) => s.favorite && s.grid && Array.isArray(s.grid) && s.grid.length && s.size,
    )
    const favoritesCompressed = favorites.map(compressSquare).filter(Boolean)

    const pedestalCompressed = []
    squares.forEach((sq) => {
      if (sq.isSolid && sq.grid && Array.isArray(sq.grid) && sq.grid.length && sq.size) {
        const packed = compressSquare(sq)
        if (packed) pedestalCompressed.push(packed)
      }
    })

    const payload = {
      sizes,
      unlockedSizes,
      currentSize,
      featured: favoritesCompressed,
      pedestals: pedestalCompressed.slice(0, 200),
      updatedAt: serverTimestamp(),
    }

    try {
      const ref = doc(db, 'progress', user.uid)
      await setDoc(ref, payload, { merge: true })
      setSaveStatus('saved')
      setLastSavedAt(new Date().toISOString())
    } catch (err) {
      // surface error for debugging
      // eslint-disable-next-line no-console
      console.error('Save failed', err)
      setSaveStatus('error')
    }
  }

  return { loadProgress, saveProgress, loadingProgress, saveStatus, lastSavedAt }
}


