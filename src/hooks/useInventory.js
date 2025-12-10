import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '../lib/firebase'

export const useInventory = ({ userId }) => {
  const [squares, setSquares] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      if (!userId) {
        setSquares([])
        setLoading(false)
        return
      }
      try {
        const q = query(
          collection(db, 'squares'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
        )
        const snap = await getDocs(q)
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setSquares(list)
      } catch (err) {
        // stay silent; local-only generation can still display
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  const addSquare = (sq) => setSquares((current) => [sq, ...current])
  const setAllSquares = (list) => setSquares(list)

  const featured = squares.filter((s) => s.favorite)

  return {
    squares,
    featured,
    addSquare,
    setAllSquares,
    loading,
  }
}


