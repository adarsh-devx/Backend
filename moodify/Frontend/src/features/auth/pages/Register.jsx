import { useState } from "react";
import FormGroup from "../components/FormGroup";
import "../style/register.scss";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const Register = () => {
  const { loading, handleRegister } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await handleRegister({ username, email, password });
      toast.success(res?.message || "Registered successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      const errMsg =
        error.response?.data?.message || error.message || "Invalid credentials";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <main className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="card-header">
            <h1>Create Account</h1>
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

          <form className="register-form" onSubmit={(e) => handleSubmit(e)}>
            <FormGroup
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              label="Username"
              type="text"
              required
            />
            <FormGroup
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              label="Email Address"
              type="email"
              required
            />
            <FormGroup
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              label="Password"
              type="password"
              required
            />

            <button
              className={`button submit-btn ${loading ? "loading" : ""}`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="card-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
