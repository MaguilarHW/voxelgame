import PropTypes from 'prop-types'
import Square from './Square'

const signatureForSquare = (sq) => `${sq.size}-${JSON.stringify(sq.grid)}`

function InventoryGrid({ squares, onToggleFavorite }) {
  const grouped = squares.reduce((acc, sq) => {
    const sig = signatureForSquare(sq)
    if (!acc.has(sig)) {
      acc.set(sig, { ...sq, count: 0 })
    }
    const entry = acc.get(sig)
    entry.count += 1
    // propagate favorite/shiny if any instance is favorite/shiny
    entry.favorite = entry.favorite || sq.favorite
    entry.shiny = entry.shiny || sq.shiny
    return acc
  }, new Map())

  const groups = Array.from(grouped.values())

  return (
    <div className="inventory-grid">
      {groups.map((sq) => (
        <Square
          key={`${sq.id}-${sq.count}`}
          grid={sq.grid}
          size={sq.size}
          shiny={sq.shiny}
          favorite={sq.favorite}
          count={sq.count}
          onToggleFavorite={() => onToggleFavorite(sq)}
        />
      ))}
    </div>
  )
}

InventoryGrid.propTypes = {
  squares: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
      size: PropTypes.number.isRequired,
      favorite: PropTypes.bool,
      shiny: PropTypes.bool,
    }),
  ).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
}

export default InventoryGrid


