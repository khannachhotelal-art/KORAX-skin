import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth, User } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginState } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const usersStr = localStorage.getItem('korax_users') || '[]';
      let users = [];
      try {
        users = JSON.parse(usersStr);
      } catch(e) {}
      
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        setError('Galat email ya password. Kripya check karein.');
        setLoading(false);
        return;
      }
      
      const sessionUser: User = {
        id: user.id,
        email: user.email,
        user_metadata: { username: user.user_metadata.username }
      };
      
      loginState(sessionUser);
      setLoading(false);
      navigate('/');
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
          <LogIn className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-2 text-white">Welcome Back</h2>
      <p className="text-center text-neutral-400 mb-8 text-sm">Sign in to your account.</p>
      
      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm">{error}</div>}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-neutral-600"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-neutral-600"
            placeholder="••••••••"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50 mt-4"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <div className="mt-8 text-center text-sm text-neutral-500">
        Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 hover:underline font-medium">Sign up</Link>
      </div>
    </div>
  );
}
