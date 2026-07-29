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
    <div className="fixed inset-0 bg-navy flex items-center justify-center z-[99999]">
      <div className="bg-white p-8 lg:p-10 w-[90%] max-w-[380px] shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <h1 className="font-serif text-xl text-navy text-center mb-1">Pluto Associates</h1>
        <p className="text-[0.65rem] text-gold text-center tracking-[2px] uppercase mb-6 lg:mb-8">Content Management System</p>
        {error && <div className="bg-red-50 text-accent-red p-3 text-xs mb-4 border-l-[3px] border-accent-red">Incorrect username or password.</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-navy mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-navy mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]"
            />
          </div>
          <button type="submit" className="w-full py-3.5 bg-wp-blue text-white border-none font-sans text-sm font-semibold cursor-pointer hover:bg-[#005a87]">Log In</button>
        </form>
        <p className="text-center text-[0.7rem] text-text-light mt-4">Enter your admin credentials to access the content management system.</p>
      </div>
    </div>
  );
}
