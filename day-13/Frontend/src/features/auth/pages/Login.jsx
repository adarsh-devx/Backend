import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import "../style/login.scss";
import FormGroup from '../components/FormGroup';

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const loginPayload = { password };
      if (username.includes('@')) {
        loginPayload.email = username;
      } else {
        loginPayload.username = username;
      }

      const res = await handleLogin(loginPayload);
      toast.success(res?.message || "Logged in successfully!");
      navigate('/');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Invalid credentials';
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="card-header">
            <h1>Welcome Back</h1>
          </div>

          {error && (
            <div className="alert-message error-alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <FormGroup
              name="username"
              label="Username or Email"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
            <FormGroup
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />

            <div className="form-actions">
              <div className="remember-me">
                <label className="checkbox-container">
                  <input type="checkbox" id="remember" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
            </div>

            <button className={`button submit-btn ${loading ? 'loading' : ''}`} type="submit" disabled={loading}>
              Sign In
            </button>
          </form>

          <div className="card-footer">
            <p>Don't have an account? <Link to="/register" className="register-link">Create Account</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;