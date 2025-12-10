import PropTypes from 'prop-types'
import BorderBox from './UI/BorderBox'
import Pedestal from './Pedestal'

function PedestalGrid({ pedestals, size }) {
  return (
    <BorderBox title={`Pedestals n=${size}`} className="border-box">
      <div className="pedestal-grid">
        {pedestals.map((item) => (
          <Pedestal key={item.colorIndex} colorIndex={item.colorIndex} squares={item.squares} size={size} />
        ))}
      </div>
    </BorderBox>
  )
}

PedestalGrid.propTypes = {
  pedestals: PropTypes.arrayOf(
    PropTypes.shape({
      colorIndex: PropTypes.number.isRequired,
      squares: PropTypes.array.isRequired,
    }),
  ).isRequired,
  size: PropTypes.number.isRequired,
}

export default PedestalGrid


