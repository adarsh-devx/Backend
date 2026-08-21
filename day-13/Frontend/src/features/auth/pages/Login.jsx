import React from 'react';
import "../style/login.scss";
import FormGroup from '../components/FormGroup';

const Login = () => {
  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="card-header">
            <h1>Welcome Back</h1>
          </div>

          <form className="login-form">
            <FormGroup name="username" label="Username or Email" type="text" required />
            <FormGroup name="password" label="Password" type="password" required />

            <div className="form-actions">
              <div className="remember-me">
                <label className="checkbox-container">
                  <input type="checkbox" id="remember" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
              </div>
              <a href="/forgot-password" className="forgot-password-link">Forgot password?</a>
            </div>

            <button className="button submit-btn" type="submit">
              Sign In
            </button>
          </form>

          <div className="card-footer">
            <p>Don't have an account? <a href="/register" className="register-link">Create Account</a></p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;