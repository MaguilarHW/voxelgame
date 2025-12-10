import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Button from './UI/Button'
import BorderBox from './UI/BorderBox'
import Square from './Square'

function Generator({ currentSquare, onReroll, onPauseToggle, isPaused, cooldownSeconds, nextAt, size }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(id)
  }, [])

  const remainingSeconds = Math.max(0, (nextAt - now) / 1000)

  return (
    <BorderBox title="Generator" className="generator border-box">
      <div className="header">
        <div className="title">n = {size}</div>
        <div className="status">
          <span className="dot" />
          <span>{isPaused ? 'Paused' : 'Active'}</span>
        </div>
      </div>
      <div className="timer">
        Cooldown: {cooldownSeconds}s | Next in: {remainingSeconds.toFixed(1)}s
      </div>
      {currentSquare ? (
        <Square
          grid={currentSquare.grid}
          size={currentSquare.size}
          label={`${currentSquare.rarity ?? ''} ${currentSquare.pattern ?? ''}`}
        />
      ) : (
        <div>No square yet</div>
      )}
      <div className="actions">
        <Button onClick={onReroll}>Reroll</Button>
        <Button onClick={onPauseToggle}>{isPaused ? 'Resume' : 'Pause'}</Button>
      </div>
    </BorderBox>
  )
}

Generator.propTypes = {
  currentSquare: PropTypes.shape({
    grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    size: PropTypes.number,
    rarity: PropTypes.string,
    pattern: PropTypes.string,
  }),
  onReroll: PropTypes.func.isRequired,
  onPauseToggle: PropTypes.func.isRequired,
  isPaused: PropTypes.bool.isRequired,
  cooldownSeconds: PropTypes.number.isRequired,
  nextAt: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
}

export default Generator


