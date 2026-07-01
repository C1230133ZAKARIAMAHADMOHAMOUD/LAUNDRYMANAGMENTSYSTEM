import React, { useState } from 'react'
import { loginUser } from '../api'

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!username.trim()) errs.username = 'Username is required!'
    if (!password.trim()) errs.password = 'Password is required!'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    setLoginError('')
    setLoading(true)

    try {
     const res = await loginUser({
  userName: username.trim(),
  password: password.trim()
      })

      // SUCCESS LOGIN
      onLogin(username.trim())
      localStorage.setItem("user", username.trim())

} catch (error) {
  console.error('LOGIN ERROR:', error.response?.status, error.response?.data, error.message)
  setLoginError(`❌ ${error.response?.data || error.message}`)
}
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-side">
          <div className="icon">🧺</div>
          <h2>Laundry Management System</h2>
          <p>Manage customers, services, orders, and payments—all in one place.</p>

          <ul>
            <li>👥 Easily manage customers</li>
            <li>📋 Track orders in real time</li>
            <li>💳 Record payments</li>
            <li>📊 Generate reports</li>
          </ul>
        </div>

        <div className="login-box">

          <div className="login-logo">
            <div className="icon">🔐</div>
            <h2>LOGIN</h2>
            <p>Enter username and password</p>
          </div>

          {loginError && (
            <div className="alert alert-danger">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setLoginError('')
                }}
              />
              {errors.username && (
                <small className="error-msg">{errors.username}</small>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setLoginError('')
                }}
              />
              {errors.password && (
                <small className="error-msg">{errors.password}</small>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>

        </div>

      </div>
    </div>
  )
}

export default LoginPage