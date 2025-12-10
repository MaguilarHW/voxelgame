// Utilities for rendering ASCII / box-drawing UI elements without curves

export const box = {
  tl: '┌',
  tr: '┐',
  bl: '└',
  br: '┘',
  h: '─',
  v: '│',
  cross: '┼',
  t: '┬',
  b: '┴',
  l: '├',
  r: '┤',
}

export const solidBlock = '█'
export const mediumBlock = '▓'
export const lightBlock = '▒'
export const veryLightBlock = '░'

export const drawBorder = (content) => `${box.tl}${box.h}${box.tr}\n${box.v}${content}${box.v}\n${box.bl}${box.h}${box.br}`


