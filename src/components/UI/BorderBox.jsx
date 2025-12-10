import PropTypes from 'prop-types'

function BorderBox({ title, children, className = '' }) {
  return (
    <section className={`border-box ${className}`}>
      {title ? <header className="panel-title">{title}</header> : null}
      {children}
    </section>
  )
}

BorderBox.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default BorderBox


