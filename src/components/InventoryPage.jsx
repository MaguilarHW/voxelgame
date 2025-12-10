import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import BorderBox from './UI/BorderBox'
import InventoryGrid from './InventoryGrid'
import { colorInitialToIndex } from '../utils/colors'

const buildEmptyPattern = (size) => Array.from({ length: size }, () => Array.from({ length: size }, () => 'x'))

function InventoryPage({ squares, unlockedSizes, onToggleFavorite, onSave, saveStatus, loadingProgress }) {
  const [sizeFilter, setSizeFilter] = useState(unlockedSizes[0] ?? 1)
  const [pattern, setPattern] = useState(buildEmptyPattern(sizeFilter))
  const [noneColor, setNoneColor] = useState('')
  const [moreThanColor, setMoreThanColor] = useState('')
  const [moreThanCount, setMoreThanCount] = useState(0)

  const handlePatternChange = (r, c, val) => {
    setPattern((prev) => {
      const next = prev.map((row) => [...row])
      next[r][c] = val || 'x'
      return next
    })
  }

  const filtered = useMemo(() => {
    const noneIdx = colorInitialToIndex(noneColor)
    const moreIdx = colorInitialToIndex(moreThanColor)

    const patternHasColor = pattern.some((row) => row.some((cell) => cell !== 'x'))
    const normalizedPattern = patternHasColor ? pattern : buildEmptyPattern(sizeFilter)

    return squares.filter((sq) => {
      if (sq.size !== sizeFilter) return false
      // pattern match
      for (let r = 0; r < sizeFilter; r += 1) {
        for (let c = 0; c < sizeFilter; c += 1) {
          const ch = normalizedPattern[r][c].trim().toLowerCase()
          if (ch === 'x' || ch === '') continue
          const expectedIdx = colorInitialToIndex(ch)
          if (expectedIdx === null) continue
          if (sq.grid[r]?.[c] !== expectedIdx) return false
        }
      }
      // none-of-color
      if (noneIdx !== null) {
        if (sq.grid.flat().includes(noneIdx)) return false
      }
      // more-than
      if (moreIdx !== null && moreThanCount > 0) {
        const count = sq.grid.flat().filter((v) => v === moreIdx).length
        if (count <= moreThanCount) return false
      }
      return true
    })
  }, [squares, sizeFilter, pattern, noneColor, moreThanColor, moreThanCount])

  const sizeOptions = unlockedSizes.length ? unlockedSizes : [sizeFilter]

  return (
    <main className="page">
      <div className="column">
        <BorderBox title="Inventory Search">
          <div className="form">
            <label htmlFor="size">Size</label>
            <select
              id="size"
              value={sizeFilter}
              onChange={(e) => {
                const nextSize = Number(e.target.value)
                setSizeFilter(nextSize)
                setPattern(buildEmptyPattern(nextSize))
              }}
            >
              {sizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}x{s}
                </option>
              ))}
            </select>

            <label>Pattern (type initials b,g,r,y,m,w or x for wildcard)</label>
            <div className="pattern-grid">
              {pattern.map((row, rIdx) => (
                <div key={rIdx} className="pattern-row">
                  {row.map((cell, cIdx) => (
                    <input
                      key={`${rIdx}-${cIdx}`}
                      className="pattern-cell"
                      value={cell}
                      maxLength={1}
                      onChange={(e) => handlePatternChange(rIdx, cIdx, e.target.value)}
                    />
                  ))}
                </div>
              ))}
            </div>

            <label htmlFor="noneColor">None of color (initial)</label>
            <input
              id="noneColor"
              type="text"
              value={noneColor}
              maxLength={1}
              onChange={(e) => setNoneColor(e.target.value)}
            />

            <label htmlFor="moreThanColor">More than count of color (initial)</label>
            <div className="input-row">
              <input
                id="moreThanColor"
                type="text"
                value={moreThanColor}
                maxLength={1}
                onChange={(e) => setMoreThanColor(e.target.value)}
              />
              <input
                type="number"
                min="0"
                value={moreThanCount}
                onChange={(e) => setMoreThanCount(Number(e.target.value) || 0)}
              />
            </div>

            <div className="actions">
              <Link className="btn" to="/">
                Back
              </Link>
              <button
                className="btn"
                type="button"
                disabled={saveStatus === 'saving' || loadingProgress}
                onClick={onSave}
              >
                {saveStatus === 'saving' ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </BorderBox>
      </div>

      <div className="column">
        <InventoryGrid squares={filtered} onToggleFavorite={onToggleFavorite} />
      </div>
    </main>
  )
}

InventoryPage.propTypes = {
  squares: PropTypes.arrayOf(PropTypes.object).isRequired,
  unlockedSizes: PropTypes.arrayOf(PropTypes.number).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saveStatus: PropTypes.string.isRequired,
  loadingProgress: PropTypes.bool.isRequired,
}

export default InventoryPage

