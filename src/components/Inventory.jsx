import PropTypes from 'prop-types'
import BorderBox from './UI/BorderBox'
import InventoryGrid from './InventoryGrid'

function Inventory({ squares, onToggleFavorite }) {
  return (
    <BorderBox title="Inventory" className="border-box">
      {squares.length === 0 ? (
        <div>No squares collected yet.</div>
      ) : (
        <InventoryGrid squares={squares} onToggleFavorite={onToggleFavorite} />
      )}
    </BorderBox>
  )
}

Inventory.propTypes = {
  squares: PropTypes.arrayOf(PropTypes.object).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
}

export default Inventory


