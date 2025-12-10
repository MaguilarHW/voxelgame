// Utilities to compress color grids (indices) into base64-packed bytes.
// We have 6 colors (3 bits per cell). Pack into Uint8Array then base64.

const toBase64 = (bytes) => {
  if (typeof window === 'undefined') {
    return Buffer.from(bytes).toString('base64')
  }
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary)
}

export const packGridToBase64 = (grid, bitsPerCell = 3) => {
  const flat = grid.flat()
  const totalBits = flat.length * bitsPerCell
  const totalBytes = Math.ceil(totalBits / 8)
  const out = new Uint8Array(totalBytes)

  let bitPos = 0
  flat.forEach((val) => {
    let v = val & ((1 << bitsPerCell) - 1)
    for (let i = bitsPerCell - 1; i >= 0; i -= 1) {
      const bit = (v >> i) & 1
      const byteIndex = Math.floor(bitPos / 8)
      const offset = 7 - (bitPos % 8)
      out[byteIndex] |= bit << offset
      bitPos += 1
    }
  })

  return toBase64(out)
}

export const unpackBase64ToGrid = (base64, size, bitsPerCell = 3) => {
  if (!base64) return []
  const binary =
    typeof window === 'undefined' ? Buffer.from(base64, 'base64') : Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  const totalCells = size * size
  const values = []
  let bitPos = 0
  for (let i = 0; i < totalCells; i += 1) {
    let v = 0
    for (let b = 0; b < bitsPerCell; b += 1) {
      const byteIndex = Math.floor(bitPos / 8)
      const offset = 7 - (bitPos % 8)
      const bit = (binary[byteIndex] >> offset) & 1
      v = (v << 1) | bit
      bitPos += 1
    }
    values.push(v)
  }
  const grid = []
  for (let r = 0; r < size; r += 1) {
    grid.push(values.slice(r * size, (r + 1) * size))
  }
  return grid
}


