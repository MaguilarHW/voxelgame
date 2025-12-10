import PropTypes from 'prop-types'
import { palette, colorIndexToName } from '../utils/colors'

function Square({ grid, size, count, favorite, shiny, onToggleFavorite }) {
  const cellSize = size <= 6 ? 7 : size <= 10 ? 5 : 4

  return (
    <div className="square-card">
      <div className="square-header">
        {shiny ? <span className="badge">★ Shiny</span> : <span />}
        <button className="star-btn" type="button" onClick={onToggleFavorite}>
          {favorite ? '★' : '☆'}
        </button>
      </div>
      <div
        className="generator-grid"
        style={{
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          gridAutoRows: `${cellSize}px`,
          lineHeight: '0',
        }}
      >
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className="square-cell"
              style={{ background: palette[cell], width: `${cellSize}px`, height: `${cellSize}px`, aspectRatio: '1 / 1' }}
              title={colorIndexToName(cell)}
            />
          )),
        )}
      </div>
      <div className="square-meta">
        <span>
          {size}x{size}
          {count > 1 ? ` (x${count})` : ''}
        </span>
      </div>
    </div>
  )
}

Square.propTypes = {
  grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  size: PropTypes.number.isRequired,
  count: PropTypes.number,
  favorite: PropTypes.bool,
  shiny: PropTypes.bool,
  onToggleFavorite: PropTypes.func.isRequired,
}

export default Square


