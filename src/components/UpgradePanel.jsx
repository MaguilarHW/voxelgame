import PropTypes from 'prop-types'
import BorderBox from './UI/BorderBox'

function UpgradePanel({ upgrades }) {
  return (
    <BorderBox title="Upgrades" className="border-box">
      <div className="upgrade-list">
        <div className="upgrade-item">Color Highlighting: {upgrades.colorHighlighting ? 'ON' : 'OFF'}</div>
        <div className="upgrade-item">Pattern Detection: {upgrades.patternDetection ? 'ON' : 'OFF'}</div>
        <div className="upgrade-item">Collection Speed: x{upgrades.collectionSpeed.toFixed(2)}</div>
        <div className="upgrade-item">Reroll: {upgrades.rerollEnabled ? 'ON' : 'OFF'}</div>
        <div className="upgrade-item">Pause: {upgrades.pauseEnabled ? 'ON' : 'OFF'}</div>
        <div className="upgrade-item">Speed Boost: {upgrades.speedBoostEnabled ? 'ON' : 'OFF'}</div>
      </div>
    </BorderBox>
  )
}

UpgradePanel.propTypes = {
  upgrades: PropTypes.shape({
    colorHighlighting: PropTypes.bool,
    patternDetection: PropTypes.bool,
    collectionSpeed: PropTypes.number,
    rerollEnabled: PropTypes.bool,
    pauseEnabled: PropTypes.bool,
    speedBoostEnabled: PropTypes.bool,
  }).isRequired,
}

export default UpgradePanel


