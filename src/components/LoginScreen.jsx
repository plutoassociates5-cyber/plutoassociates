import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <h1>Pluto Associates</h1>
        <p className="sub">Content Management System</p>
        {error && <div className="login-err">Incorrect username or password.</div>}
        <form onSubmit={handleSubmit}>
          <div className="lf">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="lf">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="login-btn">Log In</button>
        </form>
        <p className="login-hint">Enter your admin credentials to access the content management system.</p>
      </div>
    </div>
  );
}