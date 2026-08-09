import { Link } from "react-router";
import "../styles/form.scss";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const{handleLogin} = useAuth()

  const handleSubmit =  (e) => {
    e.preventDefault();
     handleLogin(username, password).then(res => {
      console.log(res);
      
    })
    

    setUsername("");
    setPassword("");
  };

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            placeholder="Enter username"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            placeholder="Enter password"
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link className="toggleAuthForm" to="/register">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
