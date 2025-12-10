// Pattern detection helpers for n x n color grids (indices into palette)

const allEqual = (arr) => arr.every((v) => v === arr[0])

export const detectSolid = (grid) => {
  const flat = grid.flat()
  return allEqual(flat) ? { pattern: 'solid', primary: flat[0] } : null
}

export const detectCheckerboard = (grid) => {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  if (rows < 2 || cols < 2) return null

  const base = grid[0][0]
  const alt = grid[0][1] ?? base

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const expected = (r + c) % 2 === 0 ? base : alt
      if (grid[r][c] !== expected) return null
    }
  }

  if (base === alt) return null
  return { pattern: 'checkerboard', colors: [base, alt] }
}

export const detectStripes = (grid) => {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  if (rows === 0 || cols === 0) return null

  const horizontal = grid.every((row) => allEqual(row))
  if (horizontal) {
    const paletteRow = grid.map((row) => row[0])
    return { pattern: 'horizontal-stripes', colors: paletteRow }
  }

  let vertical = true
  for (let c = 0; c < cols; c += 1) {
    const column = grid.map((row) => row[c])
    if (!allEqual(column)) {
      vertical = false
      break
    }
  }
  if (vertical) {
    const paletteCol = grid[0].map((_, idx) => grid[0][idx])
    return { pattern: 'vertical-stripes', colors: paletteCol }
  }

  return null
}

export const detectBorder = (grid) => {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  if (rows < 3 || cols < 3) return null

  const borderColor = grid[0][0]
  for (let c = 0; c < cols; c += 1) {
    if (grid[0][c] !== borderColor || grid[rows - 1][c] !== borderColor) return null
  }
  for (let r = 0; r < rows; r += 1) {
    if (grid[r][0] !== borderColor || grid[r][cols - 1] !== borderColor) return null
  }
  return { pattern: 'border', borderColor }
}

export const detectGradient = (grid) => {
  // Simple heuristic: check if each row is non-decreasing and each column is non-decreasing
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  if (rows < 2 || cols < 2) return null

  const nonDecreasingRow = grid.every((row) => row.every((val, idx) => idx === 0 || row[idx - 1] <= val))
  if (!nonDecreasingRow) return null

  for (let c = 0; c < cols; c += 1) {
    for (let r = 1; r < rows; r += 1) {
      if (grid[r - 1][c] > grid[r][c]) return null
    }
  }
  return { pattern: 'gradient' }
}

export const detectPattern = (grid) =>
  detectSolid(grid) ||
  detectCheckerboard(grid) ||
  detectStripes(grid) ||
  detectBorder(grid) ||
  detectGradient(grid)


