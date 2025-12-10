import PropTypes from 'prop-types'
import BorderBox from './UI/BorderBox'
import InventoryGrid from './InventoryGrid'

function FeaturedSection({ squares, onToggleFavorite }) {
  return (
    <BorderBox title="Featured (Favorites)" className="border-box">
      {squares.length === 0 ? (
        <div>No featured squares yet</div>
      ) : (
        <InventoryGrid squares={squares} onToggleFavorite={onToggleFavorite} />
      )}
    </BorderBox>
  )
}

FeaturedSection.propTypes = {
  squares: PropTypes.arrayOf(PropTypes.object).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
}

export default FeaturedSection


