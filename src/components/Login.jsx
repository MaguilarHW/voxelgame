import { useState } from 'react'
import PropTypes from 'prop-types'
import BorderBox from './UI/BorderBox'
import Button from './UI/Button'

function Login({ onSignIn, onSignUp, error }) {
  const [mode, setMode] = useState('signin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) return
    if (mode === 'signin') {
      await onSignIn(username, password)
    } else {
      await onSignUp(username, password)
    }
  }

  return (
    <main className="page" style={{ gridTemplateColumns: '1fr' }}>
      <div className="column">
        <BorderBox title="Login">
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error ? <div className="alert">{error}</div> : null}
            <div className="actions">
              <Button disabled={!username || !password} onClick={handleSubmit}>
                {mode === 'signin' ? 'Sign in' : 'Sign up'}
              </Button>
              <Button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
                {mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
              </Button>
            </div>
          </form>
        </BorderBox>
      </div>
    </main>
  )
}

Login.propTypes = {
  onSignIn: PropTypes.func.isRequired,
  onSignUp: PropTypes.func.isRequired,
  error: PropTypes.string,
}

export default Login


