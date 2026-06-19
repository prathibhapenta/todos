import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import './Login.css'
const API = process.env.REACT_APP_BASE_URL

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const navigate = useNavigate()
  const handleSubmit = async (e) => {
  e.preventDefault()

  setEmailError('')
  setPasswordError('')
 setShowForgotPassword(false)
  let hasError = false

  if (!email.trim()) {
    setEmailError('Email Required*')
    hasError = true
  }

  if (!password.trim()) {
    setPasswordError('Password Required*')
    hasError = true
  }

  if (hasError) {
    return
  }

  const response = await fetch(
    `${API}/todos/login`,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    }
  )

  const data = await response.json()

  if (response.ok) {
    localStorage.setItem('token',data.token)
    alert(data.message)
    navigate('/todos')
    console.log("Response Data:", data)
  } else {
    setPasswordError(data.message)
    setShowForgotPassword(true)
  }
}

 
  return (
    <div className="login-bg-container">
      <form className="login-form-container" onSubmit={handleSubmit}>
        <h1 className="login-heading">Login</h1>

        <input
          type="email"
          className="login-input"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
         {emailError && <p className="error-message">{emailError}</p>}
        <input
          type="password"
          className="login-input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p className="error-message">{passwordError}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
        {showForgotPassword && (
          <p onClick = {() => navigate('/forgot-password')}>Forgot Password</p>
        )}
       
      </form>
    </div>
  )
}

export default Login