import React from 'react'
import FormGroup from '../components/FormGroup'
import '../style/register.scss'

const Register = () => {
  return (
      <main className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="card-header">
            <h1>Create Account</h1>
          </div>

          <form className="register-form">
            <FormGroup name="username" label="Username" type="text" required />
            <FormGroup name="email" label="Email Address" type="email" required />
            <FormGroup name="password" label="Password" type="password" required />

            <button className="button submit-btn" type="submit">
              Create Account
            </button>
          </form>

          <div className="card-footer">
            <p>Already have an account? <a href="/login" className="login-link">Sign In</a></p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Register