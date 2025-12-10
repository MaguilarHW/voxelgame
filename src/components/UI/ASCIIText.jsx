import PropTypes from 'prop-types'

function ASCIIText({ text, color }) {
  return <span style={{ color }}>{text}</span>
}

ASCIIText.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
}

export default ASCIIText


