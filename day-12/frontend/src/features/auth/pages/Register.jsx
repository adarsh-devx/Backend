import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import '../styles/form.scss';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { handleRegister } = useAuth();

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      await handleRegister(username, email, password);
      setError("");
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    }
    
    setUsername('')
    setEmail('')
    setPassword('')
  }

  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={(e) => formSubmitHandler(e)}>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" name='username' placeholder='Choose username' required />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" name='email' placeholder='Email' required />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name='password' placeholder='Password' required /> 
                <button type='submit'>Register</button> 
            </form>

            <p>Already have an account? <Link className='toggleAuthForm' to="/login">Login</Link></p>
        </div>
    </main>
  )
}

export default Register;