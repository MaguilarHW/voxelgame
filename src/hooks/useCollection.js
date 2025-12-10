import { useMemo } from 'react'
import { palette } from '../utils/colors'

export const useCollection = ({ squares, size }) => {
  const { pedestals, completed, colorsCollected } = useMemo(() => {
    const filtered = squares.filter((s) => s.size === size && s.isSolid)
    const map = new Map()
    filtered.forEach((sq) => {
      const colorList = sq.colors ?? []
      colorList.forEach((colorIdx) => {
        if (!map.has(colorIdx)) map.set(colorIdx, [])
        map.get(colorIdx).push(sq)
      })
    })

    const ped = Array.from(map.entries()).map(([colorIndex, list]) => ({
      colorIndex,
      squares: list,
    }))

    return {
      pedestals: ped,
      colorsCollected: map.size,
      completed: map.size >= palette.length,
    }
  }, [squares, size])

  return { pedestals, completed, colorsCollected }
}


