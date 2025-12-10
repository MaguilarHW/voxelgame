// Rarity calculation based on pattern presence and color diversity
export const computeRarity = ({ pattern, uniqueColorsCount, size }) => {
  if (!pattern && uniqueColorsCount <= 2) return 'common'
  if (pattern === 'solid') return 'common'
  if (pattern === 'border' || pattern?.includes('stripes')) return 'rare'
  if (pattern === 'checkerboard' || pattern === 'gradient') return 'epic'

  if (uniqueColorsCount >= Math.min(size * size, 6)) return 'epic'
  if (uniqueColorsCount >= Math.min(size * size, 10)) return 'legendary'

  return 'rare'
}

export const isImportantSquare = ({ pattern, rarity, completesSet, size }) =>
  size >= 2 && (completesSet || rarity === 'legendary' || rarity === 'epic' || Boolean(pattern))


