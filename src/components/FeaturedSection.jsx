import PropTypes from 'prop-types'
import BorderBox from './UI/BorderBox'
import InventoryGrid from './InventoryGrid'

function FeaturedSection({ squares }) {
  return (
    <BorderBox title="Featured (Important Squares)" className="border-box">
      {squares.length === 0 ? <div>No featured squares yet</div> : <InventoryGrid squares={squares} />}
    </BorderBox>
  )
}

FeaturedSection.propTypes = {
  squares: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default FeaturedSection


