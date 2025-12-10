import { useEffect, useState } from 'react'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { packGridToBase64 } from '../utils/compress'

export const useProgress = ({ user }) => {
  const [loadingProgress, setLoadingProgress] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [lastSavedAt, setLastSavedAt] = useState(null)

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

    const favorites = squares.filter((s) => s.favorite)
    const favoritesCompressed = favorites.map((sq) => ({
      size: sq.size,
      grid: packGridToBase64(sq.grid),
      colors: sq.colors,
      shiny: sq.shiny,
      favorite: true,
      id: sq.id,
    }))

    const pedestalCompressed = []
    squares.forEach((sq) => {
      if (sq.isSolid) {
        pedestalCompressed.push({
          size: sq.size,
          grid: packGridToBase64(sq.grid),
          colors: sq.colors,
          shiny: sq.shiny,
          favorite: sq.favorite,
          id: sq.id,
        })
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
      setSaveStatus('error')
    }
  }

  return { loadProgress, saveProgress, loadingProgress, saveStatus, lastSavedAt }
}


