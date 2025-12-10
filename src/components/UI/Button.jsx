import PropTypes from 'prop-types'

function Button({ children, onClick, disabled }) {
  return (
    <button className="btn" type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}

export default Button


