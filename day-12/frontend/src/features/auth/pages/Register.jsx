import { Link } from 'react-router';
import '../styles/form.scss';
import axios from 'axios';
import { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")



  const formSubmitHandler = async (e) => {
    e.preventDefault();

    const data = {username, email, password};
    console.log(data);

    try{
        const res = await axios.post("http://localhost:3000/api/auth/register", data , {
            withCredentials: true
        });
        console.log(res.data);
        setError("");
    }catch(err){
        console.log(err);
        setError(err.response?.data?.message || "An error occurred");
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