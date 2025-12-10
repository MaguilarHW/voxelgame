import PropTypes from 'prop-types'
import BorderBox from './UI/BorderBox'
import Button from './UI/Button'

function DebugPanel({ cooldownSeconds, onChangeCooldown, onReset }) {
  return (
    <BorderBox title="Debug (miles)" className="border-box">
      <div className="form">
        <label htmlFor="cooldown">Cooldown (seconds, min 0.01)</label>
        <input
          id="cooldown"
          type="number"
          min="0.01"
          step="0.01"
          value={cooldownSeconds}
          onChange={(e) => onChangeCooldown(parseFloat(e.target.value) || 0.01)}
        />
        <div className="actions">
          <Button onClick={() => onReset()}>Reset</Button>
        </div>
      </div>
    </BorderBox>
  )
}

DebugPanel.propTypes = {
  cooldownSeconds: PropTypes.number.isRequired,
  onChangeCooldown: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
}

export default DebugPanel


