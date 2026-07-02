import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6">
      <div className="glass p-10 rounded-3xl w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center mb-4">
            <Lock className="text-cyan-400" size={28} />
          </div>
          <h2 className="text-2xl font-bold">Admin Access</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-neutral-400 ml-1 group-focus-within:text-cyan-400 transition-colors">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400/50 focus:bg-neutral-900 transition-all"
              required
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-sm font-medium text-neutral-400 ml-1 group-focus-within:text-cyan-400 transition-colors">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400/50 focus:bg-neutral-900 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-neutral-200 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
