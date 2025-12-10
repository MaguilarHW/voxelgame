import { useEffect, useRef, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { randomColorIndex } from '../utils/colors'
import { detectPattern, detectSolid } from '../utils/patterns'
import { computeRarity, isImportantSquare } from '../utils/rarity'

const DEFAULT_USER_ID = 'demo-user'

const buildSquare = (size) => {
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => randomColorIndex()),
  )
  const flat = grid.flat()
  const uniqueColors = [...new Set(flat)]
  const patternResult = detectPattern(grid)
  const solidResult = detectSolid(grid)
  const rarity = computeRarity({
    pattern: patternResult?.pattern,
    uniqueColorsCount: uniqueColors.length,
    size,
  })

  const shiny = Math.random() < 0.01

  const data = {
    size,
    grid,
    colors: uniqueColors,
    pattern: patternResult?.pattern ?? null,
    rarity,
    isSolid: Boolean(solidResult),
    shiny,
    isImportant: isImportantSquare({
      pattern: patternResult?.pattern,
      rarity,
      completesSet: false,
      size,
    }),
    createdAt: serverTimestamp(),
    userId: DEFAULT_USER_ID,
  }

  return data
}

export const useGenerator = ({ size, cooldownMs, onGenerated, userId }) => {
  const [currentSquare, setCurrentSquare] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [nextAt, setNextAt] = useState(Date.now() + cooldownMs)
  const timerRef = useRef(null)

  const generateAndPersist = async () => {
    if (!userId) return
    const square = buildSquare(size)
    try {
      const ref = await addDoc(collection(db, 'squares'), square)
      const saved = { ...square, id: ref.id }
      setCurrentSquare(saved)
      onGenerated(saved)
    } catch (err) {
      // Fallback to local-only if Firestore fails
      const saved = { ...square, id: `local-${Date.now()}` }
      setCurrentSquare(saved)
      onGenerated(saved)
    } finally {
      setNextAt(Date.now() + cooldownMs)
    }
  }

  const schedule = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    if (isPaused || !userId) return
    const delay = Math.max(0, nextAt - Date.now())
    timerRef.current = setTimeout(() => {
      generateAndPersist()
    }, delay)
  }

  useEffect(() => {
    schedule()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextAt, isPaused, size, cooldownMs, userId])

  const reroll = () => {
    generateAndPersist()
  }

  const togglePause = () => {
    setIsPaused((prev) => !prev)
    setNextAt(Date.now() + cooldownMs)
  }

  return {
    currentSquare,
    reroll,
    togglePause,
    isPaused,
    nextAt,
  }
}


