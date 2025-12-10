import PropTypes from 'prop-types'
import { palette, colorIndexToName } from '../utils/colors'
import Square from './Square'

function Pedestal({ colorIndex, squares, size }) {
  const colorHex = palette[colorIndex]
  const label = colorIndexToName(colorIndex)
  const topSquare = squares[0]

  return (
    <div className="pedestal">
      <div style={{ color: colorHex, marginBottom: 4 }}>{label} ({squares.length})</div>
      {topSquare ? (
        <Square grid={topSquare.grid} size={topSquare.size} label="top" />
      ) : (
        <div>Empty pedestal</div>
      )}
      <div className="pedestal-base">┌──┐{` n=${size}`}</div>
      <div className="pedestal-base">└──┘</div>
    </div>
  )
}

Pedestal.propTypes = {
  colorIndex: PropTypes.number.isRequired,
  squares: PropTypes.arrayOf(PropTypes.object).isRequired,
  size: PropTypes.number.isRequired,
}

export default Pedestal


