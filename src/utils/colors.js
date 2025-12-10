// 6-color palette (reduced, spread out, no light variants)
export const palette = [
  '#ffffff', // white
  '#ff0000', // red
  '#00c000', // green
  '#0000ff', // blue
  '#ffcc00', // yellow
  '#ff00ff', // magenta
]

export const backgroundColor = '#000000'
export const borderColor = '#ffffff'
export const textColor = '#ffffff'

export const colorNames = ['white', 'red', 'green', 'blue', 'yellow', 'magenta']

export const randomColorIndex = () => Math.floor(Math.random() * palette.length)

export const getColorHex = (index) => palette[index % palette.length]

export const colorIndexToName = (index) => colorNames[index % colorNames.length]

export const colorInitialToIndex = (initial) => {
  const c = initial?.trim().toLowerCase()
  switch (c) {
    case 'w':
      return 0
    case 'r':
      return 1
    case 'g':
      return 2
    case 'b':
      return 3
    case 'y':
      return 4
    case 'm':
      return 5
    default:
      return null
  }
}


